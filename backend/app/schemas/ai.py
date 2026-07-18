from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class AIChatMessage(BaseModel):
    role: str # user or assistant
    content: str
    timestamp: Optional[str] = None

class AIChatRequest(BaseModel):
    message: str
    project_id: Optional[int] = None
    conversation_history: Optional[List[AIChatMessage]] = []

class AIChatResponse(BaseModel):
    reply: str
    suggested_followups: Optional[List[str]] = []
    explanation: Optional[str] = None

class ProjectHealthScores(BaseModel):
    health_score: int
    budget_score: int
    material_efficiency_score: int
    readiness_score: int
    risk_level: str
    confidence_pct: int

class AIRecommendationOut(BaseModel):
    category: str
    title: str
    description: str
    estimated_savings: float
    impact: str
    mitigation_step: Optional[str] = None

class TimelinePhase(BaseModel):
    phase_name: str
    duration_days: int
    estimated_start: str
    estimated_end: str
    key_milestones: List[str]

class ChecklistItem(BaseModel):
    id: str
    title: str
    completed: bool
    mandatory: bool

class ChecklistCategoryOut(BaseModel):
    category: str
    items: List[ChecklistItem]

class BOQReviewResult(BaseModel):
    missing_items: List[str]
    duplicate_items: List[str]
    inconsistencies: List[str]
    cost_anomalies: List[str]
    overall_health_verdict: str

class AIProjectReportOut(BaseModel):
    project_id: int
    title: str
    executive_summary: str
    health_scores: ProjectHealthScores
    budget_analysis: Dict[str, Any]
    material_analysis: Dict[str, Any]
    risk_analysis: List[Dict[str, Any]]
    timeline: List[TimelinePhase]
    recommendations: List[AIRecommendationOut]
