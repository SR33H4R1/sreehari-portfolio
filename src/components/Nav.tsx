import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { navItems, profile } from "../data/profile";

type NavProps = {
  onCommandOpen: () => void;
};

export function Nav({ onCommandOpen }: NavProps) {
  const [active, setActive] = useState("about");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-42% 0px -50% 0px", threshold: 0 },
    );

    navItems.forEach((item) => {
      const section = document.querySelector(item.href);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <a className="brand" href="#top" aria-label="Sreehari home">
        <span className="brand-mark">S</span>
        <span className="brand-copy">
          {profile.name}
          <span>/</span>
          {profile.shortTitle}
        </span>
      </a>

      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a key={item.href} className={active === item.href.slice(1) ? "active" : ""} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="nav-actions">
        <button className="command-button" type="button" onClick={onCommandOpen} aria-label="Open command drawer">
          <span>Ctrl</span>
          <span>K</span>
        </button>
        <a className="nav-cta" href="#contact">
          Contact
          <span aria-hidden="true">-&gt;</span>
        </a>
        <button
          className="mobile-menu"
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className="mobile-panel"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.24 }}
          >
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMobile}>
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                onCommandOpen();
                closeMobile();
              }}
            >
              Open command drawer
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
