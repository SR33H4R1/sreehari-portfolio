import { motion, useReducedMotion } from "framer-motion";
import { profile } from "../data/profile";
import { ProofStrip } from "./ProofStrip";

const lineVariants = {
  hidden: { y: "115%" },
  visible: { y: 0 },
};

type HeroProps = {
  onCommandOpen: () => void;
};

export function Hero({ onCommandOpen }: HeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="hero" id="top">
      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-shell">
        <div className="hero-copy">
          <motion.div
            className="status-pill"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="live-dot" />
            <span>Available for AI / Backend roles</span>
            <span className="pill-divider" />
            <span>v2026.2</span>
          </motion.div>

          <h1 className="hero-title" aria-label="Sreehari. GenAI systems, backend-first.">
            {[
              <span key="name">{profile.name}.</span>,
              <span key="genai"><em>GenAI</em> systems,</span>,
              <span key="backend" className="muted">backend-first.</span>,
            ].map((content, index) => (
              <span className="hero-line" key={index}>
                <motion.span
                  variants={lineVariants}
                  initial={reduceMotion ? false : "hidden"}
                  animate={reduceMotion ? undefined : "visible"}
                  transition={{ duration: 0.9, delay: 0.18 + index * 0.11, ease: [0.22, 1, 0.36, 1] }}
                >
                  {content}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            className="hero-lower"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
          >
            <p>{profile.pitch}</p>
            <div className="hero-actions">
              <a className="button primary" href="#contact">
                Get in touch <span aria-hidden="true">-&gt;</span>
              </a>
              {profile.links.resume ? (
                <a className="button ghost" href={profile.links.resume} target="_blank" rel="noopener noreferrer">
                  Resume PDF
                </a>
              ) : null}
              <button className="hero-command-hint" type="button" onClick={onCommandOpen}>
                Open command drawer <kbd>Ctrl+K</kbd>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <ProofStrip />
    </section>
  );
}
