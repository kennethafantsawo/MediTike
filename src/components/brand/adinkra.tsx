/**
 * Adinkra-inspired SVG symbols (West Africa, including Togo/Ashanti culture).
 * Used as decorative background elements to reinforce the African identity.
 * These are stylized, original interpretations — not exact traditional symbols.
 */

interface AdinkraProps {
  name: "gye-nyame" | "sankofa" | "duafe" | "nyame-nti" | "mmusuyidee" | "aya";
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Adinkra({ name, size = 64, className = "", strokeWidth = 2 }: AdinkraProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 64 64",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className,
    "aria-hidden": true,
  };

  switch (name) {
    // Gye Nyame — supremacy of God (star + cross shape)
    case "gye-nyame":
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth={strokeWidth} />
          <path d="M 32 8 L 36 28 L 56 32 L 36 36 L 32 56 L 28 36 L 8 32 L 28 28 Z" fill="currentColor" />
          <circle cx="32" cy="32" r="4" fill="currentColor" />
        </svg>
      );
    // Sankofa — learn from the past (heart-like spiral)
    case "sankofa":
      return (
        <svg {...common}>
          <path
            d="M 32 12 C 20 12 14 22 14 30 C 14 40 22 48 32 48 C 42 48 50 40 50 30"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
          />
          <path d="M 50 30 L 44 24 M 50 30 L 44 36" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M 14 30 L 8 24 M 14 30 L 8 36" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
          <circle cx="32" cy="30" r="4" fill="currentColor" />
        </svg>
      );
    // Duafe — wooden comb (beauty, femininity)
    case "duafe":
      return (
        <svg {...common}>
          <rect x="20" y="8" width="24" height="22" rx="4" stroke="currentColor" strokeWidth={strokeWidth} fill="none" />
          <line x1="26" y1="8" x2="26" y2="30" stroke="currentColor" strokeWidth={strokeWidth / 2} />
          <line x1="32" y1="8" x2="32" y2="30" stroke="currentColor" strokeWidth={strokeWidth / 2} />
          <line x1="38" y1="8" x2="38" y2="30" stroke="currentColor" strokeWidth={strokeWidth / 2} />
          <rect x="29" y="30" width="6" height="26" rx="2" fill="currentColor" />
        </svg>
      );
    // Nyame Nti — by God's grace (cross with rays)
    case "nyame-nti":
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth={strokeWidth} />
          <rect x="29" y="14" width="6" height="36" rx="2" fill="currentColor" />
          <rect x="14" y="29" width="36" height="6" rx="2" fill="currentColor" />
          <circle cx="32" cy="32" r="6" stroke="currentColor" strokeWidth={strokeWidth} fill="none" />
        </svg>
      );
    // Mmusuyidee — purity (interlocking shapes)
    case "mmusuyidee":
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth={strokeWidth} />
          <path
            d="M 32 12 L 52 32 L 32 52 L 12 32 Z"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <path
            d="M 32 20 L 44 32 L 32 44 L 20 32 Z"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle cx="32" cy="32" r="4" fill="currentColor" />
        </svg>
      );
    // Aya — endurance (fern-like spiral)
    case "aya":
      return (
        <svg {...common}>
          <path
            d="M 32 56 L 32 16 M 32 16 C 32 12 28 8 24 8 M 32 16 C 32 12 36 8 40 8 M 32 24 C 28 22 22 22 18 24 M 32 24 C 36 22 42 22 46 24 M 32 32 C 28 30 22 30 18 32 M 32 32 C 36 30 42 30 46 32 M 32 40 C 28 38 22 38 18 40 M 32 40 C 36 38 42 38 46 40"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );
    default:
      return null;
  }
}

/** Decorative Adinkra symbol cluster for backgrounds */
export function AdinkraCluster({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none ${className}`} aria-hidden="true">
      <div className="relative">
        <Adinkra name="gye-nyame" size={120} className="text-amber-500/15" strokeWidth={1.5} />
        <Adinkra
          name="sankofa"
          size={80}
          className="absolute -bottom-8 -right-8 text-emerald-600/15"
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
}
