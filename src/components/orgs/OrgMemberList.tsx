'use client';

import { getMembersOfOrg } from '@/lib/data/helpers';
import type { OrgRole } from '@/lib/types';

function RoleBadge({ role }: { role: OrgRole }) {
  const config: Record<OrgRole, { bg: string; text: string; glow: string; label: string }> = {
    exec: {
      bg: 'bg-neon-purple/15',
      text: 'text-neon-purple',
      glow: 'shadow-[0_0_8px_rgba(168,85,247,0.3)]',
      label: 'Exec',
    },
    member: {
      bg: 'bg-neon-cyan/15',
      text: 'text-neon-cyan',
      glow: '',
      label: 'Member',
    },
    friend: {
      bg: 'bg-neon-pink/15',
      text: 'text-neon-pink',
      glow: '',
      label: 'Friend',
    },
  };

  const c = config[role];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text} ${c.glow}`}
    >
      {c.label}
    </span>
  );
}

interface OrgMemberListProps {
  orgId: string;
  userRole: OrgRole | null;
  onInvite?: () => void;
}

export function OrgMemberList({ orgId, userRole, onInvite }: OrgMemberListProps) {
  const members = getMembersOfOrg(orgId);

  const execs = members.filter((m) => m.role === 'exec');
  const regularMembers = members.filter((m) => m.role === 'member');
  const friends = members.filter((m) => m.role === 'friend');

  const canInvite = userRole === 'exec' || userRole === 'member';

  return (
    <div className="px-4 py-4 space-y-5">
      {canInvite && onInvite && (
        <button
          onClick={onInvite}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-dark-600 bg-dark-800/50 px-4 py-3 text-sm font-medium text-gray-400 transition-all duration-200 hover:border-neon-purple/40 hover:text-neon-purple"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Invite People
        </button>
      )}

      {execs.length > 0 && (
        <MemberGroup label="Execs" members={execs} startIndex={0} />
      )}

      {regularMembers.length > 0 && (
        <MemberGroup label="Members" members={regularMembers} startIndex={execs.length} />
      )}

      {friends.length > 0 && (
        <MemberGroup label="Friends" members={friends} startIndex={execs.length + regularMembers.length} />
      )}
    </div>
  );
}

function MemberGroup({
  label,
  members,
  startIndex,
}: {
  label: string;
  members: { user: { id: string; firstName: string; lastName: string; avatarUrl: string }; role: OrgRole }[];
  startIndex: number;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
        {label} ({members.length})
      </h3>
      <div className="space-y-1">
        {members.map((m, i) => (
          <div
            key={m.user.id}
            className="flex items-center gap-3 rounded-xl bg-dark-800 border border-dark-600 px-3 py-2.5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.user.avatarUrl}
              alt={m.user.firstName}
              className="w-9 h-9 rounded-full bg-dark-700 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {m.user.firstName} {m.user.lastName}
              </p>
            </div>
            <RoleBadge role={m.role} />
          </div>
        ))}
      </div>
    </div>
  );
}
