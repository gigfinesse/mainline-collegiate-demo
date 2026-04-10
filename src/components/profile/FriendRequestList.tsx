'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { getUserById } from '@/lib/data/helpers';
import { useUserProfile } from '@/lib/context/UserProfileContext';
import type { FriendRequest } from '@/lib/types';

interface FriendRequestListProps {
  currentUserId: string;
  friendRequests: FriendRequest[];
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

export function FriendRequestList({
  currentUserId,
  friendRequests,
  onAccept,
  onDecline,
}: FriendRequestListProps) {
  const { openProfile } = useUserProfile();
  const [celebratingId, setCelebratingId] = useState<string | null>(null);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const pendingRequests = friendRequests.filter(
    (r) => r.toUserId === currentUserId && r.status === 'pending' && !dismissedIds.has(r.id),
  );

  if (pendingRequests.length === 0) {
    return null;
  }

  const handleAccept = (requestId: string) => {
    setCelebratingId(requestId);
    onAccept(requestId);
    // After celebration, dismiss the card
    setTimeout(() => {
      setDismissedIds((prev) => new Set(prev).add(requestId));
      setCelebratingId(null);
    }, 800);
  };

  const handleDecline = (requestId: string) => {
    setDismissedIds((prev) => new Set(prev).add(requestId));
    onDecline(requestId);
  };

  return (
    <div className="px-4">
      <h2 className="text-sm font-semibold text-gray-400 mb-3">
        Friend Requests ({pendingRequests.length})
      </h2>
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {pendingRequests.map((request) => {
            const fromUser = getUserById(request.fromUserId);
            if (!fromUser) return null;
            const isCelebrating = celebratingId === request.id;

            return (
              <motion.div
                key={request.id}
                layout
                exit={{ opacity: 0, x: -80, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative flex items-center gap-3 rounded-xl bg-dark-800 border border-dark-600 px-3 py-2.5 overflow-visible"
              >
                {/* Heart burst on accept */}
                <AnimatePresence>
                  {isCelebrating && (
                    <>
                      {['💜', '🤝', '✨'].map((emoji, i) => (
                        <motion.span
                          key={`${emoji}-${i}`}
                          initial={{ opacity: 1, y: 0, scale: 0.5 }}
                          animate={{
                            opacity: 0,
                            y: -50 - i * 15,
                            x: (i - 1) * 25,
                            scale: 1.2,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="absolute text-xl pointer-events-none z-10"
                          style={{ right: '40px', top: '0px' }}
                        >
                          {emoji}
                        </motion.span>
                      ))}
                    </>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => openProfile(fromUser.id)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fromUser.avatarUrl}
                    alt={fromUser.firstName}
                    className="w-10 h-10 rounded-full bg-dark-700 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {fromUser.firstName} {fromUser.lastName}
                    </p>
                    <p className="text-xs text-gray-500">tap to view · wants to be friends</p>
                  </div>
                </button>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <motion.button
                    whileTap={{ scale: 1.2 }}
                    onClick={() => handleAccept(request.id)}
                    className="rounded-full bg-emerald-500/15 p-2 text-emerald-400 transition-all duration-200 hover:bg-emerald-500/25"
                  >
                    <CheckIcon className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleDecline(request.id)}
                    className="rounded-full bg-dark-700 p-2 text-gray-500 transition-all duration-200 hover:bg-dark-600 hover:text-gray-300"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
