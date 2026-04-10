'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useApp } from '@/lib/context/AppContext';
import { getRSVPsForEvent, getFriendsOfUser } from '@/lib/data/helpers';
import type { Event } from '@/lib/types';

interface GuestListProps {
  event: Event;
}

export function GuestList({ event }: GuestListProps) {
  const { currentUser, rsvps } = useApp();
  const [showModal, setShowModal] = useState(false);

  const allRsvps = getRSVPsForEvent(event.id, rsvps);
  const going = allRsvps.filter((r) => r.rsvp.status === 'going');
  const waitlisted = allRsvps.filter((r) => r.rsvp.status === 'waitlisted');
  const requested = allRsvps.filter((r) => r.rsvp.status === 'requested');

  const friendIds = new Set(
    currentUser ? getFriendsOfUser(currentUser.id).map((f) => f.id) : [],
  );

  // Sort going: friends first
  const sortedGoing = [...going].sort((a, b) => {
    const aFriend = friendIds.has(a.user.id) ? 0 : 1;
    const bFriend = friendIds.has(b.user.id) ? 0 : 1;
    return aFriend - bFriend;
  });

  return (
    <>
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Guest List
          </h3>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs font-medium text-neon-purple hover:text-neon-purple/80 transition-colors"
          >
            View All
          </button>
        </div>

        {/* Count badges */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm text-gray-400">
            <span className="font-semibold text-white">{going.length}</span> going
          </span>
          {waitlisted.length > 0 && (
            <span className="text-sm text-gray-400">
              <span className="font-semibold text-yellow-400">{waitlisted.length}</span>{' '}
              waitlisted
            </span>
          )}
          {requested.length > 0 && (
            <span className="text-sm text-gray-400">
              <span className="font-semibold text-neon-orange">{requested.length}</span>{' '}
              requested
            </span>
          )}
        </div>

        {/* Horizontal scroll avatars */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {sortedGoing.map(({ user }) => {
            const isFriend = friendIds.has(user.id);
            return (
              <div key={user.id} className="flex-shrink-0 flex flex-col items-center gap-1">
                <div
                  className={`rounded-full p-[2px] ${
                    isFriend
                      ? 'bg-gradient-to-br from-neon-purple to-neon-pink'
                      : 'bg-dark-600'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatarUrl}
                    alt={user.firstName}
                    className="h-10 w-10 rounded-full bg-dark-700"
                  />
                </div>
                <span className="text-[10px] text-gray-400 max-w-[48px] truncate">
                  {user.firstName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Guest List Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center"
            onClick={() => setShowModal(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Bottom sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-md rounded-t-2xl bg-dark-800 border-t border-dark-600 max-h-[70vh] overflow-hidden"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-dark-600" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3">
                <h3 className="text-lg font-bold text-white">Guest List</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-full p-1.5 hover:bg-dark-600 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {/* Lists */}
              <div className="overflow-y-auto max-h-[55vh] px-5 pb-6 space-y-4">
                {/* Going */}
                {sortedGoing.length > 0 && (
                  <GuestGroup
                    label="Going"
                    count={sortedGoing.length}
                    color="text-emerald-400"
                    guests={sortedGoing}
                    friendIds={friendIds}
                  />
                )}

                {/* Waitlisted */}
                {waitlisted.length > 0 && (
                  <GuestGroup
                    label="Waitlisted"
                    count={waitlisted.length}
                    color="text-yellow-400"
                    guests={waitlisted}
                    friendIds={friendIds}
                  />
                )}

                {/* Requested */}
                {requested.length > 0 && (
                  <GuestGroup
                    label="Requested"
                    count={requested.length}
                    color="text-neon-orange"
                    guests={requested}
                    friendIds={friendIds}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function GuestGroup({
  label,
  count,
  color,
  guests,
  friendIds,
}: {
  label: string;
  count: number;
  color: string;
  guests: { user: { id: string; firstName: string; lastName: string; avatarUrl: string } }[];
  friendIds: Set<string>;
}) {
  return (
    <div>
      <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${color}`}>
        {label} ({count})
      </p>
      <div className="space-y-2">
        {guests.map(({ user }) => {
          const isFriend = friendIds.has(user.id);
          return (
            <div key={user.id} className="flex items-center gap-3">
              <div
                className={`rounded-full p-[2px] ${
                  isFriend
                    ? 'bg-gradient-to-br from-neon-purple to-neon-pink'
                    : 'bg-transparent'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatarUrl}
                  alt={user.firstName}
                  className="h-8 w-8 rounded-full bg-dark-700"
                />
              </div>
              <span className="text-sm text-white">
                {user.firstName} {user.lastName}
              </span>
              {isFriend && (
                <span className="text-[10px] font-semibold text-neon-purple bg-neon-purple/10 rounded-full px-2 py-0.5">
                  Friend
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
