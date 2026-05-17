/**
 * Leaderboard Component
 * Design: Synthwave Arcade Cabinet : neon-styled high score table
 * Persists scores in Supabase and auto-updates across all devices
 */

import { motion } from "framer-motion";
import "./Leaderboard.css";
import { supabase } from "../../lib/supabase";

export interface LeaderboardEntry {
  name: string;
  score: number;
  total: number;
  date: string;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("score", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
  return data as LeaderboardEntry[];
}

export async function saveToLeaderboard(entry: LeaderboardEntry): Promise<LeaderboardEntry[]> {
  const { error } = await supabase.from("leaderboard").insert(entry);

  if (error) {
    console.error("Error saving to leaderboard:", error);
  }
  return getLeaderboard();
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  highlightName?: string;
  onClose: () => void;
  onPlayAgain: () => void;
}

export default function Leaderboard({
  entries,
  highlightName,
  onClose,
  onPlayAgain,
}: LeaderboardProps) {
  const getRankEmoji = (idx: number) => {
    if (idx === 0) return "🥇";
    if (idx === 1) return "🥈";
    if (idx === 2) return "🥉";
    return `#${idx + 1}`;
  };

  const getGrade = (score: number, total: number) => {
    const pct = Math.round((score / total) * 100);
    if (pct >= 90) return { grade: "S", color: "#fbe54f" };
    if (pct >= 70) return { grade: "A", color: "#00ff99" };
    if (pct >= 50) return { grade: "B", color: "#00ffff" };
    if (pct >= 30) return { grade: "C", color: "#ff00ff" };
    return { grade: "F", color: "#ff3333" };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="leaderboard-container"
    >
      <div className="leaderboard-card">
        <div className="leaderboard-header">
          <span className="leaderboard-trophy">🏆</span>
          <h2 className="leaderboard-title">LEADERBOARD</h2>
        </div>

        {entries.length === 0 ? (
          <div className="leaderboard-empty">
            <p>NO SCORES YET</p>
            <p className="leaderboard-empty-sub">Be the first to play!</p>
          </div>
        ) : (
          <div className="leaderboard-table-wrapper">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>RANK</th>
                  <th>PLAYER</th>
                  <th>SCORE</th>
                  <th>GRADE</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => {
                  const { grade, color } = getGrade(entry.score, entry.total);
                  const isHighlighted =
                    highlightName &&
                    entry.name === highlightName &&
                    idx === entries.findIndex((e) => e.name === highlightName);
                  return (
                    <motion.tr
                      key={`${entry.name}-${entry.date}-${idx}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06, duration: 0.3 }}
                      className={`leaderboard-row ${isHighlighted ? "highlighted" : ""} ${idx < 3 ? "top-three" : ""}`}
                    >
                      <td className="leaderboard-rank">
                        <span>{getRankEmoji(idx)}</span>
                      </td>
                      <td className="leaderboard-name">
                        {entry.name}
                        {isHighlighted && <span className="you-badge">YOU</span>}
                      </td>
                      <td className="leaderboard-score">
                        {entry.score}/{entry.total}
                      </td>
                      <td
                        className="leaderboard-grade"
                        style={{ color, textShadow: `0 0 5px ${color}` }}
                      >
                        {grade}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="leaderboard-actions">
          <button onClick={onPlayAgain} className="lb-btn lb-btn-play">
            PLAY AGAIN
          </button>
          <button onClick={onClose} className="lb-btn lb-btn-close">
            HOME
          </button>
        </div>
      </div>
    </motion.div>
  );
}