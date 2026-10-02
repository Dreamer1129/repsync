"use client";

import Link from "next/link";
import { Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-10 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#f5d47e] to-[#b8860b]">
            <Activity className="h-4 w-4 text-[#060913]" strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl font-semibold tracking-wide text-[#f4f1ea]">
            Rep<span className="text-gold-grad">Sync</span>
          </span>
        </Link>
        <div className="flex items-center gap-7 text-xs font-medium tracking-[0.2em] text-stone-500">
          <a href="#features" className="transition hover:text-[#f5d47e]">
            FEATURES
          </a>
          <a href="#plans" className="transition hover:text-[#f5d47e]">
            PLANS
          </a>
          <Link href="/dashboard" className="transition hover:text-[#f5d47e]">
            DASHBOARD
          </Link>
        </div>
        <p className="text-xs tracking-[0.2em] text-stone-600">© 2026 REPSYNC · GYM MANAGEMENT OS</p>
      </div>
    </footer>
  );
}
