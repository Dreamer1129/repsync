"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { fadeUp } from "@/lib/motion";

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  align?: "center" | "left";
}

export function SectionHeading({ eyebrow, title, sub, align = "center" }: SectionHeadingProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={cn("mb-12 max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left")}
    >
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#d9a441]">{eyebrow}</p>
      <h2 className="font-display text-4xl font-semibold tracking-wide text-[#f4f1ea] md:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-sm leading-relaxed tracking-wide text-stone-400 md:text-base">{sub}</p>}
    </motion.div>
  );
}
