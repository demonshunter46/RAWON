import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  TableProperties, 
  AlertTriangle, 
  FileText, 
  Settings, 
  Headphones,
  Compass,
  Sparkles,
  X
} from 'lucide-react';

import { RawonLogo } from './RawonLogo';
import { UserRole } from '../types/rawon';
import { getPathForTabAndRole } from '../router';

export type NavigationTab = 
  | 'dashboard' 
  | 'mentors' 
  | 'teams' 
  | 'board' 
  | 'disruptions' 
  | 'reports' 
  | 'settings';

interface SidebarProps {
  currentTab: NavigationTab;
  currentRole: UserRole;
  currentPath?: string;
  onSelectTab: (tab: NavigationTab) => void;
  onNavigatePath?: (path: string) => void;
  onOpenSupportModal: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  currentRole,
  currentPath,
  onSelectTab,
  onNavigatePath,
  onOpenSupportModal,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  // Menu items adapted dynamically to active role
  const getMenuItems = () => {
    if (currentRole === 'Koordinator wilayah') {
      return [
        { id: 'dashboard' as NavigationTab, label: 'Dashboard Wilayah', icon: LayoutDashboard },
        { id: 'teams' as NavigationTab, label: 'Tim & Sekolah Jatim', icon: GraduationCap },
        { id: 'board' as NavigationTab, label: 'Papan Alokasi Lokal', icon: TableProperties },
        { id: 'disruptions' as NavigationTab, label: 'Pantau Tarif & SOP', icon: AlertTriangle },
        { id: 'reports' as NavigationTab, label: 'Laporan Efisiensi', icon: FileText },
      ];
    }
    if (currentRole === 'Mentor') {
      return [
        { id: 'dashboard' as NavigationTab, label: 'Portal Mentor', icon: LayoutDashboard },
        { id: 'teams' as NavigationTab, label: 'Tim Bimbingan Saya', icon: GraduationCap },
        { id: 'disruptions' as NavigationTab, label: 'Beban & Burnout', icon: AlertTriangle },
      ];
    }
    if (currentRole === 'Sekolah') {
      return [
        { id: 'dashboard' as NavigationTab, label: 'Portal Sekolah', icon: LayoutDashboard },
        { id: 'teams' as NavigationTab, label: 'Tim Riset Sekolah', icon: GraduationCap },
        { id: 'mentors' as NavigationTab, label: 'Profil Mentor', icon: Users },
        { id: 'disruptions' as NavigationTab, label: 'Jadwal & Rescheduling', icon: AlertTriangle },
      ];
    }
    // Default Allocation Owner (Admin)
    return [
      { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: LayoutDashboard },
      { id: 'mentors' as NavigationTab, label: 'Mentor', icon: Users },
      { id: 'teams' as NavigationTab, label: 'Tim Riset', icon: GraduationCap },
      { id: 'board' as NavigationTab, label: 'Papan Alokasi', icon: TableProperties },
      { id: 'disruptions' as NavigationTab, label: 'Gangguan', icon: AlertTriangle },
      { id: 'reports' as NavigationTab, label: 'Laporan', icon: FileText },
      { id: 'settings' as NavigationTab, label: 'Pengaturan', icon: Settings },
    ];
  };

  const menuItems = getMenuItems();

  const handleItemClick = (id: NavigationTab, path: string, isMobileView: boolean) => {
    if (onNavigatePath) {
      onNavigatePath(path);
    } else {
      onSelectTab(id);
    }
    if (isMobileView && onCloseMobile) onCloseMobile();
  };

  const renderContent = (isMobileView = false) => (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-6 px-1">
          <a 
            href={currentRole === 'Allocation owner' ? '/dashboard' : getPathForTabAndRole('dashboard', currentRole)}
            className="cursor-pointer hover:opacity-90 transition-opacity block" 
            onClick={(e) => {
              e.preventDefault();
              handleItemClick('dashboard', getPathForTabAndRole('dashboard', currentRole), isMobileView);
            }}
            title="Ke Dashboard RAWON"
          >
            <RawonLogo size="md" showSubtitle={true} />
          </a>

          {isMobileView && onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-2 rounded-xl text-[#6c7a78] hover:text-[#202b2a] hover:bg-[#f7f8f7] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links with real hrefs for MPA URL support */}
        <nav className="space-y-1.5" aria-label="Navigasi Halaman Utama">
          {menuItems.map(({ id, label, icon: Icon }) => {
            const path = getPathForTabAndRole(id, currentRole);
            const isActive = currentTab === id;
            return (
              <a
                key={id}
                href={path}
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(id, path, isMobileView);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left cursor-pointer no-underline ${
                  isActive
                    ? 'bg-[#ce4915] text-white font-semibold shadow-md shadow-[#ce4915]/25'
                    : 'text-[#6c7a78] hover:bg-[#f7f8f7] hover:text-[#202b2a]'
                }`}
                title={`${label} (${path})`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-[#6c7a78]'}`} />
                <span className="truncate">{label}</span>
                {id === 'disruptions' && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-[#ff9900] shrink-0" />
                )}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Support Card at bottom */}
      <div className="mt-8 bg-[#f7f8f7] border border-[#e3e9e7] rounded-2xl p-4 text-center relative overflow-hidden">
        <div className="w-11 h-11 rounded-full bg-white border border-[#e3e9e7] flex items-center justify-center mx-auto mb-2 shadow-xs">
          <Headphones className="w-5 h-5 text-[#202b2a]" />
        </div>
        <h4 className="text-xs font-bold text-[#202b2a]">Butuh bantuan?</h4>
        <p className="text-[11px] text-[#6c7a78] mt-0.5 leading-snug">
          Tim support RAWON siap membantu Anda.
        </p>
        <button
          onClick={() => {
            onOpenSupportModal();
            if (isMobileView && onCloseMobile) onCloseMobile();
          }}
          className="mt-3 w-full py-2 px-3 bg-[#117d78] hover:bg-[#0e6b66] text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
        >
          Hubungi Kami
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-[#e3e9e7] min-h-screen flex-col justify-between p-5 shrink-0 select-none">
        {renderContent(false)}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer content */}
          <div className="relative w-4/5 max-w-xs bg-white h-full p-5 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
