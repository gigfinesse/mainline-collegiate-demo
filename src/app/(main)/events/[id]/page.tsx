'use client';

import { use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useApp } from '@/lib/context/AppContext';
import { getOrgById } from '@/lib/data/helpers';
import { EventHero } from '@/components/events/EventHero';
import { RSVPButton } from '@/components/events/RSVPButton';
import { GuestList } from '@/components/events/GuestList';
import { CommentWall } from '@/components/events/CommentWall';
import { ShareButton } from '@/components/events/ShareButton';

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userParam = searchParams.get('user');
  const { events, rsvps } = useApp();

  // Find event from context (supports dynamically created events)
  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center px-5 pt-20 text-center">
        <p className="text-lg font-bold text-white">Event not found</p>
        <p className="text-sm text-gray-400 mt-1">This event may have been removed.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm font-semibold text-neon-purple"
        >
          Go Back
        </button>
      </div>
    );
  }

  const org = getOrgById(event.orgId);
  if (!org) {
    return (
      <div className="flex flex-col items-center justify-center px-5 pt-20 text-center">
        <p className="text-lg font-bold text-white">Organization not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm font-semibold text-neon-purple"
        >
          Go Back
        </button>
      </div>
    );
  }

  const buildHref = (path: string) =>
    userParam ? `${path}?user=${userParam}` : path;

  // Capacity info
  const goingCount = rsvps.filter(
    (r) => r.eventId === event.id && r.status === 'going',
  ).length;
  const waitlistedCount = rsvps.filter(
    (r) => r.eventId === event.id && r.status === 'waitlisted',
  ).length;

  return (
    <div className="relative">
      {/* Back button - floating over hero */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-30 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-3 py-2 text-sm font-medium text-white hover:bg-black/60 transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </button>

      {/* Hero */}
      <EventHero event={event} org={org} />

      {/* RSVP + Capacity Section */}
      <div className="px-5 pb-4 space-y-3">
        {/* Capacity bar */}
        {event.capacity && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-400">
                {goingCount} / {event.capacity} spots filled
              </span>
              {waitlistedCount > 0 && (
                <span className="text-xs text-yellow-400">
                  +{waitlistedCount} waitlisted
                </span>
              )}
            </div>
            <div className="h-1.5 rounded-full bg-dark-700 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min((goingCount / event.capacity) * 100, 100)}%`,
                  background: 'linear-gradient(90deg, #a855f7, #ec4899)',
                }}
              />
            </div>
          </div>
        )}

        {/* RSVP Button */}
        <RSVPButton event={event} />

        {/* Share */}
        <div className="flex justify-center pt-1">
          <ShareButton eventTitle={event.title} />
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-dark-600" />

      {/* Guest List */}
      <GuestList event={event} />

      {/* Divider */}
      <div className="mx-5 h-px bg-dark-600" />

      {/* Comments */}
      <CommentWall event={event} />

      {/* Bottom spacer for tab bar */}
      <div className="h-4" />

      {/* Org link */}
      <div className="px-5 pb-6">
        <a
          href={buildHref(`/orgs/${org.id}`)}
          className="flex items-center gap-3 rounded-xl bg-dark-800 border border-dark-600 p-3 hover:border-neon-purple/30 transition-colors"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={org.logoUrl}
            alt={org.shortName}
            className="h-10 w-10 rounded-full bg-dark-700"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{org.name}</p>
            <p className="text-xs text-gray-400 truncate">{org.description}</p>
          </div>
          <span className="text-xs font-medium text-neon-purple">View</span>
        </a>
      </div>
    </div>
  );
}
