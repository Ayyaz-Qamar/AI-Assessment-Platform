"""
PDF Certificate generation endpoint.

Awarded only when the user reached Expert level on a completed attempt.
Generated on-demand with ReportLab — no storage, no DB row needed.
"""
import hashlib
import io
from datetime import datetime

import qrcode
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from reportlab.lib import colors
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import RoleEnum, TestAttempt, User
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/certificates", tags=["Certificates"])


def _certificate_id(attempt_id: int, user_id: int) -> str:
    """Deterministic short ID derived from attempt+user — easy to verify later."""
    raw = f"cert-{attempt_id}-{user_id}".encode()
    digest = hashlib.sha256(raw).hexdigest()[:10].upper()
    return f"AAP-{digest}"


def _build_certificate_pdf(
    user_name: str,
    test_title: str,
    score: float,
    competency_level: str,
    accuracy: float,
    completed_at: datetime,
    cert_id: str,
) -> bytes:
    """Returns the PDF bytes."""
    buf = io.BytesIO()
    width, height = landscape(A4)
    c = canvas.Canvas(buf, pagesize=landscape(A4))

    # ----- Background gradient (simulated with stacked thin rects) -----
    # Top to bottom: deep blue -> purple -> pink
    steps = 90
    for i in range(steps):
        t = i / steps
        # interpolate between (37, 99, 235) blue and (236, 72, 153) pink via purple
        r = int(37 + (236 - 37) * t)
        g = int(99 + (72 - 99) * t)
        b = int(235 + (153 - 235) * t)
        c.setFillColorRGB(r / 255, g / 255, b / 255)
        c.rect(0, height * (1 - (i + 1) / steps), width, height / steps + 1, fill=1, stroke=0)

    # ----- White inner card -----
    margin = 1.2 * cm
    c.setFillColor(colors.white)
    c.setStrokeColor(colors.white)
    c.roundRect(margin, margin, width - 2 * margin, height - 2 * margin, 16, fill=1, stroke=0)

    # ----- Outer gold border -----
    c.setStrokeColor(colors.HexColor("#d4af37"))
    c.setLineWidth(3)
    c.roundRect(margin + 6, margin + 6, width - 2 * margin - 12, height - 2 * margin - 12, 12, fill=0, stroke=1)

    # Decorative inner thin border
    c.setLineWidth(0.6)
    c.setStrokeColor(colors.HexColor("#cbd5e1"))
    c.roundRect(margin + 18, margin + 18, width - 2 * margin - 36, height - 2 * margin - 36, 8, fill=0, stroke=1)

    # ----- Top emoji + title -----
    center_x = width / 2

    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(colors.HexColor("#6366f1"))
    c.drawCentredString(center_x, height - 2.6 * cm, "AssessAI · AI-Based Adaptive Competency Platform")

    c.setFont("Helvetica-Bold", 38)
    c.setFillColor(colors.HexColor("#0f172a"))
    c.drawCentredString(center_x, height - 4.4 * cm, "Certificate of Achievement")

    # Underline gradient line
    c.setStrokeColor(colors.HexColor("#a855f7"))
    c.setLineWidth(2)
    c.line(width / 2 - 5 * cm, height - 4.7 * cm, width / 2 + 5 * cm, height - 4.7 * cm)

    # ----- Body -----
    c.setFont("Helvetica", 14)
    c.setFillColor(colors.HexColor("#475569"))
    c.drawCentredString(center_x, height - 5.6 * cm, "This certificate is proudly presented to")

    # Recipient name (large gradient-feel via dark navy)
    c.setFont("Helvetica-Bold", 32)
    c.setFillColor(colors.HexColor("#1e293b"))
    c.drawCentredString(center_x, height - 7.0 * cm, user_name)

    # Thin line under name
    name_width = c.stringWidth(user_name, "Helvetica-Bold", 32)
    c.setStrokeColor(colors.HexColor("#94a3b8"))
    c.setLineWidth(0.8)
    c.line(
        center_x - name_width / 2 - 10,
        height - 7.25 * cm,
        center_x + name_width / 2 + 10,
        height - 7.25 * cm,
    )

    # Achievement statement
    c.setFont("Helvetica", 13)
    c.setFillColor(colors.HexColor("#475569"))
    line1 = "for successfully demonstrating EXPERT-level competency in the"
    line2 = f'"{test_title}" adaptive assessment'
    c.drawCentredString(center_x, height - 8.5 * cm, line1)
    c.setFont("Helvetica-Oblique", 13)
    c.drawCentredString(center_x, height - 9.1 * cm, line2)

    # ----- Stats row -----
    stats_y = height - 11.0 * cm
    block_w = 5 * cm
    blocks = [
        ("Score", f"{score:.1f}%", "#3b82f6"),
        ("Accuracy", f"{accuracy:.1f}%", "#10b981"),
        ("Level", competency_level, "#a855f7"),
    ]
    total_w = block_w * len(blocks)
    start_x = (width - total_w) / 2

    for i, (label, value, hex_color) in enumerate(blocks):
        bx = start_x + i * block_w
        c.setFillColor(colors.HexColor(hex_color))
        c.setStrokeColor(colors.HexColor(hex_color))
        c.roundRect(bx + 12, stats_y - 1.6 * cm, block_w - 24, 1.8 * cm, 8, fill=0, stroke=1)
        c.setFont("Helvetica-Bold", 18)
        c.drawCentredString(bx + block_w / 2, stats_y - 0.6 * cm, value)
        c.setFont("Helvetica", 10)
        c.setFillColor(colors.HexColor("#64748b"))
        c.drawCentredString(bx + block_w / 2, stats_y - 1.2 * cm, label.upper())

    # ----- Footer: signature line + date + cert id -----
    footer_y = 2.6 * cm

    # Left: date
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(colors.HexColor("#0f172a"))
    c.drawString(margin + 1.4 * cm, footer_y + 0.6 * cm, completed_at.strftime("%B %d, %Y"))
    c.setFont("Helvetica", 9)
    c.setFillColor(colors.HexColor("#64748b"))
    c.drawString(margin + 1.4 * cm, footer_y, "DATE ISSUED")
    c.setStrokeColor(colors.HexColor("#94a3b8"))
    c.line(margin + 1.4 * cm, footer_y + 1.2 * cm, margin + 6.5 * cm, footer_y + 1.2 * cm)

    # Right: signature
    c.setFont("Helvetica-BoldOblique", 14)
    c.setFillColor(colors.HexColor("#6366f1"))
    c.drawRightString(width - margin - 1.4 * cm, footer_y + 0.6 * cm, "AssessAI Platform")
    c.setFont("Helvetica", 9)
    c.setFillColor(colors.HexColor("#64748b"))
    c.drawRightString(width - margin - 1.4 * cm, footer_y, "AUTHORIZED BY")
    c.setStrokeColor(colors.HexColor("#94a3b8"))
    c.line(width - margin - 6.5 * cm, footer_y + 1.2 * cm, width - margin - 1.4 * cm, footer_y + 1.2 * cm)

    # Center bottom: cert ID
    c.setFont("Helvetica", 9)
    c.setFillColor(colors.HexColor("#64748b"))
    c.drawCentredString(center_x, footer_y - 0.2 * cm, f"Certificate ID: {cert_id}")

    # ----- QR Code (top-right corner of the card) -----
    qr = qrcode.QRCode(box_size=2, border=1)
    qr.add_data(f"AssessAI Certificate {cert_id}\nName: {user_name}\nTest: {test_title}\nScore: {score:.1f}%")
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="black", back_color="white")
    qr_buf = io.BytesIO()
    qr_img.save(qr_buf, format="PNG")
    qr_buf.seek(0)
    c.drawImage(
        ImageReader(qr_buf),
        width - margin - 3.2 * cm,
        height - margin - 3.2 * cm,
        width=2.4 * cm,
        height=2.4 * cm,
    )

    # ----- Decorative trophy emoji-like symbol bottom-center top-left -----
    c.setFont("Helvetica-Bold", 38)
    c.setFillColor(colors.HexColor("#fbbf24"))
    c.drawString(margin + 0.9 * cm, height - margin - 2.0 * cm, "★")
    c.setFillColor(colors.HexColor("#fbbf24"))
    c.drawString(width - margin - 1.9 * cm + 5 * cm - 4 * cm, margin + 0.9 * cm, "")

    c.showPage()
    c.save()
    buf.seek(0)
    return buf.getvalue()


@router.get("/{attempt_id}/download")
def download_certificate(
    attempt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Generate and return a PDF certificate for an Expert-level attempt."""
    attempt = (
        db.query(TestAttempt)
        .options(joinedload(TestAttempt.test), joinedload(TestAttempt.user))
        .filter(TestAttempt.id == attempt_id)
        .first()
    )
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")

    # Access control: only owner or admin
    if attempt.user_id != current_user.id and current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Access denied")

    if not attempt.completed:
        raise HTTPException(status_code=400, detail="Attempt not completed yet")

    if (attempt.competency_level or "").lower() != "expert":
        raise HTTPException(
            status_code=400,
            detail="Certificate is awarded only for Expert-level performance",
        )

    cert_id = _certificate_id(attempt.id, attempt.user_id)
    pdf_bytes = _build_certificate_pdf(
        user_name=attempt.user.name,
        test_title=attempt.test.title if attempt.test else "Adaptive Assessment",
        score=float(attempt.score or 0),
        accuracy=float(attempt.accuracy or 0),
        competency_level=attempt.competency_level or "Expert",
        completed_at=attempt.completed_at or datetime.utcnow(),
        cert_id=cert_id,
    )

    safe_name = "".join(ch for ch in attempt.user.name if ch.isalnum() or ch in " _-")
    filename = f"AssessAI_Certificate_{safe_name.replace(' ', '_')}_{cert_id}.pdf"

    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/{attempt_id}/eligible")
def check_eligibility(
    attempt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Quick check: is this attempt eligible for a certificate?"""
    attempt = (
        db.query(TestAttempt)
        .filter(TestAttempt.id == attempt_id)
        .first()
    )
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    if attempt.user_id != current_user.id and current_user.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Access denied")

    eligible = (
        attempt.completed
        and (attempt.competency_level or "").lower() == "expert"
    )
    return {
        "eligible": eligible,
        "reason": None if eligible else "Certificate is awarded only for Expert-level performance",
        "competency_level": attempt.competency_level,
        "score": attempt.score,
    }
