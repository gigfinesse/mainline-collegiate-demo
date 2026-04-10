'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  HomeIcon as HomeOutline,
  CalendarIcon as CalendarOutline,
  UserGroupIcon as UserGroupOutline,
  UserIcon as UserOutline,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolid,
  CalendarIcon as CalendarSolid,
  UserGroupIcon as UserGroupSolid,
  UserIcon as UserSolid,
} from '@heroicons/react/24/solid';

const tabs = [
  {
    label: 'Home',
    href: '/',
    IconOutline: HomeOutline,
    IconSolid: HomeSolid,
  },
  {
    label: 'My Events',
    href: '/events',
    IconOutline: CalendarOutline,
    IconSolid: CalendarSolid,
  },
  {
    label: 'My Orgs',
    href: '/orgs',
    IconOutline: UserGroupOutline,
    IconSolid: UserGroupSolid,
  },
  {
    label: 'Profile',
    href: '/profile',
    IconOutline: UserOutline,
    IconSolid: UserSolid,
  },
];

export function TabBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userParam = searchParams.get('user');

  function buildHref(base: string) {
    if (userParam) return `${base}?user=${userParam}`;
    return base;
  }

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-md border-t border-dark-600 bg-dark-800/95 backdrop-blur-md">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const active = isActive(tab.href);
            const Icon = active ? tab.IconSolid : tab.IconOutline;

            return (
              <Link
                key={tab.href}
                href={buildHref(tab.href)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                  active ? 'text-neon-purple' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
