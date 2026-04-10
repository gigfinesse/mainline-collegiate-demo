'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppContext } from './AppContext';
import type {
  RSVP,
  Comment,
  FriendRequest,
  Friendship,
  Event,
  Notification,
} from '@/lib/types';
import { getUserBySlug } from '@/lib/data/helpers';
import {
  rsvps as initialRsvps,
  comments as initialComments,
  friendRequests as initialFriendRequests,
  friendships as initialFriendships,
  events as initialEvents,
  notifications as allNotifications,
} from '@/lib/data';
import { canUserRSVP, getEventById } from '@/lib/data/helpers';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const userSlug = searchParams.get('user') || 'marcus';
  const currentUser = getUserBySlug(userSlug) ?? null;

  const [rsvps, setRsvps] = useState<RSVP[]>(() => [...initialRsvps]);
  const [comments, setComments] = useState<Comment[]>(() => [
    ...initialComments,
  ]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(() => [
    ...initialFriendRequests,
  ]);
  const [friendships, setFriendships] = useState<Friendship[]>(() => [
    ...initialFriendships,
  ]);
  const [events, setEvents] = useState<Event[]>(() => [...initialEvents]);
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    allNotifications.filter((n) => n.userId === currentUser?.id),
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const rsvpToEvent = useCallback(
    (eventId: string) => {
      if (!currentUser) return;

      const event = getEventById(eventId);
      if (!event) return;

      const { allowed, autoApproved } = canUserRSVP(currentUser.id, event);
      if (!allowed) return;

      // Remove any existing RSVP
      setRsvps((prev) => {
        const filtered = prev.filter(
          (r) => !(r.eventId === eventId && r.userId === currentUser.id),
        );
        return [
          ...filtered,
          {
            eventId,
            userId: currentUser.id,
            status: autoApproved ? 'going' : 'requested',
            respondedAt: new Date().toISOString(),
          },
        ];
      });
    },
    [currentUser],
  );

  const cancelRSVP = useCallback(
    (eventId: string) => {
      if (!currentUser) return;
      setRsvps((prev) =>
        prev.filter(
          (r) => !(r.eventId === eventId && r.userId === currentUser.id),
        ),
      );
    },
    [currentUser],
  );

  const addComment = useCallback(
    (eventId: string, text: string) => {
      if (!currentUser) return;
      const newComment: Comment = {
        id: `cmt-${Date.now()}`,
        eventId,
        userId: currentUser.id,
        text,
        reactions: [],
        createdAt: new Date().toISOString(),
      };
      setComments((prev) => [...prev, newComment]);
    },
    [currentUser],
  );

  const addReaction = useCallback(
    (commentId: string, emoji: string) => {
      if (!currentUser) return;
      setComments((prev) =>
        prev.map((c) => {
          if (c.id !== commentId) return c;
          // Toggle reaction
          const existing = c.reactions.find(
            (r) => r.userId === currentUser.id && r.emoji === emoji,
          );
          if (existing) {
            return {
              ...c,
              reactions: c.reactions.filter(
                (r) => !(r.userId === currentUser.id && r.emoji === emoji),
              ),
            };
          }
          return {
            ...c,
            reactions: [...c.reactions, { emoji, userId: currentUser.id }],
          };
        }),
      );
    },
    [currentUser],
  );

  const sendFriendRequest = useCallback(
    (toUserId: string) => {
      if (!currentUser) return;
      const newRequest: FriendRequest = {
        id: `fr-${Date.now()}`,
        fromUserId: currentUser.id,
        toUserId,
        status: 'pending',
      };
      setFriendRequests((prev) => [...prev, newRequest]);
    },
    [currentUser],
  );

  const acceptFriendRequest = useCallback(
    (requestId: string) => {
      if (!currentUser) return;
      setFriendRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: 'accepted' as const } : r,
        ),
      );
      // Add friendship
      const req = friendRequests.find((r) => r.id === requestId);
      if (req) {
        setFriendships((prev) => [
          ...prev,
          {
            userId1: req.fromUserId,
            userId2: req.toUserId,
            source: 'request' as const,
          },
        ]);
      }
    },
    [currentUser, friendRequests],
  );

  const declineFriendRequest = useCallback(
    (requestId: string) => {
      if (!currentUser) return;
      setFriendRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: 'declined' as const } : r,
        ),
      );
    },
    [currentUser],
  );

  const createEvent = useCallback(
    (event: Event) => {
      if (!currentUser) return;
      setEvents((prev) => [...prev, event]);
    },
    [currentUser],
  );

  const updateEvent = useCallback(
    (eventId: string, updates: Partial<Event>) => {
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, ...updates } : e)),
      );
    },
    [],
  );

  const markNotificationRead = useCallback(
    (notificationId: string) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n,
        ),
      );
    },
    [],
  );

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      rsvps,
      comments,
      friendRequests,
      friendships,
      events,
      notifications,
      unreadCount,
      rsvpToEvent,
      cancelRSVP,
      addComment,
      addReaction,
      sendFriendRequest,
      acceptFriendRequest,
      declineFriendRequest,
      createEvent,
      updateEvent,
      markNotificationRead,
      markAllNotificationsRead,
    }),
    [
      currentUser,
      rsvps,
      comments,
      friendRequests,
      friendships,
      events,
      notifications,
      unreadCount,
      rsvpToEvent,
      cancelRSVP,
      addComment,
      addReaction,
      sendFriendRequest,
      acceptFriendRequest,
      declineFriendRequest,
      createEvent,
      updateEvent,
      markNotificationRead,
      markAllNotificationsRead,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
