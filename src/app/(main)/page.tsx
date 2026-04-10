'use client';

import { useSearchParams, redirect } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { getHomeFeedForUser } from '@/lib/data/helpers';
import { FriendActivityCard } from '@/components/feed/FriendActivityCard';
import { OrgEventCard } from '@/components/feed/OrgEventCard';
import { OpenEventCard } from '@/components/feed/OpenEventCard';
import { SparklesIcon } from '@heroicons/react/24/solid';

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

  return (
    <div className="px-4 pt-6 pb-4">
      {/* Header */}
      <div className="mb-6">
        <div className="text-xs font-bold tracking-[0.3em] text-neon-purple uppercase mb-2">
          Mainline
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Hey {currentUser.firstName} <span aria-hidden="true">&#128075;</span>
          </h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          See what&apos;s happening on campus
        </p>
      </div>

      {/* Feed */}
      {feedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <SparklesIcon className="w-10 h-10 text-neon-purple/40 mb-3" />
          <p className="text-gray-400 font-medium">Nothing in your feed yet</p>
          <p className="text-xs text-gray-600 mt-1">
            Join some orgs and add friends to see what&apos;s up
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedItems.map((item) => {
            switch (item.type) {
              case 'friend_activity':
                return (
                  <FriendActivityCard
                    key={`fa-${item.event.id}`}
                    item={item}
                    buildHref={buildHref}
                  />
                );
              case 'org_event':
                return (
                  <OrgEventCard
                    key={`oe-${item.event.id}`}
                    item={item}
                    buildHref={buildHref}
                  />
                );
              case 'open_event':
                return (
                  <OpenEventCard
                    key={`open-${item.event.id}`}
                    item={item}
                    buildHref={buildHref}
                  />
                );
              default:
                return null;
            }
          })}
        </div>
      )}
    </div>
  );
}
