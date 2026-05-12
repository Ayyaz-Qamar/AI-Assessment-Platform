"""
Leaderboard endpoints.

All aggregations use single grouped queries — no N+1 fan-outs.
"""
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Test, TestAttempt, User
from app.schemas import LeaderboardEntry
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/leaderboard", tags=["Leaderboard"])


def _build_leaderboard(query, current_user_id: int, limit: int = 10) -> List[dict]:
    """
    Execute an aggregation query that returns rows of
    (user_id, name, total_attempts, avg_score, best_score),
    and pack them into ranked LeaderboardEntry-shaped dicts.
    """
    rows = query.order_by(func.avg(TestAttempt.score).desc()).limit(limit).all()
    out: List[dict] = []
    for rank, row in enumerate(rows, start=1):
        user_id, name, total_attempts, avg_score, best_score = row
        out.append({
            "rank": rank,
            "user_id": user_id,
            "name": name,
            "total_attempts": int(total_attempts or 0),
            "avg_score": round(float(avg_score or 0), 2),
            "best_score": round(float(best_score or 0), 2),
            "competency_level": _level_from_score(float(avg_score or 0)),
            "is_you": user_id == current_user_id,
        })
    return out


def _level_from_score(score: float) -> str:
    if score >= 80:
        return "Expert"
    if score >= 50:
        return "Intermediate"
    return "Beginner"


@router.get("/global", response_model=List[LeaderboardEntry])
def global_leaderboard(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Top users across ALL tests, ranked by average score."""
    q = (
        db.query(
            User.id,
            User.name,
            func.count(TestAttempt.id).label("total"),
            func.avg(TestAttempt.score).label("avg_score"),
            func.max(TestAttempt.score).label("best_score"),
        )
        .join(TestAttempt, TestAttempt.user_id == User.id)
        .filter(TestAttempt.completed.is_(True))
        .group_by(User.id, User.name)
    )
    return _build_leaderboard(q, current_user.id, limit)


@router.get("/test/{test_id}", response_model=List[LeaderboardEntry])
def test_leaderboard(
    test_id: int,
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Top users for a specific test."""
    q = (
        db.query(
            User.id,
            User.name,
            func.count(TestAttempt.id).label("total"),
            func.avg(TestAttempt.score).label("avg_score"),
            func.max(TestAttempt.score).label("best_score"),
        )
        .join(TestAttempt, TestAttempt.user_id == User.id)
        .filter(
            TestAttempt.completed.is_(True),
            TestAttempt.test_id == test_id,
        )
        .group_by(User.id, User.name)
    )
    return _build_leaderboard(q, current_user.id, limit)


@router.get("/department/{category}", response_model=List[LeaderboardEntry])
def department_leaderboard(
    category: str,
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Top users in a department (matches Test.category)."""
    q = (
        db.query(
            User.id,
            User.name,
            func.count(TestAttempt.id).label("total"),
            func.avg(TestAttempt.score).label("avg_score"),
            func.max(TestAttempt.score).label("best_score"),
        )
        .join(TestAttempt, TestAttempt.user_id == User.id)
        .join(Test, TestAttempt.test_id == Test.id)
        .filter(
            TestAttempt.completed.is_(True),
            Test.category == category,
        )
        .group_by(User.id, User.name)
    )
    return _build_leaderboard(q, current_user.id, limit)


@router.get("/my-rank")
def my_rank(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Current user's global rank + nearby competitors."""
    # Compute everyone's avg_score then find my position
    rows = (
        db.query(
            User.id,
            func.avg(TestAttempt.score).label("avg_score"),
        )
        .join(TestAttempt, TestAttempt.user_id == User.id)
        .filter(TestAttempt.completed.is_(True))
        .group_by(User.id)
        .order_by(func.avg(TestAttempt.score).desc())
        .all()
    )
    total = len(rows)
    if total == 0:
        return {"rank": None, "total": 0, "avg_score": 0}

    my_rank_val = None
    my_score = 0
    for idx, (uid, avg) in enumerate(rows, start=1):
        if uid == current_user.id:
            my_rank_val = idx
            my_score = round(float(avg or 0), 2)
            break

    return {
        "rank": my_rank_val,
        "total": total,
        "avg_score": my_score,
    }
