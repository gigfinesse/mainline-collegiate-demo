'use client';

import { getUserById } from '@/lib/data/helpers';
import { useUserProfile } from '@/lib/context/UserProfileContext';

interface UserAvatarProps {
  userId: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export function UserAvatar({ userId, size = 'md', showName = false, className = '' }: UserAvatarProps) {
  const { openProfile } = useUserProfile();
  const user = getUserById(userId);

  if (!user) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        openProfile(userId);
      }}
      className={`flex items-center gap-2 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={user.avatarUrl}
        alt={user.firstName}
        className={`${sizeMap[size]} rounded-full bg-dark-700 flex-shrink-0`}
      />
      {showName && (
        <span className="text-sm font-semibold text-white">{user.firstName}</span>
      )}
    </button>
  );
}
