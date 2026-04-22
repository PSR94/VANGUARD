"use client";

import { BarChart, Bar, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";

export function RiskDistributionChart({ data }: { data: Array<{ severity: string; count: number }> }) {
  return (
    <div className="h-64 w-full rounded-lg border border-slate-200 bg-white p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="severity" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#0b4f7a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
