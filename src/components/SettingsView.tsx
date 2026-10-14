import React, { useState } from 'react';
import { 
  Settings, 
  Sliders, 
  History, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  RotateCcw,
  BookOpen,
  HelpCircle,
  FileCode2
} from 'lucide-react';
import { ModelParameters } from '../types/rawon';

interface SettingsViewProps {
  parameters: ModelParameters;
  onUpdateParameters: (params: ModelParameters) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  parameters,
  onUpdateParameters,
}) => {
  const [localParams, setLocalParams] = useState<ModelParameters>({ ...parameters });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateParameters(localParams);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    const defaults: ModelParameters = {
      maxUtilizationRho: 0.83,
      similarityThresholdTheta: 0.80,
      fallbackSimilarityTheta2: 0.70,
      tierDelta: 0.05,
      weightExperience: 0.281,
      weightPortfolio: 0.340,
      weightIPM: 0.379,
      slaExecutive: 300000,
      slaRegular: 50000,
    };
    setLocalParams(defaults);
    onUpdateParameters(defaults);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const auditLogs = [
    {
      time: '14 Mei 2025 • 10:30',
      action: 'Penugasan Alokasi Eco-Pack',
      actor: 'Sarah Anindita (Allocation Owner)',
      detail: 'Penugasan Dr. Raka Pratama (Tier A) dengan mentor cadangan Dr. Andi Wijaya.',
      status: 'Approved',
    },
    {
      time: '14 Mei 2025 • 09:15',
      action: 'Peringatan Tarif Transportasi Antarkota',
      actor: 'RAWON System Daemon',
      detail: 'Kenaikan tiket pesawat rute Jakarta - Makassar 18% terdeteksi, masih di bawah ambang mitigasi 20%.',
      status: 'Logged',
    },
    {
      time: '14 Mei 2025 • 08:45',
      action: 'MILP Auto-Solve Eksekusi 20 Tim',
      actor: 'RAWON Optimization Engine',
      detail: 'Re-optimasi 20 tim pilot: 0 pelanggaran batas kuota, 0 kasus over-servicing, selisih biaya -52,7%.',
      status: 'Success',
    },
    {
      time: '14 Mei 2025 • 07:20',
      action: 'Status Berhalangan Mentor M-001',
      actor: 'Koordinator Bogor',
      detail: 'Dr. Andi Wijaya ditandai berhalangan. Tim bimbingan dialihkan ke mentor cadangan M-020.',
      status: 'Escalated',
    },
    {
      time: '13 Mei 2025 • 16:40',
      action: 'Pembaruan Batas SLA Eksekutif',
      actor: 'Sarah Anindita (Allocation Owner)',
      detail: 'Batas SLA perjalanan Eksekutif disesuaikan menjadi Rp300.000 / sesi.',
      status: 'Updated',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#202b2a] flex items-center gap-2">
            Pengaturan Algoritma &amp; Log Audit
          </h2>
          <p className="text-xs text-[#6c7a78] mt-1 max-w-2xl leading-relaxed">
            Konfigurasi parameter matematis Mixed Integer Linear Programming (MILP) dan bobot MCDM. Seluruh perubahan parameter tercatat secara transparan di log audit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-[#f7f8f7] hover:bg-[#e3e9e7] border border-[#e3e9e7] text-xs font-semibold text-[#6c7a78] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-[#e1f4f0] border border-[#117d78]/30 text-xs font-bold text-[#117d78] flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Pengaturan parameter berhasil disimpan dan diterapkan pada solver RAWON!</span>
        </div>
      )}

      {/* Parameter Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-[#e3e9e7]">
          <Sliders className="w-5 h-5 text-[#ce4915]" />
          <h3 className="text-base font-bold text-[#202b2a]">Parameter Solver &amp; Asumsi Model</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Rho: Max utilization */}
          <div className="bg-[#fbfcfb] p-4 rounded-xl border border-[#e3e9e7]">
            <label className="block text-xs font-bold text-[#202b2a] mb-1">
              Batas Utilisasi Maksimal (&rho;)
            </label>
            <p className="text-[11px] text-[#6c7a78] mb-3">
              Maksimal kapasitas mentor yang dialokasikan guna menyerap keterlambatan jadwal sekolah.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.01"
                min="0.5"
                max="1.0"
                value={localParams.maxUtilizationRho}
                onChange={(e) =>
                  setLocalParams({ ...localParams, maxUtilizationRho: parseFloat(e.target.value) || 0.83 })
                }
                className="w-24 text-xs bg-white text-[#202b2a] border border-[#dce5e2] rounded-xl p-2 font-bold outline-none focus:border-[#ce4915]"
              />
              <span className="text-xs font-bold text-[#117d78]">
                {(localParams.maxUtilizationRho * 100).toFixed(0)}% Kuota Nominal
              </span>
            </div>
          </div>

          {/* Theta: Similarity threshold */}
          <div className="bg-[#fbfcfb] p-4 rounded-xl border border-[#e3e9e7]">
            <label className="block text-xs font-bold text-[#202b2a] mb-1">
              Ambang Kemiripan Linearitas (&theta;)
            </label>
            <p className="text-[11px] text-[#6c7a78] mb-3">
              Kesesuaian rumpun keilmuan mentor dengan topik riset siswa (pencegahan under-servicing).
            </p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.05"
                min="0.5"
                max="1.0"
                value={localParams.similarityThresholdTheta}
                onChange={(e) =>
                  setLocalParams({ ...localParams, similarityThresholdTheta: parseFloat(e.target.value) || 0.8 })
                }
                className="w-24 text-xs bg-white text-[#202b2a] border border-[#dce5e2] rounded-xl p-2 font-bold outline-none focus:border-[#ce4915]"
              />
              <span className="text-xs font-bold text-[#117d78]">
                &ge; {localParams.similarityThresholdTheta}
              </span>
            </div>
          </div>

          {/* Fallback Theta: 0.70 */}
          <div className="bg-[#fbfcfb] p-4 rounded-xl border border-[#e3e9e7]">
            <label className="block text-xs font-bold text-[#202b2a] mb-1">
              Ambang Relaksasi Darurat (&theta;&sub2;)
            </label>
            <p className="text-[11px] text-[#6c7a78] mb-3">
              Batas minimum toleransi kemiripan saat terjadi drop out gawat darurat (Langkah 5 SOP).
            </p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.05"
                min="0.5"
                max="0.9"
                value={localParams.fallbackSimilarityTheta2}
                onChange={(e) =>
                  setLocalParams({ ...localParams, fallbackSimilarityTheta2: parseFloat(e.target.value) || 0.7 })
                }
                className="w-24 text-xs bg-white text-[#202b2a] border border-[#dce5e2] rounded-xl p-2 font-bold outline-none focus:border-[#ce4915]"
              />
              <span className="text-xs font-bold text-[#ce4915]">
                &ge; {localParams.fallbackSimilarityTheta2}
              </span>
            </div>
          </div>

          {/* Bobot Pengalaman */}
          <div className="bg-[#fbfcfb] p-4 rounded-xl border border-[#e3e9e7]">
            <label className="block text-xs font-bold text-[#202b2a] mb-1">
              Bobot MQI: Pengalaman (w&sub1;)
            </label>
            <input
              type="number"
              step="0.001"
              value={localParams.weightExperience}
              onChange={(e) =>
                setLocalParams({ ...localParams, weightExperience: parseFloat(e.target.value) || 0.281 })
              }
              className="w-full text-xs bg-white text-[#202b2a] border border-[#dce5e2] rounded-xl p-2 font-mono outline-none focus:border-[#ce4915]"
            />
          </div>

          {/* Bobot Portofolio */}
          <div className="bg-[#fbfcfb] p-4 rounded-xl border border-[#e3e9e7]">
            <label className="block text-xs font-bold text-[#202b2a] mb-1">
              Bobot MQI: Portofolio (w&sub2;)
            </label>
            <input
              type="number"
              step="0.001"
              value={localParams.weightPortfolio}
              onChange={(e) =>
                setLocalParams({ ...localParams, weightPortfolio: parseFloat(e.target.value) || 0.340 })
              }
              className="w-full text-xs bg-white text-[#202b2a] border border-[#dce5e2] rounded-xl p-2 font-mono outline-none focus:border-[#ce4915]"
            />
          </div>

          {/* Bobot IPM */}
          <div className="bg-[#fbfcfb] p-4 rounded-xl border border-[#e3e9e7]">
            <label className="block text-xs font-bold text-[#202b2a] mb-1">
              Bobot MQI: IPM (w&sub3;)
            </label>
            <input
              type="number"
              step="0.001"
              value={localParams.weightIPM}
              onChange={(e) =>
                setLocalParams({ ...localParams, weightIPM: parseFloat(e.target.value) || 0.379 })
              }
              className="w-full text-xs bg-white text-[#202b2a] border border-[#dce5e2] rounded-xl p-2 font-mono outline-none focus:border-[#ce4915]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#ce4915] hover:bg-[#b83f10] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Parameter</span>
          </button>
        </div>
      </form>

      {/* Audit Log Table */}
      <div className="bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#e3e9e7]">
          <History className="w-5 h-5 text-[#117d78]" />
          <h3 className="text-base font-bold text-[#202b2a]">Log Audit Transaksi &amp; Keputusan Sistem</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f7f8f7] text-[#60716e] border-b border-[#e3e9e7] font-semibold">
                <th className="py-2.5 px-3">Waktu</th>
                <th className="py-2.5 px-3">Aksi</th>
                <th className="py-2.5 px-3">Aktor</th>
                <th className="py-2.5 px-4">Detail &amp; Alasan</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e9e7]">
              {auditLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-[#fbfcfb]">
                  <td className="py-3 px-3 text-[#6c7a78] font-mono text-[11px] whitespace-nowrap">
                    {log.time}
                  </td>
                  <td className="py-3 px-3 font-bold text-[#202b2a]">{log.action}</td>
                  <td className="py-3 px-3 text-[#202b2a]">{log.actor}</td>
                  <td className="py-3 px-4 text-[#6c7a78]">{log.detail}</td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        log.status === 'Approved' || log.status === 'Success'
                          ? 'bg-[#e1f4f0] text-[#117d78]'
                          : log.status === 'Escalated'
                          ? 'bg-[#ffebe4] text-[#ce4915]'
                          : 'bg-[#fff2dc] text-[#9b6200]'
                      }`}
                    >
                      {log.status}
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
