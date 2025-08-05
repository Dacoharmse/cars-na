'use client';

import { SessionProvider } from 'next-auth/react';
import { api } from '@/lib/api';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <api.Provider>
      <SessionProvider>
        {children}
      </SessionProvider>
    </api.Provider>
  );
}
