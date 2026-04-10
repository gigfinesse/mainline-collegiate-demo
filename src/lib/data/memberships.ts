import type { OrgMembership } from '@/lib/types';

export const memberships: OrgMembership[] = [
  // ── Kappa Sigma Pi (KSP) ──
  // Demo: marcus is exec, jake is member, sarah is friend
  { orgId: 'org-ksp', userId: 'user-marcus', role: 'exec' },
  { orgId: 'org-ksp', userId: 'user-jake', role: 'member' },
  { orgId: 'org-ksp', userId: 'user-sarah', role: 'friend' },
  { orgId: 'org-ksp', userId: 'user-liam', role: 'exec' },
  { orgId: 'org-ksp', userId: 'user-noah', role: 'member' },
  { orgId: 'org-ksp', userId: 'user-ethan', role: 'member' },
  { orgId: 'org-ksp', userId: 'user-mason', role: 'member' },
  { orgId: 'org-ksp', userId: 'user-aiden', role: 'member' },
  { orgId: 'org-ksp', userId: 'user-lucas', role: 'member' },
  { orgId: 'org-ksp', userId: 'user-ben', role: 'friend' },
  { orgId: 'org-ksp', userId: 'user-daniel', role: 'friend' },

  // ── Theta Delta (TD) ──
  // Demo: sarah is exec, priya is friend
  { orgId: 'org-td', userId: 'user-sarah', role: 'exec' },
  { orgId: 'org-td', userId: 'user-priya', role: 'friend' },
  { orgId: 'org-td', userId: 'user-emma', role: 'exec' },
  { orgId: 'org-td', userId: 'user-olivia', role: 'member' },
  { orgId: 'org-td', userId: 'user-sophia', role: 'member' },
  { orgId: 'org-td', userId: 'user-mia', role: 'member' },
  { orgId: 'org-td', userId: 'user-charlotte', role: 'member' },
  { orgId: 'org-td', userId: 'user-amelia', role: 'member' },
  { orgId: 'org-td', userId: 'user-harper', role: 'friend' },
  { orgId: 'org-td', userId: 'user-chloe', role: 'friend' },

  // ── The Collective (TC) ──
  // Demo: priya is member
  { orgId: 'org-tc', userId: 'user-priya', role: 'member' },
  { orgId: 'org-tc', userId: 'user-isabella', role: 'exec' },
  { orgId: 'org-tc', userId: 'user-james', role: 'member' },
  { orgId: 'org-tc', userId: 'user-chloe', role: 'member' },
  { orgId: 'org-tc', userId: 'user-daniel', role: 'friend' },
  { orgId: 'org-tc', userId: 'user-mia', role: 'friend' },

  // ── Rally (RLY) ──
  // Demo: marcus is member
  { orgId: 'org-rly', userId: 'user-marcus', role: 'member' },
  { orgId: 'org-rly', userId: 'user-ava', role: 'exec' },
  { orgId: 'org-rly', userId: 'user-ethan', role: 'member' },
  { orgId: 'org-rly', userId: 'user-noah', role: 'member' },
  { orgId: 'org-rly', userId: 'user-lucas', role: 'member' },
  { orgId: 'org-rly', userId: 'user-jake', role: 'friend' },
  { orgId: 'org-rly', userId: 'user-ben', role: 'member' },
  { orgId: 'org-rly', userId: 'user-logan', role: 'friend' },

  // ── Phi Lambda (PL) ──
  { orgId: 'org-pl', userId: 'user-logan', role: 'exec' },
  { orgId: 'org-pl', userId: 'user-aiden', role: 'member' },
  { orgId: 'org-pl', userId: 'user-mason', role: 'friend' },
  { orgId: 'org-pl', userId: 'user-james', role: 'member' },
  { orgId: 'org-pl', userId: 'user-sophia', role: 'friend' },
];
