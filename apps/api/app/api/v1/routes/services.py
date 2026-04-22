from fastapi import APIRouter

from app.core.errors import NotFoundError
from app.services.data_store import get_data_store
from app.services.graph_service import graph_service

router = APIRouter(prefix="/api/v1/services", tags=["services"])


ds = get_data_store()


@router.get("")
def list_services():
    return ds.services()


@router.get("/{service_id}")
def get_service(service_id: str):
    for svc in ds.services():
        if svc["id"] == service_id:
            return svc
    raise NotFoundError("service", service_id)


@router.get("/{service_id}/graph")
def get_service_graph(service_id: str):
    return graph_service.service_graph(service_id)
