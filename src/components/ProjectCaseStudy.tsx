import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { Project } from "../data/profile";

type ProjectCaseStudyProps = {
  project: Project;
  index: number;
};

type TabId = "overview" | "proof" | "stack";

const tabs: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "proof", label: "Proof" },
  { id: "stack", label: "Stack" },
];

type StackRow = {
  label: string;
  value: string;
};

const backendStack = new Set(["FastAPI", "SQLAlchemy"]);
const dataStack = new Set(["PostgreSQL", "SQL", "pgvector"]);
const aiStack = new Set(["LangChain", "LangGraph", "RAG", "Embeddings", "Structured outputs"]);
const opsStack = new Set(["Docker", "pytest", "Logging"]);

export function ProjectCaseStudy({ project, index }: ProjectCaseStudyProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const reduceMotion = useReducedMotion();
  const stackRows = buildStackRows(project.stack);
  const githubLink = sanitizeLink(project.links.github);
  const demoLink = sanitizeLink(project.links.demo);

  return (
    <motion.article
      className="project-case-card"
      initial={reduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.62, delay: index * 0.08 }}
    >
      <div className="project-case-shell">
        <div className="project-case-top">
          <span className="project-meta">// case_study_{String(index + 1).padStart(2, "0")}.md</span>
          <span className={`project-status ${project.status.toLowerCase().replaceAll(" ", "-")}`}>
            {project.status}
          </span>
        </div>

        <div className="project-case-main">
          <h3>{project.title}</h3>
          <p className="project-summary">{project.description}</p>
        </div>

        <div className="case-tabs" role="tablist" aria-label={`${project.title} details`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "active" : ""}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          className={`case-panel ${activeTab === "stack" ? "is-stack" : ""}`}
          initial={reduceMotion ? false : { opacity: 0.88 }}
          animate={reduceMotion ? undefined : { opacity: 1 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          {activeTab === "overview" ? (
            <div className="case-overview case-overview-tight">
              <Detail title="Problem" body={project.problem} />
              <Detail title="Approach" body={project.approach} />
            </div>
          ) : null}

          {activeTab === "proof" ? (
            <div className="case-proof-tab">
              <BulletList items={project.proofPoints.slice(0, 3)} />
            </div>
          ) : null}

          {activeTab === "stack" ? (
            <div className="stack-rows" aria-label="Core stack by layer">
              {stackRows.map((row) => (
                <p key={row.label} className="stack-row">
                  <span>{row.label}</span>
                  <strong>{row.value}</strong>
                </p>
              ))}
            </div>
          ) : null}
        </motion.div>

        {githubLink || demoLink ? (
          <div className="project-links">
            {githubLink ? (
              <a className="primary" href={githubLink} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            ) : null}
            {demoLink ? (
              <a className="secondary" href={demoLink} target="_blank" rel="noopener noreferrer">
                Demo
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}

function Detail({ title, body }: { title: string; body: string }) {
  return (
    <div className="case-detail">
      <h4>{title}</h4>
      <p>{body}</p>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="case-bullets">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function buildStackRows(stack: string[]): StackRow[] {
  const normalized = normalizeStack(stack);
  const rows: StackRow[] = [];

  const backend = normalized.filter((item) => backendStack.has(item));
  const data = normalized.filter((item) => dataStack.has(item));
  const ai = normalized.filter((item) => aiStack.has(item));
  const ops = normalized.filter((item) => opsStack.has(item));

  if (backend.length) {
    rows.push({ label: "Backend", value: backend.join(", ") });
  }
  if (data.length) {
    rows.push({ label: "Data", value: data.join(", ") });
  }
  if (ai.length) {
    rows.push({ label: "AI", value: ai.join(", ") });
  }
  if (ops.length) {
    rows.push({ label: "Ops", value: ops.join(", ") });
  }

  const assigned = new Set([...backend, ...data, ...ai, ...ops]);
  const general = normalized.filter((item) => !assigned.has(item));
  if (general.length) {
    rows.push({ label: "General", value: general.join(", ") });
  }

  return rows;
}

function normalizeStack(stack: string[]): string[] {
  const normalized = stack.flatMap((item) =>
    item
      .split(/\s+or\s+/i)
      .map((part) => part.trim())
      .filter(Boolean),
  );

  const deduped: string[] = [];
  const seen = new Set<string>();
  for (const item of normalized) {
    const key = item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(item);
    }
  }
  return deduped;
}

function sanitizeLink(link: string) {
  const trimmed = link.trim();
  if (!trimmed || trimmed === "#") return "";
  return trimmed;
}
