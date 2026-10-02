"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

// Full 7-day gym operations Mon–Sun
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function intensity(count: number): string {
  if (count === 0) return "bg-white/[0.04]";
  if (count < 10) return "bg-[#4338ca]/40";
  if (count < 20) return "bg-[#6366f1]/60";
  if (count < 30) return "bg-[#d9a441]/55";
  return "bg-[#f5d47e]/90 shadow-[0_0_10px_rgba(245,212,126,0.5)]";
}

export function AttendanceHeatmap({ heatmap }: { heatmap: number[][] }) {
  const heatmapWeeks = heatmap;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel p-6"
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl font-semibold tracking-wide text-[#f4f1ea]">Attendance heatmap</h3>
          <p className="mt-1 text-xs tracking-[0.18em] text-stone-500">DAILY CHECK-INS · LAST 12 WEEKS · MON–SUN</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] tracking-wide text-stone-500">
          <span>Quiet</span>
          {["bg-white/[0.04]", "bg-[#4338ca]/40", "bg-[#6366f1]/60", "bg-[#d9a441]/55", "bg-[#f5d47e]/90"].map((c) => (
            <span key={c} className={cn("h-3 w-3 rounded-[4px]", c)} />
          ))}
          <span>Packed</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="grid min-w-[560px] grid-cols-[44px_repeat(12,minmax(0,1fr))] gap-1.5">
          {DAYS.map((day, d) => (
            <Fragment key={day}>
              <span className="flex items-center text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">
                {day}
              </span>
              {heatmapWeeks.map((week, w) => {
                const count = week?.[d] ?? 0;
                return (
                  <motion.div
                    key={w}
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.015 * (d * 12 + w), duration: 0.3 }}
                    title={`${count} check-ins`}
                    className={cn(
                      "aspect-square w-full rounded-[5px] transition-transform hover:scale-125",
                      intensity(count)
                    )}
                  />
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs tracking-wide text-stone-500">
        Peak window: <span className="font-semibold text-[#f5d47e]">Mon–Fri · 6–8 AM</span> — schedule your star
        trainers there.
      </p>
    </motion.div>
  );
}
