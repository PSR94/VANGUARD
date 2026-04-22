from app.services.graph_service import graph_service
from app.services.data_store import get_data_store
from app.services.pr_service import pr_service
from app.services.policy_service import policy_service
from app.services.risk_service import risk_service


def score_seeded_pr(pr_id: str):
    pr = pr_service.get_pull_request(pr_id)
    ci = pr_service.get_ci(pr_id)
    tests = pr_service.get_tests(pr_id)
    impacted_services, blast_depth = graph_service.impacted_services(pr.linked_services)
    protected_touches = sum(
        1 for changed_file in pr.changed_files if changed_file.path.startswith(("configs/", "security/", "infra/"))
    )
    critical_service_count = sum(1 for service in impacted_services if service in {"svc-payments", "svc-auth"})
    return risk_service.score(
        pr=pr,
        ci=ci,
        tests=tests,
        protected_touches=protected_touches,
        critical_service_count=critical_service_count,
        dependency_depth=blast_depth,
    )


def test_policy_service_blocks_seeded_auth_config_change() -> None:
    findings = policy_service.evaluate(
        get_data_store().policies(),
        pr_service.get_pull_request("PR-3413"),
        score_seeded_pr("PR-3413"),
    )

    auth_policy = next(finding for finding in findings if finding.policy_id == "POL-AUTH-CONFIG-SECURITY")
    release_blocker = next(finding for finding in findings if finding.policy_id == "POL-HIGH-RISK-BLOCKER")

    assert auth_policy.status == "blocked"
    assert auth_policy.required_team == "team-security"
    assert "requires team-security approval" in auth_policy.rationale
    assert release_blocker.status == "pass"


def test_policy_service_blocks_high_risk_pr_in_release_mode() -> None:
    findings = policy_service.evaluate(
        get_data_store().policies(),
        pr_service.get_pull_request("PR-3413"),
        score_seeded_pr("PR-3413"),
        release_mode=True,
    )

    release_blocker = next(finding for finding in findings if finding.policy_id == "POL-HIGH-RISK-BLOCKER")

    assert release_blocker.status == "blocked"
    assert release_blocker.severity == "critical"
    assert release_blocker.rationale == "High-risk pull request exists and no override is registered."
