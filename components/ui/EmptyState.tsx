"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  hint: string;
}

export function EmptyState({ icon: Icon, title, hint }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel flex flex-col items-center px-6 py-14 text-center"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d9a441]/30 bg-gradient-to-br from-[#d9a441]/20 to-transparent">
        <Icon className="h-6 w-6 text-[#f5d47e]" strokeWidth={1.5} />
      </div>
      <h4 className="font-display text-xl font-semibold tracking-wide text-[#f4f1ea]">{title}</h4>
      <p className="mt-2 max-w-xs text-sm tracking-wide text-stone-400">{hint}</p>
    </motion.div>
  );
}
