import type { Org } from '@/lib/types';

// Generate SVG data URI logos with Greek letters on gradient backgrounds
function greekLogo(letters: string, gradient: [string, string], textColor: string = '#ffffff'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${gradient[0]}"/>
        <stop offset="100%" style="stop-color:${gradient[1]}"/>
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="100" fill="url(#bg)"/>
    <text x="100" y="108" text-anchor="middle" dominant-baseline="middle" font-family="Georgia,serif" font-weight="bold" font-size="${letters.length > 2 ? '60' : '72'}" fill="${textColor}" letter-spacing="2">${letters}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// Themed icon logos for non-Greek orgs
function iconLogo(emoji: string, gradient: [string, string]): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${gradient[0]}"/>
        <stop offset="100%" style="stop-color:${gradient[1]}"/>
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="100" fill="url(#bg)"/>
    <text x="100" y="110" text-anchor="middle" dominant-baseline="middle" font-size="80">${emoji}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const orgs: Org[] = [
  {
    id: 'org-ksp',
    name: 'Kappa Sigma Pi',
    shortName: 'KSP',
    greekLetters: 'ΚΣΠ',
    type: 'fraternity',
    schoolId: 'msu',
    description:
      'The biggest party frat at MSU. We throw the events everyone talks about Monday morning.',
    logoUrl: greekLogo('ΚΣΠ', ['#7c3aed', '#a855f7']),
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
  },
  {
    id: 'org-td',
    name: 'Theta Delta',
    shortName: 'TD',
    greekLetters: 'ΘΔ',
    type: 'sorority',
    schoolId: 'msu',
    description:
      'Social, philanthropic, and always best-dressed. Sisterhood with substance.',
    logoUrl: greekLogo('ΘΔ', ['#db2777', '#f472b6']),
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
    logoUrl: iconLogo('🎨', ['#1e1b4b', '#6366f1']),
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
    logoUrl: iconLogo('🏟️', ['#c2410c', '#f97316']),
    coverUrl: 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=800&q=80',
  },
  {
    id: 'org-pl',
    name: 'Phi Lambda',
    shortName: 'PL',
    greekLetters: 'ΦΛ',
    type: 'fraternity',
    schoolId: 'msu',
    description:
      'Small, exclusive, elite. Our events are invite-only for a reason.',
    logoUrl: greekLogo('ΦΛ', ['#1a1a2e', '#a855f7'], '#ec4899'),
    coverUrl: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&q=80',
  },
];
