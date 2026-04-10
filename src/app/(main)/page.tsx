'use client';

import Link from 'next/link';
import { useSearchParams, redirect } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { getHomeFeedForUser, getUnRsvpdOrgEventsForUser } from '@/lib/data/helpers';
import { FriendActivityCompactCard } from '@/components/feed/FriendActivityCompactCard';
import { OrgEventCard } from '@/components/feed/OrgEventCard';
import { OpenEventCard } from '@/components/feed/OpenEventCard';
import { OrgEventNudgeCard } from '@/components/feed/OrgEventNudgeCard';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { BellIcon } from '@heroicons/react/24/outline';
import type { FeedItemFriendActivity, FeedItemOrgEvent, FeedItemOpenEvent } from '@/lib/types';

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

  // Separate feed items by type
  const friendActivityItems = feedItems.filter(
    (item): item is FeedItemFriendActivity => item.type === 'friend_activity',
  );
  const orgEventItems = feedItems.filter(
    (item): item is FeedItemOrgEvent => item.type === 'org_event',
  );
  const openEventItems = feedItems.filter(
    (item): item is FeedItemOpenEvent => item.type === 'open_event',
  );

  const hasAnyItems =
    friendActivityItems.length > 0 ||
    orgEventItems.length > 0 ||
    openEventItems.length > 0 ||
    unRsvpdOrgEvents.length > 0;

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
        <div className="space-y-6">
          {/* Section 1: Your Friends Are Going */}
          {friendActivityItems.length > 0 && (
            <section>
              <h2 className="px-4 mb-3 text-base font-bold text-white">
                friends are pulling up 🔥
              </h2>
              <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
                {friendActivityItems.map((item) => (
                  <FriendActivityCompactCard
                    key={`fa-${item.event.id}`}
                    item={item}
                    buildHref={buildHref}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Section 2: Don't Miss - Un-RSVP'd org events */}
          {unRsvpdOrgEvents.length > 0 && (
            <section>
              <h2 className="px-4 mb-3 text-base font-bold text-white">
                don&apos;t miss 👀
              </h2>
              <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
                {unRsvpdOrgEvents.map(({ event, org }) => (
                  <div key={`nudge-${event.id}`} className="flex-shrink-0 w-[180px]">
                    <OrgEventNudgeCard
                      event={event}
                      org={org}
                      buildHref={buildHref}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 3: From Your Orgs */}
          {orgEventItems.length > 0 && (
            <section className="px-4">
              <h2 className="mb-3 text-base font-bold text-white">
                from your orgs ✨
              </h2>
              <div className="space-y-3">
                {orgEventItems.map((item) => (
                  <OrgEventCard
                    key={`oe-${item.event.id}`}
                    item={item}
                    buildHref={buildHref}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Section 4: Happening at MSU */}
          {openEventItems.length > 0 && (
            <section className="px-4">
              <h2 className="mb-3 text-base font-bold text-white">
                happening at MSU 🎉
              </h2>
              <div className="space-y-3">
                {openEventItems.map((item) => (
                  <OpenEventCard
                    key={`open-${item.event.id}`}
                    item={item}
                    buildHref={buildHref}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
