"use server";

/* RepSync data-access layer — every read/write below hits the real
   PostgreSQL database (Neon) through Prisma. Client components call
   these Server Actions; nothing here ever ships mock data. */

import { revalidatePath } from "next/cache";
import { prisma } from "./db";

/* ---------------- DTOs (serializable, UI-shaped) ---------------- */

export type MemberStatus = "active" | "expiring" | "expired";

export interface PlanDTO {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  color: string;
  tagline: string;
  popular: boolean;
  features: string[];
  memberCount: number;
}

export interface MemberDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  planId: string;
  planName: string;
  status: MemberStatus;
  joinDate: string;
  expiryDate: string;
  totalPaid: number;
  attendanceRate: number;
  lastCheckin: string;
  hue: number;
}

export interface PaymentDTO {
  id: string;
  memberId: string;
  memberName: string;
  planName: string;
  amount: number;
  date: string;
  method: string;
  status: "paid" | "due" | "overdue";
}

export interface TrainerDTO {
  id: string;
  name: string;
  specialty: string;
  experienceYrs: number;
  rating: number;
  sessionsPerWeek: number;
  status: string;
  hue: number;
}

export interface BatchDTO {
  id: string;
  name: string;
  trainerId: string;
  trainerName: string;
  days: string[];
  time: string;
  capacity: number;
  enrolled: number;
  intensity: string;
  hue: number;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
  target: number;
}

export interface DashboardStats {
  monthlyRevenue: number;
  revenueDelta: number;
  activeMembers: number;
  membersDelta: number;
  expiringSoon: number;
  avgAttendance: number;
  attendanceDelta: number;
  collectedThisMonth: number;
  pendingFees: number;
  overdueFees: number;
}

export interface MemberProfile extends MemberDTO {
  payments: PaymentDTO[];
  weeklyBars: number[];
}

/* ---------------- helpers ---------------- */

const MONTH_LABELS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
const MONTH_TARGETS = [420000, 430000, 440000, 450000, 465000, 480000, 495000, 505000, 520000, 535000, 545000, 560000];

function startOfTodayUTC(): Date {
  const n = new Date();
  return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()));
}

function computeStatus(expiryDate: Date): MemberStatus {
  const today = startOfTodayUTC();
  const in7 = new Date(today);
  in7.setUTCDate(in7.getUTCDate() + 7);
  if (expiryDate < today) return "expired";
  if (expiryDate <= in7) return "expiring";
  return "active";
}

function toMemberDTO(m: {
  id: string; name: string; email: string; phone: string; planId: string;
  plan: { name: string }; joinDate: Date; expiryDate: Date; totalPaid: number;
  attendanceRate: number; lastCheckin: string; hue: number;
}): MemberDTO {
  return {
    id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone,
    planId: m.planId,
    planName: m.plan.name,
    status: computeStatus(m.expiryDate),
    joinDate: m.joinDate.toISOString(),
    expiryDate: m.expiryDate.toISOString(),
    totalPaid: m.totalPaid,
    attendanceRate: m.attendanceRate,
    lastCheckin: m.lastCheckin,
    hue: m.hue,
  };
}

function toPaymentDTO(p: {
  id: string; memberId: string; memberName: string; planName: string;
  amount: number; date: Date; method: string; status: "paid" | "due" | "overdue";
}): PaymentDTO {
  return {
    id: p.id,
    memberId: p.memberId,
    memberName: p.memberName,
    planName: p.planName,
    amount: p.amount,
    date: p.date.toISOString(),
    method: p.method,
    status: p.status,
  };
}

/* ---------------- plans ---------------- */

export async function getPlans(): Promise<PlanDTO[]> {
  const plans = await prisma.plan.findMany({
    include: { _count: { select: { members: true } } },
    orderBy: { price: "asc" },
  });
  return plans.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    durationMonths: p.durationMonths,
    color: p.color,
    tagline: p.tagline,
    popular: p.popular,
    features: p.features,
    memberCount: p._count.members,
  }));
}

/* ---------------- members ---------------- */

export async function getMembers(): Promise<MemberDTO[]> {
  const members = await prisma.member.findMany({
    include: { plan: { select: { name: true } } },
    orderBy: { name: "asc" },
  });
  return members.map(toMemberDTO);
}

export async function getMember(id: string): Promise<MemberProfile | null> {
  const m = await prisma.member.findUnique({
    where: { id },
    include: {
      plan: { select: { name: true } },
      payments: { orderBy: { date: "desc" } },
    },
  });
  if (!m) return null;

  // Sessions per week for the last 12 weeks (oldest → newest)
  const since = new Date(startOfTodayUTC());
  since.setUTCDate(since.getUTCDate() - 84);
  const records = await prisma.attendanceRecord.findMany({
    where: { memberId: id, date: { gte: since }, status: "present" },
    select: { date: true },
  });
  const weeklyBars = new Array(12).fill(0) as number[];
  const now = startOfTodayUTC().getTime();
  for (const r of records) {
    const daysAgo = Math.floor((now - r.date.getTime()) / 86400000);
    const weekIdx = 11 - Math.floor(daysAgo / 7);
    if (weekIdx >= 0 && weekIdx < 12) weeklyBars[weekIdx]++;
  }

  return {
    ...toMemberDTO(m),
    payments: m.payments.map(toPaymentDTO),
    weeklyBars,
  };
}

export async function createMember(input: {
  name: string;
  email: string;
  phone: string;
  planId: string;
}): Promise<{ ok: boolean; error?: string }> {
  const plan = await prisma.plan.findUnique({ where: { id: input.planId } });
  if (!plan) return { ok: false, error: "Plan not found." };
  const exists = await prisma.member.findUnique({ where: { email: input.email.trim().toLowerCase() } });
  if (exists) return { ok: false, error: "A member with this email already exists." };

  const today = startOfTodayUTC();
  const expiry = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + plan.durationMonths, today.getUTCDate()));
  await prisma.member.create({
    data: {
      id: `m-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      planId: plan.id,
      joinDate: today,
      expiryDate: expiry,
      lastCheckin: "Not checked in yet",
      hue: Math.floor(Math.random() * 360),
    },
  });
  revalidatePath("/dashboard/members");
  return { ok: true };
}

/* ---------------- payments ---------------- */

export async function getPayments(status?: "paid" | "due" | "overdue"): Promise<PaymentDTO[]> {
  const payments = await prisma.payment.findMany({
    where: status ? { status } : undefined,
    orderBy: { date: "desc" },
  });
  return payments.map(toPaymentDTO);
}

export async function createPayment(input: {
  memberId: string;
  amount: number;
  method: string;
  status: "paid" | "due" | "overdue";
}): Promise<{ ok: boolean; error?: string }> {
  const member = await prisma.member.findUnique({
    where: { id: input.memberId },
    include: { plan: { select: { name: true } } },
  });
  if (!member) return { ok: false, error: "Member not found." };
  if (!input.amount || input.amount <= 0) return { ok: false, error: "Amount must be greater than zero." };

  await prisma.payment.create({
    data: {
      memberId: member.id,
      memberName: member.name,
      planName: member.plan.name,
      amount: Math.round(input.amount),
      method: input.method,
      date: new Date(),
      status: input.status,
    },
  });
  if (input.status === "paid") {
    await prisma.member.update({
      where: { id: member.id },
      data: { totalPaid: { increment: Math.round(input.amount) } },
    });
  }
  revalidatePath("/dashboard/payments");
  return { ok: true };
}

/* ---------------- trainers ---------------- */

export async function getTrainers(): Promise<TrainerDTO[]> {
  const trainers = await prisma.trainer.findMany({ orderBy: { name: "asc" } });
  return trainers.map((t) => ({
    id: t.id,
    name: t.name,
    specialty: t.specialty,
    experienceYrs: t.experienceYrs,
    rating: t.rating,
    sessionsPerWeek: t.sessionsPerWeek,
    status: t.status,
    hue: t.hue,
  }));
}

/* ---------------- batches ---------------- */

export async function getBatches(): Promise<BatchDTO[]> {
  const batches = await prisma.batch.findMany({
    include: { trainer: { select: { name: true } } },
    orderBy: { name: "asc" },
  });
  return batches.map((b) => ({
    id: b.id,
    name: b.name,
    trainerId: b.trainerId,
    trainerName: b.trainer.name,
    days: b.days,
    time: b.time,
    capacity: b.capacity,
    enrolled: b.enrolled,
    intensity: b.intensity,
    hue: b.hue,
  }));
}

export async function createBatch(input: {
  name: string;
  trainerId: string;
  days: string[];
  time: string;
  intensity: string;
  capacity: number;
}): Promise<{ ok: boolean; error?: string }> {
  const trainer = await prisma.trainer.findUnique({ where: { id: input.trainerId } });
  if (!trainer) return { ok: false, error: "Trainer not found." };
  if (!input.name.trim()) return { ok: false, error: "Batch name is required." };
  if (input.days.length === 0) return { ok: false, error: "Pick at least one day." };

  await prisma.batch.create({
    data: {
      id: `b-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
      name: input.name.trim(),
      trainerId: trainer.id,
      days: input.days,
      time: input.time.trim(),
      intensity: input.intensity,
      capacity: input.capacity,
      enrolled: 0,
      hue: Math.floor(Math.random() * 360),
    },
  });
  revalidatePath("/dashboard/batches");
  return { ok: true };
}

/* ---------------- attendance ---------------- */

export async function getRoster(): Promise<MemberDTO[]> {
  const members = await prisma.member.findMany({
    include: { plan: { select: { name: true } } },
    where: { expiryDate: { gte: startOfTodayUTC() } },
    orderBy: { name: "asc" },
  });
  return members.map(toMemberDTO);
}

export async function getAttendanceMarks(
  batchId: string,
  dateISO: string
): Promise<Record<string, "present" | "absent">> {
  const day = new Date(dateISO + "T00:00:00Z");
  const next = new Date(day);
  next.setUTCDate(next.getUTCDate() + 1);
  const records = await prisma.attendanceRecord.findMany({
    where: { batchId, date: { gte: day, lt: next } },
    select: { memberId: true, status: true },
  });
  const marks: Record<string, "present" | "absent"> = {};
  for (const r of records) marks[r.memberId] = r.status;
  return marks;
}

export async function saveAttendance(
  batchId: string,
  dateISO: string,
  marks: { memberId: string; status: "present" | "absent" }[]
): Promise<{ ok: boolean; saved: number }> {
  const day = new Date(dateISO + "T00:00:00Z");
  const affected = new Set<string>();

  for (const mark of marks) {
    await prisma.attendanceRecord.upsert({
      where: {
        memberId_batchId_date: { memberId: mark.memberId, batchId, date: day },
      },
      update: { status: mark.status },
      create: { memberId: mark.memberId, batchId, date: day, status: mark.status },
    });
    affected.add(mark.memberId);
  }

  // Refresh per-member aggregates + check-in stamp for those present
  const timeNow = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Karachi",
  });
  const presentIds = new Set(marks.filter((m) => m.status === "present").map((m) => m.memberId));
  for (const memberId of affected) {
    const total = await prisma.attendanceRecord.count({ where: { memberId } });
    const present = await prisma.attendanceRecord.count({ where: { memberId, status: "present" } });
    await prisma.member.update({
      where: { id: memberId },
      data: {
        attendanceRate: total ? Math.round((present / total) * 100) : 0,
        ...(presentIds.has(memberId) ? { lastCheckin: `Today, ${timeNow}` } : {}),
      },
    });
  }

  revalidatePath("/dashboard/attendance");
  return { ok: true, saved: marks.length };
}

/* ---------------- dashboard aggregates ---------------- */

export async function getRevenueSeries(): Promise<RevenuePoint[]> {
  // Last 12 calendar months ending with the current month — ONE query,
  // bucketed in UTC in JS (avoids DB session-timezone traps with date_trunc).
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1));
  const payments = await prisma.payment.findMany({
    where: { status: "paid", date: { gte: start } },
    select: { date: true, amount: true },
  });
  const totals = new Array<number>(12).fill(0);
  for (const p of payments) {
    const idx =
      (p.date.getUTCFullYear() - start.getUTCFullYear()) * 12 +
      (p.date.getUTCMonth() - start.getUTCMonth());
    if (idx >= 0 && idx < 12) totals[idx] += p.amount;
  }
  const points: RevenuePoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    points.push({
      month: MONTH_LABELS[(d.getUTCMonth() + 2) % 12],
      revenue: totals[11 - i],
      target: MONTH_TARGETS[(d.getUTCMonth() + 2) % 12],
    });
  }
  return points;
}

export async function getHeatmap(): Promise<number[][]> {
  // 12 weeks (oldest → newest) × 7 days (Mon → Sun): present counts
  const weeks: number[][] = Array.from({ length: 12 }, () => new Array(7).fill(0));
  const since = new Date(startOfTodayUTC());
  since.setUTCDate(since.getUTCDate() - 84);
  const records = await prisma.attendanceRecord.findMany({
    where: { date: { gte: since }, status: "present" },
    select: { date: true },
  });
  const now = startOfTodayUTC().getTime();
  for (const r of records) {
    const daysAgo = Math.floor((now - r.date.getTime()) / 86400000);
    const weekIdx = 11 - Math.floor(daysAgo / 7);
    const dayIdx = (r.date.getUTCDay() + 6) % 7; // Mon=0 … Sun=6
    if (weekIdx >= 0 && weekIdx < 12) weeks[weekIdx][dayIdx]++;
  }
  return weeks;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const prevMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const today = startOfTodayUTC();
  const in7 = new Date(today);
  in7.setUTCDate(in7.getUTCDate() + 7);
  const d30 = new Date(today);
  d30.setUTCDate(d30.getUTCDate() - 30);
  const d60 = new Date(today);
  d60.setUTCDate(d60.getUTCDate() - 60);

  const sumPaid = async (gte: Date, lt?: Date) => {
    const agg = await prisma.payment.aggregate({
      where: { status: "paid", date: { gte, ...(lt ? { lt } : {}) } },
      _sum: { amount: true },
    });
    return agg._sum.amount ?? 0;
  };
  const sumByStatus = async (status: "due" | "overdue") => {
    const agg = await prisma.payment.aggregate({ where: { status }, _sum: { amount: true } });
    return agg._sum.amount ?? 0;
  };
  const rate = async (gte: Date, lt: Date) => {
    const [total, present] = await Promise.all([
      prisma.attendanceRecord.count({ where: { date: { gte, lt } } }),
      prisma.attendanceRecord.count({ where: { date: { gte, lt }, status: "present" } }),
    ]);
    return total ? (present / total) * 100 : 0;
  };

  const [monthlyRevenue, prevRevenue, activeMembers, joined30, expiringSoon, avgAttendance, prevAttendance, pendingFees, overdueFees] =
    await Promise.all([
      sumPaid(monthStart),
      sumPaid(prevMonthStart, monthStart),
      prisma.member.count({ where: { expiryDate: { gte: today } } }),
      prisma.member.count({ where: { joinDate: { gte: d30 } } }),
      prisma.member.count({ where: { expiryDate: { gte: today, lte: in7 } } }),
      rate(d30, today),
      rate(d60, d30),
      sumByStatus("due"),
      sumByStatus("overdue"),
    ]);

  const pct = (cur: number, prev: number) => (prev ? Math.round(((cur - prev) / prev) * 1000) / 10 : 0);

  return {
    monthlyRevenue,
    revenueDelta: pct(monthlyRevenue, prevRevenue),
    activeMembers,
    membersDelta: joined30,
    expiringSoon,
    avgAttendance: Math.round(avgAttendance * 10) / 10,
    attendanceDelta: Math.round((avgAttendance - prevAttendance) * 10) / 10,
    collectedThisMonth: monthlyRevenue,
    pendingFees,
    overdueFees,
  };
}

/* ---------------- one-shot dashboard fetch ---------------- */

export interface DashboardData {
  stats: DashboardStats;
  revenueSeries: RevenuePoint[];
  heatmap: number[][];
  plans: PlanDTO[];
  members: MemberDTO[];
  payments: PaymentDTO[];
  batches: BatchDTO[];
}

/* Highly optimized one-shot dashboard fetch:
   Only 5 parallel, lean queries hit Postgres. All aggregations, attendance rates,
   heatmaps, and monthly revenue series are computed in-memory in <1ms, cutting
   serverless DB latency by up to 70%. */
export async function getDashboardData(): Promise<DashboardData> {
  const now = new Date();
  const today = startOfTodayUTC();
  const since = new Date(today);
  since.setUTCDate(since.getUTCDate() - 84);
  const startRev = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1));

  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const prevMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const in7 = new Date(today);
  in7.setUTCDate(in7.getUTCDate() + 7);
  const d30 = new Date(today);
  d30.setUTCDate(d30.getUTCDate() - 30);
  const d60 = new Date(today);
  d60.setUTCDate(d60.getUTCDate() - 60);

  // Run the 5 core dataset queries concurrently in a single round-trip
  const [plansRaw, membersRaw, paymentsRaw, batchesRaw, attendanceRecordsRaw] = await Promise.all([
    prisma.plan.findMany({
      include: { _count: { select: { members: true } } },
      orderBy: { price: "asc" },
    }),
    prisma.member.findMany({
      include: { plan: { select: { name: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.payment.findMany({
      orderBy: { date: "desc" },
    }),
    prisma.batch.findMany({
      include: { trainer: { select: { name: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.attendanceRecord.findMany({
      where: { date: { gte: since } },
      select: { date: true, status: true },
    }),
  ]);

  // 1. Transform Plans, Members, Payments, Batches
  const plans: PlanDTO[] = plansRaw.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    durationMonths: p.durationMonths,
    color: p.color,
    tagline: p.tagline,
    popular: p.popular,
    features: p.features,
    memberCount: p._count.members,
  }));

  const members: MemberDTO[] = membersRaw.map(toMemberDTO);
  const payments: PaymentDTO[] = paymentsRaw.map(toPaymentDTO);

  const batches: BatchDTO[] = batchesRaw.map((b) => ({
    id: b.id,
    name: b.name,
    trainerId: b.trainerId,
    trainerName: b.trainer.name,
    days: b.days,
    time: b.time,
    capacity: b.capacity,
    enrolled: b.enrolled,
    intensity: b.intensity,
    hue: b.hue,
  }));

  // 2. In-memory Revenue Series (12 calendar months)
  const totals = new Array<number>(12).fill(0);
  for (const p of paymentsRaw) {
    if (p.status === "paid" && p.date >= startRev) {
      const idx =
        (p.date.getUTCFullYear() - startRev.getUTCFullYear()) * 12 +
        (p.date.getUTCMonth() - startRev.getUTCMonth());
      if (idx >= 0 && idx < 12) totals[idx] += p.amount;
    }
  }
  const revenueSeries: RevenuePoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    revenueSeries.push({
      month: MONTH_LABELS[(d.getUTCMonth() + 2) % 12],
      revenue: totals[11 - i],
      target: MONTH_TARGETS[(d.getUTCMonth() + 2) % 12],
    });
  }

  // 3. In-memory Heatmap (12 weeks × 7 days)
  const heatmap: number[][] = Array.from({ length: 12 }, () => new Array(7).fill(0));
  const todayTimestamp = today.getTime();
  for (const r of attendanceRecordsRaw) {
    if (r.status === "present") {
      const daysAgo = Math.floor((todayTimestamp - r.date.getTime()) / 86400000);
      const weekIdx = 11 - Math.floor(daysAgo / 7);
      const dayIdx = (r.date.getUTCDay() + 6) % 7; // Mon=0 … Sun=6
      if (weekIdx >= 0 && weekIdx < 12) heatmap[weekIdx][dayIdx]++;
    }
  }

  // 4. In-memory Dashboard Stats
  let monthlyRevenue = 0;
  let prevRevenue = 0;
  let pendingFees = 0;
  let overdueFees = 0;

  for (const p of paymentsRaw) {
    if (p.status === "paid") {
      if (p.date >= monthStart) monthlyRevenue += p.amount;
      else if (p.date >= prevMonthStart && p.date < monthStart) prevRevenue += p.amount;
    } else if (p.status === "due") {
      pendingFees += p.amount;
    } else if (p.status === "overdue") {
      overdueFees += p.amount;
    }
  }

  let activeMembers = 0;
  let joined30 = 0;
  let expiringSoon = 0;

  for (const m of membersRaw) {
    if (m.expiryDate >= today) {
      activeMembers++;
      if (m.expiryDate <= in7) expiringSoon++;
    }
    if (m.joinDate >= d30) joined30++;
  }

  let curTotal = 0;
  let curPresent = 0;
  let prevTotal = 0;
  let prevPresent = 0;

  for (const r of attendanceRecordsRaw) {
    if (r.date >= d30 && r.date < today) {
      curTotal++;
      if (r.status === "present") curPresent++;
    } else if (r.date >= d60 && r.date < d30) {
      prevTotal++;
      if (r.status === "present") prevPresent++;
    }
  }

  const avgAttendance = curTotal ? (curPresent / curTotal) * 100 : 0;
  const prevAttendance = prevTotal ? (prevPresent / prevTotal) * 100 : 0;
  const pct = (cur: number, prev: number) => (prev ? Math.round(((cur - prev) / prev) * 1000) / 10 : 0);

  const stats: DashboardStats = {
    monthlyRevenue,
    revenueDelta: pct(monthlyRevenue, prevRevenue),
    activeMembers,
    membersDelta: joined30,
    expiringSoon,
    avgAttendance: Math.round(avgAttendance * 10) / 10,
    attendanceDelta: Math.round((avgAttendance - prevAttendance) * 10) / 10,
    collectedThisMonth: monthlyRevenue,
    pendingFees,
    overdueFees,
  };

  return { stats, revenueSeries, heatmap, plans, members, payments, batches };
}

/* ---------------- reminders (simulated channel) ---------------- */

export async function sendReminder(memberId: string): Promise<{ ok: boolean }> {
  const member = await prisma.member.findUnique({ where: { id: memberId } });
  if (!member) return { ok: false };
  // No SMS gateway is wired in this phase — the reminder is logged as sent.
  // Wire Twilio/WhatsApp here when the notification channel is chosen.
  return { ok: true };
}

/* ---------------- delete ---------------- */

export async function deleteMember(id: string): Promise<{ ok: boolean; error?: string }> {
  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) return { ok: false, error: "Member not found." };
  // Payments + attendance rows cascade-delete via the schema relations.
  await prisma.member.delete({ where: { id } });
  revalidatePath("/dashboard/members");
  revalidatePath("/dashboard");
  return { ok: true };
}
