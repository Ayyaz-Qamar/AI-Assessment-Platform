"""
Career mapping engine.

Maps a user's per-category performance (avg score in AI, Data Science, CS, IT,
Cyber Security) onto suggested careers using weighted skill profiles.

Each career has a 'profile' dict: {category_name: weight (0..1)}.
We score the career by:
    career_score = sum(profile[cat] * user_avg[cat]) / sum(profile[cat])

Top careers are returned with explanations.
"""
from typing import Dict, List

from sqlalchemy.orm import Session

from app.models import Test, TestAttempt

# ---------- Career catalog ----------
# Profile values 0-1 indicate how strongly each category contributes.
CAREERS = [
    {
        "code": "ml_engineer",
        "name": "Machine Learning Engineer",
        "icon": "🤖",
        "tagline": "Design, train and deploy AI models in production.",
        "profile": {"AI": 1.0, "Data Science": 0.9, "CS": 0.7, "IT": 0.3, "Cyber Security": 0.1},
        "skills_strong": ["Python", "Deep Learning", "Algorithm Design"],
        "skills_learn": ["MLOps", "Cloud (AWS/GCP)", "Model Optimization"],
        "salary_range": "$80k–$160k",
    },
    {
        "code": "data_scientist",
        "name": "Data Scientist",
        "icon": "📊",
        "tagline": "Extract insights and predictions from data.",
        "profile": {"Data Science": 1.0, "AI": 0.7, "CS": 0.5, "IT": 0.3, "Cyber Security": 0.0},
        "skills_strong": ["Statistics", "Pandas/NumPy", "Visualization"],
        "skills_learn": ["SQL", "A/B Testing", "Domain knowledge"],
        "salary_range": "$70k–$140k",
    },
    {
        "code": "data_analyst",
        "name": "Data Analyst",
        "icon": "📈",
        "tagline": "Turn raw data into business decisions.",
        "profile": {"Data Science": 0.9, "IT": 0.4, "CS": 0.3, "AI": 0.3, "Cyber Security": 0.0},
        "skills_strong": ["Excel", "Power BI / Tableau", "SQL"],
        "skills_learn": ["Python", "Stats", "Storytelling with data"],
        "salary_range": "$55k–$95k",
    },
    {
        "code": "software_engineer",
        "name": "Software Engineer",
        "icon": "💻",
        "tagline": "Build robust, scalable software systems.",
        "profile": {"CS": 1.0, "IT": 0.6, "Cyber Security": 0.3, "Data Science": 0.2, "AI": 0.2},
        "skills_strong": ["Algorithms", "OOP", "Data Structures"],
        "skills_learn": ["System Design", "Frameworks", "Testing"],
        "salary_range": "$70k–$150k",
    },
    {
        "code": "backend_dev",
        "name": "Backend Developer",
        "icon": "⚙️",
        "tagline": "Build the APIs and systems that power apps.",
        "profile": {"CS": 0.9, "IT": 0.8, "Cyber Security": 0.4, "Data Science": 0.1, "AI": 0.1},
        "skills_strong": ["Databases", "APIs", "Algorithms"],
        "skills_learn": ["Docker", "Microservices", "Caching"],
        "salary_range": "$65k–$135k",
    },
    {
        "code": "devops_engineer",
        "name": "DevOps / Cloud Engineer",
        "icon": "☁️",
        "tagline": "Automate, scale and secure software delivery.",
        "profile": {"IT": 1.0, "CS": 0.7, "Cyber Security": 0.5, "Data Science": 0.1, "AI": 0.0},
        "skills_strong": ["Linux", "Networking", "Cloud platforms"],
        "skills_learn": ["Kubernetes", "Terraform", "CI/CD"],
        "salary_range": "$80k–$160k",
    },
    {
        "code": "cybersec_analyst",
        "name": "Cybersecurity Analyst",
        "icon": "🛡️",
        "tagline": "Defend systems against attacks and threats.",
        "profile": {"Cyber Security": 1.0, "IT": 0.7, "CS": 0.5, "Data Science": 0.1, "AI": 0.1},
        "skills_strong": ["Networking", "Threat analysis", "Security tools"],
        "skills_learn": ["Penetration testing", "SIEM", "Forensics"],
        "salary_range": "$70k–$130k",
    },
    {
        "code": "pentester",
        "name": "Penetration Tester",
        "icon": "🕵️",
        "tagline": "Ethically hack systems to find weaknesses.",
        "profile": {"Cyber Security": 1.0, "CS": 0.6, "IT": 0.7, "Data Science": 0.0, "AI": 0.1},
        "skills_strong": ["Exploits", "Linux", "Scripting"],
        "skills_learn": ["Web app security", "Mobile security", "Red teaming"],
        "salary_range": "$75k–$140k",
    },
    {
        "code": "ai_researcher",
        "name": "AI Research Scientist",
        "icon": "🧠",
        "tagline": "Push the frontier of AI through research.",
        "profile": {"AI": 1.0, "Data Science": 0.8, "CS": 0.8, "IT": 0.1, "Cyber Security": 0.0},
        "skills_strong": ["Math", "Deep Learning", "Research"],
        "skills_learn": ["Paper writing", "Specialized models", "Latest frameworks"],
        "salary_range": "$100k–$220k",
    },
    {
        "code": "fullstack_dev",
        "name": "Full-Stack Developer",
        "icon": "🛠️",
        "tagline": "Build complete web apps front-to-back.",
        "profile": {"CS": 0.8, "IT": 0.7, "Cyber Security": 0.3, "Data Science": 0.2, "AI": 0.2},
        "skills_strong": ["JavaScript", "HTML/CSS", "Databases"],
        "skills_learn": ["React/Vue", "Backend frameworks", "Deployment"],
        "salary_range": "$60k–$130k",
    },
]


def _get_user_category_scores(db: Session, user_id: int) -> Dict[str, float]:
    """Return {category: avg_score} for completed attempts of this user."""
    rows = (
        db.query(Test.category, TestAttempt.score)
        .join(TestAttempt, TestAttempt.test_id == Test.id)
        .filter(
            TestAttempt.user_id == user_id,
            TestAttempt.completed.is_(True),
            Test.category.isnot(None),
        )
        .all()
    )
    buckets: Dict[str, List[float]] = {}
    for category, score in rows:
        if category is None:
            continue
        buckets.setdefault(category, []).append(float(score or 0))
    return {cat: sum(scores) / len(scores) for cat, scores in buckets.items()}


def compute_career_matches(db: Session, user_id: int, top_n: int = 5) -> dict:
    """Rank careers by weighted score against the user's per-category averages."""
    cat_scores = _get_user_category_scores(db, user_id)

    if not cat_scores:
        return {
            "ready": False,
            "message": "Complete at least one test to see career suggestions.",
            "matches": [],
            "category_scores": {},
        }

    results = []
    for career in CAREERS:
        profile = career["profile"]
        weight_sum = sum(profile.values())
        if weight_sum <= 0:
            continue

        score_sum = 0.0
        contributing_cats = []
        for cat, weight in profile.items():
            user_avg = cat_scores.get(cat)
            if user_avg is None:
                # Missing category for this user — treat as 0 for fairness
                continue
            score_sum += weight * user_avg
            contributing_cats.append((cat, weight, user_avg))

        # Use the user's actual category weight sum so unattempted categories
        # don't artificially shrink the match — only judge on what we know.
        actual_weight_sum = sum(w for _, w, _ in contributing_cats)
        if actual_weight_sum <= 0:
            continue

        match_pct = score_sum / actual_weight_sum

        # Tier label
        if match_pct >= 85:
            tier = "Excellent Match"
        elif match_pct >= 70:
            tier = "Strong Match"
        elif match_pct >= 55:
            tier = "Good Match"
        else:
            tier = "Possible Match"

        results.append({
            "code": career["code"],
            "name": career["name"],
            "icon": career["icon"],
            "tagline": career["tagline"],
            "match_pct": round(match_pct, 1),
            "tier": tier,
            "skills_strong": career["skills_strong"],
            "skills_learn": career["skills_learn"],
            "salary_range": career["salary_range"],
        })

    results.sort(key=lambda r: r["match_pct"], reverse=True)
    top = results[:top_n]

    # Identify user's strongest and weakest categories for narrative
    sorted_cats = sorted(cat_scores.items(), key=lambda x: x[1], reverse=True)
    strongest = sorted_cats[0] if sorted_cats else None
    weakest = sorted_cats[-1] if len(sorted_cats) > 1 else None

    return {
        "ready": True,
        "matches": top,
        "category_scores": {k: round(v, 1) for k, v in cat_scores.items()},
        "strongest_area": {"category": strongest[0], "avg_score": round(strongest[1], 1)} if strongest else None,
        "weakest_area": {"category": weakest[0], "avg_score": round(weakest[1], 1)} if weakest else None,
    }
