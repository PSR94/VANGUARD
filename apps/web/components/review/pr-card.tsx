import { PullRequest } from "@/types/domain";

export function PRCard({ pr }: { pr: PullRequest }) {
  const fileCount = pr.changed_files.length;
  const delta = pr.changed_files.reduce((acc, f) => acc + f.additions + f.deletions, 0);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="font-semibold text-slate-800">{pr.id} - {pr.title}</p>
      <p className="text-sm text-slate-500">Author: {pr.author}</p>
      <p className="mt-2 text-sm text-slate-700">{fileCount} files changed, {delta} total line delta</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {pr.labels.map((label) => (
          <span key={label} className="rounded-full bg-mist px-2 py-1 text-xs text-cobalt">{label}</span>
        ))}
      </div>
    </div>
  );
}
