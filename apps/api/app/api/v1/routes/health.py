from fastapi import APIRouter
from app.services.health_service import health_service

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict:
    return health_service.app_health()


@router.get("/health/dependencies")
def dependency_health() -> dict:
    return health_service.dependencies()
