import { apiGet } from "@/lib/api/client";

export default async function CIHealthPage() {
  const ci = await apiGet<{ pipeline: string; status: string; jobs: Array<{ name: string; status: string; retries: number; failure_summary?: string }> }>("/api/v1/pull-requests/PR-3412/ci");

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold">CI Health</h2>
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="font-semibold">Pipeline: {ci.pipeline}</p>
        <p className="text-sm text-slate-600">Status: {ci.status}</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h4 className="font-semibold">Job Diagnostics</h4>
        <ul className="mt-2 space-y-2 text-sm">
          {ci.jobs.map((job) => (
            <li key={job.name}>
              <span className="font-medium">{job.name}</span>: {job.status}, retries {job.retries}
              {job.failure_summary ? `, failure: ${job.failure_summary}` : ""}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
