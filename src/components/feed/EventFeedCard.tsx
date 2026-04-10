'use client';

import Link from 'next/link';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { formatTime, getOrgById, getRSVPsForEvent } from '@/lib/data/helpers';
import { useApp } from '@/lib/context/AppContext';
import { getTagColor } from '@/lib/tagColors';
import type { FeedItem } from '@/lib/types';

interface EventFeedCardProps {
  item: FeedItem;
  buildHref: (path: string) => string;
}

export function EventFeedCard({ item, buildHref }: EventFeedCardProps) {
  const { rsvps } = useApp();
  const { event } = item;

  // Get org info
  const org =
    item.type === 'friend_activity'
      ? getOrgById(event.orgId)
      : item.org;

  // Get friends going (for social proof)
  const friends = item.type === 'friend_activity' ? item.friends : [];

  // Get going count
  const goingCount =
    item.type === 'open_event'
      ? item.goingCount
      : getRSVPsForEvent(event.id, rsvps).filter((r) => r.rsvp.status === 'going').length;

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const orgDisplayName = org
    ? org.greekLetters
      ? `${org.greekLetters} ${org.name}`
      : org.name
    : '';

  const orgShort = org
    ? org.greekLetters || org.shortName
    : '';

  return (
    <Link
      href={buildHref(`/events/${event.id}`)}
      className="block rounded-2xl bg-dark-800 border border-dark-600 overflow-hidden transition-all duration-200 hover:border-neon-purple/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]"
    >
      {/* Event image hero */}
      <div
        className="relative h-36 flex flex-col justify-end p-3.5 overflow-hidden"
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
              className="absolute inset-0 opacity-40"
              style={{ background: event.posterTheme.background }}
            />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top-right badges */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          {event.capacity && (
            <span className="text-[10px] font-semibold text-white bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5">
              {goingCount}/{event.capacity}
            </span>
          )}
          {!event.capacity && goingCount > 0 && (
            <span className="text-[10px] font-semibold text-white bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5">
              {goingCount} going
            </span>
          )}
        </div>

        {/* Title + org on the image */}
        <div className="relative z-10">
          <h3 className="text-lg font-extrabold text-white leading-tight line-clamp-2">
            {event.title}
          </h3>
          <p className="text-xs text-gray-300 mt-0.5">{orgShort}</p>
        </div>
      </div>

      {/* Info section below image */}
      <div className="px-3.5 py-3 space-y-2">
        {/* Date + location row */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="font-medium text-gray-300">
            {formattedDate} / {formatTime(event.startTime)}
          </span>
          <span className="flex items-center gap-1 truncate">
            <MapPinIcon className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </span>
        </div>

        {/* Tags */}
        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${getTagColor(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Social proof — friends going */}
        {friends.length > 0 && (
          <div className="flex items-center gap-2 pt-0.5">
            <div className="flex -space-x-2">
              {friends.slice(0, 4).map((friend) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={friend.id}
                  src={friend.avatarUrl}
                  alt={friend.firstName}
                  className="w-6 h-6 rounded-full border-2 border-dark-800 bg-dark-700"
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-400">
              {friends.length === 1
                ? `${friends[0].firstName} is going`
                : friends.length === 2
                  ? `${friends[0].firstName} & ${friends[1].firstName} are going`
                  : `${friends[0].firstName} + ${friends.length - 1} friends going`}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
