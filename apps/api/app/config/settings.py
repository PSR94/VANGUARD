from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    vanguard_env: str = "local"
    vanguard_log_level: str = "INFO"
    api_host: str = "0.0.0.0"
    api_port: int = 8080
    api_cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    dataset_root: str = "/workspace/datasets"
    postgres_url: str = "postgresql+psycopg://vanguard:vanguard@postgres:5432/vanguard"
    redis_url: str = "redis://redis:6379/0"
    neo4j_uri: str = "bolt://neo4j:7687"
    neo4j_username: str = "neo4j"
    neo4j_password: str = "vanguardneo4j"
    opensearch_url: str = "http://opensearch:9200"
    llm_provider: str = "deterministic-local"
    llm_model: str = "vanguard-grounded-v1"

    @property
    def cors_origins(self) -> list[str]:
        return [item.strip() for item in self.api_cors_origins.split(",") if item.strip()]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
