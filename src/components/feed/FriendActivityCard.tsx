'use client';

import Link from 'next/link';
import { FeedCard } from './FeedCard';
import { getOrgById, formatTime } from '@/lib/data/helpers';
import { useUserProfile } from '@/lib/context/UserProfileContext';
import type { FeedItemFriendActivity } from '@/lib/types';

interface FriendActivityCardProps {
  item: FeedItemFriendActivity;
  buildHref: (path: string) => string;
}

export function FriendActivityCard({ item, buildHref }: FriendActivityCardProps) {
  const { event, friends } = item;
  const org = getOrgById(event.orgId);
  const { openProfile } = useUserProfile();

  // Build friend text
  const displayedFriends = friends.slice(0, 2);
  const remaining = friends.length - displayedFriends.length;
  const friendNames = displayedFriends.map((f) => f.firstName).join(', ');
  const friendText =
    remaining > 0
      ? `${friendNames} + ${remaining} ${remaining === 1 ? 'other' : 'others'}`
      : friendNames;

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <FeedCard>
      <Link href={buildHref(`/events/${event.id}`)} className="block relative p-4 pt-5">
        {/* Top accent stripe using event gradient */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{ background: event.posterTheme.background }}
        />

        <div className="flex items-start gap-3">
          {/* Stacked avatars */}
          <div
            className="relative flex-shrink-0"
            style={{ width: 40, height: 40 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (friends.length > 0) openProfile(friends[0].id);
            }}
          >
            {friends.slice(0, 3).map((friend, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={friend.id}
                src={friend.avatarUrl}
                alt={friend.firstName}
                className="absolute rounded-full border-2 border-dark-800 bg-dark-700"
                style={{
                  width: 28,
                  height: 28,
                  left: i * 8,
                  top: i * 4,
                  zIndex: 3 - i,
                }}
              />
            ))}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-300 leading-snug">
              <span className="font-semibold text-white">{friendText}</span>
              {friends.length === 1 ? ' is' : ' are'} going to{' '}
              <span className="font-bold text-neon-cyan">{event.title}</span>
            </p>

            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              {org && (
                <>
                  <span className="text-gray-400">{org.shortName}</span>
                  <span>{'/'}</span>
                </>
              )}
              <span>{formattedDate}</span>
              <span>{'/'}</span>
              <span>{formatTime(event.startTime)}</span>
            </div>
          </div>

          {/* Mini gradient pill / thumbnail */}
          <div
            className="flex-shrink-0 w-10 h-10 rounded-xl relative overflow-hidden"
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
          </div>
        </div>
      </Link>
    </FeedCard>
  );
}
