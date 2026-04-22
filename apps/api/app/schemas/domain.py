from datetime import datetime
from typing import Any
from pydantic import BaseModel, Field


class ChangedFile(BaseModel):
    path: str
    additions: int
    deletions: int
    language: str


class PullRequest(BaseModel):
    id: str
    repo_id: str
    title: str
    author: str
    state: str
    created_at: datetime
    base_branch: str
    head_branch: str
    labels: list[str]
    changed_files: list[ChangedFile]
    linked_services: list[str]
    assigned_reviewers: list[str]
    description: str


class ReviewerRecommendation(BaseModel):
    reviewer: str
    reason: str
    score: float


class CiJob(BaseModel):
    name: str
    status: str
    duration_sec: int
    retries: int
    failure_summary: str | None = None


class CiRun(BaseModel):
    pr_id: str
    pipeline: str
    status: str
    jobs: list[CiJob]


class TestRun(BaseModel):
    pr_id: str
    coverage_delta: float
    flaky_tests: list[str]
    failed_tests: list[str]
    suggested_tests: list[str]


class RiskFactor(BaseModel):
    key: str
    weight: int
    contribution: int
    explanation: str


class RiskResult(BaseModel):
    pr_id: str
    score: int
    severity: str
    confidence: float
    factors: list[RiskFactor]
    warnings: list[str] = Field(default_factory=list)


class PolicyFinding(BaseModel):
    policy_id: str
    name: str
    severity: str
    status: str
    rationale: str
    required_team: str | None = None


class AnalysisResult(BaseModel):
    pr: PullRequest
    impacted_services: list[str]
    impacted_modules: list[str]
    blast_radius_depth: int
    reviewer_recommendations: list[ReviewerRecommendation]
    risk: RiskResult
    policy_findings: list[PolicyFinding]
    test_intelligence: TestRun
    ci_intelligence: CiRun
    summary: str
    evidence: list[str]


class ReleaseApproval(BaseModel):
    team: str
    required: bool
    approved: bool
    actor: str | None = None


class ReleaseCandidate(BaseModel):
    id: str
    name: str
    status: str
    target_date: str
    pr_ids: list[str]
    approvals: list[ReleaseApproval]
    override: dict[str, Any]


class ReleaseReadiness(BaseModel):
    release_id: str
    score: int
    status: str
    blockers: list[str]
    unresolved_high_risk_prs: list[str]
    policy_blockers: list[str]
    notes: str


class AuditEvent(BaseModel):
    id: str
    timestamp: datetime
    actor: str
    action: str
    object_type: str
    object_id: str
    rationale: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class EvalRunResult(BaseModel):
    id: str
    timestamp: datetime
    benchmarks_total: int
    benchmarks_passed: int
    pass_rate: float
    unsupported_claim_rate: float
    latency_ms_p95: int
    checks: list[dict[str, Any]]
