/**
 * Briefing Card Component
 * Design: Pixel-art styled mission briefing card with glitch hover effect
 * Adapted from Uiverse.io by xbeat_5120, restyled for synthwave palette
 */
import "./BriefingCard.css";

interface BriefingCardProps {
  title?: string;
  body?: string;
  status?: string;
}

export default function BriefingCard({
  title = "MISSION BRIEFING",
  body = "Think you know me? Prove it. Answer questions about my life, interests, and secrets. Only true friends survive.",
  status = "READY TO PLAY",
}: BriefingCardProps) {
  return (
    <div className="uiverse-pixel-card">
      <div className="uiverse-card-header">{title}</div>
      <div className="uiverse-card-body">
        <p>{body}</p>
        <p className="status">{status}</p>
      </div>
    </div>
  );
}
