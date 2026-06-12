"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  GitBranch,
  GitCommitHorizontal,
  FlaskConical,
  ArrowRightLeft,
  Landmark,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

interface BranchType {
  name: string;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  bgColor: string;
  description: string;
  behaviors: string[];
  example: string;
}

const branchTypes: BranchType[] = [
  {
    name: "Hypothetical",
    icon: FlaskConical,
    color: "text-violet-400",
    borderColor: "border-violet-400/20",
    bgColor: "bg-violet-400/5",
    description: "Throwaway branches for exploring scenarios",
    behaviors: [
      "Never merged — typically discarded",
      "Does NOT reserve inventory",
      "Does NOT create financial liabilities",
    ],
    example: "main → split-check-whatif",
  },
  {
    name: "Parallel",
    icon: GitBranch,
    color: "text-primary",
    borderColor: "border-primary/20",
    bgColor: "bg-primary/5",
    description: "Concurrent inputs from terminals and agents",
    behaviors: [
      "Long-lived (duration of checkout session)",
      "Reserves inventory to prevent overbooking",
      "Visually isolated between terminals",
      "Merges to main via three-way merge",
    ],
    example: "main → terminal-01-order-session",
  },
  {
    name: "Settlement",
    icon: Landmark,
    color: "text-amber-accent",
    borderColor: "border-amber-accent/20",
    bgColor: "bg-amber-accent/5",
    description: "Payment confirmed — immutable audit trail",
    behaviors: [
      "Created when payment is confirmed",
      "Merged into main immediately",
      "Triggers actual inventory decrements",
      "Fires CRM updates and fulfillment events",
    ],
    example: "main → order-12345-settled",
  },
];

const inventoryLayers = [
  {
    layer: 1,
    name: "Physical Inventory",
    description: "Immutable source of truth",
    detail: "Only changes on main when a settled order is merged",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/25",
  },
  {
    layer: 2,
    name: "Speculative Inventory",
    description: "Branch-aware projections",
    detail: "Calculated by replaying branch deltas against physical inventory",
    color: "text-amber-accent",
    bgColor: "bg-amber-accent/10",
    borderColor: "border-amber-accent/25",
  },
  {
    layer: 3,
    name: "Conflict Inventory",
    description: "Merge-time validation",
    detail: "Validates combined reservations don't exceed physical inventory",
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/25",
  },
];

export function BranchesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="branches" ref={ref} className="py-24 sm:py-32 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Background accent */}
      <div className="absolute top-1/3 right-0 w-72 h-72 rounded-full bg-primary/3 blur-[150px]" />

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
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-4"
          >
            <GitBranch className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Part 5
            </span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            Branch Architecture
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Three distinct branch types with different connector and inventory
            behaviors enable massive parallelization.
          </motion.p>
        </motion.div>

        {/* Branch type cards */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-6 mb-20"
        >
          {branchTypes.map((branch, i) => {
            const Icon = branch.icon;
            return (
              <motion.div
                key={branch.name}
                variants={fadeUp}
                custom={3 + i}
                className={`rounded-xl border ${branch.borderColor} ${branch.bgColor} p-6 flex flex-col`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-lg ${branch.bgColor} flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 ${branch.color}`} />
                  </div>
                  <h3 className={`text-lg font-bold ${branch.color}`}>
                    {branch.name}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {branch.description}
                </p>
                <div className="space-y-2 mb-4 flex-1">
                  {branch.behaviors.map((b, j) => (
                    <div
                      key={j}
                      className="flex items-start gap-2 text-xs text-muted-foreground/80"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${branch.color.replace("text-", "bg-")} mt-1.5 flex-shrink-0 opacity-50`}
                      />
                      {b}
                    </div>
                  ))}
                </div>
                <div className="code-block text-xs !py-2 !px-3 !text-[0.75rem]">
                  {branch.example}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Branch naming convention */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-20"
        >
          <motion.div variants={fadeUp} custom={7}>
            <div className="rounded-xl border border-border/50 bg-card/30 p-6">
              <h3 className="text-xl font-bold mb-4">Hierarchical Naming</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Branches follow a hierarchical naming convention to support
                complex organizational structures:
              </p>
              <div className="code-block text-sm">
                <span className="comment">
                  {"// Format: {context_id}/{entity_type}/{entity_id}"}
                </span>
                <br />
                <br />
                <span className="keyword">corp-lunch-2024</span>
                /<span className="property">employee</span>/
                <span className="string">bob</span>
                <br />
                <span className="keyword">table-12</span>/
                <span className="property">server</span>/
                <span className="string">alice</span>
                <br />
                <span className="keyword">store-main-2024</span>/
                <span className="property">register</span>/
                <span className="number">01</span>
                <br />
                <span className="keyword">event-500-person</span>/
                <span className="property">table</span>/
                <span className="string">alpha</span>/
                <span className="property">server</span>/
                <span className="string">alice</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Three-layer inventory */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h3
            variants={fadeUp}
            custom={8}
            className="text-2xl font-bold text-center mb-8"
          >
            Three-Layer Inventory Model
          </motion.h3>

          <div className="relative max-w-3xl mx-auto">
            {inventoryLayers.map((layer, i) => (
              <motion.div
                key={layer.name}
                variants={fadeUp}
                custom={9 + i}
                className={`relative rounded-xl border ${layer.borderColor} ${layer.bgColor} p-6 mb-4 last:mb-0`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full ${layer.bgColor} flex items-center justify-center flex-shrink-0`}
                  >
                    <span className={`text-lg font-bold ${layer.color}`}>
                      {layer.layer}
                    </span>
                  </div>
                  <div>
                    <h4 className={`font-semibold ${layer.color}`}>
                      {layer.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {layer.description}
                    </p>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      {layer.detail}
                    </p>
                  </div>
                </div>
                {i < inventoryLayers.length - 1 && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10">
                    <ArrowRightLeft className="w-5 h-5 text-muted-foreground/30 rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
