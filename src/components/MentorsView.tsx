import React, { useState } from 'react';
import { 
  Users, 
  Calculator, 
  Search, 
  Filter, 
  Sparkles, 
  Award, 
  AlertTriangle, 
  MapPin, 
  CheckCircle2, 
  UserPlus, 
  Layers,
  ChevronRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { Mentor, Tier } from '../types/rawon';

interface MentorsViewProps {
  mentors: Mentor[];
  onAddMentor?: (mentor: Mentor) => void;
}

export const MentorsView: React.FC<MentorsViewProps> = ({
  mentors,
  onAddMentor,
}) => {
  // MQI Calculator states
  const [calcExp, setCalcExp] = useState<number>(4);
  const [calcPort, setCalcPort] = useState<number>(4);
  const [calcIPM, setCalcIPM] = useState<number>(4.5);
  const [newMentorName, setNewMentorName] = useState<string>('');
  const [newMentorCity, setNewMentorCity] = useState<string>('Jakarta');
  const [newMentorField, setNewMentorField] = useState<'Saintek' | 'Soshum / IPS' | 'Lingkungan' | 'Robotika & IoT' | 'Kesehatan'>('Saintek');

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('all');
  const [selectedFieldFilter, setSelectedFieldFilter] = useState<string>('all');
  const [showAddSuccess, setShowAddSuccess] = useState<boolean>(false);

  // Compute MQI
  const expNorm = Math.min(1, Math.max(0, (calcExp - 1) / 4));
  const portNorm = Math.min(1, Math.max(0, (calcPort - 1) / 4));
  const ipmNorm = Math.min(1, Math.max(0, (calcIPM - 3.4) / 1.6));
  const computedQ = 0.281 * expNorm + 0.340 * portNorm + 0.379 * ipmNorm;

  const computedTier: Tier = computedQ >= 0.68 ? 'A' : computedQ >= 0.30 ? 'B' : 'C';

  // Filtered mentors
  const filteredMentors = mentors.filter((m) => {
    if (selectedTierFilter !== 'all' && m.tier !== selectedTierFilter) return false;
    if (selectedFieldFilter !== 'all' && m.field !== selectedFieldFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        m.specialization.toLowerCase().includes(q) ||
        m.field.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const tierACount = mentors.filter((m) => m.tier === 'A').length;
  const tierBCount = mentors.filter((m) => m.tier === 'B').length;
  const tierCCount = mentors.filter((m) => m.tier === 'C').length;

  const handleCreateMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMentorName.trim() || !onAddMentor) return;

    const newId = `M-${String(mentors.length + 1).padStart(3, '0')}`;
    const newMentor: Mentor = {
      id: newId,
      name: newMentorName.trim(),
      tier: computedTier,
      mqiScore: parseFloat(computedQ.toFixed(3)),
      experience: calcExp,
      portfolio: calcPort,
      ipm: calcIPM,
      city: newMentorCity,
      field: newMentorField,
      maxQuota: computedTier === 'A' ? 8 : computedTier === 'B' ? 10 : 14,
      assignedCount: 0,
      specialization: `${newMentorField} Terapan`,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };

    onAddMentor(newMentor);
    setNewMentorName('');
    setShowAddSuccess(true);
    setTimeout(() => setShowAddSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#202b2a] flex items-center gap-2">
            Direktori Mentor &amp; Kalkulator MQI
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#e1f4f0] text-[#117d78] font-semibold border border-[#117d78]/20">
              Total {mentors.length} Mentor Terdaftar
            </span>
          </h2>
          <p className="text-xs text-[#6c7a78] mt-1 max-w-2xl leading-relaxed">
            Standardisasi kualitas mentor riset ilmiah menggunakan algoritma Multi-Criteria Decision Making (MCDM) untuk membagi tier secara obyektif berdasarkan Jenks natural breaks.
          </p>
        </div>

        {/* Tier Count Pills */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-2 rounded-xl bg-[#e1f4f0] border border-[#117d78]/20 text-center">
            <span className="text-[10px] uppercase font-bold text-[#117d78] block">Tier A</span>
            <span className="text-base font-extrabold text-[#117d78]">{tierACount}</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[#fff2dc] border border-[#ff9900]/20 text-center">
            <span className="text-[10px] uppercase font-bold text-[#9b6200] block">Tier B</span>
            <span className="text-base font-extrabold text-[#9b6200]">{tierBCount}</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[#ffebe4] border border-[#ce4915]/20 text-center">
            <span className="text-[10px] uppercase font-bold text-[#ce4915] block">Tier C</span>
            <span className="text-base font-extrabold text-[#ce4915]">{tierCCount}</span>
          </div>
        </div>
      </div>

      {/* Top Split: Interactive MQI Calculator (Left) & Pilot Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Interactive MQI Calculator */}
        <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-2xl border border-[#e3e9e7] shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e3e9e7]">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#ce4915]" />
              <h3 className="text-base font-bold text-[#202b2a]">Kalkulator MQI (Mentor Quality Index)</h3>
            </div>
            <span className="text-[10px] font-semibold text-[#6c7a78] bg-[#f7f8f7] px-2.5 py-1 rounded-full border border-[#e3e9e7]">
              MCDM Linear Normalization
            </span>
          </div>

          <form onSubmit={handleCreateMentor} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Parameter 1: Pengalaman */}
              <div className="bg-[#f7f8f7] p-3 rounded-xl border border-[#e3e9e7]">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-[#202b2a]">Pengalaman</label>
                  <span className="text-xs font-bold text-[#ce4915]">{calcExp} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={calcExp}
                  onChange={(e) => setCalcExp(parseFloat(e.target.value))}
                  className="w-full accent-[#ce4915] cursor-pointer"
                />
                <span className="text-[10px] text-[#6c7a78]">Bobot: 0,281 (Skala 1–5)</span>
              </div>

              {/* Parameter 2: Portofolio */}
              <div className="bg-[#f7f8f7] p-3 rounded-xl border border-[#e3e9e7]">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-[#202b2a]">Portofolio</label>
                  <span className="text-xs font-bold text-[#ce4915]">{calcPort} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={calcPort}
                  onChange={(e) => setCalcPort(parseFloat(e.target.value))}
                  className="w-full accent-[#ce4915] cursor-pointer"
                />
                <span className="text-[10px] text-[#6c7a78]">Bobot: 0,340 (Skala 1–5)</span>
              </div>

              {/* Parameter 3: IPM */}
              <div className="bg-[#f7f8f7] p-3 rounded-xl border border-[#e3e9e7]">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-[#202b2a]">IPM (Indeks)</label>
                  <span className="text-xs font-bold text-[#ce4915]">{calcIPM.toFixed(1)} / 5.0</span>
                </div>
                <input
                  type="range"
                  min="3.4"
                  max="5.0"
                  step="0.1"
                  value={calcIPM}
                  onChange={(e) => setCalcIPM(parseFloat(e.target.value))}
                  className="w-full accent-[#ce4915] cursor-pointer"
                />
                <span className="text-[10px] text-[#6c7a78]">Bobot: 0,379 (Min 3,4)</span>
              </div>
            </div>

            {/* Live Calculation Output Display */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                computedTier === 'A'
                  ? 'bg-[#e1f4f0] border-[#117d78]/30 text-[#117d78]'
                  : computedTier === 'B'
                  ? 'bg-[#fff2dc] border-[#ff9900]/30 text-[#9b6200]'
                  : 'bg-[#ffebe4] border-[#ce4915]/30 text-[#ce4915]'
              }`}
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider block">
                  Hasil Skor MQI (Q)
                </span>
                <span className="text-2xl font-extrabold tracking-tight">
                  Q = {computedQ.toFixed(3)}
                </span>
                <span className="text-[11px] block mt-0.5 opacity-90">
                  {computedTier === 'A'
                    ? 'Tier A (Q ≥ 0,68) • Sangat Layak Membimbing Tim Prioritas Medali'
                    : computedTier === 'B'
                    ? 'Tier B (0,30 ≤ Q < 0,68) • Alokasi Eksekutif & Karya Tulis Ilmiah'
                    : 'Tier C (Q < 0,30) • Khusus Reguler / Riset Dasar'}
                </span>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1.5 rounded-full text-xs font-extrabold uppercase shadow-xs ${
                    computedTier === 'A'
                      ? 'bg-[#117d78] text-white'
                      : computedTier === 'B'
                      ? 'bg-[#ff9900] text-white'
                      : 'bg-[#ce4915] text-white'
                  }`}
                >
                  Tier {computedTier}
                </span>
              </div>
            </div>

            {/* Optional Add Mentor into System */}
            <div className="pt-2 border-t border-[#e3e9e7]">
              <span className="text-xs font-semibold text-[#202b2a] block mb-2">
                Simpan Sebagai Mentor Baru ke Database:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Nama Mentor (contoh: Dr. Satria)"
                  value={newMentorName}
                  onChange={(e) => setNewMentorName(e.target.value)}
                  className="sm:col-span-2 text-xs bg-[#f7f8f7] border border-[#e3e9e7] rounded-xl px-3 py-2 outline-none focus:border-[#ce4915]"
                />
                <select
                  value={newMentorCity}
                  onChange={(e) => setNewMentorCity(e.target.value)}
                  className="text-xs bg-[#f7f8f7] border border-[#e3e9e7] rounded-xl px-2 py-2 outline-none focus:border-[#ce4915]"
                >
                  <option value="Jakarta">Jakarta</option>
                  <option value="Surabaya">Surabaya</option>
                  <option value="Bandung">Bandung</option>
                  <option value="Yogyakarta">Yogyakarta</option>
                  <option value="Malang">Malang</option>
                  <option value="Semarang">Semarang</option>
                  <option value="Bogor">Bogor</option>
                </select>
                <button
                  type="submit"
                  disabled={!newMentorName.trim()}
                  className="px-3 py-2 bg-[#ce4915] hover:bg-[#b83f10] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Tambah Mentor</span>
                </button>
              </div>
              {showAddSuccess && (
                <div className="mt-2 text-xs font-semibold text-[#117d78] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mentor berhasil ditambahkan dan siap dialokasikan!
                </div>
              )}
            </div>

            <p className="text-[11px] text-[#6c7a78] leading-normal pt-1">
              <strong>Catatan Validitas:</strong> Formula mengikuti bobot optimasi: <code className="bg-[#f7f8f7] px-1 py-0.5 rounded text-[#202b2a]">Q = 0,281·Peng + 0,340·Port + 0,379·IPM</code>. Uji ketahanan bobot ±20% menunjukkan peringkat stabil tanpa loncatan tier.
            </p>
          </form>
        </div>

        {/* Right Info: Pilot per Tier Table & Supply Bottleneck */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#e3e9e7] shadow-xs">
            <h3 className="text-base font-bold text-[#202b2a] mb-3">Distribusi Kuota Pilot per Tier</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#e3e9e7] text-[#6c7a78] font-semibold">
                    <th className="pb-2">Tier</th>
                    <th className="pb-2">Daftar Mentor Pilot</th>
                    <th className="pb-2 text-right">Kapasitas Kuota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f4]">
                  <tr>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e1f4f0] text-[#117d78]">
                        Tier A
                      </span>
                    </td>
                    <td className="py-2.5 font-mono text-[11px] text-[#202b2a]">
                      M-012, M-006, M-017, M-001, M-020, M-011, M-009, M-003, M-005
                    </td>
                    <td className="py-2.5 text-right font-bold text-[#117d78]">72 tim</td>
                  </tr>
                  <tr>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fff2dc] text-[#9b6200]">
                        Tier B
                      </span>
                    </td>
                    <td className="py-2.5 font-mono text-[11px] text-[#202b2a]">
                      M-014, M-002, M-015, M-018, M-008, M-010
                    </td>
                    <td className="py-2.5 text-right font-bold text-[#9b6200]">58 tim</td>
                  </tr>
                  <tr>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffebe4] text-[#ce4915]">
                        Tier C
                      </span>
                    </td>
                    <td className="py-2.5 font-mono text-[11px] text-[#202b2a]">
                      M-004, M-016, M-013, M-007, M-019
                    </td>
                    <td className="py-2.5 text-right font-bold text-[#ce4915]">69 tim</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Supply Bottleneck Alert Box from HTML */}
          <div className="bg-[#fff2dc] p-5 rounded-2xl border border-[#ff9900]/30 shadow-xs">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#ff9900] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#9b6200] uppercase tracking-wide">
                  Titik Rawan Pasokan Tier A IPS
                </h4>
                <p className="text-xs text-[#202b2a] mt-1 leading-relaxed">
                  Tier A IPS hanya M-017 (Yogyakarta) dan M-011 (Malang), sementara dua tim Prioritas IPS berada di Jakarta dan Surabaya. Keduanya hanya bisa saling menggantikan (kemiripan 0,922), sehingga cadangan wajib dikunci di muka!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mentor Directory & Search */}
      <div className="bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6c7a78]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, ID, spesialisasi, kota..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#f7f8f7] border border-[#e3e9e7] rounded-xl outline-none focus:border-[#ce4915]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Tier Filters */}
            <div className="flex items-center gap-1 bg-[#f7f8f7] p-1 rounded-xl border border-[#e3e9e7]">
              {['all', 'A', 'B', 'C'].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTierFilter(tier)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                    selectedTierFilter === tier
                      ? 'bg-[#ce4915] text-white'
                      : 'text-[#6c7a78] hover:text-[#202b2a]'
                  }`}
                >
                  {tier === 'all' ? 'Semua Tier' : `Tier ${tier}`}
                </button>
              ))}
            </div>

            {/* Field Filter */}
            <select
              value={selectedFieldFilter}
              onChange={(e) => setSelectedFieldFilter(e.target.value)}
              className="text-xs bg-[#f7f8f7] border border-[#e3e9e7] rounded-xl px-3 py-2 outline-none focus:border-[#ce4915] cursor-pointer"
            >
              <option value="all">Semua Rumpun</option>
              <option value="Saintek">Saintek</option>
              <option value="Soshum / IPS">Soshum / IPS</option>
              <option value="Lingkungan">Lingkungan</option>
              <option value="Robotika & IoT">Robotika &amp; IoT</option>
              <option value="Kesehatan">Kesehatan</option>
            </select>
          </div>
        </div>

        {/* Mentors Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMentors.map((m) => {
            const utilizationPercent = Math.round((m.assignedCount / m.maxQuota) * 100);
            const isHighUtilization = utilizationPercent >= 83;

            return (
              <div
                key={m.id}
                className="p-4 rounded-xl border border-[#e3e9e7] hover:border-[#ce4915]/40 transition-all bg-[#fbfcfb] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={m.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt={m.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-[#202b2a]">{m.name}</h4>
                        <div className="text-[11px] text-[#6c7a78] flex items-center gap-1.5">
                          <span className="font-mono text-[#ce4915] font-semibold">{m.id}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-[#6c7a78]" /> {m.city}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.tier === 'A'
                          ? 'bg-[#e1f4f0] text-[#117d78] border border-[#117d78]/20'
                          : m.tier === 'B'
                          ? 'bg-[#fff2dc] text-[#9b6200] border border-[#ff9900]/20'
                          : 'bg-[#ffebe4] text-[#ce4915] border border-[#ce4915]/20'
                      }`}
                    >
                      Tier {m.tier}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#6c7a78] line-clamp-2 mb-3">
                    {m.specialization}
                  </p>

                  <div className="grid grid-cols-3 gap-1.5 py-2 px-2.5 rounded-lg bg-[#f7f8f7] text-[10px] text-[#202b2a] mb-3">
                    <div>
                      <span className="text-[#6c7a78] block">Pengalaman</span>
                      <span className="font-bold">{m.experience} / 5</span>
                    </div>
                    <div>
                      <span className="text-[#6c7a78] block">Portofolio</span>
                      <span className="font-bold">{m.portfolio} / 5</span>
                    </div>
                    <div>
                      <span className="text-[#6c7a78] block">IPM</span>
                      <span className="font-bold">{m.ipm.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[#6c7a78]">Beban Utilisasi ({m.assignedCount}/{m.maxQuota} tim)</span>
                    <span className={`font-bold ${isHighUtilization ? 'text-[#ce4915]' : 'text-[#117d78]'}`}>
                      {utilizationPercent}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#e3e9e7] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isHighUtilization ? 'bg-[#ce4915]' : 'bg-[#117d78]'
                      }`}
                      style={{ width: `${Math.min(100, utilizationPercent)}%` }}
                    />
                  </div>

                  {m.isBurnoutRisk && (
                    <div className="mt-2 text-[10px] text-[#ce4915] font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Peringatan: Beban mendekati batas kritis (&ge; 83%)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
