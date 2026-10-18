import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  ChevronDown, 
  ShieldCheck, 
  UserCheck, 
  School, 
  GraduationCap,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  Menu
} from 'lucide-react';
import { UserRole, SystemAlert } from '../types/rawon';
import { RetroRawonWordmark } from './RawonLogo';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onNavigatePath?: (path: string) => void;
  alerts: SystemAlert[];
  onOpenAlertsModal: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onNavigatePath,
  alerts,
  onOpenAlertsModal,
  onToggleMobileMenu,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showAlertDrawer, setShowAlertDrawer] = useState(false);

  const roles: { role: UserRole; icon: React.ElementType; label: string; portalPath: string }[] = [
    { role: 'Allocation owner', icon: ShieldCheck, label: 'Allocation Owner (Admin)', portalPath: '/dashboard' },
    { role: 'Koordinator wilayah', icon: UserCheck, label: 'Koordinator Wilayah', portalPath: '/portal/koordinator' },
    { role: 'Mentor', icon: GraduationCap, label: 'Mentor Riset', portalPath: '/portal/mentor' },
    { role: 'Sekolah', icon: School, label: 'Sekolah Mitra', portalPath: '/portal/sekolah' },
  ];

  const rolePersonas: Record<UserRole, {
    name: string;
    title: string;
    greetingName: string;
    tagline: string;
    avatar: string;
  }> = {
    'Allocation owner': {
      name: 'Sarah Anindita',
      title: 'Allocation Owner (Admin)',
      greetingName: 'Sarah',
      tagline: 'RAWON membantu Anda mengalokasikan mentor terbaik untuk setiap tim riset secara optimal, efisien, dan tangguh terhadap gangguan.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    },
    'Koordinator wilayah': {
      name: 'Budi Hartono, S.T.',
      title: 'Koordinator Wilayah Jawa Timur',
      greetingName: 'Pak Budi',
      tagline: 'Pemantauan kehadiran sesi H-3, input tarif transportasi lokal terkini, dan persetujuan pengganti darurat wilayah Surabaya-Malang.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    },
    'Mentor': {
      name: 'Dr. Maya Lestari, M.Sc.',
      title: 'Mentor Riset (Tier A)',
      greetingName: 'Dr. Maya',
      tagline: 'Portal penugasan tim bimbingan, konfirmasi kesiapan H-3, dan pengaturan batas beban kerja pribadi (maksimal 83%).',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    'Sekolah': {
      name: 'Drs. Bambang Supriyadi',
      title: 'Sekolah Mitra (SMA 1 Surabaya)',
      greetingName: 'Pak Bambang',
      tagline: 'Jadwal pendampingan riset tim sekolah, profil mentor utama dan cadangan, serta formulir pengajuan rescheduling.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
  };

  const persona = rolePersonas[currentRole];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e3e9e7] px-4 sm:px-8 py-3.5 sm:py-5 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        {/* Left greeting and mobile toggle */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Hamburger Button on Mobile */}
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl border border-[#e3e9e7] bg-[#f7f8f7] text-[#202b2a] hover:bg-[#e3e9e7] transition-colors cursor-pointer shrink-0"
              aria-label="Buka navigasi menu"
            >
              <Menu className="w-5 h-5 text-[#202b2a]" />
            </button>

            {/* Mobile Retro Wordmark Logo */}
            <div className="lg:hidden shrink-0 flex items-center pr-1">
              <RetroRawonWordmark size="sm" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-[#202b2a] flex items-center gap-1.5">
                  Selamat datang, {persona.greetingName}! <span className="text-base sm:text-xl">👋</span>
                </h1>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#117d78] bg-[#e1f4f0] px-2 sm:px-2.5 py-0.5 rounded-full border border-[#117d78]/20">
                  by EduTech X
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold text-[#ce4915] bg-[#ffebe4] px-2 py-0.5 rounded-full border border-[#ce4915]/20">
                  {persona.title}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#6c7a78] mt-0.5 sm:mt-1 max-w-2xl leading-relaxed line-clamp-1 sm:line-clamp-none">
                {persona.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 shrink-0">
          {/* Role switcher preview badge */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 px-3 py-2 bg-[#f7f8f7] hover:bg-[#e1f4f0] text-[#117d78] text-xs font-semibold rounded-xl border border-[#e3e9e7] transition-all cursor-pointer"
              title="Ganti mode simulasi peran"
            >
              <span className="w-2 h-2 rounded-full bg-[#117d78] animate-pulse" />
              <span>Peran: {currentRole}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-[calc(100vw-2.5rem)] sm:w-64 max-w-xs bg-white rounded-2xl shadow-xl border border-[#e3e9e7] p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-[#6c7a78] uppercase tracking-wider">
                  Simulasi Perspektif Pengguna
                </div>
                {roles.map(({ role, icon: Icon, label, portalPath }) => (
                  <a
                    key={role}
                    href={portalPath}
                    onClick={(e) => {
                      e.preventDefault();
                      onRoleChange(role);
                      if (onNavigatePath) {
                        onNavigatePath(portalPath);
                      }
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl text-left transition-colors cursor-pointer no-underline ${
                      currentRole === role
                        ? 'bg-[#ffebe4] text-[#ce4915] font-semibold'
                        : 'text-[#202b2a] hover:bg-[#f7f8f7]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Date Picker Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-[#ffffff] border border-[#e3e9e7] rounded-xl text-xs font-medium text-[#202b2a] shadow-xs">
            <Calendar className="w-4 h-4 text-[#ce4915]" />
            <span>Rabu, 14 Mei 2025</span>
            <ChevronDown className="w-3 h-3 text-[#6c7a78]" />
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowAlertDrawer(!showAlertDrawer)}
              className="relative p-2.5 rounded-xl border border-[#e3e9e7] bg-white hover:bg-[#f7f8f7] text-[#202b2a] transition-colors cursor-pointer"
              title="Notifikasi & Tugas"
            >
              <Bell className="w-4 h-4 text-[#6c7a78]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ce4915] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                3
              </span>
            </button>

            {showAlertDrawer && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-white rounded-2xl shadow-2xl border border-[#e3e9e7] p-4 z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-[#e3e9e7] mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#202b2a]">Tugas & Peringatan Sistem</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#ffebe4] text-[#ce4915] font-bold">
                      {alerts.length} baru
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAlertDrawer(false)}
                    className="text-[#6c7a78] hover:text-[#202b2a]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 rounded-xl border border-[#e3e9e7] hover:border-[#ce4915]/40 transition-colors bg-[#f7f8f7]"
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                          style={{ backgroundColor: alert.dotColor }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-semibold text-[#202b2a]">{alert.title}</h4>
                            <span className="text-[10px] text-[#6c7a78]">{alert.timeAgo}</span>
                          </div>
                          <p className="text-xs text-[#6c7a78] mt-1 leading-snug">{alert.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setShowAlertDrawer(false);
                    onOpenAlertsModal();
                  }}
                  className="w-full mt-3 py-2 text-center text-xs font-semibold text-[#ce4915] hover:bg-[#ffebe4] rounded-xl transition-colors cursor-pointer"
                >
                  Buka Pusat Gangguan Lengkap →
                </button>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-2 border-l border-[#e3e9e7]">
            <img
              src={persona.avatar}
              alt={persona.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#ce4915]/20"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-[#202b2a]">{persona.name}</div>
              <div className="text-[11px] text-[#6c7a78] flex items-center gap-1">
                {persona.title.split('(')[0]} <ChevronDown className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
