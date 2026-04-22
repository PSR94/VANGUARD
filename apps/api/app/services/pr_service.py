from app.core.errors import NotFoundError
from app.schemas.domain import PullRequest, CiRun, TestRun, ReviewerRecommendation
from app.services.data_store import get_data_store


ds = get_data_store()


class PullRequestService:
    def list_pull_requests(self) -> list[PullRequest]:
        return [PullRequest.model_validate(pr) for pr in ds.pull_requests()]

    def get_pull_request(self, pr_id: str) -> PullRequest:
        for pr in ds.pull_requests():
            if pr["id"] == pr_id:
                return PullRequest.model_validate(pr)
        raise NotFoundError("pull_request", pr_id)

    def get_ci(self, pr_id: str) -> CiRun:
        for run in ds.ci_runs():
            if run["pr_id"] == pr_id:
                return CiRun.model_validate(run)
        raise NotFoundError("ci_run", pr_id)

    def get_tests(self, pr_id: str) -> TestRun:
        for run in ds.test_runs():
            if run["pr_id"] == pr_id:
                return TestRun.model_validate(run)
        raise NotFoundError("test_run", pr_id)

    def recommend_reviewers(self, pr: PullRequest) -> list[ReviewerRecommendation]:
        owner_rows = ds.owners()
        recommendations: list[ReviewerRecommendation] = []
        paths = [f.path for f in pr.changed_files]

        for owner in owner_rows:
            touched = sum(1 for path in paths if any(path.startswith(prefix) for prefix in owner["paths"]))
            if touched == 0:
                continue
            for reviewer in owner["reviewers"][:2]:
                recommendations.append(
                    ReviewerRecommendation(
                        reviewer=reviewer,
                        reason=f"Owns {touched} changed areas mapped to {owner['team']}.",
                        score=min(0.95, 0.55 + (touched * 0.1)),
                    )
                )

        dedup: dict[str, ReviewerRecommendation] = {}
        for rec in recommendations:
            existing = dedup.get(rec.reviewer)
            if existing is None or rec.score > existing.score:
                dedup[rec.reviewer] = rec

        return sorted(dedup.values(), key=lambda item: item.score, reverse=True)


pr_service = PullRequestService()
