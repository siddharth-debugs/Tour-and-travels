"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatsCounterProps {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
  className?: string;
}

export function StatsCounter({
  value,
  suffix = "",
  label,
  duration = 2000,
  className,
}: StatsCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!isInView || hasAnimated) return;
    setHasAnimated(true);

    const steps = 60;
    const stepDuration = duration / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += 1;
      // Ease-out: faster at start, slower at end
      const progress = current / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));

      if (current >= steps) {
        clearInterval(interval);
        setCount(value);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isInView, hasAnimated, value, duration]);

  return (
    <div
      ref={ref}
      className={cn("flex flex-col items-center gap-1 text-center", className)}
    >
      <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-primary">
        {count.toLocaleString("en-IN")}
        <span>{suffix}</span>
      </div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
