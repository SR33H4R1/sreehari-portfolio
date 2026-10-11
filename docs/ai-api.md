# AI Portfolio API

This API lets an AI agent make the same portfolio changes that the admin panel can make.

## Authentication

All `/api/ai/*` endpoints require the same password as the admin panel.

Send it with either header:

```bash
Authorization: Bearer YOUR_ADMIN_PASSWORD
```

or:

```bash
x-api-key: YOUR_ADMIN_PASSWORD
```

## Endpoints

### Read Current Content

```bash
curl https://sreeharial.me/api/ai/content \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD"
```

### Replace All Content

Use this when an AI has edited the complete JSON document.

```bash
curl -X PUT https://sreeharial.me/api/ai/content \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  --data @portfolio.json
```

### Patch Content

Use this for safer targeted updates.

```bash
curl -X PATCH https://sreeharial.me/api/ai/content \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
    "set": {
      "headline": "I build AI systems that ship.",
      "note": "Open to AI engineering roles"
    },
    "sections": {
      "showMoreProjects": false,
      "showContactSection": true
    }
  }'
```

Supported patch keys:

- `set`: object of dot-paths to values, for example `headline`, `projects.0.title`, `resumeUrl`.
- `unset`: array of dot-paths to remove.
- `sections`: section toggles such as `showMoreProjects`, `showFeaturedProjects`, `showExperienceSection`, `showCertificationsSection`, `showToolkitSection`, `showContactSection`, `showWorkSection`, `showAllProjectsLink`.
- `project`: upserts a project by `id`.
- `deleteProjectId`: removes a project by `id`.
- `experience`: appends one work/study item.
- `certification`: appends one certification item.
- `skill`: upserts one skill group by `k`.

### Upsert A Project

```bash
curl -X PATCH https://sreeharial.me/api/ai/content \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

### Upload Image Or Resume

Upload images for projects or a PDF resume. The response returns a `url`; set that URL on `projects.N.img` or `resumeUrl`.

```bash
curl -X POST https://sreeharial.me/api/ai/upload \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD" \
  -F "file=@project-image.png"
```

Response:

```json
{
  "url": "/api/assets/asset-id/project-image.png",
  "path": "projects/123-project-image.png"
}
```

## Editable Content Shape

Top-level editable fields:

```text
brand, eyebrow, headline, intro, links, facts, email, resumeUrl, note, footer,
workTitle, moreTitle, expTitle, allUrl, allLabel,
showWorkSection, showFeaturedProjects, showMoreProjects, showAllProjectsLink,
showExperienceSection, showCertificationsSection, showToolkitSection,
showContactSection, projects, exp, certs, skills
```

The public, unauthenticated content endpoint remains:

```text
GET /api/content
```
