export function KenteDivider({ className = "" }: { className?: string }) {
  return <div className={`h-1.5 w-full kente-divider rounded-full ${className}`} aria-hidden="true" />;
}

export function GradientBlob({ className = "", color = "emerald" }: { className?: string; color?: "emerald" | "gold" | "terra" }) {
  const colors: Record<string, string> = {
    emerald: "from-emerald-400/30 to-emerald-600/10",
    gold: "from-amber-300/30 to-amber-600/10",
    terra: "from-orange-400/30 to-red-600/10",
  };
  return <div className={`absolute rounded-full blur-3xl pointer-events-none bg-gradient-to-br ${colors[color]} ${className}`} aria-hidden="true" />;
}
