import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { navItems, profile } from "../data/profile";

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
};

type Command = {
  label: string;
  hint: string;
  action: () => void;
};

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  const commands: Command[] = useMemo(() => [
    ...navItems.map((item) => ({
      label: `Go to ${item.label}`,
      hint: item.href,
      action: () => {
        document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
        onClose();
      },
    })),
    {
      label: "Open GitHub",
      hint: "profile",
      action: () => window.open(profile.links.github, "_blank", "noopener,noreferrer"),
    },
    {
      label: "Open LinkedIn",
      hint: "profile",
      action: () => window.open(profile.links.linkedin, "_blank", "noopener,noreferrer"),
    },
    {
      label: "Email Sreehari",
      hint: profile.email,
      action: () => {
        window.location.href = profile.links.email;
      },
    },
    {
      label: "Download Resume",
      hint: "PDF",
      action: () => window.open(profile.links.resume, "_blank", "noopener,noreferrer"),
    },
  ], [onClose]);

  const filtered = commands.filter((command) =>
    `${command.label} ${command.hint}`.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Enter" && filtered[0]) filtered[0].action();
    };

    document.body.classList.add("palette-open");
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("palette-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, filtered]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="palette-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            className="palette"
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ duration: 0.2 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="palette-head">
              <span>Command palette</span>
              <kbd>Esc</kbd>
            </div>
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search sections, links, or actions..."
              aria-label="Search commands"
            />
            <div className="palette-list">
              {filtered.map((command) => (
                <button key={`${command.label}-${command.hint}`} type="button" onClick={command.action}>
                  <span>{command.label}</span>
                  <small>{command.hint}</small>
                </button>
              ))}
              {filtered.length === 0 ? <p>No matching command.</p> : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
