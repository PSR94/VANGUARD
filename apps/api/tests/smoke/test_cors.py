import pytest
from fastapi.testclient import TestClient

from app.config.settings import get_settings
from app.main import create_app


@pytest.mark.parametrize(
    "origin",
    ["http://localhost:3000", "http://127.0.0.1:3000"],
)
def test_cors_allows_local_web_origins(monkeypatch: pytest.MonkeyPatch, origin: str) -> None:
    monkeypatch.setenv("API_CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
    get_settings.cache_clear()

    try:
        client = TestClient(create_app())
        response = client.options(
            "/health",
            headers={
                "Origin": origin,
                "Access-Control-Request-Method": "GET",
            },
        )
    finally:
        get_settings.cache_clear()

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == origin
