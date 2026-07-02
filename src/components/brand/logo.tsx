import { cn } from "@/lib/utils";

export function LogoMark({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("shrink-0", className)} aria-label="MediTike">
      <defs>
        <linearGradient id="mt-brand" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1a6b4a" />
          <stop offset="0.55" stopColor="#0f5132" />
          <stop offset="1" stopColor="#6b5a35" />
        </linearGradient>
        <linearGradient id="mt-gold" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#b89968" />
          <stop offset="1" stopColor="#8a6f42" />
        </linearGradient>
        <radialGradient id="mt-glow" cx="0.35" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#mt-brand)" />
      <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#mt-glow)" />
      <g opacity="0.35">
        <polygon points="2,2 12,2 2,12" fill="#b89968" />
        <polygon points="62,2 52,2 62,12" fill="#b89968" />
        <polygon points="2,62 12,62 2,52" fill="#b89968" />
        <polygon points="62,62 52,62 62,52" fill="#b89968" />
      </g>
      <path d="M 14 26 Q 14 22 18 22 L 46 22 Q 50 22 50 26 L 50 34 Q 50 46 32 50 Q 14 46 14 34 Z" fill="#ffffff" opacity="0.95" />
      <rect x="12" y="20" width="40" height="4" rx="2" fill="#b89968" />
      <rect x="30" y="6" width="4" height="22" rx="2" fill="#b89968" />
      <circle cx="32" cy="7" r="3.5" fill="url(#mt-gold)" />
      <g fill="#0f5132">
        <rect x="29" y="28" width="6" height="14" rx="1.5" />
        <rect x="25" y="32" width="14" height="6" rx="1.5" />
      </g>
    </svg>
  );
}

export function Logo({ size = 48, className, showWordmark = true, variant = "default" }: { size?: number; className?: string; showWordmark?: boolean; variant?: "default" | "light" }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className={cn("font-display font-extrabold tracking-tight text-xl", variant === "light" ? "text-white" : "text-foreground")}>
            Medi<span className="text-gradient-gold">Tike</span>
          </span>
          <span className={cn("text-[10px] font-bold uppercase tracking-[0.18em] mt-0.5", variant === "light" ? "text-white/70" : "text-muted-foreground")}>
            Santé · Togo
          </span>
        </div>
      )}
    </div>
  );
}
