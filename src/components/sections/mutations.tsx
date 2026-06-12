"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  GitBranch,
  Filter,
  ChevronDown,
  ChevronRight,
  Copy,
  Tag,
  FileJson,
  Code2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import mutation schemas and examples
import declareAllocationSchema from "@/schemas/mutations/declare_allocation_schema.json";
import declareAllocationExample from "@/schemas/mutations/declare_allocation_example.json";
import addItemSchema from "@/schemas/mutations/add_item_schema.json";
import addItemExample from "@/schemas/mutations/add_item_example.json";
import addItemOfferSchema from "@/schemas/mutations/add_item_offer_schema.json";
import addItemOfferExample from "@/schemas/mutations/add_item_offer_example.json";
import removeItemSchema from "@/schemas/mutations/remove_item_schema.json";
import removeItemExample from "@/schemas/mutations/remove_item_example.json";
import modifySkuSchema from "@/schemas/mutations/modify_sku_schema.json";
import modifySkuExample from "@/schemas/mutations/modify_sku_example.json";
import modifyItemAllocationsSchema from "@/schemas/mutations/modify_item_allocations_schema.json";
import modifyItemAllocationsExample from "@/schemas/mutations/modify_item_allocations_example.json";
import batchByFilterSchema from "@/schemas/mutations/batch_by_filter_schema.json";
import batchByFilterExample from "@/schemas/mutations/batch_by_filter_example.json";
import VcsDeltaCommitEnvelopeSchema from "@/schemas/vcs-delta-commit-envelope.json";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

interface Mutation {
  action: string;
  icon: React.ElementType;
  description: string;
  code: string;
  schema: string;
  color: string;
  details: string[];
}

const mutations: Mutation[] = [
  {
    action: "declare_allocation",
    icon: GitBranch,
    description: "Register or update a first-class allocation contract at the ledger level",
    color: "text-primary",
    schema: JSON.stringify(declareAllocationSchema, null, 2),
    code: JSON.stringify(declareAllocationExample, null, 2),
    details: [
      "Creates unique allocation_id at ledger level — declared once",
      "Three variants: assignment (who), payment (how much), fulfillment (where)",
      "Optional correlation_id groups related allocations (e.g., Alice's payment + Alice's delivery)",
      "Items reference it via flat array of allocation ID strings",
    ],
  },
  {
    action: "add_item",
    icon: Plus,
    description: "Append new item, modifier, or offer line-item to the transaction tree",
    color: "text-emerald-400",
    schema: JSON.stringify(addItemSchema, null, 2),
    code: JSON.stringify(addItemExample, null, 2),
    details: [
      "Creates immutable line_id — never conflicts on add",
      "Parent linking (parent_line_id) enables combo/modifier trees",
      "Allocations linked via flat array of IDs",
      "qty minimum enforced at 0.0001 — prevents zero-quantity ghosts",
    ],
  },
  {
    action: "add_item_offer",
    icon: Tag,
    description: "Add a discount or promotional offer as a line-item",
    color: "text-violet-400",
    schema: JSON.stringify(addItemOfferSchema, null, 2),
    code: JSON.stringify(addItemOfferExample, null, 2),
    details: [
      "Offers are standard line items, identified by promotional SKUs",
      "parent_line_id: null for global offers, linked for item-specific discounts",
      "qty minimum enforced at 0.0001",
      "Allocations can be linked to offers for specific payer discounts",
    ],
  },
  {
    action: "remove_item",
    icon: Trash2,
    description: "Remove or decrease quantity of an item; cascades children on full removal",
    color: "text-red-400",
    schema: JSON.stringify(removeItemSchema, null, 2),
    code: JSON.stringify(removeItemExample, null, 2),
    details: [
      "Quantity reduction — not destructive delete from ledger",
      "When projected qty ≤ 0, triggers cascading deletion rule",
      "All child modifiers/warranties auto-swept transitively",
      "Idempotent: two remove_item on same line = safe (clamped to ≥ 0)",
    ],
  },
  {
    action: "modify_sku",
    icon: Pencil,
    description: "Swap SKU of an item while preserving all other properties and linked allocations",
    color: "text-amber-accent",
    schema: JSON.stringify(modifySkuSchema, null, 2),
    code: JSON.stringify(modifySkuExample, null, 2),
    details: [
      "Only operation that 'updates' an existing item",
      "Keeps linked allocations intact (no payment reassignment needed)",
      "Valid only for same-category substitutions",
      "before_sku acts as conflict guard during merges",
    ],
  },
  {
    action: "modify_item_allocations",
    icon: GitBranch,
    description: "Replace linked allocation IDs on a line item (race-protected)",
    color: "text-violet-400",
    schema: JSON.stringify(modifyItemAllocationsSchema, null, 2),
    code: JSON.stringify(modifyItemAllocationsExample, null, 2),
    details: [
      "Race-protected via before_allocations comparison check",
      "Used for split-check reassignment, table transfers",
      "If before_allocations doesn't match current state → merge conflict",
    ],
  },
  {
    action: "batch_by_filter",
    icon: Filter,
    description: "Declarative batch mutation: engine resolves targets from filter + base_revision",
    color: "text-cyan-400",
    schema: JSON.stringify(batchByFilterSchema, null, 2),
    code: JSON.stringify(batchByFilterExample, null, 2),
    details: [
      "AI writes filter — engine resolves matching targets deterministically",
      "Four mutation types: modify_allocations, remove_items, modify_sku, duplicate_and_reallocate",
      "base_revision_id ensures deterministic targeting even under concurrent writes",
      "Eliminates manual target loops — zero database bloat",
    ],
  },
];

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

function MutationCard({
  mutation,
  index,
}: {
  mutation: Mutation;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = mutation.icon;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeUp}
      custom={index}
      className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden hover:border-primary/30 transition-colors duration-300"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 sm:p-5 flex items-start gap-4"
      >
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className={`w-5 h-5 ${mutation.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <code className="text-sm font-mono font-semibold text-foreground">
              {mutation.action}
            </code>
            <Badge
              variant="outline"
              className="text-[0.65rem] px-1.5 py-0 border-primary/20 text-primary/60"
            >
              schema
            </Badge>
            <Badge
              variant="outline"
              className="text-[0.65rem] px-1.5 py-0 border-amber-accent/20 text-amber-accent/60"
            >
              example
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {mutation.description}
          </p>
        </div>
        <div className="shrink-0 mt-1">
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 sm:px-5 pb-5">
            <Tabs defaultValue="schema" className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-4 bg-muted/30">
                <TabsTrigger
                  value="schema"
                  className="text-xs sm:text-sm gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <FileJson className="w-3.5 h-3.5" />
                  JSON Schema
                </TabsTrigger>
                <TabsTrigger
                  value="example"
                  className="text-xs sm:text-sm gap-1.5 data-[state=active]:bg-amber-accent/10 data-[state=active]:text-amber-accent"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  Example
                </TabsTrigger>
              </TabsList>

              <TabsContent value="schema" className="mt-0">
                <div className="code-block text-xs sm:text-sm relative group border-primary/20! bg-primary/3!">
                  <CopyButton text={mutation.schema} />
                  <pre className="whitespace-pre-wrap">
                    <code>{mutation.schema}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="example" className="mt-0">
                <div className="code-block text-xs sm:text-sm relative group border-amber-accent/20! bg-amber-accent/3!">
                  <CopyButton text={mutation.code} />
                  <pre className="whitespace-pre-wrap">
                    <code>{mutation.code}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-4 space-y-2">
              {mutation.details.map((detail, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 shrink-0" />
                  {detail}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

const envelopeSchema = JSON.stringify(VcsDeltaCommitEnvelopeSchema, null, 2);


export function MutationsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  return (
    <section id="mutations" ref={ref} className="py-24 sm:py-32 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />

      <div className="max-w-5xl mx-auto px-6">
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
            <Plus className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Part 2
            </span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            Core Mutation Catalog
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Six polymorphic delta operations that form the complete vocabulary for
            retail state changes. Each includes its formal{" "}
            <span className="text-primary">JSON Schema specification</span> and a
            practical{" "}
            <span className="text-amber-accent">usage example</span>.
          </motion.p>
        </motion.div>

        {/* Delta Commit Envelope Schema */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-10"
        >
          <motion.div variants={fadeUp} custom={3}>
            <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
              <button
                onClick={() => setEnvelopeOpen(!envelopeOpen)}
                className="w-full text-left p-4 sm:p-5 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileJson className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <code className="text-sm font-mono font-semibold">
                      VCSDeltaCommitEnvelope
                    </code>
                    <Badge
                      variant="outline"
                      className="text-[0.6rem] px-1.5 py-0 border-primary/20 text-primary/60"
                    >
                      JSON Schema
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The outer commit wrapper — each commit carries a parent_hash,
                    optional merge_parent_hashes, and an array of delta operations
                  </p>
                </div>
                {envelopeOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </button>

              {envelopeOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 sm:px-5 pb-5">
                    <div className="code-block text-xs sm:text-sm relative group border-primary/20! bg-primary/3!">
                      <CopyButton text={envelopeSchema} />
                      <pre className="whitespace-pre-wrap">
                        <code>{envelopeSchema}</code>
                      </pre>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                        <code>commit_hash</code> — cryptographic digest
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                        <code>parent_hash</code> — previous commit
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                        <code>branch</code> — target workspace
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                        <code>deltas[]</code> — polymorphic operations
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Mutation cards */}
        <div className="space-y-3">
          {mutations.map((mutation, i) => (
            <MutationCard
              key={mutation.action}
              mutation={mutation}
              index={i}
            />
          ))}
        </div>

        {/* POS semantics */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-12"
        >
          <motion.div variants={fadeUp} custom={8}>
            <div className="rounded-xl border border-amber-accent/20 bg-amber-accent/5 p-6">
              <h4 className="font-semibold text-amber-accent mb-3 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-amber-accent border-amber-accent/30"
                >
                  POS-Native
                </Badge>
                Write-Once Architecture
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Real POS terminals only add, remove, or (rarely) substitute. This
                natural write-once architecture means concurrent edits from
                multiple terminals{" "}
                <span className="text-amber-accent font-medium">
                  never conflict on the same line_id
                </span>
                . Two servers can independently add modifiers to the same burger
                without locking.
              </p>

              {/* POS Semantics Table */}
              <div className="rounded-lg overflow-hidden border border-amber-accent/15">
                <div className="grid grid-cols-3 text-[0.7rem] sm:text-xs font-semibold bg-amber-accent/10 border-b border-amber-accent/15">
                  <div className="p-2.5 text-amber-accent">POS Action</div>
                  <div className="p-2.5 text-amber-accent">VCS Delta</div>
                  <div className="p-2.5 text-amber-accent">Notes</div>
                </div>
                {[
                  {
                    pos: '"Press burger button"',
                    delta: "add_item(new line_id)",
                    note: "Creates unique immutable line",
                  },
                  {
                    pos: '"Add modifier (no onions)"',
                    delta: "add_item(parent=burger)",
                    note: "Linked via parent_line_id",
                  },
                  {
                    pos: '"Remove modifier"',
                    delta: "remove_item(modifier_id)",
                    note: "Parent burger untouched",
                  },
                  {
                    pos: '"Change qty 2 → 1"',
                    delta: "remove_item(qty=1)",
                    note: "Qty reduction via removal",
                  },
                  {
                    pos: '"Void item"',
                    delta: "remove_item(qty=current)",
                    note: "Cascades to all children",
                  },
                  {
                    pos: '"Substitute burger→chicken"',
                    delta: "modify_sku(before, after)",
                    note: "Only valid 'update' op",
                  },
                  {
                    pos: '"Split check (reassign payer)"',
                    delta: "modify_item_allocations",
                    note: "Payment reassigned, item intact",
                  },
                  {
                    pos: '"Move item to different table"',
                    delta: "modify_item_allocations",
                    note: "Fulfillment destination changed",
                  },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-3 text-[0.7rem] sm:text-xs border-b border-amber-accent/10 last:border-0"
                  >
                    <div className="p-2.5 text-muted-foreground font-mono">
                      {row.pos}
                    </div>
                    <div className="p-2.5 text-primary/70 font-mono">
                      {row.delta}
                    </div>
                    <div className="p-2.5 text-muted-foreground/70">
                      {row.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
