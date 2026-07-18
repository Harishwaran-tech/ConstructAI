from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, Boolean, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(String(500), nullable=True)
    is_system_role = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Permission(Base):
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(100), default="General")

class RolePermission(Base):
    __tablename__ = "role_permissions"

    id = Column(Integer, primary_key=True, index=True)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    permission_id = Column(Integer, ForeignKey("permissions.id"), nullable=False)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user_email = Column(String(255), nullable=True)
    action = Column(String(255), index=True, nullable=False)
    category = Column(String(100), default="Security")
    details = Column(Text, nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Notification(Base):
    __tablename__ = "admin_notifications"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_role = Column(String(100), default="All")
    subject = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    channel = Column(String(50), default="In-App")
    sent_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SystemSettings(Base):
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True, index=True)
    app_name = Column(String(255), default="ConstructAI Enterprise")
    company_logo = Column(String(500), nullable=True)
    default_theme = Column(String(50), default="dark")
    currency = Column(String(50), default="INR (₹)")
    measurement_units = Column(String(100), default="Metric (m, sq m, cu m)")
    timezone = Column(String(100), default="IST (Indian Standard Time)")
    password_min_len = Column(Integer, default=8)
    session_timeout_mins = Column(Integer, default=60)
    rate_limit_per_min = Column(Integer, default=120)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ApiKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    key_prefix = Column(String(50), nullable=False)
    secret_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    rate_limit_per_min = Column(Integer, default=100)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ApiLog(Base):
    __tablename__ = "api_logs"

    id = Column(Integer, primary_key=True, index=True)
    api_key_id = Column(Integer, ForeignKey("api_keys.id"), nullable=True)
    endpoint = Column(String(500), nullable=False)
    status_code = Column(Integer, nullable=False)
    latency_ms = Column(Float, default=12.5)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class BackupRecord(Base):
    __tablename__ = "backup_records"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    size_mb = Column(Float, default=24.5)
    status = Column(String(50), default="Completed")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class UserSearchHistory(Base):
    __tablename__ = "user_search_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user_email = Column(String(255), nullable=True)
    search_type = Column(String(100), default="Marketplace Search")
    query = Column(Text, nullable=False)
    module = Column(String(100), default="General")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
