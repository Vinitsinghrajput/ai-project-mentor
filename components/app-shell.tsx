'use client';

import { AuthProvider } from '@/lib/auth-context';
import { Navbar } from '@/components/navbar';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <main>{children}</main>
    </AuthProvider>
  );
}
