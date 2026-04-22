from datetime import datetime, timezone
from typing import Any
from app.schemas.domain import AuditEvent


class AuditService:
    def __init__(self) -> None:
        self._events: list[AuditEvent] = []

    def log(self, actor: str, action: str, object_type: str, object_id: str, rationale: str | None = None, metadata: dict[str, Any] | None = None) -> AuditEvent:
        event = AuditEvent(
            id=f"AUD-{len(self._events) + 1:04d}",
            timestamp=datetime.now(timezone.utc),
            actor=actor,
            action=action,
            object_type=object_type,
            object_id=object_id,
            rationale=rationale,
            metadata=metadata or {},
        )
        self._events.append(event)
        return event

    def list(self) -> list[AuditEvent]:
        return list(reversed(self._events))


audit_service = AuditService()
