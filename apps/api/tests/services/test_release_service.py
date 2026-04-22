from app.services.release_service import ReleaseService


def test_release_readiness_blocks_seeded_release_without_override_or_security_approval() -> None:
    service = ReleaseService()

    readiness = service.readiness("REL-2026.04.3")

    assert readiness.status == "blocked"
    assert readiness.score == 50
    assert readiness.unresolved_high_risk_prs == ["PR-3412", "PR-3413"]
    assert "High-risk pull requests require override or mitigation." in readiness.blockers
    assert "Required approval missing for team-security." in readiness.blockers
    assert readiness.policy_blockers == ["Required approval missing for team-security."]


def test_release_readiness_is_ready_for_low_risk_fully_approved_candidate() -> None:
    service = ReleaseService()
    baseline = service.get_release("REL-2026.04.3").model_copy(deep=True)
    baseline.id = "REL-LOW-RISK"
    baseline.name = "Low Risk Validation Candidate"
    baseline.pr_ids = ["PR-3414"]
    baseline.approvals[1].approved = True
    baseline.approvals[1].actor = "nora"
    baseline.override = {"active": False, "actor": None, "rationale": None}
    service._releases.append(baseline)

    readiness = service.readiness("REL-LOW-RISK")

    assert readiness.status == "ready"
    assert readiness.score == 100
    assert readiness.blockers == []
    assert readiness.unresolved_high_risk_prs == []
    assert readiness.policy_blockers == []
    assert readiness.notes == "Release is ready for deployment."
