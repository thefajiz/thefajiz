/**
 * Quiz Options Component
 * Design: Hand-drawn styled radio buttons with neon accents
 * Adapted from Uiverse.io by pharmacist-sabot, restyled for synthwave palette
 */
import "./QuizOptions.css";

interface QuizOptionsProps {
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
  disabled?: boolean;
  correctAnswer?: string | null;
}

export default function QuizOptions({
  options,
  selected,
  onSelect,
  disabled = false,
  correctAnswer = null,
}: QuizOptionsProps) {
  const getOptionClass = (option: string) => {
    if (!correctAnswer) return "";
    if (option === correctAnswer) return "correct";
    if (option === selected && option !== correctAnswer) return "incorrect";
    return "";
  };

  return (
    <div className="radio-group-synth">
      {options.map((option, idx) => (
        <label
          key={idx}
          className={`radio-synth ${getOptionClass(option)}`}
        >
          <input
            type="radio"
            name="quiz-option"
            value={option}
            checked={selected === option}
            onChange={() => !disabled && onSelect(option)}
            disabled={disabled}
          />
          <span className="radio-visual-synth">
            <span className="radio-dot-synth"></span>
          </span>
          <span className="radio-label-synth">{option}</span>
        </label>
      ))}
    </div>
  );
}
