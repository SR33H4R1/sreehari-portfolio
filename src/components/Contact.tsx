import { profile } from "../data/profile";
import { Section } from "./Section";

const contactItems = [
  { label: "Email", value: profile.email, href: profile.links.email },
  ...(profile.links.github
    ? [{ label: "GitHub", value: formatPublicLink(profile.links.github), href: profile.links.github }]
    : []),
  ...(profile.links.linkedin
    ? [{ label: "LinkedIn", value: formatPublicLink(profile.links.linkedin), href: profile.links.linkedin }]
    : []),
  ...(profile.links.resume
    ? [{ label: "Resume", value: "Download PDF", href: profile.links.resume }]
    : []),
];

export function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="06 - Contact"
      title="Get in touch."
      sub="Open to AI Engineer / Applied AI Backend Engineer roles and serious collaborations."
    >
      <div className="contact-list">
        {contactItems.map((item) => (
          <a
            className="contact-row"
            key={item.label}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <span aria-hidden="true">-&gt;</span>
          </a>
        ))}
      </div>
    </Section>
  );
}

function formatPublicLink(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
