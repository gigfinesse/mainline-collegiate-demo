'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useUserProfile } from '@/lib/context/UserProfileContext';
import { useApp } from '@/lib/context/AppContext';
import { getUserById, getOrgsForUser, getEventById } from '@/lib/data/helpers';
import type { OrgRole } from '@/lib/types';

function OrgRoleBadge({ role }: { role: OrgRole }) {
  const config: Record<OrgRole, { bg: string; text: string; label: string }> = {
    exec: { bg: 'bg-neon-purple/20', text: 'text-neon-purple', label: 'Exec' },
    member: { bg: 'bg-neon-cyan/20', text: 'text-neon-cyan', label: 'Member' },
    friend: { bg: 'bg-neon-pink/20', text: 'text-neon-pink', label: 'FoH' },
  };
  const c = config[role];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}
    >
      {c.label}
    </span>
  );
}

export function UserProfileModal() {
  const { selectedUserId, closeProfile } = useUserProfile();
  const { currentUser, rsvps, friendships, friendRequests, sendFriendRequest } = useApp();

  const user = selectedUserId ? getUserById(selectedUserId) : null;

  // Determine friend status
  const isFriend = !!(
    currentUser &&
    user &&
    friendships.some(
      (f) =>
        (f.userId1 === currentUser.id && f.userId2 === user.id) ||
        (f.userId1 === user.id && f.userId2 === currentUser.id),
    )
  );

  const pendingRequest = !!(
    currentUser &&
    user &&
    friendRequests.some(
      (fr) =>
        fr.status === 'pending' &&
        ((fr.fromUserId === currentUser.id && fr.toUserId === user.id) ||
          (fr.fromUserId === user.id && fr.toUserId === currentUser.id)),
    )
  );

  // Get shared events (both users RSVP'd "going")
  const sharedEvents =
    currentUser && user
      ? (() => {
          const currentUserGoingIds = new Set(
            rsvps
              .filter((r) => r.userId === currentUser.id && r.status === 'going')
              .map((r) => r.eventId),
          );
          const targetUserGoingIds = rsvps
            .filter((r) => r.userId === user.id && r.status === 'going')
            .map((r) => r.eventId);
          return targetUserGoingIds
            .filter((eid) => currentUserGoingIds.has(eid))
            .map((eid) => getEventById(eid))
            .filter((e): e is NonNullable<typeof e> => e !== undefined);
        })()
      : [];

  // User's orgs
  const userOrgs = user ? getOrgsForUser(user.id) : [];

  const isSelf = currentUser?.id === user?.id;

  return (
    <AnimatePresence>
      {user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-end justify-center"
          onClick={closeProfile}
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
            className="relative z-10 w-full max-w-md rounded-t-2xl bg-dark-800 border-t border-dark-600 max-h-[80vh] overflow-hidden"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-dark-600" />
            </div>

            {/* Close button */}
            <div className="flex justify-end px-4 pb-1">
              <button
                onClick={closeProfile}
                className="rounded-full p-1.5 hover:bg-dark-600 transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[68vh] px-5 pb-8">
              {/* Profile header */}
              <div className="flex flex-col items-center text-center mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatarUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-20 h-20 rounded-full bg-dark-700 border-2 border-dark-600 mb-3"
                />
                <h2 className="text-xl font-bold text-white">
                  {user.firstName} {user.lastName}
                </h2>
                {user.bio && (
                  <p className="mt-1 text-sm text-gray-400 max-w-[280px]">
                    {user.bio}
                  </p>
                )}

                {/* Friend status / action */}
                {!isSelf && currentUser && (
                  <div className="mt-3">
                    {isFriend ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-4 py-1.5 text-sm font-semibold text-emerald-400">
                        Friends &#10003;
                      </span>
                    ) : pendingRequest ? (
                      <span className="inline-flex items-center rounded-full bg-yellow-500/15 px-4 py-1.5 text-sm font-semibold text-yellow-400">
                        Requested
                      </span>
                    ) : (
                      <button
                        onClick={() => sendFriendRequest(user.id)}
                        className="rounded-full bg-gradient-to-r from-neon-purple to-neon-pink px-5 py-1.5 text-sm font-bold text-white transition-all duration-200 hover:shadow-[0_0_16px_rgba(168,85,247,0.3)] active:scale-95"
                      >
                        Add Friend
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Orgs */}
              {userOrgs.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Organizations
                  </h3>
                  <div className="space-y-1.5">
                    {userOrgs.map(({ org, role }) => (
                      <div
                        key={org.id}
                        className="flex items-center gap-3 rounded-xl bg-dark-900 border border-dark-600 px-3 py-2.5"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={org.logoUrl}
                          alt={org.shortName}
                          className="w-8 h-8 rounded-full bg-dark-700 flex-shrink-0"
                        />
                        <span className="flex-1 text-sm font-medium text-white truncate">
                          {org.name}
                        </span>
                        <OrgRoleBadge role={role} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events Together */}
              {!isSelf && sharedEvents.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Events Together ({sharedEvents.length})
                  </h3>
                  <div className="space-y-1.5">
                    {sharedEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-3 rounded-xl bg-dark-900 border border-dark-600 px-3 py-2.5"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex-shrink-0 relative overflow-hidden"
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
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {event.title}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isSelf && sharedEvents.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No shared events yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
