"use client";

import { motion } from "framer-motion";

export default function QuoteSection() {
  return (
    <section className="py-20 bg-white border-t border-ccg-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Stats row — like Fynode's "1.5k customers / 300k sales" */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-12 mb-16 py-8 border-b border-ccg-border">
          {[
            { value: "1.5k", label: "Happy Customers" },
            { value: "300k", label: "Total Sales per Month" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-russo text-4xl md:text-5xl text-ccg-black">
                {stat.value}
                <span className="text-ccg-purple">+</span>
              </p>
              <p className="text-ccg-muted text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="relative">
          <div className="font-russo text-[100px] leading-none text-ccg-purple/10 select-none -mb-10">
            "
          </div>
          <motion.blockquote
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="font-russo text-2xl md:text-3xl text-ccg-black italic leading-snug">
              "Every keystroke tells a story. Make yours legendary."
            </p>
            <footer className="mt-6 text-ccg-purple font-semibold text-sm tracking-[0.2em] uppercase">
              — CyberCore Gear
            </footer>
          </motion.blockquote>
        </div>
      </div>
    </section>
  );
}
