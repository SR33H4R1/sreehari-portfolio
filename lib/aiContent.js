const editableRoots = new Set([
  "brand",
  "eyebrow",
  "headline",
  "intro",
  "links",
  "facts",
  "email",
  "resumeUrl",
  "note",
  "footer",
  "workTitle",
  "moreTitle",
  "expTitle",
  "allUrl",
  "allLabel",
  "showWorkSection",
  "showFeaturedProjects",
  "showMoreProjects",
  "showAllProjectsLink",
  "showExperienceSection",
  "showCertificationsSection",
  "showToolkitSection",
  "showContactSection",
  "projects",
  "exp",
  "certs",
  "skills",
]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function pathParts(path) {
  if (typeof path !== "string" || !path.trim()) throw new Error("Patch path must be a non-empty string");
  const parts = path.split(".").filter(Boolean);
  if (!editableRoots.has(parts[0])) throw new Error(`Path "${path}" is not editable`);
  return parts;
}

function assignPath(target, path, value) {
  const parts = pathParts(path);
  let cursor = target;

  for (let i = 0; i < parts.length - 1; i += 1) {
    const key = parts[i];
    if (cursor[key] === undefined || cursor[key] === null) {
      cursor[key] = /^\d+$/.test(parts[i + 1]) ? [] : {};
    }
    cursor = cursor[key];
  }

  cursor[parts[parts.length - 1]] = value;
}

function removePath(target, path) {
  const parts = pathParts(path);
  let cursor = target;

  for (let i = 0; i < parts.length - 1; i += 1) {
    cursor = cursor?.[parts[i]];
    if (cursor === undefined || cursor === null) return;
  }

  const last = parts[parts.length - 1];
  if (Array.isArray(cursor) && /^\d+$/.test(last)) {
    cursor.splice(Number(last), 1);
  } else if (cursor && typeof cursor === "object") {
    delete cursor[last];
  }
}

function ensureArray(content, key) {
  if (!Array.isArray(content[key])) content[key] = [];
  return content[key];
}

function upsertById(items, item) {
  if (!item || typeof item !== "object") throw new Error("Item must be an object");
  if (!item.id) item.id = `item-${Date.now()}`;
  const index = items.findIndex((entry) => entry?.id === item.id);
  if (index >= 0) {
    items[index] = { ...items[index], ...item };
    return { id: item.id, action: "updated" };
  }
  items.push(item);
  return { id: item.id, action: "created" };
}

export function applyAiPatch(content, patch) {
  const next = clone(content);
  const summary = [];

  for (const [path, value] of Object.entries(patch.set || {})) {
    assignPath(next, path, value);
    summary.push(`set:${path}`);
  }

  for (const path of patch.unset || []) {
    removePath(next, path);
    summary.push(`unset:${path}`);
  }

  for (const [key, value] of Object.entries(patch.sections || {})) {
    if (!key.startsWith("show") || !editableRoots.has(key)) throw new Error(`Unknown section toggle "${key}"`);
    next[key] = Boolean(value);
    summary.push(`section:${key}`);
  }

  if (patch.project) {
    const result = upsertById(ensureArray(next, "projects"), patch.project);
    summary.push(`project:${result.action}:${result.id}`);
  }

  if (patch.deleteProjectId) {
    const projects = ensureArray(next, "projects");
    const before = projects.length;
    next.projects = projects.filter((project) => project?.id !== patch.deleteProjectId);
    if (next.projects.length === before) throw new Error(`Project "${patch.deleteProjectId}" was not found`);
    summary.push(`project:deleted:${patch.deleteProjectId}`);
  }

  if (patch.experience) {
    const exp = ensureArray(next, "exp");
    exp.push(patch.experience);
    summary.push("experience:created");
  }

  if (patch.certification) {
    const certs = ensureArray(next, "certs");
    certs.push(patch.certification);
    summary.push("certification:created");
  }

  if (patch.skill) {
    const skills = ensureArray(next, "skills");
    const existing = skills.find((item) => item?.k === patch.skill.k);
    if (existing) Object.assign(existing, patch.skill);
    else skills.push(patch.skill);
    summary.push(`skill:${existing ? "updated" : "created"}`);
  }

  return { content: next, summary };
}
