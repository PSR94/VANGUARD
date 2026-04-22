from app.schemas.domain import PullRequest, RiskFactor, RiskResult, CiRun, TestRun


class RiskService:
    def score(self, pr: PullRequest, ci: CiRun, tests: TestRun, protected_touches: int, critical_service_count: int, dependency_depth: int) -> RiskResult:
        factors: list[RiskFactor] = []

        file_count = len(pr.changed_files)
        factors.append(RiskFactor(
            key="changed_file_count",
            weight=8,
            contribution=min(file_count * 3, 20),
            explanation=f"{file_count} changed files increase coordination and review risk.",
        ))

        factors.append(RiskFactor(
            key="protected_paths",
            weight=10,
            contribution=min(protected_touches * 12, 30),
            explanation="Protected paths touched by this pull request require stricter governance.",
        ))

        factors.append(RiskFactor(
            key="critical_services",
            weight=9,
            contribution=min(critical_service_count * 11, 25),
            explanation="Critical service impact raises incident and rollback sensitivity.",
        ))

        ci_failed_jobs = len([j for j in ci.jobs if j.status == "failed"])
        ci_retries = sum(j.retries for j in ci.jobs)
        factors.append(RiskFactor(
            key="ci_signal",
            weight=10,
            contribution=min(ci_failed_jobs * 15 + ci_retries * 3, 30),
            explanation="CI failures or retries indicate weak verification confidence.",
        ))

        test_penalty = 0
        if tests.coverage_delta < 0:
            test_penalty += int(abs(tests.coverage_delta) * 2)
        test_penalty += len(tests.failed_tests) * 6
        test_penalty += len(tests.flaky_tests) * 4
        factors.append(RiskFactor(
            key="test_signal",
            weight=10,
            contribution=min(test_penalty, 30),
            explanation="Coverage regression, failed tests, and flakiness reduce confidence.",
        ))

        factors.append(RiskFactor(
            key="dependency_depth",
            weight=6,
            contribution=min(dependency_depth * 5, 15),
            explanation="Deeper transitive dependency impact increases blast radius uncertainty.",
        ))

        total = min(sum(f.contribution for f in factors), 100)
        if total >= 80:
            severity = "critical"
        elif total >= 60:
            severity = "high"
        elif total >= 35:
            severity = "medium"
        else:
            severity = "low"

        warnings: list[str] = []
        if ci.status != "passed":
            warnings.append("CI signal is not fully green.")
        if tests.coverage_delta < -5:
            warnings.append("Coverage drop exceeds recommended threshold.")

        confidence = max(0.35, 1.0 - (len(warnings) * 0.15))

        return RiskResult(
            pr_id=pr.id,
            score=total,
            severity=severity,
            confidence=round(confidence, 2),
            factors=factors,
            warnings=warnings,
        )


risk_service = RiskService()
