# Portfolio Update Notes

## Main Files
- `src/data/profile.ts`: main editable content source for profile, links, projects, skills, experience, and learning items
- `src/components/`: React components for each site section
- `src/styles.css`: custom editorial design system and responsive layout
- `index.html`: Vite entrypoint and font loading

## Legacy Static Reference
The original static portfolio is preserved as backup/reference:
- `SreehariPortfolio.html`
- `SreehariPortfolioStyles.css`
- `SreehariPortfolioInteractions.js`

## Update Links
Replace these placeholders in `src/data/profile.ts`:
- `your.email@example.com`
- `links.github`
- `links.linkedin`
- `links.resume`
- `links.email`

Also update project links in `src/data/profile.ts`:
- `links: { github: '#', demo: '#' }`

## Update Projects
Project cards are defined in `src/data/profile.ts` inside:
- `const projects = [...]`

Update:
- `status.label`
- `description`
- `stack`
- `problem`
- `approach`
- `proves`
- `links`

Keep planned projects marked as `Planned` until they are real.

## Update Skills
Skill groups are defined in `src/data/profile.ts` inside:
- `const skills = [...]`

Avoid overstating skill levels. Use the site as a clean resume surface, not a fake seniority signal.

## Run Locally
- `npm install`
- `npm run dev`
- open the local URL Vite prints

## Production Build
- `npm run build`
- output goes to `dist/`
- ready for Vercel static deployment

## Visual Check
Screenshots generated:
- `react-portfolio-desktop.png`
- `react-portfolio-mobile.png`

Open the React dev server to check interactions:
- command palette: `Ctrl+K`
- project expand/collapse
- skill filters
- mobile menu
