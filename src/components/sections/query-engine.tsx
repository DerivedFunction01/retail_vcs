"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Filter,
  Tag,
  AlertTriangle,
  Clock,
  Zap,
  FileJson,
  Code2,
  Copy,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import VcsRetailUniversalQueryEnvelopeSchema from "@/schemas/vcs-retail-universal-query-envelope.json";
import FilterRuleSchema from "@/schemas/filter-rule.json";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const viewModes = [
  { name: "item_level" },
  { name: "aggregate_by_payer" },
  { name: "kitchen_display_kds" },
  { name: "tax_surcharge_breakdown" },
  { name: "fulfillment_logistics_timeline" },
  { name: "catalog_listing_view" },
  { name: "recommendations_carousel" },
  { name: "inventory_depletion_report" },
];

const queryEnvelopeSchema = JSON.stringify(VcsRetailUniversalQueryEnvelopeSchema, null, 2);
const filterRuleSchema = JSON.stringify(FilterRuleSchema, null, 2);

const queryExample = `// AI: "Show me gluten-free desserts Bob didn't order"
{
  "target_context": {
    "context_type": "cart",
    "context_id": "table-12",
    "revision_id": "sha-latest"
  },
  "filter_delta": {
    "add_filters": [
      {
        "property": "sku_category",
        "operator": "equals",
        "value": "dessert"
      },
      {
        "property": "dietary_flags",
        "operator": "in_set",
        "value": ["gluten-free"]
      },
      {
        "property": "assignee",
        "operator": "not_equals",
        "value": "Bob"
      }
    ],
    "remove_filters": []
  },
  "view_mode": "catalog_listing_view",
  "order_constraints": {
    "budget_cap": null,
    "age_verification_required": false,
    "allow_backorder": false
  },
  "commit": true
}`;

function CopyButton({ text }: { text: string }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
      }}
      className="absolute top-2 right-2 p-1.5 rounded-md bg-border/50 hover:bg-border transition-colors opacity-0 group-hover:opacity-100"
    >
      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
    </button>
  );
}

export function QueryEngineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="query" ref={ref} className="py-24 sm:py-32 relative">
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
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/5 mb-4"
          >
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">
              Part 3
            </span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            Unified Query Engine
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            The same filter configuration divides active table checks, browses
            product menus, requests AI carousels, or runs warehouse alerts.
            Includes the formal{" "}
            <span className="text-cyan-400">Query Envelope</span> and{" "}
            <span className="text-primary">FilterRule</span> schemas.
          </motion.p>
        </motion.div>

        {/* Pipeline diagram */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-16"
        >
          <motion.div variants={fadeUp} custom={3}>
            <div className="rounded-xl border border-border/50 bg-card/30 p-6 sm:p-8 overflow-x-auto">
              <h3 className="text-lg font-bold mb-6">Filter-View Pipeline</h3>

              <div className="flex flex-col items-center gap-3 min-w-75">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0 w-full">
                  <div className="flex-1 rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-center">
                    <div className="text-xs text-cyan-400 font-semibold mb-0.5">
                      Input
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Target Context + Revision
                    </div>
                  </div>
                  <div className="hidden sm:block w-8 h-px bg-muted-foreground/20" />
                  <div className="sm:hidden w-px h-3 bg-muted-foreground/20" />
                  <div className="flex-1 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-center">
                    <div className="text-xs text-primary font-semibold mb-0.5">
                      Stage 1
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Load VCS Log
                    </div>
                  </div>
                  <div className="hidden sm:block w-8 h-px bg-muted-foreground/20" />
                  <div className="sm:hidden w-px h-3 bg-muted-foreground/20" />
                  <div className="flex-1 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-center">
                    <div className="text-xs text-primary font-semibold mb-0.5">
                      Stage 2
                    </div>
                    <div className="text-xs text-muted-foreground">
                      State Reducer
                    </div>
                  </div>
                </div>

                <div className="w-px h-4 bg-muted-foreground/20" />

                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0 w-full">
                  <div className="flex-1 rounded-lg border border-amber-accent/20 bg-amber-accent/5 px-4 py-3 text-center">
                    <div className="text-xs text-amber-accent font-semibold mb-0.5">
                      Stage 3
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Apply Filter Deltas
                    </div>
                  </div>
                  <div className="hidden sm:block w-8 h-px bg-muted-foreground/20" />
                  <div className="sm:hidden w-px h-3 bg-muted-foreground/20" />
                  <div className="flex-1 rounded-lg border border-amber-accent/20 bg-amber-accent/5 px-4 py-3 text-center">
                    <div className="text-xs text-amber-accent font-semibold mb-0.5">
                      Stage 4
                    </div>
                    <div className="text-xs text-muted-foreground">
                      View Projector
                    </div>
                  </div>
                  <div className="hidden sm:block w-8 h-px bg-muted-foreground/20" />
                  <div className="sm:hidden w-px h-3 bg-muted-foreground/20" />
                  <div className="flex-1 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-center glow-emerald">
                    <div className="text-xs text-primary font-semibold mb-0.5">
                      Output
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Rendered View
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Query Envelope Schema + Example */}
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
            Universal Query Envelope
          </motion.h3>
          <motion.div variants={fadeUp} custom={5}>
            <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
              <Tabs defaultValue="envelope-schema" className="w-full">
                <div className="p-4 sm:p-5 pb-0 flex items-center gap-3 flex-wrap">
                  <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center shrink-0">
                    <FileJson className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <code className="text-sm font-mono font-semibold">
                      VCSRetailUniversalQueryEnvelope
                    </code>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Unified read-only projection request
                    </p>
                  </div>
                </div>
                <div className="px-4 sm:px-5 pt-4">
                  <TabsList className="w-full grid grid-cols-3 bg-muted/30">
                    <TabsTrigger
                      value="envelope-schema"
                      className="text-xs sm:text-sm gap-1.5 data-[state=active]:bg-cyan-400/10 data-[state=active]:text-cyan-400"
                    >
                      <FileJson className="w-3.5 h-3.5" />
                      Envelope
                    </TabsTrigger>
                    <TabsTrigger
                      value="filter-schema"
                      className="text-xs sm:text-sm gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                    >
                      <Filter className="w-3.5 h-3.5" />
                      FilterRule
                    </TabsTrigger>
                    <TabsTrigger
                      value="query-example"
                      className="text-xs sm:text-sm gap-1.5 data-[state=active]:bg-amber-accent/10 data-[state=active]:text-amber-accent"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      Example
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="px-4 sm:px-5 pt-4 pb-5">
                  <TabsContent value="envelope-schema" className="mt-0">
                    <div className="code-block text-xs sm:text-sm relative group border-cyan-400/20! bg-cyan-400/3!">
                      <CopyButton text={queryEnvelopeSchema} />
                      <pre className="whitespace-pre-wrap">
                        <code>{queryEnvelopeSchema}</code>
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="filter-schema" className="mt-0">
                    <div className="code-block text-xs sm:text-sm relative group border-primary/20! bg-primary/3!">
                      <CopyButton text={filterRuleSchema} />
                      <pre className="whitespace-pre-wrap">
                        <code>{filterRuleSchema}</code>
                      </pre>
                    </div>
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <div className="text-xs text-muted-foreground/60 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                        <code>property</code> — 13 filterable fields
                      </div>
                      <div className="text-xs text-muted-foreground/60 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                        <code>operator</code> — 10 comparison ops
                      </div>
                      <div className="text-xs text-muted-foreground/60 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                        <code>value</code> — string, number, or array
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="query-example" className="mt-0">
                    <div className="code-block text-xs sm:text-sm relative group border-amber-accent/20! bg-amber-accent/3!">
                      <CopyButton text={queryExample} />
                      <pre className="whitespace-pre-wrap">
                        <code>{queryExample}</code>
                      </pre>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </motion.div>
        </motion.div>

        {/* View modes grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-16"
        >
          <motion.h3
            variants={fadeUp}
            custom={6}
            className="text-2xl font-bold text-center mb-8"
          >
            Eight View Modes
          </motion.h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {viewModes.map((mode, i) => (
              <motion.div
                key={mode.name}
                variants={fadeUp}
                custom={7 + i}
                className="rounded-lg border border-border/50 bg-card/30 p-4 text-center hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
              >
                <code className="text-xs font-mono text-primary">
                  {mode.name}
                </code>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Discount primitives + Cascading deletion in a 2-col */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Discount primitives */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div variants={fadeUp} custom={16}>
              <div className="rounded-xl border border-violet-400/20 bg-violet-400/5 p-6 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-violet-400" />
                  <h3 className="text-lg font-bold text-violet-400">
                    Discount & Offer Primitives
                  </h3>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-violet-400/50 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-foreground/80">
                        Time-Independent
                      </div>
                      <div className="text-xs">
                        Apply coupons to empty carts — order of entries has zero
                        bearing on outcome
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-violet-400/50 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-foreground/80">
                        Render-Last Projection
                      </div>
                      <div className="text-xs">
                        Promos collected and evaluated after full state
                        reduction
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Filter className="w-4 h-4 text-violet-400/50 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-foreground/80">
                        Scoped via Line Linkage
                      </div>
                      <div className="text-xs">
                        parent_line_id = null → global; non-null → item-specific
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Cascading deletion */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div variants={fadeUp} custom={17}>
              <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-6 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <h3 className="text-lg font-bold text-red-400">
                    Cascading Deletion
                  </h3>
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  Remove a parent → all children auto-swept. Orphaned items
                  (warranty for non-existent laptop) are{" "}
                  <span className="text-red-400 font-medium">
                    mechanically impossible
                  </span>
                  .
                </div>
                <div className="code-block text-xs">
                  <span className="text-red-400">
                    [Laptop Base Frame] (REMOVED)
                  </span>
                  <br />
                  {"  "}├──► [RTX GPU]{" "}
                  <span className="text-red-400/60">(CASCADED)</span>
                  <br />
                  {"  "}│{"    "}└──► [RTX Warranty]{" "}
                  <span className="text-red-400/60">(CASCADED)</span>
                  <br />
                  {"  "}├──► [Ryzen 9 CPU]{" "}
                  <span className="text-red-400/60">(CASCADED)</span>
                  <br />
                  {"  "}└──► [System Warranty]{" "}
                  <span className="text-red-400/60">(CASCADED)</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
