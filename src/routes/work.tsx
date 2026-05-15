import { Layout } from "@/components/Layout";
import celestiaCover from "@/assets/celestia.png";

const projects = [
  {
    name: "v",
    tag: "mental health · ai chatbot · research",
    desc: "a conversational ai designed to listen, understand, and support people navigating mental health. built on the belief that everyone deserves to feel heard — especially when they feel most alone.",
  },
  {
    name: "pawconnect",
    tag: "social impact · web platform",
    desc: "a digital hub connecting stray animals with people who care. built for the ones who can't speak for themselves — because someone has to.",
  },
  {
    name: "swirath luxury limousine",
    tag: "luxury · brand · web design",
    desc: "a premium digital experience for a high-end limousine brand. clean, dark, cinematic — because the website should feel as good as the ride.",
  },
];

const research = [
  { title: "designing emotional ai for mental wellness", tag: "research paper" },
  { title: "ethics of empathy in conversational systems", tag: "essay" },
];

export default function Work() {
  return (
    <Layout>
      <section className="px-6 md:px-12 pt-40 pb-20 max-w-6xl mx-auto">
        <h1 className="font-serif text-gold" style={{ fontSize: "clamp(4rem, 9vw, 8rem)" }}>
          work
        </h1>
        <p className="mt-4 text-xs tracking-widest-x text-muted">
          websites. systems. things built with a reason.
        </p>
      </section>

      <section className="px-6 md:px-12 pb-24 max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {projects.map((p) => (
          <article
            key={p.name}
            className="bg-card-ink border-t border-gold p-10"
            style={{ borderRadius: 4 }}
          >
            <h2 className="font-serif text-4xl text-ivory mb-3">{p.name}</h2>
            <p className="text-gold text-[10px] tracking-widest-x mb-6">{p.tag}</p>
            <p className="text-xs leading-relaxed text-ivory/70 mb-8">{p.desc}</p>
            <a className="text-gold border-b border-gold pb-1 text-xs tracking-widest-x">
              view project →
            </a>
          </article>
        ))}
      </section>

      <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto">
        <p className="text-gold text-xs tracking-widest-x mb-10">research & writing</p>
        <ul className="divide-y divide-gold/20">
          {research.map((r) => (
            <li key={r.title} className="py-6 flex items-center justify-between gap-6">
              <div>
                <p className="font-serif text-xl text-ivory">{r.title}</p>
                <p className="text-gold text-[10px] tracking-widest-x mt-1">{r.tag}</p>
              </div>
              <span className="text-gold">→</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Journal Content Merged */}
      <section className="px-6 md:px-12 pt-20 pb-10 max-w-6xl mx-auto">
        <p className="text-gold text-xs tracking-widest-x mb-4">journal</p>
        <p className="text-muted text-[10px] tracking-widest-x">thoughts, notes, things worth saying.</p>
      </section>

      <section className="px-6 md:px-12 pb-32 max-w-6xl mx-auto">
        <a
          href="https://drive.google.com/file/d/1_4rR4m6aFt-XHX5sNCt_6qaqiTCHrSdu/view?usp=drive_link"
          target="_blank"
          rel="noreferrer"
          className="group grid md:grid-cols-[280px_1fr] gap-8 md:gap-12 border border-gold/40 hover:border-gold transition-colors p-6 md:p-8"
          style={{ borderRadius: 4 }}
        >
          <div className="overflow-hidden" style={{ borderRadius: 2 }}>
            <img
              src={celestiaCover}
              alt="celestia — a psychological sci-fi thriller"
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[10px] tracking-widest-x text-muted">a book by thefajiz</p>
            <h2 className="font-serif text-gold mt-3" style={{ fontSize: "clamp(2.25rem, 4vw, 3.5rem)" }}>
              celestia
            </h2>
            <p className="mt-5 text-ivory/80 leading-relaxed text-sm md:text-base max-w-xl">
              celestia is a psychological sci-fi thriller that follows zara, a young woman haunted by recurring apocalyptic dreams and struggling with severe anger issues. as her reality slowly begins to blur with a mysterious dream world, she uncovers shocking truths about a rare condition known as "the celestia." the story combines emotional trauma, mystery, friendship, and suspense while exploring themes of loneliness, mental instability, and human connection.
            </p>
            <span className="mt-6 text-xs tracking-widest-x text-gold group-hover:opacity-70 transition-opacity">
              read on drive →
            </span>
          </div>
        </a>
      </section>
    </Layout>
  );
}
