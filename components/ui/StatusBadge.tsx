"use client";

import { cn } from "@/lib/cn";

const styles: Record<string, string> = {
  active: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  expiring: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  expired: "border-rose-400/25 bg-rose-400/10 text-rose-300",
  paid: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  due: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  overdue: "border-rose-400/25 bg-rose-400/10 text-rose-300",
  "on-leave": "border-stone-400/25 bg-stone-400/10 text-stone-300",
  High: "border-rose-400/25 bg-rose-400/10 text-rose-300",
  Medium: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  Low: "border-sky-400/25 bg-sky-400/10 text-sky-300",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize tracking-wide",
        styles[status] ?? "border-white/15 bg-white/5 text-stone-300",
        className
      )}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {status.replace("-", " ")}
    </span>
  );
}
