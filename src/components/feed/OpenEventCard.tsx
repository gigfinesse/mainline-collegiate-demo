'use client';

import Link from 'next/link';
import { FeedCard } from './FeedCard';
import { MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { formatTime } from '@/lib/data/helpers';
import type { FeedItemOpenEvent } from '@/lib/types';

interface OpenEventCardProps {
  item: FeedItemOpenEvent;
  buildHref: (path: string) => string;
}

export function OpenEventCard({ item, buildHref }: OpenEventCardProps) {
  const { event, org, goingCount } = item;

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <FeedCard>
      <Link href={buildHref(`/events/${event.id}`)} className="block">
        {/* Large gradient background with overlay content */}
        <div
          className="relative h-44 rounded-t-2xl flex flex-col justify-end p-4 overflow-hidden"
          style={{ background: event.posterTheme.background }}
        >
          {/* Cover image when available */}
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
          {/* Subtle dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-t-2xl" />

          {/* Going count badge */}
          {goingCount > 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1">
              <UserGroupIcon className="w-3.5 h-3.5 text-neon-cyan" />
              <span className="text-xs font-semibold text-white">
                {goingCount} going
              </span>
            </div>
          )}

          <div className="relative z-10">
            <h3
              className="text-xl font-extrabold leading-tight"
              style={{ color: event.posterTheme.fontColor }}
            >
              {event.title}
            </h3>
          </div>
        </div>

        {/* Info section */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neon-purple">
              {org.shortName}
            </span>
            <span className="text-xs text-gray-400">
              {formattedDate} / {formatTime(event.startTime)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPinIcon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-semibold uppercase tracking-wider text-neon-cyan/80 bg-neon-cyan/10 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </FeedCard>
  );
}
