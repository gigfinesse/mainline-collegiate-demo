'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useApp } from '@/lib/context/AppContext';
import { formatTime, getRSVPsForEvent, getMembersOfOrg, getUserById } from '@/lib/data/helpers';
import type { Event, Org, RSVP, User } from '@/lib/types';

interface DontMissHeroProps {
  events: { event: Event; org: Org }[];
  buildHref: (path: string) => string;
}

export function DontMissHero({ events, buildHref }: DontMissHeroProps) {
  const { dismissEvent, dismissedEventIds, rsvps } = useApp();

  const visibleEvents = events.filter(
    (item) => !dismissedEventIds.has(item.event.id),
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex >= visibleEvents.length && visibleEvents.length > 0) {
      setCurrentIndex(visibleEvents.length - 1);
    }
  }, [visibleEvents.length, currentIndex]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.offsetWidth;
    const index = Math.round(scrollLeft / cardWidth);
    setCurrentIndex(index);
  }, []);

  if (visibleEvents.length === 0) return null;

  return (
    <AnimatePresence mode="sync">
      <motion.section
        key="dont-miss-hero"
        initial={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="mb-2"
      >
        <h2 className="px-4 mb-3 text-base font-bold text-white">
          don&apos;t miss
        </h2>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ scrollBehavior: 'smooth' }}
        >
          <AnimatePresence mode="popLayout">
            {visibleEvents.map(({ event, org }) => (
              <HeroCard
                key={event.id}
                event={event}
                org={org}
                buildHref={buildHref}
                onDismiss={() => dismissEvent(event.id)}
                rsvps={rsvps}
              />
            ))}
          </AnimatePresence>
        </div>

        {visibleEvents.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-2.5">
            {visibleEvents.map((item, i) => (
              <button
                key={item.event.id}
                type="button"
                onClick={() => {
                  const el = scrollRef.current;
                  if (!el) return;
                  el.scrollTo({ left: i * el.offsetWidth, behavior: 'smooth' });
                }}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === currentIndex
                    ? 'bg-neon-purple w-5'
                    : 'bg-white/20 w-1.5'
                }`}
                aria-label={`Go to card ${i + 1}`}
              />
            ))}
          </div>
        )}
      </motion.section>
    </AnimatePresence>
  );
}

function HeroCard({
  event,
  org,
  buildHref,
  onDismiss,
  rsvps,
}: {
  event: Event;
  org: Org;
  buildHref: (path: string) => string;
  onDismiss: () => void;
  rsvps: RSVP[];
}) {
  const eventDate = new Date(event.date);
  const now = new Date('2026-04-10T00:00:00');
  const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  // Get org members who are going
  const eventRsvps = getRSVPsForEvent(event.id, rsvps);
  const goingRsvps = eventRsvps.filter((r) => r.rsvp.status === 'going');
  const orgMembers = getMembersOfOrg(org.id);
  const orgMemberIds = new Set(orgMembers.map((m) => m.user.id));

  // Members of this org who are going
  const membersGoing: User[] = goingRsvps
    .filter((r) => orgMemberIds.has(r.user.id))
    .map((r) => r.user);

  const goingCount = goingRsvps.length;

  // Urgency label
  let urgencyLabel = '';
  if (daysUntil <= 1) urgencyLabel = 'tonight 🔥';
  else if (daysUntil <= 3) urgencyLabel = `in ${daysUntil} days`;
  else if (event.capacity && goingCount / event.capacity > 0.7) urgencyLabel = 'filling up fast 🔥';

  // Nudge text
  const orgLabel = org.greekLetters || org.shortName;
  const isGreek = org.type === 'fraternity' || org.type === 'sorority';
  const memberWord = isGreek
    ? org.type === 'fraternity' ? 'brothers' : 'sisters'
    : 'members';

  let nudgeText = `${orgLabel} wants you there`;
  if (membersGoing.length >= 3) {
    nudgeText = `${membersGoing.length} ${memberWord} already going`;
  } else if (membersGoing.length > 0) {
    const names = membersGoing.slice(0, 2).map((u) => u.firstName).join(' & ');
    nudgeText = `${names} ${membersGoing.length === 1 ? 'is' : 'are'} going`;
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, x: -60 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="w-full flex-shrink-0 snap-center px-4"
    >
      {/* Glowing border wrapper */}
      <Link
        href={buildHref(`/events/${event.id}`)}
        className="block rounded-2xl p-[1.5px] bg-gradient-to-r from-neon-purple via-neon-pink to-neon-orange shadow-[0_0_20px_rgba(168,85,247,0.25)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-shadow duration-300"
      >
        <div className="rounded-2xl overflow-hidden bg-dark-800">
          {/* Compact image section */}
          <div
            className="relative h-28 overflow-hidden"
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
            <div className="absolute inset-0 bg-gradient-to-t from-dark-800 via-black/30 to-transparent" />

            {/* Dismiss */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDismiss();
              }}
              className="absolute top-2.5 right-2.5 z-20 w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 active:scale-90"
              aria-label={`Dismiss ${event.title}`}
            >
              <XMarkIcon className="w-3.5 h-3.5 text-white/80" />
            </button>

            {/* Title on image */}
            <div className="absolute bottom-2.5 left-3.5 right-12 z-10">
              <h3 className="text-lg font-extrabold text-white leading-tight line-clamp-1">
                {event.title}
              </h3>
            </div>
          </div>

          {/* Info section */}
          <div className="px-3.5 py-3 space-y-2.5">
            {/* Org + date + urgency row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={org.logoUrl}
                  alt={org.shortName}
                  className="w-6 h-6 rounded-full bg-dark-700"
                />
                <span className="text-sm font-bold text-neon-purple">
                  {orgLabel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {urgencyLabel && (
                  <span className="text-[10px] font-bold text-neon-orange bg-neon-orange/15 px-2 py-0.5 rounded-full">
                    {urgencyLabel}
                  </span>
                )}
                {event.capacity && (
                  <span className="text-[10px] font-semibold text-gray-400">
                    {goingCount}/{event.capacity}
                  </span>
                )}
              </div>
            </div>

            {/* Date + location */}
            <div className="text-xs text-gray-400">
              {formattedDate} / {formatTime(event.startTime)} · {event.location}
            </div>

            {/* Nudge: org members going */}
            <div className="flex items-center gap-2">
              {membersGoing.length > 0 && (
                <div className="flex -space-x-1.5">
                  {membersGoing.slice(0, 4).map((user) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={user.id}
                      src={user.avatarUrl}
                      alt={user.firstName}
                      className="w-5 h-5 rounded-full border border-dark-800 bg-dark-700"
                    />
                  ))}
                </div>
              )}
              <span className="text-xs font-medium text-gray-300">
                {nudgeText}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
