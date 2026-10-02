export function pkr(n: number): string {
  return "PKR " + n.toLocaleString("en-PK");
}

export function pkrShort(n: number): string {
  if (n >= 100000) return `PKR ${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `PKR ${(n / 1000).toFixed(0)}K`;
  return pkr(n);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(iso: string): string {
  // Accepts "2026-10-02" or a full ISO string like "2026-10-02T00:00:00.000Z".
  // Always interpreted as UTC so the calendar day never shifts with local TZ.
  const d = new Date(iso.includes("T") ? iso : iso + "T00:00:00Z");
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function daysUntil(iso: string): number {
  const now = new Date();
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const target = new Date(iso.includes("T") ? iso : iso + "T00:00:00Z");
  const startOfTarget = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), target.getUTCDate()));
  return Math.round((startOfTarget.getTime() - startOfToday.getTime()) / 86400000);
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
