from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, Boolean, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Supplier(Base):
    __tablename__ = "marketplace_suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True, nullable=False)
    company = Column(String(255), nullable=False)
    logo = Column(String(500), nullable=True)
    tier = Column(String(100), default="Primary Stockist")
    phone = Column(String(50), nullable=False)
    email = Column(String(255), nullable=True)
    website = Column(String(500), nullable=True)
    gst_number = Column(String(50), nullable=True)
    business_registration = Column(String(100), nullable=True)
    address = Column(String(500), nullable=False)
    city = Column(String(100), default="Austin")
    state = Column(String(100), default="TX")
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    rating = Column(Float, default=4.8)
    review_count = Column(Integer, default=24)
    is_verified = Column(Boolean, default=True)
    is_open_now = Column(Boolean, default=True)
    opening_hours = Column(String(100), default="Mon-Sat: 6:30 AM - 6:00 PM")
    branches = Column(JSON, nullable=True)
    payment_methods = Column(JSON, nullable=True)
    certifications = Column(JSON, nullable=True)
    gallery = Column(JSON, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

SupplierProfile = Supplier

class SupplierMaterial(Base):
    __tablename__ = "supplier_materials"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("marketplace_suppliers.id"), nullable=False)
    material_name = Column(String(255), index=True, nullable=False)
    category = Column(String(100), index=True, nullable=False)
    brand = Column(String(255), index=True, nullable=False)
    grade = Column(String(100), nullable=True)
    specs = Column(Text, nullable=True)
    unit = Column(String(50), nullable=False)
    current_price = Column(Float, nullable=False)
    discount_pct = Column(Float, default=0.0)
    available_qty = Column(Float, default=1000.0)
    stock_status = Column(String(50), default="In Stock")
    restock_date = Column(String(50), nullable=True)
    delivery_time = Column(String(50), default="24 Hours")
    delivery_charge = Column(Float, default=45.0)
    min_order = Column(Float, default=1.0)
    max_order = Column(Float, default=10000.0)

MaterialInventory = SupplierMaterial

class QuotationRequest(Base):
    __tablename__ = "quotation_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    supplier_ids = Column(JSON, nullable=False)
    items = Column(JSON, nullable=False)
    notes = Column(Text, nullable=True)
    status = Column(String(50), default="Pending")
    total_quoted_amount = Column(Float, default=0.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SupplierReview(Base):
    __tablename__ = "supplier_reviews"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("marketplace_suppliers.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user_name = Column(String(255), default="Verified Contractor")
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
