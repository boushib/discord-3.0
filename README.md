# Discord 3.0

A Discord clone built with **Next.js 16** (App Router), **React 19** and **Redux Toolkit**. It runs entirely in the browser: all data lives in a Redux store that's saved to `localStorage`, and other users are simulated, so they type, reply and react to your messages.

## Features

**Servers & channels**
- Demo servers for Minecraft, Valorant, Fortnite, League of Legends, Black Myth: Wukong, Assassin's Creed Shadows, Battlefield 6 and an anonymous tech project team
- Server rail with unread pills, mention badges, tooltips, drag-to-reorder and server folders
- Create servers (from scratch or a template), join servers from the Discovery page, invite friends, leave
- Server settings for owners: rename, icon, banner, roles (color, rank, hoist) and members (roles, kick)
- Collapsible categories; text, announcement and voice channels
- Create, rename and delete channels, set topics, per-channel mute and notification levels
- Threads started from any message, in a side panel

**Messaging**
- Markdown: bold, italic, underline, strike, inline and block code, spoilers, quotes, headings, lists, links, @mentions
- Grouped messages, date dividers, a "NEW" line at your first unread message
- Reactions, replies, inline editing, pins, delete (Shift+click skips the confirmation), mark unread
- Composer autocomplete for `@mentions`, `:emoji:` and `/commands` (`/shrug`, `/tableflip`, `/me`, …)
- File uploads by picker, paste or drag-and-drop; GIFs, stickers, polls and Nitro gifts
- YouTube links become playable embeds
- Typing indicators and simulated replies from other members
- "Jump To Present" bar when you've scrolled up

**Voice & video**
- Voice channels with a call view: participant tiles, speaking indicators, spotlight
- Your camera (`getUserMedia`), screen share (`getDisplayMedia`) and microphone level (Web Audio, for your speaking ring) are real; other participants are simulated
- One-to-one voice and video calls in DMs

**Social**
- Friends page: online, all, pending and blocked; add friends by username
- DMs and group DMs, profile cards, custom status, presence (online, idle, do not disturb, invisible) with auto-idle
- Member list grouped by hoisted roles with role colors

**Everything else**
- Server-wide search with `from:`, `in:`, `has:`, `mentions:` and `pinned:` filters
- Inbox with your @mentions and unread channels, pinned messages
- Notification sounds and desktop notifications for DMs and @mentions
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
