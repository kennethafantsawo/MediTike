/**
 * African-inspired decorative patterns and components
 */

interface PatternProps {
  className?: string;
  variant?: "kente-strip" | "dots" | "waves" | "geometric";
}

/** Decorative Kente-inspired strip pattern */
export function AfricanPattern({ className = "", variant = "kente-strip" }: PatternProps) {
  if (variant === "dots") {
    return <div className={`dotted-bg ${className}`} aria-hidden="true" />;
  }
  if (variant === "kente-strip") {
    return <div className={`kente-strip ${className}`} aria-hidden="true" />;
  }
  if (variant === "waves") {
    return (
      <svg
        className={className}
        width="100%"
        height="20"
        viewBox="0 0 1200 20"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M0 10 Q 50 0 100 10 T 200 10 T 300 10 T 400 10 T 500 10 T 600 10 T 700 10 T 800 10 T 900 10 T 1000 10 T 1100 10 T 1200 10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
      </svg>
    );
  }
  // geometric: subtle diamond grid
  return (
    <svg
      className={className}
      width="100%"
      height="40"
      viewBox="0 0 200 40"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="diamonds" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 20 10 L 10 20 L 0 10 Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#diamonds)" />
    </svg>
  );
}

/** Decorative Kente divider bar — colorful, used between sections */
export function KenteDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-1.5 w-full kente-divider rounded-full ${className}`}
      aria-hidden="true"
    />
  );
}

/** Decorative blob/gradient blob for backgrounds */
export function GradientBlob({ className = "", color = "emerald" }: { className?: string; color?: "emerald" | "gold" | "terra" }) {
  const colors: Record<string, string> = {
    emerald: "from-emerald-400/30 to-emerald-600/10",
    gold: "from-amber-300/30 to-amber-600/10",
    terra: "from-orange-400/30 to-red-600/10",
  };
  return (
    <div
      className={`absolute rounded-full blur-3xl pointer-events-none bg-gradient-to-br ${colors[color]} ${className}`}
      aria-hidden="true"
    />
  );
}
