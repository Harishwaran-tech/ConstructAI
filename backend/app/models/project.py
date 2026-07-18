from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    description = Column(Text, nullable=True)
    client_name = Column(String(255), nullable=True)
    owner_name = Column(String(255), nullable=True)
    location = Column(String(500), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    pincode = Column(String(20), nullable=True)
    google_maps_url = Column(String(500), nullable=True)

    project_type = Column(String(100), default="Residential")
    built_up_area = Column(Float, default=0.0)
    total_budget = Column(Float, default=0.0)
    currency = Column(String(20), default="INR")
    measurement_units = Column(String(50), default="Metric / Sq.Ft")
    status = Column(String(50), default="Planning")
    completion_percentage = Column(Integer, default=0)

    start_date = Column(String(50), nullable=True)
    end_date = Column(String(50), nullable=True)

    # Detailed Specs JSON fields
    plot_details = Column(JSON, nullable=True)
    structural_details = Column(JSON, nullable=True)
    material_preferences = Column(JSON, nullable=True)
    labour_details = Column(JSON, nullable=True)
    budget_details = Column(JSON, nullable=True)

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="projects")
    estimations = relationship("Estimation", back_populates="project", cascade="all, delete-orphan")
