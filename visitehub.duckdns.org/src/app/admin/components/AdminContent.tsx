'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface AdminContentProps {
  children: React.ReactNode;
}

export default function AdminContent({ children }: AdminContentProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [adminDarkMode, setAdminDarkMode] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('admin_dark_mode');
      setAdminDarkMode(stored === '1');
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('admin_dark_mode', adminDarkMode ? '1' : '0');
    } catch {
      // ignore
    }
  }, [adminDarkMode]);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { name: 'Properties', href: '/admin/properties', icon: '🏠' },
    { name: 'Agences', href: '/admin/agences', icon: '🏢' },
    { name: 'Promoteurs', href: '/admin/promoteurs', icon: '🏗️' },
    { name: 'Hotels', href: '/admin/hotels', icon: '🏨' },
    { name: 'Restaurants', href: '/admin/restaurants', icon: '🍽️' },
    { name: 'Users', href: '/admin/users', icon: '👥' },
    { name: 'Demandes', href: '/admin/contacts', icon: '✉️' },
    { name: 'Blog', href: '/admin/blog', icon: '📝' },
    { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
    { name: 'Homepage', href: '/admin/settings/homepage', icon: '🖼️' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
  ];

  const adminClasses = useMemo(() => {
    return adminDarkMode
      ? {
          frame: 'admin-theme-dark bg-slate-950 text-slate-100',
          topNav: 'bg-slate-900 border-slate-800 text-slate-100',
          topNavMuted: 'text-slate-300',
          sidebarShell: 'bg-slate-900 border-slate-800 text-slate-200',
          sidebarItemBase: 'text-slate-200 hover:bg-slate-800 hover:text-white',
          sidebarItemActive: 'bg-slate-800 text-white border-r-2 border-blue-400',
          sidebarDivider: 'border-slate-800',
          toggleLabel: 'text-slate-300',
        }
      : {
          frame: 'admin-theme bg-gray-50 text-gray-900',
          topNav: 'bg-white border-gray-200 text-gray-900',
          topNavMuted: 'text-gray-700',
          sidebarShell: 'bg-white border-gray-200 text-gray-700',
          sidebarItemBase: 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
          sidebarItemActive: 'bg-blue-50 text-blue-700 border-r-2 border-blue-700',
          sidebarDivider: 'border-gray-200',
          toggleLabel: 'text-gray-600',
        };
  }, [adminDarkMode]);

  return (
    <div className={`min-h-screen ${adminClasses.frame}`}>
      <style jsx global>{`
        /* Admin dark mode: override common utility colors inside admin only */
        .admin-theme-dark .bg-white { background-color: rgb(15 23 42) !important; }
        .admin-theme-dark .bg-gray-50 { background-color: rgb(2 6 23) !important; }
        .admin-theme-dark .bg-gray-100 { background-color: rgb(15 23 42) !important; }
        .admin-theme-dark .bg-gray-200 { background-color: rgb(30 41 59) !important; }
        .admin-theme-dark .bg-gray-300 { background-color: rgb(30 41 59) !important; }
        .admin-theme-dark .bg-slate-50 { background-color: rgb(15 23 42) !important; }
        .admin-theme-dark .text-gray-900 { color: rgb(241 245 249) !important; }
        .admin-theme-dark .text-gray-800 { color: rgb(241 245 249) !important; }
        .admin-theme-dark .text-gray-700 { color: rgb(203 213 225) !important; }
        .admin-theme-dark .text-gray-600 { color: rgb(148 163 184) !important; }
        .admin-theme-dark .text-gray-500 { color: rgb(148 163 184) !important; }
        .admin-theme-dark .text-slate-900 { color: rgb(241 245 249) !important; }
        .admin-theme-dark .text-slate-800 { color: rgb(241 245 249) !important; }
        .admin-theme-dark .text-slate-700 { color: rgb(203 213 225) !important; }
        .admin-theme-dark .text-slate-600 { color: rgb(148 163 184) !important; }
        .admin-theme-dark .text-slate-500 { color: rgb(148 163 184) !important; }
        .admin-theme-dark .border-gray-200 { border-color: rgb(30 41 59) !important; }
        .admin-theme-dark .border-gray-300 { border-color: rgb(51 65 85) !important; }
        .admin-theme-dark .border-slate-200 { border-color: rgb(51 65 85) !important; }
        .admin-theme-dark .border-slate-300 { border-color: rgb(51 65 85) !important; }
        .admin-theme-dark .shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.35) !important; }

        /* Fix Tailwind hover background utilities used in tables/lists */
        .admin-theme-dark .hover\\:bg-gray-50:hover { background-color: rgb(15 23 42) !important; }
        .admin-theme-dark .hover\\:bg-gray-100:hover { background-color: rgb(30 41 59) !important; }
        .admin-theme-dark .hover\\:bg-gray-200:hover { background-color: rgb(30 41 59) !important; }
        .admin-theme-dark .hover\\:bg-white:hover { background-color: rgb(15 23 42) !important; }
        .admin-theme-dark .hover\\:bg-slate-50:hover { background-color: rgb(30 41 59) !important; }
        .admin-theme-dark .hover\\:bg-blue-50:hover { background-color: rgb(30 41 59) !important; }
        .admin-theme-dark .hover\\:bg-red-50:hover { background-color: rgb(30 41 59) !important; }
        .admin-theme-dark .hover\\:text-gray-900:hover { color: rgb(241 245 249) !important; }
        .admin-theme-dark .hover\\:border-gray-400:hover { border-color: rgb(71 85 105) !important; }
        .admin-theme-dark .hover\\:border-gray-300:hover { border-color: rgb(71 85 105) !important; }

        /* Table dividers */
        .admin-theme-dark .divide-gray-200 > :not([hidden]) ~ :not([hidden]) { border-color: rgb(30 41 59) !important; }
        .admin-theme-dark .divide-slate-100 > :not([hidden]) ~ :not([hidden]) { border-color: rgb(30 41 59) !important; }

        /* Table row hover: never flash white in dark mode */
        .admin-theme-dark table tbody tr { transition: background-color 150ms ease; }
        .admin-theme-dark table tbody tr:hover { background-color: rgb(148 163 184 / 0.10) !important; }

        /* Disabled hover overrides (avoid turning white) */
        .admin-theme-dark .disabled\\:hover\\:bg-white:disabled:hover { background-color: rgb(15 23 42) !important; }

        /* Analytics & cards sometimes use light tint backgrounds */
        .admin-theme-dark .bg-blue-50,
        .admin-theme-dark .bg-green-50,
        .admin-theme-dark .bg-purple-50,
        .admin-theme-dark .bg-indigo-50 {
          background-color: rgb(15 23 42) !important;
        }

        .admin-theme-dark .border-blue-200,
        .admin-theme-dark .border-green-200,
        .admin-theme-dark .border-purple-200,
        .admin-theme-dark .border-indigo-200 {
          border-color: rgb(51 65 85) !important;
        }

        .admin-theme-dark input,
        .admin-theme-dark textarea,
        .admin-theme-dark select {
          background-color: rgb(2 6 23) !important;
          color: rgb(241 245 249) !important;
          border-color: rgb(51 65 85) !important;
        }
        .admin-theme-dark input::placeholder,
        .admin-theme-dark textarea::placeholder {
          color: rgb(148 163 184) !important;
        }

        /* Fancy toggle inspired by provided HTML */
        .vh-admin-toggle {
          --size: 1.5rem;
          appearance: none;
          outline: none;
          cursor: pointer;
          width: var(--size);
          height: var(--size);
          border-radius: 999px;
          transition: all 300ms ease;
          box-shadow: inset calc(var(--size) * 0.33) calc(var(--size) * -0.25) 0;
          color: hsl(240, 100%, 95%);
          flex-shrink: 0;
        }

        .admin-theme-dark .vh-admin-toggle { color: hsl(240, 15%, 85%); }

        .vh-admin-toggle:checked {
          --ray-size: calc(var(--size) * -0.4);
          --offset-orthogonal: calc(var(--size) * 0.65);
          --offset-diagonal: calc(var(--size) * 0.45);
          transform: scale(0.78);
          color: rgb(2 6 23);
          box-shadow:
            inset 0 0 0 var(--size),
            calc(var(--offset-orthogonal) * -1) 0 0 var(--ray-size),
            var(--offset-orthogonal) 0 0 var(--ray-size),
            0 calc(var(--offset-orthogonal) * -1) 0 var(--ray-size),
            0 var(--offset-orthogonal) 0 var(--ray-size),
            calc(var(--offset-diagonal) * -1) calc(var(--offset-diagonal) * -1) 0 var(--ray-size),
            var(--offset-diagonal) var(--offset-diagonal) 0 var(--ray-size),
            calc(var(--offset-diagonal) * -1) var(--offset-diagonal) 0 var(--ray-size),
            var(--offset-diagonal) calc(var(--offset-diagonal) * -1) 0 var(--ray-size);
        }
      `}</style>
      {/* Top Navigation */}
      <nav className={`relative shadow-sm border-b transition-colors duration-200 ${adminClasses.topNav}`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 pr-20">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">
                Admin Panel
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <span className={`text-sm ${adminClasses.topNavMuted}`}>
                Welcome, {user?.name || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Pinned toggle at far-right edge (matches circled spot) */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          <input
            type="checkbox"
            className="vh-admin-toggle"
            checked={adminDarkMode}
            onChange={(e) => setAdminDarkMode(e.target.checked)}
            aria-label="Admin dark mode"
            title={adminDarkMode ? 'Light Mode' : 'Dark Mode'}
          />
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar (overlay expand for smoother hover) */}
        <div className="relative w-[72px] flex-none">
          <div
            className={`group absolute inset-0 min-h-screen border-r shadow-sm overflow-hidden transition-[width,background-color,border-color] duration-200 ease-out w-[72px] hover:w-64 ${adminClasses.sidebarShell}`}
            style={{ willChange: 'width' }}
          >
            <nav className="mt-6">
              <div className="px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center rounded-lg transition-colors duration-150 text-sm font-medium border-r-2 border-transparent py-2 justify-center hover:opacity-100 group-hover:justify-start px-3 group-hover:px-4 ${
                        isActive ? adminClasses.sidebarItemActive : adminClasses.sidebarItemBase
                      }`}
                      title={item.name}
                      aria-label={item.name}
                    >
                      <span className="text-lg leading-none">{item.icon}</span>
                      <span className="ml-3 overflow-hidden whitespace-nowrap max-w-0 opacity-0 group-hover:max-w-[180px] group-hover:opacity-100 transition-[max-width,opacity] duration-200">
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 transition-colors duration-200">
          {children}
        </div>
      </div>
    </div>
  );
}
