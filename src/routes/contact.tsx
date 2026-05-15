import { Layout } from "@/components/Layout";
import { Instagram, Linkedin, Mail, MessageCircle } from "lucide-react";

const links = [
  { Icon: Instagram, label: "instagram", handle: "@fajiz._", href: "https://www.instagram.com/fajiz._/" },
  { Icon: Linkedin, label: "linkedin", handle: "thefajis", href: "https://www.linkedin.com/in/thefajis/" },
  { Icon: Mail, label: "email", handle: "thefajiz@gmail.com", href: "mailto:thefajiz@gmail.com" },
  { Icon: MessageCircle, label: "whatsapp", handle: "+973 3663 6426", href: "https://wa.me/97336636426" },
];

export default function Contact() {
  return (
    <Layout>
      <section className="px-6 md:px-12 pt-40 pb-16 max-w-6xl mx-auto">
        <h1 className="font-serif text-gold" style={{ fontSize: "clamp(4rem, 9vw, 8rem)" }}>
          contact
        </h1>
        <p className="mt-4 text-xs tracking-widest-x text-muted">
          i don't bite. usually.
        </p>
      </section>

      <section className="px-6 md:px-12 pb-24 max-w-3xl mx-auto">
        <ul className="space-y-8">
          {links.map(({ Icon, label, handle, href }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-6 py-4 border-b border-gold/20 hover:border-gold transition-colors group"
              >
                <span className="flex items-center" style={{ gap: 14 }}>
                  <Icon size={18} color="#c9a84c" strokeWidth={1.2} />
                  <span className="text-xs tracking-widest-x text-ivory group-hover:text-gold transition-colors">
                    {label}
                  </span>
                </span>
                <span className="text-xs tracking-widest-x text-muted group-hover:text-gold transition-colors">
                  {handle}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-6 pb-20 text-center">
        <p className="text-xs tracking-widest-x text-muted">made with purpose. for people.</p>
      </section>
    </Layout>
  );
}
