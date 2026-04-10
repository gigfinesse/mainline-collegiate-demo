import type { EventTag } from '@/lib/types';

const tagColorMap: Record<EventTag, string> = {
  darty: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  formal: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  mixer: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  rush: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  philanthropy: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  tailgate: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  party: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
  concert: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  pregame: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  social: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
};

const fallbackColor = 'bg-dark-600 text-gray-300 border-dark-600';

export function getTagColor(tag: EventTag): string {
  return tagColorMap[tag] || fallbackColor;
}
