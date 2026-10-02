"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

const links = [
  { label: "Capabilities", href: "#features" },
  { label: "Plans", href: "#plans" },
  { label: "Owners", href: "#testimonials" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-30 transition-all duration-300",
        scrolled ? "border-b border-white/10 bg-[#060913]/70 backdrop-blur-xl" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f5d47e] to-[#b8860b] shadow-[0_0_24px_rgba(217,164,65,0.4)]">
            <Activity className="h-5 w-5 text-[#060913]" strokeWidth={2.5} />
          </span>
          <span className="font-display text-2xl font-semibold tracking-wide text-[#f4f1ea]">
            Rep<span className="text-gold-grad">Sync</span>
          </span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium tracking-[0.18em] text-stone-400 transition hover:text-[#f5d47e]"
            >
              {l.label.toUpperCase()}
            </a>
          ))}
        </div>
        <Link
          href="/dashboard"
          className="group flex items-center gap-2 rounded-xl border border-[#d9a441]/40 bg-gradient-to-r from-[#d9a441]/20 to-[#d9a441]/5 px-5 py-2.5 text-sm font-semibold tracking-wide text-[#f5d47e] transition hover:border-[#d9a441]/70 hover:shadow-[0_0_28px_rgba(217,164,65,0.35)]"
        >
          Open Dashboard
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </nav>
    </motion.header>
  );
}
