from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class SupplierMaterialOut(BaseModel):
    id: int
    supplier_id: int
    material_name: str
    category: str
    brand: str
    grade: Optional[str] = None
    specs: Optional[str] = None
    unit: str
    current_price: float
    discount_pct: float
    available_qty: float
    stock_status: str
    restock_date: Optional[str] = None
    delivery_time: str
    delivery_charge: float
    min_order: float
    max_order: float

    model_config = ConfigDict(from_attributes=True)

class SupplierReviewOut(BaseModel):
    id: int
    supplier_id: int
    user_id: int
    user_name: str
    rating: float
    comment: str
    images: Optional[List[str]] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class SupplierMarketplaceOut(BaseModel):
    id: int
    name: str
    company: str
    logo: Optional[str] = None
    tier: str
    phone: str
    email: Optional[str] = None
    website: Optional[str] = None
    gst_number: Optional[str] = None
    business_registration: Optional[str] = None
    address: str
    city: str
    state: str
    lat: float
    lng: float
    distance_miles: Optional[float] = 3.2
    travel_time_mins: Optional[int] = 12
    rating: float
    review_count: int
    is_verified: bool
    is_open_now: bool
    opening_hours: str
    branches: Optional[List[str]] = None
    payment_methods: Optional[List[str]] = None
    certifications: Optional[List[str]] = None
    gallery: Optional[List[str]] = None
    description: Optional[str] = None
    materials: Optional[List[SupplierMaterialOut]] = None
    reviews: Optional[List[SupplierReviewOut]] = None

    model_config = ConfigDict(from_attributes=True)

class RFQCreateRequest(BaseModel):
    project_id: Optional[int] = None
    supplier_ids: List[int]
    items: List[Dict[str, Any]] # {material_name, qty, unit}
    notes: Optional[str] = None

class RFQOut(BaseModel):
    id: int
    user_id: int
    project_id: Optional[int] = None
    supplier_ids: List[int]
    items: List[Dict[str, Any]]
    notes: Optional[str] = None
    status: str
    total_quoted_amount: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ReviewCreateRequest(BaseModel):
    rating: float
    comment: str
    images: Optional[List[str]] = None

class SupplierCompareOut(BaseModel):
    supplier_id: int
    name: str
    company: str
    price_total: float
    distance_miles: float
    delivery_time: str
    delivery_charge: float
    rating: float
    stock_availability: str
    recommendation_badge: str
