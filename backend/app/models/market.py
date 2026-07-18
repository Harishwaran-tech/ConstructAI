from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, Boolean, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class MaterialPrice(Base):
    __tablename__ = "material_prices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    category = Column(String, index=True, nullable=False)
    brand = Column(String, index=True, nullable=False)
    company = Column(String, nullable=True)
    grade = Column(String, nullable=True)
    unit = Column(String, nullable=False)
    current_price = Column(Float, nullable=False)
    previous_price = Column(Float, nullable=False)
    price_diff = Column(Float, default=0.0)
    pct_change = Column(Float, default=0.0)
    trend = Column(String, default="stable") # up, down, stable
    availability = Column(String, default="In Stock")
    stock_status = Column(String, default="High Stock")
    supplier_name = Column(String, nullable=True)
    location = Column(String, nullable=True)
    last_updated = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class PriceHistory(Base):
    __tablename__ = "price_history"

    id = Column(Integer, primary_key=True, index=True)
    material_price_id = Column(Integer, ForeignKey("material_prices.id"), nullable=True)
    material_name = Column(String, index=True)
    brand = Column(String, index=True)
    price = Column(Float, nullable=False)
    recorded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class PriceAlert(Base):
    __tablename__ = "price_alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    material_name = Column(String, nullable=False)
    brand = Column(String, nullable=True)
    target_price = Column(Float, nullable=False)
    condition = Column(String, default="below") # below, above, pct_increase
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    company = Column(String, nullable=True)
    location = Column(String, nullable=False)
    address = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=True)
    website = Column(String, nullable=True)
    tier = Column(String, default="Wholesale Stockist")
    rating = Column(Float, default=4.8)
    distance = Column(String, default="3.2 miles away")
    delivery_time = Column(String, default="24-48 Hours")
    delivery_charges = Column(Float, default=50.0)
    opening_hours = Column(String, default="Mon-Sat: 7:00 AM - 6:00 PM")
    categories_stocked = Column(JSON, nullable=True)
    available_brands = Column(JSON, nullable=True)
    description = Column(Text, nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
