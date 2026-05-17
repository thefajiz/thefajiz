import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/", label: "home" },
  { to: "/about", label: "about" },
  { to: "/work", label: "work" },
  { to: "/arcade", label: "arcade" },
  { to: "/contact", label: "contact" },
  { to: "/resume", label: "resume" },
] as const;

export function Nav({ isVisible = true }: { isVisible?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [loc.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{ 
        background: scrolled || open ? "#0f0f0f" : "transparent",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(-20px)",
        pointerEvents: isVisible ? "auto" : "none",
        transition: "opacity 0.3s ease, transform 0.3s ease, background 0.3s ease"
      }}
    >
      <div className="flex items-center justify-between px-6 md:px-12 h-16 md:h-20">
        <Link to="/" className="flex items-center" aria-label="thefajiz home">
          <img 
            src="/logo.png" 
            alt="thefajiz" 
            className="w-auto" 
            style={{ 
              height: open ? "32px" : (window.innerWidth <= 768 ? "32px" : "36px"),
              objectFit: "contain" 
            }} 
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-10 text-xs tracking-widest-x">
          {links.map((l) => {
            const active = loc.pathname === l.to;
            const isArcade = l.label === "arcade";
            const gradientStyle = isArcade ? {
              background: "linear-gradient(90deg, #8b5cf6, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              WebkitTextStroke: "0px"
            } : undefined;

            return (
              <Link
                key={l.to}
                to={l.to}
                className={`stroke-button${active ? " active-btn" : ""}`}
                style={gradientStyle}
              >
                {l.label}
                <span 
                  className="hover-text" 
                  aria-hidden="true"
                  style={isArcade ? {
                    background: "linear-gradient(90deg, #8b5cf6, #06b6d4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    WebkitTextStroke: "0px",
                    borderRightColor: "#06b6d4"
                  } : undefined}
                >
                  {l.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden text-gold flex items-center justify-center"
          onClick={() => setOpen(!open)}
          aria-label={open ? "close menu" : "open menu"}
          style={{ color: "#c9a84c" }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden overflow-hidden bg-[#0f0f0f] border-b border-[rgba(201,168,76,0.2)]"
          >
            <div className="flex flex-col">
              {links.map((l, index) => {
                const isArcade = l.label === "arcade";
                const isCurrent = loc.pathname === l.to;
                return (
                  <div key={l.to} className="flex flex-col">
                    <Link
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className="px-6 py-4 lowercase"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.75rem",
                        letterSpacing: "0.2em",
                        color: isCurrent ? "#c9a84c" : "#f5f0e8",
                        transition: "color 0.2s ease",
                        ...(isArcade ? {
                          background: "linear-gradient(90deg, #8b5cf6, #06b6d4)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          display: "inline-block"
                        } : {})
                      }}
                      onMouseEnter={(e) => {
                        if (!isArcade) {
                          e.currentTarget.style.color = "#c9a84c";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isArcade && !isCurrent) {
                          e.currentTarget.style.color = "#f5f0e8";
                        }
                      }}
                    >
                      {l.label}
                    </Link>
                    {index < links.length - 1 && (
                      <div style={{ height: "1px", background: "rgba(201,168,76,0.15)", width: "100%" }} />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
