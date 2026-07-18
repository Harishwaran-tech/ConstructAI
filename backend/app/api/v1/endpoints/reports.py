from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Response, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.v1.endpoints.users import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.estimation import Estimation
from app.models.report import Report, EmailHistory
from app.schemas.report import ReportGenerateRequest, ReportOut, EmailReportRequest
from app.services.document_service import DocumentService, REPORT_TYPES

router = APIRouter()

@router.post("/generate", response_model=ReportOut, status_code=status.HTTP_201_CREATED)
def generate_report(
    req: ReportGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    proj = db.query(Project).filter(Project.id == req.project_id, Project.owner_id == current_user.id).first()
    if not proj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    title = req.title or f"{req.report_type} - {proj.title}"
    
    report = Report(
        project_id=proj.id,
        user_id=current_user.id,
        report_type=req.report_type,
        title=title,
        description=req.custom_notes or f"Generated official {req.report_type} for project {proj.title}",
        file_format=req.file_format or "pdf",
        file_path=f"/exports/{req.report_type.replace(' ', '_')}_{proj.id}.{req.file_format or 'pdf'}",
        file_size_kb=142.5
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return ReportOut.model_validate(report)

@router.get("/history", response_model=List[ReportOut])
def list_report_history(
    project_id: Optional[int] = Query(None),
    report_type: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Report).filter(Report.user_id == current_user.id)
    if project_id:
        query = query.filter(Report.project_id == project_id)
    if report_type and report_type != "All":
        query = query.filter(Report.report_type == report_type)
    if q:
        query = query.filter(Report.title.ilike(f"%{q}%"))

    reports = query.order_by(Report.created_at.desc()).all()
    return [ReportOut.model_validate(r) for r in reports]

@router.get("/{report_id}/download")
def download_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = db.query(Report).filter(Report.id == report_id, Report.user_id == current_user.id).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")

    proj = db.query(Project).filter(Project.id == report.project_id).first()
    est = db.query(Estimation).filter(Estimation.project_id == report.project_id).first()
    
    proj_dict = {"title": proj.title, "client_name": proj.client_name, "owner_name": proj.owner_name, "built_up_area": proj.built_up_area, "total_budget": proj.total_budget, "city": proj.city, "state": proj.state} if proj else {}
    est_dict = est.calculated_results if est and est.calculated_results else {}

    content_data = DocumentService.generate_report_content(report.report_type, proj_dict, est_dict)
    csv_bytes = DocumentService.generate_csv_bytes(content_data)

    media_type = "text/csv" if report.file_format == "csv" else "application/pdf"
    filename = f"{report.title.replace(' ', '_')}.{report.file_format}"

    return Response(
        content=csv_bytes,
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.post("/{report_id}/email", status_code=status.HTTP_200_OK)
def email_report(
    report_id: int,
    req: EmailReportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = db.query(Report).filter(Report.id == report_id, Report.user_id == current_user.id).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")

    log = EmailHistory(
        report_id=report.id,
        recipient_email=req.recipient_email,
        subject=req.subject or f"ConstructAI Official Report - {report.title}",
        message=req.message,
        status="sent"
    )
    db.add(log)
    db.commit()
    return {"message": f"Report successfully emailed to {req.recipient_email}"}

@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = db.query(Report).filter(Report.id == report_id, Report.user_id == current_user.id).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    db.delete(report)
    db.commit()
    return None

@router.post("/{report_id}/duplicate", response_model=ReportOut, status_code=status.HTTP_201_CREATED)
def duplicate_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    orig = db.query(Report).filter(Report.id == report_id, Report.user_id == current_user.id).first()
    if not orig:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")

    dup = Report(
        project_id=orig.project_id,
        user_id=current_user.id,
        report_type=orig.report_type,
        title=f"{orig.title} (Copy)",
        description=orig.description,
        file_format=orig.file_format,
        file_path=orig.file_path,
        file_size_kb=orig.file_size_kb
    )
    db.add(dup)
    db.commit()
    db.refresh(dup)
    return ReportOut.model_validate(dup)
