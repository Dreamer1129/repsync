"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { createPayment } from "@/lib/actions";
import { useMembers } from "@/lib/hooks";

interface PaymentDrawerProps {
  open: boolean;
  onClose: () => void;
  onRecorded?: () => void;
}

type PaymentMethod = "Cash" | "Card" | "Bank Transfer";
type FeeStatus = "paid" | "due" | "overdue";

const methods: PaymentMethod[] = ["Cash", "Card", "Bank Transfer"];
const statuses: { key: FeeStatus; label: string }[] = [
  { key: "paid", label: "Paid" },
  { key: "due", label: "Due" },
  { key: "overdue", label: "Overdue" },
];

export function PaymentDrawer({ open, onClose, onRecorded }: PaymentDrawerProps) {
  const { data: membersData } = useMembers();
  const members = membersData ?? [];
  const [memberId, setMemberId] = useState("");
  const effectiveMemberId = memberId || members[0]?.id || "";
  const [amount, setAmount] = useState("9000");
  const [method, setMethod] = useState<PaymentMethod>("Cash");
  const [status, setStatus] = useState<FeeStatus>("paid");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await createPayment({ memberId: effectiveMemberId, amount: parseInt(amount || "0", 10), method, status });
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Could not record payment.");
      return;
    }
    setSaved(true);
    onRecorded?.();
    setTimeout(() => {
      onClose();
      setSaved(false);
    }, 900);
  }

  return (
    <Drawer open={open} onClose={onClose} title="Record payment" sub="Fee collection, sealed in gold">
      <form onSubmit={submit} className="space-y-5">
        <div className="flex items-center gap-3 rounded-xl border border-[#d9a441]/25 bg-[#d9a441]/10 p-4">
          <Wallet className="h-5 w-5 text-[#f5d47e]" />
          <p className="text-xs leading-relaxed tracking-wide text-stone-300">
            The payment lands in the ledger instantly and nudges the revenue pulse upward.
          </p>
        </div>
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">Member</label>
          <select value={effectiveMemberId} onChange={(e) => setMemberId(e.target.value)} className="input-glass">
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — {m.planName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">
            Amount (PKR)
          </label>
          <input
            required
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="9000"
            className="input-glass font-display text-2xl tracking-wide"
          />
        </div>
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">
            Payment method
          </label>
          <div className="grid grid-cols-3 gap-2">
            {methods.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={
                  method === m
                    ? "rounded-xl border border-[#d9a441]/60 bg-[#d9a441]/15 px-3 py-2.5 text-xs font-bold tracking-wide text-[#f5d47e]"
                    : "rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-medium tracking-wide text-stone-400 transition hover:border-white/25 hover:text-stone-200"
                }
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">
            Fee status
          </label>
          <div className="grid grid-cols-3 gap-2">
            {statuses.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setStatus(s.key)}
                className={
                  status === s.key
                    ? "rounded-xl border border-[#d9a441]/60 bg-[#d9a441]/15 px-3 py-2.5 text-xs font-bold tracking-wide text-[#f5d47e]"
                    : "rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-medium tracking-wide text-stone-400 transition hover:border-white/25 hover:text-stone-200"
                }
              >
                {s.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        {error && (
          <p className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-xs font-semibold tracking-wide text-rose-300">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy || !effectiveMemberId}
          className="w-full rounded-xl bg-gradient-to-r from-[#e9bd55] to-[#b8860b] py-3.5 text-sm font-bold tracking-[0.15em] text-[#060913] shadow-[0_0_28px_rgba(217,164,65,0.4)] transition hover:shadow-[0_0_40px_rgba(217,164,65,0.55)] disabled:opacity-60"
        >
          {saved ? "PAYMENT SEALED ✓" : busy ? "SEALING…" : "RECORD PAYMENT"}
        </button>
      </form>
    </Drawer>
  );
}
