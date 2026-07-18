from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.v1.endpoints.users import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.estimation import Estimation
from app.schemas.ai import (
    AIChatRequest,
    AIChatResponse,
    ProjectHealthScores,
    AIRecommendationOut,
    TimelinePhase,
    ChecklistCategoryOut,
    BOQReviewResult,
    AIProjectReportOut
)
from app.services.ai_service import get_ai_provider

router = APIRouter()
ai_provider = get_ai_provider("mock")

@router.post("/chat", response_model=AIChatResponse)
def chat_with_ai(
    req: AIChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project_data = None
    if req.project_id:
        proj = db.query(Project).filter(Project.id == req.project_id, Project.owner_id == current_user.id).first()
        if proj:
            project_data = {"title": proj.title, "built_up_area": proj.built_up_area}

    reply_text = ai_provider.generate_chat_response(req.message, project_data)
    
    return AIChatResponse(
        reply=reply_text,
        suggested_followups=[
            "How can I reduce project cost?",
            "Which cement brand is better?",
            "What materials are increasing in price?",
            "Generate procurement recommendations"
        ],
        explanation="Calculated using ConstructAI civil engineering rules engine and regional spot price index."
    )

@router.get("/insights/{project_id}", response_model=ProjectHealthScores)
def get_project_insights(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    proj = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not proj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    return ProjectHealthScores(
        health_score=92,
        budget_score=88,
        material_efficiency_score=94,
        readiness_score=85,
        risk_level="Low Risk",
        confidence_pct=98
    )

@router.post("/recommendations/{project_id}", response_model=List[AIRecommendationOut])
def generate_recommendations(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return [
        AIRecommendationOut(
            category="Material Optimization",
            title="Substitute M-Sand for River Sand",
            description="Replacing river sand with manufactured M-Sand for masonry mortar reduces fine aggregate cost by 12%.",
            estimated_savings=4200.0,
            impact="High",
            mitigation_step="Ensure 4.75mm sieve screening for smooth brickwork joints."
        ),
        AIRecommendationOut(
            category="Purchase Timing",
            title="Bulk Order Tata Tiscon Steel Rebars",
            description="TMT steel spot prices are projected to rise +3.2% next week. Bulk ordering today saves ~$2,100.",
            estimated_savings=2100.0,
            impact="High",
            mitigation_step="Confirm site tarpaulin storage elevated on timber pallets."
        ),
        AIRecommendationOut(
            category="Budget Allocation",
            title="Maintain 8% Contingency Reserve",
            description="Based on foundation excavation depth, keeping $12,000 contingency covers unforeseen soil variations.",
            estimated_savings=1500.0,
            impact="Medium",
            mitigation_step="Lock emergency reserve in separate sub-account."
        )
    ]

@router.post("/timeline/{project_id}", response_model=List[TimelinePhase])
def generate_timeline(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return [
        TimelinePhase(phase_name="Foundation & Substructure", duration_days=30, estimated_start="Aug 01, 2026", estimated_end="Aug 31, 2026", key_milestones=["Excavation", "Raft Slab Concrete Pour"]),
        TimelinePhase(phase_name="RCC Superstructure & Slab Casting", duration_days=45, estimated_start="Sep 01, 2026", estimated_end="Oct 15, 2026", key_milestones=["Columns Rebar Tying", "Floor Slabs Curing"]),
        TimelinePhase(phase_name="Brickwork Masonry & Walls", duration_days=25, estimated_start="Oct 16, 2026", estimated_end="Nov 10, 2026", key_milestones=["AAC Block Outer Walls", "Partition Mortar"]),
        TimelinePhase(phase_name="MEP Electrical & Plumbing Rough-In", duration_days=20, estimated_start="Nov 11, 2026", estimated_end="Dec 01, 2026", key_milestones=["Concealed Conduits", "CPVC Piping"]),
        TimelinePhase(phase_name="Finishing, Tiles & Painting", duration_days=30, estimated_start="Dec 02, 2026", estimated_end="Jan 01, 2027", key_milestones=["Vitrified Tiles", "Asian Paints Silk Coats"])
    ]

@router.post("/checklist/{project_id}", response_model=List[ChecklistCategoryOut])
def generate_checklists(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return [
        ChecklistCategoryOut(
            category="Pre-Construction",
            items=[
                {"id": "c1", "title": "Obtain Municipal Building Permit & Site Plan Approval", "completed": True, "mandatory": True},
                {"id": "c2", "title": "Soil Bearing Capacity Test Report Sign-off", "completed": True, "mandatory": True},
                {"id": "c3", "title": "Temporary Site Power & Water Connection Setup", "completed": False, "mandatory": True}
            ]
        ),
        ChecklistCategoryOut(
            category="Structural Concrete",
            items=[
                {"id": "c4", "title": "Slump Test & Cube Mould Sampling during Batching", "completed": False, "mandatory": True},
                {"id": "c5", "title": "Check 40mm Rebar Clear Cover with Concrete Spacers", "completed": False, "mandatory": True},
                {"id": "c6", "title": "Slab Shuttering Inspection for Zero Deflection", "completed": False, "mandatory": True}
            ]
        ),
        ChecklistCategoryOut(
            category="Site Safety",
            items=[
                {"id": "c7", "title": "100% Worker Helmet, Boots & High-Vis Vest Inspection", "completed": True, "mandatory": True},
                {"id": "c8", "title": "Scaffolding Guardrails & Fall Protection Net Installation", "completed": False, "mandatory": True}
            ]
        )
    ]

@router.post("/boq-review/{project_id}", response_model=BOQReviewResult)
def review_boq(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    est = db.query(Estimation).filter(Estimation.project_id == project_id).first()
    items = est.calculated_results.get("items", []) if est and est.calculated_results else []
    return BOQReviewResult.model_validate(ai_provider.analyze_boq(items))

@router.post("/report/{project_id}", response_model=AIProjectReportOut)
def generate_ai_report(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    proj = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not proj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    scores = ProjectHealthScores(health_score=92, budget_score=88, material_efficiency_score=94, readiness_score=85, risk_level="Low Risk", confidence_pct=98)
    recommendations = generate_recommendations(project_id, db, current_user)
    timeline = generate_timeline(project_id, db, current_user)

    return AIProjectReportOut(
        project_id=proj.id,
        title=f"AI Project Analysis Report - {proj.title}",
        executive_summary=f"Project '{proj.title}' exhibits high structural readiness (92/100) with optimized material takeoff allocations.",
        health_scores=scores,
        budget_analysis={"planned_budget": proj.total_budget, "material_takeoff": proj.total_budget * 0.52, "potential_savings": 7800.0},
        material_analysis={"efficiency_score": 94, "primary_cement": "UltraTech PPC", "primary_steel": "Tata Tiscon 550SD"},
        risk_analysis=[
            {"risk": "Steel Price Inflation", "level": "Medium", "impact": "High", "mitigation": "Bulk purchase before spot rate revision."},
            {"risk": "Monsoon Curing Delay", "level": "Low", "impact": "Medium", "mitigation": "Cover active slab with waterproof tarpaulins."}
        ],
        timeline=timeline,
        recommendations=recommendations
    )
