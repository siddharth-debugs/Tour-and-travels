"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Car, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CabsCTA() {
  return (
    <section className="relative py-28 px-4 sm:px-6 overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=1920&q=80&auto=format&fit=crop"
        alt="Open road journey — WanderQuest Cab Services"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Dark Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="max-w-2xl">
          {/* Icon badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm px-4 py-1.5 mb-6"
          >
            <Car className="size-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-white/90">
              Cab Services
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-4"
          >
            Need a Ride?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-white/75 leading-relaxed mb-8 max-w-xl"
          >
            Book comfortable, air-conditioned cabs for your entire trip — airport
            transfers, city sightseeing, outstation rides, and more. Professional
            drivers, transparent pricing, zero hassle.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="flex flex-wrap gap-3 mb-8"
          >
            {["Airport Transfers", "City Tours", "Outstation Trips", "24/7 Available"].map(
              (feature) => (
                <span
                  key={feature}
                  className="flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-medium text-white/80"
                >
                  <MapPin className="size-3 text-primary shrink-0" />
                  {feature}
                </span>
              )
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          >
            <Button
              render={<Link href="/cabs" />}
              size="lg"
              className="h-13 px-8 text-base font-semibold gap-2 group shadow-lg shadow-primary/40 hover:shadow-primary/60 hover:-translate-y-0.5 transition-all duration-200"
            >
              Book a Cab Now
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Decorative side element */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        className="absolute right-6 bottom-6 hidden lg:flex flex-col items-center gap-2"
      >
        <div className="flex items-center justify-center size-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
          <Car className="size-8 text-primary" strokeWidth={1.5} />
        </div>
        <span className="text-xs text-white/50 tracking-wide">Ride in comfort</span>
      </motion.div>
    </section>
  );
}
