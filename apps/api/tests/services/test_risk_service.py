from app.services.graph_service import graph_service
from app.services.pr_service import pr_service
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


def test_risk_service_flags_seeded_high_risk_auth_change() -> None:
    risk = score_seeded_pr("PR-3413")

    assert risk.score == 99
    assert risk.severity == "critical"
    assert risk.confidence == 0.7
    assert "CI signal is not fully green." in risk.warnings
    assert "Coverage drop exceeds recommended threshold." in risk.warnings


def test_risk_service_keeps_seeded_low_risk_metrics_cleanup_low() -> None:
    risk = score_seeded_pr("PR-3414")

    assert risk.score == 16
    assert risk.severity == "low"
    assert risk.confidence == 1.0
    assert risk.warnings == []
