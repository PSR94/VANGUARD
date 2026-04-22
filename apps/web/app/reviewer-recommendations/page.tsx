"use client";

import { useEffect, useRef, useState } from "react";
import { apiGet } from "@/lib/api/client";

type ReviewerRecommendation = {
  name: string;
  score: number;
  rationale: string;
  team: string;
};

type PR = { id: string; title: string };

export default function ReviewerRecommendationsPage() {
  const [data, setData] = useState<{ pr: PR; reviewers: ReviewerRecommendation[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const hasLoaded = useRef(false);

  async function loadData() {
    setLoading(true);
    try {
      const prs = await apiGet<PR[]>("/api/v1/pull-requests");
      const selected = prs[0];
      const reviewers = await apiGet<ReviewerRecommendation[]>(`/api/v1/pull-requests/${selected.id}/reviewers`);
      setData({ pr: selected, reviewers });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (hasLoaded.current) {
      return;
    }

    hasLoaded.current = true;
    void loadData();
  }, []);

  if (loading && !data) {
    return <div>Loading...</div>;
  }

  if (!data) return null;

  const { pr, reviewers } = data;

  return (
    <section className="space-y-5">
      <header>
        <h2 className="text-3xl font-bold">Reviewer Recommendations</h2>
        <p className="text-slate-600">AI-selected reviewers based on codebase expertise and team ownership.</p>
      </header>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-600">PR: {pr.id}</p>
        <h3 className="text-lg font-semibold">{pr.title}</h3>
      </div>

      <div className="space-y-3">
        {reviewers.map((reviewer) => (
          <div key={reviewer.name} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{reviewer.name}</h4>
                <p className="text-sm text-slate-600">{reviewer.team}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-cobalt">{reviewer.score}</p>
                <p className="text-xs text-slate-500">Score</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-700">{reviewer.rationale}</p>
          </div>
        ))}
      </div>

      {reviewers.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-600">
          No reviewers matched for this PR.
        </div>
      )}
    </section>
  );
}
