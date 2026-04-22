"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api/client";

export function ReleaseApprovalPanel({
  releaseId,
  pendingApprovals,
  onApprovalSuccess
}: {
  releaseId: string;
  pendingApprovals: Array<{ team: string; required: boolean; approved: boolean }>;
  onApprovalSuccess?: () => void;
}) {
  const [selectedTeam, setSelectedTeam] = useState<string>(pendingApprovals[0]?.team || "");
  const [actor, setActor] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleApprove = async () => {
    if (!actor.trim()) {
      setMessage({ type: "error", text: "Actor name is required" });
      return;
    }

    setLoading(true);
    try {
      await apiPost(`/api/v1/releases/${releaseId}/approve`, {
        team: selectedTeam,
        actor
      });
      setMessage({ type: "success", text: `Approval recorded for ${selectedTeam}` });
      setActor("");
      onApprovalSuccess?.();
    } catch (error) {
      setMessage({ type: "error", text: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h4 className="font-semibold">Submit Approval</h4>
      <div className="mt-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700">Team</label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          >
            {pendingApprovals.map((approval) => (
              <option key={approval.team} value={approval.team}>
                {approval.team}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Your Name</label>
          <input
            type="text"
            value={actor}
            onChange={(e) => setActor(e.target.value)}
            placeholder="e.g., maya"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          onClick={handleApprove}
          disabled={loading}
          className="w-full rounded bg-cobalt px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Approval"}
        </button>
        {message && (
          <div className={`rounded px-3 py-2 text-sm ${message.type === "success" ? "bg-mint/20 text-mint" : "bg-ember/20 text-ember"}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
