"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  GitMerge,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

interface ConflictCase {
  branchA: string;
  branchB: string;
  target: string;
  status: "conflict" | "clean" | "safe";
  resolution: string;
}

const conflictMatrix: ConflictCase[] = [
  {
    branchA: "add_item",
    branchB: "add_item",
    target: "No (different line_id)",
    status: "clean",
    resolution: "Both items appear in final projection",
  },
  {
    branchA: "add_item",
    branchB: "add_item",
    target: "Yes (same line_id)",
    status: "conflict",
    resolution: "Unique ID collision — assign new ID or throw",
  },
  {
    branchA: "remove_item",
    branchB: "modify_sku",
    target: "Yes (line_id)",
    status: "conflict",
    resolution: "Removed vs upgraded — operator resolution",
  },
  {
    branchA: "modify_sku",
    branchB: "modify_allocations",
    target: "Yes (line_id)",
    status: "clean",
    resolution: "Apply SKU upgrade + allocation edits",
  },
  {
    branchA: "modify_allocations",
    branchB: "modify_allocations",
    target: "Yes (line_id)",
    status: "conflict",
    resolution: "Both edited array — manual resolution",
  },
  {
    branchA: "remove_item",
    branchB: "remove_item",
    target: "Yes (line_id)",
    status: "safe",
    resolution: "Idempotent — qty clamped to ≥ 0",
  },
];

const statusConfig = {
  conflict: {
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    label: "Conflict",
  },
  clean: {
    icon: CheckCircle2,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    label: "Clean",
  },
  safe: {
    icon: CheckCircle2,
    color: "text-amber-accent",
    bg: "bg-amber-accent/10",
    border: "border-amber-accent/20",
    label: "Safe",
  },
};

export function MergeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="merge" ref={ref} className="py-24 sm:py-32 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />

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
            <GitMerge className="w-3.5 h-3.5 text-amber-accent" />
            <span className="text-xs font-medium text-amber-accent uppercase tracking-wider">
              Part 4
            </span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            Merge Semantics
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Simpler than text-based merging — all items use globally unique
            line_id values. Three-way merge with conflict detection and
            operator preview.
          </motion.p>
        </motion.div>

        {/* LCA Visualization */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-16"
        >
          <motion.div variants={fadeUp} custom={3}>
            <div className="rounded-xl border border-border/50 bg-card/30 p-6 sm:p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <GitMerge className="w-5 h-5 text-primary" />
                Lowest Common Ancestor (LCA) Discovery
              </h3>

              {/* Visual DAG */}
              <div className="flex flex-col items-center gap-2 mb-8 font-mono text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-violet-400/60" />
                  <span className="text-violet-400/80">C2</span>
                  <span className="text-muted-foreground/40 text-xs">
                    (what-if-bob-split)
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-px h-6 bg-violet-400/30" />
                  <div className="w-px h-6 bg-muted-foreground/20" />
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/40" />
                    <span className="text-muted-foreground/60">C1</span>
                    <span className="text-muted-foreground/30 text-xs">(main)</span>
                  </div>
                  <div className="w-6 h-px bg-muted-foreground/20" />
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/40" />
                    <span className="text-muted-foreground/60">C3</span>
                    <span className="text-muted-foreground/30 text-xs">(main)</span>
                  </div>
                </div>

                <div className="w-px h-6 bg-primary/40" />

                <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-primary font-semibold">C4: Merge</span>
                    <span className="text-muted-foreground/40 text-xs">(main)</span>
                  </div>
                  <div className="text-xs text-muted-foreground/60 mt-1">
                    parent: C3 | merge_parent: C2
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground/50 mb-1">
                    Step 1
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Trace ancestors of <code className="text-amber-accent">C3</code>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground/50 mb-1">
                    Step 2
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Trace ancestors of <code className="text-violet-400">C2</code>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground/50 mb-1">
                    Step 3
                  </div>
                  <div className="text-sm text-muted-foreground">
                    First intersect = <code className="text-primary">C_LCA</code>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Conflict Detection Matrix */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-16"
        >
          <motion.h3
            variants={fadeUp}
            custom={4}
            className="text-2xl font-bold text-center mb-8"
          >
            Conflict Detection Matrix
          </motion.h3>

          <motion.div variants={fadeUp} custom={5}>
            <div className="rounded-xl border border-border/50 overflow-hidden">
              {/* Header */}
              <div className="hidden sm:grid grid-cols-5 bg-muted/30 border-b border-border/50 text-xs font-semibold text-muted-foreground">
                <div className="p-3">Branch A (ΔM)</div>
                <div className="p-3">Branch B (ΔF)</div>
                <div className="p-3 text-center">Target</div>
                <div className="p-3 text-center">Status</div>
                <div className="p-3">Resolution</div>
              </div>

              {conflictMatrix.map((c, i) => {
                const config = statusConfig[c.status];
                const StatusIcon = config.icon;
                return (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    custom={6 + i}
                    className="border-b border-border/30 last:border-0"
                  >
                    {/* Desktop layout */}
                    <div className="hidden sm:grid grid-cols-5 items-center text-sm">
                      <div className="p-3 font-mono text-xs">{c.branchA}</div>
                      <div className="p-3 font-mono text-xs">{c.branchB}</div>
                      <div className="p-3 text-center text-xs text-muted-foreground">
                        {c.target}
                      </div>
                      <div className="p-3 flex justify-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color} border ${config.border}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </div>
                      <div className="p-3 text-xs text-muted-foreground">
                        {c.resolution}
                      </div>
                    </div>

                    {/* Mobile layout */}
                    <div className="sm:hidden p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <code className="text-xs font-mono">
                          {c.branchA} × {c.branchB}
                        </code>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {c.resolution}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Two-phase merge + formula */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Two-phase merge */}
          <motion.div variants={fadeUp} custom={13}>
            <div className="rounded-xl border border-amber-accent/20 bg-amber-accent/5 p-6 h-full">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-amber-accent" />
                <h3 className="text-lg font-bold text-amber-accent">
                  Two-Phase Merge
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  {
                    step: 1,
                    text: "Compute merged state (three-way merge)",
                  },
                  {
                    step: 2,
                    text: "Run validation connectors (inventory, budget, allergens)",
                  },
                  { step: 3, text: "Return preview with conflicts/issues" },
                  { step: 4, text: "Wait for operator confirmation" },
                ].map((s) => (
                  <div
                    key={s.step}
                    className="flex items-start gap-3 text-sm"
                  >
                    <div className="w-6 h-6 rounded-full bg-amber-accent/10 flex items-center justify-center shrink-0 text-xs font-bold text-amber-accent">
                      {s.step}
                    </div>
                    <span className="text-muted-foreground">{s.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Resolution formula */}
          <motion.div variants={fadeUp} custom={14}>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 h-full glow-emerald">
              <div className="flex items-center gap-2 mb-4">
                <GitMerge className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-primary">
                  Resolution Formula
                </h3>
              </div>
              <div className="code-block text-center text-base mb-4">
                S<sub>final</sub> = S<sub>LCA</sub> ⊕ Δ<sub>M</sub> ⊕ Δ
                <sub>F</sub> ⊕ Δ<sub>Resolution</sub>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div>
                  <span className="text-primary font-medium">S_LCA</span> — State at
                  Lowest Common Ancestor
                </div>
                <div>
                  <span className="text-primary font-medium">Δ_M, Δ_F</span> — Applied
                  commutatively (disjoint, clean)
                </div>
                <div>
                  <span className="text-primary font-medium">Δ_Resolution</span> —
                  Override events in merge commit deltas
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
