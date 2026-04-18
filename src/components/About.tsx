import { motion, useReducedMotion } from "framer-motion";
import { Section } from "./Section";

export function About() {
  const reduceMotion = useReducedMotion();

  return (
    <Section
      id="about"
      eyebrow="01 - About"
      title="Backend-first, AI-focused."
      sub="AI systems are only convincing when the contracts, data flow, and retrieval behavior are clear."
    >
      <div className="about-layout">
        <motion.p
          className="about-lead"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          I am an AI engineer focused on <strong>API-driven GenAI systems</strong>: source-grounded retrieval,
          structured outputs, and clean backend architecture that is fit to ship.
        </motion.p>
        <motion.div
          className="about-copy"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <p>
            My work centers on Python services built with FastAPI, PostgreSQL, and retrieval pipelines using LangChain.
            I care about the parts that make AI systems reliable: schema design, typed contracts, retries, logging, and
            honest evaluation of retrieval quality.
          </p>
          <p>
            I prefer small, sharp systems with a clear problem statement over demos that do not survive contact with
            real data.
          </p>
        </motion.div>
      </div>
    </Section>
  );
}
