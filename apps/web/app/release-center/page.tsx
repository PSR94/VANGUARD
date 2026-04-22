"use client";

import { useState } from "react";
import { apiGet } from "@/lib/api/client";
import { ReleaseApprovalPanel } from "@/components/approvals/release-approval-panel";
import { ReleaseOverridePanel } from "@/components/approvals/release-override-panel";

type ReleaseReadiness = {
  score: number;
  status: string;
  blockers: string[];
  unresolved_high_risk_prs: string[];
  notes: string;
};

type Release = {
  id: string;
  name: string;
  pr_ids: string[];
  approvals: Array<{ team: string; required: boolean; approved: boolean }>;
};

export default function ReleaseCenterPage() {
  const [data, setData] = useState<{ release: Release; readiness: ReleaseReadiness } | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const releases = await apiGet<Release[]>("/api/v1/releases");
      const selected = releases[0];
      const readiness = await apiGet<ReleaseReadiness>(`/api/v1/releases/${selected.id}/readiness`);
      setData({ release: selected, readiness });
    } finally {
      setLoading(false);
    }
  }

  if (loading && !data) {
    loadData();
    return <div>Loading...</div>;
  }

  if (!data) return null;

  const { release, readiness } = data;
  const pendingApprovals = release.approvals.filter((a) => a.required && !a.approved);

  return (
    <section className="space-y-5">
      <h2 className="text-3xl font-bold">Release Center</h2>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 lg:col-span-2">
          <h3 className="font-semibold">{release.name}</h3>
          <p className="text-sm text-slate-600">{release.pr_ids.length} pull requests in candidate set</p>
          <p className="mt-3 text-sm text-slate-700">{readiness.notes}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase text-slate-500">Readiness Score</p>
          <p className="text-4xl font-bold text-cobalt">{readiness.score}</p>
          <p className="text-sm">Status: {readiness.status}</p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h4 className="font-semibold">Blockers</h4>
        <ul className="mt-2 list-disc pl-5 text-sm">
          {readiness.blockers.length === 0 ? <li>No blockers</li> : readiness.blockers.map((b) => <li key={b}>{b}</li>)}
        </ul>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h4 className="font-semibold">Release Notes Preview</h4>
        <p className="mt-2 text-sm text-slate-700">Includes {release.pr_ids.join(", ")}. Focus areas: risk mitigation, auth hardening, payment retry resilience, and observability tag normalization.</p>
      </div>

      {pendingApprovals.length > 0 && (
        <ReleaseApprovalPanel
          releaseId={release.id}
          pendingApprovals={pendingApprovals}
          onApprovalSuccess={() => loadData()}
        />
      )}

      {readiness.blockers.length > 0 && (
        <ReleaseOverridePanel
          releaseId={release.id}
          onOverrideSuccess={() => loadData()}
        />
      )}
    </section>
  );
}
