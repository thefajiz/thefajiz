/**
 * Progress Bar Component
 * Design: Neon-glowing timer bar for the quiz
 * Inspired by the user's timer reference
 */

interface ProgressBarProps {
  progress: number; // 0-100
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export default function ProgressBar({
  progress,
  size = "md",
  color = "#fefcd0",
  className = "",
}: ProgressBarProps) {
  const heights = { sm: "h-2", md: "h-3", lg: "h-4" };
  const heightClass = heights[size];

  const isLow = progress < 30;
  const glowColor = isLow ? "#ff3333" : color;
  const barColor = isLow ? "#ff3333" : "#00ffff";

  return (
    <div
      className={`relative w-full ${heightClass} rounded-full overflow-hidden border-2 border-black ${className}`}
      style={{
        backgroundColor: "#0d0520",
        boxShadow: `0 0 8px ${glowColor}40, inset 0 0 4px rgba(0,0,0,0.5)`,
      }}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ease-out ${isLow ? "animate-pulse" : ""}`}
        style={{
          width: `${Math.max(0, Math.min(100, progress))}%`,
          backgroundColor: barColor,
          boxShadow: `0 0 8px ${barColor}, 0 0 16px ${barColor}80`,
        }}
      />
    </div>
  );
}
