"""Career recommendation endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.ai.career_mapper import compute_career_matches
from app.database import get_db
from app.models import User
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/career", tags=["Career Mapping"])


@router.get("/me")
def my_career_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return compute_career_matches(db, current_user.id, top_n=5)


@router.get("/me/top3")
def top_3_careers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Lightweight version for dashboard preview."""
    full = compute_career_matches(db, current_user.id, top_n=3)
    if not full.get("ready"):
        return full
    return {
        "ready": True,
        "matches": full["matches"],
    }
