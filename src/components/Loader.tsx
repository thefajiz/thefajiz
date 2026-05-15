import { useEffect, useState } from "react";

export function Loader({ onComplete }: { onComplete?: () => void }) {
  const [hide, setHide] = useState(false);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setHide(true), 100);
    const t2 = setTimeout(() => {
      setGone(true);
      onComplete?.();
    }, 300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);
  if (gone) return null;
  return (
    <div className={`loader-overlay${hide ? " hide" : ""}`} aria-hidden>
      <div className="loading">
        <svg width="64px" height="48px">
          <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="back"></polyline>
          <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="front"></polyline>
        </svg>
      </div>
    </div>
  );
}