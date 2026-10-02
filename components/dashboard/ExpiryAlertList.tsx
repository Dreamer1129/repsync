"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Radar, BellRing, Check } from "lucide-react";
import { sendReminder } from "@/lib/actions";
import { useMembers, usePayments } from "@/lib/hooks";
import { daysUntil, formatDate, initials, pkr } from "@/lib/format";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LoadingBlock } from "@/components/ui/LoadingBlock";

export function ExpiryAlertList() {
  const [reminded, setReminded] = useState<string[]>([]);
  const { data: members } = useMembers();
  const { data: payments } = usePayments();
  if (!members || !payments) return <LoadingBlock lines={5} />;

  const atRisk = members.filter((m) => m.status !== "active");
  const overdue = payments.filter((p) => p.status === "overdue");

  async function remind(id: string, memberId?: string) {
    if (reminded.includes(id)) return;
    if (memberId) await sendReminder(memberId);
    setReminded((r) => [...r, id]);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel flex flex-col p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-400/30 bg-rose-400/10">
            <Radar className="h-5 w-5 text-rose-300" strokeWidth={1.75} />
          </span>
          <div>
            <h3 className="font-display text-2xl font-semibold tracking-wide text-[#f4f1ea]">Expiry radar</h3>
            <p className="text-xs tracking-[0.18em] text-stone-500">NEEDS ATTENTION</p>
          </div>
        </div>
        <span className="rounded-full border border-rose-400/25 bg-rose-400/10 px-3 py-1 text-xs font-bold text-rose-300">
          {atRisk.length + overdue.length}
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {atRisk.map((m, i) => {
          const d = daysUntil(m.expiryDate);
          const done = reminded.includes(m.id);
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * i, duration: 0.45 }}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3.5"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-[#060913]"
                style={{ background: `linear-gradient(135deg, hsl(${m.hue} 70% 65%), hsl(${m.hue} 70% 45%))` }}
              >
                {initials(m.name)}
              </span>
              <div className="min-w-0 flex-1">
                <Link href={`/dashboard/members/${m.id}`} className="truncate text-sm font-semibold tracking-wide text-stone-100 hover:text-[#f5d47e]">
                  {m.name}
                </Link>
                <p className="text-xs tracking-wide text-stone-500">
                  {m.planName} · {d >= 0 ? `expires in ${d}d (${formatDate(m.expiryDate)})` : `expired ${formatDate(m.expiryDate)}`}
                </p>
              </div>
              <StatusBadge status={m.status} />
              <button
                onClick={() => remind(m.id, m.id)}
                className={
                  done
                    ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                    : "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-stone-400 transition hover:border-[#d9a441]/50 hover:text-[#f5d47e]"
                }
                aria-label={done ? "Reminder sent" : "Send reminder"}
                title={done ? "Reminder sent" : "Send renewal reminder"}
              >
                {done ? <Check className="h-4 w-4" /> : <BellRing className="h-4 w-4" />}
              </button>
            </motion.div>
          );
        })}
        {overdue.map((p, i) => {
          const done = reminded.includes(p.id);
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * (atRisk.length + i), duration: 0.45 }}
              className="flex items-center gap-3 rounded-xl border border-rose-400/15 bg-rose-400/[0.04] p-3.5"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold tracking-wide text-stone-100">{p.memberName}</p>
                <p className="text-xs tracking-wide text-stone-500">
                  Overdue fee · {pkr(p.amount)} · {p.planName}
                </p>
              </div>
              <StatusBadge status={p.status} />
              <button
                onClick={() => remind(p.id, p.memberId)}
                className={
                  done
                    ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                    : "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-stone-400 transition hover:border-[#d9a441]/50 hover:text-[#f5d47e]"
                }
                aria-label={done ? "Reminder sent" : "Send reminder"}
                title={done ? "Reminder sent" : "Send payment reminder"}
              >
                {done ? <Check className="h-4 w-4" /> : <BellRing className="h-4 w-4" />}
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
