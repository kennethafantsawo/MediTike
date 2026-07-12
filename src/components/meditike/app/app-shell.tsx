"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, MessageSquare, User, LogOut } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { SearchView } from "./search-view";
import { DutyView } from "./duty-view";
import { HistoryView } from "./history-view";
import { ProfileView } from "./profile-view";

type Tab = "search" | "duty" | "history" | "profile";

interface AppShellProps {
  user: any;
  onLogout: () => void;
  initialTab?: Tab;
}

export function AppShell({ user, onLogout, initialTab = "search" }: AppShellProps) {
  const [tab, setTab] = useState<Tab>(initialTab);

  const tabs: Array<{ id: Tab; label: string; icon: any }> = [
    { id: "search", label: "Recherche", icon: Search },
    { id: "duty", label: "Pharmacies", icon: Clock },
    { id: "history", label: "Demandes", icon: MessageSquare },
    { id: "profile", label: "Profil", icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoMark size={32} />
            <div className="leading-none">
              <p className="font-display font-extrabold text-base">
                Medi<span className="text-gradient-gold">Tike</span>
              </p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                {user.role === "pharmacist" ? "Mode pharmacien" : "Mode patient"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setTab("profile")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-muted transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xs font-bold hidden sm:inline">
              {user.role === "pharmacist" ? user.pharmacyName || user.fullName : user.fullName}
            </span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "search" && <SearchView user={user} />}
            {tab === "duty" && <DutyView />}
            {tab === "history" && <HistoryView user={user} />}
            {tab === "profile" && <ProfileView user={user} onLogout={onLogout} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom navigation (mobile-first, also visible on desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-t border-border lg:sticky lg:bottom-0">
        <div className="max-w-3xl mx-auto px-2 py-2 grid grid-cols-4 gap-1 safe-area-inset">
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex flex-col items-center justify-center gap-0.5 py-2 rounded-xl transition-all ${
                  active ? "text-emerald-700" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-emerald-50 rounded-xl"
                    transition={{ type: "spring", damping: 22, stiffness: 320 }}
                  />
                )}
                <t.icon className={`w-5 h-5 relative z-10 ${active ? "scale-110" : ""} transition-transform`} />
                <span className={`text-[10px] font-bold relative z-10 ${active ? "text-emerald-700" : ""}`}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
