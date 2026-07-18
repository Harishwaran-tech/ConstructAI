from typing import Optional, Dict, Any, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class MaterialCalculationRequest(BaseModel):
    category: Optional[str] = "Concrete"
    length: Optional[float] = 0.0
    width: Optional[float] = 0.0
    height_or_depth: Optional[float] = 0.0
    quantity: Optional[float] = 1.0
    concrete_grade: Optional[str] = "M20"
    steel_percentage: Optional[float] = 1.5
    mortar_ratio: Optional[str] = "1:6"

    title: Optional[str] = None
    built_up_area: Optional[float] = 1500.0
    total_budget: Optional[float] = 150000.0
    plot_details: Optional[Dict[str, Any]] = None
    structural_details: Optional[Dict[str, Any]] = None
    material_preferences: Optional[Dict[str, Any]] = None
    labour_details: Optional[Dict[str, Any]] = None
    budget_details: Optional[Dict[str, Any]] = None

EstimationCalculateRequest = MaterialCalculationRequest

class EstimationBase(BaseModel):
    title: str
    category: Optional[str] = "General Takeoff"
    input_params: Optional[Dict[str, Any]] = None
    calculated_results: Optional[Dict[str, Any]] = None
    total_estimated_cost: Optional[float] = 0.0
    notes: Optional[str] = None
    project_id: Optional[int] = None

class EstimationCreate(EstimationBase):
    pass

class EstimationOut(EstimationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
