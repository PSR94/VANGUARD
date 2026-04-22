import { apiGet } from "@/lib/api/client";

export default async function ImpactExplorerPage() {
  const services = await apiGet<Array<{ id: string; name: string }>>("/api/v1/services");
  const selected = services[0];
  const graph = await apiGet<{ nodes: string[]; edges: Array<{ from: string; to: string; type: string; depth: number }> }>(`/api/v1/services/${selected.id}/graph`);

  return (
    <section className="space-y-5">
      <h2 className="text-3xl font-bold">Impact Explorer</h2>
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="font-semibold">Service: {selected.name}</p>
        <p className="text-sm text-slate-600">Transitive impact nodes: {graph.nodes.length}</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h4 className="font-semibold">Traversal Edges</h4>
        <ul className="mt-2 space-y-1 text-sm">
          {graph.edges.map((edge) => (
            <li key={`${edge.from}-${edge.to}-${edge.type}`}>{edge.from} -[{edge.type}]-> {edge.to} (depth {edge.depth})</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
