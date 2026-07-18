from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class MaterialPriceOut(BaseModel):
    id: int
    name: str
    category: str
    brand: str
    company: Optional[str] = None
    grade: Optional[str] = None
    unit: str
    current_price: float
    previous_price: float
    price_diff: float
    pct_change: float
    trend: str
    availability: str
    stock_status: str
    supplier_name: Optional[str] = None
    location: Optional[str] = None
    last_updated: datetime

    model_config = ConfigDict(from_attributes=True)

class PriceHistoryOut(BaseModel):
    id: int
    material_name: str
    brand: str
    price: float
    recorded_at: datetime

    model_config = ConfigDict(from_attributes=True)

class PriceAlertCreate(BaseModel):
    material_name: str
    brand: Optional[str] = None
    target_price: float
    condition: Optional[str] = "below"

class PriceAlertOut(PriceAlertCreate):
    id: int
    user_id: int
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class SupplierOut(BaseModel):
    id: int
    name: str
    company: Optional[str] = None
    location: str
    address: str
    phone: str
    email: Optional[str] = None
    website: Optional[str] = None
    tier: str
    rating: float
    distance: str
    delivery_time: str
    delivery_charges: float
    opening_hours: str
    categories_stocked: Optional[List[str]] = None
    available_brands: Optional[List[str]] = None
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class BrandCompareItem(BaseModel):
    brand_name: str
    manufacturer: str
    current_price: float
    grade: str
    unit: str
    quality_rating: float
    popularity: str
    estimated_delivery: str
    warranty: str
    user_rating: float
    category: str

class MarketAnalyticsOut(BaseModel):
    avg_cement_price: float
    avg_steel_price: float
    market_price_index: float
    weekly_change_pct: float
    monthly_change_pct: float
    top_rising: List[Dict[str, Any]]
    top_falling: List[Dict[str, Any]]
    ai_insights: List[str]
