from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class BrandBase(BaseModel):
    category: str
    name: str
    manufacturer: Optional[str] = None
    unit: str
    unit_price: float
    grade_spec: Optional[str] = None
    rating: Optional[float] = 4.5
    description: Optional[str] = None
    availability: Optional[str] = "In Stock"
    tier: Optional[str] = "Premium"

class BrandCreate(BrandBase):
    pass

class BrandOut(BrandBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
