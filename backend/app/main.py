"""
Single FastAPI application instance. No duplicates.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.models import RoleEnum, User
from app.routes import (
    admin, adaptive, ai_generator, auth, career, certificates,
    leaderboard, ml, profile, results, tests,
)
from app.utils.security import hash_password

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Adaptive Competency & Career Assessment Platform",
    description="Adaptive testing with ML-based competency prediction + AI question generation + career mapping.",
    version="1.3.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tests.router)
app.include_router(adaptive.router)
app.include_router(results.router)
app.include_router(admin.router)
app.include_router(ml.router)
app.include_router(leaderboard.router)
app.include_router(profile.router)
app.include_router(certificates.router)
app.include_router(ai_generator.router)
app.include_router(career.router)


@app.on_event("startup")
def seed_default_admin() -> None:
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if not existing:
            db.add(User(
                name="Admin",
                email=settings.ADMIN_EMAIL,
                password_hash=hash_password(settings.ADMIN_PASSWORD),
                role=RoleEnum.admin,
            ))
            db.commit()
            print(f"✅ Default admin created: {settings.ADMIN_EMAIL}")
    finally:
        db.close()


@app.get("/")
def root():
    return {
        "message": "AI Assessment Platform API",
        "docs": "/docs",
        "version": "1.3.0",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
