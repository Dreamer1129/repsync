"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, BadgeCheck, Hourglass, AlertTriangle } from "lucide-react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatCard } from "@/components/ui/StatCard";
import { PaymentDrawer } from "@/components/drawers/PaymentDrawer";
import { LoadingBlock } from "@/components/ui/LoadingBlock";
import { usePayments, useDashboardStats } from "@/lib/hooks";
import type { PaymentDTO } from "@/lib/actions";
import { formatDate, pkr, pkrShort } from "@/lib/format";
import { cn } from "@/lib/cn";
import { fadeUp } from "@/lib/motion";

type PaymentStatus = "paid" | "due" | "overdue";

const filters: { key: PaymentStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "paid", label: "Paid" },
  { key: "due", label: "Due" },
  { key: "overdue", label: "Overdue" },
];

const columns: Column<PaymentDTO>[] = [
  {
    key: "memberName",
    header: "Member",
    sortable: true,
    sortValue: (p) => p.memberName,
    render: (p) => (
      <div>
        <p className="font-semibold tracking-wide text-stone-100">{p.memberName}</p>
        <p className="text-xs tracking-wide text-stone-500">{p.planName}</p>
      </div>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    sortable: true,
    sortValue: (p) => p.amount,
    render: (p) => <span className="font-display text-lg font-semibold tracking-wide text-[#f5d47e]">{pkr(p.amount)}</span>,
  },
  { key: "method", header: "Method", sortable: true, sortValue: (p) => p.method },
  {
    key: "date",
    header: "Date",
    sortable: true,
    sortValue: (p) => p.date,
    render: (p) => <span className="tracking-wide">{formatDate(p.date)}</span>,
  },
  {
    key: "status",
    header: "Status",
    render: (p) => <StatusBadge status={p.status} />,
  },
];

export default function PaymentsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState<PaymentStatus | "all">("all");
  const { data: paymentsData, refresh } = usePayments(filter === "all" ? undefined : filter);
  const { data: dashboardStats } = useDashboardStats();
  const rows = paymentsData ?? [];

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#d9a441]">Ledger</p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-wide text-[#f4f1ea]">
            Every rupee, <span className="text-gold-grad italic">accounted.</span>
          </h2>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e9bd55] to-[#b8860b] px-6 py-3 text-sm font-bold tracking-[0.12em] text-[#060913] shadow-[0_0_28px_rgba(217,164,65,0.4)] transition hover:shadow-[0_0_40px_rgba(217,164,65,0.55)]"
        >
          <Plus className="h-4 w-4" /> RECORD PAYMENT
        </button>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-3">
        {!dashboardStats ? (
          <div className="sm:col-span-3"><LoadingBlock lines={2} /></div>
        ) : (
          <>
            <StatCard label="Collected" value={pkrShort(dashboardStats.collectedThisMonth)} delta={12.4} icon={BadgeCheck} delay={0.1} />
            <StatCard label="Pending" value={pkrShort(dashboardStats.pendingFees)} delta={-6.2} icon={Hourglass} delay={0.2} />
            <StatCard label="Overdue" value={pkrShort(dashboardStats.overdueFees)} delta={-18.9} icon={AlertTriangle} delay={0.3} />
          </>
        )}
      </div>

      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-bold tracking-[0.12em] transition",
              filter === f.key
                ? "border-[#d9a441]/60 bg-[#d9a441]/15 text-[#f5d47e]"
                : "border-white/10 bg-white/5 text-stone-400 hover:border-white/25 hover:text-stone-200"
            )}
          >
            {f.label.toUpperCase()}
          </button>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}>
        <DataTable columns={columns} rows={rows} rowKey={(p) => p.id} />
      </motion.div>

      <PaymentDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onRecorded={refresh} />
    </div>
  );
}
