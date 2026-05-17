import { Layout } from "@/components/Layout";
import CharizardScene from "@/components/CharizardScene";

import { useEffect, useRef, useState } from "react";
import g1 from "@/assets/gallery/faji_photo.jpg";
import g2 from "@/assets/gallery/2.jpeg";
import g3 from "@/assets/gallery/5.jpeg";
import g4 from "@/assets/gallery/4.jpeg";
import g5 from "@/assets/gallery/3.jpeg";
import g6 from "@/assets/gallery/bgg.jpeg";

const gallery = [g1, g2, g3, g4, g5, g6];

// ── components ──────────────────────────────────────────────────────────────

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function OrnamentDivider() {
  return (
    <div className="flex items-center justify-center gap-6 my-16 opacity-30">
      <span className="text-[#c9a84c]">✦</span>
      <div className="w-24 h-px bg-[#c9a84c]" />
      <span className="text-[#c9a84c]">✦</span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] tracking-[0.3em] text-[#c9a84c] mb-6 uppercase">
      {children}
    </p>
  );
}

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

// ── main page ────────────────────────────────────────────────────────────────

export default function About() {
  const tickerItems = [
    "cookies", "roosi", "atleti",
    "pokemon", "marvel", "daredevil",
    "bueno", "family",
    "football", "develop",
    "code", "sleep", "travel",
    "friends", "malghoom", "ghee roast"
  ];

  return (
    <Layout backgroundAsset={<CharizardScene />}>
      <div className="text-[#d4cfc8] selection:bg-[#c9a84c33] selection:text-[#c9a84c]">
        <style>{`
          :root {
            text-transform: lowercase;
            letter-spacing: 0.15em;
          }
          h1, h2, h3, .serif {
            font-family: 'Cormorant Garamond', serif;
          }
          .marquee-container {
            overflow: hidden;
            background: #111;
            border-top: 1px solid rgba(201, 168, 76, 0.2);
            border-bottom: 1px solid rgba(201, 168, 76, 0.2);
            padding: 15px 0;
            white-space: nowrap;
          }
          .marquee-content {
            display: inline-block;
            animation: marquee 40s linear infinite;
          }
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .location-card {
            background: #141414;
            border: 1px solid #2a2a2a;
            border-top: 2px solid #c9a84c;
            border-radius: 4px;
          }
          .name-grid-item {
            border-left: 1px solid rgba(201, 168, 76, 0.3);
            padding-left: 12px;
          }
          .gallery-ticker-container {
            overflow: hidden;
            width: 100%;
            border-top: 1px solid #c9a84c;
            border-bottom: 1px solid #c9a84c;
            position: relative;
          }
          .gallery-ticker-content {
            display: flex;
            gap: 16px;
            width: max-content;
            animation: galleryScroll 25s linear infinite;
          }
          .gallery-ticker-content:hover {
            animation-play-state: paused;
          }
          @keyframes galleryScroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .gallery-image-wrapper {
            position: relative;
            flex-shrink: 0;
            overflow: hidden;
            border-radius: 4px;
            transition: transform 0.4s ease, border-color 0.4s ease;
            border: 1px solid transparent;
          }
          .gallery-image-wrapper:hover {
            transform: scale(1.03);
            border-color: #c9a84c;
            z-index: 10;
          }
          .gallery-ticker-image {
            height: 384px;
            width: auto;
            display: block;
            object-fit: cover;
          }
          .gallery-image-overlay {
            position: absolute;
            inset: 0;
            background: #c9a84c;
            opacity: 0;
            transition: opacity 0.4s ease;
            pointer-events: none;
          }
          .gallery-image-wrapper:hover .gallery-image-overlay {
            opacity: 0.1;
          }
          @media (max-width: 768px) {
            .gallery-ticker-image {
              height: 224px;
            }
          }
        `}</style>

        {/* ── section 1: hero ── */}
        <section className="px-6 md:px-12 pt-40 pb-20 max-w-6xl mx-auto">
          <Reveal>
            <h1 className="serif leading-[0.95] mb-6" style={{ fontSize: "clamp(3.5rem, 9vw, 7.5rem)" }}>
              <span className="text-[#f5f0e8]">just a human</span><br />
              <span className="text-[#c9a84c]">trying to be there.</span>
            </h1>
            <p className="text-[11px] tracking-[0.4em] text-[#888]">
              it administrator. developer. analyst. systems.
            </p>
            <OrnamentDivider />
          </Reveal>
        </section>

        {/* ── section 2: roots ── */}
        <section className="px-6 md:px-12 py-24 max-w-6xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24">
          <Reveal className="space-y-10">
            <div>
              <SectionLabel>where i'm from</SectionLabel>
              <h2 className="serif text-[#f5f0e8] text-4xl md:text-5xl leading-tight mb-8">
                born in western asia,<br />
                from the northern part<br />
                of the southernmost state<br />
                of india.
              </h2>
              <p className="text-lg leading-relaxed max-w-md">
                born in salmaniya, bahrain.<br />
                roots in kannur, kerala.<br />
                two places. one person.<br />
                somewhere between the arabian sea<br />
                and the malabar coast,<br />
                that's where this story starts.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100} className="flex flex-col items-center">
            <div className="w-full space-y-0 relative">
              <div className="location-card p-8">
                <PinIcon />
                <h3 className="serif text-3xl text-[#c9a84c] mt-4 mb-1">salmaniya</h3>
                <p className="text-[10px] text-[#888] tracking-[0.2em] mb-4">bahrain</p>
                <p className="text-sm italic">"where i opened my eyes."</p>
              </div>

              <div className="flex flex-col items-center py-6">
                <div className="w-px h-12 border-l border-dashed border-[#c9a84c] opacity-50" />
                <span className="text-[#c9a84c] my-2 text-xs">✦</span>
                <div className="w-px h-12 border-l border-dashed border-[#c9a84c] opacity-50" />
              </div>

              <div className="location-card p-8">
                <PinIcon />
                <h3 className="serif text-3xl text-[#c9a84c] mt-4 mb-1">kannur</h3>
                <p className="text-[10px] text-[#888] tracking-[0.2em] mb-4">kerala, india</p>
                <p className="text-sm italic">"where my roots breathe."</p>
              </div>
            </div>
            <p className="text-[10px] text-[#888] tracking-[0.3em] mt-10">
              3,000 km apart. same soul.
            </p>
          </Reveal>
        </section>

        {/* ── section 3: ticker ── */}
        <div className="py-20">
          <div className="marquee-container">
            <div className="marquee-content">
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span key={i} className="serif text-[#c9a84c] text-[1.1rem] tracking-[0.2em] mx-8">
                  {item} <span className="text-[#f5f0e8] ml-8">✦</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── section 4: who i am ── */}
        <section className="px-6 md:px-12 py-32 max-w-4xl mx-auto text-center">
          <div className="w-full h-px bg-[#c9a84c] opacity-20 mb-16" />
          <Reveal>
            <h2 className="serif text-[#f5f0e8] text-3xl md:text-5xl leading-tight mb-8">
              "give respect,take respect.<br />
              i respect, you respect.<br />
              that's how we roll."
            </h2>
            <p className="text-[11px] tracking-[0.3em] text-[#888]">
              keep it simple,<br />
              keep it light.
            </p>
          </Reveal>
          <div className="w-full h-px bg-[#c9a84c] opacity-20 mt-16" />
        </section>

        {/* ── section 5: family ── */}
        <section className="px-6 md:px-12 py-24 max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <Reveal>
            <SectionLabel>the people</SectionLabel>
            <h2 className="serif text-[#f5f0e8] text-4xl leading-snug">
              part of a family of ten.<br />
              loud, loving, and always around.<br />
              the kind you don't have to explain yourself to.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <div className="grid grid-cols-2 gap-x-8 gap-y-10">
              {[
                { name: "farook", role: "father" }, { name: "saikha", role: "mother" },
                { name: "fadhi", role: "brother" }, { name: "hameed", role: "brother" },
                { name: "akheel", role: "brother" }, { name: "ranan", role: "brother" },
                { name: "sara", role: "sister-in-law" }, { name: "sana", role: "sister-in-law" }
              ].map((member, i) => (
                <div key={i} className="name-grid-item">
                  <p className="serif text-2xl text-[#f5f0e8] tracking-[0.1em]">
                    <span className="text-[#c9a84c] opacity-50 mr-2">:</span>
                    {member.name}
                  </p>
                  <p className="text-[10px] text-[#888] tracking-[0.2em] mt-1 ml-6">{member.role}</p>
                </div>
              ))}
            </div>
            <div className="mt-16 pt-8 border-t border-[#c9a84c1a] text-center">
              <p className="serif italic text-[#c9a84c] text-lg tracking-[0.1em]">
                and kitty, the real head of the family. 🐾
              </p>
            </div>
          </Reveal>
        </section>

        {/* ── section: gallery ── */}
        <section className="py-24 w-full">
          <div className="max-w-6xl mx-auto px-6 md:px-12 flex items-end justify-between mb-12">
            <h2 className="serif text-[#f5f0e8]" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
              gallery
            </h2>
            <p className="text-[#c9a84c] text-[10px] tracking-[0.3em]">moments</p>
          </div>
          
          <div className="gallery-ticker-container">
            <div className="gallery-ticker-content">
              {[...gallery, ...gallery].map((src, i) => (
                <div key={i} className="gallery-image-wrapper">
                  <img
                    src={src}
                    alt={`thefajiz moment ${(i % 6) + 1}`}
                    loading="lazy"
                    className="gallery-ticker-image"
                  />
                  <div className="gallery-image-overlay" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── closing section ── */}
        <section className="px-6 md:px-12 py-32 max-w-4xl mx-auto text-center border-t border-[#c9a84c1a]">
          <Reveal>
            <h2 className="serif text-[#f5f0e8] text-4xl md:text-6xl mb-6">
              i build things.<br />
              but i care more about why.
            </h2>
            <p className="text-[11px] tracking-[0.3em] text-[#888] mb-12">
              thefajiz : somewhere between bahrain and kerala,<br />
              building things that matter.
            </p>
            <div className="text-[#c9a84c] opacity-40">✦</div>
          </Reveal>
        </section>
      </div>
    </Layout>
  );
}
