import React, { useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import {
  PlaybookA,
  PlaybookB,
  PlaybookC,
  PlaybookD,
  PlaybookE,
  PlaybookF,
  PlaybookG,
  PlaybookH,
  PlaybookI,
  PlaybookJ,
  PlaybookK,
  PlaybookL,
} from './playbook';

interface PlaybookSectionProps {
  title: string;
  content: Record<string, any>;
  description: {
    highLevel: string;
    details: string[];
  };
}

const PlaybookSection: React.FC<PlaybookSectionProps> = ({ title, content, description }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 border border-border rounded-md">
      <div
        className="flex cursor-pointer items-center justify-between bg-muted/50 px-4 py-3 transition-colors hover:bg-muted rounded-t-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold">{description.highLevel}</h3>
        <span>{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="rounded-b-md bg-background p-4 text-sm">
          <p className="mb-2 text-muted-foreground">{description.highLevel}</p>
          {description.details.length > 0 && (
            <ul className="mb-4 list-disc list-inside text-muted-foreground">
              {description.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          )}
          {Object.entries(content).map(([key, value]) => (
            <div key={key} className="mb-4 last:mb-0">
              <h4 className="mb-2 text-md font-medium">{key}</h4>
              <SyntaxHighlighter language="json" style={atomOneDark} customStyle={{ padding: '1rem', borderRadius: '0.375rem', fontSize: '0.875rem' }}>
                {JSON.stringify(value, null, 2)}
              </SyntaxHighlighter>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PlaybookViewer: React.FC = () => {
  // Ensure react-syntax-highlighter is installed: npm install react-syntax-highlighter

  const playbookDescriptions = {
    PlaybookA: {
      highLevel: "Live Table Cart Session Using Decoupled Allocations.",
      details: [
        "Commit 1: Declare Contracts Once and Add Base Item",
        "Commit 2: Re-Allocate Payer globally by updating the contract directly",
        "Commit 3: Declare Delivery Contract and Attach to existing item",
      ],
    },
    PlaybookB: {
      highLevel: "Time-Traveling and Checking Active Totals",
      details: [
        "The client can dynamically travel back and forth in time simply by changing the query's targeted revision_id. This allows checking previous totals without altering the active cart branch.",
        "1. Checking Active Totals (C3 Target)",
        "2. Time-Traveling to Pre-Upgrade State (C1 Target)",
      ],
    },
    PlaybookC: {
      highLevel: "Safe Catalog Filtering",
      details: [
        "Demonstrates safe catalog filtering for AI agents and text search using the 'like' operator.",
        "AI Agent Tool Call for safe catalog filtering (gluten-free desserts by GourmetCo, no peanuts/tree nuts).",
        "AI Agent Tool Call for text search match (finding any burgers).",
      ],
    },
    PlaybookD: {
      highLevel: "Clean Merge Commits",
      details: [
        "Illustrates a clean three-way merge commit, where branches are reconciled without conflicts."
      ],
    },
    PlaybookE: {
      highLevel: "Batch Mutation to Reassign Desserts",
      details: [
        "Shows a declarative batch mutation where the AI agent re-assigns all desserts ordered by Bob to Alice.",
        "Instead of finding and looping over individual line items, the agent writes a single stateless batch_by_filter transaction anchoring to the active branch head.",
      ],
    },
    PlaybookF: {
      highLevel: "Mimic Orders",
      details: [
        "The 'Mimic Order' scenario, where George wants exactly what Bob ordered, and it's put on his check.",
        "The AI agent registers George's checks and writes a single batch_duplicate_and_reallocate rule.",
      ],
    },
    PlaybookG: {
      highLevel: "Scoped, Unconditional Discounts vs Global, Conditional Offers",
      details: [
        "1. Adding a Scoped, Unconditional Discount (physical $5.00 cash credit tied to Bob's burger).",
        "2. Adding a Global, Conditional Offer (automated 10% promotional tag to the entire check order).",
      ],
    },
    PlaybookH: {
      highLevel: "Hierarchical Combo Customizations and Modifiers",
      details: [
        "Registers the base deal, its structural subcomponents, and their modular custom modifiers pointing flatly to Bob's payment profiles.",
      ],
    },
    PlaybookI: {
      highLevel: "Ala carte Customizations With Linked Sides and Modifiers",
      details: [],
    },
    PlaybookJ: {
      highLevel: "Complex Hardware Configurations, Upgrades, and Scoped Warranties",
      details: [],
    },
    PlaybookK: {
      highLevel: "AI Agent Interactions: Generic Text Search Discovery & Customization",
      details: [
        "Customer: 'Show me what burgers you have under $15. Okay, add the cheapest one, make it no onions, assign it to Bob, and charge it to Bob.'",
        "Flow Step 1: Menu Discovery Query",
        "Flow Step 2: Decoupled Order Addition Commits",
        "VCS Client Local Rendering (Output Projection)",
      ],
    },
    PlaybookL: {
      highLevel: "AI Agent Interactions: Dynamic Cascading Deletions",
      details: [
        "Customer: 'Actually, on second thought, cancel the Cheeseburger entirely.'",
        "Flow Step 1: Request Deletion",
        "Flow Step 2: Local Client Cascade Projection",
      ],
    },
  };

  const playbooks = {
    PlaybookA: PlaybookA,
    PlaybookB: PlaybookB,
    PlaybookC: PlaybookC,
    PlaybookD: PlaybookD,
    PlaybookE: PlaybookE,
    PlaybookF: PlaybookF,
    PlaybookG: PlaybookG,
    PlaybookH: PlaybookH,
    PlaybookI: PlaybookI,
    PlaybookJ: PlaybookJ,
    PlaybookK: PlaybookK,
    PlaybookL: PlaybookL,
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-3xl font-bold mb-8 text-center">VCS Retail Playbooks</h2>
      {Object.entries(playbooks).map(([name, playbookContent]) => (
        <PlaybookSection
          key={name}
          title={name}
          content={playbookContent}
          description={playbookDescriptions[name as keyof typeof playbookDescriptions]}
        />
      ))}
    </div>
  );
};

export default PlaybookViewer;
