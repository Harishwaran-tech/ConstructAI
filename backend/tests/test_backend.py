import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.database import Base, get_db
from app.services.estimation_engine import EstimationEngine
from app.schemas.estimation import EstimationCalculateRequest

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_user_registration_and_login():
    reg_payload = {
        "email": "testengineer@constructai.com",
        "password": "SecurePassword123!",
        "full_name": "Test Civil Engineer",
        "role": "Civil Engineer",
        "company_name": "ConstructAI Engineering Firm"
    }
    reg_res = client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_res.status_code == 201
    data = reg_res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "testengineer@constructai.com"

    login_res = client.post("/api/v1/auth/login", json={
        "email": "testengineer@constructai.com",
        "password": "SecurePassword123!"
    })
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert "access_token" in login_data

def test_concrete_estimation_math():
    req = EstimationCalculateRequest(
        category="Concrete",
        length=20.0,
        width=10.0,
        height_or_depth=0.5,
        quantity=1.0,
        concrete_grade="M20",
        steel_percentage=1.5
    )
    result = EstimationEngine.calculate(req)
    assert result["volume_cuft"] == 100.0
    assert result["total_estimated_cost"] > 0
    assert len(result["materials"]) == 4

def test_masonry_estimation_math():
    req = EstimationCalculateRequest(
        category="Masonry",
        length=50.0,
        height_or_depth=10.0,
        width=0.75,
        mortar_ratio="1:6"
    )
    result = EstimationEngine.calculate(req)
    assert result["wall_area_sqft"] == 500.0
    assert len(result["materials"]) == 3
