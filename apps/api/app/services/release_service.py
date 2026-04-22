from app.core.errors import InvalidStateError, NotFoundError
from app.schemas.domain import ReleaseCandidate, ReleaseReadiness
from app.services.analysis_service import analysis_service
from app.services.audit_service import audit_service
from app.services.data_store import get_data_store


ds = get_data_store()


class ReleaseService:
    def __init__(self) -> None:
        self._releases = [ReleaseCandidate.model_validate(r).model_copy(deep=True) for r in ds.releases()]

    def list_releases(self) -> list[ReleaseCandidate]:
        return self._releases

    def get_release(self, release_id: str) -> ReleaseCandidate:
        for rel in self._releases:
            if rel.id == release_id:
                return rel
        raise NotFoundError("release", release_id)

    def readiness(self, release_id: str) -> ReleaseReadiness:
        release = self.get_release(release_id)
        unresolved_high_risk: list[str] = []
        blockers: list[str] = []

        for pr_id in release.pr_ids:
            analysis = analysis_service.analyze_pr(pr_id)
            if analysis.risk.score >= 75:
                unresolved_high_risk.append(pr_id)

        if unresolved_high_risk and not release.override.get("active"):
            blockers.append("High-risk pull requests require override or mitigation.")

        for approval in release.approvals:
            if approval.required and not approval.approved:
                blockers.append(f"Required approval missing for {approval.team}.")

        score = max(0, 100 - (len(unresolved_high_risk) * 15) - (len(blockers) * 10))
        status = "ready" if score >= 75 and not blockers else "blocked"

        notes = "Release is ready for deployment." if status == "ready" else "Resolve blockers or provide justified override."
        return ReleaseReadiness(
            release_id=release_id,
            score=score,
            status=status,
            blockers=blockers,
            unresolved_high_risk_prs=unresolved_high_risk,
            policy_blockers=[b for b in blockers if "approval" in b.lower()],
            notes=notes,
        )

    def approve(self, release_id: str, team: str, actor: str) -> dict:
        release = self.get_release(release_id)
        approval = next((a for a in release.approvals if a.team == team), None)
        if not approval:
            raise InvalidStateError(f"No approval rule found for team '{team}'", code="invalid_approval_transition")
        approval.approved = True
        approval.actor = actor
        audit_service.log(actor, "release_approved", "release", release_id, f"Approval recorded for {team}")
        return {"release_id": release_id, "team": team, "approved_by": actor}

    def override(self, release_id: str, actor: str, rationale: str) -> dict:
        if not rationale.strip():
            raise InvalidStateError("Override rationale must not be empty", code="unsafe_override_state")
        release = self.get_release(release_id)
        release.override["active"] = True
        release.override["actor"] = actor
        release.override["rationale"] = rationale
        audit_service.log(actor, "release_override", "release", release_id, rationale)
        return {"release_id": release_id, "override": release.override}


release_service = ReleaseService()
