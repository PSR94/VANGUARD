import { apiGet } from "@/lib/api/client";

export default async function EngineeringInsightsPage() {
  const insights = await apiGet<{
    top_impacted_services: Array<[string, number]>;
    risk_distribution: Record<string, number>;
    repeated_ci_failures: Array<[string, number]>;
    review_bottleneck_hint: string;
    override_hotspot_teams: string[];
  }>("/api/v1/insights");

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold">Engineering Insights</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="font-semibold">High Impact Services</h4>
          <ul className="mt-2 text-sm">
            {insights.top_impacted_services.map(([svc, count]) => <li key={svc}>{svc}: {count}</li>)}
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="font-semibold">Repeated CI Failures</h4>
          <ul className="mt-2 text-sm">
            {insights.repeated_ci_failures.map(([job, count]) => <li key={job}>{job}: {count}</li>)}
          </ul>
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm">{insights.review_bottleneck_hint}</p>
      </div>
    </section>
  );
}
