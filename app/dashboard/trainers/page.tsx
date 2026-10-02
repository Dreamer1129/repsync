"use client";

import { motion } from "framer-motion";
import { Star, CalendarClock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TrainerSchedule } from "@/components/dashboard/TrainerSchedule";
import { LoadingBlock } from "@/components/ui/LoadingBlock";
import { useTrainers } from "@/lib/hooks";
import { initials } from "@/lib/format";
import { fadeUp, staggerParent, scaleIn } from "@/lib/motion";

export default function TrainersPage() {
  const { data } = useTrainers();
  if (!data) {
    return (
      <div className="space-y-5">
        <div className="py-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#d9a441]">Coaches</p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-wide text-[#f4f1ea] md:text-5xl">
            The <span className="text-gold-grad italic">maestros.</span>
          </h2>
        </div>
        <LoadingBlock lines={6} />
      </div>
    );
  }
  const trainers = data;
  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="py-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#d9a441]">Coaches</p>
        <h2 className="mt-2 font-display text-4xl font-semibold tracking-wide text-[#f4f1ea] md:text-5xl">
          The <span className="text-gold-grad italic">maestros.</span>
        </h2>
        <p className="mt-2 max-w-xl text-sm tracking-wide text-stone-400">
          Five coaches, eighty-one sessions a week. Every batch below is one of their stages.
        </p>
      </motion.div>

      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
      >
        {trainers.map((t, i) => (
          <motion.div key={t.id} variants={scaleIn} custom={i}>
            <GlassCard className="h-full">
              <div className="flex items-start justify-between">
                <span
                  className="flex h-16 w-16 items-center justify-center rounded-2xl font-display text-xl font-bold text-[#060913] shadow-xl"
                  style={{ background: `linear-gradient(135deg, hsl(${t.hue} 75% 68%), hsl(${t.hue} 75% 45%))` }}
                >
                  {initials(t.name)}
                </span>
                <StatusBadge status={t.status} />
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold tracking-wide text-[#f4f1ea]">{t.name}</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.22em] text-[#d9a441]/90">{t.specialty}</p>
              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
                <div>
                  <p className="flex items-center gap-1 font-display text-xl font-semibold text-[#f4f1ea]">
                    <Star className="h-3.5 w-3.5 fill-[#d9a441] text-[#d9a441]" /> {t.rating.toFixed(1)}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-stone-500">Rating</p>
                </div>
                <div>
                  <p className="font-display text-xl font-semibold text-[#f4f1ea]">{t.experienceYrs}y</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-stone-500">Experience</p>
                </div>
                <div>
                  <p className="flex items-center gap-1 font-display text-xl font-semibold text-[#f4f1ea]">
                    <CalendarClock className="h-3.5 w-3.5 text-[#d9a441]" /> {t.sessionsPerWeek}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-stone-500">Sessions/wk</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}

        <motion.div variants={scaleIn} custom={trainers.length}>
          <GlassCard className="flex h-full min-h-[220px] flex-col items-center justify-center border-dashed text-center">
            <p className="font-display text-2xl font-semibold tracking-wide text-[#f4f1ea]">Scouting talent?</p>
            <p className="mt-2 max-w-[220px] text-xs leading-relaxed tracking-wide text-stone-400">
              Trial coaches appear here during their probation week before joining the roster.
            </p>
            <span className="mt-4 rounded-full border border-[#d9a441]/40 bg-[#d9a441]/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-[#f5d47e]">
              1 TRIAL PENDING
            </span>
          </GlassCard>
        </motion.div>
      </motion.div>

      <TrainerSchedule />
    </div>
  );
}
