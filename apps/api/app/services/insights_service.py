from collections import Counter

from app.services.analysis_service import analysis_service
from app.services.pr_service import pr_service


class InsightsService:
    def engineering_insights(self) -> dict:
        prs = pr_service.list_pull_requests()
        service_counter: Counter[str] = Counter()
        risk_bands: Counter[str] = Counter()
        ci_failure_counter: Counter[str] = Counter()

        for pr in prs:
            analysis = analysis_service.analyze_pr(pr.id)
            for svc in analysis.impacted_services:
                service_counter[svc] += 1
            risk_bands[analysis.risk.severity] += 1
            for job in analysis.ci_intelligence.jobs:
                if job.status == "failed":
                    ci_failure_counter[job.name] += 1

        return {
            "top_impacted_services": service_counter.most_common(6),
            "risk_distribution": dict(risk_bands),
            "repeated_ci_failures": ci_failure_counter.most_common(6),
            "review_bottleneck_hint": "High-risk PRs often request security and platform reviewers concurrently.",
            "override_hotspot_teams": ["team-security"],
        }


insights_service = InsightsService()
