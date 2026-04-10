'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShareIcon, XMarkIcon, LinkIcon } from '@heroicons/react/24/outline';

interface ShareButtonProps {
  eventTitle: string;
}

const shareOptions = [
  { label: 'Copy Link', icon: LinkIcon, key: 'copy' },
  { label: 'iMessage', icon: null, emoji: '💬', key: 'imessage' },
  { label: 'Snapchat', icon: null, emoji: '👻', key: 'snapchat' },
  { label: 'Instagram', icon: null, emoji: '📸', key: 'instagram' },
];

export function ShareButton({ eventTitle }: ShareButtonProps) {
  const [showSheet, setShowSheet] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleShare = async (key: string) => {
    if (key === 'copy') {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied!');
      } catch {
        showToast('Link copied!');
      }
    } else {
      const platform = shareOptions.find((o) => o.key === key)?.label || key;
      showToast(`Shared via ${platform}!`);
    }
    setShowSheet(false);
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <>
      {/* Share FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowSheet(true)}
        className="flex items-center gap-2 rounded-xl bg-dark-700 border border-dark-600 px-4 py-2.5 text-sm font-semibold text-white hover:border-neon-purple/40 transition-colors"
      >
        <ShareIcon className="h-4 w-4" />
        Share
      </motion.button>

      {/* Bottom sheet */}
      <AnimatePresence>
        {showSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center"
            onClick={() => setShowSheet(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-md rounded-t-2xl bg-dark-800 border-t border-dark-600"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-dark-600" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">Share Event</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{eventTitle}</p>
                </div>
                <button
                  onClick={() => setShowSheet(false)}
                  className="rounded-full p-1.5 hover:bg-dark-600 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {/* Share options */}
              <div className="grid grid-cols-4 gap-3 px-5 pb-8 pt-2">
                {shareOptions.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => handleShare(option.key)}
                    className="flex flex-col items-center gap-2 rounded-xl py-3 hover:bg-dark-700 transition-colors"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dark-700 border border-dark-600">
                      {option.icon ? (
                        <option.icon className="h-5 w-5 text-neon-purple" />
                      ) : (
                        <span className="text-xl">{option.emoji}</span>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-gray-300">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 z-[200] -translate-x-1/2 rounded-full bg-dark-700 border border-dark-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
