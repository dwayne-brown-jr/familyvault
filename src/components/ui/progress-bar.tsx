import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

// Maps the legacy `bg-*` color prop to a vibrant gradient + matching glow so
// every progress bar reads as a glowing accent track in the fintech theme.
const GRADIENTS: Record<string, { from: string; to: string; glow: string }> = {
  "bg-teal": { from: "#2EE6C5", to: "#5B8DEF", glow: "rgba(46,230,197,0.55)" },
  "bg-navy": { from: "#5B8DEF", to: "#7CA6F5", glow: "rgba(91,141,239,0.55)" },
  "bg-amber": { from: "#F5C451", to: "#FB7185", glow: "rgba(245,196,81,0.5)" },
  "bg-coral": { from: "#FB7185", to: "#F5C451", glow: "rgba(251,113,133,0.5)" },
};

export function ProgressBar({
  value,
  color = "bg-teal",
  className,
  showLabel = false,
  size = "md",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-3.5" };
  const g = GRADIENTS[color] ?? GRADIENTS["bg-teal"];

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "w-full rounded-full overflow-hidden bg-white/[0.06] border border-white/[0.05]",
          heights[size]
        )}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${clamped}%`,
            backgroundImage: `linear-gradient(90deg, ${g.from}, ${g.to})`,
            boxShadow: `0 0 12px ${g.glow}`,
          }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-muted-foreground mt-1 block text-right">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
