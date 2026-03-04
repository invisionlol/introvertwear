"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

export function HeroSection() {
  return (
    /* bg-background = deep warm dark; the grain utility adds subtle texture */
    <section className="grain relative min-h-screen bg-background text-foreground flex flex-col justify-end overflow-hidden">

      {/* Warm radial glow — upper right, very subtle */}
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.30 0.06 50 / 0.18) 0%, transparent 70%)",
        }}
      />

      {/* Brand tag — top left */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-20 left-6 md:left-12 text-[10px] tracking-[0.4em] uppercase text-foreground/30"
      >
        introvertwears — 2025
      </motion.p>

      {/* Main editorial text */}
      <div className="relative z-10 px-6 md:px-12 pb-20 space-y-6">
        <div>
          {["DRESSED", "IN", "SILENCE."].map((word, i) => (
            <motion.h1
              key={word}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 + i * 0.15 }}
              className="block text-[13vw] md:text-[10vw] font-semibold leading-[0.9] tracking-[-0.04em] text-foreground"
            >
              {word}
            </motion.h1>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pt-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.0 }}
            className="max-w-xs text-sm text-muted-foreground leading-relaxed"
          >
            For those who understand that the loudest statement
            is the one you don&apos;t have to make.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <Link
              href="#new-arrivals"
              className="group inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Shop Now
              <ArrowDown
                size={14}
                strokeWidth={1.5}
                className="group-hover:translate-y-1 transition-transform"
              />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade into site bg */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, oklch(0.10 0.012 50), transparent)",
        }}
      />
    </section>
  );
}
