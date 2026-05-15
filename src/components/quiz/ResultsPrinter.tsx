/**
 * Results Printer Component
 * Design: Receipt printer that "prints" quiz results
 * Adapted from Uiverse.io by dexter-st, restyled for synthwave palette
 */
import { useEffect, useRef } from "react";
import "./ResultsPrinter.css";

interface ResultsPrinterProps {
  score: number;
  total: number;
  show: boolean;
}

export default function ResultsPrinter({ score, total, show }: ResultsPrinterProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (show && buttonRef.current) {
      // Trigger the print animation by focusing the button
      setTimeout(() => {
        buttonRef.current?.focus();
      }, 300);

      // Printer sound
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const duration = 1.2;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        // Buzzy dot-matrix rattle
        data[i] = (Math.random() * 2 - 1) * 0.15 * Math.sin(i / 8);
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      // Add a bandpass filter to make it sound more mechanical
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 800;
      filter.Q.value = 0.8;

      source.connect(filter);
      filter.connect(ctx.destination);
      source.start();
      source.stop(ctx.currentTime + duration);
    }
  }, [show]);

  const percentage = Math.round((score / total) * 100);
  const grade =
    percentage >= 90 ? "S" :
    percentage >= 70 ? "A" :
    percentage >= 50 ? "B" :
    percentage >= 30 ? "C" : "F";

  const message =
    percentage >= 90 ? "You truly know me!" :
    percentage >= 70 ? "Pretty impressive!" :
    percentage >= 50 ? "Not bad at all!" :
    percentage >= 30 ? "We need to hang out more..." : "Are we even friends?!";

  return (
    <div className={`wrapper-synth ${show ? "active" : ""}`}>
      <div className="printer-synth">
        <div className="printer-display-synth">
          <span className="printer-message-synth">QUIZ COMPLETE</span>
        </div>
        <button ref={buttonRef} className="print-button-synth" tabIndex={-1}>
          🖨️
        </button>
      </div>
      <div className="receipt-wrapper-synth">
        <div className="receipt-synth">
          <div className="receipt-header-synth">
            <span>QUIZ RESULTS</span>
            <span className="logo-synth">🏆</span>
          </div>
          <div className="receipt-subheader-synth">
            <span>Personal Quiz</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <table className="receipt-table-synth">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Correct</td>
                <td>{score}/{total}</td>
              </tr>
              <tr>
                <td>Accuracy</td>
                <td>{percentage}%</td>
              </tr>
              <tr className="receipt-total-synth">
                <td>Grade</td>
                <td>{grade}</td>
              </tr>
            </tbody>
          </table>
          <div className="receipt-message-synth">
            <span className="letter-wrapper-synth">
              {message.split("").map((char, i) => (
                <span key={i} className="letter-synth" style={{ animationDelay: `${i * 0.05}s` }}>
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
