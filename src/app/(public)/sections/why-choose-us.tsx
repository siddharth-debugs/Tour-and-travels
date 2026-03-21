"use client";

import { motion, type Variants } from "framer-motion";
import { Shield, Map, Users, Headphones } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatsCounter } from "@/components/shared/stats-counter";
import { STATS } from "@/lib/constants";

const ICONS = [Shield, Map, Users, Headphones];

const FEATURES = [
  {
    title: "Trusted & Safe",
    description: "Fully insured tours with certified guides and 24/7 emergency support throughout your journey.",
  },
  {
    title: "Curated Routes",
    description: "Every itinerary is hand-crafted by travel experts who know India's hidden gems intimately.",
  },
  {
    title: "Group & Private",
    description: "Whether you prefer the social energy of group tours or the freedom of a private trip — we've got you.",
  },
  {
    title: "Always Reachable",
    description: "Our support team is available round-the-clock to handle any queries or last-minute changes.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function WhyChooseUs() {
  return (
    <section className="py-24 px-4 sm:px-6 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden relative">
      {/* Decorative background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-black/10 blur-3xl translate-y-1/2 -translate-x-1/3" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Heading — override colors for white text */}
        <div className="mb-16 [&_h2]:text-primary-foreground [&_.h-1]:bg-primary-foreground/60 [&_p]:text-primary-foreground/75">
          <SectionHeading
            title="Why Choose WanderQuest"
            subtitle="We go beyond ordinary travel — crafting experiences that connect you with the soul of each destination"
            align="center"
          />
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {FEATURES.map((feature, index) => {
            const Icon = ICONS[index];
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className="group flex flex-col items-center text-center gap-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/15 hover:border-white/30 p-6 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-center size-14 rounded-2xl bg-white/15 group-hover:bg-white/25 transition-colors">
                  <Icon className="size-7 text-primary-foreground" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-primary-foreground mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-primary-foreground/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats Row */}
        <div className="border-t border-white/15 pt-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {STATS.map((stat) => (
              <motion.div key={stat.label} variants={cardVariants}>
                <StatsCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  className="[&_.text-4xl]:text-primary-foreground [&_.text-5xl]:text-primary-foreground [&_p]:text-primary-foreground/70 [&_.text-primary]:text-primary-foreground"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
