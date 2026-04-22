from app.schemas.domain import PolicyFinding, PullRequest, RiskResult


class PolicyService:
    def evaluate(self, policies: list[dict], pr: PullRequest, risk: RiskResult, release_mode: bool = False) -> list[PolicyFinding]:
        findings: list[PolicyFinding] = []
        paths = [f.path for f in pr.changed_files]

        for policy in policies:
            condition = policy.get("condition", {})
            status = "pass"
            rationale = "Policy conditions were not triggered by this change set."
            required_team = condition.get("required_team")

            if "path_prefix" in condition and any(p.startswith(condition["path_prefix"]) for p in paths):
                status = "blocked"
                rationale = f"Path prefix '{condition['path_prefix']}' was changed and requires {required_team} approval."

            if release_mode and policy.get("kind") == "release_blocker":
                if risk.score >= condition.get("min_risk_score", 100):
                    status = "blocked"
                    rationale = "High-risk pull request exists and no override is registered."

            findings.append(PolicyFinding(
                policy_id=policy["id"],
                name=policy["name"],
                severity=policy["severity"],
                status=status,
                rationale=rationale,
                required_team=required_team,
            ))

        return findings


policy_service = PolicyService()
