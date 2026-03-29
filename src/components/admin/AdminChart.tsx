"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { day: "L", value: 40 },
  { day: "M", value: 60 },
  { day: "M", value: 45 },
  { day: "J", value: 80 },
  { day: "V", value: 55 },
  { day: "S", value: 90 },
  { day: "D", value: 100 },
];

export default function AdminChart() {
  return (
    <div style={{ width: "100%", height: 260, marginTop: "var(--space-md)" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: "var(--color-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-surface-container)" }}
            itemStyle={{ color: "var(--color-text)" }}
          />
          <Area type="monotone" dataKey="value" name="Actividad" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
