export type Tier = 'A' | 'B' | 'C';

export type Mode = 'Tatap Muka' | 'Hybrid' | 'Online';

export type ClusterId = 'prioritas' | 'eksekutif_finalis' | 'eksekutif_kti' | 'reguler';

export interface ClusterInfo {
  id: ClusterId;
  name: string;
  floor: Tier;
  ceiling: Tier;
  maxCost: number; // 0 for unlimited
  defaultMode: Mode;
  description: string;
  ruleNote: string;
}

export interface Mentor {
  id: string; // e.g. "M-001"
  name: string;
  tier: Tier;
  mqiScore: number;
  experience: number; // 1-5
  portfolio: number; // 1-5
  ipm: number; // 3.4 - 5.0
  city: string;
  field: 'Saintek' | 'Soshum / IPS' | 'Lingkungan' | 'Robotika & IoT' | 'Kesehatan';
  maxQuota: number;
  assignedCount: number;
  isBurnoutRisk?: boolean;
  avatarUrl?: string;
  specialization: string;
}

export interface AvailabilitySlot {
  id: string;
  dayName: string; // e.g. "Sabtu"
  dateStr: string; // e.g. "2025-05-24"
  formattedDate: string; // e.g. "Sabtu, 24 Mei 2025"
  timeSlot: string; // e.g. "09:00 – 12:00 WIB"
  status: 'Tersedia' | 'Terisi' | 'Tidak Tersedia';
  modePreference: 'Tatap Muka & Hybrid' | 'Hanya Online' | 'Tatap Muka Lab';
  notes?: string;
}

export interface RescheduleRequest {
  id: string;
  teamId: string;
  teamName: string;
  schoolName: string;
  mentorId: string;
  mentorName: string;
  requestedDate: string; // e.g. '2025-05-24'
  requestedTimeSlot: string; // e.g. '09:00 – 12:00 WIB'
  originalSchedule: string; // e.g. 'Sabtu, 17 Mei 2025 • 09:00 WIB'
  reason: string;
  status: 'Menunggu Persetujuan' | 'Disetujui' | 'Ditolak';
  timestamp: string;
}

export interface ResearchTeam {
  id: string; // e.g. "T-001"
  name: string; // e.g. "Bio-Inovasi"
  school: string; // e.g. "SMA 1 Surabaya"
  city: string;
  cluster: ClusterId;
  clusterName: string;
  field: 'Saintek' | 'Soshum / IPS' | 'Lingkungan' | 'Robotika & IoT' | 'Kesehatan';
  primaryMentorId?: string;
  backupMentorId?: string;
  mode: Mode;
  status: 'Aktif' | 'Pending' | 'Selesai';
  similarityScore?: number;
}

export interface SystemAlert {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  routeOrTarget?: string;
  dotColor: string;
}

export interface SystemActivity {
  id: string;
  time: string;
  title: string;
  actor: string;
  dotColor: string;
  type: 'allocation' | 'surge' | 'reoptimize' | 'absence';
}

export interface ModelParameters {
  maxUtilizationRho: number; // e.g. 0.83 (83%)
  similarityThresholdTheta: number; // e.g. 0.80
  fallbackSimilarityTheta2: number; // e.g. 0.70
  tierDelta: number; // e.g. 0.05
  weightExperience: number; // 0.281
  weightPortfolio: number; // 0.340
  weightIPM: number; // 0.379
  slaExecutive: number; // 300000
  slaRegular: number; // 50000
}

export type UserRole = 'Allocation owner' | 'Koordinator wilayah' | 'Mentor' | 'Sekolah';
