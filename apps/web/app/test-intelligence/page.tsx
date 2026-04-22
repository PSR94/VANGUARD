import { apiGet } from "@/lib/api/client";

export default async function TestIntelligencePage() {
  const testData = await apiGet<{ coverage_delta: number; flaky_tests: string[]; failed_tests: string[]; suggested_tests: string[] }>("/api/v1/pull-requests/PR-3413/tests");

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold">Test Intelligence</h2>
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm">Coverage delta: <span className="font-semibold">{testData.coverage_delta}%</span></p>
        <p className="text-sm">Failed tests: {testData.failed_tests.length}</p>
        <p className="text-sm">Flaky tests: {testData.flaky_tests.length}</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h4 className="font-semibold">Recommended Missing Tests</h4>
        <ul className="mt-2 list-disc pl-5 text-sm">
          {testData.suggested_tests.map((s) => <li key={s}>{s}</li>)}
        </ul>
      </div>
    </section>
  );
}
