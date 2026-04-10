'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { getOrgsForUser } from '@/lib/data/helpers';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import type { OrgRole, OrgType } from '@/lib/types';

function RoleBadge({ role }: { role: OrgRole }) {
  const config: Record<OrgRole, { bg: string; text: string; label: string }> = {
    exec: { bg: 'bg-neon-purple/20', text: 'text-neon-purple', label: 'Exec' },
    member: { bg: 'bg-neon-cyan/20', text: 'text-neon-cyan', label: 'Member' },
    friend: { bg: 'bg-neon-pink/20', text: 'text-neon-pink', label: 'FoH' },
  };
  const c = config[role];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}
    >
      {c.label}
    </span>
  );
}

function OrgTypeBadge({ type }: { type: OrgType }) {
  const config: Record<OrgType, { text: string; label: string }> = {
    fraternity: { text: 'text-neon-purple/80', label: '🏛 Fraternity' },
    sorority: { text: 'text-neon-pink/80', label: '💜 Sorority' },
    club: { text: 'text-neon-cyan/80', label: '🎨 Club' },
    student_org: { text: 'text-neon-orange/80', label: '⚡ Student Org' },
  };
  const c = config[type];
  return (
    <span className={`text-[10px] font-medium uppercase tracking-wider ${c.text}`}>
      {c.label}
    </span>
  );
}

export default function MyOrgsPage() {
  const { currentUser } = useApp();
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

  const userOrgs = getOrgsForUser(currentUser.id);

  return (
    <div className="px-4 pt-6 pb-4">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          My Orgs
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Your organizations and groups
        </p>
      </div>

      {userOrgs.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <UserGroupIcon className="w-12 h-12 text-gray-600 mb-4" />
          <p className="text-lg font-semibold text-gray-400">
            no squads yet 😭
          </p>
          <p className="text-sm text-gray-600 mt-2 max-w-[260px]">
            get an invite from a friend or start your own org on campus
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {userOrgs.map(({ org, role }, i) => (
            <div
              key={org.id}
            >
              <Link
                href={buildHref(`/orgs/${org.id}`)}
                className="block rounded-2xl overflow-hidden border border-dark-600 transition-all duration-200 hover:border-neon-purple/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]"
              >
                {/* Cover image with overlay */}
                <div className="relative h-28 w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={org.coverUrl}
                    alt={org.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent" />

                  {/* Content overlaid on image */}
                  <div className="absolute bottom-0 left-0 right-0 p-3.5 flex items-end gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={org.logoUrl}
                      alt={org.shortName}
                      className="w-11 h-11 rounded-full border-2 border-dark-900 bg-dark-700 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-bold text-white truncate">
                        {org.name}
                      </h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        <OrgTypeBadge type={org.type} />
                        <span className="text-[10px] text-gray-500">
                          /
                        </span>
                        <RoleBadge role={role} />
                      </div>
                    </div>

                    {/* Chevron */}
                    <svg
                      className="w-4 h-4 text-gray-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
