import type { RSVP } from '@/lib/types';

const at = (daysAgo: number) => {
  const d = new Date('2026-04-10T00:00:00');
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

export const rsvps: RSVP[] = [
  // ── evt-1: Welcome Back Rager (past, KSP) ──
  { eventId: 'evt-1', userId: 'user-marcus', status: 'going', respondedAt: at(15) },
  { eventId: 'evt-1', userId: 'user-jake', status: 'going', respondedAt: at(15) },
  { eventId: 'evt-1', userId: 'user-liam', status: 'going', respondedAt: at(15) },
  { eventId: 'evt-1', userId: 'user-noah', status: 'going', respondedAt: at(14) },
  { eventId: 'evt-1', userId: 'user-ethan', status: 'going', respondedAt: at(14) },
  { eventId: 'evt-1', userId: 'user-sarah', status: 'going', respondedAt: at(13) },
  { eventId: 'evt-1', userId: 'user-mason', status: 'going', respondedAt: at(13) },
  { eventId: 'evt-1', userId: 'user-ben', status: 'going', respondedAt: at(12) },

  // ── evt-2: Galentines Brunch (past, TD) ──
  { eventId: 'evt-2', userId: 'user-sarah', status: 'going', respondedAt: at(10) },
  { eventId: 'evt-2', userId: 'user-emma', status: 'going', respondedAt: at(10) },
  { eventId: 'evt-2', userId: 'user-olivia', status: 'going', respondedAt: at(9) },
  { eventId: 'evt-2', userId: 'user-sophia', status: 'going', respondedAt: at(9) },
  { eventId: 'evt-2', userId: 'user-mia', status: 'going', respondedAt: at(8) },
  { eventId: 'evt-2', userId: 'user-charlotte', status: 'going', respondedAt: at(8) },
  { eventId: 'evt-2', userId: 'user-amelia', status: 'going', respondedAt: at(8) },

  // ── evt-3: Neon Nights (upcoming, KSP, popular!) ──
  { eventId: 'evt-3', userId: 'user-marcus', status: 'going', respondedAt: at(3) },
  { eventId: 'evt-3', userId: 'user-jake', status: 'going', respondedAt: at(3) },
  { eventId: 'evt-3', userId: 'user-liam', status: 'going', respondedAt: at(3) },
  { eventId: 'evt-3', userId: 'user-noah', status: 'going', respondedAt: at(2) },
  { eventId: 'evt-3', userId: 'user-ethan', status: 'going', respondedAt: at(2) },
  { eventId: 'evt-3', userId: 'user-mason', status: 'going', respondedAt: at(2) },
  { eventId: 'evt-3', userId: 'user-aiden', status: 'going', respondedAt: at(2) },
  { eventId: 'evt-3', userId: 'user-lucas', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-3', userId: 'user-sarah', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-3', userId: 'user-ben', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-3', userId: 'user-daniel', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-3', userId: 'user-emma', status: 'going', respondedAt: at(1) },

  // ── evt-4: Spring Formal (upcoming, TD) ──
  { eventId: 'evt-4', userId: 'user-sarah', status: 'going', respondedAt: at(4) },
  { eventId: 'evt-4', userId: 'user-emma', status: 'going', respondedAt: at(4) },
  { eventId: 'evt-4', userId: 'user-olivia', status: 'going', respondedAt: at(3) },
  { eventId: 'evt-4', userId: 'user-sophia', status: 'going', respondedAt: at(3) },
  { eventId: 'evt-4', userId: 'user-mia', status: 'going', respondedAt: at(2) },
  { eventId: 'evt-4', userId: 'user-charlotte', status: 'going', respondedAt: at(2) },
  { eventId: 'evt-4', userId: 'user-amelia', status: 'going', respondedAt: at(2) },
  { eventId: 'evt-4', userId: 'user-priya', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-4', userId: 'user-marcus', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-4', userId: 'user-jake', status: 'going', respondedAt: at(1) },

  // ── evt-5: Rush Week Kickoff (upcoming, open) ──
  { eventId: 'evt-5', userId: 'user-marcus', status: 'going', respondedAt: at(2) },
  { eventId: 'evt-5', userId: 'user-liam', status: 'going', respondedAt: at(2) },
  { eventId: 'evt-5', userId: 'user-jake', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-5', userId: 'user-noah', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-5', userId: 'user-tyler', status: 'going', respondedAt: at(1) },

  // ── evt-6: Underground Sessions (upcoming, TC) ──
  { eventId: 'evt-6', userId: 'user-isabella', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-6', userId: 'user-priya', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-6', userId: 'user-james', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-6', userId: 'user-chloe', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-6', userId: 'user-daniel', status: 'going', respondedAt: at(0) },

  // ── evt-7: Game Day Tailgate (upcoming, open, Rally) ──
  { eventId: 'evt-7', userId: 'user-ava', status: 'going', respondedAt: at(3) },
  { eventId: 'evt-7', userId: 'user-marcus', status: 'going', respondedAt: at(2) },
  { eventId: 'evt-7', userId: 'user-ethan', status: 'going', respondedAt: at(2) },
  { eventId: 'evt-7', userId: 'user-noah', status: 'going', respondedAt: at(2) },
  { eventId: 'evt-7', userId: 'user-lucas', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-7', userId: 'user-ben', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-7', userId: 'user-jake', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-7', userId: 'user-tyler', status: 'going', respondedAt: at(0) },

  // ── evt-8: Phi Lambda Invite-Only (upcoming, members_only) ──
  { eventId: 'evt-8', userId: 'user-logan', status: 'going', respondedAt: at(2) },
  { eventId: 'evt-8', userId: 'user-aiden', status: 'going', respondedAt: at(2) },
  { eventId: 'evt-8', userId: 'user-james', status: 'going', respondedAt: at(1) },

  // ── evt-9: Philanthropy Gala (upcoming, open, TD) ──
  { eventId: 'evt-9', userId: 'user-sarah', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-9', userId: 'user-emma', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-9', userId: 'user-olivia', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-9', userId: 'user-marcus', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-9', userId: 'user-priya', status: 'going', respondedAt: at(0) },

  // ── evt-10: Darty Szn (upcoming, KSP) ──
  { eventId: 'evt-10', userId: 'user-marcus', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-10', userId: 'user-jake', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-10', userId: 'user-liam', status: 'going', respondedAt: at(0) },

  // ── evt-11: Gallery Night (upcoming, open, TC) ──
  { eventId: 'evt-11', userId: 'user-isabella', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-11', userId: 'user-priya', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-11', userId: 'user-james', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-11', userId: 'user-sarah', status: 'going', respondedAt: at(0) },

  // ── evt-12: Championship Watch Party (upcoming, open) ──
  { eventId: 'evt-12', userId: 'user-ava', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-12', userId: 'user-marcus', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-12', userId: 'user-noah', status: 'going', respondedAt: at(0) },

  // ── evt-13: KSP x TD Mixer (upcoming) ──
  { eventId: 'evt-13', userId: 'user-marcus', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-13', userId: 'user-sarah', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-13', userId: 'user-jake', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-13', userId: 'user-emma', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-13', userId: 'user-liam', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-13', userId: 'user-noah', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-13', userId: 'user-olivia', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-13', userId: 'user-sophia', status: 'going', respondedAt: at(0) },

  // ── evt-14: Pregame at PL (upcoming) ──
  { eventId: 'evt-14', userId: 'user-logan', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-14', userId: 'user-aiden', status: 'going', respondedAt: at(1) },
  { eventId: 'evt-14', userId: 'user-mason', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-14', userId: 'user-james', status: 'going', respondedAt: at(0) },

  // ── evt-15: Open Mic Night (upcoming, open) ──
  { eventId: 'evt-15', userId: 'user-isabella', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-15', userId: 'user-priya', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-15', userId: 'user-chloe', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-15', userId: 'user-james', status: 'going', respondedAt: at(0) },

  // ── Maybe entries ──
  { eventId: 'evt-3', userId: 'user-sophia', status: 'maybe', respondedAt: at(1) },
  { eventId: 'evt-3', userId: 'user-charlotte', status: 'maybe', respondedAt: at(1) },
  { eventId: 'evt-7', userId: 'user-mia', status: 'maybe', respondedAt: at(1) },
  { eventId: 'evt-7', userId: 'user-daniel', status: 'maybe', respondedAt: at(0) },
  { eventId: 'evt-13', userId: 'user-ethan', status: 'maybe', respondedAt: at(0) },

  // Waitlisted entries for capacity-limited events
  { eventId: 'evt-6', userId: 'user-mia', status: 'waitlisted', respondedAt: at(0) },
  { eventId: 'evt-8', userId: 'user-mason', status: 'waitlisted', respondedAt: at(0) },
  { eventId: 'evt-14', userId: 'user-sophia', status: 'waitlisted', respondedAt: at(0) },

  // ── evt-16: Blackout Party (KSP, un-RSVP'd by Marcus) ──
  { eventId: 'evt-16', userId: 'user-jake', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-16', userId: 'user-liam', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-16', userId: 'user-noah', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-16', userId: 'user-ethan', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-16', userId: 'user-mason', status: 'going', respondedAt: at(0) },

  // ── evt-17: Rivalry Week Cookout (Rally, un-RSVP'd by Marcus) ──
  { eventId: 'evt-17', userId: 'user-ava', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-17', userId: 'user-ethan', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-17', userId: 'user-ben', status: 'going', respondedAt: at(0) },

  // ── evt-18: Sunset Rooftop Social (TD, un-RSVP'd by Sarah) ──
  { eventId: 'evt-18', userId: 'user-emma', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-18', userId: 'user-olivia', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-18', userId: 'user-sophia', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-18', userId: 'user-mia', status: 'going', respondedAt: at(0) },

  // ── evt-19: Senior Send-Off (KSP, un-RSVP'd by Marcus & Jake) ──
  { eventId: 'evt-19', userId: 'user-liam', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-19', userId: 'user-noah', status: 'going', respondedAt: at(0) },
  { eventId: 'evt-19', userId: 'user-aiden', status: 'going', respondedAt: at(0) },
];
