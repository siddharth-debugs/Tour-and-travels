"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GalleryImage {
  src: string;
  alt: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  className?: string;
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const prev = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + images.length) % images.length
    );
  }, [images.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i + 1) % images.length
    );
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, prev, next, closeLightbox]);

  if (!images.length) return null;

  const [first, ...rest] = images;

  return (
    <>
      {/* Gallery Grid */}
      <div className={cn("grid grid-cols-2 gap-2 sm:gap-3", className)}>
        {/* First image: full width */}
        <div
          className="col-span-2 relative h-64 sm:h-80 rounded-xl overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={first.src}
            alt={first.alt}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <ZoomIn className="size-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Remaining images: 2 per row */}
        {rest.map((img, idx) => (
          <div
            key={idx + 1}
            className="relative h-40 sm:h-52 rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(idx + 1)}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn className="size-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {/* Show +N overlay on last visible image if more images exist */}
            {idx === 1 && rest.length > 2 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                <span className="text-white text-xl font-bold">
                  +{rest.length - 2} more
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-4 right-4 text-white hover:bg-white/10 z-10"
              onClick={closeLightbox}
            >
              <X className="size-5" />
            </Button>

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {lightboxIndex + 1} / {images.length}
            </div>

            {/* Prev Button */}
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10 size-10"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft className="size-6" />
            </Button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-5xl w-full max-h-[80vh] aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[lightboxIndex].src}
                alt={images[lightboxIndex].alt}
                fill
                sizes="100vw"
                className="object-contain rounded-lg"
              />
            </motion.div>

            {/* Next Button */}
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10 size-10"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <ChevronRight className="size-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
