from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, projects, estimations, brands, ai, market, reports, supplier_marketplace, admin, health

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(projects.router, prefix="/projects", tags=["Projects"])
api_router.include_router(estimations.router, prefix="/estimations", tags=["Estimations"])
api_router.include_router(brands.router, prefix="/brands", tags=["Brands"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Copilot"])
api_router.include_router(market.router, prefix="/market", tags=["Market Intelligence"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports & Document Generation"])
api_router.include_router(supplier_marketplace.router, prefix="/marketplace", tags=["Supplier Marketplace"])
api_router.include_router(admin.router, prefix="/admin", tags=["Enterprise Administration"])
