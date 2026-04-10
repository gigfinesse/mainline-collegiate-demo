'use client';

import { createContext, useContext, useState } from 'react';

interface UserProfileContextValue {
  selectedUserId: string | null;
  openProfile: (userId: string) => void;
  closeProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextValue>({
  selectedUserId: null,
  openProfile: () => {},
  closeProfile: () => {},
});

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  return (
    <UserProfileContext.Provider value={{
      selectedUserId,
      openProfile: setSelectedUserId,
      closeProfile: () => setSelectedUserId(null),
    }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  return useContext(UserProfileContext);
}
