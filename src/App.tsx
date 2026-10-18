import React, { useState } from 'react';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { AllocationBoardView } from './components/AllocationBoardView';
import { MentorsView } from './components/MentorsView';
import { TeamsView } from './components/TeamsView';
import { DisruptionSimulatorView } from './components/DisruptionSimulatorView';
import { ReportsView } from './components/ReportsView';
import { RolesView } from './components/RolesView';
import { SettingsView } from './components/SettingsView';
import { ContactModal } from './components/ContactModal';
import { CoordinatorView } from './components/roles/CoordinatorView';
import { MentorPortalView } from './components/roles/MentorPortalView';
import { SchoolPortalView } from './components/roles/SchoolPortalView';
import { Link2, Check } from 'lucide-react';
import { useAppRouter, getPathForTabAndRole } from './router';
import { 
  ALL_70_MENTORS, 
  PILOT_20_TEAMS, 
  SYSTEM_ALERTS, 
  SYSTEM_ACTIVITIES, 
  DEFAULT_PARAMETERS,
  CLUSTERS,
  INITIAL_AVAILABILITY_SLOTS,
  INITIAL_RESCHEDULE_REQUESTS
} from './data/rawonData';
import { ResearchTeam, Mentor, SystemAlert, SystemActivity, ModelParameters, UserRole, AvailabilitySlot, RescheduleRequest } from './types/rawon';

// Generate remaining teams up to 120 teams for full scale mode
const generateFull120Teams = (): ResearchTeam[] => {
  const fullTeams: ResearchTeam[] = [...PILOT_20_TEAMS];
  const cities = ['Jakarta', 'Surabaya', 'Bandung', 'Yogyakarta', 'Malang', 'Semarang', 'Bogor'];
  const fields: Array<'Saintek' | 'Soshum / IPS' | 'Lingkungan' | 'Robotika & IoT' | 'Kesehatan'> = [
    'Saintek', 'Soshum / IPS', 'Lingkungan', 'Robotika & IoT', 'Kesehatan'
  ];
  const clusters: Array<'prioritas' | 'eksekutif_finalis' | 'eksekutif_kti' | 'reguler'> = [
    'prioritas', 'eksekutif_finalis', 'eksekutif_kti', 'reguler'
  ];

  for (let i = 21; i <= 120; i++) {
    const id = `T-${String(i).padStart(3, '0')}`;
    const city = cities[i % cities.length];
    const field = fields[i % fields.length];
    // 55% Prioritas, 28% Eksekutif, 17% Reguler
    const cluster = i <= 66 
      ? 'prioritas' 
      : i <= 100 
      ? (i % 2 === 0 ? 'eksekutif_finalis' : 'eksekutif_kti') 
      : 'reguler';
    
    const clusterInfo = CLUSTERS[cluster];
    const schoolNum = (i % 35) + 1;

    fullTeams.push({
      id,
      name: `Tim Riset ${field} ${i}`,
      school: `SMA Mitra ${schoolNum} ${city}`,
      city,
      cluster,
      clusterName: clusterInfo.name,
      field,
      mode: cluster === 'prioritas' ? 'Tatap Muka' : cluster.includes('eksekutif') ? 'Hybrid' : 'Online',
      status: 'Aktif',
      similarityScore: 0.88,
    });
  }

  return fullTeams;
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('Allocation owner');
  const [copySuccess, setCopySuccess] = useState(false);

  // Synchronize state with URL via useAppRouter
  const handleRouterNavigate = React.useCallback((tab: NavigationTab, role?: UserRole) => {
    setCurrentTab(tab);
    if (role) {
      setCurrentRole(role);
    }
  }, []);

  const { currentPath, currentConfig, navigateTo } = useAppRouter(
    currentTab,
    currentRole,
    handleRouterNavigate
  );

  const handleTabChange = (tab: NavigationTab) => {
    const targetPath = getPathForTabAndRole(tab, currentRole);
    navigateTo(targetPath);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    const targetPath = getPathForTabAndRole('dashboard', newRole);
    navigateTo(targetPath);
  };

  const [mentors, setMentors] = useState<Mentor[]>(ALL_70_MENTORS);
  const [teams, setTeams] = useState<ResearchTeam[]>(generateFull120Teams());
  const [alerts, setAlerts] = useState<SystemAlert[]>(SYSTEM_ALERTS);
  const [activities, setActivities] = useState<SystemActivity[]>(SYSTEM_ACTIVITIES);
  const [parameters, setParameters] = useState<ModelParameters>(DEFAULT_PARAMETERS);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>(INITIAL_AVAILABILITY_SLOTS);
  const [rescheduleRequests, setRescheduleRequests] = useState<RescheduleRequest[]>(INITIAL_RESCHEDULE_REQUESTS);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSolving, setIsSolving] = useState(false);

  // Reschedule handlers
  const handleApproveReschedule = (requestId: string) => {
    setRescheduleRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Disetujui' } : r))
    );
    const req = rescheduleRequests.find((r) => r.id === requestId);
    if (req) {
      setAvailabilitySlots((prev) =>
        prev.map((s) =>
          s.dateStr === req.requestedDate
            ? { ...s, status: 'Terisi', notes: `Bimbingan ${req.teamName} (${req.schoolName})` }
            : s
        )
      );
      const newAct: SystemActivity = {
        id: `act-${Date.now()}`,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        title: `Reschedule Disetujui: Tim ${req.teamName} pindah ke ${req.requestedDate}`,
        actor: 'Dr. Maya Lestari (Mentor)',
        dotColor: '#117d78',
        type: 'allocation',
      };
      setActivities((prev) => [newAct, ...prev]);
    }
  };

  const handleRejectReschedule = (requestId: string) => {
    setRescheduleRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Ditolak' } : r))
    );
  };

  const handleAddRescheduleRequest = (newReq: RescheduleRequest) => {
    setRescheduleRequests((prev) => [newReq, ...prev]);
    const newAct: SystemActivity = {
      id: `act-${Date.now()}`,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      title: `Permohonan Reschedule Baru: Tim ${newReq.teamName} (${newReq.schoolName})`,
      actor: `${newReq.schoolName}`,
      dotColor: '#ff9900',
      type: 'absence',
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // Update a team's assignment
  const handleUpdateTeam = (teamId: string, updates: Partial<ResearchTeam>) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, ...updates } : t))
    );
  };

  // Reset board
  const handleResetBoard = () => {
    setTeams((prev) =>
      prev.map((t) => ({
        ...t,
        primaryMentorId: undefined,
        backupMentorId: undefined,
      }))
    );
  };

  // Run MILP Auto-Solve Algorithm
  const handleRunAutoSolve = () => {
    setIsSolving(true);

    setTimeout(() => {
      // Intelligently assign mentors respecting all constraints:
      // 1. Prioritas -> Tier A only, unique backup in Tier A
      // 2. Eksekutif Finalis -> Tier B or A
      // 3. Eksekutif KTI -> Tier B only (Tier A prohibited)
      // 4. Reguler -> Tier C or B (Tier A prohibited)
      const tierAMentors = mentors.filter((m) => m.tier === 'A');
      const tierBMentors = mentors.filter((m) => m.tier === 'B');
      const tierCMentors = mentors.filter((m) => m.tier === 'C');

      const updated = teams.map((team, idx) => {
        let primary: Mentor | undefined;
        let backup: Mentor | undefined;

        if (team.cluster === 'prioritas') {
          // Special handling for IPS teams in Jakarta / Surabaya
          if (team.field === 'Soshum / IPS') {
            if (team.id === 'T-011') {
              primary = mentors.find((m) => m.id === 'M-017');
              backup = mentors.find((m) => m.id === 'M-011');
            } else {
              primary = mentors.find((m) => m.id === 'M-011');
              backup = mentors.find((m) => m.id === 'M-017');
            }
          } else {
            // Find tier A mentor matching field or city
            const pool = tierAMentors.filter((m) => m.field === team.field || m.city === team.city);
            primary = pool.length > 0 ? pool[idx % pool.length] : tierAMentors[idx % tierAMentors.length];
            // Distinct backup
            const bPool = tierAMentors.filter((m) => m.id !== primary?.id);
            backup = bPool[(idx + 1) % bPool.length];
          }
        } else if (team.cluster === 'eksekutif_finalis') {
          // Allowed Tier B or Tier A
          primary = tierBMentors[idx % tierBMentors.length];
          const bPool = [...tierBMentors, ...tierAMentors].filter((m) => m.id !== primary?.id);
          backup = bPool[(idx + 1) % bPool.length];
        } else if (team.cluster === 'eksekutif_kti') {
          // STRICTLY TIER B ONLY
          primary = tierBMentors[idx % tierBMentors.length];
          const bPool = tierBMentors.filter((m) => m.id !== primary?.id);
          backup = bPool[(idx + 1) % bPool.length];
        } else {
          // Reguler: STRICTLY TIER C or B
          primary = tierCMentors[idx % tierCMentors.length];
          const bPool = [...tierCMentors, ...tierBMentors].filter((m) => m.id !== primary?.id);
          backup = bPool[(idx + 1) % bPool.length];
        }

        return {
          ...team,
          primaryMentorId: primary?.id,
          backupMentorId: backup?.id,
          status: 'Aktif' as const,
        };
      });

      setTeams(updated);
      setIsSolving(false);

      // Append new system activity
      const newAct: SystemActivity = {
        id: `act-${Date.now()}`,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        title: 'Auto-Solve MILP berhasil dijalankan untuk seluruh tim binaan.',
        actor: 'RAWON Optimization Engine',
        dotColor: '#117d78',
        type: 'reoptimize',
      };
      setActivities((prev) => [newAct, ...prev]);
    }, 1200);
  };

  // Add new mentor
  const handleAddMentor = (newMentor: Mentor) => {
    setMentors((prev) => [newMentor, ...prev]);
  };

  // Trigger mitigation from simulator
  const handleTriggerMitigation = (scenarioTitle: string) => {
    const newAct: SystemActivity = {
      id: `act-${Date.now()}`,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      title: `SOP Terpicu: ${scenarioTitle}`,
      actor: `${currentRole}`,
      dotColor: '#ce4915',
      type: 'surge',
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#f7f8f7] text-[#202b2a] flex font-sans antialiased">
      {/* Fixed Left Sidebar with role-tailored menus */}
      <Sidebar
        currentTab={currentTab}
        currentRole={currentRole}
        currentPath={currentPath}
        onSelectTab={handleTabChange}
        onNavigatePath={(path) => navigateTo(path)}
        onOpenSupportModal={() => setIsContactModalOpen(true)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header with dynamic role persona */}
        <Header
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          onNavigatePath={(path) => navigateTo(path)}
          alerts={alerts}
          onOpenAlertsModal={() => navigateTo('/gangguan')}
          onToggleMobileMenu={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Role Context & Permissions Notification Bar */}
        <div className="bg-[#fff2dc] border-b border-[#ff9900]/30 px-4 sm:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#9b6200]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff9900] animate-pulse" />
            <span>
              <strong>Mode Aktif: {currentRole}</strong> —{' '}
              {currentRole === 'Allocation owner'
                ? 'Hak akses penuh admin (kunci solver MILP, kelola 120 tim nasional, atur parameter matematis).'
                : currentRole === 'Koordinator wilayah'
                ? 'Akses operasional wilayah Jawa Timur (input tarif aktual, konfirmasi kesiapan H-3, persetujuan pengganti lokal).'
                : currentRole === 'Mentor'
                ? 'Portal mandiri mentor (konfirmasi sesi H-3, pelaporan sinyal burnout, pembatas beban kerja ≤ 83%).'
                : 'Portal sekolah mitra (jadwal tim sekolah, profil mentor bimbingan, pengajuan reschedule dengan peringatan beban).'}
            </span>
          </div>
          <button
            onClick={() => navigateTo('/laporan')}
            className="text-[11px] font-bold text-[#ce4915] hover:underline shrink-0 text-left cursor-pointer"
          >
            Lihat Matriks Peran Lengkap →
          </button>
        </div>

        {/* Tab Content depending on role & tab */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-[1500px] w-full mx-auto">
          {/* Dynamic Breadcrumbs & URL Bar for MPA Experience */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#e3e9e7]">
            <div className="flex items-center flex-wrap gap-2 text-xs">
              <nav className="flex items-center gap-1.5 text-[#6c7a78]" aria-label="Breadcrumb">
                <a
                  href="/dashboard"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/dashboard');
                  }}
                  className="hover:text-[#ce4915] transition-colors font-medium flex items-center gap-1"
                >
                  <span>RAWON</span>
                </a>
                {currentConfig.breadcrumb.map((crumb, idx) => {
                  const isLast = idx === currentConfig.breadcrumb.length - 1;
                  return (
                    <React.Fragment key={crumb}>
                      <span className="text-[#a4b3b1]">/</span>
                      <span className={isLast ? 'font-semibold text-[#202b2a]' : 'hover:text-[#ce4915] cursor-pointer'}>
                        {crumb}
                      </span>
                    </React.Fragment>
                  );
                })}
              </nav>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#e1f4f0] text-[#117d78] border border-[#117d78]/20">
                {currentConfig.badge}
              </span>
            </div>

            {/* Active Canonical URL Pill with Copy Link */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#e3e9e7] rounded-lg text-xs font-mono text-[#6c7a78] shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#117d78]" />
                <span className="font-semibold text-[#202b2a]">{currentPath}</span>
              </div>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    navigator.clipboard?.writeText(window.location.href);
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                  }
                }}
                className="p-1.5 px-2.5 bg-white hover:bg-[#f7f8f7] border border-[#e3e9e7] rounded-lg text-[11px] font-medium text-[#202b2a] transition-colors cursor-pointer flex items-center gap-1"
                title="Salin tautan halaman ini"
              >
                {copySuccess ? <Check className="w-3.5 h-3.5 text-[#117d78]" /> : <Link2 className="w-3.5 h-3.5 text-[#6c7a78]" />}
                <span>{copySuccess ? 'Tersalin!' : 'Salin URL'}</span>
              </button>
            </div>
          </div>
          {/* KOORDINATOR WILAYAH SPECIFIC VIEWS */}
          {currentRole === 'Koordinator wilayah' && (
            <>
              {currentTab === 'dashboard' && (
                <CoordinatorView
                  teams={teams}
                  mentors={mentors}
                  onTriggerAlert={handleTriggerMitigation}
                />
              )}
              {currentTab === 'teams' && (
                <TeamsView
                  teams={teams.filter((t) => t.city === 'Surabaya' || t.city === 'Malang')}
                  mentors={mentors}
                />
              )}
              {currentTab === 'board' && (
                <AllocationBoardView
                  teams={teams}
                  mentors={mentors}
                  onUpdateTeam={handleUpdateTeam}
                  onRunAutoSolve={handleRunAutoSolve}
                  onResetBoard={handleResetBoard}
                  isSolving={isSolving}
                />
              )}
              {currentTab === 'disruptions' && (
                <DisruptionSimulatorView
                  alerts={alerts}
                  onTriggerMitigation={handleTriggerMitigation}
                />
              )}
              {currentTab === 'reports' && (
                <ReportsView />
              )}
            </>
          )}

          {/* MENTOR SPECIFIC VIEWS */}
          {currentRole === 'Mentor' && (
            <>
              {currentTab === 'dashboard' && (
                <MentorPortalView
                  mentor={mentors.find((m) => m.id === 'M-012')}
                  assignedTeams={teams.filter((t) => t.primaryMentorId === 'M-012')}
                  availabilitySlots={availabilitySlots}
                  rescheduleRequests={rescheduleRequests}
                  onUpdateAvailability={setAvailabilitySlots}
                  onApproveReschedule={handleApproveReschedule}
                  onRejectReschedule={handleRejectReschedule}
                  onTriggerAlert={handleTriggerMitigation}
                />
              )}
              {currentTab === 'teams' && (
                <TeamsView
                  teams={teams.filter((t) => t.primaryMentorId === 'M-012' || t.id === 'T-001')}
                  mentors={mentors}
                />
              )}
              {currentTab === 'disruptions' && (
                <MentorPortalView
                  mentor={mentors.find((m) => m.id === 'M-012')}
                  assignedTeams={teams.filter((t) => t.primaryMentorId === 'M-012')}
                  availabilitySlots={availabilitySlots}
                  rescheduleRequests={rescheduleRequests}
                  onUpdateAvailability={setAvailabilitySlots}
                  onApproveReschedule={handleApproveReschedule}
                  onRejectReschedule={handleRejectReschedule}
                  onTriggerAlert={handleTriggerMitigation}
                />
              )}
            </>
          )}

          {/* SEKOLAH MITRA SPECIFIC VIEWS */}
          {currentRole === 'Sekolah' && (
            <>
              {currentTab === 'dashboard' && (
                <SchoolPortalView
                  schoolName="SMA 1 Surabaya"
                  teams={teams}
                  mentors={mentors}
                  availabilitySlots={availabilitySlots}
                  onSubmitRescheduleRequest={handleAddRescheduleRequest}
                  onTriggerAlert={handleTriggerMitigation}
                />
              )}
              {currentTab === 'teams' && (
                <TeamsView
                  teams={teams.filter((t) => t.school.toLowerCase().includes('surabaya') || t.id === 'T-001')}
                  mentors={mentors}
                />
              )}
              {currentTab === 'mentors' && (
                <SchoolPortalView
                  schoolName="SMA 1 Surabaya"
                  teams={teams}
                  mentors={mentors}
                  availabilitySlots={availabilitySlots}
                  onSubmitRescheduleRequest={handleAddRescheduleRequest}
                  onTriggerAlert={handleTriggerMitigation}
                />
              )}
              {currentTab === 'disruptions' && (
                <SchoolPortalView
                  schoolName="SMA 1 Surabaya"
                  teams={teams}
                  mentors={mentors}
                  availabilitySlots={availabilitySlots}
                  onSubmitRescheduleRequest={handleAddRescheduleRequest}
                  onTriggerAlert={handleTriggerMitigation}
                />
              )}
            </>
          )}

          {/* ALLOCATION OWNER (ADMIN) - FULL ACCESS */}
          {currentRole === 'Allocation owner' && (
            <>
              {currentTab === 'dashboard' && (
                <DashboardView
                  alerts={alerts}
                  activities={activities}
                  recentAllocations={teams}
                  onNavigate={handleTabChange}
                  onSolveOptimization={handleRunAutoSolve}
                  isSolving={isSolving}
                />
              )}

              {currentTab === 'board' && (
                <AllocationBoardView
                  teams={teams}
                  mentors={mentors}
                  onUpdateTeam={handleUpdateTeam}
                  onRunAutoSolve={handleRunAutoSolve}
                  onResetBoard={handleResetBoard}
                  isSolving={isSolving}
                />
              )}

              {currentTab === 'mentors' && (
                <MentorsView
                  mentors={mentors}
                  onAddMentor={handleAddMentor}
                />
              )}

              {currentTab === 'teams' && (
                <TeamsView
                  teams={teams}
                  mentors={mentors}
                />
              )}

              {currentTab === 'disruptions' && (
                <DisruptionSimulatorView
                  alerts={alerts}
                  onTriggerMitigation={handleTriggerMitigation}
                />
              )}

              {currentTab === 'reports' && (
                <ReportsView />
              )}

              {currentTab === 'settings' && (
                <SettingsView
                  parameters={parameters}
                  onUpdateParameters={setParameters}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Support / Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}
