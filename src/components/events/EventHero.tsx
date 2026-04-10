'use client';

import { MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import type { Event, Org } from '@/lib/types';

interface EventHeroProps {
  event: Event;
  org: Org;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return m === 0 ? `${hour} ${ampm}` : `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

const orgTypeBadgeColors: Record<string, string> = {
  fraternity: 'bg-neon-purple/20 text-neon-purple',
  sorority: 'bg-neon-pink/20 text-neon-pink',
  club: 'bg-neon-cyan/20 text-neon-cyan',
  student_org: 'bg-neon-orange/20 text-neon-orange',
};

const tagColors: Record<string, string> = {
  darty: 'bg-neon-orange/20 text-neon-orange border-neon-orange/30',
  formal: 'bg-neon-indigo/20 text-neon-indigo border-neon-indigo/30',
  mixer: 'bg-neon-pink/20 text-neon-pink border-neon-pink/30',
  rush: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
  philanthropy: 'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
  tailgate: 'bg-neon-orange/20 text-neon-orange border-neon-orange/30',
  party: 'bg-neon-pink/20 text-neon-pink border-neon-pink/30',
  concert: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
  pregame: 'bg-neon-indigo/20 text-neon-indigo border-neon-indigo/30',
  social: 'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
};

export function EventHero({ event, org }: EventHeroProps) {
  const orgTypeLabel = org.type.replace('_', ' ');
  const badgeColor = orgTypeBadgeColors[org.type] || 'bg-dark-600 text-gray-300';

  return (
    <div className="relative">
      {/* Gradient Hero */}
      <div
        className="relative h-72 w-full"
        style={{ background: event.posterTheme.background }}
      >
        {/* Overlay pattern for texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_60%)]" />

        {/* Bottom fade to dark-900 */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-dark-900 via-dark-900/80 to-transparent" />

        {/* Title area */}
        <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
          <h1
            className="text-3xl font-extrabold leading-tight tracking-tight"
            style={{ color: event.posterTheme.fontColor }}
          >
            {event.title}
          </h1>
        </div>
      </div>

      {/* Info section */}
      <div className="px-5 pt-3 pb-4 space-y-3">
        {/* Org + badge */}
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={org.logoUrl}
            alt={org.shortName}
            className="h-6 w-6 rounded-full bg-dark-700"
          />
          <span className="text-sm font-semibold text-white">{org.name}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badgeColor}`}
          >
            {orgTypeLabel}
          </span>
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <ClockIcon className="h-4 w-4 text-neon-purple" />
          <span>
            {formatDate(event.date)} &middot; {formatTime(event.startTime)} &ndash;{' '}
            {formatTime(event.endTime)}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <MapPinIcon className="h-4 w-4 text-neon-pink" />
          <span>{event.location}</span>
        </div>

        {/* Tags + Cost */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${tagColors[tag] || 'bg-dark-600 text-gray-300 border-dark-600'}`}
            >
              {tag}
            </span>
          ))}
          {event.cost > 0 && (
            <span className="rounded-full bg-neon-orange/20 border border-neon-orange/30 px-2.5 py-0.5 text-[11px] font-semibold text-neon-orange">
              ${event.cost} Cover
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-gray-400 pt-1">
          {event.description}
        </p>
      </div>
    </div>
  );
}
