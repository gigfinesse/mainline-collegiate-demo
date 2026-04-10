import type { Org } from '@/lib/types';

function logo(seed: string): string {
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${seed}`;
}

export const orgs: Org[] = [
  {
    id: 'org-ksp',
    name: 'Kappa Sigma Pi',
    shortName: 'KSP',
    type: 'fraternity',
    schoolId: 'msu',
    description:
      'The biggest party frat at MSU. We throw the events everyone talks about Monday morning.',
    logoUrl: logo('KappaSigmaPi'),
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
  },
  {
    id: 'org-td',
    name: 'Theta Delta',
    shortName: 'TD',
    type: 'sorority',
    schoolId: 'msu',
    description:
      'Social, philanthropic, and always best-dressed. Sisterhood with substance.',
    logoUrl: logo('ThetaDelta'),
    coverUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&q=80',
  },
  {
    id: 'org-tc',
    name: 'The Collective',
    shortName: 'TC',
    type: 'club',
    schoolId: 'msu',
    description:
      'Creative arts collective. Underground shows, gallery nights, and sonic experiments.',
    logoUrl: logo('TheCollective'),
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
  },
  {
    id: 'org-rly',
    name: 'Rally',
    shortName: 'RLY',
    type: 'student_org',
    schoolId: 'msu',
    description:
      'The game-day crew. Tailgates, watch parties, and school spirit turned up to 11.',
    logoUrl: logo('Rally'),
    coverUrl: 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=800&q=80',
  },
  {
    id: 'org-pl',
    name: 'Phi Lambda',
    shortName: 'PL',
    type: 'fraternity',
    schoolId: 'msu',
    description:
      'Small, exclusive, elite. Our events are invite-only for a reason.',
    logoUrl: logo('PhiLambda'),
    coverUrl: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&q=80',
  },
];
