/* RepSync database seed — deterministic, idempotent.
   Run with: npx prisma db seed
   Rebuilds the full demo dataset: plans, trainers, batches, members,
   12 months of payment history, and 12 weeks of attendance records. */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2d6127);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MONTHS = [
  "Nov", "Dec", "Jan", "Feb", "Mar", "Apr",
  "May", "Jun", "Jul", "Aug", "Sep", "Oct",
];
const TARGETS = [420000, 430000, 440000, 450000, 465000, 480000, 495000, 505000, 520000, 535000, 545000, 560000];
const PRICES = [3500, 9000, 16000, 28000];

async function main() {
  const rand = mulberry32(20261002);

  // Wipe in FK-safe order
  await prisma.attendanceRecord.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.member.deleteMany();
  await prisma.trainer.deleteMany();
  await prisma.plan.deleteMany();

  // ---- Plans ----
  const plans = [
    { id: "starter", name: "Starter", price: 3500, durationMonths: 1, color: "#38bdf8", tagline: "For the curious beginner", popular: false, features: ["Full gym floor access", "1 group class / week", "Locker access", "Fitness assessment"] },
    { id: "pro", name: "Pro", price: 9000, durationMonths: 3, color: "#a78bfa", tagline: "For the committed regular", popular: true, features: ["Full gym floor access", "Unlimited group classes", "1 personal session / month", "Nutrition starter guide", "Locker access"] },
    { id: "elite", name: "Elite", price: 16000, durationMonths: 6, color: "#f5d47e", tagline: "For the serious athlete", popular: false, features: ["Everything in Pro", "4 personal sessions / month", "Custom nutrition plan", "Recovery zone access", "Priority batch booking"] },
    { id: "royal", name: "Royal Annual", price: 28000, durationMonths: 12, color: "#f472b6", tagline: "For the all-in lifter", popular: false, features: ["Everything in Elite", "8 personal sessions / month", "Guest passes (2 / month)", "Physio consult quarterly", "RepSync gold member lounge"] },
  ];
  for (const p of plans) await prisma.plan.create({ data: p });

  // ---- Members ----
  const members = [
    { id: "m01", name: "Ahmed Raza", email: "ahmed.raza@gmail.com", phone: "0300-4128871", planId: "pro", joinDate: "2026-03-14", expiryDate: "2026-11-20", lastCheckin: "Today, 6:12 AM", hue: 210 },
    { id: "m02", name: "Bilal Sheikh", email: "bilal.sheikh@gmail.com", phone: "0321-5589012", planId: "elite", joinDate: "2025-11-02", expiryDate: "2027-01-15", lastCheckin: "Today, 7:03 AM", hue: 265 },
    { id: "m03", name: "Daniyal Khan", email: "daniyal.k@gmail.com", phone: "0333-7712455", planId: "starter", joinDate: "2026-09-06", expiryDate: "2026-10-06", lastCheckin: "Yesterday, 6:48 PM", hue: 18 },
    { id: "m04", name: "Fahad Malik", email: "fahad.malik@gmail.com", phone: "0301-9034762", planId: "pro", joinDate: "2026-04-11", expiryDate: "2026-10-04", lastCheckin: "Today, 5:55 AM", hue: 150 },
    { id: "m05", name: "Hamza Tariq", email: "hamza.tariq@gmail.com", phone: "0345-2217890", planId: "royal", joinDate: "2025-07-19", expiryDate: "2027-06-30", lastCheckin: "Today, 6:40 AM", hue: 320 },
    { id: "m06", name: "Imran Siddiqui", email: "imran.s@gmail.com", phone: "0302-6641238", planId: "starter", joinDate: "2026-08-25", expiryDate: "2026-09-25", lastCheckin: "24 Sep, 7:15 PM", hue: 200 },
    { id: "m07", name: "Junaid Aslam", email: "junaid.aslam@gmail.com", phone: "0332-8890456", planId: "elite", joinDate: "2026-02-08", expiryDate: "2026-12-28", lastCheckin: "Today, 8:02 AM", hue: 45 },
    { id: "m08", name: "Kamran Shah", email: "kamran.shah@gmail.com", phone: "0300-1178234", planId: "pro", joinDate: "2026-05-30", expiryDate: "2026-11-02", lastCheckin: "Yesterday, 7:20 AM", hue: 280 },
    { id: "m09", name: "Naveed Akhtar", email: "naveed.a@gmail.com", phone: "0341-5567891", planId: "starter", joinDate: "2026-09-08", expiryDate: "2026-10-08", lastCheckin: "2 Oct, 6:30 PM", hue: 100 },
    { id: "m10", name: "Owais Farooq", email: "owais.f@gmail.com", phone: "0322-9903456", planId: "elite", joinDate: "2026-01-17", expiryDate: "2026-09-28", lastCheckin: "27 Sep, 6:05 PM", hue: 240 },
    { id: "m11", name: "Salman Butt", email: "salman.butt@gmail.com", phone: "0303-4432198", planId: "pro", joinDate: "2026-06-21", expiryDate: "2026-12-05", lastCheckin: "Today, 7:44 AM", hue: 175 },
    { id: "m12", name: "Usman Ghani", email: "usman.ghani@gmail.com", phone: "0334-7789012", planId: "royal", joinDate: "2026-01-05", expiryDate: "2027-03-18", lastCheckin: "Today, 6:58 AM", hue: 300 },
  ];
  for (const m of members) {
    await prisma.member.create({
      data: {
        ...m,
        joinDate: new Date(m.joinDate + "T00:00:00Z"),
        expiryDate: new Date(m.expiryDate + "T00:00:00Z"),
      },
    });
  }

  // ---- Trainers ----
  const trainers = [
    { id: "t01", name: "Coach Adnan", specialty: "Strength & Powerlifting", experienceYrs: 8, rating: 4.9, sessionsPerWeek: 18, status: "active", hue: 20 },
    { id: "t02", name: "Sarah Ahmed", specialty: "HIIT & Conditioning", experienceYrs: 6, rating: 4.8, sessionsPerWeek: 15, status: "active", hue: 280 },
    { id: "t03", name: "Coach Bilal", specialty: "Bodybuilding", experienceYrs: 10, rating: 5.0, sessionsPerWeek: 20, status: "active", hue: 150 },
    { id: "t04", name: "Maria Khan", specialty: "Yoga & Mobility", experienceYrs: 5, rating: 4.7, sessionsPerWeek: 12, status: "on-leave", hue: 320 },
    { id: "t05", name: "Coach Usman", specialty: "Boxing & Cardio", experienceYrs: 7, rating: 4.9, sessionsPerWeek: 16, status: "active", hue: 200 },
  ];
  for (const t of trainers) await prisma.trainer.create({ data: t });

  // ---- Batches ----
  const batches = [
    { id: "b01", name: "Iron Dawn", trainerId: "t01", days: ["Mon", "Wed", "Fri"], time: "06:00 AM", capacity: 24, enrolled: 20, intensity: "High", hue: 20 },
    { id: "b02", name: "HIIT Inferno", trainerId: "t02", days: ["Tue", "Thu", "Sat"], time: "07:30 AM", capacity: 20, enrolled: 18, intensity: "High", hue: 280 },
    { id: "b03", name: "Mass Protocol", trainerId: "t03", days: ["Mon", "Wed", "Fri"], time: "06:00 PM", capacity: 25, enrolled: 22, intensity: "Medium", hue: 150 },
    { id: "b04", name: "Sunrise Yoga", trainerId: "t04", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], time: "06:30 AM", capacity: 18, enrolled: 15, intensity: "Low", hue: 320 },
    { id: "b05", name: "Fight Camp", trainerId: "t05", days: ["Tue", "Thu"], time: "07:00 PM", capacity: 16, enrolled: 14, intensity: "High", hue: 200 },
    { id: "b06", name: "Core Crusher", trainerId: "t02", days: ["Mon", "Wed"], time: "05:00 PM", capacity: 20, enrolled: 16, intensity: "Medium", hue: 280 },
    { id: "b07", name: "Power Hour", trainerId: "t01", days: ["Sat"], time: "09:00 AM", capacity: 30, enrolled: 24, intensity: "High", hue: 20 },
    { id: "b08", name: "Mobility Flow", trainerId: "t04", days: ["Sun"], time: "08:00 AM", capacity: 15, enrolled: 12, intensity: "Low", hue: 320 },
  ];
  for (const b of batches) await prisma.batch.create({ data: b });

  // ---- Recent payments (the live ledger) ----
  const planNames: Record<string, string> = { starter: "Starter", pro: "Pro", elite: "Elite", royal: "Royal Annual" };
  const memberById = Object.fromEntries(members.map((m) => [m.id, m]));
  const recent = [
    { id: "p01", memberId: "m01", amount: 9000, date: "2026-09-28", method: "Card", status: "paid" as const },
    { id: "p02", memberId: "m03", amount: 3500, date: "2026-10-01", method: "Cash", status: "due" as const },
    { id: "p03", memberId: "m04", amount: 9000, date: "2026-09-30", method: "Bank Transfer", status: "due" as const },
    { id: "p04", memberId: "m05", amount: 28000, date: "2026-06-30", method: "Bank Transfer", status: "paid" as const },
    { id: "p05", memberId: "m06", amount: 3500, date: "2026-09-25", method: "Cash", status: "overdue" as const },
    { id: "p06", memberId: "m07", amount: 16000, date: "2026-08-28", method: "Card", status: "paid" as const },
    { id: "p07", memberId: "m08", amount: 9000, date: "2026-09-29", method: "Cash", status: "paid" as const },
    { id: "p08", memberId: "m10", amount: 16000, date: "2026-09-28", method: "Card", status: "overdue" as const },
    { id: "p09", memberId: "m11", amount: 9000, date: "2026-09-27", method: "Bank Transfer", status: "paid" as const },
    { id: "p10", memberId: "m12", amount: 28000, date: "2026-09-26", method: "Card", status: "paid" as const },
  ];
  for (const p of recent) {
    const m = memberById[p.memberId];
    await prisma.payment.create({
      data: {
        id: p.id,
        memberId: p.memberId,
        memberName: m.name,
        planName: planNames[m.planId],
        amount: p.amount,
        method: p.method,
        date: new Date(p.date + "T00:00:00Z"),
        status: p.status,
      },
    });
  }

  // ---- 12 months of payment history (Nov 2025 → Oct 2026) ----
  const methods = ["Cash", "Card", "Bank Transfer"];
  let histCount = 0;
  for (let m = 0; m < 12; m++) {
    const count = 28 + ((m * 7) % 9);
    for (let i = 0; i < count; i++) {
      const member = members[(m * 3 + i) % members.length];
      const maxDay = m === 11 ? 2 : 27; // October 2026: only up to today (2 Oct)
      const day = 1 + Math.floor(rand() * maxDay);
      const date = new Date(Date.UTC(2025, 10 + m, day));
      await prisma.payment.create({
        data: {
          memberId: member.id,
          memberName: member.name,
          planName: planNames[member.planId],
          amount: PRICES[(m * 5 + i * 3) % PRICES.length],
          method: methods[Math.floor(rand() * 3)],
          date,
          status: "paid",
        },
      });
      histCount++;
      // Skip October's generated rows that fall after the 10 curated ones' dates? keep them — history is history.
    }
  }

  // ---- 12 weeks of attendance (Mon–Fri), per-member probability ----
  const rateByMember: Record<string, number> = {
    m01: 0.86, m02: 0.92, m03: 0.64, m04: 0.71, m05: 0.95, m06: 0.41,
    m07: 0.88, m08: 0.79, m09: 0.58, m10: 0.66, m11: 0.83, m12: 0.9,
  };
  const batchIds = batches.map((b) => b.id);
  const today = new Date("2026-10-02T00:00:00Z");
  let attCount = 0;
  for (let w = 11; w >= 0; w--) {
    for (let d = 0; d < 5; d++) {
      const date = new Date(today);
      date.setUTCDate(date.getUTCDate() - (w * 7 + (4 - d)));
      if (date > today) continue;
      for (const member of members) {
        const present = rand() < rateByMember[member.id];
        await prisma.attendanceRecord.create({
          data: {
            memberId: member.id,
            batchId: batchIds[Math.floor(rand() * batchIds.length)],
            date,
            status: present ? "present" : "absent",
          },
        });
        attCount++;
      }
    }
  }

  // ---- Roll up member aggregates from real rows ----
  for (const member of members) {
    const paidAgg = await prisma.payment.aggregate({
      where: { memberId: member.id, status: "paid" },
      _sum: { amount: true },
    });
    const total = await prisma.attendanceRecord.count({ where: { memberId: member.id } });
    const present = await prisma.attendanceRecord.count({ where: { memberId: member.id, status: "present" } });
    await prisma.member.update({
      where: { id: member.id },
      data: {
        totalPaid: paidAgg._sum.amount ?? 0,
        attendanceRate: total ? Math.round((present / total) * 100) : 0,
      },
    });
  }

  console.log(`Seeded: 4 plans, 12 members, 5 trainers, 8 batches,`);
  console.log(`  ${recent.length + histCount} payments (12-month history), ${attCount} attendance records.`);
  console.log(`Revenue targets by month: ${MONTHS.map((mo, i) => `${mo}:${TARGETS[i] / 1000}k`).join(" ")}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
