from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.api.v1.router import api_router
import app.models.user
import app.models.project
import app.models.admin
import app.models.estimation
import app.models.market
import app.models.report
import app.models.ai_insights
import app.models.supplier_marketplace
from app.models.user import User
from app.models.admin import AuditLog, UserSearchHistory
from app.core.security import get_password_hash
from datetime import datetime, timezone, timedelta

# Create DB tables automatically on startup
Base.metadata.create_all(bind=engine)

def seed_superadmin():
    db = SessionLocal()
    try:
        superadmin = db.query(User).filter((User.email == "superadmin@constructai.com") | (User.email == "superadmin")).first()
        if not superadmin:
            superadmin = User(
                email="superadmin@constructai.com",
                hashed_password=get_password_hash("superadmin"),
                full_name="Super Admin",
                role="Super Admin",
                company_name="ConstructAI Global Governance",
                phone_number="+1 (800) 555-SUPER",
                is_active=True,
                is_superuser=True
            )
            db.add(superadmin)
            db.commit()
            db.refresh(superadmin)

            # Add initial Audit Logs
            now = datetime.now(timezone.utc)
            audit_entries = [
                AuditLog(user_id=superadmin.id, user_email=superadmin.email, action="Super Admin System Provisioned", category="Security", details="Super Admin account created with full governance privileges", ip_address="127.0.0.1", created_at=now),
                AuditLog(user_id=superadmin.id, user_email=superadmin.email, action="RBAC Matrix Applied", category="Security", details="Assigned system permissions: view_audit_log, view_user_history, manage_users", ip_address="127.0.0.1", created_at=now - timedelta(minutes=15)),
                AuditLog(user_id=2, user_email="john@constructai.com", action="Project Created", category="Projects", details="Created project 'Austin Commercial Hub'", ip_address="192.168.1.45", created_at=now - timedelta(hours=1)),
                AuditLog(user_id=3, user_email="sarah@constructai.com", action="BOQ PDF Exported", category="Reports", details="Exported BOQ Report for Structural Estimation", ip_address="192.168.1.88", created_at=now - timedelta(hours=3)),
            ]
            db.add_all(audit_entries)

            # Add initial User Search & Input History
            search_entries = [
                UserSearchHistory(user_id=2, user_email="john@constructai.com", search_type="AI Copilot Input", query="Calculate M25 concrete mix ratio and cement bags for 2500 sq ft slab", module="AI Assistant", created_at=now - timedelta(minutes=30)),
                UserSearchHistory(user_id=3, user_email="sarah@constructai.com", search_type="Marketplace Search", query="Ultratech 53 Grade Cement suppliers near Austin TX", module="Nearby Suppliers", created_at=now - timedelta(hours=2)),
                UserSearchHistory(user_id=2, user_email="john@constructai.com", search_type="Material Estimator", query="Slab thickness 6 inch, Fe550 Steel rebars 12mm", module="Estimator Engine", created_at=now - timedelta(hours=4)),
                UserSearchHistory(user_id=superadmin.id, user_email=superadmin.email, search_type="System Audit", query="View user activity logs and security compliance reports", module="Admin System", created_at=now - timedelta(minutes=5))
            ]
            db.add_all(search_entries)

            db.commit()
    except Exception as e:
        print(f"Error seeding superadmin: {e}")
    finally:
        db.close()

seed_superadmin()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "healthy",
        "docs": "/docs"
    }

@app.get("/health")
def health():
    return {"status": "ok"}
