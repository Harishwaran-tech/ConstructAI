from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Estimation(Base):
    __tablename__ = "estimations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    category = Column(String, default="General Takeoff")
    input_params = Column(JSON, nullable=True)
    calculated_results = Column(JSON, nullable=True) # stores items array & summary metrics
    total_estimated_cost = Column(Float, default=0.0)
    notes = Column(Text, nullable=True)

    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="estimations")
