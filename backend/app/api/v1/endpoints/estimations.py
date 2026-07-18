from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.v1.endpoints.users import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.estimation import Estimation
from app.schemas.estimation import EstimationCreate, EstimationOut, MaterialCalculationRequest
from app.services.estimation_engine import EstimationEngine

router = APIRouter()

@router.post("/calculate", response_model=Dict[str, Any])
def calculate_material_quantities(payload: MaterialCalculationRequest):
    return EstimationEngine.calculate_all_materials(payload.model_dump())

@router.post("/generate/{project_id}", response_model=EstimationOut, status_code=status.HTTP_201_CREATED)
def generate_project_estimation(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    project_data = {
        "title": project.title,
        "built_up_area": project.built_up_area,
        "total_budget": project.total_budget,
        "plot_details": project.plot_details or {},
        "structural_details": project.structural_details or {},
        "material_preferences": project.material_preferences or {},
        "labour_details": project.labour_details or {},
        "budget_details": project.budget_details or {},
    }

    result = EstimationEngine.calculate_all_materials(project_data)

    estimation = Estimation(
        title=f"Full Takeoff Report - {project.title}",
        category="Comprehensive Material Takeoff",
        input_params=project_data,
        calculated_results=result,
        total_estimated_cost=result["summary"]["total_material_cost"],
        notes=f"Automated engineering takeoff report generated for project #{project.id}",
        project_id=project.id
    )

    db.add(estimation)
    db.commit()
    db.refresh(estimation)
    return EstimationOut.model_validate(estimation)

@router.post("/{estimation_id}/recalculate", response_model=EstimationOut)
def recalculate_estimation(
    estimation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    estimation = db.query(Estimation).filter(Estimation.id == estimation_id).first()
    if not estimation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estimation not found")

    input_data = estimation.input_params or {}
    if estimation.project_id:
        proj = db.query(Project).filter(Project.id == estimation.project_id, Project.owner_id == current_user.id).first()
        if proj:
            input_data = {
                "title": proj.title,
                "built_up_area": proj.built_up_area,
                "total_budget": proj.total_budget,
                "plot_details": proj.plot_details or {},
                "structural_details": proj.structural_details or {},
                "material_preferences": proj.material_preferences or {},
                "labour_details": proj.labour_details or {},
                "budget_details": proj.budget_details or {},
            }

    result = EstimationEngine.calculate_all_materials(input_data)
    estimation.calculated_results = result
    estimation.total_estimated_cost = result["summary"]["total_material_cost"]

    db.commit()
    db.refresh(estimation)
    return EstimationOut.model_validate(estimation)

@router.post("/", response_model=EstimationOut, status_code=status.HTTP_201_CREATED)
def create_estimation(
    estimation_in: EstimationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    estimation = Estimation(**estimation_in.model_dump())
    db.add(estimation)
    db.commit()
    db.refresh(estimation)
    return EstimationOut.model_validate(estimation)

@router.get("/", response_model=List[EstimationOut])
def list_estimations(
    project_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Estimation)
    if project_id:
        query = query.filter(Estimation.project_id == project_id)
    estimations = query.order_by(Estimation.created_at.desc()).all()
    return [EstimationOut.model_validate(e) for e in estimations]

@router.get("/{estimation_id}", response_model=EstimationOut)
def get_estimation(
    estimation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    estimation = db.query(Estimation).filter(Estimation.id == estimation_id).first()
    if not estimation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estimation not found")
    return EstimationOut.model_validate(estimation)

@router.delete("/{estimation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_estimation(
    estimation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    estimation = db.query(Estimation).filter(Estimation.id == estimation_id).first()
    if not estimation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estimation not found")
    db.delete(estimation)
    db.commit()
    return None
