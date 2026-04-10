'use client';

import { AppShell } from '@/components/layout/AppShell';
import { TabBar } from '@/components/layout/TabBar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppShell>{children}</AppShell>
      <TabBar />
    </>
  );
}
