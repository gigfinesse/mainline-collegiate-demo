'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { getUserById } from '@/lib/data/helpers';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function relativeTime(iso: string): string {
  const now = new Date('2026-04-10T12:00:00');
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return 'yesterday';
  return `${diffDay}d ago`;
}

export default function NotificationsPage() {
  const {
    currentUser,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadCount,
  } = useApp();
  const searchParams = useSearchParams();
  const userParam = searchParams.get('user');

  const buildHref = (path: string) =>
    userParam ? `${path}?user=${userParam}` : path;

  if (!currentUser) {
    return (
      <div className="px-4 pt-6">
        <p className="text-gray-400">No user found.</p>
      </div>
    );
  }

  // Sort newest first
  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={buildHref('/')} className="p-1 -ml-1">
            <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
          </Link>
          <h1 className="text-lg font-bold text-white">notifications</h1>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="text-xs font-semibold text-neon-purple hover:text-neon-pink transition-colors"
          >
            mark all as read
          </button>
        )}
      </div>

      {/* Notification list */}
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <p className="text-2xl mb-2">🔔</p>
          <p className="text-gray-400 font-medium">no notifications yet</p>
          <p className="text-xs text-gray-600 mt-1">
            we&apos;ll let you know when something&apos;s happening
          </p>
        </div>
      ) : (
        <div className="space-y-1 px-4">
          {sorted.map((notif) => {
            const fromUser = notif.fromUserId
              ? getUserById(notif.fromUserId)
              : null;

            // Determine link destination
            const href = notif.eventId
              ? buildHref(`/events/${notif.eventId}`)
              : notif.orgId
                ? buildHref(`/orgs/${notif.orgId}`)
                : null;

            const content = (
              <div
                className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                  !notif.read
                    ? 'bg-dark-800 border-l-2 border-neon-purple'
                    : 'bg-dark-800/50'
                }`}
              >
                {/* Left: emoji or avatar */}
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  {fromUser ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={fromUser.avatarUrl}
                      alt={fromUser.firstName}
                      className="w-10 h-10 rounded-full bg-dark-700"
                    />
                  ) : (
                    <span className="text-2xl">{notif.emoji}</span>
                  )}
                </div>

                {/* Middle: content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm leading-snug">
                      {fromUser && (
                        <span className="text-lg mr-1.5">{notif.emoji}</span>
                      )}
                      <span className="font-bold text-white">
                        {notif.title}
                      </span>
                    </p>
                    {!notif.read && (
                      <span className="flex-shrink-0 w-2 h-2 rounded-full bg-neon-purple mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                    {notif.body}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-1">
                    {relativeTime(notif.createdAt)}
                  </p>
                </div>
              </div>
            );

            if (href) {
              return (
                <Link
                  key={notif.id}
                  href={href}
                  onClick={() => markNotificationRead(notif.id)}
                  className="block"
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={notif.id}
                type="button"
                onClick={() => markNotificationRead(notif.id)}
                className="block w-full text-left"
              >
                {content}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
