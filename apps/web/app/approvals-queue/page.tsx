"use client";

import { useState } from "react";
import { apiGet } from "@/lib/api/client";
import { ReleaseApprovalPanel } from "@/components/approvals/release-approval-panel";

type Release = {
  id: string;
  name: string;
  approvals: Array<{ team: string; required: boolean; approved: boolean; actor?: string }>;
};

export default function ApprovalsQueuePage() {
  const [release, setRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const data = await apiGet<Release>("/api/v1/releases/REL-2026.04.3");
      setRelease(data);
    } finally {
      setLoading(false);
    }
  }

  if (loading && !release) {
    loadData();
    return <div>Loading...</div>;
  }

  if (!release) return null;

  const pending = release.approvals.filter((a) => a.required && !a.approved);
  const approved = release.approvals.filter((a) => a.required && a.approved);

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold">Approvals Queue</h2>
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="font-semibold">Release: {release.name}</p>
        <p className="text-sm text-slate-600">Pending required approvals: {pending.length} / Completed: {approved.length}</p>
      </div>

      {pending.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="font-semibold mb-3">Pending Approvals</h4>
          <ul className="space-y-2 text-sm">
            {pending.map((row) => (
              <li key={row.team} className="flex items-center justify-between rounded bg-slate-50 p-2">
                <span>{row.team} - Awaiting decision</span>
                <span className="text-xs text-slate-500">Required</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {approved.length > 0 && (
        <div className="rounded-lg border border-mint/30 bg-mint/10 p-4">
          <h4 className="font-semibold mb-3 text-mint">Completed Approvals</h4>
          <ul className="space-y-2 text-sm">
            {approved.map((row) => (
              <li key={row.team} className="flex items-center justify-between rounded bg-mint/20 p-2">
                <span>{row.team} ✓ Approved</span>
                <span className="text-xs text-slate-600">{row.actor || "unknown"}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {pending.length > 0 && (
        <ReleaseApprovalPanel
          releaseId={release.id}
          pendingApprovals={pending}
          onApprovalSuccess={() => loadData()}
        />
      )}
    </section>
  );
}
