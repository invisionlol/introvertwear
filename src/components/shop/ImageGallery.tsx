"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageOff } from "lucide-react";

export function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-[3/4] bg-muted flex items-center justify-center">
        <ImageOff size={32} strokeWidth={1} className="text-muted-foreground/40" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIdx}
            src={images[activeIdx]}
            alt={`${title} — image ${activeIdx + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`shrink-0 w-16 aspect-[3/4] overflow-hidden border transition-all duration-200 ${
                i === activeIdx ? "border-foreground" : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${title} thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
