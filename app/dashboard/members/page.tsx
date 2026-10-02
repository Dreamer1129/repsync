"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Search, Trash2 } from "lucide-react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MemberDrawer } from "@/components/drawers/MemberDrawer";
import { LoadingBlock } from "@/components/ui/LoadingBlock";
import { useMembers } from "@/lib/hooks";
import { deleteMember } from "@/lib/actions";
import type { MemberDTO, MemberStatus } from "@/lib/actions";
import { formatDate, initials } from "@/lib/format";
import { cn } from "@/lib/cn";
import { fadeUp } from "@/lib/motion";

const filters: { key: MemberStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "expiring", label: "Expiring" },
  { key: "expired", label: "Expired" },
];

const columns: Column<MemberDTO>[] = [
  {
    key: "name",
    header: "Member",
    sortable: true,
    sortValue: (m) => m.name,
    render: (m) => (
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-[#060913]"
          style={{ background: `linear-gradient(135deg, hsl(${m.hue} 70% 65%), hsl(${m.hue} 70% 45%))` }}
        >
          {initials(m.name)}
        </span>
        <div>
          <p className="font-semibold tracking-wide text-stone-100">{m.name}</p>
          <p className="text-xs tracking-wide text-stone-500">{m.email}</p>
        </div>
      </div>
    ),
  },
  { key: "planName", header: "Plan", sortable: true, sortValue: (m) => m.planName },
  {
    key: "status",
    header: "Status",
    render: (m) => <StatusBadge status={m.status} />,
  },
  {
    key: "expiryDate",
    header: "Expires",
    sortable: true,
    sortValue: (m) => m.expiryDate,
    render: (m) => <span className="tracking-wide">{formatDate(m.expiryDate)}</span>,
  },
  {
    key: "attendanceRate",
    header: "Attendance",
    sortable: true,
    sortValue: (m) => m.attendanceRate,
    render: (m) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#e9bd55] to-[#f5d47e]"
            style={{ width: `${m.attendanceRate}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-stone-300">{m.attendanceRate}%</span>
      </div>
    ),
  },
];

export default function MembersPage() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<MemberStatus | "all">("all");
  const { data, refresh } = useMembers();

  const tableColumns = useMemo<Column<MemberDTO>[]>(
    () => [
      ...columns,
      {
        key: "actions",
        header: "",
        className: "w-20",
        render: (m) => <DeleteMemberButton id={m.id} name={m.name} onDeleted={refresh} />,
      },
    ],
    [refresh]
  );

  const rows = useMemo(() => {
    const members = data ?? [];
    return members.filter(
      (m) =>
        (filter === "all" || m.status === filter) &&
        (m.name.toLowerCase().includes(query.toLowerCase()) || m.email.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, filter, data]);

  if (!data) {
    return (
      <div className="space-y-5">
        <div className="py-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#d9a441]">Registry</p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-wide text-[#f4f1ea]">Loading athletes…</h2>
        </div>
        <LoadingBlock lines={8} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#d9a441]">Registry</p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-wide text-[#f4f1ea]">
            {rows.length} athletes <span className="text-gold-grad italic">strong.</span>
          </h2>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e9bd55] to-[#b8860b] px-6 py-3 text-sm font-bold tracking-[0.12em] text-[#060913] shadow-[0_0_28px_rgba(217,164,65,0.4)] transition hover:shadow-[0_0_40px_rgba(217,164,65,0.55)]"
        >
          <Plus className="h-4 w-4" /> ENROLL MEMBER
        </button>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-64 flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email…"
            className="input-glass !pl-10"
            aria-label="Search members"
          />
        </div>
        <div className="flex gap-2">
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
        </div>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}>
        <DataTable
          columns={tableColumns}
          rows={rows}
          rowKey={(m) => m.id}
          onRowClick={(m) => router.push(`/dashboard/members/${m.id}`)}
        />
      </motion.div>

      <MemberDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onEnrolled={refresh} />
    </div>
  );
}

function DeleteMemberButton({ id, name, onDeleted }: { id: string; name: string; onDeleted: () => void }) {
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(t);
  }, [armed]);

  async function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (busy) return;
    if (!armed) {
      setArmed(true);
      return;
    }
    setBusy(true);
    setError(null);
    const res = await deleteMember(id);
    setBusy(false);
    setArmed(false);
    if (!res.ok) {
      setError(res.error ?? "Could not remove member.");
      return;
    }
    onDeleted();
  }

  return (
    <span className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
      {error ? (
        <span className="text-[11px] font-semibold tracking-wide text-rose-400">{error}</span>
      ) : armed ? (
        <button
          onClick={handleClick}
          disabled={busy}
          title={`Confirm: permanently remove ${name} (payments & attendance go too)`}
          className="rounded-lg border border-rose-400/50 bg-rose-400/15 px-3 py-1.5 text-[11px] font-bold tracking-[0.12em] text-rose-300 transition hover:bg-rose-400/25 disabled:opacity-60"
        >
          {busy ? "REMOVING…" : "CONFIRM"}
        </button>
      ) : (
        <button
          onClick={handleClick}
          title={`Remove ${name}`}
          aria-label={`Remove ${name}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-stone-500 transition hover:border-rose-400/50 hover:text-rose-300"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </span>
  );
}
