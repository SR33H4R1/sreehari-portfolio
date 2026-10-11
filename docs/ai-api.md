# AI Portfolio API Playbook

This is the operating manual for AI agents that update Sreehari's portfolio site. The API can do everything the admin panel can do: read content, replace content, patch individual fields, add/update/delete projects, toggle sections, upload project images, upload a resume PDF, and publish uploaded file URLs into the site content.

Production site:

```text
https://sreeharial.me
```

## Golden Rules

1. Read current content before changing anything.
2. Prefer `PATCH /api/ai/content` for targeted edits.
3. Use `PUT /api/ai/content` only when replacing the entire portfolio JSON.
4. Upload files first, then copy the returned `url` into `project.img` or `resumeUrl`.
5. Preserve fields the user did not ask to change.
6. After every write, call `GET /api/ai/content` to verify the saved result.
7. Do not invent real project links, metrics, certifications, employers, dates, or resume details unless the user provides them.
8. Keep image paths as site URLs, for example `/api/assets/...` or `/ph/...`.
9. Do not expose the admin password in logs, screenshots, commits, docs, or final user-facing text.

## Authentication

All mutating AI endpoints require the same password as the admin panel. Send it with either header:

```http
Authorization: Bearer YOUR_ADMIN_PASSWORD
```

or:

```http
x-api-key: YOUR_ADMIN_PASSWORD
```

`GET /api/ai/docs` is public so agents can discover this guide. `GET /api/ai/content`, `PUT /api/ai/content`, `PATCH /api/ai/content`, and `POST /api/ai/upload` require authentication.

## Endpoint Summary

| Method | Endpoint | Auth | Purpose |
|---|---|---:|---|
| `GET` | `/api/ai/docs` | No | Read this documentation as Markdown. |
| `GET` | `/api/ai/content` | Yes | Read the current editable portfolio JSON. |
| `PATCH` | `/api/ai/content` | Yes | Apply targeted edits, section toggles, project updates, and append operations. |
| `PUT` | `/api/ai/content` | Yes | Replace the entire portfolio JSON. |
| `POST` | `/api/ai/upload` | Yes | Upload a project image or resume PDF and receive a public URL. |
| `GET` | `/api/content` | No | Public content endpoint used by the site. |
| `GET` | `/api/assets/{id}/{name}` | No | Serves uploaded files stored in Supabase/Postgres. |

## Standard AI Workflow

```bash
# 1. Read current content
curl https://sreeharial.me/api/ai/content \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD"

# 2. Make a targeted patch
curl -X PATCH https://sreeharial.me/api/ai/content \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{ "set": { "note": "Open to AI engineering roles" } }'

# 3. Verify
curl https://sreeharial.me/api/ai/content \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD"
```

Successful patch response:

```json
{
  "ok": true,
  "mode": "patch",
  "summary": ["set:note"],
  "content": {}
}
```

`content` contains the full saved content object.

## Content Schema

The editable content is one JSON object.

```json
{
  "brand": "SREEHARI A L",
  "eyebrow": "Sreehari A L · AI & Backend Engineer",
  "headline": "I build LLM systems\nthat cite their\nsources.",
  "intro": "Short hero intro.",
  "links": [],
  "facts": [],
  "email": "name@example.com",
  "resumeUrl": "/api/assets/id/resume.pdf",
  "note": "Short contact note.",
  "footer": "© 2026 Sreehari A L",
  "workTitle": "Selected work",
  "moreTitle": "Other projects",
  "expTitle": "Experience",
  "allUrl": "https://github.com/SR33H4R1",
  "allLabel": "All on GitHub",
  "showWorkSection": true,
  "showFeaturedProjects": true,
  "showMoreProjects": true,
  "showAllProjectsLink": true,
  "showExperienceSection": true,
  "showCertificationsSection": true,
  "showToolkitSection": true,
  "showContactSection": true,
  "projects": [],
  "exp": [],
  "certs": [],
  "skills": []
}
```

## Top-Level Text Fields

| Field | Type | What It Controls |
|---|---|---|
| `brand` | string | Header name/logo text. |
| `eyebrow` | string | Small uppercase line above hero headline. |
| `headline` | string | Main hero headline. New lines are allowed with `\n`. |
| `intro` | string | Hero paragraph under the headline. |
| `email` | string | Email shown in hero/contact. Blank hides email actions. |
| `resumeUrl` | string | Resume URL or uploaded PDF URL. Blank hides resume buttons. |
| `note` | string | Contact note above email. |
| `footer` | string | Footer text. |
| `workTitle` | string | Featured work section title. |
| `moreTitle` | string | Other projects title. |
| `expTitle` | string | Experience/about section title. |
| `allUrl` | string | URL for the "All projects" link. Blank hides the link. |
| `allLabel` | string | Label for the "All projects" link. |

## Section Toggles

Set these to `true` or `false`.

| Field | Effect |
|---|---|
| `showWorkSection` | Shows/hides the entire work/projects section. |
| `showFeaturedProjects` | Shows/hides featured project panels. |
| `showMoreProjects` | Shows/hides non-featured "Other projects". |
| `showAllProjectsLink` | Shows/hides the "All projects" link. |
| `showExperienceSection` | Shows/hides work/study experience. |
| `showCertificationsSection` | Shows/hides certifications. |
| `showToolkitSection` | Shows/hides skills/toolkit. |
| `showContactSection` | Shows/hides contact section. |

## Repeated Data Shapes

### `links`

```json
{
  "label": "GitHub",
  "href": "https://github.com/SR33H4R1/"
}
```

`label` is visible text. `href` can be an external URL, `mailto:`, or internal path.

### `facts`

```json
{
  "k": "Based",
  "v": "Bengaluru, India"
}
```

`k` is the short label. `v` is the value. Keep values short for mobile.

### `projects`

```json
{
  "id": "grounded-shot",
  "featured": true,
  "title": "Grounded",
  "tag": "Role-aware RAG",
  "sub": "Ask across your documents and get an answer with its source attached.",
  "stack": "FastAPI · FAISS · OpenAI-compatible LLM · Docker · CI",
  "img": "/ph/grounded-shot.png",
  "metrics": [
    { "v": "RBAC", "k": "access control on retrieval" },
    { "v": "Cited", "k": "source on every answer" }
  ],
  "links": [
    { "label": "Live demo", "href": "#" },
    { "label": "GitHub", "href": "https://github.com/SR33H4R1/Grounded" }
  ]
}
```

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | string | Yes | Stable unique ID. Use lowercase kebab-case. |
| `featured` | boolean | Yes | `true` shows in featured panels, `false` shows in other projects. |
| `title` | string | Yes | Project name. |
| `tag` | string | No | Short category label. |
| `sub` | string | No | Description. Keep concise. |
| `stack` | string | No | Tech stack, usually separated with `·`. |
| `img` | string | No | Image URL/path. Use uploaded `url` or existing `/ph/...`. |
| `metrics` | array | No | Up to 4 metric objects recommended. |
| `links` | array | No | Project buttons. |

### `metrics`

```json
{
  "v": "100%",
  "k": "on-prem"
}
```

`v` is the large value. `k` is the supporting label.

### `exp`

```json
{
  "date": "May 2026 - Present",
  "role": "AI Engineer Intern",
  "org": "Tecnots · Bengaluru",
  "now": true,
  "pts": [
    "Built RAG pipelines with citation-enforced answers.",
    "Built an LLM-as-judge eval suite."
  ]
}
```

`date`, `role`, and `org` display in the collapsed row. `now: true` shows a "Now" badge. `pts` is an array of bullets shown when expanded.

### `certs`

```json
{
  "year": "2026",
  "title": "Generative AI Applications",
  "org": "IBM"
}
```

### `skills`

```json
{
  "k": "LLM",
  "items": "RAG, LangChain, LangGraph, FAISS, pgvector"
}
```

`k` is the skill group name. `items` is a comma-separated string. The UI turns it into chips.

## Patch API

Use:

```http
PATCH /api/ai/content
```

Patch body can include any combination of these keys:

```json
{
  "set": {},
  "unset": [],
  "sections": {},
  "project": {},
  "deleteProjectId": "project-id",
  "experience": {},
  "certification": {},
  "skill": {}
}
```

### `set`

Sets fields by dot path.

```json
{
  "set": {
    "headline": "I build AI systems that ship.",
    "projects.0.title": "Grounded RAG",
    "facts.1.v": "Open to AI roles"
  }
}
```

Editable root paths:

```text
brand, eyebrow, headline, intro, links, facts, email, resumeUrl, note, footer,
workTitle, moreTitle, expTitle, allUrl, allLabel,
showWorkSection, showFeaturedProjects, showMoreProjects, showAllProjectsLink,
showExperienceSection, showCertificationsSection, showToolkitSection,
showContactSection, projects, exp, certs, skills
```

### `unset`

Removes object fields or array items by dot path.

```json
{
  "unset": ["projects.2.links.0"]
}
```

### `sections`

Shortcut for section toggles.

```json
{
  "sections": {
    "showMoreProjects": false,
    "showCertificationsSection": true
  }
}
```

### `project`

Creates or updates a project by `id`. If `id` exists, fields are merged into the existing project. If it does not exist, the project is appended.

```json
{
  "project": {
    "id": "new-rag-project",
    "featured": false,
    "title": "New RAG Project",
    "tag": "RAG",
    "sub": "Short project description.",
    "stack": "FastAPI · PostgreSQL · LLM",
    "img": "/ph/more-shot-0.png",
    "metrics": [{ "v": "100%", "k": "traceable answers" }],
    "links": [{ "label": "GitHub", "href": "https://github.com/SR33H4R1/" }]
  }
}
```

### `deleteProjectId`

Deletes one project by ID.

```json
{
  "deleteProjectId": "old-project-id"
}
```

### `experience`

Appends one experience item.

```json
{
  "experience": {
    "date": "2026",
    "role": "AI Engineer",
    "org": "Company · City",
    "now": false,
    "pts": ["Built production AI systems."]
  }
}
```

### `certification`

Appends one certification.

```json
{
  "certification": {
    "year": "2026",
    "title": "Certification Name",
    "org": "Issuer"
  }
}
```

### `skill`

Upserts one skill group by `k`.

```json
{
  "skill": {
    "k": "Backend",
    "items": "Python, FastAPI, PostgreSQL, Docker"
  }
}
```

## Replace Entire Content

Use only when intentionally replacing the complete JSON.

```bash
curl -X PUT https://sreeharial.me/api/ai/content \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  --data @portfolio.json
```

Response:

```json
{
  "ok": true,
  "mode": "replace"
}
```

Warning: `PUT` overwrites the entire content document. Missing fields may disappear from the site.

## Upload API

Use:

```http
POST /api/ai/upload
```

Supported file types:

```text
image/png
image/jpeg
image/webp
image/gif
application/pdf
```

Upload a project image:

```bash
curl -X POST https://sreeharial.me/api/ai/upload \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD" \
  -F "file=@project-image.png"
```

Upload a resume:

```bash
curl -X POST https://sreeharial.me/api/ai/upload \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD" \
  -F "file=@Sreehari_Resume.pdf"
```

Response:

```json
{
  "url": "/api/assets/asset-id/file-name.png",
  "path": "projects/123-file-name.png"
}
```

For PDFs, `path` starts with `resumes/`. For images, `path` starts with `projects/`.

After upload:

- Set a project image with `set: { "projects.0.img": "/api/assets/..." }`, or
- Set a resume with `set: { "resumeUrl": "/api/assets/..." }`.

## Complete Recipes

### Change Hero Headline

```bash
curl -X PATCH https://sreeharial.me/api/ai/content \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "set": {
      "headline": "I build AI systems\nthat ship.",
      "intro": "AI engineer focused on reliable LLM applications, RAG, evals and backend systems."
    }
  }'
```

### Hide More Projects

```bash
curl -X PATCH https://sreeharial.me/api/ai/content \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{ "sections": { "showMoreProjects": false } }'
```

### Show More Projects Again

```bash
curl -X PATCH https://sreeharial.me/api/ai/content \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{ "sections": { "showMoreProjects": true } }'
```

### Add A New Non-Featured Project

```bash
curl -X PATCH https://sreeharial.me/api/ai/content \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "project": {
      "id": "portfolio-api",
      "featured": false,
      "title": "Portfolio AI API",
      "tag": "Automation",
      "sub": "A password-protected API that lets AI agents update portfolio content and uploads.",
      "stack": "Next.js · PostgreSQL · Vercel",
      "img": "/ph/more-shot-0.png",
      "metrics": [
        { "v": "API", "k": "content editing" },
        { "v": "Secure", "k": "password protected" }
      ],
      "links": [
        { "label": "GitHub", "href": "https://github.com/SR33H4R1/sreehari-portfolio" }
      ]
    }
  }'
```

### Add A Featured Project

Set `featured` to `true`.

```json
{
  "project": {
    "id": "featured-project-id",
    "featured": true,
    "title": "Featured Project",
    "tag": "AI",
    "sub": "Description.",
    "stack": "Python · FastAPI · PostgreSQL",
    "img": "/ph/grounded-shot.png",
    "metrics": [],
    "links": []
  }
}
```

### Update Existing Project Title

```bash
curl -X PATCH https://sreeharial.me/api/ai/content \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "project": {
      "id": "grounded-shot",
      "title": "Grounded RAG"
    }
  }'
```

### Delete A Project

```bash
curl -X PATCH https://sreeharial.me/api/ai/content \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{ "deleteProjectId": "old-project-id" }'
```

### Upload A Project Image And Attach It

Step 1: upload.

```bash
curl -X POST https://sreeharial.me/api/ai/upload \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD" \
  -F "file=@screenshot.png"
```

Step 2: copy the returned `url` and patch the project.

```bash
curl -X PATCH https://sreeharial.me/api/ai/content \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "project": {
      "id": "grounded-shot",
      "img": "/api/assets/asset-id/screenshot.png"
    }
  }'
```

### Upload A Resume And Make It Live

Step 1: upload PDF.

```bash
curl -X POST https://sreeharial.me/api/ai/upload \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD" \
  -F "file=@resume.pdf"
```

Step 2: set `resumeUrl`.

```bash
curl -X PATCH https://sreeharial.me/api/ai/content \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "set": {
      "resumeUrl": "/api/assets/asset-id/resume.pdf"
    }
  }'
```

### Edit Links

```json
{
  "set": {
    "links": [
      { "label": "GitHub", "href": "https://github.com/SR33H4R1/" },
      { "label": "LinkedIn", "href": "https://linkedin.com/in/sreehari-a-l" }
    ]
  }
}
```

### Edit Facts

```json
{
  "set": {
    "facts": [
      { "k": "Based", "v": "Bengaluru, India" },
      { "k": "Status", "v": "Open to roles" },
      { "k": "Focus", "v": "RAG, agents, evals" },
      { "k": "Stack", "v": "Python, FastAPI" }
    ]
  }
}
```

### Add Experience

```json
{
  "experience": {
    "date": "2026",
    "role": "AI Engineer",
    "org": "Company · City",
    "now": false,
    "pts": [
      "Built production RAG workflows.",
      "Improved quality with evals and tracing."
    ]
  }
}
```

### Add Certification

```json
{
  "certification": {
    "year": "2026",
    "title": "Generative AI Applications",
    "org": "IBM"
  }
}
```

### Update Skill Group

```json
{
  "skill": {
    "k": "LLM",
    "items": "RAG, LangChain, LangGraph, FAISS, pgvector, evals"
  }
}
```

### Hide Resume Buttons

```json
{
  "set": {
    "resumeUrl": ""
  }
}
```

### Hide Email Actions

```json
{
  "set": {
    "email": ""
  }
}
```

## Error Responses

### Missing Or Wrong Password

Status: `401`

```json
{
  "error": "Unauthorized"
}
```

### Bad Patch

Status: `400`

```json
{
  "error": "Path \"unknownField\" is not editable"
}
```

### Missing Upload File

Status: `400`

```json
{
  "error": "No file uploaded"
}
```

### Unsupported Upload File

Status: `400`

```json
{
  "error": "Unsupported file type"
}
```

## Verification Checklist

After changing content:

1. Call `GET /api/ai/content`.
2. Confirm the changed fields are present.
3. Load `https://sreeharial.me`.
4. Check desktop and mobile if the change affects layout.
5. If a file was uploaded, open the returned `url`.
6. If a project was updated, confirm the project appears in the correct section:
   - `featured: true` means featured panels.
   - `featured: false` means other projects.

## Public Site Behavior Notes

- Blank `email` hides email blocks.
- Blank `resumeUrl` hides resume buttons/links.
- Blank `allUrl` hides the all-projects link.
- Empty arrays hide their corresponding repeated content.
- Section toggles can hide sections even when content exists.
- Project images should be landscape when possible.
- Very long words may wrap, but concise text looks better on mobile.
- The site reads from Supabase/Postgres in production and falls back to default JSON only if database reading fails.

## Minimal Agent Contract

If another AI only remembers one flow, use this:

```text
GET /api/ai/content with password.
PATCH /api/ai/content with only the requested changes.
For files, POST /api/ai/upload first and use the returned url in a PATCH.
GET /api/ai/content again to verify.
```
