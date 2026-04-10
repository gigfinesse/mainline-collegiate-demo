'use client';

import Link from 'next/link';
import { FeedCard } from './FeedCard';
import { formatTime } from '@/lib/data/helpers';
import type { FeedItemOrgEvent } from '@/lib/types';

interface OrgEventCardProps {
  item: FeedItemOrgEvent;
  buildHref: (path: string) => string;
}

export function OrgEventCard({ item, buildHref }: OrgEventCardProps) {
  const { event, org } = item;

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <FeedCard>
      <Link href={buildHref(`/events/${event.id}`)} className="block p-4">
        <div className="flex items-start gap-3">
          {/* Org logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={org.logoUrl}
            alt={org.shortName}
            className="w-10 h-10 rounded-xl bg-dark-700 border border-dark-600 flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-300 leading-snug">
              <span className="font-semibold text-neon-pink">{org.shortName}</span>
              {' just posted '}
              <span className="font-bold text-white">{event.title}</span>
            </p>

            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <span>{formattedDate}</span>
              <span>{'/'}</span>
              <span>{formatTime(event.startTime)}</span>
              {event.cost > 0 && (
                <>
                  <span>{'/'}</span>
                  <span className="text-neon-orange">${event.cost}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Event gradient thumbnail */}
        <div
          className="mt-3 h-20 rounded-xl flex items-end p-3 relative overflow-hidden"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </>
          )}
          <p
            className="text-sm font-bold truncate relative z-10"
            style={{ color: event.posterTheme.fontColor }}
          >
            {event.title}
          </p>
        </div>
      </Link>
    </FeedCard>
  );
}
