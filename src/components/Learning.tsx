import { motion, useReducedMotion } from "framer-motion";
import { learning } from "../data/profile";
import { Section } from "./Section";

export function Learning() {
  const reduceMotion = useReducedMotion();

  return (
    <Section
      id="learning"
      eyebrow="05 - Focused Technical Development"
      title="Current technical development."
      sub="The current learning lane behind the next set of backend-first AI systems."
    >
      <div className="learning-grid">
        {learning.map((item, index) => (
          <motion.article
            className="learning-card"
            key={item.title}
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: index * 0.08 }}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
