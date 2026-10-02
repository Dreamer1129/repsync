"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, Wallet, CalendarCheck } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { fadeUp, staggerParent } from "@/lib/motion";
import { marketingRevenue, marketingMembers } from "@/lib/marketing";
import { initials } from "@/lib/format";

const stats = [
  { icon: Users, value: "2,400+", label: "Members synced" },
  { icon: Wallet, value: "99.2%", label: "Fee recovery" },
  { icon: CalendarCheck, value: "40+", label: "Trainers live" },
  { icon: Sparkles, value: "4.9/5", label: "Owner rating" },
];

function MiniChart() {
  return (
    <div className="h-28 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={marketingRevenue} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="heroGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f5d47e" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#f5d47e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="revenue" stroke="#f5d47e" strokeWidth={2.5} fill="url(#heroGold)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-36 md:px-8 md:pt-44">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <motion.div variants={staggerParent} initial="hidden" animate="show">
          <motion.p
            variants={fadeUp}
            custom={0}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d9a441]/30 bg-[#d9a441]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f5d47e]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Gym Management OS
          </motion.p>
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-display text-5xl font-semibold leading-[1.08] tracking-wide text-[#f4f1ea] md:text-7xl"
          >
            Run your gym like
            <br />
            a <span className="text-gold-grad italic">grand arena.</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-6 max-w-lg text-base leading-relaxed tracking-wide text-stone-400 md:text-lg"
          >
            RepSync fuses members, plans, payments, trainers, batches and attendance into one cinematic command
            center — with expiry radar and a revenue pulse you can feel.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e9bd55] to-[#b8860b] px-7 py-3.5 text-sm font-bold tracking-[0.15em] text-[#060913] shadow-[0_0_36px_rgba(217,164,65,0.45)] transition hover:shadow-[0_0_52px_rgba(217,164,65,0.6)]"
            >
              ENTER THE DASHBOARD
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#plans"
              className="rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold tracking-[0.15em] text-stone-200 backdrop-blur-md transition hover:border-[#d9a441]/50 hover:text-[#f5d47e]"
            >
              VIEW PLANS
            </a>
          </motion.div>
          <motion.div variants={fadeUp} custom={4} className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <s.icon className="mb-2 h-4 w-4 text-[#d9a441]" strokeWidth={1.75} />
                <p className="font-display text-2xl font-semibold tracking-wide text-[#f4f1ea]">{s.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-stone-500">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="animate-float-y">
            <div className="glass-panel p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-stone-400">Revenue pulse</p>
                  <p className="mt-1 font-display text-3xl font-semibold tracking-wide text-[#f4f1ea]">
                    PKR 592K <span className="text-sm font-sans font-medium text-emerald-300">+8.1%</span>
                  </p>
                </div>
                <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-emerald-300">
                  LIVE
                </span>
              </div>
              <MiniChart />
              <div className="mt-5 space-y-3 border-t border-white/10 pt-5">
                {marketingMembers.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.15, duration: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold text-[#060913]"
                      style={{ background: `linear-gradient(135deg, hsl(${m.hue} 70% 65%), hsl(${m.hue} 70% 45%))` }}
                    >
                      {initials(m.name)}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium tracking-wide text-stone-200">{m.name}</p>
                      <p className="text-xs tracking-wide text-stone-500">{m.lastCheckin}</p>
                    </div>
                    <span className="text-xs font-semibold tracking-wide text-emerald-300">CHECKED IN</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-[#d9a441]/30 bg-[#0a0f1e]/90 px-5 py-4 backdrop-blur-xl md:block">
            <p className="text-[11px] uppercase tracking-[0.25em] text-stone-400">Expiring this week</p>
            <p className="mt-1 font-display text-3xl font-semibold text-gold-grad">3 members</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
