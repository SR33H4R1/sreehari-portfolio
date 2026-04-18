export type ProjectStatus = "In Progress" | "Planned" | "Completed";

export type Project = {
  id: string;
  title: string;
  status: ProjectStatus;
  description: string;
  stack: string[];
  problem: string;
  approach: string;
  proves: string;
  architecture: string[];
  proofPoints: string[];
  currentFocus: string[];
  links: {
    github: string;
    demo: string;
  };
};

export type SkillGroup = {
  id: string;
  label: string;
  summary: string;
  signalHeadline: string;
  buildCapabilities: string[];
  failureDefense: string[];
  coreTools: string[];
};

export type TerminalCommand = {
  command: "/about" | "/stack" | "/projects" | "/contact" | "/focus";
  label: string;
  hint: string;
  output: string[];
  relatedSection?: string;
};

export type ProofSignal = {
  label: string;
  value: string;
  detail: string;
};

export const profile = {
  name: "Sreehari A L",
  title: "AI Engineer | Python, RAG, LangChain, LlamaIndex, FastAPI, Gradio",
  shortTitle: "AI Engineer",
  pitch: "I build practical AI systems in Python across retrieval-augmented generation, local LLM applications, and AI automation workflows.",
  support: "My recent work includes LangChain- and LlamaIndex-based RAG pipelines, local LLM applications, AI-assisted code review, and automation workflows.",
  email: "sreehariarun191@gmail.com",
  links: {
    github: "https://github.com/SR33H4R1",
    linkedin: "https://www.linkedin.com/in/sreehari-a-l/",
    resume: "",
    email: "mailto:sreehariarun191@gmail.com",
  },
};

export const signals = [
  "Retrieval-Augmented Generation (RAG)",
  "Local LLM applications",
  "AI automation workflows",
  "Python, FastAPI, and Gradio",
];

export const proofSignals: ProofSignal[] = [
  {
    label: "Positioning",
    value: "Backend-first AI",
    detail: "Typed APIs, data contracts, and reliability before UI polish.",
  },
  {
    label: "Retrieval",
    value: "Source-grounded RAG",
    detail: "Answers are framed around citations and inspectable retrieval logic.",
  },
  {
    label: "Core Stack",
    value: "FastAPI + PostgreSQL",
    detail: "Python service design anchored in data models, contracts, and backend flow.",
  },
];

export const skills: SkillGroup[] = [
  {
    id: "backend",
    label: "Backend",
    summary: "API contracts, routing, validation, and service boundaries.",
    signalHeadline: "I build backend APIs that are typed, testable, and reliable under real product constraints.",
    buildCapabilities: [
      "Design FastAPI services with clear request/response contracts and predictable routing.",
      "Implement validation-first schemas with Pydantic to prevent bad input from entering core flows.",
      "Structure service boundaries so endpoints remain maintainable as complexity grows.",
    ],
    failureDefense: [
      "Handle invalid payloads and edge-case paths through explicit validation and controlled API errors.",
      "Keep backend behavior inspectable through deterministic response contracts and clean endpoint separation.",
    ],
    coreTools: ["Python", "FastAPI", "Pydantic", "SQLAlchemy", "REST APIs"],
  },
  {
    id: "databases",
    label: "Databases",
    summary: "Relational modeling, query flow, and retrieval-aware storage.",
    signalHeadline: "I design data layers that prioritize integrity, query clarity, and scalable retrieval paths.",
    buildCapabilities: [
      "Model relational entities and relationships in PostgreSQL for stable backend workflows.",
      "Write SQL query flows aligned with API use-cases instead of ad hoc database access.",
      "Prepare retrieval-ready data structures with practical pgvector awareness.",
    ],
    failureDefense: [
      "Protect data consistency by keeping schema intent and API behavior aligned.",
      "Reduce query-level surprises by designing explicit relational access patterns.",
    ],
    coreTools: ["PostgreSQL", "SQL", "Relational modeling", "pgvector basics"],
  },
  {
    id: "ai",
    label: "AI Engineering",
    summary: "RAG systems, retrieval logic, and structured model output.",
    signalHeadline: "I build source-grounded AI flows where retrieval quality and output structure are first-class.",
    buildCapabilities: [
      "Assemble RAG pipelines with document loading, chunking, embeddings, and retrieval flow control.",
      "Design citation-first responses so generated answers remain auditable against retrieved context.",
      "Use structured outputs to keep model responses machine-usable in backend systems.",
    ],
    failureDefense: [
      "Constrain hallucination risk by enforcing retrieval grounding before answer synthesis.",
      "Guard downstream breakage by requiring structured response shapes from model output.",
    ],
    coreTools: ["LangChain", "RAG", "LlamaIndex basics", "Embeddings", "Retrieval", "Structured outputs"],
  },
  {
    id: "production",
    label: "Production / Tooling",
    summary: "The operational layer that keeps AI APIs inspectable.",
    signalHeadline: "I harden AI backends with testing, containerization, and operational discipline.",
    buildCapabilities: [
      "Containerize services with Docker for reproducible local and deployment environments.",
      "Write targeted pytest coverage for core API paths and failure conditions.",
      "Maintain logging and configuration discipline to keep runtime behavior debuggable.",
    ],
    failureDefense: [
      "Prevent environment drift by enforcing consistent containerized execution paths.",
      "Catch regressions early through test-backed API behavior and explicit operational checks.",
    ],
    coreTools: ["Docker", "pytest", "Logging", "Git/GitHub", "Environment configuration", "API design"],
  },
];

export const projects: Project[] = [
  {
    id: "ai-code-review",
    title: "AI Code Review Assistant",
    status: "Completed",
    description: "A LangChain + Ollama project that reviews Python code, generates explanations, and runs structured security scans.",
    stack: ["Python", "Ollama", "LangChain", "LLMs"],
    problem: "Need a reliable way to automatically review Python code for safety, provide feedback, and catch vulnerabilities.",
    approach: "Built a pipeline that accepts code, reviews it, and returns different structured feedback for safe and unsafe code.",
    proves: "Code review automation, structured scanning logic, and local LLM integration.",
    architecture: [
      "LangChain for LLM orchestration and workflow.",
      "Ollama for local model execution.",
      "Structured security scanning logic.",
    ],
    proofPoints: [
      "Demonstrates practical LLM usage for code analysis.",
      "Highlights structured output generation.",
    ],
    currentFocus: [],
    links: { github: "https://github.com/SR33H4R1/ai-code-review-assistant", demo: "#" },
  },
  {
    id: "ai-supreme-court",
    title: "AI Supreme Court",
    status: "Completed",
    description: "Simulates a courtroom-style debate using AI, generating pro/con arguments and a structured verdict.",
    stack: ["Python", "LangChain", "Ollama"],
    problem: "Evaluating complex topics from multiple perspectives systematically without human bias.",
    approach: "Accepts a topic, generates pro and con arguments via prompt chaining, and produces a structured verdict with reasoning.",
    proves: "Prompt chaining, schema-based output generation, and multi-agent debate simulation.",
    architecture: [
      "Prompt chaining for sequential argument generation.",
      "Schema-based structured output for verdicts.",
    ],
    proofPoints: [
      "Shows advanced prompt engineering.",
      "Demonstrates structured reasoning outputs.",
    ],
    currentFocus: [],
    links: { github: "https://github.com/SR33H4R1/ai-supreme-court", demo: "#" },
  },
  {
    id: "math-agent",
    title: "Autonomous Local Math & Algorithm Agent",
    status: "Completed",
    description: "Local Python agent using Ollama and Llama 3.1 that converts natural language into structured JSON tool calls.",
    stack: ["Python", "Ollama", "Llama 3.1", "JSON", "Prompt Engineering"],
    problem: "Executing mathematical and algorithmic operations reliably from natural language queries locally.",
    approach: "Implemented strict JSON prompting, deterministic tool routing, and a local inference workflow without external APIs.",
    proves: "Agentic tool use, local inference workflow, and strict JSON parsing.",
    architecture: [
      "Local Llama 3.1 inference via Ollama.",
      "Strict JSON prompting framework.",
      "Deterministic routing to math/algorithm tools.",
    ],
    proofPoints: [
      "Proves ability to build autonomous local agents.",
      "Demonstrates reliable tool-calling without relying on commercial APIs.",
    ],
    currentFocus: [],
    links: { github: "https://github.com/SR33H4R1/Local-Math-Agent-Llama3", demo: "#" },
  },
];

export const terminalCommands: TerminalCommand[] = [
  {
    command: "/about",
    label: "Positioning summary",
    hint: "Who this portfolio is for",
    relatedSection: "#about",
    output: [
      "AI Engineer focused on backend-first GenAI systems.",
      "Core strength: API contracts, retrieval reliability, and database-backed service design.",
      "Execution style: honest project status, inspectable architecture, and production-aware tradeoffs.",
    ],
  },
  {
    command: "/stack",
    label: "System stack",
    hint: "Backend, database, AI, production",
    relatedSection: "#skills",
    output: [
      "Backend: Python, FastAPI, Pydantic, SQLAlchemy, and API-first service boundaries.",
      "Data: PostgreSQL, relational modeling, SQL query flow, and pgvector awareness.",
      "AI: LangChain, source-grounded RAG, embeddings, retrieval, and structured outputs.",
      "Production: Docker, pytest, logging, configuration discipline, and Git/GitHub workflow.",
    ],
  },
  {
    command: "/projects",
    label: "Project map",
    hint: "Flagship and support systems",
    relatedSection: "#projects",
    output: [
      "AI Code Review Assistant: LangChain + Ollama code reviewer with structured scanning.",
      "AI Supreme Court: Multi-agent prompt-chaining debate simulator with structured reasoning.",
      "Local Math Agent: Local Llama 3.1 agent with strict JSON prompting and tool routing.",
    ],
  },
  {
    command: "/focus",
    label: "Current focus",
    hint: "Technical development",
    relatedSection: "#learning",
    output: [
      "Execution now: hardening FastAPI fundamentals into backend patterns that hold under interview scrutiny.",
      "Build system: validation-first APIs, persistent data flow, and retrieval pipelines that return cited context.",
      "Operating standard: ship only what is implemented, defend every tradeoff, and keep project status explicit.",
    ],
  },
  {
    command: "/contact",
    label: "Contact actions",
    hint: "Email, GitHub, LinkedIn, resume",
    relatedSection: "#contact",
    output: [
      "Email: sreehariarun191@gmail.com",
      "LinkedIn: https://www.linkedin.com/in/sreehari-a-l",
      "GitHub: https://github.com/SR33H4R1",
      "Resume: adding final PDF link after latest refresh.",
    ],
  },
];

export const experience = [
  {
    period: "2024 - 2025",
    tag: "Apprenticeship",
    title: "AI / Data Science Apprentice @ Luminar Technolab",
    body: "7-month apprenticeship focused on Python, data science, machine learning, AI, and Power BI. Built hands-on projects covering data preprocessing, ML workflows, model evaluation, and applied AI concepts."
  },
  {
    period: "May 2023 - Jun 2023",
    tag: "Internship",
    title: "Artificial Intelligence Intern @ Innoval Digital Solutions Pvt Ltd (IVL)",
    body: "Internship focused on Artificial Intelligence basics and hands-on exposure in Trivandrum."
  },
  {
    period: "2020 - 2024",
    tag: "Education",
    title: "B.Tech Computer Science @ Rajadhani Institute of Engineering and Technology",
    body: "Bachelor's degree in Computer Science focused on Applied Machine Learning, Problem Solving, and software engineering foundations."
  },
  {
    period: "2018 - 2020",
    tag: "Education",
    title: "Higher Secondary, Computer Science @ MMHSS Nilamel",
    body: ""
  }
];

export const learning = [
  {
    title: "FastAPI - The Complete Course 2026",
    body: "Deepening production API patterns: dependency injection, auth, background tasks, and testable API architecture.",
  },
  {
    title: "AI Backend Systems Practice",
    body: "Designing services around LLMs: contracts, structured outputs, error boundaries, and retrieval evaluation.",
  },
  {
    title: "RAG / LangChain - Self-Directed Builds",
    body: "Hands-on retrieval pipelines with PostgreSQL, citation handling, and chunking tradeoffs.",
  },
];

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];
