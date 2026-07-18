from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from datetime import datetime, timezone
from app.core.database import Base

class Brand(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100), index=True, nullable=False)
    name = Column(String(255), nullable=False)
    manufacturer = Column(String(255), nullable=True)
    unit = Column(String(50), nullable=False)
    unit_price = Column(Float, nullable=False)
    grade_spec = Column(String(100), nullable=True)
    rating = Column(Float, default=4.5)
    description = Column(Text, nullable=True)
    availability = Column(String(50), default="In Stock")
    tier = Column(String(50), default="Premium")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
