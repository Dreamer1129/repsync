"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  LayoutDashboard,
  Users,
  CreditCard,
  Wallet,
  Dumbbell,
  CalendarDays,
  ClipboardCheck,
  BellRing,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useMembers, usePayments } from "@/lib/hooks";

const nav = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Members", href: "/dashboard/members", icon: Users },
  { label: "Plans", href: "/dashboard/plans", icon: CreditCard },
  { label: "Payments", href: "/dashboard/payments", icon: Wallet },
  { label: "Trainers", href: "/dashboard/trainers", icon: Dumbbell },
  { label: "Batches", href: "/dashboard/batches", icon: CalendarDays },
  { label: "Attendance", href: "/dashboard/attendance", icon: ClipboardCheck },
];

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="space-y-1.5">
      {nav.map((item) => {
        const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium tracking-wide transition",
              active
                ? "border border-[#d9a441]/40 bg-gradient-to-r from-[#d9a441]/20 to-transparent text-[#f5d47e] shadow-[0_0_20px_rgba(217,164,65,0.2)]"
                : "border border-transparent text-stone-400 hover:border-white/10 hover:bg-white/5 hover:text-stone-200"
            )}
          >
            <item.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

export function Sidebar() {
  const { data: members } = useMembers();
  const { data: payments } = usePayments();
  const expiring = (members ?? []).filter((m) => m.status !== "active").length;
  const overdue = (payments ?? []).filter((p) => p.status === "overdue").length;

  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-white/10 bg-[#070b16]/80 px-5 py-6 backdrop-blur-xl lg:flex"
    >
      <Link href="/" className="mb-9 flex items-center gap-3 px-1">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f5d47e] to-[#b8860b] shadow-[0_0_24px_rgba(217,164,65,0.4)]">
          <Activity className="h-5 w-5 text-[#060913]" strokeWidth={2.5} />
        </span>
        <span className="font-display text-2xl font-semibold tracking-wide text-[#f4f1ea]">
          Rep<span className="text-gold-grad">Sync</span>
        </span>
      </Link>

      <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-500">Command Deck</p>
      <NavItems />

      <div className="mt-auto">
        <div className="glass-panel flex items-start gap-3 p-4">
          <BellRing className="mt-0.5 h-4 w-4 shrink-0 text-[#f5d47e]" />
          <div>
            <p className="text-xs font-semibold tracking-wide text-stone-200">Attention needed</p>
            <p className="mt-1 text-[11px] leading-relaxed tracking-wide text-stone-400">
              {expiring} memberships expiring · {overdue} overdue payments
            </p>
            <Link
              href="/dashboard"
              className="mt-2 inline-block text-[11px] font-bold tracking-[0.18em] text-[#f5d47e] hover:underline"
            >
              REVIEW →
            </Link>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

export function MobileNav() {
  return (
    <nav className="flex gap-2 overflow-x-auto px-4 pb-2 lg:hidden">
      {nav.map((item) => (
        <MobileNavLink key={item.href} href={item.href} label={item.label} icon={item.icon} />
      ))}
    </nav>
  );
}

function MobileNavLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}) {
  const pathname = usePathname();
  const active = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition",
        active
          ? "border-[#d9a441]/50 bg-[#d9a441]/15 text-[#f5d47e]"
          : "border-white/10 bg-white/5 text-stone-400"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Link>
  );
}
