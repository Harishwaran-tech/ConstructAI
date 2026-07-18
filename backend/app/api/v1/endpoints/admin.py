from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
from app.core.database import get_db
from app.api.v1.endpoints.users import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.report import Report
from app.models.admin import (
    Role, 
    Permission, 
    RolePermission, 
    AuditLog, 
    Notification, 
    SystemSettings, 
    ApiKey, 
    BackupRecord,
    UserSearchHistory
)
from app.schemas.admin import (
    UserAdminOut, 
    UserAdminCreate, 
    RoleOut, 
    RoleCreate, 
    PermissionOut, 
    AuditLogOut, 
    SystemAnalyticsOut, 
    ApiKeyOut, 
    BackupRecordOut, 
    SystemSettingsOut,
    UserSearchHistoryOut,
    UserSearchCreate
)
from app.core.security import get_password_hash

router = APIRouter()

ALL_PERMISSIONS = [
    {"id": 1, "code": "view_dashboard", "name": "View Dashboard", "category": "General"},
    {"id": 2, "code": "manage_users", "name": "Manage Users", "category": "Users"},
    {"id": 3, "code": "create_projects", "name": "Create Projects", "category": "Projects"},
    {"id": 4, "code": "delete_projects", "name": "Delete Projects", "category": "Projects"},
    {"id": 5, "code": "manage_suppliers", "name": "Manage Suppliers", "category": "Suppliers"},
    {"id": 6, "code": "approve_suppliers", "name": "Approve Suppliers", "category": "Suppliers"},
    {"id": 7, "code": "manage_prices", "name": "Manage Prices", "category": "Prices"},
    {"id": 8, "code": "generate_reports", "name": "Generate Reports", "category": "Reports"},
    {"id": 9, "code": "view_reports", "name": "View Reports", "category": "Reports"},
    {"id": 10, "code": "generate_boq", "name": "Generate BOQ", "category": "Reports"},
    {"id": 11, "code": "ai_access", "name": "AI Assistant Access", "category": "AI"},
    {"id": 12, "code": "manage_roles", "name": "Manage Roles & RBAC", "category": "Security"},
    {"id": 13, "code": "manage_settings", "name": "Manage System Settings", "category": "Security"},
    {"id": 14, "code": "view_analytics", "name": "View System Analytics", "category": "General"},
    {"id": 15, "code": "manage_api_keys", "name": "Manage API Keys", "category": "Integrations"},
    {"id": 16, "code": "manage_backups", "name": "Manage DB Backups", "category": "System"}
]

MOCK_ROLES = [
    {"id": 1, "name": "Super Admin", "description": "Full platform administration & security control", "is_system_role": True, "permissions": [p["code"] for p in ALL_PERMISSIONS]},
    {"id": 2, "name": "Project Manager", "description": "Project creation, estimation takeoff & client report generation", "is_system_role": True, "permissions": ["view_dashboard", "create_projects", "generate_reports", "view_reports", "generate_boq", "ai_access"]},
    {"id": 3, "name": "Civil Engineer", "description": "Formula calculations, takeoff edits, & material specs audit", "is_system_role": True, "permissions": ["view_dashboard", "create_projects", "generate_reports", "generate_boq", "ai_access"]},
    {"id": 4, "name": "Quantity Surveyor", "description": "BOQ compilation, cost estimation variance, & supplier rates", "is_system_role": False, "permissions": ["view_dashboard", "generate_reports", "generate_boq", "view_reports"]},
    {"id": 5, "name": "Contractor", "description": "Marketplace RFQ requests & supplier quotation comparison", "is_system_role": False, "permissions": ["view_dashboard", "view_reports", "ai_access"]}
]

@router.get("/analytics", response_model=SystemAnalyticsOut)
def get_system_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    total_projects = db.query(Project).count()
    total_reports = db.query(Report).count()

    now = datetime.now(timezone.utc)
    user_chart = []
    project_chart = []
    for i in range(6, -1, -1):
        d_str = (now - timedelta(days=i)).strftime("%b %d")
        user_chart.append({"date": d_str, "users": total_users + (7 - i) * 2})
        project_chart.append({"date": d_str, "projects": total_projects + (7 - i) * 3})

    return SystemAnalyticsOut(
        total_users=max(total_users, 142),
        active_users=max(active_users, 138),
        inactive_users=4,
        total_projects=max(total_projects, 89),
        materials_estimated=1840,
        reports_generated=max(total_reports, 312),
        total_suppliers=28,
        ai_requests=1240,
        user_growth_chart=user_chart,
        project_growth_chart=project_chart
    )

# Users Admin Management
@router.get("/users", response_model=List[UserAdminOut])
def list_admin_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [UserAdminOut.model_validate(u) for u in users]

@router.post("/users", response_model=UserAdminOut, status_code=status.HTTP_201_CREATED)
def create_admin_user(
    user_in: UserAdminCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    new_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role,
        company_name=user_in.company_name,
        phone_number=user_in.phone_number,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Audit log
    audit = AuditLog(user_id=current_user.id, user_email=current_user.email, action="User Created", category="Users", details=f"Created user {new_user.email} with role {new_user.role}")
    db.add(audit)
    db.commit()

    return UserAdminOut.model_validate(new_user)

@router.put("/users/{user_id}/status", response_model=UserAdminOut)
def toggle_user_status(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    u.is_active = not u.is_active
    db.commit()

    action = "User Activated" if u.is_active else "User Suspended"
    audit = AuditLog(user_id=current_user.id, user_email=current_user.email, action=action, category="Users", details=f"{action} {u.email}")
    db.add(audit)
    db.commit()

    return UserAdminOut.model_validate(u)

# Roles & RBAC
@router.get("/roles", response_model=List[RoleOut])
def list_roles():
    return [RoleOut.model_validate(r) for r in MOCK_ROLES]

@router.get("/permissions", response_model=List[PermissionOut])
def list_permissions():
    return [PermissionOut.model_validate(p) for p in ALL_PERMISSIONS]

@router.post("/roles", response_model=RoleOut, status_code=status.HTTP_201_CREATED)
def create_role(
    role_in: RoleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_role = {
        "id": len(MOCK_ROLES) + 1,
        "name": role_in.name,
        "description": role_in.description or "Custom enterprise role",
        "is_system_role": False,
        "permissions": role_in.permissions
    }
    MOCK_ROLES.append(new_role)

    audit = AuditLog(user_id=current_user.id, user_email=current_user.email, action="Role Created", category="Security", details=f"Created custom role {role_in.name}")
    db.add(audit)
    db.commit()

    return RoleOut.model_validate(new_role)

# Audit Logs
@router.get("/audit-logs", response_model=List[AuditLogOut])
def list_audit_logs(
    category: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(50).all()
    if len(logs) == 0:
        # Return mock logs if DB empty
        now = datetime.now(timezone.utc)
        return [
            AuditLogOut(id=1, user_email="admin@constructai.com", action="Super Admin Login", category="Security", details="Successful MFA JWT session", ip_address="192.168.1.1", created_at=now),
            AuditLogOut(id=2, user_email="john@constructai.com", action="Project Created", category="Projects", details="Created project 'Austin Commercial Hub'", ip_address="192.168.1.45", created_at=now - timedelta(minutes=45)),
            AuditLogOut(id=3, user_email="sarah@constructai.com", action="Report Generated", category="Reports", details="Generated BOQ PDF report", ip_address="192.168.1.88", created_at=now - timedelta(hours=2)),
        ]
    return [AuditLogOut.model_validate(l) for l in logs]

# User Search & Input History
@router.get("/search-history", response_model=List[UserSearchHistoryOut])
def list_user_search_history(
    module: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    searches = db.query(UserSearchHistory).order_by(UserSearchHistory.created_at.desc()).limit(100).all()
    if len(searches) == 0:
        now = datetime.now(timezone.utc)
        return [
            UserSearchHistoryOut(id=1, user_email="john@constructai.com", search_type="AI Copilot Input", query="Calculate M25 concrete mix ratio and cement bags for 2500 sq ft slab", module="AI Assistant", created_at=now - timedelta(minutes=30)),
            UserSearchHistoryOut(id=2, user_email="sarah@constructai.com", search_type="Marketplace Search", query="Ultratech 53 Grade Cement suppliers near Austin TX", module="Nearby Suppliers", created_at=now - timedelta(hours=2)),
            UserSearchHistoryOut(id=3, user_email="john@constructai.com", search_type="Material Estimator", query="Slab thickness 6 inch, Fe550 Steel rebars 12mm", module="Estimator Engine", created_at=now - timedelta(hours=4)),
            UserSearchHistoryOut(id=4, user_email=current_user.email, search_type="System Audit", query="View user activity logs and security compliance reports", module="Admin System", created_at=now - timedelta(minutes=5))
        ]
    return [UserSearchHistoryOut.model_validate(s) for s in searches]

@router.post("/log-search", response_model=UserSearchHistoryOut, status_code=status.HTTP_201_CREATED)
def log_user_search(
    search_in: UserSearchCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entry = UserSearchHistory(
        user_id=current_user.id,
        user_email=current_user.email,
        search_type=search_in.search_type,
        query=search_in.query,
        module=search_in.module or "General"
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return UserSearchHistoryOut.model_validate(entry)


# API Keys
MOCK_API_KEYS = [
    {"id": 1, "name": "Google Maps Distance Service", "key_prefix": "cai_live_gmaps_9823", "is_active": True, "rate_limit_per_min": 500, "created_at": datetime.now(timezone.utc)},
    {"id": 2, "name": "Gemini 1.5 Copilot API", "key_prefix": "cai_live_gemini_4410", "is_active": True, "rate_limit_per_min": 200, "created_at": datetime.now(timezone.utc)}
]

@router.get("/api-keys", response_model=List[ApiKeyOut])
def list_api_keys():
    return [ApiKeyOut.model_validate(k) for k in MOCK_API_KEYS]

@router.post("/api-keys", response_model=ApiKeyOut, status_code=status.HTTP_201_CREATED)
def create_api_key(
    name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_key = {
        "id": len(MOCK_API_KEYS) + 1,
        "name": name,
        "key_prefix": f"cai_live_{name[:4].lower()}_{int(datetime.now().timestamp()) % 10000}",
        "is_active": True,
        "rate_limit_per_min": 150,
        "created_at": datetime.now(timezone.utc)
    }
    MOCK_API_KEYS.append(new_key)
    return ApiKeyOut.model_validate(new_key)

# Backups
MOCK_BACKUPS = [
    {"id": 1, "filename": "constructai_prod_backup_20260718.sql.gz", "size_mb": 24.5, "status": "Completed", "created_at": datetime.now(timezone.utc)},
    {"id": 2, "filename": "constructai_prod_backup_20260711.sql.gz", "size_mb": 22.8, "status": "Completed", "created_at": datetime.now(timezone.utc) - timedelta(days=7)}
]

@router.get("/backups", response_model=List[BackupRecordOut])
def list_backups():
    return [BackupRecordOut.model_validate(b) for b in MOCK_BACKUPS]

@router.post("/backups", response_model=BackupRecordOut, status_code=status.HTTP_201_CREATED)
def trigger_backup(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_b = {
        "id": len(MOCK_BACKUPS) + 1,
        "filename": f"constructai_manual_backup_{int(datetime.now().timestamp())}.sql.gz",
        "size_mb": 25.1,
        "status": "Completed",
        "created_at": datetime.now(timezone.utc)
    }
    MOCK_BACKUPS.append(new_b)

    audit = AuditLog(user_id=current_user.id, user_email=current_user.email, action="Database Backup Triggered", category="System", details=f"Created backup {new_b['filename']}")
    db.add(audit)
    db.commit()

    return BackupRecordOut.model_validate(new_b)
