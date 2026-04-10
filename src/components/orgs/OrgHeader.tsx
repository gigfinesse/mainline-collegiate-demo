'use client';

import type { Org, OrgRole } from '@/lib/types';
import { getMembersOfOrg } from '@/lib/data/helpers';
import { PlusIcon } from '@heroicons/react/24/solid';

function OrgTypeBadge({ type }: { type: Org['type'] }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    fraternity: {
      bg: 'bg-neon-purple/15',
      text: 'text-neon-purple',
      label: '🏛 Fraternity',
    },
    sorority: {
      bg: 'bg-neon-pink/15',
      text: 'text-neon-pink',
      label: '💜 Sorority',
    },
    club: {
      bg: 'bg-neon-cyan/15',
      text: 'text-neon-cyan',
      label: '🎨 Club',
    },
    student_org: {
      bg: 'bg-neon-orange/15',
      text: 'text-neon-orange',
      label: '⚡ Student Org',
    },
  };

  const c = config[type];
  if (!c) return null;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}
    >
      {c.label}
    </span>
  );
}

interface OrgHeaderProps {
  org: Org;
  userRole: OrgRole | null;
  onCreateEvent?: () => void;
}

export function OrgHeader({ org, userRole, onCreateEvent }: OrgHeaderProps) {
  const members = getMembersOfOrg(org.id);
  const isExec = userRole === 'exec';

  return (
    <div>
      {/* Cover image */}
      <div className="relative h-40 w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={org.coverUrl}
          alt={`${org.name} cover`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/30 via-transparent to-dark-900" />
      </div>

      {/* Logo + Info */}
      <div className="relative px-4 -mt-10">
        <div className="flex items-end gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={org.logoUrl}
            alt={org.shortName}
            className="w-20 h-20 rounded-full border-4 border-dark-900 bg-dark-700 flex-shrink-0"
          />
          <div className="flex-1 min-w-0 pb-1">
            {org.greekLetters ? (
              <>
                <h1 className="text-3xl font-black text-white tracking-wide">
                  {org.greekLetters}
                </h1>
                <p className="text-sm text-gray-400 -mt-0.5">
                  {org.name}
                </p>
              </>
            ) : (
              <h1 className="text-xl font-extrabold text-white truncate">
                {org.name}
              </h1>
            )}
            <div className="flex items-center gap-2 mt-1">
              <OrgTypeBadge type={org.type} />
              <span className="text-xs text-gray-500">
                {members.length} members
              </span>
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-400 leading-relaxed">
          {org.description}
        </p>

        {isExec && onCreateEvent && (
          <button
            onClick={onCreateEvent}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink px-4 py-3 text-sm font-bold text-white transition-all duration-200 hover:shadow-[0_0_24px_rgba(168,85,247,0.3)] active:scale-[0.98]"
          >
            <PlusIcon className="w-4 h-4" />
            Create Event
          </button>
        )}
      </div>
    </div>
  );
}
