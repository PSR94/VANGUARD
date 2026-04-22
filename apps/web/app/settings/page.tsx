import { apiGet } from "@/lib/api/client";

export default async function SettingsPage() {
  const provider = await apiGet<{ provider: string; model: string; mode: string }>("/api/v1/providers");
  const cfg = await apiGet<{ product: string; mode: string }>("/api/v1/config/public");

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold">Settings and Provider Visibility</h2>
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm">Product: {cfg.product}</p>
        <p className="text-sm">Runtime mode: {cfg.mode}</p>
        <p className="text-sm">Provider: {provider.provider}</p>
        <p className="text-sm">Model: {provider.model}</p>
      </div>
    </section>
  );
}
