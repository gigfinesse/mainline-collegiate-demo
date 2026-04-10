# Mainline Collegiate Demo — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a front-end only demo of the Mainline Collegiate social event calendar, deployable to Vercel, with mock data and user switching.

**Architecture:** Next.js App Router with static mock data in JSON/TS files. React Context for global state (current user, RSVP mutations, comments, friend requests). No backend — all interactions are local state that resets on refresh. Mobile-first responsive with a dark-mode Gen Z aesthetic.

**Tech Stack:** Next.js 15 (App Router), React 19, Tailwind CSS v4, TypeScript, Vercel

**Design doc:** `docs/plans/2026-04-10-mainline-collegiate-design.md`

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.gitignore`

**Step 1: Initialize Next.js project**

Run from `/Users/jongwook/Projects/mainline-collegiate-demo`:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```
Pick defaults. This scaffolds the full Next.js project.

**Step 2: Verify it runs**

```bash
npm run dev
```
Expected: dev server starts on localhost:3000 (or next available port).

**Step 3: Clean up boilerplate**

- Replace `src/app/page.tsx` with a minimal placeholder:
```tsx
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <h1 className="text-3xl font-bold">Mainline Collegiate</h1>
    </div>
  );
}
```
- Update `src/app/layout.tsx` to set dark background and import globals.
- Update `src/app/globals.css` to set dark base theme colors — dark gray/charcoal background (`#0a0a0f` or similar), white text default.

**Step 4: Verify dark base renders**

```bash
npm run dev
```
Open browser — should see "Mainline Collegiate" white text on dark background.

**Step 5: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js project with dark theme base"
```

---

## Task 2: Design Tokens & Global Styles

**Files:**
- Modify: `src/app/globals.css`
- Create: `tailwind.config.ts` (extend colors)

**Step 1: Define color palette in Tailwind config**

Extend `tailwind.config.ts` with custom colors:
```ts
// Brand colors
colors: {
  dark: {
    950: '#06060b',  // deepest background
    900: '#0a0a14',  // main background
    800: '#12121f',  // card backgrounds
    700: '#1a1a2e',  // elevated surfaces
    600: '#25253d',  // borders, dividers
  },
  neon: {
    purple: '#a855f7',
    pink: '#ec4899',
    green: '#22d3ee',
    orange: '#f97316',
    blue: '#6366f1',
  },
  // Gradients will be done via Tailwind utilities
}
```

**Step 2: Set up global CSS variables and base styles**

In `globals.css`, set:
- Body background: `dark-900`
- Default text: white/gray-100
- Font: system font stack or a clean sans-serif (Inter if you want to import from Google Fonts)
- Smooth scrolling
- Custom scrollbar styling for dark theme

**Step 3: Add Inter font via next/font**

In `src/app/layout.tsx`:
```tsx
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
```
Apply to body className.

**Step 4: Verify styles**

```bash
npm run dev
```
Expected: dark background, Inter font, clean base rendering.

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add design tokens, color palette, and Inter font"
```

---

## Task 3: TypeScript Data Models

**Files:**
- Create: `src/lib/types.ts`

**Step 1: Define all TypeScript interfaces**

```ts
// src/lib/types.ts

export type OrgType = 'fraternity' | 'sorority' | 'club' | 'student_org';
export type OrgRole = 'exec' | 'member' | 'friend';
export type EventVisibility = 'members_only' | 'friends_and_members' | 'open';
export type RSVPStatus = 'going' | 'waitlisted' | 'requested' | 'declined' | 'none';
export type EventTag = 'darty' | 'formal' | 'mixer' | 'rush' | 'philanthropy' | 'tailgate' | 'party' | 'concert' | 'pregame' | 'social';

export interface School {
  id: string;
  name: string;        // "Mainline State University"
  shortName: string;   // "MSU"
  domain: string;      // "mainlinestate.edu"
}

export interface User {
  id: string;
  slug: string;        // URL param: "marcus", "jake", etc.
  firstName: string;
  lastName: string;
  email: string;
  schoolId: string;
  avatarUrl: string;
  bio?: string;
}

export interface Org {
  id: string;
  name: string;
  shortName: string;   // "KSP", "TD", etc.
  type: OrgType;
  schoolId: string;
  description: string;
  logoUrl: string;
  coverUrl: string;
}

export interface OrgMembership {
  orgId: string;
  userId: string;
  role: OrgRole;       // 'exec' | 'member' | 'friend'
}

export interface Friendship {
  userId1: string;
  userId2: string;
  // auto-generated from org co-membership OR explicit request
  source: 'org' | 'request';
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface Event {
  id: string;
  orgId: string;
  createdByUserId: string;
  title: string;
  description: string;
  coverImageUrl: string;
  posterTheme: PosterTheme;
  date: string;        // ISO date
  startTime: string;   // "21:00"
  endTime: string;     // "02:00"
  location: string;
  visibility: EventVisibility;
  capacity?: number;
  tags: EventTag[];
  cost: number;        // 0 = free
  createdAt: string;   // ISO datetime
}

export interface PosterTheme {
  background: string;  // gradient or color
  fontColor: string;
  fontFamily: string;
  overlay?: string;    // optional overlay pattern
}

export interface RSVP {
  eventId: string;
  userId: string;
  status: RSVPStatus;
  respondedAt: string;
}

export interface Comment {
  id: string;
  eventId: string;
  userId: string;
  text: string;
  reactions: Reaction[];
  createdAt: string;
}

export interface Reaction {
  emoji: string;
  userId: string;
}
```

**Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

**Step 3: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat: add TypeScript data models for users, orgs, events, RSVPs"
```

---

## Task 4: Mock Data

**Files:**
- Create: `src/lib/data/schools.ts`
- Create: `src/lib/data/users.ts`
- Create: `src/lib/data/orgs.ts`
- Create: `src/lib/data/memberships.ts`
- Create: `src/lib/data/friendships.ts`
- Create: `src/lib/data/events.ts`
- Create: `src/lib/data/rsvps.ts`
- Create: `src/lib/data/comments.ts`
- Create: `src/lib/data/index.ts`

**Step 1: Create school data**

One school: Mainline State University.

**Step 2: Create user data**

~25 users. The 5 demo switchable users plus ~20 background students. Each has: id, slug, name, email (@mainlinestate.edu), avatar (use `https://api.dicebear.com/9.x/notionists/svg?seed=USERNAME` for deterministic avatars), bio.

Demo users:
| slug | Name | Perspective |
|------|------|-----------|
| marcus | Marcus Thompson | Exec at Kappa Sigma Pi, member at Rally |
| sarah | Sarah Chen | Exec at Theta Delta, friend of Kappa Sigma Pi |
| jake | Jake Rivera | Member at Kappa Sigma Pi |
| priya | Priya Patel | Member at The Collective, friend of Theta Delta |
| tyler | Tyler Brooks | Rando — no org affiliation |

**Step 3: Create org data**

5 orgs per design doc:
| Name | Short | Type |
|------|-------|------|
| Kappa Sigma Pi | KSP | fraternity |
| Theta Delta | TD | sorority |
| The Collective | TC | club |
| Rally | RLY | student_org |
| Phi Lambda | PL | fraternity |

**Step 4: Create membership data**

Spread ~20 users across orgs with varying roles. Ensure demo users match their defined perspectives. Some users in multiple orgs.

**Step 5: Create friendship data**

Auto-generate friendships for all co-members of each org (source: 'org'). Add a few explicit cross-org friendships (source: 'request'). Include a pending friend request or two for demo purposes.

**Step 6: Create event data**

~12-15 events across the 5 orgs:
- Mix of visibility levels (members_only, friends_and_members, open)
- Mix of past and upcoming dates (relative to current date)
- Mix of tags/vibes (darty, formal, mixer, rush, tailgate, etc.)
- Some with capacity limits, some without
- Some free, some with cover charge
- Variety of poster themes (different gradients, fonts)

**Step 7: Create RSVP data**

RSVPs for demo users and background users across events. Ensure some events have lots of attendees, some few. Include some waitlisted entries for capacity-limited events.

**Step 8: Create comment data**

~20-30 comments spread across events. Some with reactions (emoji + userId). Hype comments, questions, etc.

**Step 9: Create barrel export**

`src/lib/data/index.ts` exports all data arrays.

**Step 10: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

**Step 11: Commit**

```bash
git add src/lib/data/
git commit -m "feat: add mock data for MSU — users, orgs, events, RSVPs, comments"
```

---

## Task 5: Data Access Layer & Context

**Files:**
- Create: `src/lib/data/helpers.ts`
- Create: `src/lib/context/AppContext.tsx`
- Create: `src/lib/context/AppProvider.tsx`

**Step 1: Create data helper functions**

Pure functions that query the static data:
```ts
// src/lib/data/helpers.ts
getUserBySlug(slug: string): User | undefined
getOrgById(id: string): Org | undefined
getOrgsForUser(userId: string): (Org & { role: OrgRole })[]
getMembersOfOrg(orgId: string): (User & { role: OrgRole })[]
getEventsForOrg(orgId: string): Event[]
getVisibleEventsForUser(userId: string): Event[]  // respects visibility rules
getUserRoleInOrg(userId: string, orgId: string): OrgRole | null
getFriendsOfUser(userId: string): User[]
getRSVPsForEvent(eventId: string): (RSVP & { user: User })[]
getUserRSVPForEvent(userId: string, eventId: string): RSVPStatus
getCommentsForEvent(eventId: string): (Comment & { user: User })[]
getHomeFeedForUser(userId: string): FeedItem[]  // social feed logic
getRSVPStatusForUser(userId: string, eventId: string): RSVPStatus
canUserSeeEvent(userId: string, eventId: string): boolean
canUserRSVP(userId: string, eventId: string): { allowed: boolean; autoApproved: boolean }
```

**Step 2: Create AppContext**

React Context that holds:
- `currentUser: User | null` (derived from URL param)
- Mutable state copies: `rsvps`, `comments`, `friendRequests`
- Actions: `rsvpToEvent()`, `addComment()`, `addReaction()`, `sendFriendRequest()`, `acceptFriendRequest()`

**Step 3: Create AppProvider**

Wraps the app, reads `?user=` query param, initializes state from mock data, provides context.

```tsx
// src/lib/context/AppProvider.tsx
'use client';

import { useSearchParams } from 'next/navigation';
// Initialize mutable state from mock data copies
// Provide via AppContext
```

**Step 4: Wire AppProvider into layout**

Wrap `src/app/layout.tsx` children with `<AppProvider>`.

**Step 5: Verify no errors**

```bash
npm run dev
npx tsc --noEmit
```

**Step 6: Commit**

```bash
git add src/lib/
git commit -m "feat: add data helpers and app context with user switching"
```

---

## Task 6: App Shell — Layout & Tab Navigation

**Files:**
- Create: `src/components/layout/TabBar.tsx`
- Create: `src/components/layout/AppShell.tsx`
- Create: `src/app/(main)/layout.tsx`
- Create: `src/app/(main)/page.tsx` (Home)
- Create: `src/app/(main)/events/page.tsx` (My Events)
- Create: `src/app/(main)/orgs/page.tsx` (My Orgs)
- Create: `src/app/(main)/profile/page.tsx` (Profile)

**Step 1: Create TabBar component**

Fixed bottom tab bar, mobile-first. 4 tabs: Home, My Events, My Orgs, Profile.
- Icons: use simple SVG icons or heroicons (install `@heroicons/react`)
- Active tab highlighted with neon accent
- Dark background with subtle top border

```bash
npm install @heroicons/react
```

**Step 2: Create AppShell**

Wraps page content with proper padding for the fixed tab bar. Includes top header area (app name / page title).

**Step 3: Create route group layout**

`src/app/(main)/layout.tsx` — uses AppShell + TabBar. All main screens nested here.

**Step 4: Create placeholder pages**

Each tab page with a simple heading:
- Home: "Home Feed"
- My Events: "My Events"
- My Orgs: "My Orgs"
- Profile: "Profile"

**Step 5: Verify navigation**

```bash
npm run dev
```
Expected: 4 tabs at bottom, tapping each navigates to correct page. Dark theme, neon active indicator.

**Step 6: Commit**

```bash
git add .
git commit -m "feat: add app shell with bottom tab navigation"
```

---

## Task 7: Home Feed Screen

**Files:**
- Modify: `src/app/(main)/page.tsx`
- Create: `src/components/feed/FeedCard.tsx`
- Create: `src/components/feed/FriendActivityCard.tsx`
- Create: `src/components/feed/OrgEventCard.tsx`
- Create: `src/components/feed/OpenEventCard.tsx`

**Step 1: Build FeedCard base component**

A card component with dark-800 background, rounded corners, subtle neon border on hover. Reusable wrapper.

**Step 2: Build FriendActivityCard**

Shows: friend avatars (stacked), "Jake, Mike + 3 others are going to [Event Name]", event date, org name. Tappable — links to event detail. Most prominent card type.

**Step 3: Build OrgEventCard**

Shows: org logo, "Theta Delta just posted Spring Formal", event cover image thumbnail, date. For new events from user's orgs.

**Step 4: Build OpenEventCard**

Shows: event cover image, title, org name, date, location, number going. For open campus events.

**Step 5: Wire up Home page**

Use `getHomeFeedForUser()` helper to get ordered feed items. Render appropriate card type for each. Show "Welcome to MSU" or similar header with the current user's name.

**Step 6: Verify feed renders**

```bash
npm run dev
```
Open as `?user=marcus` — should see friend activity, org events, open events in feed.

**Step 7: Commit**

```bash
git add .
git commit -m "feat: build home feed with friend activity, org events, and open event cards"
```

---

## Task 8: Event Detail Screen

**Files:**
- Create: `src/app/(main)/events/[id]/page.tsx`
- Create: `src/components/events/EventHero.tsx`
- Create: `src/components/events/RSVPButton.tsx`
- Create: `src/components/events/GuestList.tsx`
- Create: `src/components/events/CommentWall.tsx`
- Create: `src/components/events/ShareButton.tsx`

**Step 1: Build EventHero**

Full-width cover image/poster at top. Overlaid with gradient fade to dark at bottom. Shows title, org name, date/time badge, location.

**Step 2: Build RSVPButton**

Tier-aware button:
- Exec/Member on members_only or friends_and_members: shows "Going" (auto)
- Friend on open event: shows "Going" or "Join Waitlist" based on capacity
- Rando on open event: shows "Request to Join" or "Join Waitlist"
- Already RSVP'd: shows status ("You're going!", "Waitlisted", "Requested")
- Tap toggles RSVP via context action

**Step 3: Build GuestList**

Scrollable horizontal avatar row of attendees. Friends shown first with highlight ring. Count badge: "42 going · 8 waitlisted". Tap to expand full list in bottom sheet/modal.

**Step 4: Build CommentWall**

List of comments with user avatar, name, text, timestamp. Emoji reactions below each comment (tappable to add). Input field at bottom to add a comment. New comments added via context action.

**Step 5: Build ShareButton**

Button that opens a share modal/bottom sheet with options: "Copy Link", "iMessage", "Snapchat", "Instagram". For the demo, "Copy Link" copies a URL to clipboard; others show a toast "Shared to [platform]".

**Step 6: Assemble Event Detail page**

Stack: EventHero → tags/vibe badges → cost → RSVPButton → capacity indicator → GuestList → CommentWall → ShareButton. Scrollable.

**Step 7: Wire up navigation from feed cards**

Feed cards link to `/events/[id]`. Verify clicking a feed card opens the event detail.

**Step 8: Verify full event detail flow**

```bash
npm run dev
```
Test as different users (`?user=marcus`, `?user=tyler`) — RSVP button should show different states.

**Step 9: Commit**

```bash
git add .
git commit -m "feat: build event detail screen with RSVP, guest list, comments, sharing"
```

---

## Task 9: My Events Screen

**Files:**
- Modify: `src/app/(main)/events/page.tsx`
- Create: `src/components/events/EventListCard.tsx`

**Step 1: Build EventListCard**

Compact card for list view: cover image thumbnail (left), title, org name, date/time, RSVP status badge (right). Tappable — links to event detail.

**Step 2: Build My Events page**

Two sections with toggle/tabs: "Upcoming" and "Past".
- Upcoming: events where user has RSVP (going/waitlisted/requested), sorted by date ascending. Events user is hosting show a "Hosting" badge.
- Past: events before today that user attended.
- Empty state: "No upcoming events — check out the feed!" with link to Home.

**Step 3: Verify**

```bash
npm run dev
```
Test as `?user=marcus` — should see events he's RSVP'd to. Test as `?user=tyler` — should see empty or minimal.

**Step 4: Commit**

```bash
git add .
git commit -m "feat: build My Events screen with upcoming/past sections"
```

---

## Task 10: Org Page

**Files:**
- Create: `src/app/(main)/orgs/[id]/page.tsx`
- Create: `src/components/orgs/OrgHeader.tsx`
- Create: `src/components/orgs/OrgEventList.tsx`
- Create: `src/components/orgs/OrgMemberList.tsx`
- Create: `src/components/orgs/InviteButton.tsx`

**Step 1: Build OrgHeader**

Org cover image, logo overlay, name, type badge, description. If user is exec: "Manage" button. Member count.

**Step 2: Build OrgEventList**

List of org events (upcoming first, then past). Uses EventListCard. If user is exec: "Create Event" floating action button or prominent button.

**Step 3: Build OrgMemberList**

Shows members grouped by role: Execs → Members → Friends. Each row: avatar, name, role badge. If user is exec or member: "Invite" button at top. If exec: tap a member to see remove/promote options.

**Step 4: Build InviteButton**

Opens modal with: "Invite as Member" (exec only) / "Invite as Friend" (exec or member). Shows a fake invite link to copy, or a search-by-name field (searches mock users).

**Step 5: Assemble Org Page**

Tab or segmented control: "Events" | "Members". Header always visible.

**Step 6: Wire up navigation from My Orgs list**

My Orgs page (`/orgs`) shows list of user's orgs with role badge. Each links to `/orgs/[id]`.

**Step 7: Verify**

```bash
npm run dev
```
Test as `?user=marcus` — should see Kappa Sigma Pi (exec) and Rally (member) in My Orgs. Tap into KSP — should see events, members, create event button.
Test as `?user=tyler` — My Orgs should show empty state with "Apply to create an org" prompt.

**Step 8: Commit**

```bash
git add .
git commit -m "feat: build org page with events, members, and invite functionality"
```

---

## Task 11: Event Creation Flow

**Files:**
- Create: `src/app/(main)/orgs/[id]/create-event/page.tsx`
- Create: `src/components/events/CreateEventForm.tsx`
- Create: `src/components/events/PosterCustomizer.tsx`
- Create: `src/components/events/EventPreview.tsx`

**Step 1: Build CreateEventForm**

Multi-section form (single scrollable page, not multi-step wizard):
- Title (text input)
- Description (textarea)
- Date picker + time pickers (start/end)
- Location (text input)
- Visibility selector (3 options with descriptions)
- Capacity (optional number input)
- Tags (multi-select chips)
- Cost (toggle free/paid, amount input)

All inputs styled dark theme: dark-700 backgrounds, neon focus rings, white text.

**Step 2: Build PosterCustomizer**

Preset poster templates — ~6-8 options:
- Each template: a gradient background + font style + optional overlay pattern
- User taps to select, sees live preview
- Templates should be vibrant: purple-to-pink gradient, dark-to-neon-green, orange-sunset, etc.
- Title text renders on the poster in the chosen font/color

No image upload — just template selection for the demo.

**Step 3: Build EventPreview**

Full preview of what the event will look like (reuses EventHero component). "Publish" button at bottom.

**Step 4: Assemble Create Event page**

Form → Poster selection → Preview → Publish. On publish, add event to context state (appears in org events and feed). Navigate back to org page.

**Step 5: Verify flow**

```bash
npm run dev
```
As `?user=marcus`, go to Kappa Sigma Pi → Create Event → fill form → pick poster → preview → publish. Event should appear in org's event list and home feed.

**Step 6: Commit**

```bash
git add .
git commit -m "feat: build event creation flow with poster customizer and preview"
```

---

## Task 12: Profile & Friends

**Files:**
- Modify: `src/app/(main)/profile/page.tsx`
- Create: `src/components/profile/ProfileHeader.tsx`
- Create: `src/components/profile/FriendsList.tsx`
- Create: `src/components/profile/FriendRequestList.tsx`
- Create: `src/components/profile/UserSwitcher.tsx`

**Step 1: Build ProfileHeader**

Avatar (large), name, school, bio, email. Edit button (shows a modal to edit name/bio — updates context state).

**Step 2: Build FriendsList**

List of friends with avatars and names. Shows friend count. Each friend row tappable (could link to their profile — but for demo, just shows their name/org info in a modal).

**Step 3: Build FriendRequestList**

Pending incoming friend requests. Accept / Decline buttons. On accept, friendship is added to context state.

**Step 4: Build UserSwitcher**

Small, unobtrusive section at the bottom of Profile page. Shows "Demo: viewing as Marcus" with a dropdown to switch users. Changing user updates the `?user=` URL param and reloads context.

**Step 5: Assemble Profile page**

Stack: ProfileHeader → Friend Requests (if any) → Friends List → UserSwitcher.

**Step 6: Verify**

```bash
npm run dev
```
Test switching users via the Profile switcher. Verify that the entire app state changes (different feed, different orgs, different RSVP states).

**Step 7: Commit**

```bash
git add .
git commit -m "feat: build profile screen with friends, friend requests, and demo user switcher"
```

---

## Task 13: Polish & Animations

**Files:**
- Modify: various component files
- Create: `src/lib/utils.ts` (utility functions if needed)

**Step 1: Add page transitions**

Subtle fade-in on page navigation using CSS transitions or framer-motion (lightweight).

```bash
npm install framer-motion
```

**Step 2: Add micro-interactions**

- RSVP button: satisfying press animation + state change animation
- Heart/emoji reactions: pop animation on tap
- Card hover/press: subtle scale or glow effect
- Tab bar: icon bounce on tap

**Step 3: Add gradient accents throughout**

- Gradient text on key headings (event titles in feed)
- Gradient border on featured/highlighted events
- Subtle gradient overlay on event card images

**Step 4: Add empty states**

- No events: illustration or icon + "Nothing here yet" message
- No orgs: "Join or create an org to get started"
- No friends: "Add friends to see what they're up to"

**Step 5: Add loading skeleton states**

Simple pulse-animated skeleton cards for feed, event list, etc. (Even though data is instant, it makes the demo feel more like a real app.)

**Step 6: Responsive polish**

- Verify layout works at 375px (iPhone SE), 390px (iPhone 14), 430px (iPhone 14 Pro Max)
- Desktop: constrain to mobile-width centered container (max-w-md centered) with dark side margins
- Tab bar hidden on desktop, replaced with side nav or top nav (or just keep mobile layout)

**Step 7: Verify everything looks good**

```bash
npm run dev
```
Walk through all screens at mobile viewport. Check all user perspectives.

**Step 8: Commit**

```bash
git add .
git commit -m "feat: add animations, gradients, empty states, and responsive polish"
```

---

## Task 14: Vercel Deployment Setup

**Files:**
- Possibly modify: `next.config.ts`
- Create: `vercel.json` (if needed)

**Step 1: Verify production build**

```bash
npm run build
```
Expected: no errors. Fix any build issues.

**Step 2: Commit any build fixes**

```bash
git add .
git commit -m "fix: resolve production build issues"
```

**Step 3: Deploy to Vercel**

```bash
npx vercel --prod
```
Or link to Vercel dashboard and deploy from git.

**Step 4: Verify deployed demo**

Open the Vercel URL. Test:
- Default view (no user param — should default to Marcus or show a landing/picker)
- `?user=marcus` — exec view
- `?user=tyler` — rando view
- Navigation between all tabs
- Event detail, RSVP, comments
- Event creation flow
- User switching

**Step 5: Commit deployment config if any**

```bash
git add .
git commit -m "chore: add Vercel deployment config"
```

---

## Task Summary

| Task | What | Depends On |
|------|------|-----------|
| 1 | Project scaffolding | — |
| 2 | Design tokens & styles | 1 |
| 3 | TypeScript data models | 1 |
| 4 | Mock data | 3 |
| 5 | Data helpers & context | 3, 4 |
| 6 | App shell & tab nav | 1, 2 |
| 7 | Home feed | 5, 6 |
| 8 | Event detail | 5, 6 |
| 9 | My Events screen | 5, 6, 8 |
| 10 | Org page | 5, 6 |
| 11 | Event creation | 5, 10 |
| 12 | Profile & friends | 5, 6 |
| 13 | Polish & animations | 7-12 |
| 14 | Vercel deployment | 13 |

**Parallelizable groups:**
- Tasks 2 + 3 can run in parallel (no dependencies on each other)
- Tasks 7 + 8 + 9 + 10 + 12 can be developed in parallel (all depend on 5 + 6 only)
- Task 11 depends on 10 (org page exists first)
- Task 13 is a polish pass over everything
- Task 14 is final deployment
