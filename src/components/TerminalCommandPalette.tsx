import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { navItems, profile, terminalCommands } from "../data/profile";

type TerminalCommandPaletteProps = {
  open: boolean;
  onClose: () => void;
};

type PaletteAction = {
  id: string;
  label: string;
  hint: string;
  run: () => void;
};

const STREAM_INITIAL_DELAY_MS = 240;
const STREAM_MIN_LINE_DELAY_MS = 320;
const STREAM_MAX_LINE_DELAY_MS = 1200;
const STREAM_PER_CHAR_MS = 12;
const STREAM_LINE_GAP_MS = 220;

export function TerminalCommandPalette({ open, onClose }: TerminalCommandPaletteProps) {
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [activeCommand, setActiveCommand] = useState(terminalCommands[0].command);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [streamCount, setStreamCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const active = terminalCommands.find((command) => command.command === activeCommand) ?? terminalCommands[0];

  const actions: PaletteAction[] = useMemo(() => {
    const terminalActions = terminalCommands.map((command) => ({
      id: command.command,
      label: `${command.command} - ${command.label}`,
      hint: command.hint,
      run: () => {
        setActiveCommand(command.command);
        setQuery("");
      },
    }));

    const navActions = navItems.map((item) => ({
      id: `nav-${item.href}`,
      label: `Go to ${item.label}`,
      hint: item.href,
      run: () => {
        document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
        onClose();
      },
    }));

    const linkActions = [
      ...(profile.links.github
        ? [{
            id: "github",
            label: "Open GitHub",
            hint: "Profile link",
            run: () => {
              window.open(profile.links.github, "_blank", "noopener,noreferrer");
              onClose();
            },
          }]
        : []),
      ...(profile.links.linkedin
        ? [{
            id: "linkedin",
            label: "Open LinkedIn",
            hint: "Profile link",
            run: () => {
              window.open(profile.links.linkedin, "_blank", "noopener,noreferrer");
              onClose();
            },
          }]
        : []),
      ...(profile.links.resume
        ? [{
            id: "resume",
            label: "Open Resume",
            hint: "PDF",
            run: () => {
              window.open(profile.links.resume, "_blank", "noopener,noreferrer");
              onClose();
            },
          }]
        : []),
      {
        id: "email",
        label: "Email Sreehari",
        hint: profile.email,
        run: () => {
          window.location.href = profile.links.email;
          onClose();
        },
      },
    ];

    return [...terminalActions, ...navActions, ...linkActions];
  }, [onClose]);

  const filtered = actions.filter((action) =>
    `${action.label} ${action.hint}`.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    if (!open) return;

    setHighlightedIndex(0);
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    if (!open) {
      setStreamCount(0);
      return;
    }

    if (reduceMotion) {
      setStreamCount(active.output.length);
      return;
    }

    setStreamCount(0);
    let elapsed = STREAM_INITIAL_DELAY_MS;
    const timers = active.output.map((line, index) => {
      const timer = window.setTimeout(() => setStreamCount(index + 1), elapsed);
      const lineDelay = Math.min(
        STREAM_MAX_LINE_DELAY_MS,
        Math.max(STREAM_MIN_LINE_DELAY_MS, line.length * STREAM_PER_CHAR_MS),
      );
      elapsed += lineDelay + STREAM_LINE_GAP_MS;
      return timer;
    });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [active.command, active.output, open, reduceMotion]);

  useEffect(() => {
    if (!query.startsWith("/")) return;

    const exactCommand = terminalCommands.find((command) => command.command === query.trim());
    if (exactCommand) setActiveCommand(exactCommand.command);
  }, [query]);

  useEffect(() => {
    if (highlightedIndex > filtered.length - 1) {
      setHighlightedIndex(0);
    }
  }, [filtered.length, highlightedIndex]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.classList.add("palette-open");
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("palette-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const runHighlightedAction = () => {
    if (filtered[highlightedIndex]) filtered[highlightedIndex].run();
  };

  const openRelatedSection = () => {
    if (!active.relatedSection) return;
    document.querySelector(active.relatedSection)?.scrollIntoView({ behavior: "smooth" });
    onClose();
  };

  const streamedOutput = active.output.slice(0, streamCount);
  const isStreaming = streamCount < active.output.length;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="palette-backdrop terminal-drawer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            className="terminal-drawer"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.98 }}
            transition={{ duration: 0.24 }}
            onMouseDown={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Portfolio command drawer"
          >
            <div className="terminal-drawer-head">
              <div>
                <span>Command drawer</span>
                <strong>Candidate briefing terminal</strong>
              </div>
              <kbd>Esc</kbd>
            </div>

            <div className="terminal-drawer-grid">
              <div className="terminal-drawer-console">
                <p className="terminal-input">
                  <span>sreehari@portfolio</span>
                  <strong>{active.command}</strong>
                </p>
                <div className="terminal-suggestions" aria-label="Terminal command suggestions">
                  {terminalCommands.map((command) => (
                    <button
                      key={command.command}
                      className={active.command === command.command ? "active" : ""}
                      type="button"
                      onClick={() => {
                        setActiveCommand(command.command);
                        setQuery("");
                      }}
                    >
                      {command.command}
                    </button>
                  ))}
                </div>
                <p className="terminal-context">
                  {profile.title}. Explore core stack, project proof, and current technical execution focus.
                </p>
                <div className="terminal-output">
                  {streamedOutput.map((line, index) => (
                    <motion.p
                      key={`${active.command}-${index}-${line}`}
                      className="stream-line"
                      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {line}
                    </motion.p>
                  ))}
                  {isStreaming ? <p className="terminal-stream-cursor"><span /></p> : null}
                </div>
                {active.relatedSection ? (
                  <button className="terminal-jump" type="button" onClick={openRelatedSection}>
                    Open related section <span aria-hidden="true">-&gt;</span>
                  </button>
                ) : null}
              </div>

              <div className="terminal-drawer-actions">
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      runHighlightedAction();
                    }
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      setHighlightedIndex((value) => (value + 1) % Math.max(filtered.length, 1));
                    }
                    if (event.key === "ArrowUp") {
                      event.preventDefault();
                      setHighlightedIndex((value) => (value - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
                    }
                    if (event.key === "Escape") onClose();
                  }}
                  placeholder="Type /stack, /projects, contact, resume..."
                  aria-label="Search portfolio commands"
                />
                <div className="palette-list terminal-action-list">
                  {filtered.map((action, index) => (
                    <button
                      key={action.id}
                      className={index === highlightedIndex ? "is-active" : ""}
                      type="button"
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onFocus={() => setHighlightedIndex(index)}
                      onClick={action.run}
                    >
                      <span>{action.label}</span>
                      <small>{action.hint}</small>
                    </button>
                  ))}
                  {filtered.length === 0 ? <p>No matching command.</p> : null}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
