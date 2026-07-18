from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.v1.endpoints.users import get_current_user
from app.models.user import User
from app.models.market import PriceAlert, Supplier, MaterialPrice
from app.schemas.market import (
    MaterialPriceOut, 
    PriceHistoryOut, 
    PriceAlertCreate, 
    PriceAlertOut, 
    SupplierOut, 
    BrandCompareItem,
    MarketAnalyticsOut
)
from app.services.pricing_service import PricingService

router = APIRouter()
pricing_service = PricingService()

@router.get("/prices", response_model=List[Dict[str, Any]])
def get_live_prices(
    category: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    q: Optional[str] = Query(None)
):
    prices = pricing_service.get_live_prices()
    if category and category != "All":
        prices = [p for p in prices if p["category"].lower() == category.lower()]
    if brand and brand != "All":
        prices = [p for p in prices if p["brand"].lower() == brand.lower()]
    if q:
        search_fmt = q.lower()
        prices = [
            p for p in prices 
            if search_fmt in p["name"].lower() or search_fmt in p["brand"].lower() or search_fmt in p["category"].lower()
        ]
    return prices

@router.get("/history", response_model=List[Dict[str, Any]])
def get_price_history(timeframe: str = Query("30D", description="7D, 30D, 3M, 6M, 1Y")):
    return pricing_service.get_price_history(timeframe)

@router.get("/compare", response_model=List[BrandCompareItem])
def compare_brands(category: Optional[str] = Query(None)):
    return [BrandCompareItem.model_validate(b) for b in pricing_service.compare_brands(category)]

@router.get("/analytics", response_model=MarketAnalyticsOut)
def get_market_analytics():
    return MarketAnalyticsOut.model_validate(pricing_service.get_market_analytics())

# Price Alerts Endpoints
@router.post("/alerts", response_model=PriceAlertOut, status_code=status.HTTP_201_CREATED)
def create_price_alert(
    alert_in: PriceAlertCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    alert = PriceAlert(
        user_id=current_user.id,
        material_name=alert_in.material_name,
        brand=alert_in.brand,
        target_price=alert_in.target_price,
        condition=alert_in.condition,
        is_active=True
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return PriceAlertOut.model_validate(alert)

@router.get("/alerts", response_model=List[PriceAlertOut])
def list_user_price_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    alerts = db.query(PriceAlert).filter(PriceAlert.user_id == current_user.id).order_by(PriceAlert.created_at.desc()).all()
    return [PriceAlertOut.model_validate(a) for a in alerts]

@router.put("/alerts/{alert_id}", response_model=PriceAlertOut)
def toggle_price_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    alert = db.query(PriceAlert).filter(PriceAlert.id == alert_id, PriceAlert.user_id == current_user.id).first()
    if not alert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alert not found")
    alert.is_active = not alert.is_active
    db.commit()
    db.refresh(alert)
    return PriceAlertOut.model_validate(alert)

@router.delete("/alerts/{alert_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_price_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    alert = db.query(PriceAlert).filter(PriceAlert.id == alert_id, PriceAlert.user_id == current_user.id).first()
    if not alert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alert not found")
    db.delete(alert)
    db.commit()
    return None

# Supplier Directory Endpoints
MOCK_SUPPLIERS = [
    {
        "id": 1,
        "name": "Austin Central Building Materials Hub",
        "company": "Central Wholesale Group Inc",
        "location": "Austin, TX",
        "address": "4820 Industrial Pkwy, Austin, TX 78745",
        "phone": "+1 (512) 555-0182",
        "email": "sales@austincentralmaterials.com",
        "website": "https://austincentralmaterials.com",
        "tier": "Primary Manufacturer Distributor",
        "rating": 4.9,
        "distance": "3.2 miles away",
        "delivery_time": "Same Day (24 hrs)",
        "delivery_charges": 45.0,
        "opening_hours": "Mon-Sat: 6:30 AM - 6:00 PM",
        "categories_stocked": ["Cement", "Steel", "Coarse Aggregate", "M-Sand"],
        "available_brands": ["UltraTech", "ACC", "Tata Tiscon", "JSW"],
        "description": "Authorized wholesale distributor stocking primary TMT steel rebars, ready-mix aggregates, and Portland cement."
    },
    {
        "id": 2,
        "name": "Capital ReadyMix & Masonry Supplies",
        "company": "Capital Materials LLC",
        "location": "Austin, TX",
        "address": "1092 Quarry Road, Austin, TX 78704",
        "phone": "+1 (512) 555-0491",
        "email": "orders@capitalreadymix.com",
        "website": "https://capitalreadymix.com",
        "tier": "Direct Batching Plant",
        "rating": 4.8,
        "distance": "5.8 miles away",
        "delivery_time": "24 Hours",
        "delivery_charges": 60.0,
        "opening_hours": "Mon-Sat: 7:00 AM - 5:30 PM",
        "categories_stocked": ["Cement", "AAC Blocks", "River Sand", "Mortar"],
        "available_brands": ["Ramco", "Ambuja", "Magicrete"],
        "description": "Direct concrete batching plant and masonry block manufacturer with fleet mixer trucks."
    },
    {
        "id": 3,
        "name": "LoneStar Steel & Rebar Mills",
        "company": "LoneStar Steel Group",
        "location": "Round Rock, TX",
        "address": "880 Steel Mill Way, Round Rock, TX 78664",
        "phone": "+1 (512) 555-0923",
        "email": "dispatch@lonestarsteel.com",
        "website": "https://lonestarsteel.com",
        "tier": "Primary Steel Stockist",
        "rating": 4.7,
        "distance": "7.1 miles away",
        "delivery_time": "24-48 Hours",
        "delivery_charges": 75.0,
        "opening_hours": "Mon-Fri: 7:00 AM - 5:00 PM",
        "categories_stocked": ["Steel", "Binding Wire", "Structural Beams"],
        "available_brands": ["Tata Tiscon", "JSW", "Vizag", "Jindal"],
        "description": "Full line rebar yard offering pre-cut, pre-bent, and custom length TMT rebar bundles."
    },
    {
        "id": 4,
        "name": "Premier Plumbing & Electrical Depot",
        "company": "Premier Depot LLC",
        "location": "Pflugerville, TX",
        "address": "320 Supply Line Dr, Pflugerville, TX 78660",
        "phone": "+1 (512) 555-0711",
        "email": "info@premierdepot.com",
        "website": "https://premierdepot.com",
        "tier": "Wholesale Depot",
        "rating": 4.9,
        "distance": "8.4 miles away",
        "delivery_time": "Same Day",
        "delivery_charges": 30.0,
        "opening_hours": "Mon-Sat: 7:00 AM - 7:00 PM",
        "categories_stocked": ["Plumbing", "Electrical", "Paint", "Hardware"],
        "available_brands": ["Astral", "Ashirvad", "Havells", "Asian Paints"],
        "description": "Master distributor stocking CPVC pressure pipes, modular copper wiring spools, and interior paints."
    }
]

@router.get("/suppliers", response_model=List[SupplierOut])
def list_suppliers(
    category: Optional[str] = Query(None),
    q: Optional[str] = Query(None)
):
    suppliers = MOCK_SUPPLIERS
    if category and category != "All":
        suppliers = [s for s in suppliers if category in (s["categories_stocked"] or [])]
    if q:
        search_fmt = q.lower()
        suppliers = [
            s for s in suppliers 
            if search_fmt in s["name"].lower() or search_fmt in s["location"].lower()
        ]
    return [SupplierOut.model_validate(s) for s in suppliers]

@router.get("/suppliers/{supplier_id}", response_model=SupplierOut)
def get_supplier_detail(supplier_id: int):
    supplier = next((s for s in MOCK_SUPPLIERS if s["id"] == supplier_id), None)
    if not supplier:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supplier not found")
    return SupplierOut.model_validate(supplier)
