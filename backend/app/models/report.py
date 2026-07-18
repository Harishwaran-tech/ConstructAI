from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, Boolean, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    report_type = Column(String, index=True, nullable=False) # e.g. Project Summary, BOQ, Material Estimation
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    file_format = Column(String, default="pdf") # pdf, excel, csv
    file_path = Column(String, nullable=True)
    file_size_kb = Column(Float, default=0.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class EmailHistory(Base):
    __tablename__ = "email_history"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False)
    recipient_email = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    message = Column(Text, nullable=True)
    status = Column(String, default="sent") # sent, failed
    sent_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
