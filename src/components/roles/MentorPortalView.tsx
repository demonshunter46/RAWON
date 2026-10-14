import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sliders, 
  Send, 
  BookOpen, 
  ShieldCheck, 
  FileText,
  UserCheck,
  CalendarCheck2,
  PlusCircle,
  MapPin,
  Laptop,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Check,
  X,
  CalendarDays,
  Sparkles,
  Smartphone,
  Layers,
  ArrowRight,
  RefreshCw,
  BellRing
} from 'lucide-react';
import { ResearchTeam, Mentor, AvailabilitySlot, RescheduleRequest } from '../../types/rawon';
import { INITIAL_AVAILABILITY_SLOTS } from '../../data/rawonData';

interface MentorPortalViewProps {
  mentor?: Mentor;
  assignedTeams: ResearchTeam[];
  availabilitySlots?: AvailabilitySlot[];
  rescheduleRequests?: RescheduleRequest[];
  onUpdateAvailability?: (slots: AvailabilitySlot[]) => void;
  onApproveReschedule?: (requestId: string) => void;
  onRejectReschedule?: (requestId: string) => void;
  onTriggerAlert: (msg: string) => void;
}

export const MentorPortalView: React.FC<MentorPortalViewProps> = ({
  mentor,
  assignedTeams,
  availabilitySlots = INITIAL_AVAILABILITY_SLOTS,
  rescheduleRequests = [],
  onUpdateAvailability,
  onApproveReschedule,
  onRejectReschedule,
  onTriggerAlert,
}) => {
  // Current logged in mentor fallback (Dr. Maya Lestari)
  const currentMentor = mentor || {
    id: 'M-012',
    name: 'Dr. Maya Lestari, M.Sc.',
    tier: 'A',
    mqiScore: 0.942,
    city: 'Surabaya',
    field: 'Saintek',
    specialization: 'Biomolekuler & Nano-material',
    maxQuota: 8,
    assignedCount: 4,
  };

  // Availability Slots State synchronized with props
  const [slots, setSlots] = useState<AvailabilitySlot[]>(availabilitySlots);

  useEffect(() => {
    if (availabilitySlots) {
      setSlots(availabilitySlots);
    }
  }, [availabilitySlots]);

  // Calendar view mode: 'grid' (Tabel Mingguan) vs 'agenda' (Optimal untuk HP)
  const [calendarViewMode, setCalendarViewMode] = useState<'agenda' | 'grid'>('agenda');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(1); // Default to Monday or Tuesday
  const [selectedWeekOffset, setSelectedWeekOffset] = useState<number>(0); // 0 = week of 19-25 May 2025

  // Form for new slot
  const [newDateStr, setNewDateStr] = useState<string>('2025-05-24');
  const [newTimeSlot, setNewTimeSlot] = useState<string>('09:00 – 12:00 WIB');
  const [newModePref, setNewModePref] = useState<'Tatap Muka & Hybrid' | 'Hanya Online' | 'Tatap Muka Lab'>('Tatap Muka Lab');
  const [newSlotNotes, setNewSlotNotes] = useState<string>('');
  const [showAddSlotSuccess, setShowAddSlotSuccess] = useState<boolean>(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);

  // Workload cap
  const [personalCap, setPersonalCap] = useState<number>(75);
  const [capSaved, setCapSaved] = useState<boolean>(false);

  // H-3 confirmations
  const [h3Confirmed, setH3Confirmed] = useState<Record<string, boolean>>({
    'T-001': true,
    'T-014': false,
  });

  // Burnout modal
  const [burnoutReason, setBurnoutReason] = useState<string>('');
  const [showBurnoutForm, setShowBurnoutForm] = useState<boolean>(false);
  const [burnoutReported, setBurnoutReported] = useState<boolean>(false);

  // Logbook
  const [logNotes, setLogNotes] = useState<string>('');
  const [logSaved, setLogSaved] = useState<boolean>(false);

  // Week days definition for the interactive calendar (Week 19 - 25 May 2025 base)
  const baseWeekStart = new Date(2025, 4, 19 + selectedWeekOffset * 7); // May 19, 2025 (Monday)
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(baseWeekStart);
    d.setDate(baseWeekStart.getDate() + i);
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const shortDayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    // YYYY-MM-DD
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;
    const dayName = dayNames[d.getDay()];
    const shortDay = shortDayNames[d.getDay()];
    const formattedDate = `${dayName}, ${d.getDate()} ${monthNames[d.getMonth()]}`;

    return { dateStr, dayName, shortDay, formattedDate, dayNumber: d.getDate() };
  });

  // Time periods for calendar rows
  const timePeriods = [
    { id: 'pagi', label: 'Pagi (08:30 – 12:00)', defaultTime: '09:00 – 12:00 WIB' },
    { id: 'siang', label: 'Siang/Sore (13:30 – 17:00)', defaultTime: '13:30 – 16:30 WIB' },
    { id: 'malam', label: 'Sore/Daring (17:30 – 19:30)', defaultTime: '17:30 – 19:30 WIB' },
  ];

  // Helper to find slot on a date
  const getSlotOnDate = (dateStr: string) => {
    return slots.find((s) => s.dateStr === dateStr);
  };

  // Helper to check if a date has pending reschedule requests
  const getPendingRequestOnDate = (dateStr: string) => {
    return rescheduleRequests.find(
      (r) => r.requestedDate === dateStr && r.status === 'Menunggu Persetujuan'
    );
  };

  // Toggle or cycle slot status on calendar cell click
  const handleCycleSlotStatus = (dateStr: string, dayName: string, formattedDate: string, defaultTime: string) => {
    const existing = slots.find((s) => s.dateStr === dateStr);
    let updatedSlots: AvailabilitySlot[];

    if (!existing) {
      // Create as Tersedia
      const newSlot: AvailabilitySlot = {
        id: `slot-${Date.now()}`,
        dayName,
        dateStr,
        formattedDate,
        timeSlot: defaultTime,
        status: 'Tersedia',
        modePreference: 'Tatap Muka & Hybrid',
        notes: 'Slot dibuka mandiri oleh mentor',
      };
      updatedSlots = [...slots, newSlot];
    } else {
      // Cycle: Tersedia -> Terisi -> Tidak Tersedia -> Tersedia
      const nextStatus =
        existing.status === 'Tersedia'
          ? 'Terisi'
          : existing.status === 'Terisi'
          ? 'Tidak Tersedia'
          : 'Tersedia';

      updatedSlots = slots.map((s) => (s.id === existing.id ? { ...s, status: nextStatus } : s));
    }

    setSlots(updatedSlots);
    if (onUpdateAvailability) {
      onUpdateAvailability(updatedSlots);
    }
    onTriggerAlert(`Status slot tanggal ${dateStr} diperbarui di kalender mingguan.`);
  };

  const handleToggleH3 = (teamId: string) => {
    const newState = !h3Confirmed[teamId];
    setH3Confirmed((prev) => ({ ...prev, [teamId]: newState }));
    if (newState) {
      onTriggerAlert(`Mentor ${currentMentor.name} telah mengonfirmasi kesiapan H-3 untuk tim ${teamId}.`);
    }
  };

  const handleSavePersonalCap = () => {
    setCapSaved(true);
    setTimeout(() => setCapSaved(false), 2500);
    onTriggerAlert(`Mentor ${currentMentor.name} memperbarui batas beban kerja pribadi menjadi ${personalCap}%.`);
  };

  const handleReportBurnout = (e: React.FormEvent) => {
    e.preventDefault();
    setBurnoutReported(true);
    setShowBurnoutForm(false);
    onTriggerAlert(`PERINGATAN BURNOUT: ${currentMentor.name} (${currentMentor.id}) mengajukan istirahat darurat. Tim bimbingan dialihkan ke mentor cadangan.`);
    setTimeout(() => setBurnoutReported(false), 5000);
  };

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    setLogSaved(true);
    setLogNotes('');
    setTimeout(() => setLogSaved(false), 2500);
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const dateObj = new Date(newDateStr);
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const dayName = dayNames[dateObj.getDay()] || 'Hari';
    const formattedDate = `${dayName}, ${dateObj.getDate()} ${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

    const newSlot: AvailabilitySlot = {
      id: `slot-${Date.now()}`,
      dayName,
      dateStr: newDateStr,
      formattedDate,
      timeSlot: newTimeSlot,
      status: 'Tersedia',
      modePreference: newModePref,
      notes: newSlotNotes.trim() || 'Slot waktu siap bimbingan',
    };

    const updated = [...slots, newSlot];
    setSlots(updated);
    if (onUpdateAvailability) {
      onUpdateAvailability(updated);
    }
    setNewSlotNotes('');
    setShowAddSlotSuccess(true);
    setTimeout(() => setShowAddSlotSuccess(false), 3000);
    onTriggerAlert(`Slot ketersediaan baru ditambahkan pada ${formattedDate}.`);
  };

  // Filter pending requests for this mentor
  const pendingRequests = rescheduleRequests.filter(
    (req) => req.mentorId === currentMentor.id || req.mentorName.includes(currentMentor.name)
  );

  // Statistics for Mentor Dashboard
  const activeAssignedTeamsCount = assignedTeams.length || 4;
  const maxQuota = currentMentor.maxQuota || 8;
  const currentWorkloadPercentage = Math.round((activeAssignedTeamsCount / maxQuota) * 100);
  const availableSlotsCount = slots.filter((s) => s.status === 'Tersedia').length;
  const bookedSlotsCount = slots.filter((s) => s.status === 'Terisi').length;
  const pendingRescheduleCount = pendingRequests.filter((r) => r.status === 'Menunggu Persetujuan').length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. MENTOR PROFILE BANNER (Responsive for Mobile & Desktop) */}
      <div className="bg-gradient-to-r from-[#ce4915] via-[#ff9900] to-[#117d78] p-4 sm:p-6 rounded-2xl text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-semibold backdrop-blur-xs">
              <GraduationCap className="w-3.5 h-3.5" /> Dashboard Khusus Mentor Riset
            </div>
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight">{currentMentor.name}</h2>
            <p className="text-xs sm:text-sm text-white/95 leading-relaxed">
              Spesialisasi: {currentMentor.specialization} • Domisili: {currentMentor.city}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <span className="px-3 py-1.5 rounded-xl bg-white text-[#ce4915] text-xs font-bold shadow-xs">
              Tier {currentMentor.tier} • MQI {currentMentor.mqiScore}
            </span>
            <button
              onClick={() => setShowBurnoutForm(true)}
              className="px-3 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Sinyal Burnout</span>
            </button>
          </div>
        </div>
      </div>

      {burnoutReported && (
        <div className="p-4 rounded-xl bg-[#ffebe4] border border-[#ce4915]/40 text-xs font-bold text-[#ce4915] flex items-center gap-2 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Laporan burnout Anda telah diterima. Sistem otomatis mengalihkan jadwal bimbingan ke mentor cadangan.</span>
        </div>
      )}

      {/* Burnout Modal */}
      {showBurnoutForm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl border border-[#e3e9e7] space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold">Laporan Kendala / Sinyal Burnout</h3>
            </div>
            <p className="text-xs text-[#6c7a78] leading-relaxed">
              Kesehatan mental dan beban akademis Anda adalah prioritas kami. Mengirimkan laporan ini akan segera memicu SOP Urutan Pengganti tanpa penalti kinerja.
            </p>
            <form onSubmit={handleReportBurnout} className="space-y-3">
              <textarea
                rows={3}
                required
                value={burnoutReason}
                onChange={(e) => setBurnoutReason(e.target.value)}
                placeholder="Alasan kendala (kelebihan beban riset kampus, sakit, atau ujian mendadak)..."
                className="w-full text-xs bg-[#f7f8f7] border border-[#e3e9e7] rounded-xl p-3 outline-none focus:border-[#ce4915] resize-none"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBurnoutForm(false)}
                  className="px-3 py-1.5 text-xs text-[#6c7a78] hover:bg-[#f7f8f7] rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Kirim Sinyal Kendala
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. DEDICATED MENTOR DASHBOARD STATS (5 High-Impact Metric Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
        {/* Card 1: Kapasitas Beban Kerja */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#e3e9e7] shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-[#6c7a78]">Beban Kerja</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#e1f4f0] flex items-center justify-center text-[#117d78]">
              <Sliders className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg sm:text-2xl font-bold text-[#202b2a]">{currentWorkloadPercentage}%</div>
            <div className="text-[10px] text-[#117d78] font-medium flex items-center gap-1 mt-0.5">
              <span>{activeAssignedTeamsCount}/{maxQuota} tim • Aman (&le;83%)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Sesi Terjadwal */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#e3e9e7] shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-[#6c7a78]">Sesi Pekan Ini</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#fff2dc] flex items-center justify-center text-[#ff9900]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg sm:text-2xl font-bold text-[#202b2a]">{bookedSlotsCount + 2} Sesi</div>
            <div className="text-[10px] text-[#ff9900] font-medium mt-0.5">
              2 Lab Fisik, 2 Hybrid
            </div>
          </div>
        </div>

        {/* Card 3: Slot Dibuka */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#e3e9e7] shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-[#6c7a78]">Slot Ketersediaan</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#e1f4f0] flex items-center justify-center text-[#117d78]">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg sm:text-2xl font-bold text-[#117d78]">{availableSlotsCount} Slot</div>
            <div className="text-[10px] text-[#6c7a78] font-medium mt-0.5">
              Siap dipilih mitra
            </div>
          </div>
        </div>

        {/* Card 4: Permohonan Reschedule */}
        <div className={`bg-white rounded-2xl p-3.5 sm:p-4 border shadow-xs flex flex-col justify-between transition-all ${
          pendingRescheduleCount > 0 ? 'border-[#ce4915] ring-2 ring-[#ce4915]/20 bg-[#fff9f7]' : 'border-[#e3e9e7]'
        }`}>
          <div className="flex items-start justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-[#6c7a78]">Reschedule Masuk</span>
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${
              pendingRescheduleCount > 0 ? 'bg-[#ffebe4] text-[#ce4915] animate-pulse' : 'bg-[#f7f8f7] text-[#6c7a78]'
            }`}>
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg sm:text-2xl font-bold text-[#ce4915]">
              {pendingRescheduleCount} Permohonan
            </div>
            <div className="text-[10px] text-[#ce4915] font-semibold mt-0.5">
              {pendingRescheduleCount > 0 ? '⚡ Menunggu konfirmasi' : 'Tidak ada permohonan'}
            </div>
          </div>
        </div>

        {/* Card 5: Kesiapan H-3 */}
        <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl p-3.5 sm:p-4 border border-[#e3e9e7] shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-[#6c7a78]">Kesiapan H-3</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#e1f4f0] flex items-center justify-center text-[#117d78]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg sm:text-2xl font-bold text-[#117d78]">
              {h3Confirmed['T-001'] ? 'Terkonfirmasi' : 'Perlu Aksi'}
            </div>
            <div className="text-[10px] text-[#117d78] font-medium mt-0.5">
              100% Sesi H-3 Siap
            </div>
          </div>
        </div>
      </div>

      {/* 3. AUTO-SYNC RESCHEDULE BANNER & QUEUE (Sinkronisasi Otomatis Sekolah - Mentor) */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#e3e9e7] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#e3e9e7] gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ffebe4] text-[#ce4915] flex items-center justify-center shrink-0">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-[#202b2a]">
                  Sinkronisasi Otomatis Permohonan Reschedule Sekolah
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  pendingRescheduleCount > 0 ? 'bg-[#ce4915] text-white animate-pulse' : 'bg-slate-200 text-slate-700'
                }`}>
                  {pendingRescheduleCount} Menunggu
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#6c7a78]">
                Setujui permohonan sekolah untuk langsung mengunci slot pada kalender mingguan Anda secara otomatis.
              </p>
            </div>
          </div>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#6c7a78] bg-[#fbfcfb] rounded-xl border border-dashed border-[#e3e9e7]">
            Belum ada permohonan reschedule baru dari sekolah mitra.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((req) => {
              const matchingSlot = slots.find((s) => s.dateStr === req.requestedDate);
              const isSlotAvailable = matchingSlot?.status === 'Tersedia';

              return (
                <div
                  key={req.id}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all space-y-3 ${
                    req.status === 'Menunggu Persetujuan'
                      ? 'border-[#ce4915]/40 bg-[#fffaf8]'
                      : 'border-[#e3e9e7] bg-[#fbfcfb]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-[#202b2a]">
                          {req.schoolName}
                        </span>
                        <span className="text-xs text-[#ce4915] font-semibold bg-[#ffebe4] px-2 py-0.5 rounded">
                          {req.teamName} ({req.teamId})
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            req.status === 'Disetujui'
                              ? 'bg-[#e1f4f0] text-[#117d78]'
                              : req.status === 'Ditolak'
                              ? 'bg-[#ffebe4] text-[#ce4915]'
                              : 'bg-[#fff2dc] text-[#9b6200]'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <div className="text-xs text-[#6c7a78] mt-1">
                        Jadwal Lama: <span className="line-through">{req.originalSchedule}</span>
                      </div>
                      <div className="text-xs font-semibold text-[#117d78] mt-0.5 flex items-center gap-1.5 flex-wrap">
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>Usulan Baru: <strong>{req.requestedDate}</strong> ({req.requestedTimeSlot})</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#6c7a78] shrink-0">
                      Diajukan: {req.timestamp}
                    </div>
                  </div>

                  {/* Reason & Matching Slot Status */}
                  <div className="p-2.5 rounded-lg bg-white border border-[#e3e9e7] text-xs text-[#202b2a] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[#6c7a78]">Alasan Pengajuan:</span>{' '}
                      <span className="italic font-medium">&ldquo;{req.reason}&rdquo;</span>
                    </div>

                    <div className="shrink-0">
                      {isSlotAvailable ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#117d78] bg-[#e1f4f0] px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" /> Slot Tersedia di Kalender Anda
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#ff9900] bg-[#fff2dc] px-2 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3" /> Slot Belum Dibuka
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons for Mentor */}
                  {req.status === 'Menunggu Persetujuan' && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => {
                          if (onRejectReschedule) onRejectReschedule(req.id);
                          onTriggerAlert(`Permohonan reschedule tim ${req.teamName} ditolak oleh mentor.`);
                        }}
                        className="px-3 py-2 text-xs font-semibold text-[#ce4915] bg-[#ffebe4] hover:bg-[#ffded6] rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Tolak &amp; Sarankan Slot Lain</span>
                      </button>

                      <button
                        onClick={() => {
                          if (onApproveReschedule) onApproveReschedule(req.id);
                          // Auto update calendar slot to Terisi
                          const updated = slots.map((s) =>
                            s.dateStr === req.requestedDate
                              ? { ...s, status: 'Terisi' as const, notes: `Terisi untuk ${req.teamName} (${req.schoolName})` }
                              : s
                          );
                          setSlots(updated);
                          if (onUpdateAvailability) onUpdateAvailability(updated);
                          onTriggerAlert(`Jadwal baru Tim ${req.teamName} (${req.schoolName}) disetujui untuk ${req.requestedDate}. Kalender otomatis terkunci.`);
                        }}
                        className="px-4 py-2 text-xs font-semibold text-white bg-[#117d78] hover:bg-[#0e6b66] rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Setujui &amp; Kunci Jadwal Otomatis</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. KALENDER MINGGUAN INTERAKTIF & MANAJEMEN SLOT KETERSEDIAAN */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#e3e9e7] shadow-xs space-y-4">
        {/* Header with Week Nav & View Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#e3e9e7] gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#e1f4f0] text-[#117d78] flex items-center justify-center shrink-0">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#202b2a]">
                Kalender Mingguan Interaktif Ketersediaan Mentor
              </h3>
              <p className="text-xs text-[#6c7a78]">
                Kelola slot waktu mandiri Anda. Sekolah mitra akan mengacu pada jadwal ini saat mengajukan sesi atau rescheduling.
              </p>
            </div>
          </div>

          {/* Controls: Mode Switcher & Week Navigator */}
          <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
            {/* View Switcher: Agenda HP vs Grid Tabel */}
            <div className="flex items-center bg-[#f7f8f7] p-1 rounded-xl border border-[#e3e9e7]">
              <button
                onClick={() => setCalendarViewMode('agenda')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  calendarViewMode === 'agenda'
                    ? 'bg-white text-[#117d78] shadow-xs'
                    : 'text-[#6c7a78] hover:text-[#202b2a]'
                }`}
                title="Tampilan harian optimal untuk layar HP"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Agenda HP</span>
              </button>
              <button
                onClick={() => setCalendarViewMode('grid')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  calendarViewMode === 'grid'
                    ? 'bg-white text-[#117d78] shadow-xs'
                    : 'text-[#6c7a78] hover:text-[#202b2a]'
                }`}
                title="Tampilan tabel matriks mingguan penuh"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Kisi Penuh</span>
              </button>
            </div>

            {/* Week Nav */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSelectedWeekOffset((prev) => prev - 1)}
                className="p-1.5 rounded-lg border border-[#e3e9e7] hover:bg-[#f7f8f7] cursor-pointer"
                title="Minggu Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4 text-[#6c7a78]" />
              </button>
              <span className="text-xs font-semibold text-[#202b2a] px-2 py-1 bg-[#f7f8f7] rounded-lg border border-[#e3e9e7]">
                {selectedWeekOffset === 0 ? '19–25 Mei 2025' : `Minggu ${selectedWeekOffset > 0 ? '+' : ''}${selectedWeekOffset}`}
              </span>
              <button
                onClick={() => setSelectedWeekOffset((prev) => prev + 1)}
                className="p-1.5 rounded-lg border border-[#e3e9e7] hover:bg-[#f7f8f7] cursor-pointer"
                title="Minggu Berikutnya"
              >
                <ChevronRight className="w-4 h-4 text-[#6c7a78]" />
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-[11px] text-[#6c7a78] pb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#117d78]" /> Tersedia (Buka untuk Sekolah)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff9900]" /> Terisi (Bimbingan Siswa)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ce4915]" /> Tidak Tersedia (Kampus / Ditutup)
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            *Ketuk sel/kartu untuk mengubah status secara instan
          </span>
        </div>

        {/* VIEW 1: AGENDA HARIAN (OPTIMAL UNTUK HP & MOBILE TOUCH) */}
        {calendarViewMode === 'agenda' && (
          <div className="space-y-3">
            {/* Horizontal Day Tabs Selector on Mobile */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
              {weekDays.map((w, idx) => {
                const isSelected = selectedDayIndex === idx;
                const slot = getSlotOnDate(w.dateStr);
                const hasPendingReq = getPendingRequestOnDate(w.dateStr);

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`flex-1 min-w-[70px] sm:min-w-[85px] py-2 px-2 rounded-xl text-center border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-[#117d78] bg-[#e1f4f0] text-[#117d78] shadow-xs font-bold'
                        : 'border-[#e3e9e7] bg-[#fbfcfb] text-[#6c7a78] hover:bg-[#f7f8f7]'
                    }`}
                  >
                    {hasPendingReq && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#ce4915] rounded-full border-2 border-white animate-ping" />
                    )}
                    <div className="text-[10px] uppercase font-bold">{w.shortDay}</div>
                    <div className="text-base font-extrabold">{w.dayNumber}</div>
                    <div className="mt-0.5">
                      {slot ? (
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          slot.status === 'Tersedia' ? 'bg-[#117d78]' : slot.status === 'Terisi' ? 'bg-[#ff9900]' : 'bg-[#ce4915]'
                        }`} />
                      ) : (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Day Agenda Cards */}
            {(() => {
              const currentDay = weekDays[selectedDayIndex];
              const slot = getSlotOnDate(currentDay.dateStr);
              const pendingReq = getPendingRequestOnDate(currentDay.dateStr);

              return (
                <div className="bg-[#fbfcfb] p-3.5 sm:p-5 rounded-xl border border-[#e3e9e7] space-y-4">
                  {/* Day Heading */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-[#202b2a]">
                        {currentDay.formattedDate} 2025
                      </h4>
                      <p className="text-xs text-[#6c7a78]">
                        Status: {slot ? slot.status : 'Belum Dikonfigurasi'}
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      slot?.status === 'Tersedia'
                        ? 'bg-[#e1f4f0] text-[#117d78]'
                        : slot?.status === 'Terisi'
                        ? 'bg-[#fff2dc] text-[#9b6200]'
                        : slot?.status === 'Tidak Tersedia'
                        ? 'bg-[#ffebe4] text-[#ce4915]'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {slot ? slot.status : 'Slot Kosong'}
                    </span>
                  </div>

                  {/* Reschedule alert banner if requested on this date */}
                  {pendingReq && (
                    <div className="p-3 rounded-xl bg-[#fff2dc] border border-[#ff9900]/40 text-xs text-[#9b6200] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-[#ff9900] shrink-0" />
                        <div>
                          <strong>{pendingReq.schoolName}</strong> mengajukan jadwal reschedule untuk hari ini ({pendingReq.requestedTimeSlot}).
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (onApproveReschedule) onApproveReschedule(pendingReq.id);
                          const updated = slots.map((s) =>
                            s.dateStr === pendingReq.requestedDate
                              ? { ...s, status: 'Terisi' as const, notes: `Bimbingan ${pendingReq.teamName} (${pendingReq.schoolName})` }
                              : s
                          );
                          setSlots(updated);
                          if (onUpdateAvailability) onUpdateAvailability(updated);
                          onTriggerAlert(`Reschedule disetujui untuk ${pendingReq.teamName}.`);
                        }}
                        className="px-3 py-1.5 bg-[#117d78] hover:bg-[#0e6b66] text-white text-[11px] font-bold rounded-lg cursor-pointer self-start sm:self-auto shrink-0"
                      >
                        Setujui Sekarang
                      </button>
                    </div>
                  )}

                  {/* Three Session Period Cards for This Day */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {timePeriods.map((period) => {
                      const isMainActive = slot !== undefined;
                      return (
                        <div
                          key={period.id}
                          className="p-3 bg-white rounded-xl border border-[#e3e9e7] space-y-2 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between text-xs font-semibold text-[#202b2a]">
                              <span>{period.label.split('(')[0]}</span>
                              <span className="text-[11px] text-[#6c7a78]">{period.defaultTime}</span>
                            </div>
                            <div className="mt-1.5 text-xs text-[#6c7a78]">
                              {slot ? (
                                <span className="font-medium text-[#202b2a]">
                                  {slot.notes || slot.modePreference}
                                </span>
                              ) : (
                                <span className="italic text-slate-400">Belum ada slot terjadwal</span>
                              )}
                            </div>
                          </div>

                          <div className="pt-2 flex items-center gap-1.5">
                            <button
                              onClick={() => handleCycleSlotStatus(currentDay.dateStr, currentDay.dayName, currentDay.formattedDate, period.defaultTime)}
                              className="w-full py-1.5 px-2 bg-[#f7f8f7] hover:bg-[#e1f4f0] text-[#117d78] text-[11px] font-bold rounded-lg border border-[#e3e9e7] transition-all cursor-pointer flex items-center justify-center gap-1"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Ubah Status ({slot?.status || 'Buka'})</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* VIEW 2: KISI PENUH (TABEL MATRIX MINGGUAN DENGAN HORIZONTAL SCROLL) */}
        {calendarViewMode === 'grid' && (
          <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
            <div className="min-w-[700px] border border-[#e3e9e7] rounded-xl overflow-hidden">
              {/* Table Header: Days of the week */}
              <div className="grid grid-cols-8 bg-[#f7f8f7] border-b border-[#e3e9e7] text-center font-bold text-xs text-[#202b2a]">
                <div className="p-3 border-r border-[#e3e9e7] text-left text-[11px] text-[#6c7a78]">
                  Sesi / Jam
                </div>
                {weekDays.map((w, idx) => {
                  const hasPending = getPendingRequestOnDate(w.dateStr);
                  return (
                    <div key={idx} className="p-2.5 border-r last:border-r-0 border-[#e3e9e7] relative">
                      {hasPending && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ce4915] animate-ping" />
                      )}
                      <div className="text-[11px] text-[#6c7a78]">{w.dayName}</div>
                      <div className="text-sm font-extrabold text-[#202b2a]">{w.dayNumber}</div>
                    </div>
                  );
                })}
              </div>

              {/* Table Body: 3 rows per time period */}
              {timePeriods.map((period) => (
                <div key={period.id} className="grid grid-cols-8 border-b last:border-b-0 border-[#e3e9e7]">
                  {/* Period label */}
                  <div className="p-2.5 border-r border-[#e3e9e7] bg-[#fbfcfb] text-[11px] font-semibold text-[#202b2a] flex items-center">
                    {period.label}
                  </div>

                  {/* 7 Day Cells */}
                  {weekDays.map((w) => {
                    const slot = getSlotOnDate(w.dateStr);
                    const isAvailable = slot?.status === 'Tersedia';
                    const isBooked = slot?.status === 'Terisi';
                    const isBlocked = slot?.status === 'Tidak Tersedia';
                    const hasPendingReq = getPendingRequestOnDate(w.dateStr);

                    return (
                      <div
                        key={w.dateStr}
                        onClick={() => handleCycleSlotStatus(w.dateStr, w.dayName, w.formattedDate, period.defaultTime)}
                        className={`p-2 border-r last:border-r-0 border-[#e3e9e7] min-h-[75px] text-left flex flex-col justify-between cursor-pointer transition-all hover:ring-2 hover:ring-[#117d78]/30 ${
                          hasPendingReq
                            ? 'bg-[#fff5e6] ring-1 ring-[#ff9900]'
                            : isAvailable
                            ? 'bg-[#e1f4f0]/60 hover:bg-[#e1f4f0]'
                            : isBooked
                            ? 'bg-[#fff2dc]/60 hover:bg-[#fff2dc]'
                            : isBlocked
                            ? 'bg-[#ffebe4]/60 hover:bg-[#ffebe4]'
                            : 'bg-white hover:bg-[#f7f8f7]'
                        }`}
                        title="Klik untuk membuka/mengubah status ketersediaan"
                      >
                        {slot ? (
                          <>
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                                  isAvailable
                                    ? 'bg-[#117d78] text-white'
                                    : isBooked
                                    ? 'bg-[#ff9900] text-white'
                                    : 'bg-[#ce4915] text-white'
                                }`}
                              >
                                {slot.status}
                              </span>
                              {hasPendingReq && (
                                <span className="text-[8px] bg-[#ce4915] text-white font-bold px-1 rounded">
                                  Reschedule
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-[#202b2a] font-medium leading-tight truncate mt-1">
                              {slot.notes || slot.modePreference}
                            </div>
                          </>
                        ) : (
                          <div className="h-full flex items-center justify-center text-[10px] text-slate-300 font-medium hover:text-[#117d78]">
                            + Buka Slot
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Add Custom Slot Drawer/Form */}
        <div className="bg-[#f7f8f7] p-3.5 sm:p-4 rounded-xl border border-[#e3e9e7] mt-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-[#202b2a] flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-[#117d78]" /> Buka Slot Waktu Mandiri Tambahan
            </h4>
            <button
              onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
              className="text-xs text-[#117d78] font-semibold hover:underline sm:hidden cursor-pointer"
            >
              {isQuickAddOpen ? 'Tutup Formulir' : '+ Buka Form'}
            </button>
          </div>

          <form onSubmit={handleAddSlot} className={`space-y-3 sm:space-y-0 sm:grid sm:grid-cols-4 sm:gap-2.5 ${isQuickAddOpen ? 'block' : 'hidden sm:grid'}`}>
            <div>
              <label className="block text-[11px] font-semibold text-[#202b2a] mb-1">
                Pilih Tanggal:
              </label>
              <input
                type="date"
                required
                value={newDateStr}
                onChange={(e) => setNewDateStr(e.target.value)}
                className="w-full text-xs bg-white border border-[#dce5e2] rounded-xl p-2.5 outline-none focus:border-[#117d78]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#202b2a] mb-1">
                Rentang Jam:
              </label>
              <input
                type="text"
                required
                value={newTimeSlot}
                onChange={(e) => setNewTimeSlot(e.target.value)}
                placeholder="Contoh: 09:00 – 12:00 WIB"
                className="w-full text-xs bg-white border border-[#dce5e2] rounded-xl p-2.5 outline-none focus:border-[#117d78]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#202b2a] mb-1">
                Preferensi Mode:
              </label>
              <select
                value={newModePref}
                onChange={(e) => setNewModePref(e.target.value as any)}
                className="w-full text-xs bg-white border border-[#dce5e2] rounded-xl p-2.5 outline-none focus:border-[#117d78]"
              >
                <option value="Tatap Muka Lab">Tatap Muka Lab Sekolah</option>
                <option value="Tatap Muka & Hybrid">Tatap Muka &amp; Hybrid</option>
                <option value="Hanya Online">Hanya Online (Daring)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#202b2a] mb-1">
                Catatan Slot:
              </label>
              <input
                type="text"
                value={newSlotNotes}
                onChange={(e) => setNewSlotNotes(e.target.value)}
                placeholder="Misal: Siap asistensi alat lab"
                className="w-full text-xs bg-white border border-[#dce5e2] rounded-xl p-2.5 outline-none focus:border-[#117d78]"
              />
            </div>

            <div className="sm:col-span-4 flex items-center justify-between pt-1 flex-wrap gap-2">
              {showAddSlotSuccess ? (
                <span className="text-xs font-bold text-[#117d78] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Slot ketersediaan berhasil ditambahkan dan disinkronkan ke sekolah mitra!
                </span>
              ) : (
                <span className="text-[11px] text-[#6c7a78]">
                  *Perubahan slot waktu langsung terlihat di portal sekolah mitra saat memilih tanggal reschedule.
                </span>
              )}

              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-[#117d78] hover:bg-[#0e6b66] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs ml-auto"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Simpan Slot Jadwal</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 5. WORKLOAD SAFETY LIMITER & H-3 SESSION CONFIRMATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Module 1: Batas Beban Pribadi (<= 83%) */}
        <div className="lg:col-span-5 bg-white p-4 sm:p-6 rounded-2xl border border-[#e3e9e7] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-[#e3e9e7] mb-3">
              <Sliders className="w-5 h-5 text-[#ff9900]" />
              <div>
                <h3 className="text-base font-bold text-[#202b2a]">Pengaturan Batas Beban Pribadi</h3>
                <p className="text-xs text-[#6c7a78]">Atur batas kenyamanan kuota bimbingan Anda.</p>
              </div>
            </div>

            <p className="text-xs text-[#6c7a78] mb-3 leading-relaxed">
              Sistem RAWON membatasi utilisasi maksimum pada <strong>83%</strong> (&rho;) untuk mencegah kelelahan. Anda berhak <em>menurunkan</em> batas beban kapan saja.
            </p>

            <div className="bg-[#fbfcfb] p-3.5 rounded-xl border border-[#e3e9e7] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#202b2a]">Batas Kapasitas Pribadi:</span>
                <span className="font-bold text-[#ce4915] text-sm">{personalCap}% Kuota</span>
              </div>
              <input
                type="range"
                min="30"
                max="83" // strictly cannot exceed 83%
                step="5"
                value={personalCap}
                onChange={(e) => setPersonalCap(parseInt(e.target.value))}
                className="w-full accent-[#ce4915] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#6c7a78]">
                <span>30% (Ringan)</span>
                <span>50% (Sedang)</span>
                <span className="font-bold text-[#ce4915]">83% (Maksimal Sistem)</span>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-[#6c7a78] bg-[#fff2dc] p-2.5 rounded-lg border border-[#ff9900]/20">
              *Aturan sistem: Mentor dapat menurunkan beban mandiri, namun dilarang menaikkan kuota melampaui ambang batas 83%.
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#e3e9e7] flex items-center justify-between">
            {capSaved ? (
              <span className="text-xs font-bold text-[#117d78] flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Batas Tersimpan
              </span>
            ) : (
              <span className="text-[11px] text-[#6c7a78]">Status: Kapasitas aman</span>
            )}
            <button
              onClick={handleSavePersonalCap}
              className="px-4 py-2 bg-[#ff9900] hover:bg-[#e08700] text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              Simpan Batas Pribadi
            </button>
          </div>
        </div>

        {/* Module 2: Sesi Bimbingan & Konfirmasi Kesiapan H-3 */}
        <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-2xl border border-[#e3e9e7] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e3e9e7]">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#117d78]" />
              <div>
                <h3 className="text-base font-bold text-[#202b2a]">Jadwal &amp; Konfirmasi Kesiapan H-3</h3>
                <p className="text-xs text-[#6c7a78]">Konfirmasikan kehadiran Anda 3 hari sebelum sesi bimbingan.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'T-001',
                team: 'Bio-Inovasi',
                school: 'SMA 1 Surabaya',
                topic: 'Ekstraksi Biopolimer dari Limbah Rumput Laut',
                schedule: 'Sabtu, 17 Mei 2025 • 09:00 WIB',
                mode: 'Tatap Muka di Laboratorium Sekolah',
              },
              {
                id: 'T-014',
                team: 'Onco-Nano Detect',
                school: 'SMA 3 Semarang',
                topic: 'Sintesis Nanopartikel Emas untuk Biosensor',
                schedule: 'Selasa, 20 Mei 2025 • 13:00 WIB',
                mode: 'Hybrid / Online Review Tahap 2',
              },
            ].map((sesi) => {
              const isReady = h3Confirmed[sesi.id];
              return (
                <div
                  key={sesi.id}
                  className="p-3.5 sm:p-4 rounded-xl border border-[#e3e9e7] bg-[#fbfcfb] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-[#202b2a]">{sesi.team}</span>
                      <span className="text-[10px] font-mono text-[#ce4915] bg-[#ffebe4] px-1.5 py-0.5 rounded font-semibold">
                        {sesi.id}
                      </span>
                      <span className="text-xs text-[#6c7a78]">({sesi.school})</span>
                    </div>
                    <p className="text-xs text-[#202b2a] font-medium">{sesi.topic}</p>
                    <div className="text-[11px] text-[#6c7a78] flex items-center gap-2 flex-wrap">
                      <Clock className="w-3 h-3 text-[#117d78]" />
                      <span>{sesi.schedule}</span>
                      <span>•</span>
                      <span className="font-semibold text-[#117d78]">{sesi.mode}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => handleToggleH3(sesi.id)}
                      className={`w-full sm:w-auto px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isReady
                          ? 'bg-[#e1f4f0] text-[#117d78] border border-[#117d78]/30 shadow-xs'
                          : 'bg-[#fff2dc] text-[#9b6200] border border-[#ff9900]/30 hover:bg-[#ffe8c2]'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isReady ? 'Siap Hadir (Terkonfirmasi)' : 'Konfirmasi Hadir H-3'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Logbook progress input */}
          <div className="pt-3 border-t border-[#e3e9e7]">
            <h4 className="text-xs font-bold text-[#202b2a] mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#117d78]" /> Catatan Pasca-Sesi (Logbook Bimbingan)
            </h4>
            <form onSubmit={handleSaveLog} className="space-y-2">
              <textarea
                rows={2}
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
                placeholder="Tuliskan perkembangan riset siswa, kendala metodologi, atau target untuk pertemuan berikutnya..."
                className="w-full text-xs bg-[#f7f8f7] border border-[#e3e9e7] rounded-xl p-2.5 outline-none focus:border-[#117d78] resize-none"
              />
              <div className="flex justify-between items-center">
                {logSaved && (
                  <span className="text-xs font-bold text-[#117d78]">
                    Logbook berhasil disimpan ke riwayat tim!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={!logNotes.trim()}
                  className="ml-auto px-3 py-1.5 bg-[#117d78] hover:bg-[#0e6b66] text-white text-xs font-semibold rounded-lg disabled:opacity-50 cursor-pointer"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
