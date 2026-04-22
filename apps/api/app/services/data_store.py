import json
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.config.settings import get_settings


class DataStore:
    def __init__(self, dataset_root: str):
        root = Path(dataset_root)
        if not root.exists():
            repo_root = Path(__file__).resolve().parents[4]
            fallback = repo_root / "datasets"
            self.root = fallback if fallback.exists() else root
        else:
            self.root = root

    def _read_json(self, relative: str) -> Any:
        with (self.root / relative).open("r", encoding="utf-8") as fh:
            return json.load(fh)

    def repositories(self) -> list[dict[str, Any]]:
        return self._read_json("repositories/repositories.json")

    def pull_requests(self) -> list[dict[str, Any]]:
        return self._read_json("pull_requests/pull_requests.json")

    def ci_runs(self) -> list[dict[str, Any]]:
        return self._read_json("ci_runs/ci_runs.json")

    def test_runs(self) -> list[dict[str, Any]]:
        return self._read_json("test_runs/test_runs.json")

    def releases(self) -> list[dict[str, Any]]:
        return self._read_json("releases/releases.json")

    def services(self) -> list[dict[str, Any]]:
        return self._read_json("ownership/services.json")

    def owners(self) -> list[dict[str, Any]]:
        return self._read_json("ownership/owners.json")

    def policies(self) -> list[dict[str, Any]]:
        return self._read_json("policies/policies.json")

    def benchmarks(self) -> list[dict[str, Any]]:
        return self._read_json("evals/benchmarks.json")

    def graph(self) -> dict[str, Any]:
        return self._read_json("examples/dependency_graph.json")


@lru_cache(maxsize=1)
def get_data_store() -> DataStore:
    settings = get_settings()
    return DataStore(settings.dataset_root)
