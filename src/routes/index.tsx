import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Star } from "@/components/Ornament";
import { HeroArt, ArchwayArt } from "@/components/HeroArt";
import DepthGlobe from "@/components/DepthGlobe";
import { SocialRail } from "@/components/SocialRail";
import { TornEdge } from "@/components/TornEdge";
import { VOrnament } from "@/components/VOrnament";
import LightRays from "@/components/LightRays";
import LandingEntry from "@/components/LandingEntry";

const projects = [
  { name: "v", tag: "mental health · ai chatbot", desc: "built to listen. for everyone who needed someone and found no one." },
  { name: "pawconnect", tag: "social impact · web platform", desc: "a voice for the ones who have none." },
  { name: "swirath", tag: "luxury · web design", desc: "where every pixel matches the ride." },
];

if (typeof window !== "undefined") {
  window.history.scrollRestoration = "manual"
}

export default function Home() {
  const [appPhase, setAppPhase] = useState<"loading" | "entry" | "home">("loading");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
  }, []);

  return (
    <>
      {appPhase === "loading" && (
        <Layout skipLoader={false} onLoaderComplete={() => setAppPhase("entry")} hideNav>
          <div style={{ opacity: 0 }} />
        </Layout>
      )}

      {appPhase === "entry" && (
        <>
          <LandingEntry onCollapsed={() => {
            setAppPhase("home")
            window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
          }} />
          <div style={{ height: "200vh", pointerEvents: "none" }} />
        </>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: appPhase === "home" ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ pointerEvents: appPhase === "home" ? "auto" : "none" }}
      >
        <Layout hideNav={appPhase !== "home"} skipLoader>
          {/* HERO */}
          <section
            className="min-h-screen pt-32 pb-20 grid md:grid-cols-2 gap-12 items-center relative overflow-hidden"
            style={{ paddingLeft: "max(1.5rem, 6vw)", paddingRight: "max(1.5rem, 4vw)" }}
          >
        <LightRays
          intensity={45}
          rays={25}
          reach={35}
          position={65}
          speed={8}
          color1="#c9a84c"
          color2="#8B6914"
        />
        
        <Star className="absolute top-32 left-1/2" size={10} style={{ zIndex: 1 }} />
        <Star className="absolute bottom-40 right-1/3" size={12} style={{ zIndex: 1 }} />
        <Star className="absolute top-1/2 right-10" size={8} style={{ zIndex: 1 }} />

        <div className="relative z-10">
          <h1 className="font-serif leading-[0.95]" style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)" }}>
            <span className="block text-ivory">muhammad</span>
            <span className="block text-ivory">fajis,</span>
            <span className="block text-gold">entry level</span>
            <span className="block text-ivory">human.</span>
          </h1>
          <div className="mt-8 w-px h-16 bg-gold/60" />
          <p className="mt-8 max-w-md text-xs leading-loose tracking-widest-x text-ivory/80">
            a simple man, wanting a simple life, making differences.
          </p>
          <Link
            to="/work"
            className="mt-10 inline-flex items-center gap-3 text-gold text-xs tracking-widest-x border-b border-gold pb-1"
          >
            explore my work <Star size={10} />
          </Link>
        </div>

        <div className="relative z-10 flex justify-center md:justify-end mt-12 md:-mt-36 w-full max-w-[360px] md:max-w-none mx-auto pointer-events-auto">
          <DepthGlobe size={560} />
        </div>
      </section>

      <VOrnament />

      {/* WORK PREVIEW */}
      <section className="px-6 md:px-12 py-16 max-w-6xl mx-auto">
        <p className="text-gold text-xs tracking-widest-x mb-12 text-center md:text-left">selected work</p>
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <Link
              key={p.name}
              to="/work"
              className="block bg-card-ink border-t border-gold p-8 hover:bg-[#181818] transition-colors"
              style={{ borderRadius: 4 }}
            >
              <h3 className="font-serif text-3xl text-ivory mb-2">{p.name}</h3>
              <p className="text-gold text-[10px] tracking-widest-x mb-6">{p.tag}</p>
              <p className="text-xs leading-relaxed text-ivory/70 mb-6">{p.desc}</p>
              <span className="text-gold text-xs tracking-widest-x">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* TORN EDGE TRANSITION */}
      <div className="mt-16">
        <TornEdge />
      </div>

      {/* ABOUT STRIP : sits over torn paper */}
      <section
        className="px-6 md:px-12 py-24 grid md:grid-cols-3 gap-10 items-center"
        style={{ background: "#f5f0e8", color: "#0a0a0a" }}
      >
        <div className="flex justify-center md:justify-start" style={{ background: "#0a0a0a", padding: "2rem", borderRadius: 4 }}>
          <ArchwayArt />
        </div>
        <h2 className="font-serif text-center" style={{ fontSize: "clamp(1.6rem, 3vw, 2.5rem)", color: "#0a0a0a" }}>
          i build things, but i care more about why.
        </h2>
        <div className="text-center md:text-right">
          <p className="font-serif text-xl leading-snug inline-block text-center md:text-right" style={{ color: "#7a5a14" }}>
            it is not<br />just what<br />it does.<br />it's who<br />it helps.
          </p>
          <div className="mt-6">
            <Link
              to="/about"
              className="inline-block border-b pb-1 text-xs tracking-widest-x"
              style={{ color: "#7a5a14", borderColor: "#7a5a14" }}
            >
              more about me →
            </Link>
          </div>
        </div>
      </section>

      <TornEdge flip />

      {/* PRE-FOOTER: tagline + socials */}
      <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <p className="font-serif text-ivory leading-snug text-center md:text-left" style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.2rem)" }}>
          im better than any ai's and llms out there<br />
          and i use less water aswell,<br />
          <span className="text-gold">so hit me up.</span>
        </p>
        <div className="flex justify-center md:justify-end">
          <SocialRail />
        </div>
          </section>
        </Layout>
      </motion.div>
    </>
  );
}
