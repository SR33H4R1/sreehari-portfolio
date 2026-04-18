import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { terminalCommands } from "../data/profile";

type TerminalPanelProps = {
  defaultCommand?: string;
  compact?: boolean;
};

export function TerminalPanel({ defaultCommand = "/focus", compact = false }: TerminalPanelProps) {
  const reduceMotion = useReducedMotion();
  const [activeCommand, setActiveCommand] = useState(defaultCommand);
  const active = useMemo(
    () => terminalCommands.find((command) => command.command === activeCommand) ?? terminalCommands[0],
    [activeCommand],
  );
  const [visibleLines, setVisibleLines] = useState(active.output.length);

  useEffect(() => {
    if (reduceMotion) {
      setVisibleLines(active.output.length);
      return;
    }

    setVisibleLines(0);
    const timers = active.output.map((_, index) =>
      window.setTimeout(() => setVisibleLines((current) => Math.max(current, index + 1)), 180 + index * 180),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [active, reduceMotion]);

  const scrollToRelatedSection = () => {
    if (!active.relatedSection) return;
    document.querySelector(active.relatedSection)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.aside
      className={`terminal-panel ${compact ? "is-compact" : ""}`}
      initial={reduceMotion ? false : { opacity: 0, y: 26, rotateX: -6 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 0.42 }}
      aria-label="Portfolio command interface"
    >
      <div className="terminal-chrome">
        <div className="terminal-window-controls" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span>Portfolio command interface</span>
      </div>

      <div className="terminal-status">
        <span>Explore stack, projects, proof, contact</span>
        <strong>deterministic</strong>
      </div>

      <div className="terminal-screen" aria-live="polite">
        <p className="terminal-input">
          <span>sreehari@portfolio</span>
          <strong>{active.command}</strong>
        </p>
        <div className="terminal-output">
          {active.output.slice(0, visibleLines).map((line) => (
            <motion.p
              key={`${active.command}-${line}`}
              initial={reduceMotion ? false : { opacity: 0, x: -8 }}
              animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              transition={{ duration: 0.22 }}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>

      <div className="terminal-suggestions" aria-label="Terminal command suggestions">
        {terminalCommands.map((command) => (
          <button
            key={command.command}
            className={command.command === active.command ? "active" : ""}
            type="button"
            onClick={() => setActiveCommand(command.command)}
          >
            {command.command}
          </button>
        ))}
      </div>

      {active.relatedSection ? (
        <button className="terminal-jump" type="button" onClick={scrollToRelatedSection}>
          Open related section <span aria-hidden="true">-&gt;</span>
        </button>
      ) : null}
    </motion.aside>
  );
}
