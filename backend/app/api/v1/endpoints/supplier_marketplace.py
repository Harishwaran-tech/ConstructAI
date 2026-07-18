from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.v1.endpoints.users import get_current_user
from app.models.user import User
from app.models.supplier_marketplace import (
    Supplier, 
    SupplierProfile, 
    SupplierMaterial, 
    MaterialInventory, 
    QuotationRequest, 
    SupplierReview, 
    FavoriteSupplier
)
from app.schemas.supplier_marketplace import (
    SupplierMarketplaceOut,
    SupplierMaterialOut,
    SupplierReviewOut,
    RFQCreateRequest,
    RFQOut,
    ReviewCreateRequest,
    SupplierCompareOut
)

router = APIRouter()

# Seeded Mock Data for Development
MOCK_MARKETPLACE_SUPPLIERS = [
    {
        "id": 1,
        "name": "Mumbai Central Building Hub",
        "company": "Central Wholesale Group India",
        "logo": "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?w=150&auto=format&fit=crop&q=80",
        "tier": "Primary Manufacturer Distributor",
        "phone": "+91 98201 55018",
        "email": "sales@mumbaicentralmaterials.in",
        "website": "https://mumbaicentralmaterials.in",
        "gst_number": "GST27AAACU9823C1Z8",
        "business_registration": "REG-MH-2018-992",
        "address": "4820 Industrial Pkwy, Andheri East, Mumbai, MH 400069",
        "city": "Mumbai",
        "state": "MH",
        "lat": 19.1136,
        "lng": 72.8697,
        "distance_miles": 3.2,
        "travel_time_mins": 12,
        "rating": 4.9,
        "review_count": 48,
        "is_verified": True,
        "is_open_now": True,
        "opening_hours": "Mon-Sat: 6:30 AM - 6:00 PM",
        "branches": ["Andheri East, Mumbai", "Thane West, Mumbai"],
        "payment_methods": ["NEFT / RTGS Wire", "UPI Payment", "Credit Card", "Net 30 Credit"],
        "certifications": ["ISO 9001:2015", "BIS Structural Steel Mark", "IS 1489 Cement Certified"],
        "gallery": [
            "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80"
        ],
        "description": "Authorized master wholesale stockist for UltraTech Cement, Tata Tiscon TMT Steel, and washed M-Sand aggregates.",
        "materials": [
            {"id": 101, "supplier_id": 1, "material_name": "UltraTech Super Cement", "category": "Cement", "brand": "UltraTech", "grade": "PPC 53 Grade", "specs": "Compressive strength > 53 MPa at 28 days", "unit": "50kg Bag", "current_price": 385.00, "discount_pct": 5.0, "available_qty": 4500, "stock_status": "In Stock", "restock_date": "Tomorrow", "delivery_time": "24 Hours", "delivery_charge": 450.0, "min_order": 50, "max_order": 10000},
            {"id": 102, "supplier_id": 1, "material_name": "Tata Tiscon 550SD TMT", "category": "Steel", "brand": "Tata Tiscon", "grade": "Fe 550D TMT", "specs": "Seismic earthquake resistant Fe 550D rebar", "unit": "kg", "current_price": 66.50, "discount_pct": 2.0, "available_qty": 28000, "stock_status": "In Stock", "restock_date": "Jul 22", "delivery_time": "24 Hours", "delivery_charge": 500.0, "min_order": 500, "max_order": 50000},
            {"id": 103, "supplier_id": 1, "material_name": "Manufactured M-Sand", "category": "Sand", "brand": "Regional Crusher", "grade": "Zone II Fine", "specs": "Triple washed crushed granite sand", "unit": "cu ft", "current_price": 55.00, "discount_pct": 0.0, "available_qty": 12000, "stock_status": "In Stock", "restock_date": "Immediate", "delivery_time": "Same Day", "delivery_charge": 350.0, "min_order": 100, "max_order": 20000}
        ],
        "reviews": [
            {"id": 1, "supplier_id": 1, "user_id": 10, "user_name": "John Miller (Lead Contractor)", "rating": 5.0, "comment": "Fastest delivery in Mumbai region. Cement bags delivered perfectly wrapped on wooden pallets.", "created_at": "2026-07-10T10:00:00Z"},
            {"id": 2, "supplier_id": 1, "user_id": 12, "user_name": "Sarah Jenkins (Site Manager)", "rating": 4.8, "comment": "Excellent TMT rebar quality with full batch test certificates attached.", "created_at": "2026-07-05T14:30:00Z"}
        ]
    },
    {
        "id": 2,
        "name": "Delhi ReadyMix & Masonry Supplies",
        "company": "Capital Materials India",
        "logo": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=150&auto=format&fit=crop&q=80",
        "tier": "Direct Batching Plant",
        "phone": "+91 98110 50491",
        "email": "orders@delhireadymix.in",
        "website": "https://delhireadymix.in",
        "gst_number": "GST07AAACC4491D1Z2",
        "business_registration": "REG-DL-2015-881",
        "address": "1092 Okhla Industrial Area, Phase 3, Delhi NCR 110020",
        "city": "Delhi NCR",
        "state": "DL",
        "lat": 28.5355,
        "lng": 77.2610,
        "distance_miles": 5.8,
        "travel_time_mins": 18,
        "rating": 4.8,
        "review_count": 32,
        "is_verified": True,
        "is_open_now": True,
        "opening_hours": "Mon-Sat: 7:00 AM - 5:30 PM",
        "branches": ["Okhla Phase 3, Delhi NCR"],
        "payment_methods": ["NEFT / RTGS", "Cheque", "Net 15 Credit"],
        "certifications": ["NRMCA Certified Plant", "IS 456 Concrete Testing"],
        "gallery": [
            "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?w=600&auto=format&fit=crop&q=80"
        ],
        "description": "Direct ready-mix concrete batching plant and masonry AAC lightweight block manufacturer.",
        "materials": [
            {"id": 201, "supplier_id": 2, "material_name": "AAC Lightweight Blocks", "category": "AAC Blocks", "brand": "Magicrete", "grade": "Class A Blocks", "specs": "Autoclaved aerated concrete block 600x200x150mm", "unit": "piece", "current_price": 65.00, "discount_pct": 8.0, "available_qty": 8500, "stock_status": "In Stock", "restock_date": "Jul 20", "delivery_time": "24 Hours", "delivery_charge": 600.0, "min_order": 100, "max_order": 15000},
            {"id": 202, "supplier_id": 2, "material_name": "Natural River Sand", "category": "Sand", "brand": "Dredged Basin", "grade": "Coarse Natural", "specs": "Coarse river sand for heavy structural RCC", "unit": "cu ft", "current_price": 85.00, "discount_pct": 0.0, "available_qty": 350, "stock_status": "Low Stock", "restock_date": "Jul 25", "delivery_time": "48 Hours", "delivery_charge": 750.0, "min_order": 200, "max_order": 5000}
        ],
        "reviews": [
            {"id": 3, "supplier_id": 2, "user_id": 14, "user_name": "David Ross (Civil Contractor)", "rating": 4.8, "comment": "Mixer trucks arrived precisely on schedule for slab pour.", "created_at": "2026-07-08T09:15:00Z"}
        ]
    },
    {
        "id": 3,
        "name": "Bengaluru Steel & Rebar Mills",
        "company": "Bengaluru Steel Group",
        "logo": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=150&auto=format&fit=crop&q=80",
        "tier": "Primary Steel Stockist",
        "phone": "+91 98450 50923",
        "email": "dispatch@bengalurusteel.in",
        "website": "https://bengalurusteel.in",
        "gst_number": "GST29AAACL1102E1Z5",
        "business_registration": "REG-KA-2020-410",
        "address": "880 Peenya Industrial Area 4th Phase, Bengaluru, KA 560058",
        "city": "Bengaluru",
        "state": "KA",
        "lat": 13.0285,
        "lng": 77.5197,
        "distance_miles": 7.1,
        "travel_time_mins": 22,
        "rating": 4.7,
        "review_count": 19,
        "is_verified": True,
        "is_open_now": False,
        "opening_hours": "Mon-Fri: 7:00 AM - 5:00 PM",
        "branches": ["Peenya 4th Phase, Bengaluru"],
        "payment_methods": ["Corporate RTGS", "Net 30 Credit"],
        "certifications": ["ISO 9001", "BIS Welding Certification"],
        "gallery": [],
        "description": "Primary steel yard featuring pre-cut and pre-bent custom length TMT rebar bundles.",
        "materials": [
            {"id": 301, "supplier_id": 3, "material_name": "JSW Neosteel TMT", "category": "Steel", "brand": "JSW", "grade": "Fe 500D TMT", "specs": "Clean steel high bond strength TMT bars", "unit": "kg", "current_price": 63.50, "discount_pct": 3.0, "available_qty": 35000, "stock_status": "In Stock", "restock_date": "Immediate", "delivery_time": "24 Hours", "delivery_charge": 550.0, "min_order": 1000, "max_order": 100000}
        ],
        "reviews": []
    }
]

@router.get("/suppliers", response_model=List[SupplierMarketplaceOut])
def get_nearby_suppliers(
    category: Optional[str] = Query(None),
    max_distance: Optional[float] = Query(None),
    min_rating: Optional[float] = Query(None),
    verified_only: Optional[bool] = Query(False),
    q: Optional[str] = Query(None),
    sort_by: Optional[str] = Query("nearest") # nearest, highest_rated, lowest_price
):
    suppliers = MOCK_MARKETPLACE_SUPPLIERS
    if verified_only:
        suppliers = [s for s in suppliers if s["is_verified"]]
    if min_rating:
        suppliers = [s for s in suppliers if s["rating"] >= min_rating]
    if max_distance:
        suppliers = [s for s in suppliers if s["distance_miles"] <= max_distance]
    if category and category != "All":
        suppliers = [
            s for s in suppliers 
            if any(m["category"].lower() == category.lower() for m in s.get("materials", []))
        ]
    if q:
        search_fmt = q.lower()
        suppliers = [
            s for s in suppliers 
            if search_fmt in s["name"].lower() or search_fmt in s["company"].lower() or search_fmt in s["address"].lower()
        ]

    if sort_by == "highest_rated":
        suppliers = sorted(suppliers, key=lambda x: x["rating"], reverse=True)
    elif sort_by == "nearest":
        suppliers = sorted(suppliers, key=lambda x: x["distance_miles"])

    return [SupplierMarketplaceOut.model_validate(s) for s in suppliers]

@router.get("/suppliers/{supplier_id}", response_model=SupplierMarketplaceOut)
def get_supplier_detail(supplier_id: int):
    supplier = next((s for s in MOCK_MARKETPLACE_SUPPLIERS if s["id"] == supplier_id), None)
    if not supplier:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supplier not found")
    return SupplierMarketplaceOut.model_validate(supplier)

@router.get("/suppliers/{supplier_id}/materials", response_model=List[SupplierMaterialOut])
def get_supplier_materials(supplier_id: int):
    supplier = next((s for s in MOCK_MARKETPLACE_SUPPLIERS if s["id"] == supplier_id), None)
    if not supplier:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supplier not found")
    return [SupplierMaterialOut.model_validate(m) for m in supplier.get("materials", [])]

# RFQ Endpoints
@router.post("/quotations", response_model=RFQOut, status_code=status.HTTP_201_CREATED)
def request_quotation(
    req: RFQCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rfq = QuotationRequest(
        user_id=current_user.id,
        project_id=req.project_id,
        supplier_ids=req.supplier_ids,
        items=req.items,
        notes=req.notes,
        status="Quoted",
        total_quoted_amount=4850.0
    )
    db.add(rfq)
    db.commit()
    db.refresh(rfq)
    return RFQOut.model_validate(rfq)

@router.get("/quotations", response_model=List[RFQOut])
def list_quotation_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rfqs = db.query(QuotationRequest).filter(QuotationRequest.user_id == current_user.id).order_by(QuotationRequest.created_at.desc()).all()
    return [RFQOut.model_validate(r) for r in rfqs]

@router.post("/compare", response_model=List[SupplierCompareOut])
def compare_suppliers(supplier_ids: List[int]):
    result = []
    for sid in supplier_ids:
        s = next((item for item in MOCK_MARKETPLACE_SUPPLIERS if item["id"] == sid), None)
        if s:
            result.append(SupplierCompareOut(
                supplier_id=s["id"],
                name=s["name"],
                company=s["company"],
                price_total=4850.0 if sid == 1 else 5120.0,
                distance_miles=s["distance_miles"],
                delivery_time=s["materials"][0]["delivery_time"] if s.get("materials") else "24 Hours",
                delivery_charge=s["materials"][0]["delivery_charge"] if s.get("materials") else 45.0,
                rating=s["rating"],
                stock_availability="In Stock",
                recommendation_badge="Best Value & Speed" if sid == 1 else "Standard Delivery"
            ))
    return result

@router.post("/suppliers/{supplier_id}/reviews", response_model=SupplierReviewOut, status_code=status.HTTP_201_CREATED)
def submit_supplier_review(
    supplier_id: int,
    review_in: ReviewCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rev = SupplierReview(
        supplier_id=supplier_id,
        user_id=current_user.id,
        user_name=current_user.full_name or "Verified Contractor",
        rating=review_in.rating,
        comment=review_in.comment,
        images=review_in.images
    )
    db.add(rev)
    db.commit()
    db.refresh(rev)
    return SupplierReviewOut.model_validate(rev)

@router.post("/suppliers/{supplier_id}/favorite", status_code=status.HTTP_200_OK)
def toggle_favorite(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    fav = db.query(FavoriteSupplier).filter(FavoriteSupplier.user_id == current_user.id, FavoriteSupplier.supplier_id == supplier_id).first()
    if fav:
        db.delete(fav)
        db.commit()
        return {"status": "removed", "is_favorite": False}
    else:
        new_fav = FavoriteSupplier(user_id=current_user.id, supplier_id=supplier_id)
        db.add(new_fav)
        db.commit()
        return {"status": "added", "is_favorite": True}
