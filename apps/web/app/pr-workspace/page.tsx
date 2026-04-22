"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api/client";
import { AnalysisResult, PullRequest } from "@/types/domain";

export default function PRWorkspacePage() {
  const [prs, setPrs] = useState<PullRequest[]>([]);
  const [selectedPrId, setSelectedPrId] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadPRs() {
    try {
      const data = await apiGet<PullRequest[]>("/api/v1/pull-requests");
      setPrs(data);
      if (data.length > 0) {
        setSelectedPrId((current) => current || data[0].id);
      }
    } finally {
      setLoading(false);
    }
  }

  async function analyzePR(prId: string) {
    setLoading(true);
    try {
      const result = await apiPost<AnalysisResult>(`/api/v1/pull-requests/${prId}/analyze`);
      setAnalysis(result);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPRs();
  }, []);

  if (loading && prs.length === 0) return <div>Loading pull requests...</div>;
  if (prs.length === 0) return <div>No pull requests found</div>;

  return (
    <section className="space-y-5">
      <header>
        <h2 className="text-3xl font-bold">PR Workspace</h2>
        <p className="text-slate-600">Comprehensive risk, test, CI, impact, policy, and reviewer intelligence.</p>
      </header>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">Select Pull Request</label>
        <div className="flex gap-2">
          <select
            value={selectedPrId}
            onChange={(e) => setSelectedPrId(e.target.value)}
            className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
          >
            {prs.map((pr) => (
              <option key={pr.id} value={pr.id}>
                {pr.id} - {pr.title}
              </option>
            ))}
          </select>
          <button
            onClick={() => analyzePR(selectedPrId)}
            disabled={loading}
            className="rounded bg-cobalt px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </div>

      {analysis && (
        <>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase text-slate-500">Selected Pull Request</p>
            <h3 className="text-xl font-semibold">
              {analysis.pr.id} - {analysis.pr.title}
            </h3>
            <p className="text-sm text-slate-600">
              Author: {analysis.pr.author} • {analysis.pr.changed_files.length} files
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h4 className="font-semibold">Risk and Evidence</h4>
              <p className="mt-2 text-2xl font-bold text-ember">
                {analysis.risk.score} ({analysis.risk.severity})
              </p>
              <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
                {analysis.evidence.map((evidence) => (
                  <li key={evidence}>{evidence}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h4 className="font-semibold">Impacted Services and Modules</h4>
              <p className="mt-2 text-sm">Services: {analysis.impacted_services.join(", ")}</p>
              <p className="text-sm">Modules: {analysis.impacted_modules.join(", ")}</p>
              <p className="text-sm">Blast radius depth: {analysis.blast_radius_depth}</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h4 className="font-semibold">Reviewers</h4>
              <ul className="mt-2 space-y-2 text-sm">
                {analysis.reviewer_recommendations.map((reviewer) => (
                  <li key={reviewer.reviewer}>
                    {reviewer.reviewer} - {Math.round(reviewer.score * 100)}% - {reviewer.reason}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h4 className="font-semibold">Test Intelligence</h4>
              <p className="text-sm">Coverage delta: {analysis.test_intelligence.coverage_delta}%</p>
              <p className="text-sm">Failed tests: {analysis.test_intelligence.failed_tests.length}</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
                {analysis.test_intelligence.suggested_tests.map((testName) => (
                  <li key={testName}>{testName}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h4 className="font-semibold">CI and Policy</h4>
              <p className="text-sm">CI status: {analysis.ci_intelligence.status}</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
                {analysis.policy_findings.map((finding) => (
                  <li key={finding.policy_id}>
                    {finding.name}: {finding.status}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h4 className="font-semibold">AI Grounded Summary</h4>
            <p className="mt-2 text-slate-700">{analysis.summary}</p>
          </div>
        </>
      )}
    </section>
  );
}
