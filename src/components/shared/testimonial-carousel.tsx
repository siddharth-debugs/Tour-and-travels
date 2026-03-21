"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string | number;
  name: string;
  location: string;
  rating: number;
  review: string;
  avatar?: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  className?: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < rating
              ? "fill-primary text-primary"
              : "fill-muted text-muted-foreground"
          )}
        />
      ))}
    </div>
  );
}

export function TestimonialCarousel({
  testimonials,
  className,
}: TestimonialCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const scrollNext = useCallback(() => {
    if (!api) return;
    if (api.canScrollNext()) {
      api.scrollNext();
    } else {
      api.scrollTo(0);
    }
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(scrollNext, 5000);
    return () => clearInterval(interval);
  }, [api, scrollNext]);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => { api.off("select", onSelect); };
  }, [api]);

  return (
    <div className={cn("w-full", className)}>
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {testimonials.map((t, idx) => (
            <CarouselItem
              key={t.id}
              className="pl-4 basis-full md:basis-1/2 lg:basis-1/3"
            >
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="h-full"
              >
                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm h-full min-h-52 relative">
                  <Quote className="absolute top-4 right-4 size-8 text-primary/10" />
                  <StarRating rating={t.rating} />
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
                    &ldquo;{t.review}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-border">
                    {t.avatar ? (
                      <div className="relative size-10 rounded-full overflow-hidden ring-2 ring-primary/20 shrink-0">
                        <Image
                          src={t.avatar}
                          alt={t.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.location}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dots indicator */}
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === current
                  ? "bg-primary w-6"
                  : "bg-border w-2 hover:bg-muted-foreground"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
