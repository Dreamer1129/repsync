"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export function GlassCard({ children, className, delay = 0, hover = true }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? { scale: 1.02, transition: { type: "spring", stiffness: 280, damping: 22 } } : undefined}
      className={cn("glass-panel p-6", className)}
    >
      {children}
    </motion.div>
  );
}
