'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import {
  getUpcomingEventsForUser,
  getPastEventsForUser,
} from '@/lib/data/helpers';
import { EventListCard } from '@/components/events/EventListCard';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

type Tab = 'upcoming' | 'past';

export default function MyEventsPage() {
  const { currentUser, rsvps } = useApp();
  const searchParams = useSearchParams();
  const userParam = searchParams.get('user');
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');

  const buildHref = (path: string) =>
    userParam ? `${path}?user=${userParam}` : path;

  if (!currentUser) {
    return (
      <div className="px-4 pt-6">
        <p className="text-gray-400">No user found.</p>
      </div>
    );
  }

  const upcomingEvents = getUpcomingEventsForUser(currentUser.id, rsvps);
  const pastEvents = getPastEventsForUser(currentUser.id, rsvps);
  const displayedEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <div className="px-4 pt-6 pb-4">
      {/* Header */}
      <h1 className="text-2xl font-extrabold text-white tracking-tight mb-4">
        My Events
      </h1>

      {/* Pill toggle tabs */}
      <div className="flex gap-1 bg-dark-800 rounded-xl p-1 mb-5 border border-dark-600">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all duration-200 ${
            activeTab === 'upcoming'
              ? 'bg-neon-purple text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Upcoming
          {upcomingEvents.length > 0 && (
            <span
              className={`ml-1.5 text-xs ${
                activeTab === 'upcoming'
                  ? 'text-white/80'
                  : 'text-gray-500'
              }`}
            >
              ({upcomingEvents.length})
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all duration-200 ${
            activeTab === 'past'
              ? 'bg-neon-purple text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Past
          {pastEvents.length > 0 && (
            <span
              className={`ml-1.5 text-xs ${
                activeTab === 'past'
                  ? 'text-white/80'
                  : 'text-gray-500'
              }`}
            >
              ({pastEvents.length})
            </span>
          )}
        </button>
      </div>

      {/* Event list */}
      {displayedEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CalendarDaysIcon className="w-10 h-10 text-neon-purple/30 mb-3" />
          <p className="text-gray-400 font-medium">
            {activeTab === 'upcoming'
              ? 'nothing on the calendar... yet 📅'
              : 'no memories here yet 🫠'}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {activeTab === 'upcoming'
              ? 'check the home feed and find your next move'
              : 'events you hit up will show up here'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {displayedEvents.map((event) => (
            <EventListCard
              key={event.id}
              event={event}
              currentUserId={currentUser.id}
              rsvps={rsvps}
              isHosting={event.createdByUserId === currentUser.id}
              isPast={activeTab === 'past'}
              buildHref={buildHref}
            />
          ))}
        </div>
      )}
    </div>
  );
}
