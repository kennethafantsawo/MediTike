"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { Logo } from "@/components/brand/logo";

interface LandingNavProps {
  onJoin: () => void;
  onLogin: () => void;
}

export function LandingNav({ onJoin, onLogin }: LandingNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#features", label: "Fonctionnalités" },
    { href: "#garde", label: "Pharmacies de garde" },
    { href: "#comment", label: "Comment ça marche" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-background/85 backdrop-blur-md border-b border-border/60 shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Logo size={32} />

          <nav className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={onLogin}
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-bold text-foreground hover:bg-muted rounded-xl transition-colors"
            >
              Se connecter
            </button>
            <button
              onClick={onJoin}
              className="inline-flex items-center gap-1.5 px-4 py-2 brand-gradient text-white text-sm font-bold rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Rejoindre
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg md:hidden flex flex-col"
          >
            <div className="h-16 px-5 flex items-center justify-between border-b border-border">
              <Logo size={32} />
              <button
                onClick={() => setMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 flex flex-col px-5 py-8 gap-2">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-display font-bold py-4 border-b border-border"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="p-5 border-t border-border flex flex-col gap-2">
              <button
                onClick={() => { setMenuOpen(false); onLogin(); }}
                className="w-full py-3.5 bg-muted text-foreground font-bold rounded-2xl"
              >
                Se connecter
              </button>
              <button
                onClick={() => { setMenuOpen(false); onJoin(); }}
                className="w-full py-3.5 brand-gradient text-white font-bold rounded-2xl"
              >
                Rejoindre MediTike
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
