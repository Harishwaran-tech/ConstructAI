from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.core.database import get_db

router = APIRouter()

@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    db_status = "healthy"
    try:
        db.execute("SELECT 1")
    except Exception:
        db_status = "unreachable"

    return {
        "status": "online",
        "service": "ConstructAI API Engine",
        "version": "2.4.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "database": db_status
    }
