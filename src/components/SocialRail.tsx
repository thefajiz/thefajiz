import { Instagram, Linkedin, Mail, MessageCircle } from "lucide-react";

const socials = [
  { Icon: Instagram, label: "instagram", href: "https://www.instagram.com/fajiz._/" },
  { Icon: Linkedin, label: "linkedin", href: "https://www.linkedin.com/in/thefajis/" },
  { Icon: Mail, label: "email", href: "mailto:thefajiz@gmail.com" },
  { Icon: MessageCircle, label: "whatsapp", href: "https://wa.me/97336636426" },
];

export function SocialRail() {
  return (
    <div className="flex flex-col gap-5 items-start">
      {socials.map(({ Icon, label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="flex items-center text-gold hover:opacity-70 transition-opacity text-[10px] tracking-widest-x"
          style={{ gap: 10 }}
        >
          <Icon size={16} color="#c9a84c" strokeWidth={1.2} />
          <span>{label}</span>
        </a>
      ))}
    </div>
  );
}
