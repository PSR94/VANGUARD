from fastapi import APIRouter
from pydantic import BaseModel

from app.services.analysis_service import analysis_service
from app.services.data_store import get_data_store
from app.services.policy_service import policy_service

router = APIRouter(prefix="/api/v1/policies", tags=["policies"])


ds = get_data_store()


class EvaluatePolicyRequest(BaseModel):
    pr_id: str
    release_mode: bool = False


@router.get("")
def list_policies():
    return ds.policies()


@router.post("/evaluate")
def evaluate_policies(payload: EvaluatePolicyRequest):
    analysis = analysis_service.analyze_pr(payload.pr_id)
    return policy_service.evaluate(ds.policies(), analysis.pr, analysis.risk, release_mode=payload.release_mode)
