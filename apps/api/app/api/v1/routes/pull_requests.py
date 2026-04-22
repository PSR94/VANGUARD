from fastapi import APIRouter

from app.services.analysis_service import analysis_service
from app.services.pr_service import pr_service

router = APIRouter(prefix="/api/v1/pull-requests", tags=["pull-requests"])


@router.get("")
def list_prs():
    return pr_service.list_pull_requests()


@router.get("/{pr_id}")
def get_pr(pr_id: str):
    return pr_service.get_pull_request(pr_id)


@router.post("/{pr_id}/analyze")
def analyze_pr(pr_id: str):
    return analysis_service.analyze_pr(pr_id, actor="api-user")


@router.get("/{pr_id}/impact")
def pr_impact(pr_id: str):
    result = analysis_service.analyze_pr(pr_id)
    return {
        "pr_id": pr_id,
        "impacted_services": result.impacted_services,
        "impacted_modules": result.impacted_modules,
        "blast_radius_depth": result.blast_radius_depth,
    }


@router.get("/{pr_id}/reviewers")
def pr_reviewers(pr_id: str):
    return analysis_service.analyze_pr(pr_id).reviewer_recommendations


@router.get("/{pr_id}/tests")
def pr_tests(pr_id: str):
    return pr_service.get_tests(pr_id)


@router.get("/{pr_id}/ci")
def pr_ci(pr_id: str):
    return pr_service.get_ci(pr_id)


@router.get("/{pr_id}/risk")
def pr_risk(pr_id: str):
    return analysis_service.analyze_pr(pr_id).risk
