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
  const { currentUser, rsvps, rsvpToEvent, cancelRSVP } = useApp();
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState<string[]>([]);
  const [scope, animate] = useAnimate();
  const prevStatusRef = useRef<RSVPStatus | undefined>(undefined);

  if (!currentUser) return null;

  const status = getUserRSVPForEvent(currentUser.id, event.id, rsvps);
  const { allowed, autoApproved } = canUserRSVP(currentUser.id, event);

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
      } else if (status === 'none') {
        // Shrink on cancel
        if (scope.current) {
          animate(scope.current, { scale: [1, 0.92, 1] }, { duration: 0.25, ease: 'easeOut' });
        }
      }
    }
    prevStatusRef.current = status;
  }, [status, animate, scope]);

  // Already RSVP'd states
  if (status === 'going') {
    return (
      <div ref={scope} className="relative overflow-visible">
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
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => cancelRSVP(event.id)}
          className="w-full rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-6 py-3.5 text-sm font-bold text-emerald-400 transition-colors hover:bg-emerald-500/30 active:bg-emerald-500/10"
        >
          You&apos;re Going &#10003;
        </motion.button>
      </div>
    );
  }

  if (status === 'requested') {
    return (
      <div ref={scope} className="relative overflow-visible">
        <AnimatePresence>
          {showCelebration && (
            <>
              {celebrationEmojis.map((emoji, i) => (
                <motion.span
                  key={`${emoji}-${i}`}
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -60 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="absolute text-2xl pointer-events-none z-10 left-1/2 -translate-x-1/2"
                  style={{ top: 0 }}
                >
                  {emoji}
                </motion.span>
              ))}
            </>
          )}
        </AnimatePresence>
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

  if (status === 'waitlisted') {
    return (
      <div ref={scope}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full rounded-xl bg-yellow-500/20 border border-yellow-500/40 px-6 py-3.5 text-sm font-bold text-yellow-400 cursor-default"
        >
          Waitlisted
        </motion.button>
      </div>
    );
  }

  // Not RSVP'd yet
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

  if (autoApproved) {
    return (
      <div ref={scope} className="relative overflow-visible">
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => rsvpToEvent(event.id)}
          className="w-full rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-neon-purple/25 transition-shadow hover:shadow-neon-purple/40"
          style={{
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
          }}
        >
          I&apos;m Going
        </motion.button>
      </div>
    );
  }

  // Allowed but not auto-approved (needs request)
  return (
    <div ref={scope} className="relative overflow-visible">
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => rsvpToEvent(event.id)}
        className="w-full rounded-xl border-2 border-neon-purple px-6 py-3.5 text-sm font-bold text-neon-purple transition-colors hover:bg-neon-purple/10"
      >
        Request to Join
      </motion.button>
    </div>
  );
}
