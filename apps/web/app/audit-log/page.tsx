"use client";

import { useState } from "react";
import { apiGet, apiPost } from "@/lib/api/client";

type AuditEvent = {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  object_type: string;
  object_id: string;
  rationale?: string;
};

export default function AuditLogPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterActor, setFilterActor] = useState("");
  const [filterAction, setFilterAction] = useState("");

  async function loadAudit() {
    try {
      await apiPost("/api/v1/evals/run");
      const audit = await apiGet<AuditEvent[]>("/api/v1/audit");
      setEvents(audit);
    } finally {
      setLoading(false);
    }
  }

  if (loading && events.length === 0) {
    loadAudit();
    return <div>Loading audit events...</div>;
  }

  const uniqueActors = [...new Set(events.map((e) => e.actor))];
  const uniqueActions = [...new Set(events.map((e) => e.action))];

  const filtered = events.filter((e) => {
    const actorMatch = !filterActor || e.actor === filterActor;
    const actionMatch = !filterAction || e.action === filterAction;
    return actorMatch && actionMatch;
  });

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-3xl font-bold">Audit Log</h2>
        <p className="text-slate-600">Complete immutable record of all release and approval decisions.</p>
      </header>

      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Filter by Actor</label>
          <select
            value={filterActor}
            onChange={(e) => setFilterActor(e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All actors</option>
            {uniqueActors.map((actor) => (
              <option key={actor} value={actor}>
                {actor}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Filter by Action</label>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All actions</option>
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="mb-3 text-sm font-medium text-slate-700">Events: {filtered.length} / Total: {events.length}</p>
        <ul className="space-y-2 text-sm">
          {filtered.map((event) => (
            <li key={event.id} className="flex flex-col rounded bg-slate-50 p-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-500">{event.timestamp}</span>
                <span className="inline-block rounded bg-cobalt px-2 py-1 text-xs font-medium text-white">{event.action}</span>
              </div>
              <p className="mt-1 text-slate-700">
                <span className="font-medium">{event.actor}</span> {event.action} on {event.object_type}:{event.object_id}
              </p>
              {event.rationale && <p className="mt-1 text-xs italic text-slate-600">"{event.rationale}"</p>}
            </li>
          ))}
        </ul>
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-600">
          No events match the selected filters.
        </div>
      )}
    </section>
  );
}

