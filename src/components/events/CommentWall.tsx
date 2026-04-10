'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/context/AppContext';
import { useUserProfile } from '@/lib/context/UserProfileContext';
import { getCommentsForEvent } from '@/lib/data/helpers';
import type { Event } from '@/lib/types';

interface CommentWallProps {
  event: Event;
}

const REACTION_EMOJIS = ['🔥', '❤️', '😂', '🙌', '💀'];

function timeAgo(dateStr: string): string {
  const now = new Date('2026-04-10T12:00:00');
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffDay > 0) return `${diffDay}d ago`;
  if (diffHr > 0) return `${diffHr}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  return 'just now';
}

export function CommentWall({ event }: CommentWallProps) {
  const { currentUser, comments, addComment, addReaction } = useApp();
  const { openProfile } = useUserProfile();
  const [text, setText] = useState('');

  const eventComments = getCommentsForEvent(event.id, comments);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !currentUser) return;
    addComment(event.id, text.trim());
    setText('');
  };

  return (
    <div className="px-5 py-4">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
        Comments ({eventComments.length})
      </h3>

      <div className="space-y-4">
        {eventComments.map(({ comment, user }) => {
          // Aggregate reactions by emoji
          const reactionCounts: Record<string, { count: number; userReacted: boolean }> = {};
          for (const r of comment.reactions) {
            if (!reactionCounts[r.emoji]) {
              reactionCounts[r.emoji] = { count: 0, userReacted: false };
            }
            reactionCounts[r.emoji].count++;
            if (currentUser && r.userId === currentUser.id) {
              reactionCounts[r.emoji].userReacted = true;
            }
          }

          return (
            <div
              key={comment.id}
              className="flex gap-3"
            >
              <button
                type="button"
                onClick={() => openProfile(user.id)}
                className="flex-shrink-0 mt-0.5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatarUrl}
                  alt={user.firstName}
                  className="h-8 w-8 rounded-full bg-dark-700"
                />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <button
                    type="button"
                    onClick={() => openProfile(user.id)}
                    className="text-sm font-semibold text-white hover:text-neon-purple transition-colors"
                  >
                    {user.firstName}
                  </button>
                  <span className="text-[10px] text-gray-500">
                    {timeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mt-0.5">{comment.text}</p>

                {/* Reactions row */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {/* Existing reactions */}
                  {Object.entries(reactionCounts).map(([emoji, { count, userReacted }]) => (
                    <button
                      key={emoji}
                      onClick={() => addReaction(comment.id, emoji)}
                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-colors ${
                        userReacted
                          ? 'bg-neon-purple/20 border border-neon-purple/40'
                          : 'bg-dark-700 border border-dark-600 hover:border-dark-600/80'
                      }`}
                    >
                      <span>{emoji}</span>
                      <span className={userReacted ? 'text-neon-purple' : 'text-gray-400'}>
                        {count}
                      </span>
                    </button>
                  ))}

                  {/* Quick add emoji bar */}
                  <div className="flex items-center gap-0.5 ml-1">
                    {REACTION_EMOJIS.filter((e) => !reactionCounts[e]).map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => addReaction(comment.id, emoji)}
                        className="rounded-full p-1 text-xs opacity-40 hover:opacity-100 hover:bg-dark-700 transition-all"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comment input */}
      {currentUser && (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Drop a comment..."
            className="flex-1 rounded-xl bg-dark-700 border border-dark-600 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/50 transition-colors"
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            disabled={!text.trim()}
            className="rounded-xl px-4 py-2.5 text-sm font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            style={{
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            }}
          >
            Send
          </motion.button>
        </form>
      )}
    </div>
  );
}
