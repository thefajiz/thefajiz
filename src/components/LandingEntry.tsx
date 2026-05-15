import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Instagram, Linkedin, Mail, MessageCircle, Menu } from "lucide-react"

const NAV_LINKS = [
  { label: "home",    to: "/" },
  { label: "about",   to: "/about" },
  { label: "work",    to: "/work" },
  { label: "try", to: "/try" },
  { label: "contact", to: "/contact" },
  { label: "resume",  to: "/resume" },
]

interface Props { onCollapsed: () => void }

export default function LandingEntry({ onCollapsed }: Props) {
  const [phase, setPhase] = useState<"entry" | "animating" | "exiting" | "done">("entry")
  const navigate = useNavigate()
  const triggered = useRef(false)

  // Always reset scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    window.history.scrollRestoration = "manual"
  }, [])

  // Trigger on scroll or touch
  useEffect(() => {
    if (phase !== "entry") return
    
    const trigger = () => {
      if (triggered.current) return
      triggered.current = true
      window.scrollTo(0, 0)
      setPhase("animating")
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if (["ArrowDown", "Space", "PageDown"].includes(e.key)) {
        trigger()
      }
    }

    window.addEventListener("scroll", trigger, { passive: true })
    window.addEventListener("wheel", trigger, { passive: true })
    window.addEventListener("touchmove", trigger, { passive: true })
    window.addEventListener("touchstart", trigger, { passive: true })
    window.addEventListener("keydown", handleKeydown)
    
    return () => {
      window.removeEventListener("scroll", trigger)
      window.removeEventListener("wheel", trigger)
      window.removeEventListener("touchmove", trigger)
      window.removeEventListener("touchstart", trigger)
      window.removeEventListener("keydown", handleKeydown)
    }
  }, [phase])

  // Sequence of transitions
  useEffect(() => {
    if (phase === "animating") {
      const t = setTimeout(() => {
        setPhase("exiting")
      }, 950)
      return () => clearTimeout(t)
    }
  }, [phase])

  useEffect(() => {
    if (phase === "exiting") {
      const t = setTimeout(() => {
        // Cleanup body styles before calling onCollapsed
        document.body.style.overflow = ""
        document.documentElement.style.overflow = ""
        
        onCollapsed()
        setPhase("done")
      }, 500)
      return () => clearTimeout(t)
    }
  }, [phase, onCollapsed])

  if (phase === "done") return null

  const isAnimating = phase === "animating" || phase === "exiting"
  const isExiting = phase === "exiting"

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="landing-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#0a0a0a",
            touchAction: phase === "entry" ? "none" : "auto",
            pointerEvents: phase === "entry" ? "auto" : "none",
          }}
        >
          {/* Gold glow background */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.12) 0%, transparent 65%)",
          }} />

          {/* "thefajiz" — stays centered and large, fades out */}
          <motion.div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
            animate={isAnimating ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(18vw, 22vw, 28vw)",
              color: "#f5f0e8",
              fontWeight: 300,
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
              textTransform: "lowercase",
              lineHeight: 1,
              userSelect: "none",
            }}>
              thefajiz
            </div>
          </motion.div>

          {/* ANIMATED NAVBAR — slides DOWN from above */}
          <motion.div
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: "clamp(56px, 8vh, 80px)",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 clamp(20px, 5vw, 36px)",
              background: "rgba(10,10,10,0.95)",
              pointerEvents: isAnimating ? "auto" : "none",
            }}
            initial={{ y: "-100%" }}
            animate={isAnimating ? { y: 0 } : { y: "-100%" }}
            transition={{
              duration: 0.65,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Logo left */}
            <div style={{
              display: "flex",
              alignItems: "center",
            }}>
              <img 
                src="/logo.png" 
                alt="thefajiz" 
                style={{ height: "32px", width: "auto", objectFit: "contain" }}
              />
            </div>

            {/* Nav links (Desktop) or Menu icon (Mobile) */}
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* Desktop Links */}
              <div className="hidden md:flex" style={{
                gap: "clamp(16px, 2.5vw, 40px)",
                alignItems: "center",
              }}>
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 15 }}
                    animate={isAnimating ? { opacity: 1, x: 0 } : { opacity: 0, x: 15 }}
                    transition={{
                      duration: 0.4,
                      delay: isAnimating ? 0.25 + i * 0.06 : 0,
                      ease: "easeOut",
                    }}
                    onClick={() => {
                      setPhase("exiting")
                      if (link.to !== "/") navigate(link.to)
                    }}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.68rem",
                      letterSpacing: "0.18em",
                      color: "#f5f0e8",
                      textTransform: "lowercase",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#c9a84c"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#f5f0e8"}
                  >
                    {link.label}
                  </motion.div>
                ))}
              </div>

              {/* Mobile Menu Icon */}
              <div className="md:hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isAnimating ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Menu size={22} color="#c9a84c" />
                </motion.div>
              </div>
            </div>

            {/* Thin gold bottom border */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isAnimating ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              style={{
                position: "absolute",
                bottom: 0, left: 0, right: 0,
                height: "1px",
                background: "rgba(201,168,76,0.2)",
              }}
            />
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            animate={isAnimating ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              bottom: "clamp(24px, 5vh, 40px)",
              left: 0, right: 0,
              textAlign: "center",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              color: "#555",
              textTransform: "lowercase",
              pointerEvents: "none",
              zIndex: 3,
            }}
          >
            scroll down ↓
          </motion.div>

          {/* Social icons (Desktop Only) */}
          <motion.div
            className="hidden md:flex"
            animate={isAnimating ? { opacity: 0 } : { opacity: 0.55 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              bottom: 28, right: 36,
              gap: 18, zIndex: 3,
            }}
          >
            {[
              { Icon: Instagram, href: "https://www.instagram.com/fajiz._/" },
              { Icon: Linkedin,  href: "https://www.linkedin.com/in/thefajiz/" },
              { Icon: Mail,      href: "mailto:thefajiz@gmail.com" },
              { Icon: MessageCircle, href: "https://wa.me/97336636426" },
            ].map(({ Icon, href }) => (
              <a key={href} href={href} target="_blank" rel="noreferrer"
                style={{ color: "#c9a84c", transition: "opacity 0.2s" }}
              >
                <Icon size={15} />
              </a>
            ))}
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
