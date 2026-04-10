'use client';

import { createContext, useContext } from 'react';
import type {
  User,
  RSVP,
  Comment,
  FriendRequest,
  Friendship,
  Event,
  Notification,
} from '@/lib/types';

export interface AppContextValue {
  currentUser: User | null;

  // Mutable data
  rsvps: RSVP[];
  comments: Comment[];
  friendRequests: FriendRequest[];
  friendships: Friendship[];
  events: Event[];
  notifications: Notification[];
  unreadCount: number;
  dismissedEventIds: Set<string>;

  // Actions
  rsvpToEvent: (eventId: string) => void;
  maybeEvent: (eventId: string) => void;
  declineEvent: (eventId: string) => void;
  cancelRSVP: (eventId: string) => void;
  addComment: (eventId: string, text: string) => void;
  addReaction: (commentId: string, emoji: string) => void;
  sendFriendRequest: (toUserId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  declineFriendRequest: (requestId: string) => void;
  createEvent: (event: Event) => void;
  updateEvent: (eventId: string, updates: Partial<Event>) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  dismissEvent: (eventId: string) => void;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
