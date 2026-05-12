"""
Badges Engine — computes earned badges dynamically from user attempt history.

No DB table needed: a "badge" is a deterministic predicate over a user's stats,
so we can re-derive the same set any time the stats are queried.

Each badge is a tuple of (code, name, description, icon, check_fn(stats) -> bool|datetime|None).
If check_fn returns a datetime → that's the earned_at timestamp.
If check_fn returns True → earned (no specific timestamp).
If False/None → not earned yet.
"""
from typing import List, Optional, Tuple
from datetime import datetime

from sqlalchemy.orm import Session, joinedload

from app.models import Answer, Test, TestAttempt


# ---------------- Badge definitions ----------------
# Each item: (code, name, description, icon)
BADGE_CATALOG = [
    ("first_steps", "First Steps", "Completed your very first test", "🌟"),
    ("perfect_score", "Perfectionist", "Scored 100% on a test", "💯"),
    ("expert_level", "Expert Achiever", "Reached Expert competency level", "🏆"),
    ("speed_demon", "Speed Demon", "Average <15 seconds per question in any test", "⚡"),
    ("five_tests", "Dedicated Learner", "Completed 5 tests", "🔥"),
    ("ten_tests", "Test Decathlete", "Completed 10 tests", "💪"),
    ("twenty_tests", "Marathon Mind", "Completed 20 tests", "🏃"),
    ("all_rounder", "All-Rounder", "Attempted every department category", "🎓"),
    ("improver", "Steady Improver", "Last 3 attempts each scored higher than previous", "📈"),
    ("high_accuracy", "Sharpshooter", "Maintained ≥80% accuracy across 3+ attempts", "🎯"),
    ("ai_specialist", "AI Specialist", "Reached Expert level in AI department", "🤖"),
    ("ds_specialist", "Data Wizard", "Reached Expert level in Data Science", "📊"),
    ("cs_specialist", "Algorithm Ace", "Reached Expert level in Computer Science", "🧮"),
    ("it_specialist", "Network Guru", "Reached Expert level in IT", "🌐"),
    ("cyber_specialist", "Cyber Defender", "Reached Expert level in Cyber Security", "🛡️"),
]


def _compute_earned(stats: dict, attempts: List[TestAttempt]) -> dict:
    """Returns dict: badge_code -> earned_at datetime (or None if not earned)."""
    earned: dict = {}

    if not attempts:
        return earned

    # Sort by completed_at to find "first" instances
    completed = [a for a in attempts if a.completed]
    completed_sorted = sorted(completed, key=lambda a: a.completed_at or a.started_at)
    total = len(completed_sorted)

    # ---- first_steps ----
    if total >= 1:
        earned["first_steps"] = completed_sorted[0].completed_at or completed_sorted[0].started_at

    # ---- perfect_score ----
    for a in completed_sorted:
        if a.score and a.score >= 100.0:
            earned["perfect_score"] = a.completed_at or a.started_at
            break

    # ---- expert_level ----
    for a in completed_sorted:
        if (a.competency_level or "").lower() == "expert":
            earned["expert_level"] = a.completed_at or a.started_at
            break

    # ---- speed_demon: any attempt with avg time per Q < 15s ----
    for a in completed_sorted:
        q_count = len(a.answers) if a.answers else 0
        if q_count > 0 and a.attempt_time and (a.attempt_time / q_count) < 15:
            earned["speed_demon"] = a.completed_at or a.started_at
            break

    # ---- attempt-count milestones ----
    if total >= 5:
        earned["five_tests"] = completed_sorted[4].completed_at or completed_sorted[4].started_at
    if total >= 10:
        earned["ten_tests"] = completed_sorted[9].completed_at or completed_sorted[9].started_at
    if total >= 20:
        earned["twenty_tests"] = completed_sorted[19].completed_at or completed_sorted[19].started_at

    # ---- all_rounder: at least 5 distinct categories ----
    cats = set()
    last_unique_at = None
    target_cats = {"AI", "Data Science", "CS", "IT", "Cyber Security"}
    for a in completed_sorted:
        c = a.test.category if a.test else None
        if c and c not in cats:
            cats.add(c)
            if cats >= target_cats or len(cats) >= 5:
                last_unique_at = a.completed_at or a.started_at
                break
    if last_unique_at:
        earned["all_rounder"] = last_unique_at

    # ---- improver: last 3 scores strictly increasing ----
    if len(completed_sorted) >= 3:
        last3 = completed_sorted[-3:]
        scores = [(a.score or 0) for a in last3]
        if scores[0] < scores[1] < scores[2]:
            earned["improver"] = last3[-1].completed_at or last3[-1].started_at

    # ---- high_accuracy: any 3+ attempts ALL ≥ 80% accuracy ----
    high_acc = [a for a in completed_sorted if (a.accuracy or 0) >= 80]
    if len(high_acc) >= 3:
        earned["high_accuracy"] = high_acc[2].completed_at or high_acc[2].started_at

    # ---- department specialists: Expert level in specific category ----
    dept_map = {
        "AI": "ai_specialist",
        "Data Science": "ds_specialist",
        "CS": "cs_specialist",
        "IT": "it_specialist",
        "Cyber Security": "cyber_specialist",
    }
    for a in completed_sorted:
        if a.test and (a.competency_level or "").lower() == "expert":
            code = dept_map.get(a.test.category)
            if code and code not in earned:
                earned[code] = a.completed_at or a.started_at

    return earned


def compute_user_badges(db: Session, user_id: int) -> Tuple[List[dict], dict]:
    """
    Returns:
      - full_badges_list: List of dicts (code, name, description, icon, earned, earned_at)
      - earned_map: {badge_code: earned_at_datetime} for diffing newly-earned
    """
    attempts = (
        db.query(TestAttempt)
        .options(
            joinedload(TestAttempt.test),
            joinedload(TestAttempt.answers),
        )
        .filter(TestAttempt.user_id == user_id, TestAttempt.completed.is_(True))
        .all()
    )

    earned_map = _compute_earned({}, attempts)

    out: List[dict] = []
    for code, name, desc, icon in BADGE_CATALOG:
        earned_at = earned_map.get(code)
        out.append({
            "code": code,
            "name": name,
            "description": desc,
            "icon": icon,
            "earned": earned_at is not None,
            "earned_at": earned_at,
        })
    return out, earned_map


def newly_earned_badges(before: dict, after: dict) -> List[dict]:
    """
    Compare two earned_maps. Returns the list of full badge dicts that are
    NEW in 'after' (i.e. were not in 'before').
    """
    new_codes = set(after.keys()) - set(before.keys())
    if not new_codes:
        return []
    catalog_by_code = {c[0]: c for c in BADGE_CATALOG}
    out: List[dict] = []
    for code in new_codes:
        if code not in catalog_by_code:
            continue
        _, name, desc, icon = catalog_by_code[code]
        out.append({
            "code": code,
            "name": name,
            "description": desc,
            "icon": icon,
            "earned": True,
            "earned_at": after[code],
        })
    return out
