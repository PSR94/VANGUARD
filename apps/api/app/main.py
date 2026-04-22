import time
import uuid

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.routes.health import router as health_router
from app.api.v1.routes.misc import router as misc_router
from app.api.v1.routes.policies import router as policy_router
from app.api.v1.routes.pull_requests import router as pr_router
from app.api.v1.routes.releases import router as release_router
from app.api.v1.routes.services import router as service_router
from app.config.settings import get_settings
from app.core.errors import VanguardError
from app.core.logging import configure_logging, request_id_ctx


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging(settings.vanguard_log_level)

    app = FastAPI(title="VANGUARD API", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def add_request_context(request: Request, call_next):
        request_id = request.headers.get("x-request-id", str(uuid.uuid4()))
        token = request_id_ctx.set(request_id)
        start = time.perf_counter()
        try:
            response = await call_next(request)
            elapsed_ms = int((time.perf_counter() - start) * 1000)
            response.headers["x-request-id"] = request_id
            response.headers["x-latency-ms"] = str(elapsed_ms)
            return response
        finally:
            request_id_ctx.reset(token)

    @app.exception_handler(VanguardError)
    async def vanguard_error_handler(_: Request, exc: VanguardError):
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": {"code": exc.code, "message": exc.message}},
        )

    @app.exception_handler(Exception)
    async def unhandled_error_handler(_: Request, exc: Exception):
        return JSONResponse(
            status_code=500,
            content={"error": {"code": "internal_error", "message": str(exc)}},
        )

    app.include_router(health_router)
    app.include_router(pr_router)
    app.include_router(release_router)
    app.include_router(service_router)
    app.include_router(policy_router)
    app.include_router(misc_router)
    return app


app = create_app()
