'use client';

import { useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { getOrgById, getUserRoleInOrg } from '@/lib/data/helpers';
import { OrgHeader } from '@/components/orgs/OrgHeader';
import { OrgEventList } from '@/components/orgs/OrgEventList';
import { OrgMemberList } from '@/components/orgs/OrgMemberList';
import { InviteModal } from '@/components/orgs/InviteModal';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type Tab = 'events' | 'members';

export default function OrgDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userParam = searchParams.get('user');
  const { currentUser, rsvps, events } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>('events');
  const [inviteOpen, setInviteOpen] = useState(false);

  const buildHref = (path: string) =>
    userParam ? `${path}?user=${userParam}` : path;

  const orgId = params.id as string;
  const org = getOrgById(orgId);

  if (!org || !currentUser) {
    return (
      <div className="px-4 pt-6">
        <p className="text-gray-400">Organization not found.</p>
        <Link href={buildHref('/orgs')} className="mt-2 text-sm text-neon-purple hover:underline inline-block">
          Back to My Orgs
        </Link>
      </div>
    );
  }

  const userRole = getUserRoleInOrg(currentUser.id, org.id);

  return (
    <div className="pb-4">
      {/* Back button */}
      <div className="px-4 pt-4 pb-2">
        <Link
          href={buildHref('/orgs')}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          My Orgs
        </Link>
      </div>

      {/* Header */}
      <OrgHeader
        org={org}
        userRole={userRole}
        onCreateEvent={() => {
          router.push(buildHref(`/orgs/${orgId}/create-event`));
        }}
      />

      {/* Tab bar */}
      <div className="mt-5 px-4">
        <div className="flex rounded-xl bg-dark-950 p-1 border border-dark-600">
          {(['events', 'members'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-dark-700 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab === 'events' ? 'Events' : 'Members'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'events' ? (
        <OrgEventList
          orgId={org.id}
          currentUserId={currentUser.id}
          rsvps={rsvps}
          contextEvents={events}
          buildHref={buildHref}
        />
      ) : (
        <OrgMemberList
          orgId={org.id}
          userRole={userRole}
          onInvite={() => setInviteOpen(true)}
        />
      )}

      {/* Invite modal */}
      {userRole && (
        <InviteModal
          orgId={org.id}
          orgName={org.shortName}
          userRole={userRole}
          isOpen={inviteOpen}
          onClose={() => setInviteOpen(false)}
        />
      )}
    </div>
  );
}
