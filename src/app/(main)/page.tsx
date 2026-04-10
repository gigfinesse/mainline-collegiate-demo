'use client';

import Link from 'next/link';
import { useSearchParams, redirect } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { getHomeFeedForUser, getUnRsvpdOrgEventsForUser } from '@/lib/data/helpers';
import { EventFeedCard } from '@/components/feed/EventFeedCard';
import { DontMissHero } from '@/components/feed/DontMissHero';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { BellIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const { currentUser, rsvps, unreadCount } = useApp();
  const searchParams = useSearchParams();
  const userParam = searchParams.get('user');

  // No user selected — go to welcome/picker page
  if (!userParam) {
    redirect('/welcome');
  }

  const buildHref = (path: string) =>
    userParam ? `${path}?user=${userParam}` : path;

  if (!currentUser) {
    return (
      <div className="px-4 pt-6">
        <p className="text-gray-400">No user found.</p>
      </div>
    );
  }

  const feedItems = getHomeFeedForUser(currentUser.id, rsvps);
  const unRsvpdOrgEvents = getUnRsvpdOrgEventsForUser(currentUser.id, rsvps);

  const hasAnyFeedItems = feedItems.length > 0;
  const hasAnyItems = hasAnyFeedItems || unRsvpdOrgEvents.length > 0;

  return (
    <div className="pb-4">
      {/* Wordmark + Notification Bell */}
      <div className="px-4 pt-6 mb-5 flex items-center justify-between">
        <span className="bg-gradient-to-r from-neon-purple via-neon-pink to-neon-orange bg-clip-text text-transparent text-sm font-black tracking-[0.2em]">
          MAINLINE
        </span>
        <Link href={buildHref('/notifications')} className="relative p-1">
          <BellIcon className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-neon-pink text-white text-[10px] font-bold px-1">
              {unreadCount}
            </span>
          )}
        </Link>
      </div>

      {!hasAnyItems ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <SparklesIcon className="w-10 h-10 text-neon-purple/40 mb-3" />
          <p className="text-gray-400 font-medium">it&apos;s quiet... too quiet 👀</p>
          <p className="text-xs text-gray-600 mt-1">
            join some orgs and add friends to get in the loop
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Don't Miss Hero — swipeable featured cards */}
          {unRsvpdOrgEvents.length > 0 && (
            <DontMissHero events={unRsvpdOrgEvents} buildHref={buildHref} />
          )}

          {/* Event Feed */}
          {hasAnyFeedItems && (
            <div className="px-4 space-y-3">
              {feedItems.map((item) => (
                <EventFeedCard
                  key={`feed-${item.event.id}`}
                  item={item}
                  buildHref={buildHref}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
