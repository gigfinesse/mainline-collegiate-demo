import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
  header?: ReactNode;
}

export function AppShell({ children, header }: AppShellProps) {
  return (
    <div className="min-h-screen bg-dark-950">
      <div className="mx-auto min-h-screen w-full max-w-md bg-dark-900 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
        {header && (
          <header className="sticky top-0 z-40 border-b border-dark-600 bg-dark-900/95 backdrop-blur-md px-4 py-3">
            {header}
          </header>
        )}
        <main className="pb-20">{children}</main>
      </div>
    </div>
  );
}
