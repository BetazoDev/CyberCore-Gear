"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { HeroSlide } from "./HeroSection";

interface Props {
  slides: HeroSlide[];
}

export default function HeroClient({ slides }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  // Split heading by commas or newlines for potential styling, though in this design it's usually just a solid block
  const renderHeading = (text: string) => {
    if (text.includes("\\n")) {
      return text.split("\\n").map((line, i) => (
        <span key={i}>
          {line}
          <br />
        </span>
      ));
    }
    return text;
  };

  return (
    <section className="relative h-[100vh] min-h-[600px] w-full bg-ccg-black overflow-hidden flex items-center justify-center">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          {currentSlide.image?.node?.sourceUrl ? (
            <>
              <Image
                src={currentSlide.image.node.sourceUrl}
                alt={currentSlide.image.node.altText || "Hero slide"}
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
              />
              {/* Gradient overlay to ensure text readability like the reference image */}
              <div className="absolute inset-0 bg-black/30" />
            </>
          ) : (
            <div className="absolute inset-0 bg-ccg-charcoal flex items-center justify-center">
              <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-ccg-purple/20 rounded-full blur-[100px]" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Content ─────────────────────────────────────── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* Tag */}
            {currentSlide.tag && (
              <span className="text-white text-sm font-semibold tracking-wide mb-4 drop-shadow-md">
                {currentSlide.tag}
              </span>
            )}

            {/* Headline */}
            {currentSlide.heading && (
              <h1 className="font-sans font-bold text-6xl sm:text-7xl lg:text-[100px] text-white leading-[0.95] mb-6 tracking-[-0.03em] drop-shadow-lg max-w-5xl">
                {renderHeading(currentSlide.heading)}
              </h1>
            )}

            {/* Subheading */}
            {currentSlide.subheading && (
              <p className="text-white/90 text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-2xl drop-shadow-md">
                {currentSlide.subheading}
              </p>
            )}

            {/* CTA Button */}
            {currentSlide.buttonText && (
              <Link
                href={currentSlide.buttonLink || "/catalog"}
                className="inline-flex items-center justify-center
                           bg-white text-black font-semibold px-8 py-3.5 rounded-full
                           transition-transform duration-200 hover:scale-105 cursor-pointer text-sm
                           shadow-xl"
              >
                {currentSlide.buttonText}
              </Link>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Dots ────────────────────────────────────────── */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "bg-white w-2" : "bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
