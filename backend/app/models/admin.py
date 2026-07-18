from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, Boolean, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
    is_system_role = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Permission(Base):
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False) # e.g. view_dashboard, manage_users
    name = Column(String, nullable=False)
    category = Column(String, default="General") # Users, Projects, Suppliers, Prices, AI, Reports, System

class RolePermission(Base):
    __tablename__ = "role_permissions"

    id = Column(Integer, primary_key=True, index=True)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    permission_id = Column(Integer, ForeignKey("permissions.id"), nullable=False)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user_email = Column(String, nullable=True)
    action = Column(String, index=True, nullable=False) # Login, Logout, Project Created, Role Changed
    category = Column(String, default="Security")
    details = Column(Text, nullable=True)
    ip_address = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Notification(Base):
    __tablename__ = "admin_notifications"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_role = Column(String, default="All")
    subject = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    channel = Column(String, default="In-App") # In-App, Email, Push
    sent_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SystemSettings(Base):
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True, index=True)
    app_name = Column(String, default="ConstructAI Enterprise")
    company_logo = Column(String, nullable=True)
    default_theme = Column(String, default="dark")
    currency = Column(String, default="INR (₹)")
    measurement_units = Column(String, default="Metric (m, sq m, cu m)")
    timezone = Column(String, default="IST (Indian Standard Time)")
    password_min_len = Column(Integer, default=8)
    session_timeout_mins = Column(Integer, default=60)
    rate_limit_per_min = Column(Integer, default=120)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ApiKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    key_prefix = Column(String, nullable=False)
    secret_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    rate_limit_per_min = Column(Integer, default=100)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ApiLog(Base):
    __tablename__ = "api_logs"

    id = Column(Integer, primary_key=True, index=True)
    api_key_id = Column(Integer, ForeignKey("api_keys.id"), nullable=True)
    endpoint = Column(String, nullable=False)
    status_code = Column(Integer, nullable=False)
    latency_ms = Column(Float, default=12.5)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class BackupRecord(Base):
    __tablename__ = "backup_records"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    size_mb = Column(Float, default=24.5)
    status = Column(String, default="Completed")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class UserSearchHistory(Base):
    __tablename__ = "user_search_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user_email = Column(String, nullable=True)
    search_type = Column(String, default="Marketplace Search") # AI Copilot Query, Marketplace Search, Project Input, Material Estimator
    query = Column(Text, nullable=False)
    module = Column(String, default="General")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

