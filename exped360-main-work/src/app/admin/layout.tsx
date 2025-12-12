'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthProvider } from '../../context/AuthContext';
import AdminContent from './components/AdminContent';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if we're not on login page and redirect if no auth
    if (pathname !== '/admin/login') {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('auth_user');

      if (!token || !userData) {
        router.push('/admin/login');
      }
    }
  }, [router, pathname]);

  // If we're on the login page, wrap with AuthProvider but don't show layout
  if (pathname === '/admin/login') {
    return (
      <AuthProvider>
        {children}
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <AdminContent>
        {children}
      </AdminContent>
    </AuthProvider>
  );
} 