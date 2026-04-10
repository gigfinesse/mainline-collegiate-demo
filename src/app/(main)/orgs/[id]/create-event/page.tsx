'use client';

import { use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeftIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { useApp } from '@/lib/context/AppContext';
import { getOrgById, getUserRoleInOrg } from '@/lib/data/helpers';
import { CreateEventForm } from '@/components/events/CreateEventForm';

export default function CreateEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userParam = searchParams.get('user');
  const { currentUser } = useApp();

  const buildHref = (path: string) =>
    userParam ? `${path}?user=${userParam}` : path;

  const org = getOrgById(id);

  if (!org) {
    return (
      <div className="flex flex-col items-center justify-center px-5 pt-20 text-center">
        <p className="text-lg font-bold text-white">Organization not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm font-semibold text-neon-purple"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Check if current user is an exec
  const role = currentUser ? getUserRoleInOrg(currentUser.id, id) : null;
  const isExec = role === 'exec';

  if (!currentUser || !isExec) {
    return (
      <div className="flex flex-col items-center justify-center px-5 pt-20 text-center">
        <ShieldExclamationIcon className="h-16 w-16 text-neon-pink/50 mb-4" />
        <p className="text-lg font-bold text-white">Access Denied</p>
        <p className="text-sm text-gray-400 mt-1">
          Only execs of {org.name} can create events.
        </p>
        <button
          onClick={() => router.push(buildHref(`/orgs/${id}`))}
          className="mt-4 text-sm font-semibold text-neon-purple"
        >
          Back to {org.shortName}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-dark-600 bg-dark-900/95 backdrop-blur-md px-4 py-3">
        <button
          onClick={() => router.back()}
          className="rounded-full p-1.5 hover:bg-dark-700 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 text-white" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-white">Create Event</h1>
          <p className="text-xs text-gray-400">{org.name}</p>
        </div>
      </div>

      <CreateEventForm orgId={id} />
    </div>
  );
}
