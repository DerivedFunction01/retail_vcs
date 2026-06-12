"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  GitBranch,
  ArrowRight,
  ChevronDown,
  Zap,
  Shield,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background layers */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-40" />
        {/* Radial glow following mouse */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: `radial-gradient(ellipse 600px 600px at ${mousePos.x}% ${mousePos.y}%, oklch(0.7 0.17 163 / 8%), transparent)`,
          }}
        />
        {/* Static glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-accent/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-accent/5 blur-[100px]" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
      >
        {/* Version badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary pulse-emerald" />
          <span className="text-sm font-medium text-primary">
            Specification v2.1.0-PRO
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          <span className="gradient-text">Retail VCS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4 font-light"
        >
          A Unified, Event-Sourced Architecture for Commerce
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-base sm:text-lg text-muted-foreground/70 max-w-2xl mx-auto mb-12"
        >
          Treat retail transactional states as a DAG of append-only deltas.
          Eliminate legacy middleware. Solve multi-channel sync. Optimize
          AI-agent runtimes.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {[
            { icon: GitBranch, label: "Git-Style Merging" },
            { icon: Zap, label: "Lock-Free Concurrency" },
            { icon: Shield, label: "AI-Agent Native" },
            { icon: Cpu, label: "Local-First Engine" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 bg-card/50 text-sm text-muted-foreground backdrop-blur-sm"
            >
              <item.icon className="w-4 h-4 text-primary" />
              {item.label}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 glow-emerald"
            onClick={() =>
              document
                .getElementById("architecture")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore Architecture
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-border/50 hover:bg-card px-8"
            onClick={() =>
              document
                .getElementById("mutations")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            View Mutation Catalog
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
