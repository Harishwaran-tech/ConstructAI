from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class RoleOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    is_system_role: bool
    permissions: List[str] = []

    model_config = ConfigDict(from_attributes=True)

class PermissionOut(BaseModel):
    id: int
    code: str
    name: str
    category: str

    model_config = ConfigDict(from_attributes=True)

class RoleCreate(BaseModel):
    name: str
    description: Optional[str] = None
    permissions: List[str] = []

class UserAdminOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    company_name: Optional[str] = None
    phone_number: Optional[str] = None
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserAdminCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role: str
    company_name: Optional[str] = None
    phone_number: Optional[str] = None

class AuditLogOut(BaseModel):
    id: int
    user_email: Optional[str] = None
    action: str
    category: str
    details: Optional[str] = None
    ip_address: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class SystemAnalyticsOut(BaseModel):
    total_users: int
    active_users: int
    inactive_users: int
    total_projects: int
    materials_estimated: int
    reports_generated: int
    total_suppliers: int
    ai_requests: int
    user_growth_chart: List[Dict[str, Any]]
    project_growth_chart: List[Dict[str, Any]]

class ApiKeyOut(BaseModel):
    id: int
    name: str
    key_prefix: str
    is_active: bool
    rate_limit_per_min: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class BackupRecordOut(BaseModel):
    id: int
    filename: str
    size_mb: float
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class SystemSettingsOut(BaseModel):
    app_name: str
    currency: str
    measurement_units: str
    timezone: str
    password_min_len: int
    session_timeout_mins: int
    rate_limit_per_min: int

    model_config = ConfigDict(from_attributes=True)

class UserSearchHistoryOut(BaseModel):
    id: int
    user_email: Optional[str] = None
    search_type: str
    query: str
    module: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserSearchCreate(BaseModel):
    search_type: str
    query: str
    module: Optional[str] = "General"

