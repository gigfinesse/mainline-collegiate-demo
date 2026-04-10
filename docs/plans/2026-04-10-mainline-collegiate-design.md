# Mainline Collegiate — Product Design Document

**Date:** 2026-04-10
**Status:** Approved (updated to reflect demo as built)
**Scope:** Front-end demo (no backend)

---

## 1. Product Overview

Mainline Collegiate is a social event calendar for college campuses. Students use it to create, discover, and RSVP to events. Underneath, it serves as a lead-generation engine for Mainline's talent booking and brand sponsorship services.

The demo is a front-end only prototype to test UX flows. No backend, no persistence, no real auth. Deployed to Vercel for easy sharing.

### Why This Exists

Fraternities and student orgs at major universities spend $100k+ on events annually. Mainline wants to:

1. **Capture the social graph** — a campus event calendar gives visibility into who's throwing what, when, and how big.
2. **Surface booking opportunities** — orgs flagging events as "needs programming" becomes inbound lead gen for talent booking.
3. **Enable brand sponsorship** — event data shared with brand partners who select events to sponsor, bringing corporate money into college events.

The calendar is the wedge. Booking and sponsorship are the business model.

### Competitive Positioning

| | Partiful | Doorlist | Mainline Collegiate |
|---|---------|---------|-------------------|
| Structure | Individual-first | Individual-first | Org-first |
| Discovery | Share links only | Share links only | Social feed + friend graph |
| Access tiers | None | None | Exec / Member / FoH / Rando |
| RSVP options | Going / Maybe / Can't Go | Going | Going / Maybe / Can't Go |
| Revenue model | Free | Ticketing (100% to host) | Talent booking + brand sponsorship |
| Event customization | Strong | Basic | Strong (poster themes) |
| Social features | Comments, reactions, photos | Basic guest list | Comments, reactions, friend activity feed, notifications |

---

## 2. User Model

### 2.1 Sign-Up

Students sign up with a **.edu email address**. The email domain auto-assigns them to a school. In the demo, users are pre-created.

### 2.2 User Tiers (Per Org)

A user's tier is **per org** — someone can be an exec at one org and FoH at another.

| Tier | Who | How They Get In | Capabilities |
|------|-----|----------------|-------------|
| **Exec** | Social chair, president, etc. | Org creator is first exec; promoted by existing execs | Create/edit/manage events, invite members + FoH, manage roster, org settings |
| **Member** | Brothers/sisters, club members | Invited by an exec | View all org events, auto-RSVP priority, invite FoH, auto-friended with org-mates |
| **FoH** (Friend of House) | Frequent guests | Invited by an exec or member | Priority RSVP (below members), see org's open + FoH-visible events |
| **Rando** | Any student at the school | .edu sign-up | Browse open events, request-based RSVP |

A user can belong to **multiple orgs** with different roles in each.

### 2.3 Friend Graph

- **Auto-friending within orgs:** All members and execs of the same org are automatically friends.
- **Mutual requests outside orgs:** Send a friend request, other person accepts.
- Friends are app-wide, not per-org.
- Tapping any user avatar opens a profile modal showing their bio, orgs, shared events, and friend/request status.

---

## 3. Org Model

### 3.1 What Is an Org?

A verified campus organization — fraternity, sorority, club, or student org. Not informal friend groups. Exclusivity is maintained by requiring Mainline approval.

### 3.2 Org Types

- Fraternity (🏛)
- Sorority (💜)
- Club (🎨)
- Student Organization (⚡)

### 3.3 Greek Letters

Greek orgs display their Greek letters as the primary identifier:
- Kappa Sigma Pi → **ΚΣΠ**
- Theta Delta → **ΘΔ**
- Phi Lambda → **ΦΛ**

Custom SVG logos are generated with Greek letters on gradient backgrounds. Non-Greek orgs use themed emoji logos.

### 3.4 Org Creation

Application-based. In the demo, orgs are pre-created and pre-populated.

### 3.5 Org Page

- Org logo, Greek letters (large for Greek orgs), full name, type badge, description
- Events tab (upcoming + past) with cover images
- Members tab grouped by role: Execs > Members > FoH
- Create Event button (exec only)
- Invite modal (invite as Member or FoH)

### 3.6 Membership Management

| Action | Who Can Do It |
|--------|--------------|
| Invite members | Execs only |
| Invite FoH | Execs and members |
| Remove members/FoH | Execs only |
| Promote to exec / demote | Execs only |

---

## 4. Event Model

### 4.1 Event Fields

| Field | Details |
|-------|---------|
| Title | Required |
| Description | Optional |
| Cover image | Unsplash photos with poster theme gradient overlay |
| Poster theme | 8 gradient presets (purple-pink, cyan-purple, etc.) |
| Date & time | Start + end |
| Location | Free text |
| Visibility | Members Only / FoH & Members / Open |
| Capacity | Optional cap with waitlist |
| Tags / vibe | darty, formal, mixer, rush, philanthropy, tailgate, party, concert, pregame, social — each with unique color |
| Cost | Free or cover charge |

### 4.2 Event Creation & Editing

- Only **org execs** can create and edit events.
- Creation from org page, editing from event detail page (Edit button, exec only).
- Poster theme customizer with live preview.

### 4.3 Event Visibility & RSVP Rules

| Visibility | Execs | Members | FoH | Randos |
|-----------|-------|---------|---------|--------|
| **Members Only** | Auto-in | Auto-in | Can't see | Can't see |
| **FoH & Members** | Auto-in | Auto-in | Auto-in | Can't see |
| **Open** | Auto-in | Auto-in | Priority | Request / waitlist |

### 4.4 RSVP System

Three-option RSVP (like Partiful):
- **Going** — committed, counts toward capacity, shown on guest list
- **Maybe** — interested, shown separately on guest list (lighter styling), doesn't count toward capacity
- **Can't Go** — explicit no, removed from nudges, hidden from guest list

Status-aware buttons with change options. Emoji celebration animations on RSVP actions.

### 4.5 Event Social Features

- **Guest list** — Going and Maybe groups, friends highlighted. Expandable modal.
- **Comments / reactions** — Emoji reactions (🔥 ❤️ 😂 🙌 💀) with pop animations, comment slide-in.
- **Sharing** — Copy link, iMessage, Snapchat, Instagram (simulated).

---

## 5. Navigation & Core Screens

### 5.1 Tab Bar (4 tabs, mobile-first)

| Tab | Content |
|-----|---------|
| **Home** | Event feed with don't miss hero + unified event cards |
| **My Events** | Events you're attending/maybe/hosting (upcoming + past) |
| **My Orgs** | Your orgs sorted by role (exec > member > FoH) |
| **Profile** | Info, friends, friend requests, demo user switcher |

### 5.2 Home Feed

Two sections:

**"don't miss"** — Hero cards for un-RSVP'd events from your orgs:
- Glowing gradient border (purple → pink → orange) to differentiate from feed
- Org logo, Greek letters, capacity, date/time, location
- Member avatars + org-specific nudge ("5 brothers already going")
- Urgency labels ("tonight 🔥", "filling up fast 🔥")
- Dismiss (✕) button to remove from feed
- Swipeable with dot indicators
- Tapping goes to event detail (no inline RSVP)

**"what's on at MSU 🎓"** — Unified event feed:
- Event-first cards: cover photo hero, title, org, date/location, colorful tags
- Social proof at bottom: friend avatars + "Jake + 3 friends going"
- All event types use the same card style
- Sorted by: friend activity count (most friends going first), then org events, then open events

### 5.3 Notifications

- Bell icon in home page header with unread badge count
- Full notifications page with types: event reminders, capacity alerts, org announcements, friend RSVPs, friend accepts, event updates
- Unread indicators (purple dot + left border), mark as read on tap, mark all as read

### 5.4 Welcome Page

Landing page at `/welcome` (or `/` without user param):
- MAINLINE Collegiate branding
- Tier legend (Exec, Member, Friend, Rando)
- 5 demo user cards with photos, roles, descriptions
- Clicking enters the app as that user

---

## 6. Design Aesthetic

**Dark mode with vibrant Gen Z energy.**

- Dark base (deep navy/charcoal, not pure black)
- Neon accent colors: purple, pink, cyan, orange, indigo
- Colorful per-tag vibe pills (amber darty, violet formal, pink mixer, etc.)
- Gradient MAINLINE wordmark
- Casual lowercase section headers with emoji
- Playful RSVP badges ("going ✓", "hosting 🎤", "requested 🤞")
- Fun empty states ("it's quiet... too quiet 👀")
- Real Unsplash photos for events and org covers
- College-age Unsplash portraits for user photos
- Custom SVG logos with Greek letters for Greek orgs
- Micro-interaction animations: RSVP emoji bursts, reaction pops, comment slide-ins, tab bar bounces
- iOS zoom prevention on input focus

---

## 7. Technical Approach (Demo)

### 7.1 Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 16 (App Router) | React framework |
| Tailwind CSS v4 | Mobile-first styling |
| TypeScript | Type safety |
| framer-motion | Interactive animations (modals, celebrations) |
| Static mock data | Users, orgs, events, RSVPs, comments, notifications |
| React Context | State management (RSVP, comments, friend requests, dismiss) |
| Vercel | Hosting |

### 7.2 Mock Data — Mainline State University

**Orgs:**
| Org | Greek | Type | Logo |
|-----|-------|------|------|
| Kappa Sigma Pi | ΚΣΠ | Fraternity | Greek letters on purple gradient |
| Theta Delta | ΘΔ | Sorority | Greek letters on pink gradient |
| The Collective | — | Club | 🎨 on indigo gradient |
| Rally | — | Student Org | 🏟️ on orange gradient |
| Phi Lambda | ΦΛ | Fraternity | Greek letters on dark-purple gradient |

25 users, 19 events, ~150 RSVPs, 30 comments, 17 notifications.

### 7.3 Demo User Switching

- URL query parameter: `?user=marcus`, `?user=sarah`, etc.
- Switcher in Profile tab
- No param → redirects to `/welcome` picker page

### 7.4 What the Demo Does NOT Include

- Real authentication / .edu email verification
- Org application and approval flow
- Talent booking / programming flag UI
- Brand sponsorship dashboard
- Push notifications (mock notifications only)
- Actual image upload (preset images/templates)
- Data persistence (refresh = reset to mock data)
- Backend API

---

## 8. Future Considerations (Post-Demo)

- **Talent booking integration** — Orgs flag events needing programming
- **Brand sponsorship marketplace** — Event data shared with brand partners
- **Real auth + .edu verification**
- **Org approval workflow**
- **Multi-school support** — cross-campus event discovery
- **Ticketing / payments** — cover charge collection
- **Shared photo albums** — post-event photos
- **Polling / coordination** — date polling, guest questions
- **Text blasts** — org/event announcements
- **Push notifications**
- **Analytics dashboard** — event volume, engagement, booking conversion
