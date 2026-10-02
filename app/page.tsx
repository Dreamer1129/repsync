"use client";

import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { SpecMatrix } from "@/components/marketing/SpecMatrix";
import { PricingTiers } from "@/components/marketing/PricingTiers";
import { Testimonials } from "@/components/marketing/Testimonials";
import { CTA } from "@/components/marketing/CTA";
import { Footer } from "@/components/marketing/Footer";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <Hero />
      <SpecMatrix />
      <PricingTiers />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
