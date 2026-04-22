from app.schemas.domain import AnalysisResult
from app.services.audit_service import audit_service
from app.services.graph_service import graph_service
from app.services.policy_service import policy_service
from app.services.pr_service import pr_service
from app.services.provider_service import provider_service
from app.services.risk_service import risk_service
from app.services.data_store import get_data_store


class AnalysisService:
    def analyze_pr(self, pr_id: str, actor: str = "system") -> AnalysisResult:
        ds = get_data_store()
        pr = pr_service.get_pull_request(pr_id)
        ci = pr_service.get_ci(pr_id)
        tests = pr_service.get_tests(pr_id)

        impacted_services, blast_depth = graph_service.impacted_services(pr.linked_services)
        impacted_modules = sorted({f.path.split("/")[0] for f in pr.changed_files})

        protected_touches = sum(
            1 for f in pr.changed_files if f.path.startswith("configs/") or f.path.startswith("security/") or f.path.startswith("infra/")
        )
        critical_service_count = sum(1 for s in impacted_services if s in {"svc-payments", "svc-auth"})

        risk = risk_service.score(
            pr=pr,
            ci=ci,
            tests=tests,
            protected_touches=protected_touches,
            critical_service_count=critical_service_count,
            dependency_depth=blast_depth,
        )

        policies = policy_service.evaluate(ds.policies(), pr, risk)
        reviewers = pr_service.recommend_reviewers(pr)

        evidence = [
            f"{len(pr.changed_files)} files changed in {pr.repo_id}",
            f"CI status is {ci.status} with {len([j for j in ci.jobs if j.status == 'failed'])} failed jobs",
            f"Coverage delta {tests.coverage_delta}% and {len(tests.failed_tests)} failed tests",
            f"Impacted services: {', '.join(impacted_services)}",
        ]

        summary = provider_service.pr_summary(pr, risk, policies, evidence)

        result = AnalysisResult(
            pr=pr,
            impacted_services=impacted_services,
            impacted_modules=impacted_modules,
            blast_radius_depth=blast_depth,
            reviewer_recommendations=reviewers,
            risk=risk,
            policy_findings=policies,
            test_intelligence=tests,
            ci_intelligence=ci,
            summary=summary,
            evidence=evidence,
        )

        audit_service.log(
            actor=actor,
            action="pr_analyzed",
            object_type="pull_request",
            object_id=pr_id,
            rationale="Risk, policy, CI, and test signals evaluated.",
            metadata={"risk_score": risk.score, "severity": risk.severity},
        )

        return result


analysis_service = AnalysisService()
