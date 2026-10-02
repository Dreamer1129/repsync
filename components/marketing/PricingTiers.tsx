"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Crown } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { marketingPlans } from "@/lib/marketing";
import { pkr } from "@/lib/format";
import { cn } from "@/lib/cn";
import { staggerParent, scaleIn } from "@/lib/motion";

export function PricingTiers() {
  const tiers = marketingPlans.slice(0, 3);
  return (
    <section id="plans" className="px-6 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Membership Tiers"
          title={
            <>
              Priced like <span className="text-gold-grad italic">a premiere.</span>
            </>
          }
          sub="Three acts for every kind of athlete. Every tier unlocks the full RepSync tracking experience."
        />
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-5 lg:grid-cols-3"
        >
          {tiers.map((plan, i) => (
            <motion.div
              key={plan.id}
              variants={scaleIn}
              custom={i}
              whileHover={{ scale: 1.02, y: -6, transition: { type: "spring", stiffness: 260, damping: 22 } }}
              className={cn("glass-panel relative flex flex-col p-8", plan.popular && "border-[#d9a441]/50")}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#e9bd55] to-[#b8860b] px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#060913]">
                  <Crown className="h-3 w-3" /> Most chosen
                </span>
              )}
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: plan.color }}>
                {plan.name}
              </p>
              <p className="mt-2 text-sm tracking-wide text-stone-400">{plan.tagline}</p>
              <p className="mt-5 font-display text-5xl font-semibold tracking-wide text-[#f4f1ea]">
                {pkr(plan.price)}
                <span className="ml-2 align-middle font-sans text-xs font-medium tracking-[0.2em] text-stone-500">
                  / {plan.durationMonths} MO
                </span>
              </p>
              <ul className="mt-7 flex-1 space-y-3.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm tracking-wide text-stone-300">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#d9a441]/40 bg-[#d9a441]/10">
                      <Check className="h-3 w-3 text-[#f5d47e]" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className={cn(
                  "mt-8 rounded-xl px-6 py-3 text-center text-sm font-bold tracking-[0.15em] transition",
                  plan.popular
                    ? "bg-gradient-to-r from-[#e9bd55] to-[#b8860b] text-[#060913] shadow-[0_0_28px_rgba(217,164,65,0.4)] hover:shadow-[0_0_40px_rgba(217,164,65,0.55)]"
                    : "border border-white/15 bg-white/5 text-stone-200 hover:border-[#d9a441]/50 hover:text-[#f5d47e]"
                )}
              >
                CHOOSE {plan.name.toUpperCase()}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
