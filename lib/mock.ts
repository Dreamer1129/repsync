/* Deterministic mock dataset for RepSync — every value is fixed so
   client-rendered pages hydrate identically on server and client. */

export type MemberStatus = "active" | "expiring" | "expired";
export type PaymentStatus = "paid" | "due" | "overdue";
export type PaymentMethod = "Cash" | "Card" | "Bank Transfer";

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  tagline: string;
  features: string[];
  color: string;
  popular?: boolean;
}

export interface Member {
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

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  planName: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  status: PaymentStatus;
}

export interface Trainer {
  id: string;
  name: string;
  specialty: string;
  experienceYrs: number;
  rating: number;
  sessionsPerWeek: number;
  status: "active" | "on-leave";
  hue: number;
}

export interface GymBatch {
  id: string;
  name: string;
  trainerId: string;
  trainerName: string;
  days: string[];
  time: string;
  capacity: number;
  enrolled: number;
  intensity: "High" | "Medium" | "Low";
  hue: number;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
  target: number;
}

export const plans: MembershipPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 3500,
    durationMonths: 1,
    tagline: "For the curious beginner",
    features: ["Full gym floor access", "1 group class / week", "Locker access", "Fitness assessment"],
    color: "#38bdf8",
  },
  {
    id: "pro",
    name: "Pro",
    price: 9000,
    durationMonths: 3,
    tagline: "For the committed regular",
    features: [
      "Full gym floor access",
      "Unlimited group classes",
      "1 personal session / month",
      "Nutrition starter guide",
      "Locker access",
    ],
    color: "#a78bfa",
    popular: true,
  },
  {
    id: "elite",
    name: "Elite",
    price: 16000,
    durationMonths: 6,
    tagline: "For the serious athlete",
    features: [
      "Everything in Pro",
      "4 personal sessions / month",
      "Custom nutrition plan",
      "Recovery zone access",
      "Priority batch booking",
    ],
    color: "#f5d47e",
  },
  {
    id: "royal",
    name: "Royal Annual",
    price: 28000,
    durationMonths: 12,
    tagline: "For the all-in lifter",
    features: [
      "Everything in Elite",
      "8 personal sessions / month",
      "Guest passes (2 / month)",
      "Physio consult quarterly",
      "RepSync gold member lounge",
    ],
    color: "#f472b6",
  },
];

export const members: Member[] = [
  { id: "m01", name: "Ahmed Raza", email: "ahmed.raza@gmail.com", phone: "0300-4128871", planId: "pro", planName: "Pro", status: "active", joinDate: "2026-03-14", expiryDate: "2026-11-20", totalPaid: 27000, attendanceRate: 86, lastCheckin: "Today, 6:12 AM", hue: 210 },
  { id: "m02", name: "Bilal Sheikh", email: "bilal.sheikh@gmail.com", phone: "0321-5589012", planId: "elite", planName: "Elite", status: "active", joinDate: "2025-11-02", expiryDate: "2027-01-15", totalPaid: 64000, attendanceRate: 92, lastCheckin: "Today, 7:03 AM", hue: 265 },
  { id: "m03", name: "Daniyal Khan", email: "daniyal.k@gmail.com", phone: "0333-7712455", planId: "starter", planName: "Starter", status: "expiring", joinDate: "2026-09-06", expiryDate: "2026-10-06", totalPaid: 3500, attendanceRate: 64, lastCheckin: "Yesterday, 6:48 PM", hue: 18 },
  { id: "m04", name: "Fahad Malik", email: "fahad.malik@gmail.com", phone: "0301-9034762", planId: "pro", planName: "Pro", status: "expiring", joinDate: "2026-04-11", expiryDate: "2026-10-04", totalPaid: 18000, attendanceRate: 71, lastCheckin: "Today, 5:55 AM", hue: 150 },
  { id: "m05", name: "Hamza Tariq", email: "hamza.tariq@gmail.com", phone: "0345-2217890", planId: "royal", planName: "Royal Annual", status: "active", joinDate: "2025-07-19", expiryDate: "2027-06-30", totalPaid: 56000, attendanceRate: 95, lastCheckin: "Today, 6:40 AM", hue: 320 },
  { id: "m06", name: "Imran Siddiqui", email: "imran.s@gmail.com", phone: "0302-6641238", planId: "starter", planName: "Starter", status: "expired", joinDate: "2026-08-25", expiryDate: "2026-09-25", totalPaid: 3500, attendanceRate: 41, lastCheckin: "24 Sep, 7:15 PM", hue: 200 },
  { id: "m07", name: "Junaid Aslam", email: "junaid.aslam@gmail.com", phone: "0332-8890456", planId: "elite", planName: "Elite", status: "active", joinDate: "2026-02-08", expiryDate: "2026-12-28", totalPaid: 32000, attendanceRate: 88, lastCheckin: "Today, 8:02 AM", hue: 45 },
  { id: "m08", name: "Kamran Shah", email: "kamran.shah@gmail.com", phone: "0300-1178234", planId: "pro", planName: "Pro", status: "active", joinDate: "2026-05-30", expiryDate: "2026-11-02", totalPaid: 18000, attendanceRate: 79, lastCheckin: "Yesterday, 7:20 AM", hue: 280 },
  { id: "m09", name: "Naveed Akhtar", email: "naveed.a@gmail.com", phone: "0341-5567891", planId: "starter", planName: "Starter", status: "expiring", joinDate: "2026-09-08", expiryDate: "2026-10-08", totalPaid: 3500, attendanceRate: 58, lastCheckin: "2 Oct, 6:30 PM", hue: 100 },
  { id: "m10", name: "Owais Farooq", email: "owais.f@gmail.com", phone: "0322-9903456", planId: "elite", planName: "Elite", status: "expired", joinDate: "2026-01-17", expiryDate: "2026-09-28", totalPaid: 32000, attendanceRate: 66, lastCheckin: "27 Sep, 6:05 PM", hue: 240 },
  { id: "m11", name: "Salman Butt", email: "salman.butt@gmail.com", phone: "0303-4432198", planId: "pro", planName: "Pro", status: "active", joinDate: "2026-06-21", expiryDate: "2026-12-05", totalPaid: 18000, attendanceRate: 83, lastCheckin: "Today, 7:44 AM", hue: 175 },
  { id: "m12", name: "Usman Ghani", email: "usman.ghani@gmail.com", phone: "0334-7789012", planId: "royal", planName: "Royal Annual", status: "active", joinDate: "2026-01-05", expiryDate: "2027-03-18", totalPaid: 28000, attendanceRate: 90, lastCheckin: "Today, 6:58 AM", hue: 300 },
];

export const payments: Payment[] = [
  { id: "p01", memberId: "m01", memberName: "Ahmed Raza", planName: "Pro", amount: 9000, date: "2026-09-28", method: "Card", status: "paid" },
  { id: "p02", memberId: "m03", memberName: "Daniyal Khan", planName: "Starter", amount: 3500, date: "2026-10-01", method: "Cash", status: "due" },
  { id: "p03", memberId: "m04", memberName: "Fahad Malik", planName: "Pro", amount: 9000, date: "2026-09-30", method: "Bank Transfer", status: "due" },
  { id: "p04", memberId: "m05", memberName: "Hamza Tariq", planName: "Royal Annual", amount: 28000, date: "2026-06-30", method: "Bank Transfer", status: "paid" },
  { id: "p05", memberId: "m06", memberName: "Imran Siddiqui", planName: "Starter", amount: 3500, date: "2026-09-25", method: "Cash", status: "overdue" },
  { id: "p06", memberId: "m07", memberName: "Junaid Aslam", planName: "Elite", amount: 16000, date: "2026-08-28", method: "Card", status: "paid" },
  { id: "p07", memberId: "m08", memberName: "Kamran Shah", planName: "Pro", amount: 9000, date: "2026-09-29", method: "Cash", status: "paid" },
  { id: "p08", memberId: "m10", memberName: "Owais Farooq", planName: "Elite", amount: 16000, date: "2026-09-28", method: "Card", status: "overdue" },
  { id: "p09", memberId: "m11", memberName: "Salman Butt", planName: "Pro", amount: 9000, date: "2026-09-27", method: "Bank Transfer", status: "paid" },
  { id: "p10", memberId: "m12", memberName: "Usman Ghani", planName: "Royal Annual", amount: 28000, date: "2026-09-26", method: "Card", status: "paid" },
];

export const trainers: Trainer[] = [
  { id: "t01", name: "Coach Adnan", specialty: "Strength & Powerlifting", experienceYrs: 8, rating: 4.9, sessionsPerWeek: 18, status: "active", hue: 20 },
  { id: "t02", name: "Sarah Ahmed", specialty: "HIIT & Conditioning", experienceYrs: 6, rating: 4.8, sessionsPerWeek: 15, status: "active", hue: 280 },
  { id: "t03", name: "Coach Bilal", specialty: "Bodybuilding", experienceYrs: 10, rating: 5.0, sessionsPerWeek: 20, status: "active", hue: 150 },
  { id: "t04", name: "Maria Khan", specialty: "Yoga & Mobility", experienceYrs: 5, rating: 4.7, sessionsPerWeek: 12, status: "on-leave", hue: 320 },
  { id: "t05", name: "Coach Usman", specialty: "Boxing & Cardio", experienceYrs: 7, rating: 4.9, sessionsPerWeek: 16, status: "active", hue: 200 },
];

export const batches: GymBatch[] = [
  { id: "b01", name: "Iron Dawn", trainerId: "t01", trainerName: "Coach Adnan", days: ["Mon", "Wed", "Fri"], time: "06:00 AM", capacity: 24, enrolled: 20, intensity: "High", hue: 20 },
  { id: "b02", name: "HIIT Inferno", trainerId: "t02", trainerName: "Sarah Ahmed", days: ["Tue", "Thu", "Sat"], time: "07:30 AM", capacity: 20, enrolled: 18, intensity: "High", hue: 280 },
  { id: "b03", name: "Mass Protocol", trainerId: "t03", trainerName: "Coach Bilal", days: ["Mon", "Wed", "Fri"], time: "06:00 PM", capacity: 25, enrolled: 22, intensity: "Medium", hue: 150 },
  { id: "b04", name: "Sunrise Yoga", trainerId: "t04", trainerName: "Maria Khan", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], time: "06:30 AM", capacity: 18, enrolled: 15, intensity: "Low", hue: 320 },
  { id: "b05", name: "Fight Camp", trainerId: "t05", trainerName: "Coach Usman", days: ["Tue", "Thu"], time: "07:00 PM", capacity: 16, enrolled: 14, intensity: "High", hue: 200 },
  { id: "b06", name: "Core Crusher", trainerId: "t02", trainerName: "Sarah Ahmed", days: ["Mon", "Wed"], time: "05:00 PM", capacity: 20, enrolled: 16, intensity: "Medium", hue: 280 },
  { id: "b07", name: "Power Hour", trainerId: "t01", trainerName: "Coach Adnan", days: ["Sat"], time: "09:00 AM", capacity: 30, enrolled: 24, intensity: "High", hue: 20 },
  { id: "b08", name: "Mobility Flow", trainerId: "t04", trainerName: "Maria Khan", days: ["Sun"], time: "08:00 AM", capacity: 15, enrolled: 12, intensity: "Low", hue: 320 },
];

export const revenueSeries: RevenuePoint[] = [
  { month: "Nov", revenue: 385000, target: 420000 },
  { month: "Dec", revenue: 412000, target: 430000 },
  { month: "Jan", revenue: 398000, target: 440000 },
  { month: "Feb", revenue: 445000, target: 450000 },
  { month: "Mar", revenue: 470000, target: 465000 },
  { month: "Apr", revenue: 455000, target: 480000 },
  { month: "May", revenue: 498000, target: 495000 },
  { month: "Jun", revenue: 512000, target: 505000 },
  { month: "Jul", revenue: 530000, target: 520000 },
  { month: "Aug", revenue: 505000, target: 535000 },
  { month: "Sep", revenue: 548000, target: 545000 },
  { month: "Oct", revenue: 592000, target: 560000 },
];

/* Deterministic pseudo-random attendance heatmap: 12 weeks x 7 days */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2d6127);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const heatmapWeeks: number[][] = (() => {
  const rand = mulberry32(20261002);
  const weeks: number[][] = [];
  for (let w = 0; w < 12; w++) {
    const days: number[] = [];
    for (let d = 0; d < 7; d++) {
      const weekend = d >= 5 ? 0.55 : 1;
      days.push(Math.round(rand() * 38 * weekend));
    }
    weeks.push(days);
  }
  return weeks;
})();

export const memberWeeklyBars: number[] = (() => {
  const rand = mulberry32(777);
  return Array.from({ length: 12 }, () => Math.round(2 + rand() * 5));
})();

export const dashboardStats = {
  monthlyRevenue: 592000,
  revenueDelta: 8.1,
  activeMembers: 7,
  membersDelta: 3,
  expiringSoon: 3,
  avgAttendance: 76,
  attendanceDelta: 4.2,
  collectedThisMonth: 99000,
  pendingFees: 12500,
  overdueFees: 19500,
};
