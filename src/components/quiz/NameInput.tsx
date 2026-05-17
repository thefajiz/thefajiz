/**
 * NameInput Component
 * Design: Synthwave Arcade Cabinet : neon-styled name entry screen
 * Appears after clicking "INSERT COIN TO PLAY" and before the briefing
 */
import { useState } from "react";
import { motion } from "framer-motion";
import "./NameInput.css";

interface NameInputProps {
  onSubmit: (name: string) => void;
  onBack: () => void;
}

export default function NameInput({ onSubmit, onBack }: NameInputProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("ENTER YOUR NAME, PLAYER");
      return;
    }
    if (trimmed.length > 20) {
      setError("MAX 20 CHARACTERS");
      return;
    }
    onSubmit(trimmed);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="name-input-container"
    >
      <div className="name-input-card">
        <div className="name-input-header">
          <span className="name-input-icon">👾</span>
          <h2 className="name-input-title">ENTER YOUR NAME</h2>
        </div>

        <form onSubmit={handleSubmit} className="name-input-form">
          <div className="name-input-field-wrapper">
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="PLAYER_ONE"
              className="name-input-field"
              maxLength={20}
              autoFocus
            />
            <div className="name-input-underline" />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="name-input-error"
            >
              {error}
            </motion.p>
          )}

          <div className="name-input-actions">
            <button type="submit" className="name-input-btn name-input-btn-go">
              CONTINUE
            </button>
            <button
              type="button"
              onClick={onBack}
              className="name-input-btn name-input-btn-back"
            >
              BACK
            </button>
          </div>
        </form>

        <p className="name-input-hint">
          Your score will appear on the leaderboard
        </p>
      </div>
    </motion.div>
  );
}
