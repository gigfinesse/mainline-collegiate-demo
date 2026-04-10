'use client';

import { getFriendsOfUser } from '@/lib/data/helpers';
import { useUserProfile } from '@/lib/context/UserProfileContext';
import type { Friendship } from '@/lib/types';

interface FriendsListProps {
  userId: string;
  friendships: Friendship[];
}

export function FriendsList({ userId }: FriendsListProps) {
  const friends = getFriendsOfUser(userId);
  const { openProfile } = useUserProfile();

  if (friends.length === 0) {
    return null;
  }

  return (
    <div className="px-4">
      <h2 className="text-sm font-semibold text-gray-400 mb-3">
        Friends ({friends.length})
      </h2>

      {/* Horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {friends.map((friend) => (
          <button
            key={friend.id}
            type="button"
            onClick={() => openProfile(friend.id)}
            className="flex flex-col items-center flex-shrink-0 w-16"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={friend.avatarUrl}
              alt={friend.firstName}
              className="w-12 h-12 rounded-full bg-dark-700 border-2 border-dark-600"
            />
            <p className="mt-1.5 text-[11px] text-gray-400 text-center truncate w-full">
              {friend.firstName}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
