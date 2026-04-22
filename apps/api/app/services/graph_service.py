from collections import deque
from typing import Any

from app.services.data_store import get_data_store


class GraphService:
    def __init__(self) -> None:
        self.ds = get_data_store()

    def service_graph(self, service_id: str, max_depth: int = 3) -> dict[str, Any]:
        graph = self.ds.graph()
        edges = graph["edges"]
        adjacency: dict[str, list[tuple[str, str]]] = {}
        for edge in edges:
            adjacency.setdefault(edge["from"], []).append((edge["to"], edge["type"]))

        seen = {service_id}
        queue = deque([(service_id, 0)])
        traversed = []

        while queue:
            node, depth = queue.popleft()
            if depth >= max_depth:
                continue
            for nxt, edge_type in adjacency.get(node, []):
                traversed.append({"from": node, "to": nxt, "type": edge_type, "depth": depth + 1})
                if nxt not in seen:
                    seen.add(nxt)
                    queue.append((nxt, depth + 1))

        return {
            "service_id": service_id,
            "max_depth": max_depth,
            "nodes": list(seen),
            "edges": traversed,
        }

    def impacted_services(self, linked_services: list[str]) -> tuple[list[str], int]:
        all_services = set(linked_services)
        max_depth_observed = 0
        for service_id in linked_services:
            subgraph = self.service_graph(service_id, max_depth=2)
            max_depth_observed = max(max_depth_observed, max((e["depth"] for e in subgraph["edges"]), default=0))
            for node in subgraph["nodes"]:
                if node.startswith("svc-"):
                    all_services.add(node)
        return sorted(all_services), max_depth_observed


graph_service = GraphService()
