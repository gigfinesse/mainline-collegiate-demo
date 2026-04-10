'use client';

import Link from 'next/link';
import { getOrgById, formatTime } from '@/lib/data/helpers';
import type { FeedItemFriendActivity } from '@/lib/types';

interface FriendActivityCompactCardProps {
  item: FeedItemFriendActivity;
  buildHref: (path: string) => string;
}

export function FriendActivityCompactCard({
  item,
  buildHref,
}: FriendActivityCompactCardProps) {
  const { event, friends } = item;
  const org = getOrgById(event.orgId);

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      href={buildHref(`/events/${event.id}`)}
      className="block flex-shrink-0 w-[200px] h-[140px] rounded-2xl overflow-hidden relative"
    >
      {/* Full gradient background */}
      <div
        className="absolute inset-0"
        style={{ background: event.posterTheme.background }}
      />

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
            className="absolute inset-0 opacity-40"
            style={{ background: event.posterTheme.background }}
          />
        </>
      )}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-3">
        {/* Top: friend count badge */}
        <div className="flex justify-end">
          <span className="text-[10px] font-bold text-neon-cyan bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {friends.length} {friends.length === 1 ? 'friend' : 'friends'} going
          </span>
        </div>

        {/* Bottom: event info */}
        <div>
          <h3
            className="text-sm font-bold text-white leading-tight line-clamp-2"
          >
            {event.title}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-white/70">
            {org && (
              <>
                <span className="font-medium text-white/90">{org.shortName}</span>
                <span>/</span>
              </>
            )}
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
