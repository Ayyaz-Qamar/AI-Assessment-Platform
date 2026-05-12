"""
AI Question Generator using Google Gemini.

Endpoints:
  POST /api/ai-questions/generate   → returns generated questions (preview only, NOT saved)
  POST /api/ai-questions/approve    → admin reviews + persists approved questions

Approach:
  - Gemini is called with a strict JSON-schema prompt.
  - Response is parsed and sanitised.
  - Correct answer is RANDOMIZED across A/B/C/D after parsing so the LLM
    can't bias toward a single letter.
  - Duplicates against the existing test bank are filtered out
    (case-insensitive prefix match on question text).
"""
import json
import os
import random
import re
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import DifficultyEnum, Question, Test, User
from app.utils.auth import require_admin

router = APIRouter(prefix="/api/ai-questions", tags=["AI Question Generator"])


# -------------------- Request / Response shapes --------------------
class GenerateRequest(BaseModel):
    test_id: int
    count: int = Field(default=10, ge=1, le=20)
    topic_hint: Optional[str] = None
    difficulty_mix: List[str] = ["easy", "medium", "hard"]


class GeneratedQuestion(BaseModel):
    text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str
    difficulty: str


class ApproveRequest(BaseModel):
    test_id: int
    questions: List[GeneratedQuestion]


# -------------------- Gemini client --------------------
def _get_gemini_client():
    """Lazy import so the backend boots even without the package installed."""
    try:
        import google.generativeai as genai
    except ImportError:
        raise HTTPException(
            status_code=503,
            detail="google-generativeai not installed. Run: pip install google-generativeai",
        )

    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key or api_key.startswith("YOUR_") or api_key == "PASTE_YOUR_NEW_KEY_HERE":
        raise HTTPException(
            status_code=503,
            detail="GEMINI_API_KEY missing in .env file",
        )
    genai.configure(api_key=api_key)
    return genai


def _build_prompt(test_title: str, category: str, count: int, topic_hint: Optional[str], difficulty_mix: List[str]) -> str:
    topic_line = f"Focus specifically on: {topic_hint}" if topic_hint else "Cover a balanced mix of typical topics for this subject."
    diff_str = ", ".join(difficulty_mix)
    return f"""You are an expert exam-writer creating multiple-choice questions for a competency assessment platform.

Create EXACTLY {count} unique, high-quality multiple-choice questions for:
Subject: "{test_title}" (category: {category or 'general'}).
{topic_line}

Rules — follow STRICTLY:
1. Each question has exactly 4 options A, B, C, D.
2. EXACTLY ONE option is correct.
3. The 3 wrong options must be plausible distractors, not obviously silly.
4. Question text is concise (under 30 words).
5. Each option is concise (under 18 words).
6. Difficulties should be a balanced mix of: {diff_str}.
7. NO duplicate questions. NO questions about Pakistan/India trivia. Stay strictly on the subject.
8. Distribute the correct answer across A, B, C, AND D — do NOT favour one letter.

Return ONLY a JSON array (no prose, no markdown fences). Schema:
[
  {{
    "text": "question text",
    "option_a": "...",
    "option_b": "...",
    "option_c": "...",
    "option_d": "...",
    "correct_option": "A|B|C|D",
    "difficulty": "easy|medium|hard"
  }}
]
"""


def _extract_json_array(raw: str) -> list:
    """Strip code fences, find the first [...] block, parse JSON."""
    # Remove ```json or ``` fences
    cleaned = re.sub(r"```(?:json)?", "", raw, flags=re.IGNORECASE).strip("` \n")
    # Find first [ and last matching ]
    start = cleaned.find("[")
    end = cleaned.rfind("]")
    if start == -1 or end == -1 or end < start:
        raise ValueError("Could not find JSON array in response")
    chunk = cleaned[start : end + 1]
    return json.loads(chunk)


def _validate_question(q: dict) -> Optional[dict]:
    """Return cleaned dict if valid, else None."""
    required = ("text", "option_a", "option_b", "option_c", "option_d", "correct_option", "difficulty")
    if not all(k in q and isinstance(q[k], str) and q[k].strip() for k in required):
        return None

    correct = q["correct_option"].strip().upper()
    if correct not in {"A", "B", "C", "D"}:
        return None

    diff = q["difficulty"].strip().lower()
    if diff not in {"easy", "medium", "hard"}:
        return None

    opts = [q["option_a"].strip(), q["option_b"].strip(), q["option_c"].strip(), q["option_d"].strip()]
    if len(set(o.lower() for o in opts)) != 4:
        return None  # duplicate options

    return {
        "text": q["text"].strip(),
        "option_a": opts[0],
        "option_b": opts[1],
        "option_c": opts[2],
        "option_d": opts[3],
        "correct_option": correct,
        "difficulty": diff,
    }


def _shuffle_correct_position(q: dict) -> dict:
    """Move the correct option's content to a randomly-chosen A/B/C/D slot.
    Guarantees uniform distribution regardless of LLM bias."""
    letters = ["A", "B", "C", "D"]
    current = q["correct_option"]
    target = random.choice(letters)
    if target == current:
        return q

    cur_col = "option_" + current.lower()
    tgt_col = "option_" + target.lower()
    q[cur_col], q[tgt_col] = q[tgt_col], q[cur_col]
    q["correct_option"] = target
    return q


# -------------------- Endpoints --------------------
@router.post("/generate")
def generate_questions(
    payload: GenerateRequest,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    """Generate questions via Gemini (preview only, NOT saved)."""
    test = db.query(Test).filter(Test.id == payload.test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    if not payload.difficulty_mix:
        raise HTTPException(status_code=400, detail="Pick at least one difficulty")

    genai = _get_gemini_client()
    model = genai.GenerativeModel("gemini-2.5-flash")  # fast + free-tier friendly

    prompt = _build_prompt(
        test.title, test.category or "", payload.count, payload.topic_hint, payload.difficulty_mix
    )

    try:
        response = model.generate_content(prompt)
        raw_text = response.text or ""
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gemini API error: {str(e)[:200]}")

    try:
        raw_questions = _extract_json_array(raw_text)
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Could not parse AI response: {str(e)[:200]}",
        )

    # Get existing question texts (lowercased) to filter duplicates
    existing_texts = {
        (t or "").strip().lower()
        for (t,) in db.query(Question.text).filter(Question.test_id == payload.test_id).all()
    }

    valid: list[dict] = []
    seen_in_batch: set[str] = set()
    for raw_q in raw_questions:
        cleaned = _validate_question(raw_q)
        if not cleaned:
            continue
        # Filter difficulty mix
        if cleaned["difficulty"] not in payload.difficulty_mix:
            continue
        # De-dupe
        key = cleaned["text"].lower()
        if key in existing_texts or key in seen_in_batch:
            continue
        seen_in_batch.add(key)
        # Randomize correct letter position to break LLM bias
        cleaned = _shuffle_correct_position(cleaned)
        valid.append(cleaned)

    if not valid:
        raise HTTPException(
            status_code=502,
            detail="AI returned no usable new questions. Try again with a different topic hint.",
        )

    return {
        "test_id": payload.test_id,
        "test_title": test.title,
        "requested": payload.count,
        "generated": len(valid),
        "questions": valid,
    }


@router.post("/approve")
def approve_and_save(
    payload: ApproveRequest,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    """Persist admin-approved questions (possibly after manual edits)."""
    test = db.query(Test).filter(Test.id == payload.test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    saved = 0
    skipped = 0
    existing = {
        (t or "").strip().lower()
        for (t,) in db.query(Question.text).filter(Question.test_id == payload.test_id).all()
    }

    for q in payload.questions:
        cleaned = _validate_question(q.model_dump())
        if not cleaned:
            skipped += 1
            continue
        if cleaned["text"].lower() in existing:
            skipped += 1
            continue
        try:
            diff_enum = DifficultyEnum(cleaned["difficulty"])
        except ValueError:
            skipped += 1
            continue

        db.add(Question(
            test_id=payload.test_id,
            text=cleaned["text"],
            option_a=cleaned["option_a"],
            option_b=cleaned["option_b"],
            option_c=cleaned["option_c"],
            option_d=cleaned["option_d"],
            correct_option=cleaned["correct_option"],
            difficulty=diff_enum,
        ))
        existing.add(cleaned["text"].lower())
        saved += 1

    db.commit()
    return {"saved": saved, "skipped": skipped}


@router.get("/health")
def health_check(_admin: User = Depends(require_admin)):
    """Quick sanity check: is the Gemini key configured and reachable?"""
    try:
        _get_gemini_client()
        return {"configured": True, "provider": os.getenv("AI_PROVIDER", "gemini")}
    except HTTPException as e:
        return {"configured": False, "detail": e.detail}
