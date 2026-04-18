import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { skills } from "../data/profile";

export function SkillSystemMap() {
  const [active, setActive] = useState("all");
  const reduceMotion = useReducedMotion();
  const categories = useMemo(
    () => [{ id: "all", label: "All layers" }, ...skills.map((skill) => ({ id: skill.id, label: skill.label }))],
    [],
  );
  const selectedSkill = active === "all" ? null : skills.find((skill) => skill.id === active) ?? null;
  const activeLabel = useMemo(
    () => categories.find((category) => category.id === active)?.label ?? "All layers",
    [active, categories],
  );

  const activateCategory = (categoryId: string) => {
    setActive(categoryId);
  };

  const focusCategoryButton = (index: number) => {
    window.requestAnimationFrame(() => {
      const button = document.getElementById(`skill-filter-${categories[index].id}`);
      button?.focus();
    });
  };

  const onChipKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % categories.length;
      activateCategory(categories[nextIndex].id);
      focusCategoryButton(nextIndex);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const nextIndex = (currentIndex - 1 + categories.length) % categories.length;
      activateCategory(categories[nextIndex].id);
      focusCategoryButton(nextIndex);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      activateCategory(categories[0].id);
      focusCategoryButton(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      const lastIndex = categories.length - 1;
      activateCategory(categories[lastIndex].id);
      focusCategoryButton(lastIndex);
    }
  };

  return (
    <div className="skill-system">
      <div className="skill-filter" role="tablist" aria-label="Skill categories">
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            id={`skill-filter-${category.id}`}
            className={active === category.id ? "active" : ""}
            type="button"
            role="tab"
            aria-selected={active === category.id}
            aria-controls="skills-panel"
            tabIndex={active === category.id ? 0 : -1}
            onKeyDown={(event) => onChipKeyDown(event, index)}
            onClick={() => activateCategory(category.id)}
            whileHover={reduceMotion ? undefined : { y: -1, scale: 1.01 }}
            whileTap={reduceMotion ? undefined : { y: 0, scale: 0.99 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            {category.label}
          </motion.button>
        ))}
      </div>

      <p className="skill-filter-state" aria-live="polite">
        Active: {activeLabel}
      </p>

      <div id="skills-panel" className={`skill-system-map ${active === "all" ? "overview-mode" : "focus-mode"}`}>
        {active === "all" ? (
          <motion.div
            key="skills-overview"
            className="skill-overview-grid"
            initial={reduceMotion ? false : { opacity: 0.88 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            {skills.map((skill, index) => (
              <article key={skill.id} className="skill-overview-card">
                <div className="skill-layer-head">
                  <span className="card-index">layer_{String(index + 1).padStart(2, "0")}</span>
                  <h3>{skill.label}</h3>
                </div>
                <p>{skill.summary}</p>
                <div className="skill-layer-tags">
                  {skill.coreTools.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </article>
            ))}
          </motion.div>
        ) : selectedSkill ? (
          <motion.article
            key={`skills-focus-${selectedSkill.id}`}
            className="skill-focus-panel"
            initial={reduceMotion ? false : { opacity: 0.88 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="skill-layer-head">
              <span className="card-index">
                layer_{String(skills.findIndex((item) => item.id === selectedSkill.id) + 1).padStart(2, "0")}
              </span>
              <h3>{selectedSkill.label}</h3>
            </div>
            <p className="skill-focus-headline">{selectedSkill.signalHeadline}</p>
            <div className="skill-focus-columns">
              <section className="skill-focus-block">
                <h4>What I Build</h4>
                <ul className="skill-focus-list">
                  {selectedSkill.buildCapabilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section className="skill-focus-block">
                <h4>Reliability Defense</h4>
                <ul className="skill-focus-list">
                  {selectedSkill.failureDefense.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>
            <div className="skill-focus-tools">
              <span>Core Tools</span>
              <div className="skill-layer-tags">
                {selectedSkill.coreTools.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </motion.article>
        ) : (
          <motion.p
            key="skills-empty"
            className="skill-filter-state"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
          >
            No layer selected.
          </motion.p>
        )}
      </div>
    </div>
  );
}
