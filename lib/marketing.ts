/* Static content for the public landing page only.
   The dashboard reads live data from Postgres; this file keeps the
   marketing site renderable with zero database dependency. */

export interface MarketingPlan {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  tagline: string;
  features: string[];
  color: string;
  popular?: boolean;
}

export const marketingPlans: MarketingPlan[] = [
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
];

export const marketingRevenue = [
  { month: "May", revenue: 498000, target: 495000 },
  { month: "Jun", revenue: 512000, target: 505000 },
  { month: "Jul", revenue: 530000, target: 520000 },
  { month: "Aug", revenue: 505000, target: 535000 },
  { month: "Sep", revenue: 548000, target: 545000 },
  { month: "Oct", revenue: 592000, target: 560000 },
];

export const marketingMembers = [
  { id: "m01", name: "Ahmed Raza", hue: 210, lastCheckin: "Today, 6:12 AM" },
  { id: "m02", name: "Bilal Sheikh", hue: 265, lastCheckin: "Today, 7:03 AM" },
  { id: "m03", name: "Daniyal Khan", hue: 18, lastCheckin: "Yesterday, 6:48 PM" },
];
