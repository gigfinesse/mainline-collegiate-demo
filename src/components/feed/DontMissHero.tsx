'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { useApp } from '@/lib/context/AppContext';
import { formatTime, getRSVPsForEvent } from '@/lib/data/helpers';
import type { Event, Org, RSVP } from '@/lib/types';

interface DontMissHeroProps {
  events: { event: Event; org: Org }[];
  buildHref: (path: string) => string;
}

export function DontMissHero({ events, buildHref }: DontMissHeroProps) {
  const { dismissEvent, dismissedEventIds, rsvps } = useApp();

  // Filter out dismissed events
  const visibleEvents = events.filter(
    (item) => !dismissedEventIds.has(item.event.id),
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep currentIndex in bounds when events are dismissed
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
        className="mb-4"
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

        {/* Dot indicators */}
        {visibleEvents.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {visibleEvents.map((item, i) => (
              <button
                key={item.event.id}
                type="button"
                onClick={() => {
                  const el = scrollRef.current;
                  if (!el) return;
                  el.scrollTo({ left: i * el.offsetWidth, behavior: 'smooth' });
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  i === currentIndex
                    ? 'bg-white w-4'
                    : 'bg-white/30'
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
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const goingCount = getRSVPsForEvent(event.id, rsvps).filter(
    (r) => r.rsvp.status === 'going',
  ).length;

  const spotsLabel =
    event.capacity
      ? `${goingCount}/${event.capacity} spots`
      : goingCount > 0
        ? `${goingCount} going`
        : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, x: -60 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="w-full flex-shrink-0 snap-center px-4"
    >
      <Link
        href={buildHref(`/events/${event.id}`)}
        className="block relative h-[200px] rounded-2xl overflow-hidden"
      >
        {/* Background image or gradient */}
        <div
          className="absolute inset-0"
          style={{ background: event.posterTheme.background }}
        />
        {event.coverImageUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.coverImageUrl}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 opacity-30"
              style={{ background: event.posterTheme.background }}
            />
          </>
        )}

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

        {/* Dismiss button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDismiss();
          }}
          className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-black/70 active:scale-90"
          aria-label={`Dismiss ${event.title}`}
        >
          <XMarkIcon className="w-4 h-4 text-white/80" />
        </button>

        {/* Spots badge */}
        {spotsLabel && (
          <div className="absolute top-3 left-3 z-20 text-[11px] font-bold text-neon-cyan bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
            {spotsLabel}
          </div>
        )}

        {/* Content at bottom */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-4 space-y-1.5">
          <h3
            className="text-xl font-extrabold leading-tight line-clamp-2"
            style={{ color: event.posterTheme.fontColor }}
          >
            {event.title}
          </h3>

          <p className="text-sm font-semibold text-neon-pink">
            {org.greekLetters || org.shortName}
          </p>

          <div className="flex items-center gap-3 text-xs text-white/70">
            <span>
              {formattedDate} / {formatTime(event.startTime)}
            </span>
            <span className="flex items-center gap-1">
              <MapPinIcon className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
