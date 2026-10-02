"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Clock, Users } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BatchDrawer } from "@/components/drawers/BatchDrawer";
import { LoadingBlock } from "@/components/ui/LoadingBlock";
import { useBatches } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import { fadeUp, staggerParent, scaleIn } from "@/lib/motion";

export default function BatchesPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data, refresh } = useBatches();

  if (!data) {
    return (
      <div className="space-y-5">
        <div className="py-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#d9a441]">Classes</p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-wide text-[#f4f1ea]">
            Loading <span className="text-gold-grad italic">the arena.</span>
          </h2>
        </div>
        <LoadingBlock lines={6} />
      </div>
    );
  }
  const batches = data;

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#d9a441]">Classes</p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-wide text-[#f4f1ea]">
            {batches.length} stages, <span className="text-gold-grad italic">one arena.</span>
          </h2>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e9bd55] to-[#b8860b] px-6 py-3 text-sm font-bold tracking-[0.12em] text-[#060913] shadow-[0_0_28px_rgba(217,164,65,0.4)] transition hover:shadow-[0_0_40px_rgba(217,164,65,0.55)]"
        >
          <Plus className="h-4 w-4" /> NEW BATCH
        </button>
      </motion.div>

      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
      >
        {batches.map((b, i) => {
          const pct = Math.round((b.enrolled / b.capacity) * 100);
          const full = pct >= 95;
          return (
            <motion.div
              key={b.id}
              variants={scaleIn}
              custom={i}
              whileHover={{ scale: 1.02, y: -4, transition: { type: "spring", stiffness: 280, damping: 22 } }}
              className="glass-panel overflow-hidden"
            >
              <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, hsl(${b.hue} 75% 55%), hsl(${b.hue} 75% 35%))` }} />
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-2xl font-semibold tracking-wide text-[#f4f1ea]">{b.name}</h3>
                  <StatusBadge status={b.intensity} />
                </div>
                <p className="mt-1 text-xs tracking-[0.18em] text-stone-500">COACHED BY {b.trainerName.toUpperCase()}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {b.days.map((d) => (
                    <span key={d} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-bold tracking-wide text-stone-300">
                      {d}
                    </span>
                  ))}
                  <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[#f5d47e]">
                    <Clock className="h-3.5 w-3.5" /> {b.time}
                  </span>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs tracking-wide">
                    <span className="flex items-center gap-1.5 text-stone-400">
                      <Users className="h-3.5 w-3.5" /> Capacity
                    </span>
                    <span className={cn("font-bold", full ? "text-rose-300" : "text-stone-200")}>
                      {b.enrolled}/{b.capacity} {full && "· FULL"}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.06, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        "h-full rounded-full",
                        full ? "bg-gradient-to-r from-rose-500 to-rose-300" : "bg-gradient-to-r from-[#e9bd55] to-[#f5d47e]"
                      )}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <BatchDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onCreated={refresh} />
    </div>
  );
}
