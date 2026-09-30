# Discord 3.0

A Discord clone built with **Next.js 16** (App Router), **React 19** and **Redux Toolkit**. It runs entirely in the browser: all data lives in a Redux store that's saved to `localStorage`, and other users are simulated, so they type, reply and react to your messages.

## Features

**Servers & channels**
- Server rail with unread pills, mention badges, tooltips and drag-to-reorder
- Create servers (from scratch or a template), join servers from the Discovery page, invite friends, leave
- Collapsible categories; text, announcement and voice channels
- Create, rename and delete channels, set topics, per-channel mute and notification levels

**Messaging**
- Markdown: bold, italic, underline, strike, inline and block code, spoilers, quotes, headings, lists, links, @mentions
- Grouped messages, date dividers, a "NEW" line at your first unread message
- Reactions, replies, inline editing, pins, delete (Shift+click skips the confirmation), mark unread
- Composer autocomplete for `@mentions`, `:emoji:` and `/commands` (`/shrug`, `/tableflip`, `/me`, …)
- File uploads by picker, paste or drag-and-drop; GIFs, stickers and Nitro gifts
- Typing indicators and simulated replies from other members

**Voice & video**
- Voice channels with a call view: participant tiles, speaking indicators, spotlight
- Your camera (`getUserMedia`) and screen share (`getDisplayMedia`) are real; other participants are simulated
- One-to-one voice and video calls in DMs

**Social**
- Friends page: online, all, pending and blocked; add friends by username
- DMs, profile cards, custom status, presence (online, idle, do not disturb, invisible)
- Member list grouped by hoisted roles with role colors

**Everything else**
- Inbox with your @mentions and unread channels, pinned messages, channel search
- Ctrl/⌘+K quick switcher, Ctrl/⌘+/ keyboard shortcuts
- User settings: profile editor with live preview, account details, dark/light theme, cozy/compact display
- Nitro and Shop demo pages (avatar decorations)
- Mobile layout with a navigation drawer

## Getting started

Requires Node.js 20.9+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). To start over with fresh demo data, go to **User Settings → Reset Demo Data**.

| Script | What it does |
| --- | --- |
| `pnpm dev` | Dev server with Turbopack |
| `pnpm build` / `pnpm start` | Production build and server |
| `pnpm lint` | ESLint (flat config) |
| `pnpm typecheck` | TypeScript, no emit |
| `pnpm dev:agent` / `pnpm build:agent` | Same as dev/build on port 3100 with a separate `.next-agent` output, so a second server doesn't clash with yours |

## Project structure

```
app/                     Routes (App Router)
  channels/[serverId]/[channelId]   Channel, DM, Nitro and Shop pages
  channels/discovery                Discovery page
components/              UI, one folder per component, with Sass modules
constants/               Seed data, emoji, GIFs, stickers, shop items
store/                   Redux slices, selectors, persistence, reply simulation
lib/                     Formatting, routes, file helpers
```

- `/channels/@me` is Home (Friends and DMs). `@me` goes through the dynamic `[serverId]` segment because a folder starting with `@` would be a parallel route slot.
- The UI renders only on the client (after a Discord-style loading screen), because every piece of data comes from `localStorage`.
- Media streams live in a React context above the router, so a call keeps going while you browse other channels.
