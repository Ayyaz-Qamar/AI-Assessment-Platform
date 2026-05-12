from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.ai.recommendation import RecommendationEngine
from app.database import get_db
from app.models import Answer, RoleEnum, TestAttempt, User
from app.schemas import AttemptOut, ResultOut
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/results", tags=["Results & Analytics"])


@router.get("/me", response_model=List[AttemptOut])
def my_attempts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    attempts = (
        db.query(TestAttempt)
        .options(joinedload(TestAttempt.test))
        .filter(
            TestAttempt.user_id == current_user.id,
            TestAttempt.completed.is_(True),
        )
        .order_by(TestAttempt.completed_at.desc())
        .all()
    )
    result = []
    for a in attempts:
        out = AttemptOut.model_validate(a)
        out.test_title = a.test.title if a.test else None
        result.append(out)
    return result


@router.get("/{attempt_id}", response_model=ResultOut)
def get_result(
    attempt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    attempt = (
        db.query(TestAttempt)
        .options(joinedload(TestAttempt.answers))
        .filter(TestAttempt.id == attempt_id)
        .first()
    )
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    if attempt.user_id != current_user.id and current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Access denied")

    total = len(attempt.answers)
    correct = sum(1 for a in attempt.answers if a.is_correct)
    weak, recs = RecommendationEngine.analyze_weak_areas(db, attempt_id)

    avg_time_per_q = (attempt.attempt_time / total) if total > 0 else 0

    # Compute newly-earned badges by diffing user's earned set against
    # what they'd have without THIS attempt. Cheap heuristic: recompute
    # current full earned, and any badge whose earned_at == this attempt's
    # completed_at (or within a few seconds) is "newly earned".
    from app.ai.badges_engine import compute_user_badges
    _, earned_map = compute_user_badges(db, attempt.user_id)
    newly_earned = []
    if attempt.completed_at:
        for code, earned_at in earned_map.items():
            if earned_at and abs((earned_at - attempt.completed_at).total_seconds()) < 5:
                # Look up catalog details
                from app.ai.badges_engine import BADGE_CATALOG
                meta = next((b for b in BADGE_CATALOG if b[0] == code), None)
                if meta:
                    newly_earned.append({
                        "code": meta[0],
                        "name": meta[1],
                        "description": meta[2],
                        "icon": meta[3],
                        "earned": True,
                        "earned_at": earned_at,
                    })

    return ResultOut(
        attempt_id=attempt.id,
        score=attempt.score,
        accuracy=attempt.accuracy,
        total_questions=total,
        correct_answers=correct,
        competency_level=attempt.competency_level or "Unknown",
        predicted_level=attempt.predicted_level,
        avg_difficulty=attempt.avg_difficulty,
        attempt_time=attempt.attempt_time,
        avg_time_per_question=round(avg_time_per_q, 2),
        recommendations=recs,
        weak_areas=weak,
        newly_earned_badges=newly_earned,
    )


@router.get("/{attempt_id}/review")
def review_attempt(
    attempt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return per-question review for a completed attempt."""
    attempt = (
        db.query(TestAttempt)
        .options(joinedload(TestAttempt.answers).joinedload(Answer.question))
        .filter(TestAttempt.id == attempt_id)
        .first()
    )
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    if attempt.user_id != current_user.id and current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Access denied")

    items = []
    for idx, ans in enumerate(attempt.answers, start=1):
        q = ans.question
        items.append({
            "number": idx,
            "question_id": q.id,
            "text": q.text,
            "option_a": q.option_a,
            "option_b": q.option_b,
            "option_c": q.option_c,
            "option_d": q.option_d,
            "correct_option": q.correct_option,
            "selected_option": ans.selected_option,
            "is_correct": ans.is_correct,
            "timed_out": getattr(ans, "timed_out", False),
            "difficulty": q.difficulty.value,
            "time_taken": round(ans.time_taken or 0, 2),
        })
    return {"attempt_id": attempt.id, "items": items}


@router.get("/me/analytics")
def my_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    attempts = (
        db.query(TestAttempt)
        .filter(
            TestAttempt.user_id == current_user.id,
            TestAttempt.completed.is_(True),
        )
        .order_by(TestAttempt.completed_at.asc())
        .all()
    )

    if not attempts:
        return {
            "total_attempts": 0,
            "avg_score": 0,
            "avg_accuracy": 0,
            "level_distribution": {},
            "score_history": [],
        }

    avg_score = sum(a.score for a in attempts) / len(attempts)
    avg_acc = sum(a.accuracy for a in attempts) / len(attempts)

    dist = {}
    for a in attempts:
        lvl = a.competency_level or "Unknown"
        dist[lvl] = dist.get(lvl, 0) + 1

    history = [
        {
            "attempt_id": a.id,
            "score": a.score,
            "accuracy": a.accuracy,
            "level": a.competency_level,
            "date": a.completed_at.isoformat() if a.completed_at else None,
        }
        for a in attempts
    ]

    return {
        "total_attempts": len(attempts),
        "avg_score": round(avg_score, 2),
        "avg_accuracy": round(avg_acc, 2),
        "level_distribution": dist,
        "score_history": history,
    }
