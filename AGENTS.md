<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Mainline Collegiate Demo — Agent Guide

## Project Overview

Front-end only demo of a social event calendar for college campuses. Next.js 16 + Tailwind CSS v4 + TypeScript. No backend — all data is mock, all state is local React Context.

## Key Architecture

- **App Router** with `(main)` route group for tab bar layout
- **AppContext** (`src/lib/context/AppProvider.tsx`) holds all mutable state: rsvps, comments, friendships, friend requests, events, notifications, dismissed events
- **Static mock data** in `src/lib/data/` — 25 users, 5 orgs, 19 events, etc.
- **Data helpers** in `src/lib/data/helpers.ts` — query functions that accept optional mutable arrays from context
- **UserProfileContext** — separate context for the clickable user profile modal

## Important Patterns

### framer-motion
- **DO NOT** use `initial={{ opacity: 0 }}` on mount animations — causes blank renders in Turbopack dev server
- **DO** use framer-motion for: `whileTap`, `AnimatePresence` (conditional modals/toasts), state-driven `animate`
- CSS animations (like `animate-slide-in`) are safe for mount effects

### User switching
- `?user=slug` query param controls current user
- All internal links MUST preserve this param: `buildHref(path)` pattern
- No param → redirects to `/welcome`

### Org roles display
- Internal type value `'friend'` displays as **"FoH"** (Friend of House) in all UI
- Do NOT change the type definition, only display strings

### Greek letters
- Org type has optional `greekLetters?: string` field
- Display pattern: `org.greekLetters || org.shortName` for compact, `org.greekLetters ? \`${org.greekLetters} ${org.name}\` : org.name` for full

### Images
- User avatars: Unsplash portraits with `?w=200&h=200&fit=crop&crop=face`
- Event covers: Unsplash with `?w=800&q=80`, overlay posterTheme gradient at 40-50% opacity
- Org logos: Inline SVG data URIs (Greek letters on gradient circles, or emoji icons)
- Org covers: Unsplash with `?w=800&q=80`
- Use `<img>` tags (not Next.js `<Image>`) for all external URLs

### iOS
- All inputs have `font-size: 16px !important` to prevent Safari zoom on focus

## File Organization

```
src/lib/types.ts          — all TypeScript interfaces
src/lib/tagColors.ts      — per-tag color mapping (getTagColor)
src/lib/data/helpers.ts   — data query functions + formatTime
src/lib/context/          — AppContext, AppProvider, UserProfileContext
src/lib/data/             — mock data files
src/components/feed/      — EventFeedCard, DontMissHero, FeedCard (+ legacy cards)
src/components/events/    — EventHero, RSVPButton, GuestList, CommentWall, ShareButton, forms
src/components/orgs/      — OrgHeader, OrgMemberList, OrgEventList, InviteModal
src/components/profile/   — ProfileHeader, FriendsList, FriendRequestList, UserSwitcher, UserProfileModal
src/components/shared/    — UserAvatar (clickable)
src/components/layout/    — AppShell, TabBar
```

## RSVP System

Three options: Going / Maybe / Can't Go. Context actions: `rsvpToEvent`, `maybeEvent`, `declineEvent`, `cancelRSVP`. RSVPButton handles all states with tier-based access rules.
