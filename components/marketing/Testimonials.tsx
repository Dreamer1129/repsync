"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { staggerParent, scaleIn } from "@/lib/motion";

const quotes = [
  {
    name: "Rashid Mehmood",
    gym: "IronHouse Gym, Lahore",
    text: "We replaced three notebooks and a spreadsheet with RepSync. Fee recovery went from chaos to 99% in six weeks — the expiry radar alone paid for itself.",
  },
  {
    name: "Ayesha Khan",
    gym: "Pulse Fitness Studio, Karachi",
    text: "Attendance marking used to take twenty minutes after every batch. Now it's taps on a screen. My trainers actually enjoy doing it.",
  },
  {
    name: "Danish Ali",
    gym: "Forge Athletics, Islamabad",
    text: "The revenue dashboard is the first thing I open every morning. It feels less like software and more like the gym's heartbeat on a screen.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="px-6 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Owner Stories"
          title={
            <>
              Loved in the <span className="text-gold-grad italic">weight room.</span>
            </>
          }
        />
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-5 lg:grid-cols-3"
        >
          {quotes.map((q, i) => (
            <motion.figure
              key={q.name}
              variants={scaleIn}
              custom={i}
              whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 280, damping: 22 } }}
              className="glass-panel flex flex-col p-7"
            >
              <Quote className="mb-4 h-6 w-6 text-[#d9a441]/60" />
              <blockquote className="flex-1 text-sm leading-relaxed tracking-wide text-stone-300">
                &ldquo;{q.text}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-[#d9a441] text-[#d9a441]" />
                ))}
              </div>
              <figcaption className="mt-3">
                <p className="font-display text-lg font-semibold tracking-wide text-[#f4f1ea]">{q.name}</p>
                <p className="text-xs tracking-[0.18em] text-stone-500">{q.gym.toUpperCase()}</p>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
