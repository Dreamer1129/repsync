"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUp } from "@/lib/motion";

export function CTA() {
  return (
    <section className="px-6 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          whileHover={{ scale: 1.01, transition: { type: "spring", stiffness: 260, damping: 24 } }}
          className="glass-panel overflow-hidden px-8 py-16 text-center md:px-16 md:py-20"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 120%, rgba(217,164,65,0.22), transparent 65%), radial-gradient(ellipse at 50% -20%, rgba(67,56,202,0.35), transparent 60%)",
            }}
          />
          <div className="relative">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#d9a441]">Final call</p>
            <h2 className="font-display text-4xl font-semibold tracking-wide text-[#f4f1ea] md:text-6xl">
              Ready to sync <span className="text-gold-grad italic">your reps?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed tracking-wide text-stone-400 md:text-base">
              Step into the dashboard — live members, live revenue, live batches. This is what running a gym feels
              like when the paperwork disappears.
            </p>
            <Link
              href="/dashboard"
              className="group mt-9 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e9bd55] to-[#b8860b] px-9 py-4 text-sm font-bold tracking-[0.15em] text-[#060913] shadow-[0_0_36px_rgba(217,164,65,0.45)] transition hover:shadow-[0_0_56px_rgba(217,164,65,0.6)]"
            >
              LAUNCH REPSYNC
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
