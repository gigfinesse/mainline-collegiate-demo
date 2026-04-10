'use client';

import { useSearchParams, redirect } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { getHomeFeedForUser } from '@/lib/data/helpers';
import { FriendActivityCompactCard } from '@/components/feed/FriendActivityCompactCard';
import { OrgEventCard } from '@/components/feed/OrgEventCard';
import { OpenEventCard } from '@/components/feed/OpenEventCard';
import { SparklesIcon } from '@heroicons/react/24/solid';
import type { FeedItemFriendActivity, FeedItemOrgEvent, FeedItemOpenEvent } from '@/lib/types';

export default function HomePage() {
  const { currentUser, rsvps } = useApp();
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
    openEventItems.length > 0;

  return (
    <div className="pb-4">
      {/* Wordmark */}
      <div className="px-4 pt-6 mb-5">
        <div className="text-xs font-bold tracking-[0.3em] text-neon-purple uppercase">
          Mainline
        </div>
      </div>

      {!hasAnyItems ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <SparklesIcon className="w-10 h-10 text-neon-purple/40 mb-3" />
          <p className="text-gray-400 font-medium">Nothing in your feed yet</p>
          <p className="text-xs text-gray-600 mt-1">
            Join some orgs and add friends to see what&apos;s up
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Section 1: Your Friends Are Going */}
          {friendActivityItems.length > 0 && (
            <section>
              <h2 className="px-4 mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                Your Friends Are Going
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

          {/* Section 2: From Your Orgs */}
          {orgEventItems.length > 0 && (
            <section className="px-4">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                From Your Orgs
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

          {/* Section 3: Happening at MSU */}
          {openEventItems.length > 0 && (
            <section className="px-4">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                Happening at MSU
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
