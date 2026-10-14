import React, { useState } from 'react';
import { 
  UserCheck, 
  MapPin, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Send, 
  PhoneCall, 
  RefreshCw,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { ResearchTeam, Mentor } from '../../types/rawon';

interface CoordinatorViewProps {
  teams: ResearchTeam[];
  mentors: Mentor[];
  onTriggerAlert: (msg: string) => void;
}

export const CoordinatorView: React.FC<CoordinatorViewProps> = ({
  teams,
  mentors,
  onTriggerAlert,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('Surabaya');
  const [h3Status, setH3Status] = useState<Record<string, 'Terkonfirmasi' | 'Menunggu' | 'Berhalangan'>>({
    'M-012': 'Terkonfirmasi',
    'M-015': 'Menunggu',
    'M-016': 'Terkonfirmasi',
    'M-011': 'Menunggu',
  });

  // Local transit fares
  const [localFares, setLocalFares] = useState({
    keretaSurabayaMalang: 45000,
    travelSurabayaSolo: 180000,
    tiketPesawatJktSby: 680000,
  });
  const [fareUpdated, setFareUpdated] = useState(false);

  // Teams in coordinator's region
  const regionalTeams = teams.filter((t) => t.city === selectedCity || t.city === 'Malang');

  // Chasing mentor
  const handlePingMentor = (mentorName: string) => {
    onTriggerAlert(`Notifikasi H-3 telah dikirimkan via WhatsApp API RAWON ke ${mentorName}.`);
  };

  const handleUpdateStatus = (mentorId: string, status: 'Terkonfirmasi' | 'Menunggu' | 'Berhalangan') => {
    setH3Status((prev) => ({ ...prev, [mentorId]: status }));
    if (status === 'Berhalangan') {
      onTriggerAlert(`Mentor ${mentorId} di wilayah ${selectedCity} ditandai berhalangan.`);
    }
  };

  const handleSaveFares = (e: React.FormEvent) => {
    e.preventDefault();
    setFareUpdated(true);
    setTimeout(() => setFareUpdated(false), 2500);
    onTriggerAlert(`Tarif transportasi rute Jawa Timur diperbarui oleh Koordinator Wilayah.`);
  };

  return (
    <div className="space-y-6">
      {/* Role Banner */}
      <div className="bg-gradient-to-r from-[#117d78] to-[#07b3b3] p-4 sm:p-5 rounded-2xl text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold mb-2">
            <UserCheck className="w-3.5 h-3.5" /> Portal Koordinator Wilayah
          </div>
          <h2 className="text-xl font-bold">Wilayah Kerja: Jawa Timur (Surabaya, Malang, Sidoarjo)</h2>
          <p className="text-xs text-white/90 mt-1 max-w-2xl leading-relaxed">
            Fokus peran: Memastikan kehadiran mentor pada H-3, memantau lonjakan tarif tiket lokal, dan menyetujui pengganti darurat di kota yang sama untuk klaster Reguler &amp; Eksekutif.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-white/80">Pilih Kota:</span>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-white text-[#202b2a] text-xs font-bold rounded-xl px-3 py-2 outline-none shadow-xs"
          >
            <option value="Surabaya">Surabaya &amp; Sekitarnya</option>
            <option value="Malang">Malang Raya</option>
            <option value="Semarang">Semarang (Jawa Tengah)</option>
          </select>
        </div>
      </div>

      {/* 2 Main Functional Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Module 1: H-3 Readiness & Attendance Tracker */}
        <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-2xl border border-[#e3e9e7] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e3e9e7]">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#117d78]" />
              <div>
                <h3 className="text-base font-bold text-[#202b2a]">
                  Status Konfirmasi Kesiapan Sesi H-3
                </h3>
                <p className="text-xs text-[#6c7a78]">
                  SOP mitigasi burnout: Mentor wajib konfirmasi 3 hari sebelum sesi bimbingan tatap muka.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#117d78] bg-[#e1f4f0] px-2.5 py-1 rounded-full">
              SOP Wajib H-3
            </span>
          </div>

          <div className="space-y-3">
            {[
              { id: 'M-012', name: 'Dr. Maya Lestari, M.Sc.', school: 'SMA 1 Surabaya', date: 'Sabtu, 17 Mei 2025', team: 'Bio-Inovasi' },
              { id: 'M-015', name: 'Nadia Salsabila, S.Pd., M.A.', school: 'SMA 4 Surabaya', date: 'Sabtu, 17 Mei 2025', team: 'Kajian Minat Baca' },
              { id: 'M-016', name: 'Tasya Anindya, S.Pd.', school: 'SMA 2 Surabaya', date: 'Minggu, 18 Mei 2025', team: 'Enzyme Catalyst' },
              { id: 'M-011', name: 'Dr. Arif Budiman, M.Si.', school: 'SMA 5 Surabaya', date: 'Senin, 19 Mei 2025', team: 'Urban Heritage IPS' },
            ].map((item) => {
              const status = h3Status[item.id] || 'Menunggu';
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-[#e3e9e7] bg-[#fbfcfb] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#202b2a]">{item.name}</span>
                      <span className="font-mono text-[10px] text-[#ce4915] bg-[#ffebe4] px-1.5 py-0.5 rounded font-semibold">
                        {item.id}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#6c7a78] mt-0.5">
                      Bimbingan: <strong>{item.team}</strong> ({item.school}) • Jadwal: {item.date}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        status === 'Terkonfirmasi'
                          ? 'bg-[#e1f4f0] text-[#117d78]'
                          : status === 'Menunggu'
                          ? 'bg-[#fff2dc] text-[#9b6200]'
                          : 'bg-[#ffebe4] text-[#ce4915]'
                      }`}
                    >
                      {status}
                    </span>

                    {status === 'Menunggu' && (
                      <button
                        onClick={() => handlePingMentor(item.name)}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-[#117d78] text-white rounded-lg hover:bg-[#0e6b66] flex items-center gap-1 cursor-pointer"
                        title="Kirim pengingat WhatsApp ke mentor"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Tagih H-3</span>
                      </button>
                    )}

                    <select
                      value={status}
                      onChange={(e) => handleUpdateStatus(item.id, e.target.value as any)}
                      className="text-[11px] bg-white border border-[#e3e9e7] rounded-lg p-1 outline-none text-[#202b2a]"
                    >
                      <option value="Terkonfirmasi">Set Terkonfirmasi</option>
                      <option value="Menunggu">Set Menunggu</option>
                      <option value="Berhalangan">Tandai Berhalangan</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-[#e1f4f0]/60 rounded-xl text-xs text-[#117d78] flex items-center justify-between">
            <span>Kewenangan: Koordinator dapat menyetujui pengganti lokal untuk klaster Reguler &amp; Eksekutif.</span>
            <span className="font-bold">Otonom</span>
          </div>
        </div>

        {/* Module 2: Input Tarif Transportasi Aktual Lapangan */}
        <div className="lg:col-span-5 bg-white p-4 sm:p-6 rounded-2xl border border-[#e3e9e7] shadow-xs flex flex-col justify-between">
          <form onSubmit={handleSaveFares}>
            <div className="flex items-center gap-2 pb-3 border-b border-[#e3e9e7] mb-4">
              <DollarSign className="w-5 h-5 text-[#ce4915]" />
              <div>
                <h3 className="text-base font-bold text-[#202b2a]">
                  Input Tarif Lapangan Aktual
                </h3>
                <p className="text-xs text-[#6c7a78]">
                  Pembaruan harga tiket aktual untuk deteksi dini lonjakan biaya &ge; 20%.
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#202b2a] mb-1">
                  Kereta Komuter Surabaya – Malang (PP):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6c7a78]">Rp</span>
                  <input
                    type="number"
                    value={localFares.keretaSurabayaMalang}
                    onChange={(e) => setLocalFares({ ...localFares, keretaSurabayaMalang: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs bg-[#fbfcfb] border border-[#dce5e2] rounded-xl pl-9 pr-3 py-2 text-[#202b2a] font-bold outline-none focus:border-[#117d78]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202b2a] mb-1">
                  Travel Antarkota Surabaya – Solo/Yogya:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6c7a78]">Rp</span>
                  <input
                    type="number"
                    value={localFares.travelSurabayaSolo}
                    onChange={(e) => setLocalFares({ ...localFares, travelSurabayaSolo: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs bg-[#fbfcfb] border border-[#dce5e2] rounded-xl pl-9 pr-3 py-2 text-[#202b2a] font-bold outline-none focus:border-[#117d78]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202b2a] mb-1">
                  Tiket Pesawat Jakarta – Surabaya:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6c7a78]">Rp</span>
                  <input
                    type="number"
                    value={localFares.tiketPesawatJktSby}
                    onChange={(e) => setLocalFares({ ...localFares, tiketPesawatJktSby: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs bg-[#fbfcfb] border border-[#dce5e2] rounded-xl pl-9 pr-3 py-2 text-[#202b2a] font-bold outline-none focus:border-[#117d78]"
                  />
                </div>
                <span className="text-[10px] text-[#ce4915] mt-1 block">
                  *Bila tarif naik &ge; 20%, sistem otomatis memicu peringatan ke Allocation Owner.
                </span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#e3e9e7] flex items-center justify-between">
              {fareUpdated ? (
                <span className="text-xs font-bold text-[#117d78] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Tarif Berhasil Diperbarui
                </span>
              ) : (
                <span className="text-[11px] text-[#6c7a78]">Pembaruan terakhir: Hari ini</span>
              )}

              <button
                type="submit"
                className="px-4 py-2 bg-[#117d78] hover:bg-[#0e6b66] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simpan Tarif Wilayah</span>
              </button>
            </div>
          </form>

          <div className="mt-4 p-3 bg-[#fff2dc] rounded-xl border border-[#ff9900]/30 text-xs text-[#9b6200]">
            <strong>Batasan Wewenang:</strong> Koordinator Wilayah tidak diizinkan merotasi atau membatalkan mentor Tim Prioritas tanpa persetujuan tertulis dari Allocation Owner.
          </div>
        </div>
      </div>

      {/* Regional Teams Table */}
      <div className="bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#202b2a]">
          Tim Riset Bimbingan Wilayah Jawa Timur ({regionalTeams.length} Tim)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f7f8f7] text-[#60716e] border-b border-[#e3e9e7] font-semibold">
                <th className="py-2.5 px-3">ID &amp; Nama Tim</th>
                <th className="py-2.5 px-3">Sekolah</th>
                <th className="py-2.5 px-3">Kota</th>
                <th className="py-2.5 px-3">Klaster</th>
                <th className="py-2.5 px-3">Mentor Utama</th>
                <th className="py-2.5 px-3">Cadangan</th>
                <th className="py-2.5 px-3">Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e9e7]">
              {regionalTeams.map((t) => (
                <tr key={t.id} className="hover:bg-[#fbfcfb]">
                  <td className="py-3 px-3 font-bold text-[#202b2a]">
                    <span className="font-mono text-[#ce4915] mr-1.5">{t.id}</span>
                    {t.name}
                  </td>
                  <td className="py-3 px-3 text-[#6c7a78]">{t.school}</td>
                  <td className="py-3 px-3 text-[#202b2a]">{t.city}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#f7f8f7] border border-[#e3e9e7]">
                      {t.clusterName.split('–')[0]}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-[#202b2a]">
                    {t.primaryMentorId || 'Belum Ditugaskan'}
                  </td>
                  <td className="py-3 px-3 text-[#6c7a78]">
                    {t.backupMentorId || '-'}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#e1f4f0] text-[#117d78]">
                      {t.mode}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
