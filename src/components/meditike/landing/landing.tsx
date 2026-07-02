"use client";
import { useState, useEffect } from "react";
import { LandingNav } from "./nav";
import { Hero } from "./hero";
import { Features } from "./features";
import { HowItWorks } from "./how-it-works";
import { DutyPreview } from "./duty-preview";
import { CitiesSection } from "./cities";
import { CTASection } from "./cta";
import { Footer } from "./footer";
import { AuthModal } from "../auth-modal";

interface LandingProps {
  onAuthed: (user: any) => void;
}

export function Landing({ onAuthed }: LandingProps) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register" | "register-pharmacy">("login");
  const [stats, setStats] = useState<{ pharmacies: number; medications: number; cities: number } | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  const openLogin = () => { setAuthMode("login"); setAuthOpen(true); };
  const openRegister = () => { setAuthMode("register"); setAuthOpen(true); };

  return (
    <div className="min-h-screen flex flex-col">
      <LandingNav onJoin={openRegister} onLogin={openLogin} />

      <main className="flex-1">
        <Hero
          onPrimaryClick={openRegister}
          onSecondaryClick={() => {
            document.getElementById("garde")?.scrollIntoView({ behavior: "smooth" });
          }}
          stats={stats}
        />
        <Features />
        <HowItWorks />
        <DutyPreview />
        <CitiesSection />
        <CTASection onJoin={openRegister} />
      </main>

      <Footer />

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthed={(u) => { setAuthOpen(false); onAuthed(u); }}
        initialMode={authMode}
      />
    </div>
  );
}
