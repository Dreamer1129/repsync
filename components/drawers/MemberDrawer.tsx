"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { createMember } from "@/lib/actions";
import { usePlans } from "@/lib/hooks";

interface MemberDrawerProps {
  open: boolean;
  onClose: () => void;
  onEnrolled?: () => void;
}

export function MemberDrawer({ open, onClose, onEnrolled }: MemberDrawerProps) {
  const { data: plansData } = usePlans();
  const plans = plansData ?? [];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [planId, setPlanId] = useState("pro");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await createMember({ name, email, phone, planId });
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Could not enroll member.");
      return;
    }
    setSaved(true);
    onEnrolled?.();
    setTimeout(() => {
      onClose();
      setSaved(false);
      setName("");
      setEmail("");
      setPhone("");
      setPlanId("pro");
    }, 900);
  }

  return (
    <Drawer open={open} onClose={onClose} title="Enroll member" sub="A new athlete joins the arena">
      <form onSubmit={submit} className="space-y-5">
        <div className="flex items-center gap-3 rounded-xl border border-[#d9a441]/25 bg-[#d9a441]/10 p-4">
          <UserPlus className="h-5 w-5 text-[#f5d47e]" />
          <p className="text-xs leading-relaxed tracking-wide text-stone-300">
            Membership starts today. The expiry radar will track this member automatically.
          </p>
        </div>
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">
            Full name
          </label>
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ahmed Raza" className="input-glass" />
        </div>
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@gmail.com" className="input-glass" />
        </div>
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">Phone</label>
          <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0300-0000000" className="input-glass" />
        </div>
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">
            Membership plan
          </label>
          <select value={planId} onChange={(e) => setPlanId(e.target.value)} className="input-glass">
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — PKR {p.price.toLocaleString("en-PK")} / {p.durationMonths} mo
              </option>
            ))}
          </select>
        </div>
        {error && (
          <p className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-xs font-semibold tracking-wide text-rose-300">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-gradient-to-r from-[#e9bd55] to-[#b8860b] py-3.5 text-sm font-bold tracking-[0.15em] text-[#060913] shadow-[0_0_28px_rgba(217,164,65,0.4)] transition hover:shadow-[0_0_40px_rgba(217,164,65,0.55)] disabled:opacity-60"
        >
          {saved ? "MEMBER SYNCED ✓" : busy ? "SYNCING…" : "ENROLL MEMBER"}
        </button>
      </form>
    </Drawer>
  );
}
