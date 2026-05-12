"""
Career mapping engine.

Maps a user's per-category performance onto suggested careers using
weighted skill profiles.

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
    # ---------- IT / Tech careers ----------
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

    # ---------- Civil Engineering careers ----------
    {
        "code": "structural_engineer",
        "name": "Structural Engineer",
        "icon": "🏗️",
        "tagline": "Design safe and durable buildings and infrastructure.",
        "profile": {"Civil Engineering": 1.0, "Electrical Engineering": 0.1, "CS": 0.1, "IT": 0.0},
        "skills_strong": ["Mechanics", "Structural analysis", "AutoCAD"],
        "skills_learn": ["ETABS / SAP2000", "Seismic design", "BIM"],
        "salary_range": "$60k–$120k",
    },
    {
        "code": "construction_manager",
        "name": "Construction Manager",
        "icon": "🚧",
        "tagline": "Lead construction projects from planning to delivery.",
        "profile": {"Civil Engineering": 0.9, "IT": 0.2, "Electrical Engineering": 0.2},
        "skills_strong": ["Project planning", "Cost estimation", "Site management"],
        "skills_learn": ["MS Project / Primavera", "Contract law", "Quality control"],
        "salary_range": "$65k–$130k",
    },
    {
        "code": "urban_planner",
        "name": "Urban Planner",
        "icon": "🏛️",
        "tagline": "Shape cities and communities for the future.",
        "profile": {"Civil Engineering": 0.8, "Data Science": 0.3, "IT": 0.2},
        "skills_strong": ["Land-use planning", "GIS", "Public policy"],
        "skills_learn": ["Sustainability", "Transport planning", "Stakeholder engagement"],
        "salary_range": "$55k–$100k",
    },
    {
        "code": "transportation_engineer",
        "name": "Transportation Engineer",
        "icon": "🛣️",
        "tagline": "Design roads, highways and transit systems.",
        "profile": {"Civil Engineering": 0.9, "Data Science": 0.3, "Electrical Engineering": 0.2},
        "skills_strong": ["Traffic analysis", "Highway design", "Surveying"],
        "skills_learn": ["Smart transport systems", "Simulation tools", "Safety engineering"],
        "salary_range": "$60k–$115k",
    },

    # ---------- Electrical Engineering careers ----------
    {
        "code": "power_engineer",
        "name": "Power Systems Engineer",
        "icon": "⚡",
        "tagline": "Design and operate the electrical grids that power society.",
        "profile": {"Electrical Engineering": 1.0, "CS": 0.2, "IT": 0.3, "Civil Engineering": 0.2},
        "skills_strong": ["Circuit analysis", "Power generation", "Transmission"],
        "skills_learn": ["Renewable integration", "MATLAB/Simulink", "Grid automation"],
        "salary_range": "$70k–$140k",
    },
    {
        "code": "embedded_engineer",
        "name": "Embedded Systems Engineer",
        "icon": "🔌",
        "tagline": "Build smart hardware-software systems for IoT, automotive and more.",
        "profile": {"Electrical Engineering": 0.9, "CS": 0.7, "IT": 0.3, "AI": 0.2},
        "skills_strong": ["C / C++", "Microcontrollers", "Digital logic"],
        "skills_learn": ["RTOS", "PCB design", "ARM Cortex"],
        "salary_range": "$70k–$140k",
    },
    {
        "code": "robotics_engineer",
        "name": "Robotics Engineer",
        "icon": "🤖",
        "tagline": "Build intelligent machines that perceive and act.",
        "profile": {"Electrical Engineering": 0.8, "CS": 0.6, "AI": 0.7, "Civil Engineering": 0.1},
        "skills_strong": ["Control systems", "Sensors", "Programming"],
        "skills_learn": ["ROS", "Computer Vision", "Path planning"],
        "salary_range": "$80k–$160k",
    },
    {
        "code": "electronics_engineer",
        "name": "Electronics Engineer",
        "icon": "🔋",
        "tagline": "Design the circuits behind every modern device.",
        "profile": {"Electrical Engineering": 1.0, "CS": 0.3, "IT": 0.2},
        "skills_strong": ["Analog/Digital circuits", "Schematic design", "Signal processing"],
        "skills_learn": ["VLSI", "FPGA", "EMC/EMI"],
        "salary_range": "$65k–$130k",
    },

    # ---------- Islamic Studies careers ----------
    {
        "code": "islamic_scholar",
        "name": "Islamic Scholar / Researcher",
        "icon": "📚",
        "tagline": "Study, interpret and contribute to Islamic knowledge.",
        "profile": {"Islamic Studies": 1.0, "Data Science": 0.1, "CS": 0.0},
        "skills_strong": ["Quran & Hadith", "Arabic", "Critical thinking"],
        "skills_learn": ["Comparative religion", "Modern Tafsir", "Academic writing"],
        "salary_range": "$40k–$90k",
    },
    {
        "code": "islamic_educator",
        "name": "Islamic Studies Educator",
        "icon": "🕌",
        "tagline": "Teach Islamic principles and inspire the next generation.",
        "profile": {"Islamic Studies": 0.95, "Data Science": 0.0, "CS": 0.0},
        "skills_strong": ["Quran recitation", "Pedagogy", "Communication"],
        "skills_learn": ["Curriculum design", "Online teaching", "Youth engagement"],
        "salary_range": "$35k–$80k",
    },
    {
        "code": "islamic_content_writer",
        "name": "Islamic Content Writer",
        "icon": "✍️",
        "tagline": "Communicate Islamic ideas to a wider audience.",
        "profile": {"Islamic Studies": 0.9, "IT": 0.2, "Data Science": 0.1},
        "skills_strong": ["Writing", "Research", "Arabic / Quranic knowledge"],
        "skills_learn": ["SEO", "Social media", "Editing"],
        "salary_range": "$35k–$75k",
    },
    {
        "code": "shariah_advisor",
        "name": "Shariah Advisor / Islamic Finance",
        "icon": "💼",
        "tagline": "Advise institutions on Shariah-compliant operations and finance.",
        "profile": {"Islamic Studies": 0.9, "Data Science": 0.3, "CS": 0.1},
        "skills_strong": ["Fiqh of transactions", "Islamic law", "Analysis"],
        "skills_learn": ["Islamic banking", "Audit", "Regulatory frameworks"],
        "salary_range": "$60k–$150k",
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
                continue
            score_sum += weight * user_avg
            contributing_cats.append((cat, weight, user_avg))

        actual_weight_sum = sum(w for _, w, _ in contributing_cats)
        if actual_weight_sum <= 0:
            continue

        match_pct = score_sum / actual_weight_sum

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
