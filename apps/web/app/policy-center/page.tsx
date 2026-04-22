import { apiGet, apiPost } from "@/lib/api/client";

export default async function PolicyCenterPage() {
  const policies = await apiGet<Array<{ id: string; name: string; severity: string }>>("/api/v1/policies");
  const findings = await apiPost<Array<{ policy_id: string; status: string; rationale: string }>>("/api/v1/policies/evaluate", {
    pr_id: "PR-3413",
    release_mode: true
  });

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold">Policy Center</h2>
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h4 className="font-semibold">Policy Definitions</h4>
        <ul className="mt-2 list-disc pl-5 text-sm">
          {policies.map((p) => <li key={p.id}>{p.name} ({p.severity})</li>)}
        </ul>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h4 className="font-semibold">Evaluation Result: PR-3413</h4>
        <ul className="mt-2 space-y-1 text-sm">
          {findings.map((f) => <li key={f.policy_id}>{f.policy_id}: {f.status} - {f.rationale}</li>)}
        </ul>
      </div>
    </section>
  );
}
