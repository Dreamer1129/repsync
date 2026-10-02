"use client";

import { motion } from "framer-motion";
import { Users, CreditCard, CalendarCheck2, Dumbbell, Radar, LineChart } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { staggerParent, scaleIn } from "@/lib/motion";

const capabilities = [
  {
    icon: Users,
    title: "Member Registry",
    spec: "Profiles · plans · history",
    desc: "Every member's journey — join date, plan, payments and attendance — in one cinematic profile.",
  },
  {
    icon: CreditCard,
    title: "Plans & Billing",
    spec: "4 tiers · PKR native",
    desc: "Starter to Royal Annual. Fee collection tracked to the rupee with paid, due and overdue states.",
  },
  {
    icon: CalendarCheck2,
    title: "Attendance Engine",
    spec: "Tap-to-mark · heatmaps",
    desc: "Counter-friendly tap marking plus a 12-week intensity heatmap that reveals your rush hours.",
  },
  {
    icon: Dumbbell,
    title: "Trainers & Batches",
    spec: "Schedules · capacity",
    desc: "Roster your coaches, fill their batches, and watch capacity bars fill like a fight card.",
  },
  {
    icon: Radar,
    title: "Expiry Radar",
    spec: "7-day early warning",
    desc: "Memberships expiring within a week surface automatically — renew them before they lapse.",
  },
  {
    icon: LineChart,
    title: "Revenue Analytics",
    spec: "Pulse · targets · mix",
    desc: "Monthly revenue against target, plan mix and collection health — the gym's heartbeat, visualized.",
  },
];

export function SpecMatrix() {
  return (
    <section id="features" className="px-6 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="The Spec Matrix"
          title={
            <>
              Everything, in <span className="text-gold-grad italic">one matrix.</span>
            </>
          }
          sub="Six systems that used to live in notebooks, spreadsheets and memory — now choreographed in a single workspace."
        />
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {capabilities.map((c, i) => (
            <motion.div
              key={c.title}
              variants={scaleIn}
              custom={i}
              whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 280, damping: 22 } }}
              className="glass-panel group p-7"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#d9a441]/30 bg-gradient-to-br from-[#d9a441]/20 to-transparent transition group-hover:shadow-[0_0_24px_rgba(217,164,65,0.35)]">
                <c.icon className="h-5 w-5 text-[#f5d47e]" strokeWidth={1.75} />
              </div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d9a441]/80">{c.spec}</p>
              <h3 className="font-display text-2xl font-semibold tracking-wide text-[#f4f1ea]">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed tracking-wide text-stone-400">{c.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
