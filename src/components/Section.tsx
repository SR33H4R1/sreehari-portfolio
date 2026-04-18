import { motion, useReducedMotion } from "framer-motion";
import type { PropsWithChildren } from "react";

type SectionProps = PropsWithChildren<{
  id?: string;
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  className?: string;
}>;

export function Section({ id, eyebrow, title, sub, className = "", children }: SectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className={`section ${className}`} id={id}>
      <motion.header
        className="section-head"
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="section-title">{title}</h2>
        {sub ? <p className="section-sub">{sub}</p> : null}
      </motion.header>
      {children}
    </section>
  );
}
