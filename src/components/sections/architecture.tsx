"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Layers,
  Server,
  GitMerge,
  ArrowDown,
  X,
  Check,
  Cpu,
  ArrowRight,
  ChevronRight,
  Terminal,
  Database,
  ArrowRightLeft,
  Activity,
  Globe,
  Settings,
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

const lifecyclePhases = [
  {
    phase: 1,
    command: "git init",
    title: "Cart Initialization",
    desc: "When a customer sits at Table 12, or opens a web app, the VCS Engine initializes a new local repository.",
    subTitle: "The 'Initial Config File'",
    code: `{
  "context_type": "cart",
  "context_id": "table-12",
  "created_at": "2026-06-12T12:00:00Z",
  "head": null
}`,
    consoleOutput:
      "Initialized empty Git-Retail repository in IndexedDB://table-12/\nCreated configuration block for target_context.",
  },
  {
    phase: 2,
    command: "git fetch origin",
    title: "Hydrating the Catalog",
    desc: "The VCS Engine requests the latest active product catalog from the Business API. This is stored locally in the engine's cache so the POS UI can render buttons and AI agents can query the menu without network latency.",
    subTitle: "Syncing Local Catalog Cache",
    code: `GET /api/v1/catalog/latest
Headers: { "If-None-Match": "W/\\"c3a598fd2\\"" }
Response: 304 Not Modified
=> Using cached menu: 42 active items (checksum: c3a598fd2)`,
    consoleOutput:
      "Fetching origin catalog...\nFrom origin:business-api\n * branch            main       -> FETCH_HEAD\nCatalog local cache matches origin. Fast-path enabled.",
  },
  {
    phase: 3,
    command: "git commit",
    title: "Building the Order",
    desc: "The user taps 'Add Burger', or the AI agent compiles a batch_duplicate_and_reallocate rule. The POS UI passes a VCSDeltaCommitEnvelope to the VCS Engine. The VCS Engine appends it to the local log, updates the head, runs the Reducer, and pushes the new subtotal to the POS UI offline.",
    subTitle: "VCS Delta Envelope",
    code: `{
  "commit_id": "sha256-a9f8e4...",
  "parent_id": "sha256-000000...",
  "delta": {
    "action": "ADD_ITEM",
    "item_id": "burger-01",
    "quantity": 1,
    "allocation_id": "alice"
  }
}`,
    consoleOutput:
      "[main a9f8e4] Add Burger (alloc: alice)\n 1 file changed, 1 insertion(+)\nReducer recalculation: Subtotal=$12.50 Tax=$1.00 Total=$13.50 (0ms delay)",
  },
  {
    phase: 4,
    command: "git branch & git merge",
    title: "Split Checks & 'What-If'",
    desc: "Alice wants to see what her half of the bill looks like if she pays for the drinks. The VCS Engine branches to 'what-if-alice'. Allocations are modified and rendered. If accepted, the Engine merges back to main running the 3-way conflict matrix locally.",
    subTitle: "Branching State Projection",
    code: `git checkout -b what-if-alice
# Mutate allocations for drinks
git commit -m "Reallocate drinks to Alice"
git checkout main
git merge what-if-alice --no-ff`,
    consoleOutput:
      "Switched to a new branch 'what-if-alice'\nCommit [what-if-alice d3e5c9] Reallocated item_id:drink-02 to Alice\nSwitched to branch 'main'\nUpdating a9f8e4..d3e5c9\nFast-forward merge. 3-way reconciliation complete. 0 conflicts.",
  },
  {
    phase: 5,
    command: "git push origin main",
    title: "Settle & Sync",
    desc: "The transaction is complete, and payment has been authorized locally (via EMV terminal). The VCS Engine takes the local array of commits and pushes them to the Business API. The Business API verifies the cryptographic hashes and saves it to the master database.",
    subTitle: "Push Sync Envelope",
    code: `POST /api/v1/sync/push
Payload: {
  "repository_id": "table-12",
  "commits": [
    { "id": "sha256-a9f8e4...", ... },
    { "id": "sha256-d3e5c9...", ... }
  ],
  "authorization": "EMV_AUTH_SUCCESS_7781b"
}`,
    consoleOutput:
      "Pushing to origin:business-api\nCounting objects: 3, done.\nDelta compression using up to 8 threads.\nWriting objects: 100% (3/3), done.\nTo https://api.vcs-retail.com/repo/table-12\n * [new branch]      main -> main\nPush accepted by Origin Master Ledger.",
  },
  {
    phase: 6,
    command: "Webhook Triggers",
    title: "Backend Side-Effects",
    desc: "Once the Business API accepts the push, it triggers asynchronous connectors. The Inventory Connector sees the 'Burger' commit and deducts buns and beef from the warehouse database. The Kitchen Connector prints a routing ticket to the kitchen display.",
    subTitle: "Asynchronous Connectors",
    code: `{
  "event": "transaction.committed",
  "data": {
    "repository_id": "table-12",
    "final_state": { "total": 24.50 },
    "triggered_connectors": ["inventory", "kitchen_routing"]
  }
}`,
    consoleOutput:
      "Webhook triggered: inventory-service -> Deducted 1x [bun-sesame], 1x [beef-patty-150g] from Warehouse B.\nWebhook triggered: kitchen-routing-service -> Routed ticket #412 to Grill Station.",
  },
];

const storageBoundaries = [
  {
    type: "Transaction Commits (Deltas)",
    location: "Local VCS Engine (IndexedDB) & Remote Master Ledger",
    sync: "Bidirectional (Push/Pull)",
    highlight: true,
  },
  {
    type: "Active Cart State (Projected)",
    location: "RAM (In-Memory only)",
    sync: "Never Stored. Computed on the fly.",
    highlight: false,
  },
  {
    type: "Product Catalog (Menu)",
    location: "Remote SQL DB & Local VCS Cache",
    sync: "One-way (Pull from Remote to Local)",
    highlight: false,
  },
  {
    type: "Physical Inventory (Warehouse)",
    location: "Remote SQL DB only",
    sync: "Accessed asynchronously via Backend APIs",
    highlight: false,
  },
  {
    type: "Customer Profiles (CRM)",
    location: "Remote SQL DB only",
    sync: "Looked up via API when linking allocation_id",
    highlight: false,
  },
];

export function ArchitectureSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activePhase, setActivePhase] = useState(0);

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
              Architecture & Lifecycle
            </span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            VCS System Topology & Transaction Lifecycle
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Traditional e-commerce backends are engineered around centralized
            snapshots. We replace them with an{" "}
            <span className="text-primary font-medium">
              offline-first, three-tier Git-style architecture
            </span>
            .
          </motion.p>
        </motion.div>

        {/* 1. The Three-Tier Architecture Visualizer */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-24"
        >
          <motion.h3
            variants={fadeUp}
            custom={3}
            className="text-xl sm:text-2xl font-bold mb-8 text-center sm:text-left flex items-center gap-2"
          >
            <Activity className="w-5 h-5 text-primary" />
            1. The Three-Tier Architecture
          </motion.h3>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch relative">
            {/* Tier 1 Card */}
            <motion.div
              variants={fadeUp}
              custom={4}
              className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-xs p-6 flex flex-col justify-between hover:border-primary/20 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">
                    Tier 1
                  </span>
                  <div className="px-2 py-0.5 rounded-sm bg-primary/10 text-primary text-[10px] font-mono">
                    Presentational
                  </div>
                </div>
                <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  Presentation UI (POS App)
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  A purely reactive view that observes state changes from the
                  VCS Engine. ZERO business logic is kept here.
                </p>
                <ul className="space-y-2 text-xs text-muted-foreground/80 font-mono">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    Pure React/Vue components
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    Zero raw calculations (prices/taxes)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    Renders Reducer State directly
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    AI Agent Chat natural language input
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-border/30 text-center text-xs text-muted-foreground/50">
                Dispatches commit envelopes to Tier 2
              </div>
            </motion.div>

            {/* Connection Arrow 1 */}
            <div className="hidden lg:flex flex-col justify-center items-center -mx-4 z-10">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-[11px] font-mono font-medium shadow-md">
                <span className="text-primary font-bold">Read / Write</span>
              </div>
              <div className="w-8 h-px bg-linear-to-r from-primary to-amber-accent mt-2" />
            </div>

            {/* Tier 2 Card */}
            <motion.div
              variants={fadeUp}
              custom={5}
              className="rounded-xl border border-primary/30 bg-primary/5 p-6 flex flex-col justify-between hover:border-primary/50 transition-all duration-300 shadow-md shadow-primary/5"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-amber-accent/70 uppercase tracking-widest">
                    Tier 2
                  </span>
                  <div className="px-2 py-0.5 rounded-sm bg-amber-accent/10 text-amber-accent text-[10px] font-mono">
                    Isomorphic
                  </div>
                </div>
                <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  Local VCS Engine
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  An isomorphic library running locally in the browser or
                  terminal. Holds the local repository transaction log.
                </p>
                <ul className="space-y-2 text-xs text-muted-foreground/80 font-mono">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    Runs in browser context / sandbox
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    IndexedDB / SQLite offline storage
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    State Reduction: S_t = S_0 ⊕ ∑ Δ
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    Sparse product catalog cache
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-border/30 text-center text-xs text-primary/70">
                Offline-First Merging & Reductions
              </div>
            </motion.div>

            {/* Connection Arrow 2 */}
            <div className="hidden lg:flex flex-col justify-center items-center -mx-4 z-10">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-[11px] font-mono font-medium shadow-md">
                <span className="text-amber-accent font-bold">
                  Sync / Push / Pull
                </span>
              </div>
              <div className="w-8 h-px bg-linear-to-r from-amber-accent to-destructive mt-2" />
            </div>

            {/* Tier 3 Card */}
            <motion.div
              variants={fadeUp}
              custom={6}
              className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-xs p-6 flex flex-col justify-between hover:border-destructive/20 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-destructive/70 uppercase tracking-widest">
                    Tier 3
                  </span>
                  <div className="px-2 py-0.5 rounded-sm bg-destructive/10 text-destructive text-[10px] font-mono">
                    Central
                  </div>
                </div>
                <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Server className="w-4 h-4 text-destructive" />
                  Remote Gateway (Business API)
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  The central source of truth. Manages global catalog sync,
                  inventory deducts, settlements, and webhooks.
                </p>
                <ul className="space-y-2 text-xs text-muted-foreground/80 font-mono">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-destructive shrink-0" />
                    Remote "Origin" server node
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-destructive shrink-0" />
                    SQL Master relational database
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-destructive shrink-0" />
                    Asynchronous webhook dispatchers
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-destructive shrink-0" />
                    Heavy ERP / CRM / Inventory sync
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-border/30 text-center text-xs text-muted-foreground/50">
                Verifies commit cryptography on Push
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 2. The Order-as-a-Repository Lifecycle Stepper */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-24"
        >
          <motion.h3
            variants={fadeUp}
            custom={7}
            className="text-xl sm:text-2xl font-bold mb-8 text-center sm:text-left flex items-center gap-2"
          >
            <GitMerge className="w-5 h-5 text-primary" />
            2. The &quot;Order as a Repository&quot; Lifecycle
          </motion.h3>

          <div className="grid lg:grid-cols-[1fr_2fr] gap-8 bg-card/30 rounded-xl border border-border/50 p-6 sm:p-8">
            {/* Left Hand Steps */}
            <div className="flex flex-col gap-2">
              {lifecyclePhases.map((phase, i) => (
                <button
                  key={phase.phase}
                  onClick={() => setActivePhase(i)}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-200 flex items-center justify-between ${
                    activePhase === i
                      ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                      : "border-border/30 bg-transparent text-muted-foreground hover:bg-card/50 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                        activePhase === i
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {phase.phase}
                    </span>
                    <span className="font-mono">{phase.command}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              ))}
            </div>

            {/* Right Hand Phase Detail Panel */}
            <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-border/40 pt-6 lg:pt-0 lg:pl-8 min-h-[360px]">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold font-mono uppercase tracking-widest text-primary">
                    Phase {lifecyclePhases[activePhase].phase}
                  </span>
                  <span className="text-xs text-muted-foreground/60">•</span>
                  <span className="text-xs font-mono bg-card px-2 py-0.5 rounded-sm border border-border/40">
                    {lifecyclePhases[activePhase].command}
                  </span>
                </div>
                <h4 className="text-xl font-bold mb-4 text-foreground">
                  {lifecyclePhases[activePhase].title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {lifecyclePhases[activePhase].desc}
                </p>

                <div className="mb-4">
                  <span className="text-xs font-semibold text-muted-foreground block mb-2">
                    {lifecyclePhases[activePhase].subTitle}
                  </span>
                  <div className="code-block font-mono text-[12px] leading-relaxed p-4 rounded-lg bg-card border border-border/40 overflow-x-auto max-h-[180px]">
                    <pre className="text-primary/90">
                      {lifecyclePhases[activePhase].code}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Console Output block simulation */}
              <div className="mt-4 pt-4 border-t border-border/20">
                <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground/75 font-mono">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>VCS Local Console Output</span>
                </div>
                <div className="p-3 bg-black/60 border border-border/20 rounded-md font-mono text-[11px] text-zinc-300 whitespace-pre-wrap leading-normal">
                  {lifecyclePhases[activePhase].consoleOutput}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. Data Storage Boundaries Section */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-24"
        >
          <motion.h3
            variants={fadeUp}
            custom={8}
            className="text-xl sm:text-2xl font-bold mb-8 text-center sm:text-left flex items-center gap-2"
          >
            <Database className="w-5 h-5 text-primary" />
            3. Data Storage Boundaries
          </motion.h3>

          <motion.div variants={fadeUp} custom={9}>
            <div className="rounded-xl border border-border/50 overflow-hidden shadow-lg shadow-black/10">
              <div className="grid grid-cols-3 bg-muted/40 border-b border-border/50 font-mono text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <div className="p-4">Data Type</div>
                <div className="p-4 border-l border-border/30">
                  Storage Location
                </div>
                <div className="p-4 border-l border-border/30">
                  Sync Behavior
                </div>
              </div>

              <div className="divide-y divide-border/30">
                {storageBoundaries.map((boundary, i) => (
                  <div
                    key={boundary.type}
                    className={`grid grid-cols-3 transition-colors duration-150 ${
                      boundary.highlight
                        ? "bg-primary/5 hover:bg-primary/10"
                        : "hover:bg-card/30"
                    }`}
                  >
                    <div className="p-4 text-sm font-semibold flex items-center gap-2">
                      {boundary.highlight && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                      {boundary.type}
                    </div>
                    <div className="p-4 text-xs sm:text-sm text-muted-foreground border-l border-border/30 font-mono flex items-center">
                      {boundary.location}
                    </div>
                    <div
                      className={`p-4 text-xs sm:text-sm border-l border-border/30 font-mono flex items-center ${
                        boundary.highlight
                          ? "text-primary font-semibold"
                          : "text-muted-foreground/90"
                      }`}
                    >
                      {boundary.sync}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground/60 italic text-center">
              Ensuring absolute local-first offline performance via explicit
              boundary definition.
            </p>
          </motion.div>
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
                      &quot;Show me gluten-free desserts Bob didn&apos;t
                      order&quot;
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
        <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"}>
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
