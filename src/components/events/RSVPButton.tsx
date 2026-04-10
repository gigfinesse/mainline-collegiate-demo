'use client';

import { motion } from 'framer-motion';
import { useApp } from '@/lib/context/AppContext';
import { canUserRSVP, getUserRSVPForEvent } from '@/lib/data/helpers';
import type { Event } from '@/lib/types';

interface RSVPButtonProps {
  event: Event;
}

export function RSVPButton({ event }: RSVPButtonProps) {
  const { currentUser, rsvps, rsvpToEvent, cancelRSVP } = useApp();

  if (!currentUser) return null;

  const status = getUserRSVPForEvent(currentUser.id, event.id, rsvps);
  const { allowed, autoApproved } = canUserRSVP(currentUser.id, event);

  // Already RSVP'd states
  if (status === 'going') {
    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => cancelRSVP(event.id)}
        className="w-full rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-6 py-3.5 text-sm font-bold text-emerald-400 transition-colors hover:bg-emerald-500/30 active:bg-emerald-500/10"
      >
        You&apos;re Going &#10003;
      </motion.button>
    );
  }

  if (status === 'requested') {
    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => cancelRSVP(event.id)}
        className="w-full rounded-xl bg-neon-orange/20 border border-neon-orange/40 px-6 py-3.5 text-sm font-bold text-neon-orange transition-colors hover:bg-neon-orange/30"
      >
        Requested &middot; Tap to Cancel
      </motion.button>
    );
  }

  if (status === 'waitlisted') {
    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="w-full rounded-xl bg-yellow-500/20 border border-yellow-500/40 px-6 py-3.5 text-sm font-bold text-yellow-400 cursor-default"
      >
        Waitlisted
      </motion.button>
    );
  }

  // Not RSVP'd yet
  if (!allowed) {
    return (
      <button
        disabled
        className="w-full rounded-xl bg-dark-700 border border-dark-600 px-6 py-3.5 text-sm font-bold text-gray-500 cursor-not-allowed"
      >
        Members Only
      </button>
    );
  }

  if (autoApproved) {
    return (
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
    );
  }

  // Allowed but not auto-approved (needs request)
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => rsvpToEvent(event.id)}
      className="w-full rounded-xl border-2 border-neon-purple px-6 py-3.5 text-sm font-bold text-neon-purple transition-colors hover:bg-neon-purple/10"
    >
      Request to Join
    </motion.button>
  );
}
