"use client";
import { motion } from "framer-motion";
import { User, Phone, LogOut, Building2, MapPin, Pill, Settings, ChevronRight, Heart, Info, Globe } from "lucide-react";
import { formatTogoPhone } from "@/lib/meditike/helpers";
import { LogoMark } from "@/components/brand/logo";
import { toast } from "sonner";

interface ProfileViewProps {
  user: any;
  onLogout: () => void;
}

export function ProfileView({ user, onLogout }: ProfileViewProps) {
  const handleLogout = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
      toast.success("À bientôt sur MediTike !");
      onLogout();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-32 lg:pb-12">
      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white rounded-3xl border border-border overflow-hidden mb-5"
      >
        <div className="brand-gradient relative h-24">
          <div className="absolute inset-0 kente-strip opacity-30" />
        </div>
        <div className="px-5 pb-5 -mt-12">
          <div className="flex items-end justify-between">
            <div className="w-20 h-20 rounded-3xl bg-white border-4 border-white shadow-lg flex items-center justify-center">
              <div className="w-full h-full rounded-2xl bg-emerald-100 flex items-center justify-center">
                <User className="w-10 h-10 text-emerald-600" />
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
              user.role === "pharmacist" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
            }`}>
              {user.role === "pharmacist" ? "PHARMACIEN" : "PATIENT"}
            </span>
          </div>

          <h2 className="font-display font-extrabold text-xl mt-3">{user.fullName || "Utilisateur"}</h2>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
            <Phone className="w-3.5 h-3.5" />
            <span>{formatTogoPhone(user.phone)}</span>
          </div>

          {user.role === "pharmacist" && user.pharmacyName && (
            <div className="mt-3 p-3 bg-muted/60 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <p className="text-sm font-bold">{user.pharmacyName}</p>
              </div>
              {user.pharmacyAddress && (
                <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                  <span>
                    {user.pharmacyDistrict ? `${user.pharmacyDistrict}, ` : ""}
                    {user.pharmacyAddress}, {user.pharmacyCity}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      {user.role === "client" && (
        <div className="grid grid-cols-2 gap-3 mb-5">
          <StatBox icon={<Pill className="w-4 h-4" />} label="Recherches" value="12" />
          <StatBox icon={<Heart className="w-4 h-4" />} label="Pharmacies fav." value="3" />
        </div>
      )}

      {/* Menu */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden mb-5">
        <MenuItem icon={<Settings className="w-4 h-4" />} label="Préférences" />
        <MenuItem icon={<Globe className="w-4 h-4" />} label="Langue & devise" badge="FR · FCFA" />
        <MenuItem icon={<Info className="w-4 h-4" />} label="À propos de MediTike" />
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full bg-white border border-red-200 text-red-600 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Se déconnecter
      </button>

      {/* Footer credit */}
      <div className="mt-6 flex flex-col items-center gap-2 text-center">
        <LogoMark size={28} />
        <p className="text-xs text-muted-foreground">
          MediTike v1.0 · Conçu avec ❤️ au Togo
        </p>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-4">
      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
        {icon}
      </div>
      <p className="font-display font-extrabold text-2xl leading-none">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function MenuItem({ icon, label, badge }: { icon: React.ReactNode; label: string; badge?: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors border-b border-border last:border-0">
      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-foreground">
        {icon}
      </div>
      <span className="flex-1 text-left text-sm font-semibold">{label}</span>
      {badge && (
        <span className="text-xs text-muted-foreground font-bold">{badge}</span>
      )}
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}
