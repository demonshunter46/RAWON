import React, { useState } from 'react';
import { 
  AlertTriangle, 
  TrendingUp, 
  UserX, 
  CalendarClock, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight,
  HelpCircle,
  Activity
} from 'lucide-react';
import { SystemAlert } from '../types/rawon';

interface DisruptionSimulatorViewProps {
  alerts: SystemAlert[];
  onTriggerMitigation: (scenarioName: string) => void;
}

export const DisruptionSimulatorView: React.FC<DisruptionSimulatorViewProps> = ({
  alerts,
  onTriggerMitigation,
}) => {
  // S-01 States
  const [surgeRate, setSurgeRate] = useState<number>(18);

  // S-02 States
  const [tierACount, setTierACount] = useState<number>(9);
  const [dropoutProb, setDropoutProb] = useState<number>(15);

  // S-03 States
  const [affectedSchoolPct, setAffectedSchoolPct] = useState<number>(20);

  // Resolution simulation state
  const [simulatingStep, setSimulatingStep] = useState<number | null>(null);
  const [simulationSuccess, setSimulationSuccess] = useState<string | null>(null);

  // Calculations for S-02
  const pProb = Math.min(100, Math.max(0, dropoutProb)) / 100;
  const pAtLeastOne = (1 - Math.pow(1 - pProb, tierACount)) * 100;
  const expectedDropouts = tierACount * pProb;

  // Calculations for S-03
  const pSchool = Math.min(60, Math.max(0, affectedSchoolPct)) / 100;
  const loadFactor = 1 + pSchool * (2 - 1);
  const maxNominalUtil = 1 / loadFactor;
  const isUtilizationCritical = maxNominalUtil < 0.83;

  const handleRunMitigation = (step: number, title: string) => {
    setSimulatingStep(step);
    setTimeout(() => {
      setSimulatingStep(null);
      setSimulationSuccess(`Protokol SOP "${title}" berhasil dieksekusi oleh sistem RAWON.`);
      onTriggerMitigation(title);
      setTimeout(() => setSimulationSuccess(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#202b2a] flex items-center gap-2">
            Pusat Resiliensi &amp; Simulator Gangguan
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ffebe4] text-[#ce4915] font-semibold border border-[#ce4915]/20">
              Real-time SOP Engine
            </span>
          </h2>
          <p className="text-xs text-[#6c7a78] mt-1 max-w-2xl leading-relaxed">
            Menghadapi 3 faktor volatilitas eksternal: lonjakan tarif transportasi (hingga 40%), tingkat burnout/dropout mentor (15%), dan kepadatan jadwal sekolah mitra yang melipatgandakan beban.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-[#e1f4f0] border border-[#117d78]/20 text-xs font-semibold text-[#117d78] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#117d78] animate-pulse" />
            Ambang Batas &rho; = 83% Aktif
          </div>
        </div>
      </div>

      {simulationSuccess && (
        <div className="p-4 rounded-xl bg-[#e1f4f0] border border-[#117d78]/30 text-xs font-bold text-[#117d78] flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{simulationSuccess}</span>
        </div>
      )}

      {/* 3 Interactive Simulators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* S-01: Lonjakan Tarif */}
        <div className="bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ce4915]">
                S-01 Volatilitas
              </span>
              <span className="text-xs font-bold text-[#202b2a] bg-[#f7f8f7] px-2 py-0.5 rounded border border-[#e3e9e7]">
                {surgeRate}%
              </span>
            </div>

            <h3 className="text-base font-bold text-[#202b2a] mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#ce4915]" /> Lonjakan Tarif Transportasi
            </h3>

            <p className="text-xs text-[#6c7a78] mb-4">
              Simulasi kenaikan harga tiket pesawat/kereta antarkota akibat periode libur sekolah atau lonjakan dinamis.
            </p>

            <div className="mb-4">
              <input
                type="range"
                min="0"
                max="50"
                value={surgeRate}
                onChange={(e) => setSurgeRate(parseInt(e.target.value))}
                className="w-full accent-[#ce4915] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#6c7a78] mt-1">
                <span>0% (Normal)</span>
                <span>20% (Peringatan)</span>
                <span>35% (Re-solve)</span>
                <span>50% (Siaga)</span>
              </div>
            </div>

            {/* Dynamic S-01 Output */}
            <div
              className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                surgeRate >= 40
                  ? 'bg-[#ffebe4] border-[#ce4915] text-[#ce4915]'
                  : surgeRate >= 35
                  ? 'bg-[#ffebe4]/80 border-[#ce4915]/60 text-[#ce4915]'
                  : surgeRate >= 20
                  ? 'bg-[#fff2dc] border-[#ff9900] text-[#9b6200]'
                  : 'bg-[#e1f4f0] border-[#117d78] text-[#117d78]'
              }`}
            >
              {surgeRate >= 40 ? (
                <>
                  <strong className="block font-bold">Siaga Tertinggi (Kenaikan &ge; 40%)</strong>
                  Re-solve biaya &times;1,40; aktifkan klausul surcharge B2B untuk Prioritas. Eskalasi ke allocation owner dan manajemen. Tim Medali Nasional tidak boleh turun dari Tier A.
                </>
              ) : surgeRate >= 35 ? (
                <>
                  <strong className="block font-bold">Re-solve Biaya Otomatis (&times;1,35)</strong>
                  Tim Reguler dan Eksekutif yang melampaui SLA dialihkan ke hybrid. Rotasi Prioritas ke mentor lokal hanya bila kualitas dan kemiripan terpenuhi.
                </>
              ) : surgeRate >= 20 ? (
                <>
                  <strong className="block font-bold">Peringatan (&ge; 20%)</strong>
                  Tampilkan selisih hasil re-optimasi dan pesan lebih awal perjalanan yang fleksibel. Tidak ada perubahan tanpa persetujuan koordinator wilayah.
                </>
              ) : (
                <>
                  <strong className="block font-bold">Kondisi Normal (&lt; 20%)</strong>
                  Biaya transportasi stabil dalam estimasi model. Tidak ada tindakan otomatis yang dipicu.
                </>
              )}
            </div>
          </div>

          <button
            onClick={() => handleRunMitigation(1, `Mitigasi Lonjakan Tarif ${surgeRate}%`)}
            disabled={simulatingStep === 1}
            className="mt-4 w-full py-2 bg-[#f7f8f7] hover:bg-[#ffebe4] text-[#ce4915] rounded-xl text-xs font-semibold border border-[#e3e9e7] transition-colors cursor-pointer"
          >
            {simulatingStep === 1 ? 'Mengevaluasi Rute...' : 'Terapkan Respons Tarif'}
          </button>
        </div>

        {/* S-02: Mentor Tier A Drop Out */}
        <div className="bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ff9900]">
                S-02 Burnout
              </span>
              <span className="text-xs font-bold text-[#202b2a] bg-[#f7f8f7] px-2 py-0.5 rounded border border-[#e3e9e7]">
                {dropoutProb}% Risiko
              </span>
            </div>

            <h3 className="text-base font-bold text-[#202b2a] mb-2 flex items-center gap-1.5">
              <UserX className="w-4 h-4 text-[#ff9900]" /> Risiko Drop Out Mentor Tier A
            </h3>

            <p className="text-xs text-[#6c7a78] mb-4">
              Mentor top-tier seringkali mengalami kelebihan beban riset akademis sehingga 15% jadwal batal mendadak.
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-[11px] font-semibold text-[#202b2a] block mb-1">
                  Jumlah Mentor Tier A: {tierACount}
                </label>
                <input
                  type="range"
                  min="3"
                  max="20"
                  value={tierACount}
                  onChange={(e) => setTierACount(parseInt(e.target.value))}
                  className="w-full accent-[#ff9900] cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#202b2a] block mb-1">
                  Peluang Drop Out per Mentor: {dropoutProb}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={dropoutProb}
                  onChange={(e) => setDropoutProb(parseInt(e.target.value))}
                  className="w-full accent-[#ff9900] cursor-pointer"
                />
              </div>
            </div>

            {/* S-02 Output */}
            <div
              className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                pAtLeastOne >= 50
                  ? 'bg-[#fff2dc] border-[#ff9900] text-[#9b6200]'
                  : 'bg-[#e1f4f0] border-[#117d78] text-[#117d78]'
              }`}
            >
              <div>
                Peluang minimal 1 mentor drop out:{' '}
                <strong className="text-sm font-bold">{pAtLeastOne.toFixed(1)}%</strong>
              </div>
              <div className="mt-1">
                Ekspektasi jumlah drop out:{' '}
                <strong className="text-sm font-bold">{expectedDropouts.toFixed(2)}</strong> mentor
              </div>
              <div className="mt-1 text-[11px] opacity-90">
                Karena probabilitas tinggi ({pAtLeastOne.toFixed(1)}%), mentor cadangan wajib ditetapkan di muka dan konfirmasi kesiapan H-3 wajib ditegakkan.
              </div>
            </div>
          </div>

          <button
            onClick={() => handleRunMitigation(2, 'Aktivasi Cadangan Pra-Tetap')}
            disabled={simulatingStep === 2}
            className="mt-4 w-full py-2 bg-[#f7f8f7] hover:bg-[#fff2dc] text-[#9b6200] rounded-xl text-xs font-semibold border border-[#e3e9e7] transition-colors cursor-pointer"
          >
            {simulatingStep === 2 ? 'Memeriksa Kesiapan H-3...' : 'Kunci Cadangan di Muka'}
          </button>
        </div>

        {/* S-03: Jadwal Sekolah Berubah */}
        <div className="bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#07b3b3]">
                S-03 Rescheduling
              </span>
              <span className="text-xs font-bold text-[#202b2a] bg-[#f7f8f7] px-2 py-0.5 rounded border border-[#e3e9e7]">
                {affectedSchoolPct}% Sekolah
              </span>
            </div>

            <h3 className="text-base font-bold text-[#202b2a] mb-2 flex items-center gap-1.5">
              <CalendarClock className="w-4 h-4 text-[#07b3b3]" /> Perubahan Jadwal Sekolah
            </h3>

            <p className="text-xs text-[#6c7a78] mb-4">
              Perubahan jadwal dari sekolah melipatgandakan beban mentor karena sesi harus digeser atau dipadatkan.
            </p>

            <div className="mb-4">
              <input
                type="range"
                min="0"
                max="60"
                value={affectedSchoolPct}
                onChange={(e) => setAffectedSchoolPct(parseInt(e.target.value))}
                className="w-full accent-[#07b3b3] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#6c7a78] mt-1">
                <span>0% (Stabil)</span>
                <span>20% (Baseline)</span>
                <span>40% (Tinggi)</span>
                <span>60% (Kritis)</span>
              </div>
            </div>

            {/* S-03 Output */}
            <div
              className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                isUtilizationCritical
                  ? 'bg-[#ffebe4] border-[#ce4915] text-[#ce4915]'
                  : 'bg-[#e1f4f0] border-[#117d78] text-[#117d78]'
              }`}
            >
              <div>
                Faktor beban rata-rata:{' '}
                <strong className="text-sm font-bold">{loadFactor.toFixed(2)}&times;</strong> nominal
              </div>
              <div className="mt-1">
                Utilisasi nominal maksimum:{' '}
                <strong className="text-sm font-bold">{(maxNominalUtil * 100).toFixed(1)}%</strong>
              </div>
              <div className="mt-1 text-[11px] opacity-90">
                Batas &rho; pada model adalah 83%.{' '}
                {isUtilizationCritical
                  ? 'Pada tingkat gangguan ini batas kuota wajib diturunkan segera untuk menghindari penolakan massal.'
                  : 'Batas toleransi 83% masih memadai untuk menyerap penundaan jadwal.'}
              </div>
            </div>
          </div>

          <button
            onClick={() => handleRunMitigation(3, 'Penyesuaian Batas Kuota 83%')}
            disabled={simulatingStep === 3}
            className="mt-4 w-full py-2 bg-[#f7f8f7] hover:bg-[#e1f4f0] text-[#117d78] rounded-xl text-xs font-semibold border border-[#e3e9e7] transition-colors cursor-pointer"
          >
            {simulatingStep === 3 ? 'Menghitung Batas Beban...' : 'Terapkan Batas Beban 83%'}
          </button>
        </div>
      </div>

      {/* Urutan Pengganti SOP Hierarki (From HTML) */}
      <div className="bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e3e9e7]">
          <div>
            <h3 className="text-base font-bold text-[#202b2a]">
              Urutan Hierarki Pengganti Saat Mentor Berhalangan
            </h3>
            <p className="text-xs text-[#6c7a78] mt-0.5">
              Sistem mengeksekusi penggantian secara otomatis dan berhenti pada langkah pertama yang layak. Konfirmasi kesiapan mentor dilakukan pada H-3.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-[#117d78] bg-[#e1f4f0] px-3 py-1 rounded-full border border-[#117d78]/20">
            5 Langkah Mitigasi Bertingkat
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Step 1 */}
          <div className="p-4 rounded-xl border border-[#e3e9e7] bg-[#fbfcfb] flex flex-col justify-between hover:border-[#117d78] transition-colors">
            <div>
              <div className="w-7 h-7 rounded-full bg-[#117d78] text-white text-xs font-bold flex items-center justify-center mb-2">
                1
              </div>
              <h4 className="text-xs font-bold text-[#202b2a] mb-1">Cadangan Pra-Tetap</h4>
              <p className="text-[11px] text-[#6c7a78] leading-relaxed">
                Mentor cadangan yang sudah ditetapkan di muka (kemiripan keilmuan &ge; 0,8, rumpun sama, tier &ge; lantai).
              </p>
            </div>
            <span className="mt-3 text-[10px] text-[#117d78] font-bold">Opsi Utama (Otomatis)</span>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl border border-[#e3e9e7] bg-[#fbfcfb] flex flex-col justify-between hover:border-[#07b3b3] transition-colors">
            <div>
              <div className="w-7 h-7 rounded-full bg-[#07b3b3] text-white text-xs font-bold flex items-center justify-center mb-2">
                2
              </div>
              <h4 className="text-xs font-bold text-[#202b2a] mb-1">Mentor Kota Sama</h4>
              <p className="text-[11px] text-[#6c7a78] leading-relaxed">
                Mentor lain di kota yang sama dengan kemiripan &ge; 0,8 dan kuota tersedia (&le; 83%).
              </p>
            </div>
            <span className="mt-3 text-[10px] text-[#07b3b3] font-bold">Bebas Ongkos Ekstra</span>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl border border-[#e3e9e7] bg-[#fbfcfb] flex flex-col justify-between hover:border-[#ff9900] transition-colors">
            <div>
              <div className="w-7 h-7 rounded-full bg-[#ff9900] text-white text-xs font-bold flex items-center justify-center mb-2">
                3
              </div>
              <h4 className="text-xs font-bold text-[#202b2a] mb-1">Mentor Antarkota</h4>
              <p className="text-[11px] text-[#6c7a78] leading-relaxed">
                Mentor dari kota lain, selama biaya perjalanan masih dalam SLA tahan guncangan atau tim Prioritas.
              </p>
            </div>
            <span className="mt-3 text-[10px] text-[#9b6200] font-bold">Perlu Review SLA</span>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl border border-[#e3e9e7] bg-[#fbfcfb] flex flex-col justify-between hover:border-[#ff9559] transition-colors">
            <div>
              <div className="w-7 h-7 rounded-full bg-[#ff9559] text-white text-xs font-bold flex items-center justify-center mb-2">
                4
              </div>
              <h4 className="text-xs font-bold text-[#202b2a] mb-1">Alihkan ke Hybrid</h4>
              <p className="text-[11px] text-[#6c7a78] leading-relaxed">
                Sesi diubah ke online/hybrid; tatap muka dijadwalkan ulang pada tonggak eksperimen berikutnya.
              </p>
            </div>
            <span className="mt-3 text-[10px] text-[#ce4915] font-bold">Mitigasi Fleksibel</span>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-xl border border-[#e3e9e7] bg-[#fbfcfb] flex flex-col justify-between hover:border-[#ce4915] transition-colors">
            <div>
              <div className="w-7 h-7 rounded-full bg-[#ce4915] text-white text-xs font-bold flex items-center justify-center mb-2">
                5
              </div>
              <h4 className="text-xs font-bold text-[#202b2a] mb-1">Relaksasi Kemiripan</h4>
              <p className="text-[11px] text-[#6c7a78] leading-relaxed">
                Kemiripan diturunkan ke 0,7 dengan persetujuan allocation owner dan catatan di log audit.
              </p>
            </div>
            <span className="mt-3 text-[10px] text-[#ce4915] font-bold">Eskalasi Manual</span>
          </div>
        </div>
      </div>
    </div>
  );
};
