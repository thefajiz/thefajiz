import { Layout } from "@/components/Layout";
import { useEffect, useRef, useState } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

// ── data ────────────────────────────────────────────────────────────────────

const itSystemsRadar = [
  { subject: "it support", A: 92 },
  { subject: "networking", A: 85 },
  { subject: "security", A: 78 },
  { subject: "databases", A: 80 },
  { subject: "development", A: 85 },
  { subject: "ai / ml", A: 72 },
];

const softwareEngRadar = [
  { subject: "frontend", A: 90 },
  { subject: "backend", A: 85 },
  { subject: "databases", A: 82 },
  { subject: "ai / ml", A: 88 },
  { subject: "devops", A: 70 },
  { subject: "research", A: 85 },
];

const commonLanguages = [
  { name: "python", level: 90 },
  { name: "react.js", level: 85 },
  { name: "sql/mysql", level: 80 },
  { name: "mongodb", level: 75 },
  { name: "php", level: 70 },
  { name: "c/c++", level: 65 },
  { name: "java", level: 60 },
];

const seLanguages = [
  ...commonLanguages,
  { name: "c#", level: 70 },
];

const itSkillCards = [
  {
    title: "systems",
    items: ["windows", "microsoft office", "smart boards", "mdm systems"],
  },
  {
    title: "networking",
    items: ["lan/wan fundamentals", "connectivity troubleshooting", "cisco networking academy"],
  },
  {
    title: "security",
    items: ["cctv & access control", "owasp fundamentals", "cloud computing basics"],
  },
  {
    title: "databases",
    items: ["sql", "mysql", "mongodb"],
  },
];

const seProjectCards = [
  {
    name: "v – ai mental health chatbot",
    tag: "python · react.js · mongodb · gpt/gemini api · rag",
    description: "best project award, arab open university. a conversational ai built to support people navigating mental health.",
    year: "2025–26",
  },
  {
    name: "pawconnect – stray animal welfare hub",
    tag: "react.js · mongodb atlas · jwt · analytics",
    description: "community platform connecting stray animals with people who care.",
    year: "2025–26",
  },
  {
    name: "academiq – academic risk detection system",
    tag: "analytics · risk scoring · glassmorphism ui",
    description: "performance prediction dashboard featuring analytics and risk scoring.",
    year: "2025–26",
  },
  {
    name: "traffic data analysis – ministry of works",
    tag: "data analytics · national infrastructure",
    description: "data collection and analytics supporting national road development initiatives.",
    year: "2025",
  },
];

const experienceEntries = [
  {
    role: "alhekma international school — it administrator",
    company: "alhekma international school",
    location: "sanad, bahrain",
    period: "oct – dec 2025",
    points: [
      "implemented smart board automated bell system",
      "delivered daily hardware and software troubleshooting support",
    ],
  },
  {
    role: "al rabeeh medical group — it system administration intern",
    company: "al rabeeh medical group",
    location: "bahrain",
    period: "may – sep 2025",
    points: [
      "maintained php-based systems and assisted with database management",
      "supported it documentation and internal technical operations",
    ],
  },
  {
    role: "bahrain asian youth games — it support team member",
    company: "bahrain asian youth games",
    location: "khalifa sports city",
    period: "oct 2025",
    points: [
      "resolved connectivity and system issues across multiple venues",
    ],
  },
  {
    role: "88 rent a car / ad dar media — admin it & digital support",
    company: "88 rent a car / ad dar media",
    location: "bahrain",
    period: "",
    points: [
      "managed databases, scheduling systems, customer records, and digital workflows",
    ],
  },
];

const educationData = [
  {
    institution: "arab open university bahrain",
    degree: "b.sc. information technology (hons) · 2022 – 2026",
    details: "",
  },
  {
    institution: "cisco networking academy",
    degree: "modern ai – entry level (2026 – present)",
    details: "",
  },
];

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
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function SectionDivider() {
  return <div className="w-full h-px bg-[#c9a84c] opacity-20 my-16" />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] tracking-[0.25em] text-[#c9a84c] mb-6">
      {children}
    </p>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#141414] border border-[#2a2a2a] p-2 text-[10px] text-[#f5f0e8]">
        {payload[0].value}%
      </div>
    );
  }
  return null;
}

// ── main page ────────────────────────────────────────────────────────────────

export default function ResumePage() {
  const [activeTab, setActiveTab] = useState<"it" | "se">("it");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTabChange = (tab: "it" | "se") => {
    if (tab === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTransitioning(false);
    }, 300);
  };

  const currentRadar = activeTab === "it" ? itSystemsRadar : softwareEngRadar;
  const currentLanguages = activeTab === "it" ? commonLanguages : seLanguages;

  return (
    <Layout>
      <div className="min-h-screen bg-[#0a0a0a] text-[#d4cfc8] selection:bg-[#c9a84c33] selection:text-[#c9a84c] pb-32">
        <style>{`
          :root {
            text-transform: lowercase;
            letter-spacing: 0.15em;
            font-family: 'Inter', sans-serif;
          }
          h1, h2, h3, h4, .serif {
            font-family: 'Cormorant Garamond', serif;
          }
          .tab-button {
            border: 1px solid #333;
            color: #666;
            transition: all 0.4s ease;
          }
          .tab-button.active {
            border-color: #c9a84c;
            color: #c9a84c;
            background: transparent;
          }
          .card {
            background: #141414;
            border: 1px solid #2a2a2a;
            border-top: 2px solid #c9a84c;
            border-radius: 4px;
            transition: transform 0.3s ease;
          }
          .skill-fill {
            background: linear-gradient(90deg, #8B6914, #c9a84c, #e8d5a3);
          }
          .download-btn {
            border: 1px solid #c9a84c;
            color: #c9a84c;
            background: transparent;
            transition: all 0.4s ease;
            border-radius: 4px;
          }
          .download-btn:hover {
            background: #c9a84c;
            color: #0a0a0a;
          }
          .fade-exit {
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
          }
          .fade-enter {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 0.3s ease, transform 0.3s ease;
          }
          @media (max-width: 768px) {
            .grid-cols-2 { grid-template-columns: 1fr; }
            .grid-cols-4 { grid-template-columns: 1fr; }
          }
          .sticky-tabs {
            position: sticky;
            top: 80px; /* Adjust based on navbar height */
            z-index: 40;
            background: rgba(10, 10, 10, 0.8);
            backdrop-filter: blur(8px);
            padding: 20px 0;
          }
        `}</style>

        <div className="max-w-4xl mx-auto px-6">
          {/* ── hero ── */}
          <header className="pt-24 pb-12 text-center">
            <Reveal>
              <h1 className="text-6xl md:text-8xl font-light text-[#f5f0e8] mb-4">resume</h1>
              <p className="text-sm text-[#c9a84c] tracking-[0.4em]">muhammad fajis</p>
            </Reveal>
          </header>

          {/* ── tabs ── */}
          <div className="sticky-tabs flex justify-center gap-4 mb-12">
            <button
              onClick={() => handleTabChange("it")}
              className={`tab-button px-6 py-2 rounded-full text-sm font-medium ${activeTab === "it" ? "active" : ""}`}
            >
              it & systems
            </button>
            <button
              onClick={() => handleTabChange("se")}
              className={`tab-button px-6 py-2 rounded-full text-sm font-medium ${activeTab === "se" ? "active" : ""}`}
            >
              software engineering
            </button>
          </div>

          <div className={`${isTransitioning ? "fade-exit" : "fade-enter"}`}>
            {/* ── section 1: competency ── */}
            <section className="mb-20">
              <Reveal>
                <SectionLabel>competency overview</SectionLabel>
                <div className="card p-8 min-h-[350px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={currentRadar}>
                      <PolarGrid stroke="#2a2a2a" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "#f5f0e8", fontSize: 11, letterSpacing: "0.1em" }}
                      />
                      <Radar
                        name="proficiency"
                        dataKey="A"
                        stroke="#c9a84c"
                        fill="#c9a84c"
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Reveal>
            </section>

            <SectionDivider />

            {/* ── section 2: languages ── */}
            <section className="mb-20">
              <Reveal>
                <SectionLabel>programming languages</SectionLabel>
                <div className="card p-8">
                  <div className="space-y-6">
                    {currentLanguages.map((lang, idx) => (
                      <div key={lang.name}>
                        <div className="flex justify-between text-xs mb-2 text-[#f5f0e8]">
                          <span>{lang.name}</span>
                          <span className="opacity-50">{lang.level}%</span>
                        </div>
                        <div className="h-[6px] bg-[#2a2a2a] rounded-full overflow-hidden">
                          <div
                            className="h-full skill-fill transition-all duration-1000"
                            style={{ width: `${lang.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </section>

            <SectionDivider />

            {/* ── section 3: cards (skills or projects) ── */}
            <section className="mb-20">
              <Reveal>
                <SectionLabel>{activeTab === "it" ? "skill sets" : "selected projects"}</SectionLabel>
                <div className="grid grid-cols-2 gap-6">
                  {activeTab === "it" ? (
                    itSkillCards.map((card, idx) => (
                      <div key={card.title} className="card p-6">
                        <h3 className="text-xl text-[#c9a84c] mb-4">{card.title}</h3>
                        <ul className="space-y-3">
                          {card.items.map((item) => (
                            <li key={item} className="text-sm text-[#f5f0e8] flex items-center gap-3">
                              <span className="text-[#c9a84c]">—</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    seProjectCards.map((project, idx) => (
                      <div key={project.name} className="card p-6 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-2xl text-[#c9a84c] leading-tight">{project.name}</h3>
                          <span className="text-[10px] text-[#666] mt-1">{project.year}</span>
                        </div>
                        <p className="text-[10px] tracking-widest text-[#c9a84c] mb-4">{project.tag}</p>
                        <p className="text-sm text-[#f5f0e8] leading-relaxed flex-grow">
                          "{project.description}"
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </Reveal>
            </section>

            <SectionDivider />

            {/* ── section 4: experience ── */}
            <section className="mb-20">
              <Reveal>
                <SectionLabel>experience</SectionLabel>
                <div className="relative pl-8 border-l border-[#c9a84c33]">
                  {experienceEntries.map((exp, idx) => (
                    <div key={idx} className="mb-12 relative">
                      <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-[#0a0a0a] border border-[#c9a84c]" />
                      <h3 className="text-2xl text-[#c9a84c] italic mb-1">{exp.role}</h3>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-[#f5f0e8] opacity-80">{exp.company}</span>
                        <span className="text-xs text-[#666]">{exp.period}</span>
                      </div>
                      <ul className="space-y-2">
                        {exp.points.map((point, pIdx) => (
                          <li key={pIdx} className="text-sm text-[#d4cfc8] leading-relaxed flex items-start gap-3">
                            <span className="text-[#c9a84c] mt-1.5">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>

            <SectionDivider />

            {/* ── section 5: education ── */}
            <section className="mb-24">
              <Reveal>
                <SectionLabel>education</SectionLabel>
                <div className="space-y-8">
                  {educationData.map((edu, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-2">
                      <h3 className="text-2xl text-[#f5f0e8] italic">{edu.institution}</h3>
                      <p className="text-sm text-[#d4cfc8]">{edu.degree}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* ── download ── */}
            <Reveal className="text-center">
              {activeTab === "it" ? (
                <a 
                  href="/cv-it.pdf" 
                  download="Muhammad_Fajis_IT_CV.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="download-btn w-full block py-6 text-sm tracking-[0.3em] font-medium"
                >
                  download it résumé ↓
                </a>
              ) : (
                <a 
                  href="/cv-se.pdf" 
                  download="Muhammad_Fajis_SE_CV.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="download-btn w-full block py-6 text-sm tracking-[0.3em] font-medium"
                >
                  download se résumé ↓
                </a>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </Layout>
  );
}
