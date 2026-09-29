'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import { User } from '@/types';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          throw new Error('Not authenticated');
        }
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  // If the user is on the login page, just render the children without the Sidebar layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-100 flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null; // This will trigger the redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar user={user} />
      <main className="md:ml-64 p-6 md:p-8 pt-20 md:pt-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
