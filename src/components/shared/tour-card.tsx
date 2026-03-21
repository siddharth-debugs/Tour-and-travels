"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users, Clock, Package, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PriceTag } from "@/components/shared/price-tag";
import { cn } from "@/lib/utils";

interface TourCardProps {
  title: string;
  slug: string;
  image: string;
  badge?: string;
  href: string;
  price?: number;
  duration?: string;
  groupSize?: number;
  packageCount?: number;
  className?: string;
}

export function TourCard({
  title,
  image,
  badge,
  href,
  price,
  duration,
  groupSize,
  packageCount,
  className,
}: TourCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cn("group", className)}
    >
      <Link href={href} className="block h-full">
        <div className="relative overflow-hidden rounded-2xl bg-muted shadow-sm ring-1 ring-border/50 transition-all duration-300 group-hover:shadow-xl group-hover:ring-primary/20 h-full flex flex-col">
          {/* Image Container */}
          <div className="relative h-56 sm:h-64 overflow-hidden shrink-0">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Badge */}
            {badge && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-primary text-primary-foreground font-semibold shadow-sm text-xs px-2.5 py-1">
                  {badge}
                </Badge>
              </div>
            )}

            {/* Price Tag */}
            {price !== undefined && (
              <div className="absolute bottom-3 right-3">
                <PriceTag price={price} />
              </div>
            )}
          </div>

          {/* Card Body */}
          <div className="flex flex-col gap-3 p-4 flex-1">
            <h3 className="font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>

            {/* Meta Info */}
            {(duration || groupSize !== undefined || packageCount !== undefined) && (
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5 shrink-0" />
                    {duration}
                  </span>
                )}
                {groupSize !== undefined && (
                  <span className="flex items-center gap-1">
                    <Users className="size-3.5 shrink-0" />
                    Up to {groupSize}
                  </span>
                )}
                {packageCount !== undefined && (
                  <span className="flex items-center gap-1">
                    <Package className="size-3.5 shrink-0" />
                    {packageCount} packages
                  </span>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="mt-auto pt-2 flex items-center gap-1 text-xs font-semibold text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
              Explore <ArrowRight className="size-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
