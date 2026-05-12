"""
Profile + Badges endpoints.
Badges are computed dynamically from attempt history (no DB table).
"""
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.ai.badges_engine import compute_user_badges
from app.database import get_db
from app.models import Test, TestAttempt, User
from app.schemas import UserStatsOut
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/profile", tags=["Profile & Badges"])


@router.get("/me", response_model=UserStatsOut)
def my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Aggregate stats in a single query
    stats = (
        db.query(
            func.count(TestAttempt.id),
            func.avg(TestAttempt.score),
            func.avg(TestAttempt.accuracy),
            func.max(TestAttempt.score),
        )
        .filter(
            TestAttempt.user_id == current_user.id,
            TestAttempt.completed.is_(True),
        )
        .one()
    )
    total, avg_score, avg_acc, best = stats

    # Distinct departments attempted
    dept_count = (
        db.query(func.count(func.distinct(Test.category)))
        .join(TestAttempt, TestAttempt.test_id == Test.id)
        .filter(
            TestAttempt.user_id == current_user.id,
            TestAttempt.completed.is_(True),
            Test.category.isnot(None),
        )
        .scalar()
    )

    badges, _ = compute_user_badges(db, current_user.id)

    return UserStatsOut(
        user=current_user,
        total_attempts=int(total or 0),
        avg_score=round(float(avg_score or 0), 2),
        avg_accuracy=round(float(avg_acc or 0), 2),
        best_score=round(float(best or 0), 2),
        departments_attempted=int(dept_count or 0),
        badges=badges,
    )


@router.get("/badges")
def my_badges(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    badges, _ = compute_user_badges(db, current_user.id)
    return {"badges": badges}
