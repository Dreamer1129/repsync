"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, Search } from "lucide-react";
import { useMembers, usePayments } from "@/lib/hooks";
import { initials } from "@/lib/format";

const titles: Record<string, string> = {
  "/dashboard": "Mission Control",
  "/dashboard/members": "Member Registry",
  "/dashboard/plans": "Membership Plans",
  "/dashboard/payments": "Fee Collection",
  "/dashboard/trainers": "Trainer Roster",
  "/dashboard/batches": "Batch Schedule",
  "/dashboard/attendance": "Attendance Deck",
};

export function Topbar() {
  const pathname = usePathname();
  const title =
    titles[pathname] ??
    (pathname.startsWith("/dashboard/members/") ? "Member Profile" : "Mission Control");
  const { data: members } = useMembers();
  const { data: payments } = usePayments();
  const alerts =
    (members ?? []).filter((m) => m.status !== "active").length +
    (payments ?? []).filter((p) => p.status !== "paid").length;

  return (
    <motion.div
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-10 border-b border-white/10 bg-[#060913]/70 backdrop-blur-xl lg:left-64"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d9a441]">RepSync OS</p>
          <h1 className="mt-0.5 font-display text-2xl font-semibold tracking-wide text-[#f4f1ea] md:text-3xl">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
            <input
              placeholder="Search members, batches…"
              className="input-glass w-64 !pl-10"
              aria-label="Search"
            />
          </div>
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-stone-300 transition hover:border-[#d9a441]/50 hover:text-[#f5d47e]"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
            {alerts > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#e9bd55] to-[#b8860b] px-1 text-[10px] font-bold text-[#060913]">
                {alerts}
              </span>
            )}
          </button>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] to-[#312e81] text-xs font-bold tracking-wide text-[#f4f1ea]">
            {initials("Gym Owner")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
