/**
 * Neon Navbar Component
 * Design: Synthwave arcade cabinet neon navigation bar
 * Adapted from user's provided navbar code
 */
import { useState } from "react";
import { Link } from "react-router-dom";

export default function NeonNavbar({ gameState = "idle" }: { gameState?: "idle" | "playing" | "results" }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "home", to: "/" },
    { label: "about", to: "/about" },
    { label: "work", to: "/work" },
    { label: "arcade", to: "/arcade" },
    { label: "contact", to: "/contact" },
    { label: "resume", to: "/resume" },
  ];

  return (
    <nav className="bg-[#0a0015] border-b-2 border-[#00ffff] shadow-[0_4px_20px_rgba(0,255,255,0.3)] p-4 font-mono relative z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl md:text-2xl font-bold text-[#00ffff] hover:text-[#fbe54f] transition duration-300 ease-out cursor-pointer"
          style={{ fontFamily: "'Press Start 2P', monospace", textShadow: "0 0 10px #00ffff" }}
        >
          arcade
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 items-center">
          {navItems.map((item, idx) => {
            const isArcade = item.label === "arcade";
            return (
              <li key={idx}>
                <Link
                  to={item.to}
                  className="relative group transition-all duration-300 text-sm"
                  style={{ 
                    fontFamily: "'Space Mono', monospace",
                    ...(isArcade ? {
                      background: "linear-gradient(90deg, #8b5cf6, #06b6d4)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    } : {
                      color: "#c9a84c"
                    })
                  }}
                >
                  {item.label}
                  <span 
                    className="absolute left-0 bottom-[-5px] w-full h-[2px] opacity-50 group-hover:opacity-100 transition-opacity"
                    style={{
                      backgroundColor: isArcade ? "#06b6d4" : "#c9a84c"
                    }}
                  ></span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#00ffff] hover:text-white transition-all duration-300 focus:outline-none"
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className={`${isOpen ? "block" : "hidden"} md:hidden bg-[#0a0015] border-t-2 border-[#00ffff] p-4 mt-4`}>
        <ul className="space-y-4">
          {navItems.map((item, idx) => {
            const isArcade = item.label === "arcade";
            return (
              <li key={idx}>
                <Link
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className="relative block text-lg font-bold transition-all duration-300"
                  style={{
                    ...(isArcade ? {
                      background: "linear-gradient(90deg, #8b5cf6, #06b6d4)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      display: "inline-block"
                    } : {
                      color: "#c9a84c"
                    })
                  }}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
