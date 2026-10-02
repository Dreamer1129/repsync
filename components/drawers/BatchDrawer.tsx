"use client";

import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { createBatch } from "@/lib/actions";
import { useTrainers } from "@/lib/hooks";
import { cn } from "@/lib/cn";

interface BatchDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const INTENSITIES = ["Low", "Medium", "High"];

export function BatchDrawer({ open, onClose, onCreated }: BatchDrawerProps) {
  const { data: trainersData } = useTrainers();
  const trainers = trainersData ?? [];
  const [name, setName] = useState("");
  const [trainerId, setTrainerId] = useState("");
  const effectiveTrainerId = trainerId || trainers[0]?.id || "";
  const [days, setDays] = useState<string[]>(["Mon", "Wed", "Fri"]);
  const [time, setTime] = useState("06:00 AM");
  const [intensity, setIntensity] = useState("Medium");
  const [capacity, setCapacity] = useState("20");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function toggleDay(d: string) {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await createBatch({
      name,
      trainerId: effectiveTrainerId,
      days,
      time,
      intensity,
      capacity: parseInt(capacity || "0", 10) || 20,
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Could not create batch.");
      return;
    }
    setSaved(true);
    onCreated?.();
    setTimeout(() => {
      onClose();
      setSaved(false);
      setName("");
    }, 900);
  }

  return (
    <Drawer open={open} onClose={onClose} title="Create batch" sub="A new class takes the stage">
      <form onSubmit={submit} className="space-y-5">
        <div className="flex items-center gap-3 rounded-xl border border-[#d9a441]/25 bg-[#d9a441]/10 p-4">
          <CalendarPlus className="h-5 w-5 text-[#f5d47e]" />
          <p className="text-xs leading-relaxed tracking-wide text-stone-300">
            Pick the coach, the days and the hour — the batch appears on the schedule grid instantly.
          </p>
        </div>
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">
            Batch name
          </label>
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Iron Dawn" className="input-glass" />
        </div>
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">Trainer</label>
          <select value={effectiveTrainerId} onChange={(e) => setTrainerId(e.target.value)} className="input-glass">
            {trainers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — {t.specialty}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">
            Training days
          </label>
          <div className="flex flex-wrap gap-2">
            {WEEK.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggleDay(d)}
                className={cn(
                  "rounded-lg border px-3.5 py-2 text-xs font-bold tracking-wide transition",
                  days.includes(d)
                    ? "border-[#d9a441]/60 bg-[#d9a441]/15 text-[#f5d47e]"
                    : "border-white/10 bg-white/5 text-stone-400 hover:border-white/25 hover:text-stone-200"
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">
            Intensity
          </label>
          <div className="grid grid-cols-3 gap-2">
            {INTENSITIES.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setIntensity(level)}
                className={cn(
                  "rounded-lg border px-3.5 py-2 text-xs font-bold tracking-wide transition",
                  intensity === level
                    ? "border-[#d9a441]/60 bg-[#d9a441]/15 text-[#f5d47e]"
                    : "border-white/10 bg-white/5 text-stone-400 hover:border-white/25 hover:text-stone-200"
                )}
              >
                {level.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">Time</label>
            <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="06:00 AM" className="input-glass" />
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">
              Capacity
            </label>
            <input
              inputMode="numeric"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value.replace(/[^0-9]/g, ""))}
              className="input-glass"
            />
          </div>
        </div>
        {error && (
          <p className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-xs font-semibold tracking-wide text-rose-300">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy || !effectiveTrainerId}
          className="w-full rounded-xl bg-gradient-to-r from-[#e9bd55] to-[#b8860b] py-3.5 text-sm font-bold tracking-[0.15em] text-[#060913] shadow-[0_0_28px_rgba(217,164,65,0.4)] transition hover:shadow-[0_0_40px_rgba(217,164,65,0.55)] disabled:opacity-60"
        >
          {saved ? "BATCH STAGED ✓" : busy ? "STAGING…" : "CREATE BATCH"}
        </button>
      </form>
    </Drawer>
  );
}
