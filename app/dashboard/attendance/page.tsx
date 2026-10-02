"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Minus, Save, PartyPopper, CalendarX } from "lucide-react";
import { saveAttendance } from "@/lib/actions";
import { useBatches, useRoster, useAttendanceMarks } from "@/lib/hooks";
import { LoadingBlock } from "@/components/ui/LoadingBlock";
import { formatDate, initials } from "@/lib/format";
import { cn } from "@/lib/cn";
import { fadeUp } from "@/lib/motion";

type Mark = "present" | "absent" | null;

// Map JS getDay() (0=Sun…6=Sat) to the 3-letter abbreviation used in batch.days
const JS_DAY_TO_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export default function AttendancePage() {
  const { data: batchesData } = useBatches();
  const { data: rosterData } = useRoster();
  const [batchId, setBatchId] = useState<string | null>(null);
  const [marks, setMarks] = useState<Record<string, Mark>>({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Today's 3-letter day abbreviation ("Mon", "Tue", …)
  const todayShort = JS_DAY_TO_SHORT[new Date().getDay()];

  const allBatches = batchesData ?? [];
  const roster = rosterData ?? [];

  // Sort: batches running today first, then the rest alphabetically
  const batches = useMemo(() => {
    return [...allBatches].sort((a, b) => {
      const aToday = a.days.includes(todayShort) ? 0 : 1;
      const bToday = b.days.includes(todayShort) ? 0 : 1;
      return aToday - bToday || a.name.localeCompare(b.name);
    });
  }, [allBatches, todayShort]);

  const activeBatchId = batchId ?? batches[0]?.id ?? "";
  const batch = batches.find((b) => b.id === activeBatchId);
  const batchRunsToday = batch ? batch.days.includes(todayShort) : false;
  const { data: existingMarks, refresh: refreshMarks } = useAttendanceMarks(activeBatchId, todayISO);

  // Sync marks whenever fresh attendance marks arrive for the active batch/date
  useEffect(() => {
    if (existingMarks && Object.keys(existingMarks).length > 0) {
      setMarks(existingMarks);
      setSaved(true);
    } else {
      setMarks({});
      setSaved(false);
    }
  }, [existingMarks]);

  if (!batchesData || !rosterData || !batch) {
    return (
      <div className="space-y-5">
        <div className="py-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#d9a441]">Roll call</p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-wide text-[#f4f1ea] md:text-5xl">
            Tap. Mark. <span className="text-gold-grad italic">Done.</span>
          </h2>
        </div>
        <LoadingBlock lines={8} />
      </div>
    );
  }

  const present = Object.values(marks).filter((m) => m === "present").length;
  const absent = Object.values(marks).filter((m) => m === "absent").length;
  const marked = present + absent;

  async function handleSave() {
    const payload = Object.entries(marks)
      .filter(([, v]) => v !== null)
      .map(([memberId, status]) => ({ memberId, status: status as "present" | "absent" }));
    setSaving(true);
    const res = await saveAttendance(activeBatchId, todayISO, payload);
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      refreshMarks();
    }
  }
  function cycle(id: string) {
    setSaved(false);
    setMarks((prev) => {
      const cur = prev[id] ?? null;
      const next: Mark = cur === null ? "present" : cur === "present" ? "absent" : null;
      return { ...prev, [id]: next };
    });
  }

  function markAll(value: Exclude<Mark, null>) {
    setSaved(false);
    const next: Record<string, Mark> = {};
    roster.forEach((m) => {
      next[m.id] = value;
    });
    setMarks(next);
  }

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="py-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#d9a441]">Roll call</p>
        <h2 className="mt-2 font-display text-4xl font-semibold tracking-wide text-[#f4f1ea] md:text-5xl">
          Tap. Mark. <span className="text-gold-grad italic">Done.</span>
        </h2>
        <p className="mt-2 max-w-xl text-sm tracking-wide text-stone-400">
          Built for the front desk — big tap targets, instant tallies, zero paperwork.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="glass-panel p-5">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">Select batch</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
        {batches.map((b) => {
            const isToday = b.days.includes(todayShort);
            return (
            <button
              key={b.id}
              onClick={() => {
                setBatchId(b.id);
                setMarks({});
                setSaved(false);
              }}
              className={cn(
                "shrink-0 rounded-xl border px-4 py-2.5 text-left transition",
                activeBatchId === b.id
                  ? "border-[#d9a441]/60 bg-[#d9a441]/15 shadow-[0_0_20px_rgba(217,164,65,0.25)]"
                  : isToday
                    ? "border-white/20 bg-white/8 hover:border-white/30"
                    : "border-white/10 bg-white/5 opacity-60 hover:border-white/20 hover:opacity-80"
              )}
            >
              <p className={cn("text-sm font-bold tracking-wide", activeBatchId === b.id ? "text-[#f5d47e]" : "text-stone-200")}>
                {b.name}
              </p>
              <p className="text-[11px] tracking-wide text-stone-500">
                {b.time} · {b.trainerName}
              </p>
              {isToday && (
                <span className="mt-1 inline-block rounded-md bg-emerald-400/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                  Today
                </span>
              )}
            </button>
          );
        })}
        </div>
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2} className="glass-panel p-5 md:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold tracking-wide text-stone-200">
              {batch.name} · {roster.length} on roster
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => markAll("present")}
                className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-2 text-xs font-bold tracking-wide text-emerald-300 transition hover:bg-emerald-400/20"
              >
                ALL PRESENT
              </button>
              <button
                onClick={() => setMarks({})}
                className="rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold tracking-wide text-stone-400 transition hover:text-stone-200"
              >
                RESET
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {roster.map((m, i) => {
                const mark = marks[m.id] ?? null;
                return (
                  <motion.button
                    key={m.id}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.04 * i, duration: 0.35 }}
                    onClick={() => cycle(m.id)}
                    whileTap={{ scale: 0.94 }}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl border p-4 transition",
                      mark === "present" && "border-emerald-400/60 bg-emerald-400/10 shadow-[0_0_20px_rgba(52,211,153,0.25)]",
                      mark === "absent" && "border-rose-400/60 bg-rose-400/10",
                      mark === null && "border-white/10 bg-white/[0.03] hover:border-[#d9a441]/40"
                    )}
                  >
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-[#060913]"
                      style={{ background: `linear-gradient(135deg, hsl(${m.hue} 70% 65%), hsl(${m.hue} 70% 45%))` }}
                    >
                      {initials(m.name)}
                    </span>
                    <span className="text-center text-xs font-semibold leading-tight tracking-wide text-stone-200">
                      {m.name}
                    </span>
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full border",
                        mark === "present" && "border-emerald-400/60 bg-emerald-400/20 text-emerald-300",
                        mark === "absent" && "border-rose-400/60 bg-rose-400/20 text-rose-300",
                        mark === null && "border-white/15 text-stone-600"
                      )}
                    >
                      {mark === "present" && <Check className="h-4 w-4" />}
                      {mark === "absent" && <X className="h-4 w-4" />}
                      {mark === null && <Minus className="h-4 w-4" />}
                    </span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} className="space-y-5">
          <div className="glass-panel p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">Tally</p>
            <p className="mt-2 font-display text-5xl font-semibold tracking-wide text-[#f4f1ea]">
              {present}
              <span className="text-2xl text-stone-500">/{roster.length}</span>
            </p>
            <p className="mt-1 text-xs tracking-wide text-stone-500">present · {absent} absent · {roster.length - marked} unmarked</p>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                animate={{ width: `${roster.length ? (present / roster.length) * 100 : 0}%` }}
                transition={{ type: "spring", stiffness: 160, damping: 24 }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={marked === 0 || !batchRunsToday}
              title={!batchRunsToday ? `${batch?.name} doesn't run on ${todayShort}s` : undefined}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e9bd55] to-[#b8860b] py-3.5 text-sm font-bold tracking-[0.15em] text-[#060913] shadow-[0_0_28px_rgba(217,164,65,0.4)] transition hover:shadow-[0_0_40px_rgba(217,164,65,0.55)] disabled:opacity-40 disabled:shadow-none"
            >
              {saving ? (
                <>
                  <Save className="h-4 w-4 animate-pulse" /> SAVING…
                </>
              ) : saved ? (
                <>
                  <PartyPopper className="h-4 w-4" /> SAVED TO LEDGER
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> SAVE ATTENDANCE
                </>
              )}
            </button>
            <AnimatePresence>
              {saved && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 text-center text-xs font-semibold tracking-wide text-emerald-300"
                >
                  {batch.name} · {present} present recorded for {formatDate(todayISO)}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Warning when batch doesn't run today */}
            <AnimatePresence>
              {!batchRunsToday && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 flex items-center gap-2 rounded-lg border border-amber-400/25 bg-amber-400/10 px-3 py-2.5"
                >
                  <CalendarX className="h-4 w-4 shrink-0 text-amber-300" />
                  <p className="text-[11px] tracking-wide text-amber-200">
                    <span className="font-bold">{batch?.name}</span> doesn&apos;t run on {todayShort}s — you can still pre-mark but saving is locked.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="glass-panel p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">How it works</p>
            <ul className="mt-3 space-y-2.5 text-xs leading-relaxed tracking-wide text-stone-400">
              <li className="flex gap-2"><Check className="h-3.5 w-3.5 shrink-0 text-emerald-300" /> Tap once — present</li>
              <li className="flex gap-2"><X className="h-3.5 w-3.5 shrink-0 text-rose-300" /> Tap twice — absent</li>
              <li className="flex gap-2"><Minus className="h-3.5 w-3.5 shrink-0 text-stone-500" /> Tap thrice — clear mark</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
