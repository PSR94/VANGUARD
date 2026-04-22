import { apiGet } from "@/lib/api/client";

export default async function StatusCenterPage() {
  const health = await apiGet<{ status: string }>("/health");
  const deps = await apiGet<Record<string, string>>("/health/dependencies");

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold">Status Center</h2>
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="font-semibold">API: {health.status}</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h4 className="font-semibold">Dependencies</h4>
        <ul className="mt-2 text-sm">
          {Object.entries(deps).map(([name, status]) => <li key={name}>{name}: {status}</li>)}
        </ul>
      </div>
    </section>
  );
}
