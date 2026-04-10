# Mainline Collegiate Demo

A front-end only demo of **Mainline Collegiate** — a social event calendar for college campuses, built to test UX flows for the collegiate market pivot.

**Live demo:** Deployed on Vercel. Visit the root URL to pick a demo user.

## What is this?

Mainline is pivoting from corporate talent bookings to the collegiate market. Fraternities and student orgs spend $100k+ on events annually. This app is the wedge — a social event calendar that captures the campus social graph and surfaces booking + sponsorship opportunities.

The demo is a fully interactive front-end prototype with mock data for **Mainline State University (MSU)** — 5 orgs, 25 users, 19 events.

## Demo Users

| User | Slug | Perspective |
|------|------|-----------|
| Marcus Thompson | `?user=marcus` | Exec at KSP, member at Rally |
| Sarah Chen | `?user=sarah` | Exec at TD, FoH at KSP |
| Jake Rivera | `?user=jake` | Member at KSP |
| Priya Patel | `?user=priya` | Member at The Collective, FoH at TD |
| Tyler Brooks | `?user=tyler` | Rando — no org, just a student |

## Key Features

- **Home feed** — "Don't miss" hero cards for un-RSVP'd org events (glowing border, org nudge, member avatars), unified event feed below with social proof
- **Three-option RSVP** — Going / Maybe / Can't Go with emoji celebration animations
- **4-tier org model** — Exec > Member > FoH (Friend of House) > Rando, with tier-based event visibility and RSVP rules
- **Greek letters** — ΚΣΠ, ΘΔ, ΦΛ used as primary identifiers for Greek orgs with custom SVG logos
- **Event creation + editing** — Exec-only, with poster theme customizer (8 gradient presets)
- **Clickable user profiles** — Tap any avatar to see bio, orgs, shared events, add friend
- **Notifications** — Bell icon with unread badge, event reminders, capacity alerts, org announcements, friend RSVPs
- **Comments + reactions** — Emoji reactions with pop animations, comment slide-in
- **Friend graph** — Auto within orgs, mutual requests outside. Social proof on feed cards.
- **Share** — Copy link, iMessage, Snapchat, Instagram (simulated)
- **User switching** — URL param `?user=slug` or switcher in Profile tab

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 16 (App Router) | React framework |
| Tailwind CSS v4 | Styling |
| TypeScript | Type safety |
| framer-motion | Interactive animations (modals, RSVP celebrations) |
| Static mock data | JSON/TS files, no backend |
| React Context | Local state management |
| Vercel | Hosting |

## Local Development

```bash
npm install
npm run dev
```

Opens on `http://localhost:3000`. Visit `/?user=marcus` to enter the app, or just `/` for the welcome/user picker.

## Project Structure

```
src/
  app/
    (main)/              # Tab bar layout group
      page.tsx           # Home feed
      events/            # My Events + event detail + edit
      orgs/              # My Orgs + org detail + create event
      profile/           # Profile
      notifications/     # Notifications page
    welcome/             # User picker landing page
    layout.tsx           # Root layout with providers
  components/
    events/              # Event hero, RSVP button, guest list, comments, share, forms
    feed/                # Feed cards, don't miss hero
    layout/              # App shell, tab bar
    orgs/                # Org header, member list, event list, invite modal
    profile/             # Profile header, friends, friend requests, user switcher, user profile modal
    shared/              # Reusable components (UserAvatar)
  lib/
    context/             # AppContext, AppProvider, UserProfileContext
    data/                # Mock data + helper functions
    types.ts             # TypeScript interfaces
    tagColors.ts         # Per-tag color mapping
```

## Design Decisions

- **Dark mode with neon Gen Z aesthetic** — not corporate, not boring. Gradient accents, emoji, casual copy.
- **Org-first, not individual-first** — differentiates from Partiful/Doorlist
- **FoH (Friend of House)** — renamed from "Friend" to avoid confusion with the friend graph
- **Greek letters as primary identifiers** — authentic to how Greek life works
- **Event-first feed cards** — photos lead, social proof is secondary
- **No backend** — all interactions are local state, resets on refresh. Designed for UX testing, not production.

## Design Doc

Full product design document at `docs/plans/2026-04-10-mainline-collegiate-design.md`.
