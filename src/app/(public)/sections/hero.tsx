"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/search-bar";

interface Destination {
  id: string;
  name: string;
  slug: string;
}

interface HeroSectionProps {
  destinations: Destination[];
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

export function HeroSection({ destinations }: HeroSectionProps) {
  const searchDestinations = destinations.map((d) => ({
    value: d.slug,
    label: d.name,
  }));

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85&auto=format&fit=crop"
        alt="Stunning mountain landscape — WanderQuest Travels"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/65" />

      {/* Decorative radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(var(--primary-rgb),0.08)_0%,_transparent_70%)]" />

      {/* Hero Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-5xl mx-auto pt-16 pb-40 sm:pb-48"
      >
        {/* Tagline pill */}
        <motion.div variants={itemVariants}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 mb-6">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            Welcome to WanderQuest
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.08] tracking-tight mb-6"
        >
          Discover Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-400">
            Next Adventure
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="max-w-2xl text-base sm:text-lg text-white/80 leading-relaxed mb-10"
        >
          Explore the breathtaking beauty of India — from the snow-capped peaks
          of Manali and Ladakh to the golden beaches of Goa and Andaman.
          Handcrafted journeys, expert guides, memories that last a lifetime.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
        >
          <Button
            nativeButton={false}
            render={<Link href="/packages" />}
            size="lg"
            className="h-12 px-8 text-base font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-200"
          >
            Explore Packages
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/destinations" />}
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base font-semibold border-white/40 bg-white/10 text-white hover:bg-white/20 hover:border-white/60 backdrop-blur-sm hover:-translate-y-0.5 transition-all duration-200"
          >
            View Destinations
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-col items-center gap-1 text-white/40"
        >
          <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"
          />
        </motion.div>
      </motion.div>

      {/* Search Bar — overlapping bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 z-20 translate-y-1/2 px-4 sm:px-6"
      >
        <div className="max-w-3xl mx-auto">
          <SearchBar destinations={searchDestinations} />
        </div>
      </motion.div>
    </section>
  );
}
