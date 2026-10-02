"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { pkrShort } from "@/lib/format";
import type { RevenuePoint } from "@/lib/actions";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; payload: { month: string; revenue: number; target: number } }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/15 bg-[#0a0f1e]/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">{label} 2026</p>
      <p className="font-display text-xl font-semibold text-[#f5d47e]">{pkrShort(payload[0].value)}</p>
      <p className="text-xs tracking-wide text-stone-500">Target {pkrShort(payload[0].payload.target)}</p>
    </div>
  );
}

export function RevenueChart({ series }: { series: RevenuePoint[] }) {
  const revenueSeries = series;
  const currentTarget = series && series.length > 0 ? series[series.length - 1].target : 560000;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel p-6"
    >
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="font-display text-2xl font-semibold tracking-wide text-[#f4f1ea]">Revenue pulse</h3>
          <p className="mt-1 text-xs tracking-[0.18em] text-stone-500">COLLECTIONS VS TARGET · 12 MONTHS</p>
        </div>
        <div className="flex items-center gap-4 text-xs tracking-wide text-stone-400">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#f5d47e]" /> Revenue
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#6366f1]" /> Target ({pkrShort(currentTarget)})
          </span>
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueSeries} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="revGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f5d47e" stopOpacity={0.55} />
                <stop offset="100%" stopColor="#f5d47e" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${Math.round(v / 1000)}K`}
              width={44}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(245,212,126,0.4)" }} />
            <ReferenceLine y={currentTarget} stroke="#6366f1" strokeDasharray="6 6" strokeOpacity={0.6} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#f5d47e"
              strokeWidth={2.5}
              fill="url(#revGold)"
              dot={false}
              activeDot={{ r: 5, fill: "#f5d47e", stroke: "#060913", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
