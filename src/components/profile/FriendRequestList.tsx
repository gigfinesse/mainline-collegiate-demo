'use client';

import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { getUserById } from '@/lib/data/helpers';
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
  const pendingRequests = friendRequests.filter(
    (r) => r.toUserId === currentUserId && r.status === 'pending',
  );

  if (pendingRequests.length === 0) {
    return null;
  }

  return (
    <div className="px-4">
      <h2 className="text-sm font-semibold text-gray-400 mb-3">
        Friend Requests ({pendingRequests.length})
      </h2>
      <div className="space-y-2">
        {pendingRequests.map((request, i) => {
          const fromUser = getUserById(request.fromUserId);
          if (!fromUser) return null;

          return (
            <div
              key={request.id}
              className="flex items-center gap-3 rounded-xl bg-dark-800 border border-dark-600 px-3 py-2.5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fromUser.avatarUrl}
                alt={fromUser.firstName}
                className="w-10 h-10 rounded-full bg-dark-700 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {fromUser.firstName} {fromUser.lastName}
                </p>
                <p className="text-xs text-gray-500">wants to be friends</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => onAccept(request.id)}
                  className="rounded-full bg-emerald-500/15 p-2 text-emerald-400 transition-all duration-200 hover:bg-emerald-500/25 active:scale-90"
                >
                  <CheckIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDecline(request.id)}
                  className="rounded-full bg-dark-700 p-2 text-gray-500 transition-all duration-200 hover:bg-dark-600 hover:text-gray-300 active:scale-90"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
