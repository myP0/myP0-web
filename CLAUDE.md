# myP0 - Personal Productivity App

## Project Philosophy

myP0 is a single-user personal productivity application built around data ownership and minimal infrastructure. The core principle: Google Workspace acts as the backend while the app remains a stateless frontend. Users maintain full control of their data within the Google ecosystem.

Key values:
- Data sovereignty (user owns all data in their Google account)
- Minimal infrastructure (no database, no server state)
- Offline-first (works without internet)
- Transparency (open source)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  PWA (static files)                                     │
│  - SvelteKit                                            │
│  - PKCE OAuth (no backend needed)                       │
│  - Direct Google API calls                              │
│  - IndexedDB for local state                            │
│  - TWA wrapper for Play Store                           │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
                 Google Workspace
           (Calendar, Tasks, Drive APIs)
                         ▲
                         │ reads notification schedule
┌────────────────────────┴────────────────────────────────┐
│  Lambda (single function, cron every few mins)          │
│  - Reads schedule from Drive appDataFolder              │
│  - Sends Web Push notifications                         │
│  - Stateless (no database)                              │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | SvelteKit | File-based routing, SSG for marketing/blog |
| UI Components | shadcn-svelte | Headless + Tailwind, copy-paste ownership |
| Styling | Tailwind CSS | Utility-first |
| Block Editor | Tiptap | Headless, JSON output, stores in Drive |
| Blog | MDsveX | Markdown with Svelte components |
| Local Storage | IndexedDB (idb-keyval) | Persistent local cache |
| Remote Storage | Google Drive appDataFolder | Sync/backup, hidden from user's Drive UI |
| Auth | Google OAuth PKCE | Entirely browser-based, no client secret |
| PWA | vite-plugin-pwa | Service worker, offline support |
| Notifications | AWS Lambda + Web Push | Only backend component |

## Project Structure

```
src/
├── routes/
│   ├── (marketing)/           # Static, SSG
│   │   ├── +page.svelte       # Landing page
│   │   ├── pricing/
│   │   └── about/
│   │
│   ├── (app)/                 # SPA, client-side
│   │   ├── +layout.svelte     # Auth guard, app shell
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   ├── notes/
│   │   └── calendar/
│   │
│   └── blog/
│       ├── +page.svelte       # Blog index
│       └── [slug]/
│           └── +page.svelte   # Individual posts (MDsveX)
│
├── lib/
│   ├── components/
│   │   └── ui/                # shadcn-svelte components
│   │
│   ├── stores/                # Svelte stores
│   │   ├── tasks.ts
│   │   ├── notes.ts
│   │   └── settings.ts
│   │
│   ├── sync/                  # IndexedDB ↔ Drive sync
│   │   ├── index.ts
│   │   ├── drive.ts
│   │   └── idb.ts
│   │
│   ├── google/                # Google API wrappers
│   │   ├── auth.ts            # PKCE OAuth flow
│   │   ├── calendar.ts
│   │   ├── tasks.ts
│   │   └── drive.ts
│   │
│   └── editor/                # Tiptap configuration
│       ├── index.ts
│       └── extensions/
│
├── content/
│   └── blog/                  # MDsveX blog posts
│       ├── why-data-ownership.md
│       └── ...
│
└── static/
    ├── manifest.json          # PWA manifest
    └── icons/
```

## Data Flow

### Local-First Pattern

1. User action updates Svelte store
2. Store persists to IndexedDB immediately (instant feedback)
3. Debounced sync to Google Drive (3 second delay after last change)
4. On app load: hydrate from IndexedDB first, then background sync from Drive

```typescript
// Example store pattern
function createTaskStore() {
  const { subscribe, set, update } = writable([])

  const debouncedSync = debounce(syncToDrive, 3000)

  return {
    subscribe,

    async init() {
      // 1. Load from IndexedDB (instant)
      const local = await idbGet('tasks')
      set(local || [])

      // 2. Background sync from Drive
      const remote = await fetchFromDrive('tasks.json')
      if (remote?.updatedAt > local?.updatedAt) {
        set(remote.data)
        await idbSet('tasks', remote.data)
      }
    },

    add(task) {
      update(tasks => {
        const updated = [...tasks, task]
        idbSet('tasks', updated)      // Local (instant)
        debouncedSync()                // Remote (debounced)
        return updated
      })
    }
  }
}
```

### Sync Triggers

| Event | Action |
|-------|--------|
| App load | `syncFromDrive()` |
| Any mutation | `debouncedSync()` (3s delay) |
| Tab hidden | `syncToDrive()` immediately |
| Tab visible | `syncFromDrive()` |
| Coming online | `syncFromDrive()` then `syncToDrive()` |

### Conflict Resolution

Single-user app, so conflicts are rare. Strategy: last-write-wins with `updatedAt` timestamps.

## Google APIs

### Drive API

Used for: syncing app state, storing note documents

```javascript
// All app data lives in appDataFolder (hidden from user's Drive UI)
const response = await gapi.client.drive.files.create({
  resource: {
    name: 'tasks.json',
    parents: ['appDataFolder']
  },
  fields: 'id'
})
```

### Calendar API

Used for: displaying events, creating reminders (leverages Google's notification system)

```javascript
// Create event with reminder
await gapi.client.calendar.events.insert({
  calendarId: 'primary',
  resource: {
    summary: 'Review notes',
    start: { dateTime: '2024-01-15T09:00:00Z' },
    end: { dateTime: '2024-01-15T09:15:00Z' },
    reminders: {
      useDefault: false,
      overrides: [{ method: 'popup', minutes: 0 }]
    }
  }
})
```

### Tasks API

Used for: basic task management

Limitations to be aware of:
- No full-text search
- No labels/tags
- No priority field
- No custom fields
- Due date has no time component (date only)
- No custom sorting (returns in position order only)

Workaround: Store extended metadata in Drive appDataFolder as sidecar JSON:

```json
// tasks-metadata.json in appDataFolder
{
  "task-id-123": {
    "priority": "high",
    "labels": ["work", "urgent"],
    "dueTime": "14:30"
  }
}
```

## Authentication

PKCE OAuth flow — entirely browser-based, no backend needed.

```typescript
// lib/google/auth.ts
const CLIENT_ID = 'your-client-id.apps.googleusercontent.com'
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/tasks',
  'https://www.googleapis.com/auth/drive.appdata'
]

export async function initAuth() {
  await gapi.load('client:auth2')
  await gapi.client.init({
    clientId: CLIENT_ID,
    scope: SCOPES.join(' '),
    plugin_name: 'myp0'
  })
}

export function signIn() {
  return gapi.auth2.getAuthInstance().signIn()
}

export function signOut() {
  return gapi.auth2.getAuthInstance().signOut()
}

export function isSignedIn() {
  return gapi.auth2.getAuthInstance().isSignedIn.get()
}
```

## Block Editor (Tiptap)

Headless editor with JSON output that stores cleanly in Drive.

```typescript
// lib/editor/index.ts
import { createEditor } from 'svelte-tiptap'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'

export function createNoteEditor(content = '') {
  return createEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing...' }),
      TaskList,
      TaskItem.configure({ nested: true })
    ],
    content,
    onUpdate: ({ editor }) => {
      // Emit JSON for storage
      const json = editor.getJSON()
      // Save to store → IndexedDB → Drive
    }
  })
}
```

## Notifications (Lambda)

Single Lambda function, runs on cron, reads schedule from Drive, sends Web Push.

```typescript
// lambda/notify.ts
export async function handler() {
  // 1. Auth with service account (has access to user's appDataFolder)
  const drive = await initDriveClient()

  // 2. Read notification schedule
  const schedule = await drive.files.get({
    fileId: 'notifications.json',
    alt: 'media'
  })

  // 3. Find due notifications
  const now = Date.now()
  const due = schedule.filter(n => n.triggerAt <= now && !n.sent)

  // 4. Send Web Push
  for (const notification of due) {
    await webpush.sendNotification(
      notification.subscription,
      JSON.stringify({
        title: notification.title,
        body: notification.body
      })
    )
  }

  // 5. Mark as sent
  await updateSchedule(schedule)
}
```

Infrastructure:
- AWS Lambda (free tier)
- EventBridge cron (every 1-5 minutes)
- Web Push with VAPID (free)

## PWA Configuration

```typescript
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    sveltekit(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'myP0',
        short_name: 'myP0',
        theme_color: '#000000',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/www\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'google-api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 86400 }
            }
          }
        ]
      }
    })
  ]
}
```

## Mobile Distribution

| Platform | Method |
|----------|--------|
| Android | TWA (Trusted Web Activity) via Play Store |
| iOS | PWA via "Add to Home Screen" |
| Desktop | PWA install or browser |

TWA is just Chrome running the PWA fullscreen — same codebase, no changes needed.

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check
```

## Environment Variables

```bash
# .env
PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key

# .env.local (not committed)
VAPID_PRIVATE_KEY=your-vapid-private-key
```

## Key Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | SvelteKit over Vue/React | Smallest bundle, compiles away, simpler |
| UI Library | shadcn-svelte | Beautiful defaults, full ownership (copy-paste) |
| Backend | None (except Lambda for notifications) | Data ownership, minimal infrastructure |
| Storage | IndexedDB + Drive sync | Offline-first, user owns data |
| Auth | PKCE OAuth | No backend needed for token exchange |
| Editor | Tiptap | Headless, JSON output, great Svelte support |
| Notifications | Lambda + Web Push | Only server-side requirement, minimal |
| Blog | MDsveX in same codebase | Single deployment, shared design system |

## Non-Goals

- Multi-user / collaboration
- Real-time sync between devices (near-real-time via Drive is sufficient)
- Native mobile apps (PWA/TWA is enough)
- Custom backend/database
- User analytics / tracking

## Resources

- [SvelteKit Docs](https://kit.svelte.dev)
- [shadcn-svelte](https://shadcn-svelte.com)
- [Tiptap Editor](https://tiptap.dev)
- [Google Drive API](https://developers.google.com/drive)
- [Google Tasks API](https://developers.google.com/tasks)
- [Google Calendar API](https://developers.google.com/calendar)
- [Web Push](https://web.dev/push-notifications-overview/)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
