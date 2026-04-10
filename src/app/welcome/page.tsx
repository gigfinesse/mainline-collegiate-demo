'use client';

import { useRouter } from 'next/navigation';

const demoUsers = [
  {
    slug: 'marcus',
    name: 'Marcus Thompson',
    role: 'Exec @ Kappa Sigma Pi',
    description: 'Social chair. Creates events, manages members. The exec experience.',
    gradient: 'linear-gradient(135deg, #a855f7, #ec4899)',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
  },
  {
    slug: 'sarah',
    name: 'Sarah Chen',
    role: 'Exec @ Theta Delta',
    description: 'Sorority president. Sees TD events, is a friend of KSP.',
    gradient: 'linear-gradient(135deg, #ec4899, #f97316)',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
  },
  {
    slug: 'jake',
    name: 'Jake Rivera',
    role: 'Member @ Kappa Sigma Pi',
    description: 'Brother at KSP. Can RSVP and invite friends, but can\'t create events.',
    gradient: 'linear-gradient(135deg, #22d3ee, #a855f7)',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  },
  {
    slug: 'priya',
    name: 'Priya Patel',
    role: 'Member @ The Collective',
    description: 'Creative arts club member. Friend of Theta Delta. Cross-org view.',
    gradient: 'linear-gradient(135deg, #6366f1, #22d3ee)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
  },
  {
    slug: 'tyler',
    name: 'Tyler Brooks',
    role: 'No org — just a student',
    description: 'The rando experience. Can only see open events. No org access.',
    gradient: 'linear-gradient(135deg, #f97316, #22d3ee)',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  },
];

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="mx-auto max-w-lg px-5 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-xs font-bold tracking-[0.4em] text-neon-purple uppercase mb-3">
            Mainline
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            Collegiate
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
            The social event calendar for college campuses. Pick a user to explore the demo.
          </p>
        </div>

        {/* Tier legend */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <span className="text-[10px] uppercase tracking-wider text-neon-purple bg-neon-purple/10 border border-neon-purple/20 px-2.5 py-1 rounded-full font-semibold">
            Exec
          </span>
          <span className="text-[10px] uppercase tracking-wider text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20 px-2.5 py-1 rounded-full font-semibold">
            Member
          </span>
          <span className="text-[10px] uppercase tracking-wider text-neon-pink bg-neon-pink/10 border border-neon-pink/20 px-2.5 py-1 rounded-full font-semibold">
            Friend
          </span>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 bg-gray-400/10 border border-gray-400/20 px-2.5 py-1 rounded-full font-semibold">
            Rando
          </span>
        </div>

        {/* User cards */}
        <div className="space-y-3">
          {demoUsers.map((user) => (
            <button
              key={user.slug}
              onClick={() => router.push(`/?user=${user.slug}`)}
              className="w-full text-left rounded-2xl bg-dark-800 border border-dark-600 overflow-hidden transition-all duration-200 hover:border-neon-purple/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] active:scale-[0.98]"
            >
              <div className="flex items-center gap-4 p-4">
                {/* Avatar with gradient ring */}
                <div
                  className="shrink-0 rounded-full p-[2px]"
                  style={{ background: user.gradient }}
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-14 h-14 rounded-full bg-dark-700"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-base">{user.name}</div>
                  <div className="text-xs font-semibold text-neon-purple mt-0.5">{user.role}</div>
                  <div className="text-xs text-gray-500 mt-1 leading-relaxed">{user.description}</div>
                </div>

                {/* Arrow */}
                <div className="shrink-0 text-gray-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-10">
          <p className="text-[11px] text-gray-600">
            Mainline State University &middot; Demo
          </p>
        </div>
      </div>
    </div>
  );
}
