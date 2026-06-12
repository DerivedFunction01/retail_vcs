"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitCommitHorizontal,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/sections/hero";
import { ArchitectureSection } from "@/components/sections/architecture";
import { MutationsSection } from "@/components/sections/mutations";
import { BranchesSection } from "@/components/sections/branches";
import { MergeSection } from "@/components/sections/merge";
import { QueryEngineSection } from "@/components/sections/query-engine";
import { FeaturesSection, Footer } from "@/components/sections/features";

const navItems = [
  { id: "architecture", label: "Architecture" },
  { id: "mutations", label: "Mutations" },
  { id: "query", label: "Query Engine" },
  { id: "merge", label: "Merge" },
  { id: "branches", label: "Branches" },
  { id: "features", label: "Features" },
];

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 80);

    const sections = navItems.map((item) => ({
      id: item.id,
      el: document.getElementById(item.id),
    }));

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section.el) {
        const rect = section.el.getBoundingClientRect();
        if (rect.top <= 200) {
          setActiveSection(section.id);
          break;
        }
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToSection = (id: string) => {
    setMobileNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/30 shadow-lg shadow-black/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <GitCommitHorizontal className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-sm sm:text-base">Retail VCS</span>
            <span className="hidden sm:inline text-xs text-muted-foreground/50 font-mono">
              v2.1.0
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                  activeSection === item.id
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-card/50 transition-colors"
          >
            {mobileNavOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-xl"
            >
              <nav className="px-6 py-4 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      activeSection === item.id
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main content */}
      <main className="flex-1">
        <HeroSection />
        <ArchitectureSection />
        <MutationsSection />
        <QueryEngineSection />
        <MergeSection />
        <BranchesSection />
        <FeaturesSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
