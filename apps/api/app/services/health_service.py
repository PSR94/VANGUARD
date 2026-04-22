import socket
from urllib.parse import urlparse

from app.config.settings import get_settings


class HealthService:
    def app_health(self) -> dict:
        return {"status": "ok", "service": "vanguard-api"}

    def dependencies(self) -> dict:
        cfg = get_settings()

        def check_endpoint(endpoint: str, default_port: int) -> str:
            parsed = urlparse(endpoint)
            host = parsed.hostname
            port = parsed.port or default_port
            if not host:
                return "unknown"
            try:
                with socket.create_connection((host, port), timeout=1):
                    return "up"
            except OSError:
                return "down"

        postgres_endpoint = cfg.postgres_url.replace("postgresql+psycopg://", "postgresql://")

        return {
            "postgres": check_endpoint(postgres_endpoint, 5432),
            "redis": check_endpoint(cfg.redis_url, 6379),
            "neo4j": check_endpoint(cfg.neo4j_uri, 7687),
            "opensearch": check_endpoint(cfg.opensearch_url, 9200),
        }


health_service = HealthService()
