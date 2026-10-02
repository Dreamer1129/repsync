"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { PlanDTO } from "@/lib/actions";

function ChartTooltip({ active, payload, total }: { active?: boolean; payload?: { name: string; value: number }[]; total: number }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="rounded-xl border border-white/15 bg-[#0a0f1e]/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
      <p className="text-sm font-semibold tracking-wide text-[#f4f1ea]">{p.name}</p>
      <p className="text-xs tracking-wide text-stone-400">
        {p.value} members · {total ? Math.round((p.value / total) * 100) : 0}%
      </p>
    </div>
  );
}

export function PlanDonut({ plans }: { plans: PlanDTO[] }) {
  const list = plans;
  const total = list.reduce((s, p) => s + p.memberCount, 0);
  const data = list.map((plan) => ({
    name: plan.name,
    value: plan.memberCount,
    color: plan.color,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel flex flex-col p-6"
    >
      <h3 className="font-display text-2xl font-semibold tracking-wide text-[#f4f1ea]">Plan mix</h3>
      <p className="mt-1 text-xs tracking-[0.18em] text-stone-500">MEMBER DISTRIBUTION</p>
      <div className="relative h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={4} strokeWidth={0}>
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip total={total} />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-display text-4xl font-semibold text-[#f4f1ea]">{total}</p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Members</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2.5 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            <span className="text-xs font-medium tracking-wide text-stone-300">{d.name}</span>
            <span className="ml-auto text-xs font-bold text-stone-200">{d.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
