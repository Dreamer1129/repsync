"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, X, Users, CalendarDays, Dumbbell, AlertTriangle, ArrowRight } from "lucide-react";
import { useBatches, useMembers, usePayments, useTrainers } from "@/lib/hooks";
import { initials, pkr } from "@/lib/format";
import { StatusBadge } from "@/components/ui/StatusBadge";

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
  const router = useRouter();
  const pathname = usePathname();
  const title =
    titles[pathname] ??
    (pathname.startsWith("/dashboard/members/") ? "Member Profile" : "Mission Control");

  const { data: membersData } = useMembers();
  const { data: paymentsData } = usePayments();
  const { data: batchesData } = useBatches();
  const { data: trainersData } = useTrainers();

  const members = membersData ?? [];
  const payments = paymentsData ?? [];
  const batches = batchesData ?? [];
  const trainers = trainersData ?? [];

  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut to focus search ("/" or "Ctrl+K" / "Cmd+K")
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.key === "/" && (e.target as HTMLElement).tagName !== "INPUT") || ((e.metaKey || e.ctrlKey) && e.key === "k")) {
        e.preventDefault();
        setSearchOpen(true);
        inputRef.current?.focus();
      } else if (e.key === "Escape") {
        setSearchOpen(false);
        setAlertsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Outside click listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (alertsRef.current && !alertsRef.current.contains(e.target as Node)) {
        setAlertsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const atRiskMembers = useMemo(() => members.filter((m) => m.status !== "active"), [members]);
  const overduePayments = useMemo(() => payments.filter((p) => p.status === "overdue"), [payments]);
  const alertCount = atRiskMembers.length + overduePayments.length;

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { members: [], batches: [], trainers: [] };
    return {
      members: members
        .filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.planName.toLowerCase().includes(q))
        .slice(0, 5),
      batches: batches
        .filter((b) => b.name.toLowerCase().includes(q) || b.trainerName.toLowerCase().includes(q) || b.time.toLowerCase().includes(q))
        .slice(0, 4),
      trainers: trainers
        .filter((t) => t.name.toLowerCase().includes(q) || t.specialty.toLowerCase().includes(q))
        .slice(0, 3),
    };
  }, [query, members, batches, trainers]);

  const hasResults =
    searchResults.members.length > 0 ||
    searchResults.batches.length > 0 ||
    searchResults.trainers.length > 0;

  function selectResult(path: string) {
    setSearchOpen(false);
    setQuery("");
    router.push(path);
  }

  return (
    <motion.div
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-20 border-b border-white/10 bg-[#060913]/80 backdrop-blur-xl lg:left-64"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d9a441]">RepSync OS</p>
          <h1 className="mt-0.5 font-display text-2xl font-semibold tracking-wide text-[#f4f1ea] md:text-3xl">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Global Search Bar */}
          <div ref={searchRef} className="relative hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search athletes, batches, coaches… (/)"
                className="input-glass w-72 !pl-10 !pr-8 text-xs tracking-wide"
                aria-label="Search gym"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {searchOpen && query.trim().length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="glass-panel absolute right-0 top-full mt-2 max-h-[460px] w-96 overflow-y-auto border border-white/15 bg-[#0a0f1e]/98 p-3 shadow-2xl backdrop-blur-2xl"
                >
                  {!hasResults ? (
                    <div className="py-8 text-center">
                      <p className="text-xs tracking-wide text-stone-400">No matches for &ldquo;{query}&rdquo;</p>
                      <p className="mt-1 text-[11px] text-stone-500">Try searching by name, email, plan, or batch time.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {searchResults.members.length > 0 && (
                        <div>
                          <p className="mb-1.5 flex items-center gap-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#d9a441]">
                            <Users className="h-3 w-3" /> Athletes ({searchResults.members.length})
                          </p>
                          <div className="space-y-1">
                            {searchResults.members.map((m) => (
                              <button
                                key={m.id}
                                onClick={() => selectResult(`/dashboard/members/${m.id}`)}
                                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-white/[0.06]"
                              >
                                <span
                                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-[#060913]"
                                  style={{ background: `linear-gradient(135deg, hsl(${m.hue} 70% 65%), hsl(${m.hue} 70% 45%))` }}
                                >
                                  {initials(m.name)}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-xs font-semibold text-stone-100">{m.name}</p>
                                  <p className="truncate text-[10px] text-stone-400">{m.email} · {m.planName}</p>
                                </div>
                                <StatusBadge status={m.status} />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchResults.batches.length > 0 && (
                        <div>
                          <p className="mb-1.5 flex items-center gap-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#d9a441]">
                            <CalendarDays className="h-3 w-3" /> Batches ({searchResults.batches.length})
                          </p>
                          <div className="space-y-1">
                            {searchResults.batches.map((b) => (
                              <button
                                key={b.id}
                                onClick={() => selectResult("/dashboard/batches")}
                                className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left transition hover:bg-white/[0.06]"
                              >
                                <div>
                                  <p className="text-xs font-semibold text-stone-100">{b.name}</p>
                                  <p className="text-[10px] text-stone-400">{b.time} · Coach {b.trainerName}</p>
                                </div>
                                <StatusBadge status={b.intensity} />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchResults.trainers.length > 0 && (
                        <div>
                          <p className="mb-1.5 flex items-center gap-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#d9a441]">
                            <Dumbbell className="h-3 w-3" /> Coaches ({searchResults.trainers.length})
                          </p>
                          <div className="space-y-1">
                            {searchResults.trainers.map((t) => (
                              <button
                                key={t.id}
                                onClick={() => selectResult("/dashboard/trainers")}
                                className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left transition hover:bg-white/[0.06]"
                              >
                                <div>
                                  <p className="text-xs font-semibold text-stone-100">{t.name}</p>
                                  <p className="text-[10px] text-stone-400">{t.specialty}</p>
                                </div>
                                <span className="text-[11px] font-semibold text-[#f5d47e]">★ {t.rating.toFixed(1)}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Interactive Alerts Bell */}
          <div ref={alertsRef} className="relative">
            <button
              onClick={() => setAlertsOpen((v) => !v)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-stone-300 transition hover:border-[#d9a441]/50 hover:text-[#f5d47e]"
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {alertCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#e9bd55] to-[#b8860b] px-1 text-[10px] font-bold text-[#060913]">
                  {alertCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {alertsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="glass-panel absolute right-0 top-full mt-2 w-80 overflow-hidden border border-white/15 bg-[#0a0f1e]/98 shadow-2xl backdrop-blur-2xl"
                >
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f5d47e]">Action radar</p>
                    <span className="rounded-full border border-rose-400/30 bg-rose-400/10 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                      {alertCount} pending
                    </span>
                  </div>

                  <div className="max-h-72 space-y-2.5 overflow-y-auto p-3">
                    {alertCount === 0 ? (
                      <p className="py-6 text-center text-xs tracking-wide text-stone-400">All quiet — no memberships expiring or payments overdue.</p>
                    ) : (
                      <>
                        {atRiskMembers.slice(0, 4).map((m) => (
                          <div key={m.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-2.5">
                            <div>
                              <Link
                                href={`/dashboard/members/${m.id}`}
                                onClick={() => setAlertsOpen(false)}
                                className="text-xs font-semibold text-stone-200 hover:text-[#f5d47e]"
                              >
                                {m.name}
                              </Link>
                              <p className="text-[10px] text-stone-500">{m.planName} · {m.status}</p>
                            </div>
                            <StatusBadge status={m.status} />
                          </div>
                        ))}

                        {overduePayments.slice(0, 3).map((p) => (
                          <div key={p.id} className="flex items-center justify-between rounded-lg border border-rose-400/20 bg-rose-400/[0.04] p-2.5">
                            <div>
                              <p className="text-xs font-semibold text-stone-200">{p.memberName}</p>
                              <p className="text-[10px] text-rose-300">Overdue {pkr(p.amount)}</p>
                            </div>
                            <StatusBadge status="overdue" />
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  <div className="border-t border-white/10 p-2.5 bg-white/[0.01]">
                    <Link
                      href="/dashboard"
                      onClick={() => setAlertsOpen(false)}
                      className="flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-center text-[11px] font-bold tracking-wide text-[#f5d47e] transition hover:bg-white/[0.04]"
                    >
                      VIEW RADAR OVERVIEW <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Badge */}
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] to-[#312e81] text-xs font-bold tracking-wide text-[#f4f1ea]">
            {initials("Gym Owner")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
