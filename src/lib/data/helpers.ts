import type {
  Event,
  FeedItem,
  Org,
  OrgRole,
  RSVPStatus,
  User,
  RSVP,
  Comment,
} from '@/lib/types';
import { users } from './users';
import { orgs } from './orgs';
import { memberships } from './memberships';
import { friendships } from './friendships';
import { events } from './events';
import { rsvps as allRsvps } from './rsvps';
import { comments as allComments } from './comments';

// ── Formatting helpers ──

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return m === 0 ? `${hour12} ${suffix}` : `${hour12}:${m.toString().padStart(2, '0')} ${suffix}`;
}

// ── Lookup helpers ──

export function getUserBySlug(slug: string): User | undefined {
  return users.find((u) => u.slug === slug);
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function getOrgById(id: string): Org | undefined {
  return orgs.find((o) => o.id === id);
}

export function getEventById(id: string): Event | undefined {
  return events.find((e) => e.id === id);
}

// ── Org / membership helpers ──

export function getOrgsForUser(userId: string): { org: Org; role: OrgRole }[] {
  return memberships
    .filter((m) => m.userId === userId)
    .map((m) => {
      const org = getOrgById(m.orgId);
      return org ? { org, role: m.role } : null;
    })
    .filter((x): x is { org: Org; role: OrgRole } => x !== null);
}

export function getMembersOfOrg(
  orgId: string,
): { user: User; role: OrgRole }[] {
  return memberships
    .filter((m) => m.orgId === orgId)
    .map((m) => {
      const user = getUserById(m.userId);
      return user ? { user, role: m.role } : null;
    })
    .filter((x): x is { user: User; role: OrgRole } => x !== null);
}

export function getUserRoleInOrg(
  userId: string,
  orgId: string,
): OrgRole | null {
  const m = memberships.find(
    (mem) => mem.userId === userId && mem.orgId === orgId,
  );
  return m ? m.role : null;
}

export function getEventsForOrg(orgId: string): Event[] {
  return events.filter((e) => e.orgId === orgId);
}

// ── Friend helpers ──

export function getFriendsOfUser(userId: string): User[] {
  const friendIds = new Set<string>();
  for (const f of friendships) {
    if (f.userId1 === userId) friendIds.add(f.userId2);
    if (f.userId2 === userId) friendIds.add(f.userId1);
  }
  return users.filter((u) => friendIds.has(u.id));
}

function isFriendOf(userId: string, otherUserId: string): boolean {
  return friendships.some(
    (f) =>
      (f.userId1 === userId && f.userId2 === otherUserId) ||
      (f.userId1 === otherUserId && f.userId2 === userId),
  );
}

// ── RSVP helpers ──

export function getRSVPsForEvent(
  eventId: string,
  rsvpList: RSVP[] = allRsvps,
): { rsvp: RSVP; user: User }[] {
  return rsvpList
    .filter((r) => r.eventId === eventId)
    .map((r) => {
      const user = getUserById(r.userId);
      return user ? { rsvp: r, user } : null;
    })
    .filter((x): x is { rsvp: RSVP; user: User } => x !== null);
}

export function getUserRSVPForEvent(
  userId: string,
  eventId: string,
  rsvpList: RSVP[] = allRsvps,
): RSVPStatus {
  const rsvp = rsvpList.find(
    (r) => r.userId === userId && r.eventId === eventId,
  );
  return rsvp ? rsvp.status : 'none';
}

// ── Comment helpers ──

export function getCommentsForEvent(
  eventId: string,
  commentList: Comment[] = allComments,
): { comment: Comment; user: User }[] {
  return commentList
    .filter((c) => c.eventId === eventId)
    .map((c) => {
      const user = getUserById(c.userId);
      return user ? { comment: c, user } : null;
    })
    .filter((x): x is { comment: Comment; user: User } => x !== null);
}

// ── Visibility / access helpers ──

export function canUserSeeEvent(userId: string, event: Event): boolean {
  const role = getUserRoleInOrg(userId, event.orgId);

  switch (event.visibility) {
    case 'members_only':
      // Only execs + members of the org
      return role === 'exec' || role === 'member';
    case 'friends_and_members':
      // Execs + members + friends of the org
      return role === 'exec' || role === 'member' || role === 'friend';
    case 'open':
      // Everyone at the school
      return true;
    default:
      return false;
  }
}

export function canUserRSVP(
  userId: string,
  event: Event,
): { allowed: boolean; autoApproved: boolean } {
  const role = getUserRoleInOrg(userId, event.orgId);

  // Exec or member: always allowed, always auto-approved
  if (role === 'exec' || role === 'member') {
    return { allowed: true, autoApproved: true };
  }

  // Friend of the org
  if (role === 'friend') {
    if (event.visibility === 'members_only') {
      return { allowed: false, autoApproved: false };
    }
    return { allowed: true, autoApproved: true };
  }

  // Rando (no role in org)
  if (event.visibility === 'open') {
    return { allowed: true, autoApproved: false };
  }

  return { allowed: false, autoApproved: false };
}

// ── Feed algorithm ──

export function getHomeFeedForUser(
  userId: string,
  rsvpList: RSVP[] = allRsvps,
): FeedItem[] {
  const now = new Date('2026-04-10T00:00:00');
  const upcomingEvents = events.filter((e) => new Date(e.date) >= now);

  const friends = getFriendsOfUser(userId);
  const friendIds = new Set(friends.map((f) => f.id));

  const feedItems: FeedItem[] = [];

  // 1. Events friends are going to (grouped by event, sorted by friend count)
  const friendActivityEvents: {
    event: Event;
    friends: User[];
  }[] = [];

  for (const event of upcomingEvents) {
    if (!canUserSeeEvent(userId, event)) continue;

    const friendsGoing = rsvpList
      .filter(
        (r) =>
          r.eventId === event.id &&
          (r.status === 'going' || r.status === 'maybe') &&
          friendIds.has(r.userId),
      )
      .map((r) => friends.find((f) => f.id === r.userId))
      .filter((u): u is User => u !== undefined);

    if (friendsGoing.length > 0) {
      friendActivityEvents.push({ event, friends: friendsGoing });
    }
  }

  // Sort by friend count descending
  friendActivityEvents.sort((a, b) => b.friends.length - a.friends.length);

  for (const item of friendActivityEvents) {
    feedItems.push({
      type: 'friend_activity',
      event: item.event,
      friends: item.friends,
    });
  }

  // Track events already in feed
  const seenEventIds = new Set(feedItems.map((f) => f.event.id));

  // 2. New events from user's orgs
  const userOrgIds = new Set(
    memberships
      .filter(
        (m) =>
          m.userId === userId && (m.role === 'exec' || m.role === 'member'),
      )
      .map((m) => m.orgId),
  );

  for (const event of upcomingEvents) {
    if (seenEventIds.has(event.id)) continue;
    if (!userOrgIds.has(event.orgId)) continue;
    if (!canUserSeeEvent(userId, event)) continue;

    const org = getOrgById(event.orgId);
    if (!org) continue;

    feedItems.push({ type: 'org_event', event, org });
    seenEventIds.add(event.id);
  }

  // 3. Open events at school
  for (const event of upcomingEvents) {
    if (seenEventIds.has(event.id)) continue;
    if (event.visibility !== 'open') continue;

    const org = getOrgById(event.orgId);
    if (!org) continue;

    const goingCount = rsvpList.filter(
      (r) => r.eventId === event.id && r.status === 'going',
    ).length;

    feedItems.push({ type: 'open_event', event, org, goingCount });
    seenEventIds.add(event.id);
  }

  return feedItems;
}

// ── Un-RSVP'd org events helper ──

export function getUnRsvpdOrgEventsForUser(
  userId: string,
  rsvpList: RSVP[] = allRsvps,
): { event: Event; org: Org }[] {
  const now = new Date('2026-04-10T00:00:00');

  // Get orgs the user belongs to (exec or member, NOT friend)
  const userOrgIds = new Set(
    memberships
      .filter(
        (m) =>
          m.userId === userId && (m.role === 'exec' || m.role === 'member'),
      )
      .map((m) => m.orgId),
  );

  // Get events the user has already RSVP'd to (any status)
  const rsvpdEventIds = new Set(
    rsvpList.filter((r) => r.userId === userId).map((r) => r.eventId),
  );

  // Get upcoming events from those orgs that the user can see but hasn't RSVP'd to
  const results: { event: Event; org: Org }[] = [];

  for (const event of events) {
    if (new Date(event.date) < now) continue;
    if (!userOrgIds.has(event.orgId)) continue;
    if (rsvpdEventIds.has(event.id)) continue;
    if (!canUserSeeEvent(userId, event)) continue;

    const org = getOrgById(event.orgId);
    if (!org) continue;

    results.push({ event, org });
  }

  // Sort by date ascending (soonest first)
  results.sort(
    (a, b) => new Date(a.event.date).getTime() - new Date(b.event.date).getTime(),
  );

  return results;
}

// ── User event helpers ──

export function getUpcomingEventsForUser(
  userId: string,
  rsvpList: RSVP[] = allRsvps,
): Event[] {
  const now = new Date('2026-04-10T00:00:00');
  const userEventIds = new Set(
    rsvpList
      .filter(
        (r) =>
          r.userId === userId &&
          (r.status === 'going' ||
            r.status === 'maybe' ||
            r.status === 'waitlisted' ||
            r.status === 'requested'),
      )
      .map((r) => r.eventId),
  );

  return events
    .filter((e) => userEventIds.has(e.id) && new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getPastEventsForUser(
  userId: string,
  rsvpList: RSVP[] = allRsvps,
): Event[] {
  const now = new Date('2026-04-10T00:00:00');
  const userEventIds = new Set(
    rsvpList
      .filter((r) => r.userId === userId && r.status === 'going')
      .map((r) => r.eventId),
  );

  return events
    .filter((e) => userEventIds.has(e.id) && new Date(e.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
