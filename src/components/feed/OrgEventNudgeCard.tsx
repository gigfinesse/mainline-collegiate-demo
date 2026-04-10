'use client';

import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { formatTime, getRSVPsForEvent } from '@/lib/data/helpers';
import type { Event, Org } from '@/lib/types';

interface OrgEventNudgeCardProps {
  event: Event;
  org: Org;
  buildHref: (path: string) => string;
}

export function OrgEventNudgeCard({ event, org, buildHref }: OrgEventNudgeCardProps) {
  const { rsvpToEvent, rsvps } = useApp();

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const goingCount = getRSVPsForEvent(event.id, rsvps).filter(
    (r) => r.rsvp.status === 'going',
  ).length;

  const spotsLabel =
    event.capacity
      ? `${goingCount}/${event.capacity} spots`
      : goingCount > 0
        ? `${goingCount} going`
        : null;

  return (
    <div className="rounded-2xl bg-dark-800 border border-dark-600 overflow-hidden">
      <Link href={buildHref(`/events/${event.id}`)} className="block">
        {/* Gradient/image header - compact */}
        <div
          className="relative h-20 flex items-end p-3 overflow-hidden"
          style={{ background: event.posterTheme.background }}
        >
          {event.coverImageUrl && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.coverImageUrl}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 opacity-50"
                style={{ background: event.posterTheme.background }}
              />
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Spots badge */}
          {spotsLabel && (
            <div className="absolute top-2 right-2 text-[10px] font-bold text-neon-cyan bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
              {spotsLabel}
            </div>
          )}

          <h3
            className="relative z-10 text-sm font-bold leading-tight line-clamp-1"
            style={{ color: event.posterTheme.fontColor }}
          >
            {event.title}
          </h3>
        </div>
      </Link>

      {/* Info + RSVP */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neon-pink truncate">
            {org.greekLetters || org.shortName}
          </span>
          <span className="text-[10px] text-gray-500 flex-shrink-0 ml-2">
            {formattedDate} / {formatTime(event.startTime)}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            rsvpToEvent(event.id);
          }}
          className="w-full rounded-xl px-3 py-2 text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
          }}
        >
          RSVP
        </button>
      </div>
    </div>
  );
}
