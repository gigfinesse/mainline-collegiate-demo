'use client';

import { useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { FriendRequestList } from '@/components/profile/FriendRequestList';
import { FriendsList } from '@/components/profile/FriendsList';
import { UserSwitcher } from '@/components/profile/UserSwitcher';

export default function ProfilePage() {
  const {
    currentUser,
    friendRequests,
    friendships,
    acceptFriendRequest,
    declineFriendRequest,
  } = useApp();

  const searchParams = useSearchParams();
  const userParam = searchParams.get('user') || 'marcus';

  if (!currentUser) {
    return (
      <div className="px-4 pt-6">
        <p className="text-gray-400">No user found.</p>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-4 space-y-6">
      {/* Profile header with avatar, name, bio */}
      <ProfileHeader user={currentUser} />

      {/* Friend requests (only if any pending) */}
      <FriendRequestList
        currentUserId={currentUser.id}
        friendRequests={friendRequests}
        onAccept={acceptFriendRequest}
        onDecline={declineFriendRequest}
      />

      {/* Friends list */}
      <FriendsList userId={currentUser.id} friendships={friendships} />

      {/* Divider */}
      <div className="px-4">
        <div className="border-t border-dark-600" />
      </div>

      {/* User switcher */}
      <UserSwitcher currentSlug={userParam} />
    </div>
  );
}
