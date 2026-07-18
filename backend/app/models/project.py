from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    client_name = Column(String, nullable=True)
    owner_name = Column(String, nullable=True)
    location = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=True)
    pincode = Column(String, nullable=True)
    google_maps_url = Column(String, nullable=True)
    
    project_type = Column(String, default="Residential") # Residential, Commercial, Industrial, Apartment, Villa, Hospital, School, Bridge, Road, Warehouse
    built_up_area = Column(Float, default=0.0) # in sq ft
    total_budget = Column(Float, default=0.0) # in Currency (USD / INR / EUR)
    currency = Column(String, default="INR")
    measurement_units = Column(String, default="Metric / Sq.Ft")
    status = Column(String, default="Planning") # Planning, In Progress, Completed, On Hold
    completion_percentage = Column(Integer, default=0)
    
    start_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)
    
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
