from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.brand import Brand
from app.schemas.brand import BrandCreate, BrandOut

router = APIRouter()

# Initial seed data for construction material brands
SEED_BRANDS = [
    {"category": "Cement", "name": "UltraTech Super", "manufacturer": "UltraTech Cement", "unit": "50kg Bag", "unit_price": 385.00, "grade_spec": "PPC 53 Grade", "rating": 4.9, "tier": "Premium", "description": "High early strength cement with anti-crack properties."},
    {"category": "Cement", "name": "ACC Concrete+ Gold", "manufacturer": "ACC Limited", "unit": "50kg Bag", "unit_price": 375.00, "grade_spec": "OPC 53 Grade", "rating": 4.8, "tier": "Premium", "description": "Engineered with water-repellent active particles."},
    {"category": "Cement", "name": "Ambuja Kawach", "manufacturer": "Ambuja Cements", "unit": "50kg Bag", "unit_price": 360.00, "grade_spec": "Water Shield PPC", "rating": 4.7, "tier": "Standard", "description": "Prevents efflorescence and dampness in walls."},
    
    {"category": "Steel", "name": "Tata Tiscon 550SD", "manufacturer": "Tata Steel", "unit": "kg", "unit_price": 66.50, "grade_spec": "Fe 550D TMT", "rating": 4.9, "tier": "Premium", "description": "Super ductile TMT rebars engineered for high earthquake resistance."},
    {"category": "Steel", "name": "JSW Neosteel", "manufacturer": "JSW Steel", "unit": "kg", "unit_price": 63.50, "grade_spec": "Fe 500D TMT", "rating": 4.8, "tier": "Premium", "description": "Clean steel with high tensile strength and uniform rib pattern."},
    {"category": "Steel", "name": "Jindal Panther", "manufacturer": "Jindal Steel", "unit": "kg", "unit_price": 61.00, "grade_spec": "Fe 500D TMT", "rating": 4.6, "tier": "Standard", "description": "Superior weldability and bendability for heavy construction."},

    {"category": "Paint", "name": "Asian Paints Royale Health Shield", "manufacturer": "Asian Paints", "unit": "Liter", "unit_price": 480.00, "grade_spec": "Luxury Interior Emulsion", "rating": 4.9, "tier": "Premium", "description": "Anti-bacterial luxury paint with Teflon surface protection."},
    {"category": "Paint", "name": "Berger Silk Breathe Easy", "manufacturer": "Berger Paints", "unit": "Liter", "unit_price": 420.00, "grade_spec": "Silk Interior Washable", "rating": 4.7, "tier": "Standard", "description": "Low VOC washable paint with velvet sheen finish."},
    {"category": "Paint", "name": "Dulux WeatherShield Powerflex", "manufacturer": "AkzoNobel", "unit": "Liter", "unit_price": 450.00, "grade_spec": "Exterior Elastomeric", "rating": 4.8, "tier": "Premium", "description": "Flexes up to 3x to bridge hairline exterior masonry cracks."},

    {"category": "Tiles", "name": "Kajaria Eternity Vitrified", "manufacturer": "Kajaria Ceramics", "unit": "Sq.Ft", "unit_price": 85.00, "grade_spec": "Full Body Vitrified 60x120 cm", "rating": 4.9, "tier": "Premium", "description": "Stain resistant, zero water absorption polished tiles."},
    {"category": "Tiles", "name": "Somany Duragres Granito", "manufacturer": "Somany Ceramics", "unit": "Sq.Ft", "unit_price": 72.00, "grade_spec": "Glazed Vitrified 60x60 cm", "rating": 4.7, "tier": "Standard", "description": "Heavy duty anti-skid porcelain floor tiles."},

    {"category": "Pipes", "name": "Astral CPVC Pro", "manufacturer": "Astral Pipes", "unit": "Meter", "unit_price": 145.00, "grade_spec": "SDR 11 Hot & Cold", "rating": 4.9, "tier": "Premium", "description": "NSF certified non-corrosive lead-free plumbing pipes."},
    {"category": "Pipes", "name": "Supreme Aqua Gold", "manufacturer": "Supreme Industries", "unit": "Meter", "unit_price": 130.00, "grade_spec": "uPVC Pressure Pipe", "rating": 4.7, "tier": "Standard", "description": "UV resistant pressure pipes for water supply networks."}
]

@router.get("/", response_model=List[BrandOut])
def get_brands(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Brand)
    if category and category.lower() != "all":
        query = query.filter(Brand.category.ilike(f"%{category}%"))
    brands = query.all()
    
    # Auto-seed if database is empty
    if not brands and not category:
        for b_data in SEED_BRANDS:
            b_obj = Brand(**b_data)
            db.add(b_obj)
        db.commit()
        brands = db.query(Brand).all()

    return [BrandOut.model_validate(b) for b in brands]

@router.post("/", response_model=BrandOut, status_code=status.HTTP_201_CREATED)
def create_brand(brand_in: BrandCreate, db: Session = Depends(get_db)):
    brand = Brand(**brand_in.model_dump())
    db.add(brand)
    db.commit()
    db.refresh(brand)
    return BrandOut.model_validate(brand)
