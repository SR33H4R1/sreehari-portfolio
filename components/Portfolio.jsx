"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUpRight, Copy, Mail } from "lucide-react";

const pad = (n) => String(n).padStart(2, "0");
const clean = (value) => (value == null ? "" : String(value));
const list = (value) => (Array.isArray(value) ? value : []);

function safeHref(value) {
  const href = clean(value).trim();
  if (!href) return "";
  if (/^(https?:|mailto:|tel:|#|\/)/i.test(href)) return href;
  return `/${href.replace(/^\/+/, "")}`;
}

function targetFor(href) {
  return /^https?:/i.test(href) ? "_blank" : undefined;
}

function ImageFrame({ src, alt }) {
  return (
    <div className="image-frame">
      {src ? <img src={src} alt={alt} /> : <span>{alt}</span>}
    </div>
  );
}

function ExternalIcon() {
  return <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.8} />;
}

export default function Portfolio({ initialContent }) {
  const [content] = useState(initialContent);
  const [time, setTime] = useState("");
  const [copied, setCopied] = useState(false);
  const [openProjectCount, setOpenProjectCount] = useState(4);

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
      }));
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  const model = useMemo(() => {
    const email = clean(content.email).trim();
    const resume = safeHref(content.resumeUrl);
    const contactLinks = list(content.links)
      .map((item) => ({ label: clean(item.label), href: safeHref(item.href) }))
      .filter((item) => item.label && item.href);
    if (resume) contactLinks.push({ label: "Resume", href: resume, download: true });

    return {
      projects: list(content.projects).filter(Boolean),
      featured: list(content.projects).filter((project) => project?.featured),
      others: list(content.projects).filter((project) => project && !project.featured),
      exp: list(content.exp).filter(Boolean),
      certs: list(content.certs).filter(Boolean),
      skills: list(content.skills).filter(Boolean),
      email,
      resume,
      contactLinks,
      heroLinks: [
        ...(email ? [{ label: "Email", href: `mailto:${email}` }] : []),
        ...list(content.links).map((item) => ({ label: clean(item.label), href: safeHref(item.href) })),
      ].filter((item) => item.label && item.href),
    };
  }, [content]);

  async function copyEmail() {
    if (!model.email) return;
    await navigator.clipboard?.writeText(model.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top">{content.brand}</a>
        <nav aria-label="Primary navigation">
          {model.projects.length > 0 && <a href="#work">Work</a>}
          {(model.exp.length > 0 || model.certs.length > 0 || model.skills.length > 0) && <a href="#about">Experience</a>}
          {(model.email || model.contactLinks.length > 0) && <a href="#contact">Contact</a>}
          {model.resume && (
            <a className="nav-resume" href={model.resume} target="_blank" rel="noreferrer">
              Resume <ArrowDown aria-hidden="true" size={15} />
            </a>
          )}
        </nav>
      </header>

      <section id="top" className="hero-section">
        <div className="hero-copy">
          {content.eyebrow && <p className="eyebrow">{content.eyebrow}</p>}
          <h1>{content.headline}</h1>
        </div>
        <div className="hero-bottom">
          <div>
            <p>{content.intro}</p>
            <div className="inline-links">
              {model.heroLinks.map((item) => (
                <a key={`${item.label}-${item.href}`} href={item.href} target={targetFor(item.href)} rel="noreferrer">
                  {item.label} <ExternalIcon />
                </a>
              ))}
            </div>
          </div>
          <dl className="facts-grid">
            {list(content.facts).map((fact) => (
              <div key={`${fact.k}-${fact.v}`}>
                <dt>{fact.k}</dt>
                <dd>{fact.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {model.projects.length > 0 && (
        <section id="work" className="work-section">
          <div className="section-heading">
            <h2>{content.workTitle || "Selected work"}</h2>
            {content.allUrl && (
              <a href={safeHref(content.allUrl)} target="_blank" rel="noreferrer">
                {content.allLabel || "All projects"} <ExternalIcon />
              </a>
            )}
          </div>

          <div className="featured-grid">
            {model.featured.map((project, index) => (
              <article className="feature-card" key={project.id || project.title}>
                <ImageFrame src={project.img} alt={`${project.title} screenshot`} />
                <div className="project-copy">
                  <div className="project-kicker">
                    <span>{pad(index + 1)}</span>
                    <span>{project.tag}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.sub}</p>
                  <MetricList metrics={project.metrics} />
                  {project.stack && <p className="stack">{project.stack}</p>}
                  <ProjectLinks links={project.links} />
                </div>
              </article>
            ))}
          </div>

          {model.others.length > 0 && (
            <div className="more-work">
              <div className="section-heading compact">
                <h3>{content.moreTitle || "Other projects"}</h3>
              </div>
              <div className="project-grid">
                {model.others.slice(0, openProjectCount).map((project, index) => (
                  <article className="project-card" key={project.id || project.title}>
                    <ImageFrame src={project.img} alt={`${project.title} screenshot`} />
                    <div className="project-kicker">
                      <span>{pad(model.featured.length + index + 1)}</span>
                      <span>{project.tag}</span>
                    </div>
                    <h3>{project.title}</h3>
                    <p>{project.sub}</p>
                    <MetricList metrics={project.metrics} />
                    {project.stack && <p className="stack">{project.stack}</p>}
                    <ProjectLinks links={project.links} />
                  </article>
                ))}
              </div>
              {model.others.length > 4 && (
                <button className="outline-button centered" onClick={() => setOpenProjectCount(openProjectCount >= model.others.length ? 4 : model.others.length)}>
                  {openProjectCount >= model.others.length ? "Show fewer" : "More projects"}
                </button>
              )}
            </div>
          )}
        </section>
      )}

      {(model.exp.length > 0 || model.certs.length > 0 || model.skills.length > 0) && (
        <section id="about" className="about-section">
          <div className="section-heading">
            <h2>{content.expTitle || "Experience"}</h2>
          </div>
          <div className="about-grid">
            <div className="timeline">
              {model.exp.map((item) => (
                <article key={`${item.role}-${item.date}`} className="timeline-item">
                  <div className="timeline-date">
                    {item.date}
                    {item.now && <span>Now</span>}
                  </div>
                  <div>
                    <h3>{item.role}</h3>
                    <p>{item.org}</p>
                    {list(item.pts).length > 0 && (
                      <ul>
                        {item.pts.map((point) => <li key={point}>{point}</li>)}
                      </ul>
                    )}
                  </div>
                </article>
              ))}
            </div>
            <div className="credentials">
              {model.certs.length > 0 && (
                <div>
                  <h3>Certifications</h3>
                  {model.certs.map((cert) => (
                    <div className="credential-row" key={`${cert.title}-${cert.year}`}>
                      <strong>{cert.year}</strong>
                      <span>{cert.title}<small>{cert.org}</small></span>
                    </div>
                  ))}
                </div>
              )}
              {model.skills.length > 0 && (
                <div>
                  <h3>Toolkit</h3>
                  {model.skills.map((skill) => (
                    <div className="skill-row" key={skill.k}>
                      <strong>{skill.k}</strong>
                      <span>{clean(skill.items).split(",").map((item) => item.trim()).filter(Boolean).map((item) => <em key={item}>{item}</em>)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="contact-section">
        <div className="section-heading">
          <h2>Contact</h2>
        </div>
        <div className="contact-main">
          {content.note && <p className="eyebrow">{content.note}</p>}
          {model.email && (
            <>
              <a className="email-link" href={`mailto:${model.email}`}>{model.email}</a>
              <div className="contact-actions">
                <button className="solid-button" onClick={copyEmail}>
                  <Copy aria-hidden="true" size={17} /> {copied ? "Copied" : "Copy email"}
                </button>
                <a className="outline-button" href={`mailto:${model.email}`}>
                  <Mail aria-hidden="true" size={17} /> Write an email
                </a>
              </div>
            </>
          )}
        </div>
        <div className="contact-links">
          {model.contactLinks.map((item) => (
            <a key={`${item.label}-${item.href}`} href={item.href} target={targetFor(item.href)} rel="noreferrer">
              <span>{item.label}</span>
              {item.download ? <ArrowDown aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
            </a>
          ))}
        </div>
        <footer>
          <span>BLR {time} IST</span>
          <span>{content.footer}</span>
        </footer>
      </section>
    </main>
  );
}

function MetricList({ metrics }) {
  const cleaned = list(metrics).filter((item) => clean(item.v) || clean(item.k));
  if (!cleaned.length) return null;
  return (
    <div className="metrics">
      {cleaned.slice(0, 4).map((metric) => (
        <div key={`${metric.v}-${metric.k}`}>
          <strong>{metric.v}</strong>
          <span>{metric.k}</span>
        </div>
      ))}
    </div>
  );
}

function ProjectLinks({ links }) {
  const cleaned = list(links).map((item) => ({ label: clean(item.label), href: safeHref(item.href) })).filter((item) => item.label && item.href);
  if (!cleaned.length) return null;
  return (
    <div className="project-links">
      {cleaned.map((item) => (
        <a key={`${item.label}-${item.href}`} href={item.href} target={targetFor(item.href)} rel="noreferrer">
          {item.label} <ExternalIcon />
        </a>
      ))}
    </div>
  );
}
