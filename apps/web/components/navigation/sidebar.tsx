"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["Dashboard", "/"],
  ["PR Workspace", "/pr-workspace"],
  ["Reviewer Recommendations", "/reviewer-recommendations"],
  ["Release Center", "/release-center"],
  ["Impact Explorer", "/impact-explorer"],
  ["Test Intelligence", "/test-intelligence"],
  ["CI Health", "/ci-health"],
  ["Policy Center", "/policy-center"],
  ["Approvals Queue", "/approvals-queue"],
  ["Audit Log", "/audit-log"],
  ["Engineering Insights", "/engineering-insights"],
  ["Status", "/status-center"],
  ["Settings", "/settings"]
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-r border-slate-200 bg-white/80 p-4 md:w-64">
      <h1 className="mb-5 text-xl font-bold text-cobalt">VANGUARD</h1>
      <nav className="space-y-1">
        {links.map(([name, href]) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`block rounded px-3 py-2 text-sm transition ${active ? "bg-cobalt text-white" : "text-slate-700 hover:bg-mist"}`}
            >
              {name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
