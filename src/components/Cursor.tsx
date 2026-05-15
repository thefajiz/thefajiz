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
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: "#c9a84c",
        boxShadow: "0 0 12px rgba(201,168,76,0.6)",
        transform: `translate(${pos.x - 4}px, ${pos.y - 4}px)`,
        pointerEvents: "none",
        zIndex: 9999,
        transition: "none",
        willChange: "transform",
      }}
    />
  );
}
