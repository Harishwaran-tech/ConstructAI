from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from datetime import datetime, timezone
from app.core.database import Base

class Brand(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, index=True, nullable=False) # Cement, Steel, Paint, Tiles, Pipes, Electrical
    name = Column(String, nullable=False)
    manufacturer = Column(String, nullable=True)
    unit = Column(String, nullable=False) # Bag, Ton, Sq.Ft, Liter, Meter
    unit_price = Column(Float, nullable=False)
    grade_spec = Column(String, nullable=True) # e.g. OPC 53 Grade, Fe 500D TMT, Emulsion
    rating = Column(Float, default=4.5)
    description = Column(Text, nullable=True)
    availability = Column(String, default="In Stock")
    tier = Column(String, default="Premium") # Premium, Standard, Economy
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
