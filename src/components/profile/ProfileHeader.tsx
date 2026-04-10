'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { User } from '@/lib/types';
import { schools } from '@/lib/data/schools';

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const [editOpen, setEditOpen] = useState(false);
  const school = schools.find((s) => s.id === user.schoolId);

  return (
    <>
      <div className="flex flex-col items-center text-center px-4">
        {/* Avatar */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.avatarUrl}
          alt={user.firstName}
          className="w-24 h-24 rounded-full bg-dark-700 border-4 border-dark-700 shadow-[0_0_24px_rgba(168,85,247,0.15)]"
        />

        {/* Name */}
        <h1 className="mt-3 text-2xl font-extrabold text-white">
          {user.firstName} {user.lastName}
        </h1>

        {/* Email */}
        <p className="mt-1 text-sm text-gray-500">{user.email}</p>

        {/* School */}
        {school && (
          <p className="mt-0.5 text-xs text-neon-purple font-medium">
            {school.name}
          </p>
        )}

        {/* Bio */}
        {user.bio && (
          <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-[280px]">
            {user.bio}
          </p>
        )}

        {/* Edit button */}
        <button
          onClick={() => setEditOpen(true)}
          className="mt-4 flex items-center gap-1.5 rounded-full border border-dark-600 bg-dark-800 px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-neon-purple/40 hover:text-white active:scale-95"
        >
          <PencilIcon className="w-3.5 h-3.5" />
          Edit Profile
        </button>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md"
            >
              <div className="rounded-t-3xl bg-dark-800 border-t border-x border-dark-600 p-6 pb-10">
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-dark-600" />

                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">Edit Profile</h2>
                  <button
                    onClick={() => setEditOpen(false)}
                    className="rounded-full p-1.5 bg-dark-700 text-gray-400 hover:text-white transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Name field */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    defaultValue={`${user.firstName} ${user.lastName}`}
                    className="w-full rounded-xl bg-dark-900 border border-dark-600 px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-neon-purple/50 transition-colors"
                  />
                </div>

                {/* Bio field */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                    Bio
                  </label>
                  <textarea
                    defaultValue={user.bio || ''}
                    placeholder="Tell people about yourself..."
                    rows={3}
                    className="w-full rounded-xl bg-dark-900 border border-dark-600 px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-neon-purple/50 transition-colors resize-none"
                  />
                </div>

                {/* Save button (demo only) */}
                <button
                  onClick={() => setEditOpen(false)}
                  className="w-full rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink px-4 py-3 text-sm font-bold text-white transition-all duration-200 hover:shadow-[0_0_24px_rgba(168,85,247,0.3)] active:scale-[0.98]"
                >
                  Save Changes
                </button>
                <p className="mt-2 text-center text-[11px] text-gray-600">
                  Changes are for demo purposes only
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
