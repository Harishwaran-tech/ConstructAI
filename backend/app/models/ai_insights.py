from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, Boolean, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    title = Column(String, default="Construction Assistant Session")
    messages = Column(JSON, nullable=False) # list of {role, content, timestamp}
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class AIRecommendation(Base):
    __tablename__ = "ai_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    category = Column(String, nullable=False) # Material, Budget, Labour, Timing, Risk
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    estimated_savings = Column(Float, default=0.0)
    impact = Column(String, default="High")
    mitigation_step = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class AIReport(Base):
    __tablename__ = "ai_reports"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    title = Column(String, nullable=False)
    executive_summary = Column(Text, nullable=False)
    budget_analysis = Column(JSON, nullable=True)
    material_analysis = Column(JSON, nullable=True)
    risk_analysis = Column(JSON, nullable=True)
    timeline = Column(JSON, nullable=True)
    recommendations = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ChecklistHistory(Base):
    __tablename__ = "checklist_history"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    category = Column(String, nullable=False) # Pre-construction, Foundation, Structural, Electrical, Plumbing, Finishing, Safety
    items = Column(JSON, nullable=False) # list of {id, title, status, mandatory}
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
