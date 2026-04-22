from app.schemas.domain import PullRequest, RiskResult, PolicyFinding


class ProviderService:
    def metadata(self) -> dict[str, str]:
        return {
            "provider": "deterministic-local",
            "model": "vanguard-grounded-v1",
            "mode": "grounded-template",
        }

    def pr_summary(self, pr: PullRequest, risk: RiskResult, findings: list[PolicyFinding], evidence: list[str]) -> str:
        blockers = [f.name for f in findings if f.status == "blocked"]
        blocker_text = ", ".join(blockers) if blockers else "no policy blockers"
        return (
            f"{pr.title} changes {len(pr.changed_files)} files with risk score {risk.score} ({risk.severity}). "
            f"Policy status: {blocker_text}. "
            f"Evidence: {evidence[0]}"
        )


provider_service = ProviderService()
