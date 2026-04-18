import { useEffect, useState } from "react";
import { navItems } from "../data/profile";

export function ScrollProgressRail() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("about");

  useEffect(() => {
    const onScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, nextProgress)));
    };

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
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    navItems.forEach((item) => {
      const section = document.querySelector(item.href);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <aside className="scroll-progress-rail" aria-label="Section progress">
      <div className="scroll-progress-track">
        <span className="scroll-progress-fill" style={{ height: `${progress}%` }} />
      </div>
      <div className="scroll-progress-links">
        {navItems.map((item) => (
          <a
            key={item.href}
            className={active === item.href.slice(1) ? "active" : ""}
            href={item.href}
            aria-label={`Go to ${item.label}`}
          >
            <span />
            <small>{item.label}</small>
          </a>
        ))}
      </div>
    </aside>
  );
}
