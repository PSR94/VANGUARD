export type PullRequest = {
  id: string;
  title: string;
  author: string;
  state: string;
  labels: string[];
  changed_files: Array<{ path: string; additions: number; deletions: number; language: string }>;
};

export type AnalysisResult = {
  pr: PullRequest;
  impacted_services: string[];
  impacted_modules: string[];
  blast_radius_depth: number;
  reviewer_recommendations: Array<{ reviewer: string; reason: string; score: number }>;
  risk: { score: number; severity: string; confidence: number; factors: Array<{ key: string; contribution: number; explanation: string }> };
  policy_findings: Array<{ policy_id: string; name: string; severity: string; status: string; rationale: string }>;
  test_intelligence: { coverage_delta: number; flaky_tests: string[]; failed_tests: string[]; suggested_tests: string[] };
  ci_intelligence: { status: string; jobs: Array<{ name: string; status: string; retries: number; failure_summary?: string }> };
  summary: string;
  evidence: string[];
};
