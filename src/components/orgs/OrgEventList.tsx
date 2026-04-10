'use client';

import Link from 'next/link';
import { getOrgById, getUserRSVPForEvent, canUserSeeEvent, formatTime } from '@/lib/data/helpers';
import type { Event, RSVP, RSVPStatus } from '@/lib/types';
import { CalendarIcon } from '@heroicons/react/24/outline';

function RSVPBadge({ status }: { status: RSVPStatus }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    going: {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      label: 'Going',
    },
    waitlisted: {
      bg: 'bg-yellow-500/15',
      text: 'text-yellow-400',
      label: 'Waitlisted',
    },
    requested: {
      bg: 'bg-neon-orange/15',
      text: 'text-neon-orange',
      label: 'Requested',
    },
  };

  const c = config[status];
  if (!c) return null;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}
    >
      {c.label}
    </span>
  );
}

interface OrgEventListProps {
  orgId: string;
  currentUserId: string;
  rsvps: RSVP[];
  contextEvents: Event[];
  buildHref: (path: string) => string;
}

export function OrgEventList({
  orgId,
  currentUserId,
  rsvps,
  contextEvents,
  buildHref,
}: OrgEventListProps) {
  // Use context events to include newly-created events
  const orgEvents = contextEvents
    .filter((e) => e.orgId === orgId)
    .filter((e) => canUserSeeEvent(currentUserId, e));

  const now = new Date('2026-04-10T00:00:00');

  const upcoming = orgEvents
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const past = orgEvents
    .filter((e) => new Date(e.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (orgEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CalendarIcon className="w-10 h-10 text-gray-600 mb-3" />
        <p className="text-gray-400 font-medium">No events yet</p>
        <p className="text-xs text-gray-600 mt-1">
          Events from this org will show up here
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-6">
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            Upcoming
          </h3>
          <div className="space-y-2">
            {upcoming.map((event, i) => (
              <EventRow
                key={event.id}
                event={event}
                currentUserId={currentUserId}
                rsvps={rsvps}
                buildHref={buildHref}
                index={i}
              />
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            Past
          </h3>
          <div className="space-y-2">
            {past.map((event, i) => (
              <EventRow
                key={event.id}
                event={event}
                currentUserId={currentUserId}
                rsvps={rsvps}
                buildHref={buildHref}
                index={i}
                isPast
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EventRow({
  event,
  currentUserId,
  rsvps,
  buildHref,
  index,
  isPast = false,
}: {
  event: Event;
  currentUserId: string;
  rsvps: RSVP[];
  buildHref: (path: string) => string;
  index: number;
  isPast?: boolean;
}) {
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
          <h3 className="text-sm font-bold text-white truncate">
            {event.title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 truncate">
            {formattedDate} / {formatTime(event.startTime)}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium text-gray-500 bg-dark-700 px-1.5 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
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
