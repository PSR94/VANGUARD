from fastapi import APIRouter
from pydantic import BaseModel

from app.services.release_service import release_service

router = APIRouter(prefix="/api/v1/releases", tags=["releases"])


class ApproveRequest(BaseModel):
    team: str
    actor: str


class OverrideRequest(BaseModel):
    actor: str
    rationale: str


@router.get("")
def list_releases():
    return release_service.list_releases()


@router.get("/{release_id}")
def get_release(release_id: str):
    return release_service.get_release(release_id)


@router.post("/{release_id}/evaluate")
def evaluate_release(release_id: str):
    return release_service.readiness(release_id)


@router.get("/{release_id}/readiness")
def release_readiness(release_id: str):
    return release_service.readiness(release_id)


@router.post("/{release_id}/approve")
def approve_release(release_id: str, payload: ApproveRequest):
    return release_service.approve(release_id, payload.team, payload.actor)


@router.post("/{release_id}/override")
def override_release(release_id: str, payload: OverrideRequest):
    return release_service.override(release_id, payload.actor, payload.rationale)
