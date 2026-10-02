"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface StatCardProps {
  label: string;
  value: string;
  delta: number;
  deltaSuffix?: string;
  icon: LucideIcon;
  delay?: number;
}

export function StatCard({ label, value, delta, deltaSuffix = "%", icon: Icon, delay = 0 }: StatCardProps) {
  const positive = delta >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 280, damping: 22 } }}
      className="glass-panel p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d9a441]/30 bg-gradient-to-br from-[#d9a441]/20 to-transparent">
          <Icon className="h-5 w-5 text-[#f5d47e]" strokeWidth={1.75} />
        </div>
        <span
          className={cn(
            "flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide",
            positive
              ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
              : "border-rose-400/25 bg-rose-400/10 text-rose-300"
          )}
        >
          {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {positive ? "+" : ""}
          {delta}
          {deltaSuffix}
        </span>
      </div>
      <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-stone-400">{label}</p>
      <p className="mt-2 font-display text-4xl font-semibold tracking-wide text-[#f4f1ea]">{value}</p>
    </motion.div>
  );
}
