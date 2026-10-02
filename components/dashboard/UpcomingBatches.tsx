"use client";

import { motion } from "framer-motion";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { useBatches } from "@/lib/hooks";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LoadingBlock } from "@/components/ui/LoadingBlock";

export function UpcomingBatches() {
  const { data } = useBatches();
  if (!data) return <LoadingBlock lines={5} />;
  const today = data.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel flex flex-col p-6"
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d9a441]/30 bg-gradient-to-br from-[#d9a441]/20 to-transparent">
          <CalendarDays className="h-5 w-5 text-[#f5d47e]" strokeWidth={1.75} />
        </span>
        <div>
          <h3 className="font-display text-2xl font-semibold tracking-wide text-[#f4f1ea]">Today&apos;s batches</h3>
          <p className="text-xs tracking-[0.18em] text-stone-500">FRIDAY · 2 OCT 2026</p>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {today.map((b, i) => {
          const pct = Math.round((b.enrolled / b.capacity) * 100);
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * i, duration: 0.45 }}
              whileHover={{ scale: 1.015, transition: { type: "spring", stiffness: 300, damping: 24 } }}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="h-10 w-1.5 rounded-full"
                    style={{ background: `linear-gradient(180deg, hsl(${b.hue} 75% 60%), hsl(${b.hue} 75% 40%))` }}
                  />
                  <div>
                    <p className="text-sm font-semibold tracking-wide text-stone-100">{b.name}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs tracking-wide text-stone-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {b.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {b.trainerName}
                      </span>
                    </p>
                  </div>
                </div>
                <StatusBadge status={b.intensity} />
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-[#e9bd55] to-[#f5d47e]"
                  />
                </div>
                <span className="text-xs font-semibold tracking-wide text-stone-400">
                  {b.enrolled}/{b.capacity}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
