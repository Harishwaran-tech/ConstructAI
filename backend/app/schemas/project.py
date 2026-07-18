from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    client_name: Optional[str] = None
    owner_name: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    pincode: Optional[str] = None
    google_maps_url: Optional[str] = None
    
    project_type: Optional[str] = "Residential"
    built_up_area: Optional[float] = 0.0
    total_budget: Optional[float] = 0.0
    currency: Optional[str] = "INR"
    measurement_units: Optional[str] = "Metric / Sq.Ft"
    status: Optional[str] = "Planning"
    completion_percentage: Optional[int] = 0
    
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    
    plot_details: Optional[Dict[str, Any]] = None
    structural_details: Optional[Dict[str, Any]] = None
    material_preferences: Optional[Dict[str, Any]] = None
    labour_details: Optional[Dict[str, Any]] = None
    budget_details: Optional[Dict[str, Any]] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    client_name: Optional[str] = None
    owner_name: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    pincode: Optional[str] = None
    google_maps_url: Optional[str] = None
    project_type: Optional[str] = None
    built_up_area: Optional[float] = None
    total_budget: Optional[float] = None
    currency: Optional[str] = None
    measurement_units: Optional[str] = None
    status: Optional[str] = None
    completion_percentage: Optional[int] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    plot_details: Optional[Dict[str, Any]] = None
    structural_details: Optional[Dict[str, Any]] = None
    material_preferences: Optional[Dict[str, Any]] = None
    labour_details: Optional[Dict[str, Any]] = None
    budget_details: Optional[Dict[str, Any]] = None

class ProjectOut(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
