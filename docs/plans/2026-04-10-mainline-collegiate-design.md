# Mainline Collegiate — Product Design Document

**Date:** 2026-04-10
**Status:** Approved
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
| Access tiers | None | None | Exec / Member / Friend / Rando |
| Revenue model | Free (no monetization) | Ticketing (100% to host) | Talent booking + brand sponsorship |
| Event customization | Strong (themes, fonts, posters) | Basic | Strong (matching Partiful) |
| Social features | Comments, reactions, photo albums | Basic guest list | Comments, reactions, friend activity feed |

**Key differentiators:** Org-based structure with tiered access, social discovery feed driven by friend graph, and the booking/sponsorship pipeline underneath.

---

## 2. User Model

### 2.1 Sign-Up

Students sign up with a **.edu email address**. The email domain auto-assigns them to a school (e.g., `@mainlinestate.edu` → Mainline State University). This gates access and ensures campus-level trust.

In the demo, sign-up is simulated. Users are pre-created.

### 2.2 User Tiers (Per Org)

A user's tier is **per org** — someone can be an exec at one org and a friend at another. A user with no org affiliation is a "rando" at the school level.

| Tier | Who | How They Get In | Capabilities |
|------|-----|----------------|-------------|
| **Exec** | Social chair, president, rush chair, etc. | Org creator is first exec; other execs promoted by existing execs | Create/manage events, invite members + friends, manage roster, org settings |
| **Member** | Brothers/sisters, club members | Invited by an exec | View all org events, auto-RSVP priority, invite friends of the house, auto-friended with all org members |
| **Friend** | Frequent guests, "friends of the house" | Invited by an exec or member | Priority RSVP (below members), see org's open + friends-visible events |
| **Rando** | Any student at the school | .edu sign-up | Browse open events, request-based RSVP for exclusive ones |

A user can belong to **multiple orgs** with different roles in each.

### 2.3 Friend Graph

- **Auto-friending within orgs:** All members and execs of the same org are automatically friends. No action needed.
- **Mutual requests outside orgs:** Send a friend request, other person accepts. Both then see each other's RSVP activity in their feed.
- Friends are app-wide, not per-org.

---

## 3. Org Model

### 3.1 What Is an Org?

A verified campus organization — fraternity, sorority, club, or student org. Not informal friend groups. Exclusivity is maintained by requiring Mainline approval.

### 3.2 Org Types

- Fraternity
- Sorority
- Club
- Student Organization

### 3.3 Org Creation

Application-based:
1. A student submits: org name, type, school, their role, and any supporting info.
2. Mainline reviews and approves/denies.
3. Once approved, the applicant becomes the first exec.

In the demo, orgs are pre-created and pre-populated.

### 3.4 Org Page

Contains:
- Org name, logo/photo, description, type
- Upcoming events list
- Past events
- Member roster (visible to members and friends only)
- Exec controls: manage members, manage friends, create events, org settings

### 3.5 Membership Management

| Action | Who Can Do It |
|--------|--------------|
| Invite members | Execs only |
| Invite friends | Execs and members |
| Remove members/friends | Execs only |
| Promote to exec / demote | Execs only |

Invitations are via invite link or direct add (search by name).

---

## 4. Event Model

### 4.1 Event Fields

| Field | Details |
|-------|---------|
| Title | Required |
| Description | Optional, rich text |
| Cover image / poster | Customizable — pick a template (themes, fonts, colors, backgrounds) or upload custom image |
| Date & time | Start + end |
| Location | Free text + optional map pin |
| Visibility | Members Only / Friends & Members / Open |
| Capacity | Optional cap. Enables waitlist when full. |
| Tags / vibe | Darty, Formal, Mixer, Rush, Philanthropy, Tailgate, Party, Concert, etc. |
| Cost | Free or cover charge (amount) |
| Programming flag | "We want talent for this event" — hidden from attendees, signal to Mainline team. Modeled in data but not shown in demo UI. |

### 4.2 Event Creation

- Only **org execs** can create events.
- Creation happens from within the org page.
- Flow: fill out fields → customize poster/cover → preview → publish.

### 4.3 Event Visibility & RSVP Rules

| Visibility | Execs | Members | Friends | Randos |
|-----------|-------|---------|---------|--------|
| **Members Only** | Auto-in | Auto-in | Can't see | Can't see |
| **Friends & Members** | Auto-in | Auto-in | Auto-in | Can't see |
| **Open** | Auto-in | Auto-in | Priority waitlist | Request / waitlist |

**Waitlist logic:**
- When capacity is set and fills: friends get priority position over randos.
- When no capacity set: open events are open to all, friends auto-approved, randos may need approval per org preference.

### 4.4 Event Social Features

- **Guest list** — visible on event page. Friends highlighted at top. Shows count ("42 going, 8 waitlisted").
- **Comments / reactions wall** — attendees can post comments, reply, react with emojis. Pre-event hype and post-event discussion.
- **Sharing** — native share to iMessage, Snapchat, Instagram Stories, copy link. Shared link shows a preview (poster, title, date) with "Open in app" / RSVP action.

---

## 5. Navigation & Core Screens

### 5.1 Tab Bar (4 tabs, mobile-first)

| Tab | Icon | Content |
|-----|------|---------|
| **Home** | House | Personalized social feed |
| **My Events** | Calendar | Events you're attending + hosting |
| **My Orgs** | People | List of your orgs, tap into any |
| **Profile** | Person | Your info, friends, notifications, settings |

### 5.2 Home Feed

The home feed is social-first, not just a listing. Items are ordered by relevance:

1. **Friends' RSVPs** — "Jake, Mike + 3 others are going to Kappa Sig Darty" — tap to see event. Sorted by number of friends going.
2. **New org events** — "Theta Delta just posted Spring Formal" — events from orgs you belong to.
3. **Open events** — Open events at your school, sorted by date / popularity.

### 5.3 My Events

Your personal event calendar:
- **Upcoming** — events you've RSVP'd to or are hosting, sorted by date.
- **Past** — previous events you attended.
- Hosting badge on events you created.

### 5.4 My Orgs

- List of orgs you're a member/exec/friend of, with your role shown.
- Tap into an org to see its org page.
- If you're not in any org, show a prompt to apply to create one.

### 5.5 Event Detail Screen

The flagship screen:
- Hero: cover image / customized poster
- Title, hosted by [Org], date/time, location (map link)
- Tags / vibe badges
- Cost indicator
- RSVP button (behavior varies by tier — "Going", "Request to Join", "Waitlisted")
- Capacity indicator ("42/100 spots")
- Guest list (friends at top, then others)
- Comments / reactions wall
- Share button

### 5.6 Org Page

- Org header: name, logo, description, type
- Tab or section split: Events | Members
- Events: upcoming + past
- Members: roster visible to members/friends (shows execs, members, friends with role badges)
- Exec actions: Create Event button, Manage Members, Org Settings

### 5.7 Create Event Flow

Accessed from org page (exec only):
1. Title + description
2. Date/time picker
3. Location
4. Cover image / poster customization (templates, themes, fonts, colors)
5. Visibility selector (Members Only / Friends & Members / Open)
6. Capacity (optional)
7. Tags / vibe
8. Cost (free / cover amount)
9. Preview → Publish

### 5.8 Other Screens

- **Friend requests** — list of incoming requests, accept/decline
- **Invite members/friends** — search by name or share invite link
- **Notifications** — RSVP confirmations, friend requests, new events from orgs, comments on events you're attending
- **Profile editing** — name, photo, school, bio

---

## 6. Design Aesthetic

**Dark mode with vibrant Gen Z energy.**

- Dark base (not pure black — dark grays, deep navy/charcoal)
- Neon and vibrant accent colors — electric purples, hot pinks, bright greens, gradient splashes
- Colorful event cards and tags that pop against the dark background
- Bold, modern typography
- Rounded corners, smooth animations
- Gradient backgrounds on event posters and hero areas
- Think: dark mode Instagram meets Spotify's color energy
- The vibe is fun, exclusive, and aspirational — not corporate

---

## 7. Technical Approach (Demo)

### 7.1 Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js** (App Router) | React framework, matches Mainline ecosystem |
| **Tailwind CSS** | Mobile-first styling |
| **Static JSON mock data** | Users, orgs, events, RSVPs, comments, friendships |
| **React state / context** | Simulating interactions (RSVP, comments, friend requests) |
| **Vercel** | Hosting for easy sharing |

### 7.2 Mock Data — Mainline State University

**Orgs:**
| Org | Type | Vibe |
|-----|------|------|
| Kappa Sigma Pi | Fraternity | The big party frat |
| Theta Delta | Sorority | Social + philanthropic |
| The Collective | Club | Creative arts, underground events |
| Rally | Student Org | Sports, tailgates, game day |
| Phi Lambda | Fraternity | Smaller, exclusive |

~20-30 fake students spread across these orgs with varying roles (execs, members, friends) and cross-org friendships. ~10-15 events at different visibility levels, dates, and vibes.

### 7.3 Demo User Switching

- **Primary mechanism:** URL query parameter — `?user=jake`, `?user=sarah`, `?user=marcus`
- Each demo user has a different perspective (exec at one org, member at another, friend, rando)
- Small unobtrusive indicator in the Profile tab showing current demo user with quick-switch option
- Easy to share specific perspectives: "Check out the exec view: mainline-demo.vercel.app?user=marcus"

### 7.4 Demo Preset Users

| User | Perspective |
|------|-----------|
| Marcus | Exec at Kappa Sigma Pi, member at Rally |
| Sarah | Exec at Theta Delta, friend of Kappa Sigma Pi |
| Jake | Member at Kappa Sigma Pi |
| Priya | Member at The Collective, friend of Theta Delta |
| Tyler | Rando — no org affiliation, just a student at MSU |

### 7.5 What the Demo Includes

- Full navigation (Home, My Events, My Orgs, Profile)
- Event browsing, detail view, RSVP flow (tier-appropriate behavior)
- Event creation flow with poster customization
- Org pages with member lists
- Social feed with friend activity
- Comments and reactions on events
- Friend requests (send/accept)
- Invite members/friends to org
- Sharing UI (native share sheet simulation)
- Responsive mobile-first design

### 7.6 What the Demo Does NOT Include

- Real authentication / .edu email verification
- Org application and approval flow
- Talent booking / programming flag UI
- Brand sponsorship dashboard
- Push notifications
- Actual image upload (use preset images/templates)
- Data persistence (refresh = reset to mock data)
- Backend API

---

## 8. Future Considerations (Post-Demo)

These are not in scope for the demo but are noted for the full product roadmap:

- **Talent booking integration** — Orgs flag events needing programming, Mainline team sees pipeline
- **Brand sponsorship marketplace** — Event data shared with brand partners, sponsors select events
- **Real auth + .edu verification** — Email verification flow
- **Org approval workflow** — Application review by Mainline team
- **Multi-school support** — Students at nearby schools can discover cross-campus events
- **Ticketing / payments** — Cover charge collection, Venmo/Cash App integration
- **Shared photo albums** — Post-event photo sharing (Partiful feature)
- **Polling / coordination** — Date polling, guest questions
- **Text blasts** — Org-wide or event-wide announcements
- **Push notifications** — RSVP confirmations, event reminders, friend activity
- **Analytics dashboard** — For Mainline team: event volume, org engagement, booking conversion
