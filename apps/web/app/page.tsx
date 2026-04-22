import { apiGet } from "@/lib/api/client";
import { PRCard } from "@/components/review/pr-card";
import { RiskDistributionChart } from "@/components/charts/risk-distribution";
import { PullRequest } from "@/types/domain";

export default async function DashboardPage() {
  const prs = await apiGet<PullRequest[]>("/api/v1/pull-requests");
  const insights = await apiGet<{ risk_distribution: Record<string, number> }>("/api/v1/insights");

  const riskData = Object.entries(insights.risk_distribution || {}).map(([severity, count]) => ({ severity, count }));

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-ink">Delivery Intelligence Dashboard</h2>
        <p className="text-slate-600">Monitor PR risk posture, CI health, and service impact before merge and release.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase text-slate-500">Open Pull Requests</p>
          <p className="text-3xl font-bold text-cobalt">{prs.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase text-slate-500">Critical Risk PRs</p>
          <p className="text-3xl font-bold text-ember">{(riskData.find((d) => d.severity === "critical")?.count ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase text-slate-500">Platform Signal</p>
          <p className="text-lg font-semibold text-mint">Grounded, deterministic, local-first</p>
        </div>
      </div>

      <RiskDistributionChart data={riskData} />

      <div className="grid gap-4 md:grid-cols-2">
        {prs.map((pr) => (
          <PRCard key={pr.id} pr={pr} />
        ))}
      </div>
    </section>
  );
}
