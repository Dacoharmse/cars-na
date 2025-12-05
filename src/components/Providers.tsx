'use client';

import { SessionProvider } from 'next-auth/react';
import { api } from '@/lib/api';
import { ToastProvider } from '@/components/ui/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <api.Provider>
      <SessionProvider
        refetchInterval={0}
        refetchOnWindowFocus={false}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </SessionProvider>
    </api.Provider>
  );
}
