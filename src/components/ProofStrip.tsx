import { motion, useReducedMotion } from "framer-motion";
import { proofSignals } from "../data/profile";

export function ProofStrip() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="proof-strip"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.68, delay: 0.64 }}
      aria-label="Portfolio proof signals"
    >
      {proofSignals.map((signal, index) => (
        <motion.article
          key={signal.label}
          className="proof-item"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: 0.76 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <span>{String(index + 1).padStart(2, "0")} / {signal.label}</span>
          <strong>{signal.value}</strong>
          <p>{signal.detail}</p>
        </motion.article>
      ))}
    </motion.div>
  );
}
