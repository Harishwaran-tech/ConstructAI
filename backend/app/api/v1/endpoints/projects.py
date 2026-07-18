from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.v1.endpoints.users import get_current_user
from app.models.user import User
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectOut

router = APIRouter()

@router.get("/", response_model=List[ProjectOut])
def list_user_projects(
    q: Optional[str] = Query(None, description="Search term for title, client, location, city"),
    project_type: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None),
    min_budget: Optional[float] = Query(None),
    max_budget: Optional[float] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Project).filter(Project.owner_id == current_user.id)
    
    if q:
        search_fmt = f"%{q}%"
        query = query.filter(
            (Project.title.ilike(search_fmt)) |
            (Project.client_name.ilike(search_fmt)) |
            (Project.location.ilike(search_fmt)) |
            (Project.city.ilike(search_fmt))
        )
        
    if project_type and project_type != "All":
        query = query.filter(Project.project_type == project_type)

    if status_filter and status_filter != "All":
        query = query.filter(Project.status == status_filter)

    if min_budget is not None:
        query = query.filter(Project.total_budget >= min_budget)

    if max_budget is not None:
        query = query.filter(Project.total_budget <= max_budget)

    projects = query.order_by(Project.created_at.desc()).all()
    return [ProjectOut.model_validate(p) for p in projects]

@router.post("/", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = Project(
        **project_in.model_dump(),
        owner_id=current_user.id
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return ProjectOut.model_validate(project)

@router.get("/{project_id}", response_model=ProjectOut)
def get_project_by_id(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return ProjectOut.model_validate(project)

@router.put("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: int,
    project_in: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    update_data = project_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return ProjectOut.model_validate(project)

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    db.delete(project)
    db.commit()
    return None

@router.post("/{project_id}/duplicate", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def duplicate_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    original = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not original:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    cloned = Project(
        title=f"{original.title} (Copy)",
        description=original.description,
        client_name=original.client_name,
        owner_name=original.owner_name,
        location=original.location,
        city=original.city,
        state=original.state,
        country=original.country,
        pincode=original.pincode,
        google_maps_url=original.google_maps_url,
        project_type=original.project_type,
        built_up_area=original.built_up_area,
        total_budget=original.total_budget,
        currency=original.currency,
        measurement_units=original.measurement_units,
        status="Planning",
        completion_percentage=0,
        start_date=original.start_date,
        end_date=original.end_date,
        plot_details=original.plot_details,
        structural_details=original.structural_details,
        material_preferences=original.material_preferences,
        labour_details=original.labour_details,
        budget_details=original.budget_details,
        owner_id=current_user.id
    )

    db.add(cloned)
    db.commit()
    db.refresh(cloned)
    return ProjectOut.model_validate(cloned)
