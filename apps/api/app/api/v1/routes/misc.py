from fastapi import APIRouter

from app.services.audit_service import audit_service
from app.services.eval_service import eval_service
from app.services.insights_service import insights_service
from app.services.provider_service import provider_service

router = APIRouter(prefix="/api/v1", tags=["misc"])


@router.get("/audit")
def audit_logs():
    return audit_service.list()


@router.get("/evals")
def evals():
    return eval_service.list_runs()


@router.post("/evals/run")
def run_evals():
    return eval_service.run()


@router.get("/providers")
def providers():
    return provider_service.metadata()


@router.get("/config/public")
def public_config():
    return {
        "product": "VANGUARD",
        "mode": "local-first",
        "provider": provider_service.metadata(),
    }


@router.get("/insights")
def insights():
    return insights_service.engineering_insights()
