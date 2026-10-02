"use client";

import { motion } from "framer-motion";
import { Sidebar, MobileNav } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:pl-64">
      <Sidebar />
      <Topbar />
      <div className="px-4 pt-32 md:px-8 lg:pt-28">
        <MobileNav />
        <motion.main
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[1400px] pb-16"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
