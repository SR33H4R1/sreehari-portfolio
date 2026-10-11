import "./globals.css";

export const metadata = {
  title: "Sreehari A L · AI & Backend Engineer",
  description:
    "AI Engineer building production LLM services in Python/FastAPI: RAG, agents, evaluation and guardrails.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
