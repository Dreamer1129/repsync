"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Mail, CalendarDays, Wallet, Flame } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, Cell } from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingBlock } from "@/components/ui/LoadingBlock";
import { useMember } from "@/lib/hooks";
import { daysUntil, formatDate, initials, pkr } from "@/lib/format";
import { fadeUp } from "@/lib/motion";

export default function MemberProfilePage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const { data: member, loading } = useMember(id);

  if (loading) {
    return (
      <div className="space-y-5">
        <LoadingBlock lines={10} />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="space-y-5">
        <Link
          href="/dashboard/members"
          className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-stone-400 transition hover:text-[#f5d47e]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to registry
        </Link>
        <EmptyState icon={CalendarDays} title="Member not found" hint="This athlete doesn't exist in the registry." />
      </div>
    );
  }

  const history = member.payments;
  const bars = member.weeklyBars.map((v, i) => ({ week: `W${i + 1}`, sessions: v }));
  const d = daysUntil(member.expiryDate);

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <Link
          href="/dashboard/members"
          className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-stone-400 transition hover:text-[#f5d47e]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to registry
        </Link>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="glass-panel p-7 md:p-9">
        <div className="flex flex-wrap items-center gap-6">
          <motion.span
            whileHover={{ scale: 1.05, rotate: 3 }}
            className="flex h-24 w-24 items-center justify-center rounded-3xl font-display text-3xl font-bold text-[#060913] shadow-2xl"
            style={{ background: `linear-gradient(135deg, hsl(${member.hue} 75% 68%), hsl(${member.hue} 75% 45%))` }}
          >
            {initials(member.name)}
          </motion.span>
          <div className="min-w-60 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-4xl font-semibold tracking-wide text-[#f4f1ea]">{member.name}</h2>
              <StatusBadge status={member.status} />
            </div>
            <p className="mt-2 text-sm tracking-wide text-stone-400">
              {member.planName} plan · member since {formatDate(member.joinDate)}
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs tracking-wide text-stone-500">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-[#d9a441]" /> {member.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-[#d9a441]" /> {member.phone}
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-500">Membership</p>
            <p className={`mt-1 font-display text-2xl font-semibold tracking-wide ${d < 0 ? "text-rose-300" : d <= 7 ? "text-amber-300" : "text-emerald-300"}`}>
              {d < 0 ? "Expired" : d === 0 ? "Expires today" : `${d} days left`}
            </p>
            <p className="mt-1 text-xs tracking-wide text-stone-500">{formatDate(member.expiryDate)}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-3">
        <GlassCard delay={0.1}>
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 text-[#f5d47e]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">Lifetime value</p>
          </div>
          <p className="mt-3 font-display text-4xl font-semibold tracking-wide text-[#f4f1ea]">{pkr(member.totalPaid)}</p>
        </GlassCard>
        <GlassCard delay={0.2}>
          <div className="flex items-center gap-3">
            <Flame className="h-5 w-5 text-[#f5d47e]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">Attendance rate</p>
          </div>
          <p className="mt-3 font-display text-4xl font-semibold tracking-wide text-[#f4f1ea]">{member.attendanceRate}%</p>
        </GlassCard>
        <GlassCard delay={0.3}>
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-[#f5d47e]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">Last check-in</p>
          </div>
          <p className="mt-3 font-display text-2xl font-semibold tracking-wide text-[#f4f1ea]">{member.lastCheckin}</p>
        </GlassCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <GlassCard delay={0.1} className="flex flex-col">
          <h3 className="font-display text-2xl font-semibold tracking-wide text-[#f4f1ea]">Weekly sessions</h3>
          <p className="mt-1 text-xs tracking-[0.18em] text-stone-500">LAST 12 WEEKS</p>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bars} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                <Bar dataKey="sessions" radius={[6, 6, 6, 6]}>
                  {bars.map((b, i) => (
                    <Cell key={i} fill={b.sessions >= 5 ? "#f5d47e" : b.sessions >= 3 ? "#a78bfa" : "#4338ca"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard delay={0.2} className="flex flex-col">
          <h3 className="font-display text-2xl font-semibold tracking-wide text-[#f4f1ea]">Payment history</h3>
          <p className="mt-1 text-xs tracking-[0.18em] text-stone-500">FEE LEDGER</p>
          <div className="mt-4 flex-1 space-y-3">
            {history.length === 0 && (
              <p className="py-8 text-center text-sm tracking-wide text-stone-500">No payments recorded yet.</p>
            )}
            {history.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3.5">
                <div>
                  <p className="text-sm font-semibold tracking-wide text-stone-100">{pkr(p.amount)}</p>
                  <p className="text-xs tracking-wide text-stone-500">
                    {formatDate(p.date)} · {p.method}
                  </p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
