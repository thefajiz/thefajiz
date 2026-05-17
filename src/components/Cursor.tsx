import { useEffect, useState } from "react";

export function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = "none";
    
    const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (isDesktop) {
      setEnabled(true);
      const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
      window.addEventListener("mousemove", move);
      return () => {
        window.removeEventListener("mousemove", move);
        document.body.style.cursor = "auto";
      };
    } else {
      document.body.style.cursor = "auto";
    }
  }, []);

  if (!enabled) return null;

  return (
    <div
      id="global-cursor"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: "#ffd700",
        boxShadow: "0 0 16px rgba(255, 215, 0, 0.9), 0 0 8px #c9a84c",
        transform: `translate(${pos.x - 6}px, ${pos.y - 6}px)`,
        pointerEvents: "none",
        zIndex: 9999,
        transition: "none",
        willChange: "transform",
      }}
    />
  );
}
