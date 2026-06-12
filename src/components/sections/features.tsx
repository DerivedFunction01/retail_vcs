"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Zap,
  Lock,
  Users,
  GitCommitHorizontal,
  Brain,
  Layers,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const stats = [
  { label: "Delta Operations", value: "6", icon: Zap, suffix: "core" },
  {
    label: "Branch Types",
    value: "3",
    icon: GitCommitHorizontal,
    suffix: "semantic",
  },
  {
    label: "View Modes",
    value: "8",
    icon: Layers,
    suffix: "outputs",
  },
  {
    label: "Conflict Policies",
    value: "4",
    icon: Lock,
    suffix: "resolution",
  },
];

const keyFeatures = [
  {
    title: "Lock-Free Concurrency",
    description:
      "Write-once architecture with immutable line_ids. Multiple terminals add items simultaneously without locking or coordination overhead.",
    icon: Zap,
    color: "text-primary",
  },
  {
    title: "AI-Agent Native",
    description:
      "Agents operate completely statelessly, writing lightweight filter envelopes. Zero context bloat, zero token waste, zero math errors.",
    icon: Brain,
    color: "text-amber-accent",
  },
  {
    title: "Massive Parallelization",
    description:
      "50 employees ordering simultaneously on separate branches, merging to a single bill with automated inventory validation.",
    icon: Users,
    color: "text-violet-400",
  },
  {
    title: "Instant What-If",
    description:
      "Branch, mutate, preview, discard — all in seconds. No mock databases, no draft cloning, no cleanup needed.",
    icon: GitCommitHorizontal,
    color: "text-cyan-400",
  },
];

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" ref={ref} className="py-24 sm:py-32 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

      {/* Background glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-primary/3 blur-[200px] -translate-y-1/2" />
      <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-amber-accent/3 blur-[180px]" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Stats */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-20"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                custom={i}
                className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 text-center"
              >
                <Icon className="w-5 h-5 text-primary/50 mx-auto mb-3" />
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-muted-foreground/50 mt-0.5">
                  {stat.suffix}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Section header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div
            variants={fadeUp}
            custom={4}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-4"
          >
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Core Benefits
            </span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={5}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            Why VCS-Retail?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={6}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Four pillars that fundamentally change how commerce systems operate.
          </motion.p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-6 mb-16"
        >
          {keyFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                custom={7 + i}
                className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 sm:p-8 hover:border-primary/20 transition-colors duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={11}
          className="text-center"
        >
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 sm:p-12 glow-emerald max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-3">
              Ready to Rethink Commerce?
            </h3>
            <p className="text-muted-foreground mb-6">
              The Retail VCS Specification provides the complete blueprint for
              building version-controlled, event-sourced retail systems that
              eliminate middleware overhead and unlock AI-agent capabilities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                onClick={() =>
                  document
                    .getElementById("hero")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Back to Top
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/30 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GitCommitHorizontal className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">
              Retail VCS Specification
            </span>
            <span className="text-muted-foreground/50">v2.1.0-PRO</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground/50">
            <span>Event-Sourced Commerce Architecture</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Version-Controlled Transactions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
