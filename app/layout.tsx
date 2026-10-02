import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RepSync — Gym Management OS",
  description:
    "The cinematic command center for modern gyms: members, plans, payments, trainers, batches and attendance in one obsidian-glass workspace.",
};

function MeshBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="orb orb-indigo-a" />
      <div className="orb orb-gold" />
      <div className="orb orb-indigo-b" />
      <div className="vignette" />
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="bg-[#060913] font-sans text-stone-200 antialiased">
        <MeshBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
