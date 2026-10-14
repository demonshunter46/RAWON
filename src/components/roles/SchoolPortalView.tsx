import React, { useState } from 'react';
import { 
  School, 
  Calendar, 
  Clock, 
  User, 
  ShieldCheck, 
  AlertTriangle, 
  Star, 
  Send, 
  CheckCircle2, 
  HelpCircle,
  MapPin,
  CalendarCheck2,
  CalendarDays,
  Laptop
} from 'lucide-react';
import { ResearchTeam, Mentor, AvailabilitySlot, RescheduleRequest } from '../../types/rawon';
import { INITIAL_AVAILABILITY_SLOTS } from '../../data/rawonData';

interface SchoolPortalViewProps {
  schoolName?: string;
  teams: ResearchTeam[];
  mentors: Mentor[];
  availabilitySlots?: AvailabilitySlot[];
  onSubmitRescheduleRequest?: (req: RescheduleRequest) => void;
  onTriggerAlert: (msg: string) => void;
}

export const SchoolPortalView: React.FC<SchoolPortalViewProps> = ({
  schoolName = 'SMA 1 Surabaya',
  teams,
  mentors,
  availabilitySlots = INITIAL_AVAILABILITY_SLOTS,
  onSubmitRescheduleRequest,
  onTriggerAlert,
}) => {
  // Teams belonging exclusively to this school
  const mySchoolTeams = teams.filter((t) => t.school.toLowerCase().includes('surabaya') || t.id === 'T-001');

  // Rescheduling state
  const [selectedTeamId, setSelectedTeamId] = useState<string>(mySchoolTeams[0]?.id || 'T-001');
  const [newDate, setNewDate] = useState<string>('2025-05-24');
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>('09:00 – 12:00 WIB');
  const [rescheduleReason, setRescheduleReason] = useState<string>('Jadwal bentrok Ujian Akhir Semester');
  const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);

  // Review & Rating state
  const [rating, setRating] = useState<number>(5);
  const [feedbackNotes, setFeedbackNotes] = useState<string>('');
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);

  // Check matching slot
  const matchingSlot = availabilitySlots.find((s) => s.dateStr === newDate);

  const handleSubmitReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);

    const team = mySchoolTeams.find((t) => t.id === selectedTeamId);
    const newReq: RescheduleRequest = {
      id: `req-${Date.now()}`,
      teamId: selectedTeamId,
      teamName: team?.name || 'Bio-Inovasi',
      schoolName,
      mentorId: 'M-012',
      mentorName: 'Dr. Maya Lestari, M.Sc.',
      requestedDate: newDate,
      requestedTimeSlot: selectedSlotTime,
      originalSchedule: 'Sabtu, 17 Mei 2025 • 09:00 WIB',
      reason: rescheduleReason,
      status: 'Menunggu Persetujuan',
      timestamp: 'Hari ini • ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    if (onSubmitRescheduleRequest) {
      onSubmitRescheduleRequest(newReq);
    }

    onTriggerAlert(`PERMOHONAN RESCHEDULING: ${schoolName} mengajukan pemindahan jadwal tim ${selectedTeamId} ke tanggal ${newDate} (${selectedSlotTime}). Sinkronisasi otomatis ke portal mentor aktif.`);
    setTimeout(() => setRequestSubmitted(false), 4500);
  };

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    setRatingSubmitted(true);
    setFeedbackNotes('');
    setTimeout(() => setRatingSubmitted(false), 3000);
    onTriggerAlert(`Evaluasi kepuasan bimbingan dari ${schoolName} berhasil disimpan.`);
  };

  const handleSelectSlot = (slot: AvailabilitySlot) => {
    setNewDate(slot.dateStr);
    setSelectedSlotTime(slot.timeSlot);
  };

  return (
    <div className="space-y-6">
      {/* School Header Banner */}
      <div className="bg-gradient-to-r from-[#07b3b3] via-[#117d78] to-[#202b2a] p-5 rounded-2xl text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold mb-2">
            <School className="w-3.5 h-3.5" /> Portal Sekolah Mitra
          </div>
          <h2 className="text-xl font-bold">{schoolName}</h2>
          <p className="text-xs text-white/90 mt-1 max-w-2xl leading-relaxed">
            Mitra EduTech X • Penanggung Jawab: Drs. Bambang Supriyadi (Koordinator Riset Sekolah) • Lokasi: Surabaya
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/20 text-xs font-semibold">
            {mySchoolTeams.length} Tim Riset Terdaftar
          </span>
        </div>
      </div>

      {requestSubmitted && (
        <div className="p-4 rounded-xl bg-[#e1f4f0] border border-[#117d78]/40 text-xs font-bold text-[#117d78] flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            Pengajuan permohonan reschedule berhasil dikirimkan ke Koordinator Wilayah Jawa Timur berdasarkan slot ketersediaan mentor. Konfirmasi final akan diterima dalam waktu &lt; 24 jam.
          </span>
        </div>
      )}

      {/* 2 Main Modules: Teams & Mentor Profile (Left) vs Reschedule Form with Availability Schedule Reference (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Module 1: Tim Riset Sekolah & Profil Mentor */}
        <div className="lg:col-span-6 bg-white p-4 sm:p-6 rounded-2xl border border-[#e3e9e7] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e3e9e7]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#117d78]" />
              <div>
                <h3 className="text-base font-bold text-[#202b2a]">Tim Riset Sekolah &amp; Profil Mentor</h3>
                <p className="text-xs text-[#6c7a78]">Informasi mentor utama dan mentor cadangan yang ditugaskan.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {mySchoolTeams.map((team) => {
              const pMentor = mentors.find((m) => m.id === team.primaryMentorId) || {
                name: 'Dr. Maya Lestari, M.Sc.',
                tier: 'A',
                city: 'Surabaya',
                specialization: 'Biomolekuler & Nano-material',
              };
              const bMentor = mentors.find((m) => m.id === team.backupMentorId) || {
                name: 'Dr. Diana Kusuma, M.Sc.',
                tier: 'A',
                city: 'Jakarta',
                specialization: 'Kimia Sintesis & Material',
              };

              return (
                <div key={team.id} className="p-4 rounded-xl border border-[#e3e9e7] bg-[#fbfcfb] space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#202b2a]">{team.name}</h4>
                        <span className="font-mono text-xs text-[#ce4915] font-semibold bg-[#ffebe4] px-1.5 py-0.5 rounded">
                          {team.id}
                        </span>
                      </div>
                      <p className="text-xs text-[#6c7a78] mt-0.5">
                        Klaster: <strong>{team.clusterName}</strong> • Rumpun: <strong>{team.field}</strong>
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#e1f4f0] text-[#117d78]">
                      {team.mode}
                    </span>
                  </div>

                  {/* Mentor Assignment Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {/* Primary Mentor */}
                    <div className="p-3 rounded-lg bg-white border border-[#e3e9e7]">
                      <div className="text-[10px] font-bold text-[#117d78] uppercase mb-1">
                        Mentor Utama (Ditugaskan)
                      </div>
                      <div className="font-bold text-xs text-[#202b2a]">{pMentor.name}</div>
                      <div className="text-[11px] text-[#6c7a78] mt-0.5">
                        Tier {pMentor.tier} • {pMentor.city}
                      </div>
                      <div className="text-[10px] text-[#117d78] mt-1 font-medium">
                        {pMentor.specialization}
                      </div>
                    </div>

                    {/* Pre-assigned Backup Mentor */}
                    <div className="p-3 rounded-lg bg-white border border-[#e3e9e7]">
                      <div className="text-[10px] font-bold text-[#ce4915] uppercase mb-1">
                        Mentor Cadangan (Siaga)
                      </div>
                      <div className="font-bold text-xs text-[#202b2a]">{bMentor.name}</div>
                      <div className="text-[11px] text-[#6c7a78] mt-0.5">
                        Tier {bMentor.tier} • {bMentor.city}
                      </div>
                      <div className="text-[10px] text-[#6c7a78] mt-1 italic">
                        Otomatis menggantikan bila mentor utama berhalangan.
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feedback & Satisfaction */}
          <div className="pt-4 border-t border-[#e3e9e7]">
            <h4 className="text-xs font-bold text-[#202b2a] mb-2 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-[#ff9900]" /> Penilaian Mutu Bimbingan Siswa
            </h4>
            <form onSubmit={handleSubmitRating} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#6c7a78]">Tingkat Kepuasan:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="cursor-pointer text-[#ff9900]"
                    >
                      <Star className={`w-4 h-4 ${star <= rating ? 'fill-[#ff9900]' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-[#202b2a]">({rating} dari 5 Bintang)</span>
              </div>
              <textarea
                rows={2}
                value={feedbackNotes}
                onChange={(e) => setFeedbackNotes(e.target.value)}
                placeholder="Berikan umpan balik mengenai ketepatan waktu bimbingan, kejelasan materi, atau interaksi mentor..."
                className="w-full text-xs bg-[#f7f8f7] border border-[#e3e9e7] rounded-xl p-2.5 outline-none focus:border-[#07b3b3] resize-none"
              />
              <div className="flex justify-between items-center">
                {ratingSubmitted && (
                  <span className="text-xs font-bold text-[#117d78]">
                    Terima kasih atas penilaian Anda!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={!feedbackNotes.trim()}
                  className="ml-auto px-3 py-1.5 bg-[#07b3b3] hover:bg-[#069999] text-white text-xs font-semibold rounded-lg disabled:opacity-50 cursor-pointer"
                >
                  Kirim Evaluasi
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Module 2: Reschedule Form + MENTOR AVAILABILITY REFERENCE */}
        <div className="lg:col-span-6 bg-white p-4 sm:p-6 rounded-2xl border border-[#e3e9e7] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e9e7] mb-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#ce4915]" />
                <div>
                  <h3 className="text-base font-bold text-[#202b2a]">
                    Pengajuan Perubahan Jadwal (Reschedule)
                  </h3>
                  <p className="text-xs text-[#6c7a78]">
                    Pilih tanggal bimbingan baru dengan acuan ketersediaan mentor.
                  </p>
                </div>
              </div>
            </div>

            {/* Crucial Section: Acuan Jadwal Ketersediaan Mentor */}
            <div className="bg-[#f7f8f7] p-3.5 rounded-xl border border-[#e3e9e7] mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#202b2a] flex items-center gap-1.5">
                  <CalendarCheck2 className="w-4 h-4 text-[#117d78]" />
                  Acuan Slot Jadwal Ketersediaan Mentor (Dr. Maya Lestari):
                </span>
                <span className="text-[10px] text-[#6c7a78]">Klik slot untuk memilih</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {availabilitySlots.map((slot) => {
                  const isSelected = newDate === slot.dateStr;
                  const isAvailable = slot.status === 'Tersedia';

                  return (
                    <div
                      key={slot.id}
                      onClick={() => handleSelectSlot(slot)}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#117d78] ring-2 ring-[#117d78]/20 bg-white shadow-xs'
                          : 'border-[#e3e9e7] bg-white hover:border-[#117d78]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#202b2a]">
                          {slot.formattedDate}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            isAvailable
                              ? 'bg-[#e1f4f0] text-[#117d78]'
                              : slot.status === 'Terisi'
                              ? 'bg-[#fff2dc] text-[#9b6200]'
                              : 'bg-[#ffebe4] text-[#ce4915]'
                          }`}
                        >
                          {slot.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#6c7a78] mt-0.5">
                        {slot.timeSlot} • {slot.modePreference}
                      </div>
                      {slot.notes && (
                        <div className="text-[9.5px] text-[#6c7a78] italic truncate mt-0.5">
                          {slot.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Status indicator for selected slot */}
              <div className="mt-2.5 pt-2 border-t border-[#e3e9e7]">
                {matchingSlot ? (
                  matchingSlot.status === 'Tersedia' ? (
                    <div className="text-[11px] font-bold text-[#117d78] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        Slot Tersedia Terkonfirmasi: Mentor siap membimbing pada {matchingSlot.formattedDate} ({matchingSlot.timeSlot}).
                      </span>
                    </div>
                  ) : (
                    <div className="text-[11px] font-bold text-[#ce4915] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        Peringatan: Mentor menandai slot ini sebagai {matchingSlot.status}. Disarankan memilih slot berwarna hijau untuk menghindari penolakan jadwal.
                      </span>
                    </div>
                  )
                ) : (
                  <div className="text-[11px] text-[#6c7a78]">
                    Tanggal {newDate} belum tercantum dalam kalender ketersediaan resmi mentor. Pengajuan akan memerlukan konfirmasi manual.
                  </div>
                )}
              </div>
            </div>

            {/* Reschedule Form Inputs */}
            <form onSubmit={handleSubmitReschedule} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#202b2a] mb-1">
                  Pilih Tim Riset yang Hendak Digeser:
                </label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full text-xs bg-[#fbfcfb] border border-[#dce5e2] rounded-xl p-2 outline-none focus:border-[#ce4915]"
                >
                  {mySchoolTeams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.id} – {t.name} ({t.field})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#202b2a] mb-1">
                    Tanggal Pengganti:
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full text-xs bg-[#fbfcfb] border border-[#dce5e2] rounded-xl p-2 outline-none focus:border-[#ce4915]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#202b2a] mb-1">
                    Jam Sesi:
                  </label>
                  <input
                    type="text"
                    value={selectedSlotTime}
                    onChange={(e) => setSelectedSlotTime(e.target.value)}
                    className="w-full text-xs bg-[#fbfcfb] border border-[#dce5e2] rounded-xl p-2 outline-none focus:border-[#ce4915]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202b2a] mb-1">
                  Alasan Perubahan:
                </label>
                <select
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="w-full text-xs bg-[#fbfcfb] border border-[#dce5e2] rounded-xl p-2 outline-none focus:border-[#ce4915]"
                >
                  <option value="Jadwal bentrok Ujian Akhir Semester">Jadwal bentrok Ujian Akhir Semester</option>
                  <option value="Agenda Kegiatan Dinas Pendidikan / Lomba">Agenda Kegiatan Dinas Pendidikan / Lomba</option>
                  <option value="Laboratorium Sekolah Sedang Renovasi">Laboratorium Sekolah Sedang Renovasi</option>
                  <option value="Siswa Binaan Sakit / Izin Resmi">Siswa Binaan Sakit / Izin Resmi</option>
                </select>
              </div>

              {/* Crucial system warning specified in HTML */}
              <div className="p-3 bg-[#ffebe4] rounded-xl border border-[#ce4915]/30 text-xs text-[#ce4915] leading-relaxed">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> Peringatan Sistem Multiplier Beban:
                </div>
                Perubahan jadwal mendadak melipatgandakan beban mentor karena kepadatan kalender riset antarsekolah. Sistem menyarankan pengajuan dilakukan minimal <strong>H-7</strong> mengacu pada slot hijau mentor.
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-[#6c7a78]">Diproses oleh: Koordinator Jatim</span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ce4915] hover:bg-[#b83f10] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Permohonan Reschedule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
