/**
 * TrickPopup Component
 * Design: Synthwave Arcade Cabinet — neon popup for trick question feedback
 */
import { motion, AnimatePresence } from "framer-motion";
import "./TrickPopup.css";

interface TrickPopupProps {
  show: boolean;
  message: string;
  type: "trick" | "correct" | "wrong";
  onClose: () => void;
}

export default function TrickPopup({ show, message, type, onClose }: TrickPopupProps) {
  const borderColor =
    type === "correct" ? "#00ff99" :
    type === "trick" ? "#fbe54f" : "#ff3333";

  const glowColor =
    type === "correct" ? "rgba(0, 255, 153, 0.3)" :
    type === "trick" ? "rgba(251, 229, 79, 0.3)" : "rgba(255, 51, 51, 0.3)";

  const emoji =
    type === "correct" ? "😏" :
    type === "trick" ? "🎭" : "❌";

  const title =
    type === "correct" ? "NICE TRY!" :
    type === "trick" ? "IT'S A TRAP!" : "WRONG!";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="trick-popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="trick-popup-card"
            style={{
              borderColor,
              boxShadow: `4px 4px 0 ${borderColor}, 0 0 30px ${glowColor}`,
            }}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="trick-popup-emoji">{emoji}</div>
            <h3 className="trick-popup-title" style={{ color: borderColor, textShadow: `0 0 8px ${borderColor}` }}>
              {title}
            </h3>
            <p className="trick-popup-message">{message}</p>
            <button
              onClick={onClose}
              className="trick-popup-btn"
              style={{ borderColor, color: borderColor }}
            >
              GOT IT
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
