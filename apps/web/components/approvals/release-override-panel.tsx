"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api/client";

export function ReleaseOverridePanel({
  releaseId,
  onOverrideSuccess
}: {
  releaseId: string;
  onOverrideSuccess?: () => void;
}) {
  const [actor, setActor] = useState("");
  const [rationale, setRationale] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleOverride = async () => {
    if (!actor.trim() || !rationale.trim()) {
      setMessage({ type: "error", text: "Actor name and rationale are both required" });
      return;
    }

    setLoading(true);
    try {
      await apiPost(`/api/v1/releases/${releaseId}/override`, {
        actor,
        rationale
      });
      setMessage({ type: "success", text: "Release override recorded. Release is now ready." });
      setActor("");
      setRationale("");
      onOverrideSuccess?.();
    } catch (error) {
      setMessage({ type: "error", text: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <h4 className="font-semibold text-amber-900">Release Override (Use with Caution)</h4>
      <p className="mt-2 text-sm text-amber-800">
        Overriding release blockers requires explicit actor and risk justification. This action is fully audited.
      </p>
      <div className="mt-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700">Your Name (Actor)</label>
          <input
            type="text"
            value={actor}
            onChange={(e) => setActor(e.target.value)}
            placeholder="e.g., pavel"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Risk Justification / Rationale</label>
          <textarea
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            placeholder="Explain why this high-risk release can proceed despite unresolved blockers..."
            rows={4}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          onClick={handleOverride}
          disabled={loading}
          className="w-full rounded bg-amber-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Recording Override..." : "Record Override & Proceed"}
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
