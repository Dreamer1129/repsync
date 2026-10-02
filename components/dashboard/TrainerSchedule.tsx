"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { useBatches } from "@/lib/hooks";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = ["06:00 AM", "07:30 AM", "05:00 PM", "06:00 PM", "07:00 PM"];

function slotKey(time: string): string {
  const t = time.toLowerCase();
  if (t.startsWith("06:00") && t.includes("am")) return "06:00 AM";
  if (t.startsWith("07:30")) return "07:30 AM";
  if (t.startsWith("05:00")) return "05:00 PM";
  if (t.startsWith("06:00") && t.includes("pm")) return "06:00 PM";
  if (t.startsWith("07:00")) return "07:00 PM";
  return time;
}

export function TrainerSchedule() {
  const { data } = useBatches();
  const batches = data ?? [];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel p-6"
    >
      <h3 className="font-display text-2xl font-semibold tracking-wide text-[#f4f1ea]">Weekly stage plan</h3>
      <p className="mt-1 text-xs tracking-[0.18em] text-stone-500">BATCH GRID · MON–SUN</p>
      <div className="mt-5 overflow-x-auto">
        <div className="grid min-w-[760px] grid-cols-[90px_repeat(7,1fr)] gap-1.5">
          <span />
          {DAYS.map((d) => (
            <span key={d} className="py-1 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
              {d}
            </span>
          ))}
          {SLOTS.map((slot) => (
            <Fragment key={slot}>
              <span key={slot} className="flex items-center pr-2 text-[11px] font-semibold tracking-wide text-stone-500">
                {slot}
              </span>
              {DAYS.map((day) => {
                const b = batches.find((x) => x.days.includes(day) && slotKey(x.time) === slot);
                return (
                  <div
                    key={`${slot}-${day}`}
                    className="flex min-h-[52px] items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] p-1.5"
                  >
                    {b ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35 }}
                        whileHover={{ scale: 1.06 }}
                        className="w-full rounded-md border px-2 py-1.5 text-center"
                        style={{
                          borderColor: `hsl(${b.hue} 75% 55% / 0.4)`,
                          background: `hsl(${b.hue} 75% 50% / 0.12)`,
                        }}
                      >
                        <p className="truncate text-[11px] font-bold tracking-wide text-stone-100">{b.name}</p>
                        <p className="truncate text-[10px] tracking-wide text-stone-400">{b.trainerName}</p>
                      </motion.div>
                    ) : (
                      <span className="text-stone-700">·</span>
                    )}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
