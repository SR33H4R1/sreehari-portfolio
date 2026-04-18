import { navItems, profile } from "../data/profile";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-wordmark">
        <a href="#top">{profile.name}<span>.</span></a>
        <p>AI Engineer <span>/</span> Backend-First GenAI Systems</p>
      </div>
      <div className="footer-grid">
        <div>
          <span>Navigate</span>
          {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </div>
        <div>
          <span>Elsewhere</span>
          <a href={profile.links.github}>GitHub -&gt;</a>
          <a href={profile.links.linkedin}>LinkedIn -&gt;</a>
          <a href={profile.links.email}>Email -&gt;</a>
        </div>
        <div>
          <span>Colophon</span>
          <p>Built with React, TypeScript, Framer Motion, and hand-written CSS. No trackers.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>(c) 2026 Sreehari</span>
        <span>v2026.2 / Vercel-ready</span>
      </div>
    </footer>
  );
}
