'use client';

import Link from 'next/link';
import { getOrgById, getUserRSVPForEvent, formatTime } from '@/lib/data/helpers';
import type { Event, RSVP, RSVPStatus } from '@/lib/types';

interface EventListCardProps {
  event: Event;
  currentUserId: string;
  rsvps: RSVP[];
  isHosting: boolean;
  isPast?: boolean;
  buildHref: (path: string) => string;
}

function RSVPBadge({ status }: { status: RSVPStatus }) {
  const config: Record<string, { className: string; label: string }> = {
    going: {
      className: 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400',
      label: 'going \u2713',
    },
    waitlisted: {
      className: 'bg-amber-500/15 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.15)]',
      label: 'waitlisted',
    },
    requested: {
      className: 'bg-neon-orange/15 text-neon-orange',
      label: 'requested \ud83e\udd1e',
    },
  };

  const c = config[status];
  if (!c) return null;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.className}`}
    >
      {c.label}
    </span>
  );
}

export function EventListCard({
  event,
  currentUserId,
  rsvps,
  isHosting,
  isPast = false,
  buildHref,
}: EventListCardProps) {
  const org = getOrgById(event.orgId);
  const rsvpStatus = getUserRSVPForEvent(currentUserId, event.id, rsvps);

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div>
      <Link
        href={buildHref(`/events/${event.id}`)}
        className={`flex items-center gap-3 rounded-2xl bg-dark-800 border border-dark-600 p-3 transition-all duration-200 hover:border-neon-purple/40 hover:shadow-[0_0_16px_rgba(168,85,247,0.08)] ${isPast ? 'opacity-60' : ''}`}
      >
        {/* Poster gradient square */}
        <div
          className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center relative overflow-hidden"
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
          <span
            className="text-[10px] font-extrabold text-center leading-tight px-1 relative z-10"
            style={{ color: event.posterTheme.fontColor }}
          >
            {eventDate.toLocaleDateString('en-US', { month: 'short' })}
            <br />
            {eventDate.getDate()}
          </span>
        </div>

        {/* Event info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white truncate">
              {event.title}
            </h3>
            {isHosting && (
              <span className="flex-shrink-0 text-[10px] font-semibold bg-gradient-to-r from-neon-pink/20 to-neon-purple/20 text-neon-pink px-2 py-0.5 rounded-full">
                hosting 🎤
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5 truncate">
            {org?.shortName || 'Unknown Org'} / {formattedDate}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] text-gray-500">{formatTime(event.startTime)}</span>
            {rsvpStatus !== 'none' && <RSVPBadge status={rsvpStatus} />}
          </div>
        </div>

        {/* Chevron */}
        <svg
          className="w-4 h-4 text-gray-600 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
