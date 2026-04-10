'use client';

import type { ReactNode } from 'react';

interface FeedCardProps {
  children: ReactNode;
  className?: string;
}

export function FeedCard({ children, className = '' }: FeedCardProps) {
  return (
    <div
      className={`rounded-2xl bg-dark-800 border border-dark-600 overflow-hidden transition-all duration-200 hover:border-neon-purple/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] ${className}`}
    >
      {children}
    </div>
  );
}
