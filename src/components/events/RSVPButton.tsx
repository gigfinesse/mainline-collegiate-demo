'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimate } from 'framer-motion';
import { useApp } from '@/lib/context/AppContext';
import { canUserRSVP, getUserRSVPForEvent } from '@/lib/data/helpers';
import type { Event } from '@/lib/types';
import type { RSVPStatus } from '@/lib/types';

interface RSVPButtonProps {
  event: Event;
}

export function RSVPButton({ event }: RSVPButtonProps) {
  const { currentUser, rsvps, rsvpToEvent, maybeEvent, declineEvent, cancelRSVP } = useApp();
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState<string[]>([]);
  const [scope, animate] = useAnimate();
  const prevStatusRef = useRef<RSVPStatus | undefined>(undefined);

  if (!currentUser) return null;

  const status = getUserRSVPForEvent(currentUser.id, event.id, rsvps);
  const { allowed } = canUserRSVP(currentUser.id, event);

  // Track status changes for animations
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    if (prevStatus !== undefined && prevStatus !== status) {
      if (status === 'going') {
        // Celebratory bounce + emoji burst
        setCelebrationEmojis(['🎉', '✨', '🔥', '🙌', '💜']);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 1500);
        if (scope.current) {
          animate(scope.current, { scale: [1, 1.08, 1] }, { duration: 0.4, ease: 'easeOut' });
        }
      } else if (status === 'requested') {
        // Pulse + crossing fingers emoji
        setCelebrationEmojis(['🤞']);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 1200);
        if (scope.current) {
          animate(scope.current, { scale: [1, 1.05, 0.98, 1] }, { duration: 0.35, ease: 'easeOut' });
        }
      } else if (status === 'maybe') {
        // Thinking emoji float
        setCelebrationEmojis(['🤔']);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 1200);
        if (scope.current) {
          animate(scope.current, { scale: [1, 1.04, 0.98, 1] }, { duration: 0.3, ease: 'easeOut' });
        }
      } else if (status === 'declined') {
        // Simple fade shrink
        if (scope.current) {
          animate(scope.current, { scale: [1, 0.95, 1] }, { duration: 0.25, ease: 'easeOut' });
        }
      } else if (status === 'none') {
        // Shrink on cancel
        if (scope.current) {
          animate(scope.current, { scale: [1, 0.92, 1] }, { duration: 0.25, ease: 'easeOut' });
        }
      }
    }
    prevStatusRef.current = status;
  }, [status, animate, scope]);

  // Celebration emoji overlay
  const celebrationOverlay = (
    <AnimatePresence>
      {showCelebration && (
        <>
          {celebrationEmojis.map((emoji, i) => (
            <motion.span
              key={`${emoji}-${i}`}
              initial={{ opacity: 1, y: 0, x: (i - Math.floor(celebrationEmojis.length / 2)) * 30 }}
              animate={{ opacity: 0, y: -80 - Math.random() * 40 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 + Math.random() * 0.5, ease: 'easeOut' }}
              className="absolute text-2xl pointer-events-none z-10"
              style={{ left: `${20 + i * 15}%`, top: 0 }}
            >
              {emoji}
            </motion.span>
          ))}
        </>
      )}
    </AnimatePresence>
  );

  // ── Status: Going ──
  if (status === 'going') {
    return (
      <div ref={scope} className="relative overflow-visible">
        {celebrationOverlay}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-6 py-3.5 text-sm font-bold text-emerald-400 cursor-default"
        >
          You&apos;re Going &#10003;
        </motion.button>
        <div className="flex items-center justify-center gap-3 mt-2">
          <button
            onClick={() => maybeEvent(event.id)}
            className="text-xs font-medium text-neon-cyan hover:text-neon-cyan/80 transition-colors"
          >
            change to maybe
          </button>
          <span className="text-gray-600">|</span>
          <button
            onClick={() => declineEvent(event.id)}
            className="text-xs font-medium text-gray-500 hover:text-gray-400 transition-colors"
          >
            can&apos;t go
          </button>
        </div>
      </div>
    );
  }

  // ── Status: Maybe ──
  if (status === 'maybe') {
    return (
      <div ref={scope} className="relative overflow-visible">
        {celebrationOverlay}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full rounded-xl bg-neon-cyan/10 border border-neon-cyan/40 px-6 py-3.5 text-sm font-bold text-neon-cyan cursor-default"
        >
          Maybe 🤔
        </motion.button>
        <div className="flex items-center justify-center gap-3 mt-2">
          <button
            onClick={() => rsvpToEvent(event.id)}
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            I&apos;m going!
          </button>
          <span className="text-gray-600">|</span>
          <button
            onClick={() => declineEvent(event.id)}
            className="text-xs font-medium text-gray-500 hover:text-gray-400 transition-colors"
          >
            can&apos;t go
          </button>
        </div>
      </div>
    );
  }

  // ── Status: Declined ──
  if (status === 'declined') {
    return (
      <div ref={scope} className="relative overflow-visible">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full rounded-xl bg-dark-700 border border-dark-600 px-6 py-3.5 text-sm font-bold text-gray-500 cursor-default"
        >
          Can&apos;t Go 😔
        </motion.button>
        <div className="flex items-center justify-center gap-3 mt-2">
          <span className="text-xs text-gray-600">changed your mind?</span>
          <button
            onClick={() => rsvpToEvent(event.id)}
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            going
          </button>
          <span className="text-gray-600">|</span>
          <button
            onClick={() => maybeEvent(event.id)}
            className="text-xs font-medium text-neon-cyan hover:text-neon-cyan/80 transition-colors"
          >
            maybe
          </button>
        </div>
      </div>
    );
  }

  // ── Status: Requested ──
  if (status === 'requested') {
    return (
      <div ref={scope} className="relative overflow-visible">
        {celebrationOverlay}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => cancelRSVP(event.id)}
          className="w-full rounded-xl bg-neon-orange/20 border border-neon-orange/40 px-6 py-3.5 text-sm font-bold text-neon-orange transition-colors hover:bg-neon-orange/30"
        >
          Requested &middot; Tap to Cancel
        </motion.button>
      </div>
    );
  }

  // ── Status: Waitlisted ──
  if (status === 'waitlisted') {
    return (
      <div ref={scope}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => cancelRSVP(event.id)}
          className="w-full rounded-xl bg-yellow-500/20 border border-yellow-500/40 px-6 py-3.5 text-sm font-bold text-yellow-400 transition-colors hover:bg-yellow-500/30"
        >
          Waitlisted &middot; Tap to Cancel
        </motion.button>
      </div>
    );
  }

  // ── Not RSVP'd yet ──
  if (!allowed) {
    return (
      <div ref={scope}>
        <button
          disabled
          className="w-full rounded-xl bg-dark-700 border border-dark-600 px-6 py-3.5 text-sm font-bold text-gray-500 cursor-not-allowed"
        >
          Members Only
        </button>
      </div>
    );
  }

  // ── Three-button initial state ──
  return (
    <div ref={scope} className="relative overflow-visible">
      <div className="flex gap-2">
        {/* I'm Going - primary action ~50% */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => rsvpToEvent(event.id)}
          className="flex-[2] rounded-xl px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-neon-purple/25 transition-shadow hover:shadow-neon-purple/40"
          style={{
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
          }}
        >
          I&apos;m Going
        </motion.button>

        {/* Maybe - outlined ~25% */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => maybeEvent(event.id)}
          className="flex-1 rounded-xl border border-neon-cyan/50 px-3 py-3.5 text-sm font-semibold text-neon-cyan transition-colors hover:bg-neon-cyan/10"
        >
          Maybe
        </motion.button>

        {/* Can't Go - muted ~25% */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => declineEvent(event.id)}
          className="flex-1 rounded-xl border border-dark-600 px-3 py-3.5 text-xs font-medium text-gray-500 transition-colors hover:bg-dark-700 hover:text-gray-400"
        >
          Can&apos;t Go
        </motion.button>
      </div>
    </div>
  );
}
