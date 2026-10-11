"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Plus, Save, Trash2 } from "lucide-react";

const clone = (value) => JSON.parse(JSON.stringify(value));
const asArray = (value) => (Array.isArray(value) ? value : []);

export default function AdminEditor({ initialContent }) {
  const [content, setContent] = useState(initialContent);
  const [tab, setTab] = useState("hero");
  const [projectIndex, setProjectIndex] = useState(0);
  const [message, setMessage] = useState("");
  const tabs = ["hero", "projects", "experience", "credentials", "site", "data"];

  const selectedProject = useMemo(() => asArray(content.projects)[projectIndex], [content.projects, projectIndex]);

  function update(mutator) {
    setContent((current) => {
      const next = clone(current);
      mutator(next);
      return next;
    });
    setMessage("Unsaved changes");
  }

  async function save() {
    setMessage("Saving...");
    const response = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setMessage(response.ok ? "Saved to data/portfolio.json" : "Could not save");
  }

  async function upload(file, onDone) {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: form });
    const result = await response.json();
    if (result.url) onDone(result.url);
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/">Sreehari Portfolio</a>
        <div className="admin-tabs">
          {tabs.map((item) => (
            <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>
              {label(item)}
            </button>
          ))}
        </div>
        <button className="solid-button full" onClick={save}>
          <Save aria-hidden="true" size={17} /> Save changes
        </button>
        <p className="save-message">{message || "Editing project content source"}</p>
      </aside>

      <section className="admin-panel">
        {tab === "hero" && (
          <EditorGroup title="Hero">
            <TextInput label="Header name" value={content.brand} onChange={(value) => update((c) => { c.brand = value; })} />
            <TextInput label="Small line" value={content.eyebrow} onChange={(value) => update((c) => { c.eyebrow = value; })} />
            <Textarea label="Headline" rows={4} value={content.headline} onChange={(value) => update((c) => { c.headline = value; })} />
            <Textarea label="Intro" rows={5} value={content.intro} onChange={(value) => update((c) => { c.intro = value; })} />
            <PairList title="Links" items={content.links} first="label" second="href" onChange={(items) => update((c) => { c.links = items; })} blank={{ label: "Link", href: "https://" }} />
            <PairList title="Facts" items={content.facts} first="k" second="v" onChange={(items) => update((c) => { c.facts = items; })} blank={{ k: "Label", v: "Value" }} />
          </EditorGroup>
        )}

        {tab === "projects" && (
          <EditorGroup title="Projects">
            <div className="picker">
              {asArray(content.projects).map((project, index) => (
                <button key={project.id || index} className={index === projectIndex ? "active" : ""} onClick={() => setProjectIndex(index)}>
                  {index + 1}. {project.title || "Untitled"} {project.featured ? "*" : ""}
                </button>
              ))}
              <button onClick={() => update((c) => { c.projects.push(blankProject()); setProjectIndex(c.projects.length - 1); })}>
                <Plus aria-hidden="true" size={16} /> New project
              </button>
            </div>
            {selectedProject && (
              <div className="editor-card">
                <CheckInput label="Featured project" checked={!!selectedProject.featured} onChange={(value) => update((c) => { c.projects[projectIndex].featured = value; })} />
                <TextInput label="Title" value={selectedProject.title} onChange={(value) => update((c) => { c.projects[projectIndex].title = value; })} />
                <TextInput label="Category" value={selectedProject.tag} onChange={(value) => update((c) => { c.projects[projectIndex].tag = value; })} />
                <Textarea label="Description" rows={4} value={selectedProject.sub} onChange={(value) => update((c) => { c.projects[projectIndex].sub = value; })} />
                <TextInput label="Tech stack" value={selectedProject.stack} onChange={(value) => update((c) => { c.projects[projectIndex].stack = value; })} />
                <TextInput label="Image path" value={selectedProject.img} onChange={(value) => update((c) => { c.projects[projectIndex].img = value; })} />
                <label className="upload-button">
                  <ImagePlus aria-hidden="true" size={17} />
                  Upload image
                  <input type="file" accept="image/*" onChange={(event) => upload(event.target.files?.[0], (url) => update((c) => { c.projects[projectIndex].img = url; }))} />
                </label>
                <PairList title="Metrics" items={selectedProject.metrics} first="v" second="k" onChange={(items) => update((c) => { c.projects[projectIndex].metrics = items; })} blank={{ v: "", k: "" }} />
                <PairList title="Buttons" items={selectedProject.links} first="label" second="href" onChange={(items) => update((c) => { c.projects[projectIndex].links = items; })} blank={{ label: "GitHub", href: "https://" }} />
                <div className="row-actions">
                  <IconButton label="Move earlier" icon={<ArrowUp size={16} />} onClick={() => moveProject(-1)} />
                  <IconButton label="Move later" icon={<ArrowDown size={16} />} onClick={() => moveProject(1)} />
                  <IconButton label="Delete" icon={<Trash2 size={16} />} danger onClick={() => update((c) => { c.projects.splice(projectIndex, 1); setProjectIndex(Math.max(0, projectIndex - 1)); })} />
                </div>
              </div>
            )}
          </EditorGroup>
        )}

        {tab === "experience" && (
          <EditorGroup title="Experience">
            <TextInput label="Section title" value={content.expTitle} onChange={(value) => update((c) => { c.expTitle = value; })} />
            <Repeater
              items={content.exp}
              blank={{ date: "", role: "New role", org: "", now: false, pts: [] }}
              onChange={(items) => update((c) => { c.exp = items; })}
              render={(item, index, setItem) => (
                <>
                  <TextInput label="Date" value={item.date} onChange={(value) => setItem(index, { ...item, date: value })} />
                  <TextInput label="Role" value={item.role} onChange={(value) => setItem(index, { ...item, role: value })} />
                  <TextInput label="Organisation" value={item.org} onChange={(value) => setItem(index, { ...item, org: value })} />
                  <CheckInput label="Show Now badge" checked={!!item.now} onChange={(value) => setItem(index, { ...item, now: value })} />
                  <Textarea label="Bullets, one per line" rows={5} value={asArray(item.pts).join("\n")} onChange={(value) => setItem(index, { ...item, pts: value.split("\n").filter(Boolean) })} />
                </>
              )}
            />
          </EditorGroup>
        )}

        {tab === "credentials" && (
          <EditorGroup title="Credentials">
            <PairList title="Certifications" items={content.certs} first="year" second="title" third="org" onChange={(items) => update((c) => { c.certs = items; })} blank={{ year: "", title: "New certification", org: "" }} />
            <PairList title="Skill groups" items={content.skills} first="k" second="items" onChange={(items) => update((c) => { c.skills = items; })} blank={{ k: "Group", items: "" }} />
          </EditorGroup>
        )}

        {tab === "site" && (
          <EditorGroup title="Site and contact">
            <TextInput label="Email" value={content.email} onChange={(value) => update((c) => { c.email = value; })} />
            <TextInput label="Resume path or URL" value={content.resumeUrl} onChange={(value) => update((c) => { c.resumeUrl = value; })} />
            <TextInput label="Contact note" value={content.note} onChange={(value) => update((c) => { c.note = value; })} />
            <TextInput label="Footer" value={content.footer} onChange={(value) => update((c) => { c.footer = value; })} />
            <TextInput label="Work title" value={content.workTitle} onChange={(value) => update((c) => { c.workTitle = value; })} />
            <TextInput label="More title" value={content.moreTitle} onChange={(value) => update((c) => { c.moreTitle = value; })} />
            <TextInput label="All projects URL" value={content.allUrl} onChange={(value) => update((c) => { c.allUrl = value; })} />
            <TextInput label="All projects label" value={content.allLabel} onChange={(value) => update((c) => { c.allLabel = value; })} />
          </EditorGroup>
        )}

        {tab === "data" && (
          <EditorGroup title="Raw JSON">
            <Textarea label="Content JSON" rows={28} value={JSON.stringify(content, null, 2)} onChange={(value) => {
              try {
                setContent(JSON.parse(value));
                setMessage("Valid JSON, unsaved changes");
              } catch {
                setMessage("JSON is not valid yet");
              }
            }} />
          </EditorGroup>
        )}
      </section>
    </main>
  );

  function moveProject(direction) {
    update((c) => {
      const next = projectIndex + direction;
      if (next < 0 || next >= c.projects.length) return;
      const [item] = c.projects.splice(projectIndex, 1);
      c.projects.splice(next, 0, item);
      setProjectIndex(next);
    });
  }
}

function blankProject() {
  return {
    id: `project-${Date.now()}`,
    featured: false,
    title: "New project",
    tag: "",
    sub: "",
    stack: "",
    img: "",
    metrics: [],
    links: [],
  };
}

function label(value) {
  return value[0].toUpperCase() + value.slice(1);
}

function EditorGroup({ title, children }) {
  return (
    <div className="editor-group">
      <h1>{title}</h1>
      {children}
    </div>
  );
}

function TextInput({ label, value, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input value={value || ""} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Textarea({ label, value, onChange, rows = 4 }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea rows={rows} value={value || ""} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function CheckInput({ label, checked, onChange }) {
  return (
    <label className="check-field">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function IconButton({ label, icon, onClick, danger }) {
  return (
    <button className={danger ? "icon-button danger" : "icon-button"} onClick={onClick}>
      {icon} {label}
    </button>
  );
}

function PairList({ title, items, first, second, third, onChange, blank }) {
  const rows = asArray(items);

  function setRow(index, key, value) {
    const next = clone(rows);
    next[index][key] = value;
    onChange(next);
  }

  return (
    <div className="nested-editor">
      <div className="nested-heading">
        <h2>{title}</h2>
        <button onClick={() => onChange([...rows, clone(blank)])}><Plus aria-hidden="true" size={16} /> Add</button>
      </div>
      {rows.map((item, index) => (
        <div className="nested-row" key={index}>
          <TextInput label={first} value={item[first]} onChange={(value) => setRow(index, first, value)} />
          <TextInput label={second} value={item[second]} onChange={(value) => setRow(index, second, value)} />
          {third && <TextInput label={third} value={item[third]} onChange={(value) => setRow(index, third, value)} />}
          <div className="row-actions">
            <IconButton label="Up" icon={<ArrowUp size={16} />} onClick={() => onChange(move(rows, index, -1))} />
            <IconButton label="Down" icon={<ArrowDown size={16} />} onClick={() => onChange(move(rows, index, 1))} />
            <IconButton label="Remove" icon={<Trash2 size={16} />} danger onClick={() => onChange(rows.filter((_, i) => i !== index))} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Repeater({ items, blank, onChange, render }) {
  const rows = asArray(items);

  function setItem(index, item) {
    const next = clone(rows);
    next[index] = item;
    onChange(next);
  }

  return (
    <div className="nested-editor">
      <div className="nested-heading">
        <h2>Entries</h2>
        <button onClick={() => onChange([...rows, clone(blank)])}><Plus aria-hidden="true" size={16} /> Add</button>
      </div>
      {rows.map((item, index) => (
        <div className="nested-row" key={index}>
          {render(item, index, setItem)}
          <div className="row-actions">
            <IconButton label="Up" icon={<ArrowUp size={16} />} onClick={() => onChange(move(rows, index, -1))} />
            <IconButton label="Down" icon={<ArrowDown size={16} />} onClick={() => onChange(move(rows, index, 1))} />
            <IconButton label="Remove" icon={<Trash2 size={16} />} danger onClick={() => onChange(rows.filter((_, i) => i !== index))} />
          </div>
        </div>
      ))}
    </div>
  );
}

function move(rows, index, direction) {
  const next = clone(rows);
  const target = index + direction;
  if (target < 0 || target >= next.length) return next;
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return next;
}
