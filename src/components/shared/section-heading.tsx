"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  const alignClass = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  }[align];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cn("flex flex-col gap-3", alignClass, className)}
    >
      <div className="flex flex-col gap-2">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          style={{ originX: align === "right" ? 1 : align === "center" ? 0.5 : 0 }}
          className={cn(
            "h-1 w-12 rounded-full bg-primary",
            align === "center" && "mx-auto",
            align === "right" && "ml-auto"
          )}
        />
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
          {title}
        </h2>
      </div>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
          className={cn(
            "text-base text-muted-foreground max-w-2xl leading-relaxed",
            align === "center" && "mx-auto"
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
