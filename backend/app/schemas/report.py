from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ReportGenerateRequest(BaseModel):
    project_id: int
    report_type: str
    file_format: Optional[str] = "pdf"
    title: Optional[str] = None
    custom_notes: Optional[str] = None

class ReportOut(BaseModel):
    id: int
    project_id: Optional[int] = None
    user_id: int
    report_type: str
    title: str
    description: Optional[str] = None
    file_format: str
    file_path: Optional[str] = None
    file_size_kb: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class EmailReportRequest(BaseModel):
    recipient_email: str
    subject: Optional[str] = "ConstructAI Official Project Report"
    message: Optional[str] = None
    attach_format: Optional[str] = "pdf"
