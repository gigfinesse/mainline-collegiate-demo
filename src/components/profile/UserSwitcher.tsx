'use client';

import { useRouter } from 'next/navigation';
import { getUserBySlug } from '@/lib/data/helpers';
import { BeakerIcon } from '@heroicons/react/24/outline';

const demoUsers = [
  { slug: 'marcus', summary: 'Exec @ ΚΣΠ' },
  { slug: 'sarah', summary: 'Exec @ ΘΔ' },
  { slug: 'jake', summary: 'Member @ ΚΣΠ' },
  { slug: 'priya', summary: 'Member @ TC' },
  { slug: 'tyler', summary: 'No orgs (rando)' },
];

interface UserSwitcherProps {
  currentSlug: string;
}

export function UserSwitcher({ currentSlug }: UserSwitcherProps) {
  const router = useRouter();

  const handleSwitch = (slug: string) => {
    const param = slug === 'marcus' ? '' : `?user=${slug}`;
    router.push(`/profile${param}`);
  };

  return (
    <div className="px-4">
      <div className="flex items-center gap-2 mb-3">
        <BeakerIcon className="w-4 h-4 text-neon-orange" />
        <h2 className="text-sm font-semibold text-gray-400">Demo Mode</h2>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-neon-orange bg-neon-orange/15 px-2 py-0.5 rounded-full">
          Dev
        </span>
      </div>

      <div className="rounded-2xl bg-dark-800 border border-dark-600 p-3 space-y-1">
        <p className="text-xs text-gray-500 mb-2 px-1">
          Switch user to explore different perspectives
        </p>
        {demoUsers.map((demo, i) => {
          const user = getUserBySlug(demo.slug);
          if (!user) return null;

          const isActive = currentSlug === demo.slug;

          return (
            <button
              key={demo.slug}
              onClick={() => handleSwitch(demo.slug)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${
                isActive
                  ? 'bg-neon-purple/10 border border-neon-purple/30'
                  : 'hover:bg-dark-700 border border-transparent'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatarUrl}
                alt={user.firstName}
                className={`w-9 h-9 rounded-full bg-dark-700 flex-shrink-0 ${
                  isActive ? 'ring-2 ring-neon-purple/50' : ''
                }`}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    isActive ? 'text-neon-purple' : 'text-white'
                  }`}
                >
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[11px] text-gray-500">{demo.summary}</p>
              </div>
              {isActive && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neon-purple bg-neon-purple/15 px-2 py-0.5 rounded-full flex-shrink-0">
                  Active
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
