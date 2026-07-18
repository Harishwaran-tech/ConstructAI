from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, Boolean, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Supplier(Base):
    __tablename__ = "marketplace_suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    company = Column(String, nullable=False)
    logo = Column(String, nullable=True)
    tier = Column(String, default="Primary Stockist") # Primary Manufacturer, Wholesale Stockist, ReadyMix Plant
    phone = Column(String, nullable=False)
    email = Column(String, nullable=True)
    website = Column(String, nullable=True)
    gst_number = Column(String, nullable=True)
    business_registration = Column(String, nullable=True)
    address = Column(String, nullable=False)
    city = Column(String, default="Austin")
    state = Column(String, default="TX")
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    rating = Column(Float, default=4.8)
    review_count = Column(Integer, default=24)
    is_verified = Column(Boolean, default=True)
    is_open_now = Column(Boolean, default=True)
    opening_hours = Column(String, default="Mon-Sat: 6:30 AM - 6:00 PM")
    branches = Column(JSON, nullable=True) # list of branch addresses
    payment_methods = Column(JSON, nullable=True) # Cash, Wire, Credit, ACH
    certifications = Column(JSON, nullable=True) # ISO 9001, ANSI, IS 1489
    gallery = Column(JSON, nullable=True) # image URLs
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

SupplierProfile = Supplier

class SupplierMaterial(Base):
    __tablename__ = "supplier_materials"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("marketplace_suppliers.id"), nullable=False)
    material_name = Column(String, index=True, nullable=False)
    category = Column(String, index=True, nullable=False)
    brand = Column(String, index=True, nullable=False)
    grade = Column(String, nullable=True)
    specs = Column(Text, nullable=True)
    unit = Column(String, nullable=False)
    current_price = Column(Float, nullable=False)
    discount_pct = Column(Float, default=0.0)
    available_qty = Column(Float, default=1000.0)
    stock_status = Column(String, default="In Stock") # In Stock, Low Stock, Out of Stock
    restock_date = Column(String, nullable=True)
    delivery_time = Column(String, default="24 Hours")
    delivery_charge = Column(Float, default=45.0)
    min_order = Column(Float, default=1.0)
    max_order = Column(Float, default=10000.0)

MaterialInventory = SupplierMaterial

class QuotationRequest(Base):
    __tablename__ = "quotation_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    supplier_ids = Column(JSON, nullable=False) # list of supplier IDs requested
    items = Column(JSON, nullable=False) # list of {material_name, qty, unit}
    notes = Column(Text, nullable=True)
    status = Column(String, default="Pending") # Pending, Quoted, Accepted, Rejected
    total_quoted_amount = Column(Float, default=0.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SupplierReview(Base):
    __tablename__ = "supplier_reviews"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("marketplace_suppliers.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user_name = Column(String, default="Verified Contractor")
    rating = Column(Float, nullable=False)
    comment = Column(Text, nullable=False)
    images = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class FavoriteSupplier(Base):
    __tablename__ = "favorite_suppliers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    supplier_id = Column(Integer, ForeignKey("marketplace_suppliers.id"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
