/**
 * Home Page — Personal Quiz Game
 * Design: Synthwave Arcade Cabinet
 * Flow: Landing → Name Input → Briefing → Quiz Questions → Results → Leaderboard
 *
 * Custom questions with trick question logic (Q4):
 * - Q4 is a trick: user is "good at all" sports, so only a timeout (no answer) is correct.
 * - If user picks any option, they get a popup saying it's a trick.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NeonNavbar from "@/components/quiz/NeonNavbar";
import SynthwaveLoader from "@/components/quiz/SynthwaveLoader";
import BriefingCard from "@/components/quiz/BriefingCard";
import QuizOptions from "@/components/quiz/QuizOptions";
import ProgressBar from "@/components/quiz/ProgressBar";
import ResultsPrinter from "@/components/quiz/ResultsPrinter";
import NameInput from "@/components/quiz/NameInput";
import Leaderboard, {
  getLeaderboard,
  saveToLeaderboard,
  type LeaderboardEntry,
} from "@/components/quiz/Leaderboard";
import TrickPopup from "@/components/quiz/TrickPopup";
import ErrorBoundary from "@/components/quiz/ErrorBoundary";
import { ThemeProvider } from "@/contexts/QuizThemeContext";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// ─── Sound Effects ───────────────────────────────────────────
const playRetroSound = (type: "correct" | "wrong" | "start" | "timeout") => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;

  if (type === "correct") {
    osc.type = "square";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  } else if (type === "wrong") {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.3);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === "timeout") {
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(50, now + 0.4);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    osc.start(now);
    osc.stop(now + 0.4);
  } else if (type === "start") {
    osc.type = "triangle";
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.setValueAtTime(659.25, now + 0.1);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  }
};

// ─── Quiz Data ───────────────────────────────────────────────
interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  isTrick?: boolean;
  trickMessage?: string;
}

const quizData: QuizQuestion[] = [
  {
    question: "What's my football shirt number?",
    options: ["7", "10", "17", "23"],
    answer: "17",
  },
  {
    question: "What's my favorite color?",
    options: ["Midnight Blue", "Phtalo Green", "Crimson Red", "Royal Purple"],
    answer: "Phtalo Green",
  },
  {
    question: "What's my favorite Pokémon?",
    options: ["Pikachu", "Charizard", "Lucario", "Greninja"],
    answer: "Charizard",
  },
  {
    question: "What's the game that I'm weak at?",
    options: ["Badminton", "Football", "Swimming", "Padel"],
    answer: "__TRICK_TIMEOUT__",
    isTrick: true,
    trickMessage:
      "Haha! Trick question — I'm good at ALL of them! You should've just let the timer run out 😎",
  },
  {
    question: "What's my favorite shawarma place?",
    options: ["Labanese", "Sameeh", "Jabariya", "Hantour"],
    answer: "Sameeh",
  },
  {
    question: "Where was I born?",
    options: ["Kannur", "Kozhikode", "Salmaniya", "Riffa"],
    answer: "Salmaniya",
  },
  {
    question: "What's the one chore I hate?",
    options: ["Ironing", "Washing Dishes", "Cooking", "Washing Clothes"],
    answer: "Ironing",
  },
];

type GameState = "idle" | "nameInput" | "briefing" | "playing" | "results" | "leaderboard";

export default function Try() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [playerName, setPlayerName] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(100);
  const [timerActive, setTimerActive] = useState(false);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);

  const [trickPopup, setTrickPopup] = useState<{
    show: boolean;
    message: string;
    type: "trick" | "correct" | "wrong";
  }>({ show: false, message: "", type: "trick" });

  const waitingForPopup = useRef(false);
  const currentQuestionRef = useRef(currentQuestion);
  currentQuestionRef.current = currentQuestion;

  // Load leaderboard on mount
  useEffect(() => {
    getLeaderboard().then(setLeaderboardEntries);
  }, []);

  // Auto-save to leaderboard when game ends
  useEffect(() => {
    if (gameState === "results" && playerName) {
      const entry: LeaderboardEntry = {
        name: playerName,
        score,
        total: quizData.length,
        date: new Date().toISOString(),
      };
      saveToLeaderboard(entry).then(setLeaderboardEntries);
    }
  }, [gameState, playerName, score]);

  // Timer logic
  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 2;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [timerActive, currentQuestion]);

  const handleTimeout = useCallback(() => {
    setTimerActive(false);
    const q = quizData[currentQuestionRef.current];

    if (q.isTrick) {
      setScore((s) => s + 1);
      playRetroSound("correct");
      setTrickPopup({
        show: true,
        message: "Smart move! You didn't fall for the trick — I'm good at all of them! +1 point 🎉",
        type: "correct",
      });
      waitingForPopup.current = true;
      setShowCorrect(true);
    } else {
      playRetroSound("timeout");
      setShowCorrect(true);
      setTimeout(() => advanceQuestion(), 1500);
    }
  }, [currentQuestion]);

  const startQuiz = () => {
    setGameState("nameInput");
  };

  const handleNameSubmit = (name: string) => {
    setPlayerName(name);
    setGameState("briefing");
    playRetroSound("start");
  };

  const beginPlaying = () => {
    setGameState("playing");
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(100);
    setTimerActive(true);
    setSelectedAnswer(null);
    setShowCorrect(false);
    playRetroSound("start");
  };

  const handleSelect = (option: string) => {
    if (showCorrect || waitingForPopup.current) return;
    setSelectedAnswer(option);
    setTimerActive(false);

    const q = quizData[currentQuestion];

    if (q.isTrick) {
      playRetroSound("wrong");
      setTrickPopup({
        show: true,
        message: q.trickMessage || "It's a trick question!",
        type: "trick",
      });
      waitingForPopup.current = true;
      setShowCorrect(true);
    } else {
      if (option === q.answer) {
        setScore((s) => s + 1);
        playRetroSound("correct");
      } else {
        playRetroSound("wrong");
      }
      setShowCorrect(true);
      setTimeout(() => advanceQuestion(), 1500);
    }
  };

  const handleTrickPopupClose = () => {
    setTrickPopup({ show: false, message: "", type: "trick" });
    waitingForPopup.current = false;
    setTimeout(() => advanceQuestion(), 300);
  };

  const advanceQuestion = () => {
    if (currentQuestionRef.current + 1 >= quizData.length) {
      setGameState("results");
    } else {
      setCurrentQuestion((q) => q + 1);
      setSelectedAnswer(null);
      setShowCorrect(false);
      setTimeLeft(100);
      setTimerActive(true);
    }
  };

  const handleShowLeaderboard = () => {
    setGameState("leaderboard");
  };

  const resetGame = () => {
    setGameState("idle");
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowCorrect(false);
    setTimeLeft(100);
    setTimerActive(false);
    setPlayerName("");
  };

  const playAgain = () => {
    setGameState("nameInput");
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowCorrect(false);
    setTimeLeft(100);
    setTimerActive(false);
  };

  const showLeaderboardFromNav = () => {
    getLeaderboard().then((entries) => {
      setLeaderboardEntries(entries);
      setGameState("leaderboard");
    });
  };

  const getDisplayAnswer = () => {
    const q = quizData[currentQuestion];
    if (q.isTrick) return null;
    return q.answer;
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <div className="min-h-screen flex flex-col bg-[#0a0a0f] scanlines">
            <NeonNavbar
              gameState={gameState === "idle" ? "idle" : gameState === "leaderboard" ? "idle" : "playing"}
            />

            <main className="flex-1 relative overflow-hidden">
              {/* Background hero image */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663662791301/PSmvNHNyTYQRBD2Us7ZtVW/synthwave-hero-bg-6e7v7LqKrtBSJeznT6a8dQ.webp)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center bottom",
                }}
              />

              {/* Grid floor overlay */}
              <div className="absolute inset-0 perspective-grid opacity-20" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
                <AnimatePresence mode="wait">
                  {/* IDLE STATE — Landing */}
                  {gameState === "idle" && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                      className="flex flex-col items-center gap-8 text-center"
                    >
                      <h1
                        className="text-2xl md:text-4xl font-bold neon-text-cyan crt-flicker"
                        style={{ fontFamily: "'Press Start 2P', monospace", lineHeight: "1.6" }}
                      >
                        DO YOU KNOW ME?
                      </h1>
                      <p className="text-[#a0a0ff] max-w-md text-sm md:text-base" style={{ fontFamily: "'Space Mono', monospace" }}>
                        A fun interactive quiz to test how well you really know me.
                        Think you can get a perfect score?
                      </p>

                      <div className="my-4">
                        <SynthwaveLoader />
                      </div>

                      <div className="flex flex-col gap-4">
                        <button
                          onClick={startQuiz}
                          className="px-8 py-4 text-sm font-bold rounded-lg border-2 border-[#00ffff] text-[#00ffff] bg-transparent hover:bg-[#00ffff] hover:text-[#0a0015] transition-all duration-200 neon-glow-cyan"
                          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "0.7rem" }}
                        >
                          INSERT COIN TO PLAY
                        </button>

                        <button
                          onClick={showLeaderboardFromNav}
                          className="px-6 py-3 text-xs font-bold rounded border-2 border-[#ff00ff] text-[#ff00ff] bg-transparent hover:bg-[#ff00ff] hover:text-[#0a0015] transition-all duration-200"
                          style={{
                            fontFamily: "'Press Start 2P', monospace",
                            fontSize: "0.5rem",
                            boxShadow: "0 0 10px #ff00ff40",
                          }}
                        >
                          VIEW LEADERBOARD
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* NAME INPUT STATE */}
                  {gameState === "nameInput" && (
                    <NameInput
                      key="nameInput"
                      onSubmit={handleNameSubmit}
                      onBack={resetGame}
                    />
                  )}

                  {/* BRIEFING STATE */}
                  {gameState === "briefing" && (
                    <motion.div
                      key="briefing"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="flex flex-col items-center gap-8"
                    >
                      <p
                        className="text-[#fbe54f] text-xs"
                        style={{ fontFamily: "'Press Start 2P', monospace", textShadow: "0 0 5px #fbe54f" }}
                      >
                        WELCOME, {playerName.toUpperCase()}
                      </p>

                      <BriefingCard
                        title="MISSION BRIEFING"
                        body={`Think you know me? Prove it. Answer ${quizData.length} questions about my life, interests, and secrets. You have limited time for each question. Watch out for trick questions!`}
                        status="READY TO PLAY"
                      />

                      <div className="flex gap-4 mt-4">
                        <button
                          onClick={beginPlaying}
                          className="px-6 py-3 text-sm font-bold rounded border-2 border-[#00ff99] text-[#00ff99] bg-transparent hover:bg-[#00ff99] hover:text-[#0a0015] transition-all duration-200"
                          style={{
                            fontFamily: "'Press Start 2P', monospace",
                            fontSize: "0.6rem",
                            boxShadow: "0 0 10px #00ff99, 0 0 20px #00ff9940",
                          }}
                        >
                          ACCEPT MISSION
                        </button>
                        <button
                          onClick={resetGame}
                          className="px-6 py-3 text-sm font-bold rounded border-2 border-[#ff3333] text-[#ff3333] bg-transparent hover:bg-[#ff3333] hover:text-white transition-all duration-200"
                          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "0.6rem" }}
                        >
                          ABORT
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* PLAYING STATE */}
                  {gameState === "playing" && (
                    <motion.div
                      key={`playing-${currentQuestion}`}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                      className="flex flex-col items-center gap-6 w-full max-w-lg"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className="text-[#ff00ff] text-xs"
                          style={{ fontFamily: "'Press Start 2P', monospace" }}
                        >
                          Q{currentQuestion + 1}/{quizData.length}
                        </span>
                        <span
                          className="text-[#fbe54f] text-xs"
                          style={{ fontFamily: "'Press Start 2P', monospace" }}
                        >
                          SCORE: {score}
                        </span>
                      </div>

                      <ProgressBar progress={timeLeft} size="md" className="w-full" />

                      {quizData[currentQuestion].isTrick && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2, duration: 1 }}
                          className="text-[#fbe54f80] text-xs text-center"
                          style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                          💡 Sometimes the best move is no move...
                        </motion.p>
                      )}

                      <div
                        className="w-full p-6 rounded-lg border-2 border-[#00ffff] bg-[#0d0520]/90 backdrop-blur-sm"
                        style={{ boxShadow: "0 0 20px rgba(0, 255, 255, 0.15), inset 0 0 30px rgba(0, 0, 0, 0.5)" }}
                      >
                        <h2
                          className="text-[#fbe54f] text-center text-sm md:text-base mb-2"
                          style={{ fontFamily: "'Press Start 2P', monospace", lineHeight: "1.8" }}
                        >
                          {quizData[currentQuestion].question}
                        </h2>
                      </div>

                      <QuizOptions
                        options={quizData[currentQuestion].options}
                        selected={selectedAnswer}
                        onSelect={handleSelect}
                        disabled={showCorrect}
                        correctAnswer={showCorrect ? getDisplayAnswer() : null}
                      />
                    </motion.div>
                  )}

                  {/* RESULTS STATE */}
                  {gameState === "results" && (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                      className="flex flex-col items-center gap-8 pb-16"
                    >
                      <h2
                        className="text-lg md:text-xl neon-text-amber"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}
                      >
                        GAME OVER
                      </h2>

                      <ResultsPrinter
                        score={score}
                        total={quizData.length}
                        show={gameState === "results"}
                      />

                      <button
                        onClick={handleShowLeaderboard}
                        className="mt-8 px-6 py-3 text-sm font-bold rounded border-2 border-[#ff00ff] text-[#ff00ff] bg-transparent hover:bg-[#ff00ff] hover:text-white transition-all duration-200"
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: "0.6rem",
                          boxShadow: "0 0 10px #ff00ff, 0 0 20px #ff00ff40",
                        }}
                      >
                        VIEW LEADERBOARD
                      </button>
                    </motion.div>
                  )}

                  {/* LEADERBOARD STATE */}
                  {gameState === "leaderboard" && (
                    <Leaderboard
                      key="leaderboard"
                      entries={leaderboardEntries}
                      highlightName={playerName}
                      onClose={resetGame}
                      onPlayAgain={playAgain}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Decorative arcade machine — bottom right */}
              <div className="hidden lg:block absolute bottom-0 right-0 w-48 opacity-30 pointer-events-none">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663662791301/PSmvNHNyTYQRBD2Us7ZtVW/neon-arcade-decoration-9PPSTAsiyYJ2sDyf7ojRYt.webp"
                  alt=""
                  className="w-full h-auto"
                />
              </div>
            </main>

            {/* Trick Question Popup */}
            <TrickPopup
              show={trickPopup.show}
              message={trickPopup.message}
              type={trickPopup.type}
              onClose={handleTrickPopupClose}
            />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}