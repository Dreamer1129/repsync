"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Users } from "lucide-react";
import { usePlans, useMembers } from "@/lib/hooks";
import { LoadingBlock } from "@/components/ui/LoadingBlock";
import { pkr, initials } from "@/lib/format";
import { cn } from "@/lib/cn";
import { fadeUp, staggerParent, scaleIn } from "@/lib/motion";

export default function PlansPage() {
  const { data: plansData } = usePlans();
  const { data: membersData } = useMembers();
  const [selected, setSelected] = useState<string>("pro");

  if (!plansData || !membersData) {
    return (
      <div className="space-y-5">
        <div className="py-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#d9a441]">Tiers</p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-wide text-[#f4f1ea] md:text-5xl">
            Four acts, <span className="text-gold-grad italic">one stage.</span>
          </h2>
        </div>
        <LoadingBlock lines={6} />
      </div>
    );
  }

  const plans = plansData;
  const members = membersData;
  const plan = plans.find((p) => p.id === selected) ?? plans[0];
  const onPlan = members.filter((m) => m.planId === plan.id);

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="py-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#d9a441]">Tiers</p>
        <h2 className="mt-2 font-display text-4xl font-semibold tracking-wide text-[#f4f1ea] md:text-5xl">
          Four acts, <span className="text-gold-grad italic">one stage.</span>
        </h2>
        <p className="mt-2 max-w-xl text-sm tracking-wide text-stone-400">
          Select a tier to inspect its feature script and see exactly who is performing on it.
        </p>
      </motion.div>

      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
      >
        {plans.map((p, i) => {
          const count = members.filter((m) => m.planId === p.id).length;
          const active = selected === p.id;
          return (
            <motion.button
              key={p.id}
              variants={scaleIn}
              custom={i}
              onClick={() => setSelected(p.id)}
              whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 280, damping: 22 } }}
              className={cn(
                "glass-panel p-6 text-left transition",
                active && "border-[#d9a441]/60 shadow-[0_0_36px_rgba(217,164,65,0.25)]"
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: p.color }}>
                  {p.name}
                </p>
                {p.popular && (
                  <span className="rounded-full bg-gradient-to-r from-[#e9bd55] to-[#b8860b] px-2.5 py-0.5 text-[10px] font-bold tracking-[0.15em] text-[#060913]">
                    POPULAR
                  </span>
                )}
              </div>
              <p className="mt-3 font-display text-4xl font-semibold tracking-wide text-[#f4f1ea]">{pkr(p.price)}</p>
              <p className="mt-1 text-xs tracking-[0.2em] text-stone-500">/ {p.durationMonths} MONTHS</p>
              <p className="mt-3 text-xs italic tracking-wide text-stone-400">{p.tagline}</p>
              <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4 text-xs tracking-wide text-stone-400">
                <Users className="h-3.5 w-3.5 text-[#d9a441]" />
                <span className="font-bold text-stone-200">{count}</span> members enrolled
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      <motion.div
        key={selected}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-panel p-7"
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: plan.color }}>
              {plan.name} · Feature script
            </p>
            <ul className="mt-5 space-y-3.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm tracking-wide text-stone-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#d9a441]/40 bg-[#d9a441]/10">
                    <Check className="h-3 w-3 text-[#f5d47e]" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-400">
              On this plan · {onPlan.length}
            </p>
            <div className="mt-5 space-y-3">
              {onPlan.map((m) => (
                <div key={m.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold text-[#060913]"
                    style={{ background: `linear-gradient(135deg, hsl(${m.hue} 70% 65%), hsl(${m.hue} 70% 45%))` }}
                  >
                    {initials(m.name)}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold tracking-wide text-stone-100">{m.name}</p>
                    <p className="text-xs tracking-wide text-stone-500">{m.attendanceRate}% attendance</p>
                  </div>
                  <span className="font-display text-lg font-semibold text-[#f5d47e]">{pkr(m.totalPaid)}</span>
                </div>
              ))}
              {onPlan.length === 0 && (
                <p className="py-8 text-center text-sm tracking-wide text-stone-500">No members on this plan yet.</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
