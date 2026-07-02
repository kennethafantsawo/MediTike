"use client";
import { Logo } from "@/components/brand/logo";
import { KenteDivider } from "@/components/brand/african-pattern";
import { Phone, Mail, MapPin, Facebook, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-foreground text-background mt-auto">
      {/* Top Kente strip */}
      <KenteDivider />

      <div className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo variant="light" size={36} />
            <p className="mt-3 text-sm text-background/60 leading-relaxed">
              La plateforme togolaise qui connecte patients et pharmacies en temps réel. Conçue pour le Togo, ouverte au monde.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-3 text-amber-300">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#features" className="hover:text-background transition-colors">Fonctionnalités</a></li>
              <li><a href="#garde" className="hover:text-background transition-colors">Pharmacies de garde</a></li>
              <li><a href="#comment" className="hover:text-background transition-colors">Comment ça marche</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Villes couvertes</a></li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-3 text-amber-300">
              Villes couvertes
            </h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>Lomé</li>
              <li>Kara</li>
              <li>Sokodé</li>
              <li>Kpalimé · Atakpamé · Dapaong</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-3 text-amber-300">
              Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-background/70">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                <span>+228 90 12 34 56</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                <span>contact@meditike.tg</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                <span>Lomé, Togo</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background/50">
          <p>© {new Date().getFullYear()} MediTike. Conçu avec ❤️ au Togo.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-background transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-background transition-colors">Conditions</a>
            <a href="#" className="hover:text-background transition-colors">Aide</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
