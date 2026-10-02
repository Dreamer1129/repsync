"use client";

import { motion } from "framer-motion";
import { Wallet, Users, AlarmClock, CalendarCheck2 } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { PlanDonut } from "@/components/dashboard/PlanDonut";
import { AttendanceHeatmap } from "@/components/dashboard/AttendanceHeatmap";
import { ExpiryAlertList } from "@/components/dashboard/ExpiryAlertList";
import { UpcomingBatches } from "@/components/dashboard/UpcomingBatches";
import { LoadingGrid } from "@/components/ui/LoadingBlock";
import { useDashboardData } from "@/lib/hooks";
import { pkrShort } from "@/lib/format";
import { fadeUp } from "@/lib/motion";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getGreeting(date: Date): string {
  const h = date.getHours();
  if (h >= 5 && h < 12) return "Good morning";
  if (h >= 12 && h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { data } = useDashboardData();
  const dashboardStats = data?.stats;
  const heatmap = data?.heatmap ?? [];

  const now = new Date();
  const dateLine = `${WEEKDAYS[now.getDay()]} · ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  const dayIdx = (now.getDay() + 6) % 7; // Mon=0 … Sun=6
  const todayCheckins = heatmap?.[11]?.[dayIdx] ?? 0;
  const revDelta = dashboardStats?.revenueDelta ?? 0;
  const revText =
    revDelta > 0
      ? `${revDelta.toFixed(1)}% above last month`
      : revDelta < 0
        ? `${Math.abs(revDelta).toFixed(1)}% below last month`
        : "flat vs last month";
  const greeting = getGreeting(now);

  return (
    <div className="space-y-5">
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="py-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#d9a441]">
          {dateLine}
        </p>
        <h2 className="mt-2 font-display text-4xl font-semibold tracking-wide text-[#f4f1ea] md:text-5xl">
          {greeting}, <span className="text-gold-grad italic">Commander.</span>
        </h2>
        <p className="mt-2 max-w-xl text-sm tracking-wide text-stone-400">
          The gym is humming — {todayCheckins} athletes checked in today and revenue is tracking {revText}.
        </p>
      </motion.div>

      {!data || !dashboardStats ? (
        <LoadingGrid />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Monthly revenue" value={pkrShort(dashboardStats.monthlyRevenue)} delta={dashboardStats.revenueDelta} icon={Wallet} delay={0.1} />
          <StatCard label="Active members" value={String(dashboardStats.activeMembers)} delta={dashboardStats.membersDelta} icon={Users} delay={0.2} />
          <StatCard
            label="Expiring soon"
            value={String(dashboardStats.expiringSoon)}
            badge={dashboardStats.expiringSoon > 0 ? "Requires review" : "All clear"}
            icon={AlarmClock}
            delay={0.3}
          />
          <StatCard label="Avg attendance" value={`${dashboardStats.avgAttendance}%`} delta={dashboardStats.attendanceDelta} icon={CalendarCheck2} delay={0.4} />
        </div>
      )}

      {data && (
        <>
          <div className="grid gap-5 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <RevenueChart series={data.revenueSeries} />
            </div>
            <PlanDonut plans={data.plans} />
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <ExpiryAlertList members={data.members} payments={data.payments} />
            <UpcomingBatches batches={data.batches} />
          </div>

          <AttendanceHeatmap heatmap={data.heatmap} />
        </>
      )}
    </div>
  );
}
