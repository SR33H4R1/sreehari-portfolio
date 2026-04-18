import { motion, useReducedMotion } from "framer-motion";
import { experience } from "../data/profile";
import { Section } from "./Section";

export function Experience() {
  const reduceMotion = useReducedMotion();

  return (
    <Section
      id="experience"
      eyebrow="04 - Experience & Education"
      title="Background."
      sub="A concise snapshot of current work, education context, and technical grounding."
    >
      <div className="timeline">
        {experience.map((item, index) => (
          <motion.article
            className="timeline-item"
            key={`${item.title}-${index}`}
            initial={reduceMotion ? false : { opacity: 0, x: -24 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: index * 0.08 }}
          >
            <span className="timeline-dot" />
            <div>
              <div className="timeline-meta">
                <span>{item.period}</span>
                <span>{item.tag}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
