import type { Friendship } from '@/lib/types';
import { memberships } from './memberships';

/**
 * Auto-generate friendships for all co-members (exec or member) within each org.
 * Friends-of-the-house (role: 'friend') do NOT get auto-friended — only execs + members.
 */
function generateOrgFriendships(): Friendship[] {
  const orgMembers: Record<string, string[]> = {};

  for (const m of memberships) {
    if (m.role === 'exec' || m.role === 'member') {
      if (!orgMembers[m.orgId]) orgMembers[m.orgId] = [];
      orgMembers[m.orgId].push(m.userId);
    }
  }

  const seen = new Set<string>();
  const result: Friendship[] = [];

  for (const members of Object.values(orgMembers)) {
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        const key = [members[i], members[j]].sort().join('|');
        if (!seen.has(key)) {
          seen.add(key);
          result.push({
            userId1: members[i],
            userId2: members[j],
            source: 'org',
          });
        }
      }
    }
  }

  return result;
}

// Cross-org explicit friendships via friend requests
const explicitFriendships: Friendship[] = [
  // Marcus (KSP exec) befriended Priya (TC member)
  { userId1: 'user-marcus', userId2: 'user-priya', source: 'request' },
  // Jake (KSP member) befriended Emma (TD exec)
  { userId1: 'user-jake', userId2: 'user-emma', source: 'request' },
  // Sarah (TD exec) befriended Isabella (TC exec)
  { userId1: 'user-sarah', userId2: 'user-isabella', source: 'request' },
  // Marcus befriended Logan (PL exec)
  { userId1: 'user-marcus', userId2: 'user-logan', source: 'request' },
  // Ava (Rally exec) befriended Olivia (TD member)
  { userId1: 'user-ava', userId2: 'user-olivia', source: 'request' },
];

export const friendships: Friendship[] = [
  ...generateOrgFriendships(),
  ...explicitFriendships,
];
