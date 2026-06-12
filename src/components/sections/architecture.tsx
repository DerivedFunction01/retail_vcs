"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Layers,
  Server,
  GitMerge,
  ArrowDown,
  X,
  Check,
  Cpu,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const comparisonFeatures = [
  {
    dimension: "State Storage",
    traditional: "Overwritten JSON documents in centralized database",
    vcs: "Append-only cryptographic delta commit logs",
  },
  {
    dimension: "Split-Billing",
    traditional: "Complex volatile frontend memory + custom tables",
    vcs: "First-class declare_allocation contracts via ID strings",
  },
  {
    dimension: "Multi-Device Sync",
    traditional: "Slow, brittle — relies on central locking",
    vcs: "Auto-reconciled via Git-style merge over stable IDs",
  },
  {
    dimension: "AI Integration",
    traditional: "Massive — requires full cart context + mock APIs",
    vcs: "Negligible — agent writes lightweight filter envelopes",
  },
  {
    dimension: "What-If Simulations",
    traditional: "Requires cloning draft orders / mock entities",
    vcs: "Instant — branch, mutate, preview, discard",
  },
  {
    dimension: "Concurrency Model",
    traditional: "Central database locking (pessimistic)",
    vcs: "Lock-free DAG with optimistic parallel writes",
  },
];

export function ArchitectureSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="architecture" ref={ref} className="py-24 sm:py-32 relative">
      {/* Background accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-accent/20 bg-amber-accent/5 mb-4"
          >
            <Layers className="w-3.5 h-3.5 text-amber-accent" />
            <span className="text-xs font-medium text-amber-accent uppercase tracking-wider">
              Part 1
            </span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            Architectural Vision
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Traditional e-commerce backends are engineered around the{" "}
            <span className="text-amber-accent">Snapshot State Pattern</span>.
            We replace it with a{" "}
            <span className="text-primary">
              version-controlled, event-sourced DAG
            </span>
            .
          </motion.p>
        </motion.div>

        {/* Architecture comparison diagram */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-20"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Monolithic stack */}
            <motion.div variants={fadeUp} custom={3}>
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <Server className="w-5 h-5 text-destructive" />
                  <h3 className="text-lg font-semibold text-destructive">
                    Monolithic Stack
                  </h3>
                </div>
                <div className="space-y-2">
                  {[
                    "Multi-Channel Sync Engine",
                    "Draft Order State Database",
                    "Conversational Session Memory",
                    "Dynamic Tax-Calculator API",
                  ].map((item, i) => (
                    <div
                      key={item}
                      className="px-4 py-2.5 rounded-lg bg-destructive/10 border border-destructive/15 text-sm text-destructive/80 font-mono"
                    >
                      {item}
                    </div>
                  ))}
                  <div className="flex justify-center py-2">
                    <ArrowDown className="w-4 h-4 text-destructive/50" />
                  </div>
                  <div className="px-4 py-2.5 rounded-lg bg-destructive/15 border border-destructive/20 text-sm text-destructive/90 font-mono">
                    Centralized Payment / Checkout
                  </div>
                </div>
                <div className="mt-4 text-xs text-destructive/50">
                  Heavy orchestration, concurrency risks, AI integration
                  bottlenecks
                </div>
              </div>
            </motion.div>

            {/* VCS stack */}
            <motion.div variants={fadeUp} custom={4}>
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 h-full glow-emerald">
                <div className="flex items-center gap-2 mb-4">
                  <GitMerge className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-primary">
                    VCS Local-First Stack
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="px-4 py-4 rounded-lg bg-primary/10 border border-primary/20 text-sm">
                    <div className="text-primary font-semibold mb-2">
                      Local VCS Client Engine (Isomorphic)
                    </div>
                    <div className="space-y-1.5 text-primary/70 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-primary" />
                        Reconciles state via Git Merges
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-primary" />
                        Evaluates splits via Allocations
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-primary" />
                        Resolves queries locally (zero latency)
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center py-2">
                    <ArrowDown className="w-4 h-4 text-primary/50" />
                  </div>
                  <div className="px-4 py-2.5 rounded-lg bg-primary/15 border border-primary/25 text-sm text-primary font-mono">
                    Definitive Settlement Ledger (Push)
                  </div>
                </div>
                <div className="mt-4 text-xs text-primary/50">
                  Zero middleware, local-first, AI-agent optimized
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* AI Agent paradigm */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-20"
        >
          <motion.div variants={fadeUp} custom={5}>
            <div className="rounded-xl border border-amber-accent/20 bg-card/50 backdrop-blur-sm p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-accent/10 flex items-center justify-center shrink-0">
                  <Cpu className="w-6 h-6 text-amber-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    AI Agent &quot;Query-by-Intent&quot; Paradigm
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Under VCS-Retail, the AI agent acts as a{" "}
                    <span className="text-amber-accent font-medium">
                      pure declarative query compiler
                    </span>
                    . It never holds or computes active state. Instead, it
                    translates natural language intents into lightweight,
                    versioned filter envelopes.
                  </p>
                  <div className="code-block text-sm">
                    <span className="comment">
                      {"// AI translates this intent..."}
                    </span>
                    <br />
                    <span className="string">
                      &quot;Show me gluten-free desserts Bob didn&apos;t order&quot;
                    </span>
                    <br />
                    <span className="comment">
                      {"// ...into a declarative filter envelope:"}
                    </span>
                    <br />
                    {"{"}
                    <br />
                    &nbsp;&nbsp;
                    <span className="property">"filter_delta"</span>: {"{"}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <span className="property">"add_filters"</span>: [
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"{"}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span className="property">"property"</span>:{" "}
                    <span className="string">"dietary_flags"</span>,
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span className="property">"operator"</span>:{" "}
                    <span className="string">"in_set"</span>,
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span className="property">"value"</span>: [
                    <span className="string">"gluten-free"</span>]
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"}"}
                    <br />
                    &nbsp;&nbsp;{"}"}
                    <br />
                    {"}"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Comparison table */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h3
            variants={fadeUp}
            custom={6}
            className="text-2xl font-bold text-center mb-8"
          >
            Strategic Comparison
          </motion.h3>
          <motion.div variants={fadeUp} custom={7}>
            <div className="rounded-xl border border-border/50 overflow-hidden">
              <div className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[1.5fr_1fr_1fr] bg-muted/30 border-b border-border/50">
                <div className="p-4 text-sm font-semibold text-muted-foreground">
                  Dimension
                </div>
                <div className="p-4 text-sm font-semibold text-destructive text-center">
                  Traditional
                </div>
                <div className="p-4 text-sm font-semibold text-primary text-center">
                  VCS-Retail
                </div>
              </div>
              {comparisonFeatures.map((feature, i) => (
                <motion.div
                  key={feature.dimension}
                  variants={fadeUp}
                  custom={8 + i}
                  className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[1.5fr_1fr_1fr] border-b border-border/30 last:border-0"
                >
                  <div className="p-4 text-sm font-medium">
                    {feature.dimension}
                  </div>
                  <div className="p-4 text-xs sm:text-sm text-muted-foreground/60 flex items-start gap-1.5">
                    <X className="w-3.5 h-3.5 text-destructive/50 shrink-0 mt-0.5" />
                    {feature.traditional}
                  </div>
                  <div className="p-4 text-xs sm:text-sm text-primary/80 flex items-start gap-1.5">
                    <Check
                      className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5"
                      strokeWidth={3}
                    />
                    {feature.vcs}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
