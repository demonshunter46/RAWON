import { useEffect, useState, useCallback } from 'react';
import { NavigationTab } from './components/Sidebar';
import { UserRole } from './types/rawon';

export interface RouteConfig {
  path: string;
  tab: NavigationTab;
  role?: UserRole;
  title: string;
  badge: string;
  breadcrumb: string[];
}

export const ROUTES: Record<string, RouteConfig> = {
  '/': {
    path: '/',
    tab: 'dashboard',
    role: 'Allocation owner',
    title: 'RAWON – Dashboard Ikhtisar Operasional',
    badge: 'Ikhtisar',
    breadcrumb: ['Beranda', 'Dashboard Operasional'],
  },
  '/dashboard': {
    path: '/dashboard',
    tab: 'dashboard',
    role: 'Allocation owner',
    title: 'RAWON – Dashboard Ikhtisar Operasional',
    badge: 'Ikhtisar',
    breadcrumb: ['Beranda', 'Dashboard Operasional'],
  },
  '/alokasi': {
    path: '/alokasi',
    tab: 'board',
    role: 'Allocation owner',
    title: 'RAWON – Papan Alokasi & Solver MILP',
    badge: 'Solver MILP',
    breadcrumb: ['Beranda', 'Papan Alokasi & Optimasi'],
  },
  '/mentor': {
    path: '/mentor',
    tab: 'mentors',
    role: 'Allocation owner',
    title: 'RAWON – Direktori & Manajemen Mentor',
    badge: '70 Mentor',
    breadcrumb: ['Beranda', 'Direktori Mentor'],
  },
  '/tim-riset': {
    path: '/tim-riset',
    tab: 'teams',
    role: 'Allocation owner',
    title: 'RAWON – Tim Riset & Sekolah Binaan',
    badge: '120 Tim',
    breadcrumb: ['Beranda', 'Tim Riset & Sekolah'],
  },
  '/gangguan': {
    path: '/gangguan',
    tab: 'disruptions',
    role: 'Allocation owner',
    title: 'RAWON – Simulator Gangguan & Mitigasi SOP',
    badge: 'Mitigasi SOP',
    breadcrumb: ['Beranda', 'Simulator Gangguan & SOP'],
  },
  '/laporan': {
    path: '/laporan',
    tab: 'reports',
    role: 'Allocation owner',
    title: 'RAWON – Laporan Efisiensi & Matriks Peran',
    badge: 'Audit & Analitik',
    breadcrumb: ['Beranda', 'Laporan & Matriks Peran'],
  },
  '/pengaturan': {
    path: '/pengaturan',
    tab: 'settings',
    role: 'Allocation owner',
    title: 'RAWON – Parameter Solver & Bobot MCDM',
    badge: 'Konfigurasi',
    breadcrumb: ['Beranda', 'Pengaturan Solver'],
  },
  // Dedicated Portals per Role
  '/portal/koordinator': {
    path: '/portal/koordinator',
    tab: 'dashboard',
    role: 'Koordinator wilayah',
    title: 'RAWON – Portal Koordinator Wilayah (Jatim)',
    badge: 'Jawa Timur',
    breadcrumb: ['Portal', 'Koordinator Wilayah'],
  },
  '/portal/mentor': {
    path: '/portal/mentor',
    tab: 'dashboard',
    role: 'Mentor',
    title: 'RAWON – Portal Mandiri Mentor Riset',
    badge: 'Dr. Maya Lestari',
    breadcrumb: ['Portal', 'Mentor Riset'],
  },
  '/portal/sekolah': {
    path: '/portal/sekolah',
    tab: 'dashboard',
    role: 'Sekolah',
    title: 'RAWON – Portal Kemitraan Sekolah Riset',
    badge: 'SMA 1 Surabaya',
    breadcrumb: ['Portal', 'Sekolah Mitra'],
  },
  '/portal/admin': {
    path: '/portal/admin',
    tab: 'dashboard',
    role: 'Allocation owner',
    title: 'RAWON – Portal Allocation Owner (Admin)',
    badge: 'Sarah Anindita',
    breadcrumb: ['Portal', 'Admin Utama'],
  },
};

// Map of common alias paths to canonical paths
const ALIAS_ROUTES: Record<string, string> = {
  '/board': '/alokasi',
  '/alokasi-milp': '/alokasi',
  '/solver': '/alokasi',
  '/mentors': '/mentor',
  '/daftar-mentor': '/mentor',
  '/teams': '/tim-riset',
  '/sekolah': '/tim-riset',
  '/disruptions': '/gangguan',
  '/simulator': '/gangguan',
  '/mitigasi': '/gangguan',
  '/reports': '/laporan',
  '/matriks-peran': '/laporan',
  '/audit': '/laporan',
  '/settings': '/pengaturan',
  '/parameter': '/pengaturan',
  '/koordinator': '/portal/koordinator',
  '/portal-koordinator': '/portal/koordinator',
  '/portal-mentor': '/portal/mentor',
  '/portal-sekolah': '/portal/sekolah',
};

// Helper: Normalize pathname to a canonical route
export const resolvePath = (pathname: string): string => {
  // strip trailing slash unless root
  let clean = pathname.replace(/\/+$/, '');
  if (!clean) clean = '/';

  if (ROUTES[clean]) return clean;
  if (ALIAS_ROUTES[clean]) return ALIAS_ROUTES[clean];

  // Nested routes check (e.g. /portal/mentor/tim)
  if (clean.startsWith('/portal/koordinator')) return '/portal/koordinator';
  if (clean.startsWith('/portal/mentor')) return '/portal/mentor';
  if (clean.startsWith('/portal/sekolah')) return '/portal/sekolah';
  if (clean.startsWith('/portal/admin')) return '/portal/admin';

  // Fallback to /dashboard
  return '/dashboard';
};

// Get route for a given tab and role
export const getPathForTabAndRole = (tab: NavigationTab, role: UserRole): string => {
  if (role === 'Koordinator wilayah') {
    if (tab === 'dashboard') return '/portal/koordinator';
    if (tab === 'teams') return '/tim-riset';
    if (tab === 'board') return '/alokasi';
    if (tab === 'disruptions') return '/gangguan';
    if (tab === 'reports') return '/laporan';
  }
  if (role === 'Mentor') {
    if (tab === 'dashboard') return '/portal/mentor';
    if (tab === 'teams') return '/tim-riset';
    if (tab === 'disruptions') return '/gangguan';
  }
  if (role === 'Sekolah') {
    if (tab === 'dashboard') return '/portal/sekolah';
    if (tab === 'teams') return '/tim-riset';
    if (tab === 'mentors') return '/mentor';
    if (tab === 'disruptions') return '/gangguan';
  }

  // Admin / Allocation owner
  switch (tab) {
    case 'dashboard':
      return '/dashboard';
    case 'board':
      return '/alokasi';
    case 'mentors':
      return '/mentor';
    case 'teams':
      return '/tim-riset';
    case 'disruptions':
      return '/gangguan';
    case 'reports':
      return '/laporan';
    case 'settings':
      return '/pengaturan';
    default:
      return '/dashboard';
  }
};

// Custom Hook for client-side routing with URL synchronization
export const useAppRouter = (
  currentTab: NavigationTab,
  currentRole: UserRole,
  onNavigate: (tab: NavigationTab, role?: UserRole) => void
) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return resolvePath(window.location.pathname);
    }
    return '/dashboard';
  });

  // Handle URL change from browser back/forward or initial load
  const syncFromUrl = useCallback(() => {
    if (typeof window === 'undefined') return;
    const resolved = resolvePath(window.location.pathname);
    setCurrentPath(resolved);

    const config = ROUTES[resolved];
    if (config) {
      document.title = config.title;
      onNavigate(config.tab, config.role);
    }
  }, [onNavigate]);

  // Push new URL without full page reload
  const navigateTo = useCallback(
    (targetPath: string, replace = false) => {
      if (typeof window === 'undefined') return;
      const canonical = resolvePath(targetPath);
      const config = ROUTES[canonical];

      if (window.location.pathname !== canonical) {
        if (replace) {
          window.history.replaceState({ path: canonical }, '', canonical);
        } else {
          window.history.pushState({ path: canonical }, '', canonical);
        }
      }

      setCurrentPath(canonical);
      if (config) {
        document.title = config.title;
        onNavigate(config.tab, config.role);
      }
    },
    [onNavigate]
  );

  // Initialize and listen to popstate
  useEffect(() => {
    // Initial sync
    syncFromUrl();

    const handlePopState = () => {
      syncFromUrl();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [syncFromUrl]);

  return {
    currentPath,
    currentConfig: ROUTES[currentPath] || ROUTES['/dashboard'],
    navigateTo,
  };
};
