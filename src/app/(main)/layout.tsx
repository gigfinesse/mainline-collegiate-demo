'use client';

import { AppShell } from '@/components/layout/AppShell';
import { TabBar } from '@/components/layout/TabBar';
import { UserProfileModal } from '@/components/profile/UserProfileModal';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppShell>{children}</AppShell>
      <TabBar />
      <UserProfileModal />
    </>
  );
}
