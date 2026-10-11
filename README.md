# Sreehari Portfolio

Next.js portfolio site with an embedded visual editor based on the original portfolio design.

## Local development

```bash
npm install
npm run dev
```

Open:

- Portfolio: http://localhost:3000
- Admin: http://localhost:3000/admin

Set `ADMIN_PASSWORD` in production to protect the admin route and upload APIs.

Note: local uploads write into `public/uploads`. For permanent production uploads on Vercel, connect durable storage such as Vercel Blob.
