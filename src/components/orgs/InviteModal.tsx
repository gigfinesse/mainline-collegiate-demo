'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';
import type { OrgRole } from '@/lib/types';
import { users } from '@/lib/data/users';

interface InviteModalProps {
  orgId: string;
  orgName: string;
  userRole: OrgRole;
  isOpen: boolean;
  onClose: () => void;
}

export function InviteModal({ orgId, orgName, userRole, isOpen, onClose }: InviteModalProps) {
  const [copiedType, setCopiedType] = useState<'member' | 'friend' | null>(null);

  const memberLink = `mainline.app/invite/${orgId}/m-${Math.random().toString(36).slice(2, 8)}`;
  const friendLink = `mainline.app/invite/${orgId}/f-${Math.random().toString(36).slice(2, 8)}`;

  const handleCopy = (link: string, type: 'member' | 'friend') => {
    navigator.clipboard?.writeText(link).catch(() => {
      // Silently fail — demo only
    });
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const isExec = userRole === 'exec';

  // Mock users to "add directly"
  const suggestedUsers = users.slice(10, 16);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Bottom sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md"
          >
            <div className="rounded-t-3xl bg-dark-800 border-t border-x border-dark-600 p-6 pb-10">
              {/* Handle bar */}
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-dark-600" />

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">
                  Invite to {orgName}
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 bg-dark-700 text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Invite as Member (exec only) */}
              {isExec && (
                <div className="mb-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neon-cyan mb-2">
                    Invite as Member
                  </h3>
                  <div className="flex items-center gap-2 rounded-xl bg-dark-900 border border-dark-600 px-3 py-2.5">
                    <p className="flex-1 text-xs text-gray-400 truncate font-mono">
                      {memberLink}
                    </p>
                    <button
                      onClick={() => handleCopy(memberLink, 'member')}
                      className="flex-shrink-0 rounded-lg bg-neon-cyan/15 px-3 py-1.5 text-xs font-semibold text-neon-cyan transition-all duration-200 hover:bg-neon-cyan/25 active:scale-95"
                    >
                      {copiedType === 'member' ? (
                        <span className="flex items-center gap-1">
                          <CheckIcon className="w-3 h-3" /> Copied
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <ClipboardDocumentIcon className="w-3 h-3" /> Copy
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Invite as Friend */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neon-pink mb-2">
                  Invite as Friend
                </h3>
                <div className="flex items-center gap-2 rounded-xl bg-dark-900 border border-dark-600 px-3 py-2.5">
                  <p className="flex-1 text-xs text-gray-400 truncate font-mono">
                    {friendLink}
                  </p>
                  <button
                    onClick={() => handleCopy(friendLink, 'friend')}
                    className="flex-shrink-0 rounded-lg bg-neon-pink/15 px-3 py-1.5 text-xs font-semibold text-neon-pink transition-all duration-200 hover:bg-neon-pink/25 active:scale-95"
                  >
                    {copiedType === 'friend' ? (
                      <span className="flex items-center gap-1">
                        <CheckIcon className="w-3 h-3" /> Copied
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <ClipboardDocumentIcon className="w-3 h-3" /> Copy
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Add directly section */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                  Add Directly
                </h3>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {suggestedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-dark-700 transition-colors"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={user.avatarUrl}
                        alt={user.firstName}
                        className="w-8 h-8 rounded-full bg-dark-700"
                      />
                      <p className="flex-1 text-sm text-gray-300 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <button className="text-[11px] font-semibold text-neon-purple bg-neon-purple/15 px-3 py-1 rounded-full hover:bg-neon-purple/25 transition-colors active:scale-95">
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
