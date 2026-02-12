# myP0

A personal productivity app that keeps your data in your Google account. No servers, no tracking, fully open source.

myP0 unifies tasks, notes, and calendar in one interface. All data stays in the user's Google account — the app is a stateless frontend with no backend database.

## Architecture

```
┌─────────────────────────────────────┐
│  PWA (static files on GitHub Pages) │
│  SvelteKit + Tailwind + Tiptap      │
│  PKCE OAuth, IndexedDB cache        │
└──────────────┬──────────────────────┘
               │ direct API calls
               ▼
       Google Workspace
  (Calendar, Tasks, Drive APIs)
```

- **No backend** — Auth uses PKCE OAuth entirely in the browser. Data goes directly to Google APIs.
- **Offline-first** — Changes save to IndexedDB instantly, then sync to Google Drive in the background.
- **Static deployment** — The entire app builds to static files and deploys to GitHub Pages.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | SvelteKit (static adapter, SSG) |
| Language | TypeScript, Svelte 5 |
| Styling | Tailwind CSS |
| Blog | MDsveX (Markdown + Svelte) |
| Editor | Tiptap (headless block editor) |
| Local storage | IndexedDB via idb-keyval |
| Remote storage | Google Drive appDataFolder |
| Auth | Google OAuth PKCE |
| CI/CD | GitHub Actions → GitHub Pages |

## Getting Started

### Prerequisites

- Node.js 22+
- npm

### Setup

```bash
# Clone the repo
git clone https://github.com/myP0/myP0-web.git
cd myP0-web

# Install dependencies
npm install

# Start dev server
npm run dev
```

The dev server runs at `http://localhost:5173`.

### Environment Variables

Create a `.env` file in the project root:

```bash
PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (output in `build/`) |
| `npm run preview` | Preview production build locally |
| `npm run check` | Run svelte-check type checking |

## Project Structure

```
src/
├── app.css                    # Global styles (Tailwind)
├── app.html                   # HTML shell
├── routes/
│   ├── +page.svelte           # Landing page
│   ├── +layout.svelte         # Root layout (CSS, dark mode toggle)
│   ├── +layout.ts             # Prerender config
│   ├── blog/
│   │   ├── +page.svelte       # Blog index
│   │   ├── +page.ts           # Blog index data loader
│   │   └── [slug]/
│   │       ├── +page.svelte   # Blog post renderer
│   │       └── +page.ts       # Blog post data loader
│   ├── sitemap.xml/+server.ts # Auto-generated sitemap
│   └── rss.xml/+server.ts     # RSS feed
├── lib/
│   └── components/
│       ├── BlogLayout.svelte  # MDsveX layout for blog posts
│       └── DarkModeToggle.svelte
├── content/
│   └── blog/                  # Blog posts (Markdown)
│       ├── why-simple-todo-lists-fail.md
│       └── notes-tasks-calendar-the-productivity-triangle.md
static/
├── robots.txt
├── llms.txt                   # LLM-friendly site summary
├── llms-full.txt              # Detailed LLM reference
├── favicon.png
└── CNAME
```

## Blog

Blog posts are Markdown files in `src/content/blog/`. They use MDsveX with a shared layout component.

### Adding a new post

Create a `.md` file in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
description: "A short description for SEO and previews."
date: "2026-01-15"
tag: "Category"
layout: "blog"
---

Your content here...
```

The post will automatically appear on `/blog`, in the sitemap, and in the RSS feed.

## Deployment

Pushes to `main` trigger a GitHub Actions workflow that:

1. Installs dependencies (`npm ci`)
2. Builds the static site (`npm run build`)
3. Deploys to GitHub Pages

The site is served from the `build/` directory at [myp0.com](https://myp0.com).

## SEO

The site includes:

- Canonical URLs and Open Graph / Twitter Card tags on all pages
- JSON-LD structured data (WebSite, Organization, SoftwareApplication, FAQPage, BlogPosting, BreadcrumbList)
- Auto-generated sitemap at `/sitemap.xml`
- RSS feed at `/rss.xml`
- `llms.txt` and `llms-full.txt` for AI/LLM discoverability

## License

MIT
