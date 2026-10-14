import React, { useState } from 'react';
import { 
  GraduationCap, 
  School, 
  MapPin, 
  DollarSign, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Search, 
  Filter,
  ArrowRight
} from 'lucide-react';
import { ResearchTeam, Mentor } from '../types/rawon';

interface TeamsViewProps {
  teams: ResearchTeam[];
  mentors: Mentor[];
}

export const TeamsView: React.FC<TeamsViewProps> = ({ teams, mentors }) => {
  // Cluster Selector State
  const [selectedClusterIndex, setSelectedClusterIndex] = useState<number>(0);

  // Travel Budget Stress Test States
  const [slaBudget, setSlaBudget] = useState<number>(300000);
  const [baseCost, setBaseCost] = useState<number>(200000);
  const [worstSurgePct, setWorstSurgePct] = useState<number>(40);

  // Teams search
  const [searchQuery, setSearchQuery] = useState<string>('');

  const clusterRules = [
    {
      name: 'Prioritas – Medali Nasional',
      floor: 'A',
      ceiling: 'A',
      costLimit: 'Tidak terbatas',
      initialMode: 'Tatap muka',
      note: 'Target medali emas/perak OSN & ISEF. Wajib mentor Tier A dengan rumpun yang sama persis.',
    },
    {
      name: 'Eksekutif – Finalis Nasional',
      floor: 'B',
      ceiling: 'A',
      costLimit: '≤ Rp300.000',
      initialMode: 'Tatap muka',
      note: 'Boleh Tier B atau A; Tier A dipakai bila diperlukan, dengan penalti kelangkaan.',
    },
    {
      name: 'Eksekutif – Karya Tulis Ilmiah',
      floor: 'B',
      ceiling: 'B',
      costLimit: '≤ Rp300.000',
      initialMode: 'Tatap muka / Hybrid',
      note: 'Wajib Tier B. Tier A DILARANG agar mentor langka tidak terbuang (pencegahan over-servicing).',
    },
    {
      name: 'Reguler – Pengalaman Riset Dasar',
      floor: 'C',
      ceiling: 'B',
      costLimit: '≤ Rp50.000',
      initialMode: 'Hybrid, tatap muka pada tonggak',
      note: 'Tier C diprioritaskan; Tier A dilarang. Mode default online/hybrid untuk efisiensi biaya.',
    },
  ];

  // Stress test calculation
  const formatIDR = (val: number) => `Rp${Math.round(val).toLocaleString('id-ID')}`;
  const worstCost = baseCost * (1 + worstSurgePct / 100);
  const isPrioritasUnlimited = slaBudget === 0;
  const isSafe = isPrioritasUnlimited || worstCost <= slaBudget;
  const maxAllowableBase = slaBudget > 0 ? slaBudget / (1 + worstSurgePct / 100) : 0;

  const filteredTeams = teams.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.school.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      t.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#202b2a] flex items-center gap-2">
            Kebijakan Klaster Tim &amp; Uji Ketahanan Biaya
          </h2>
          <p className="text-xs text-[#6c7a78] mt-1 max-w-2xl leading-relaxed">
            Menentukan batasan operasional (floor &amp; ceiling tier) untuk mengeliminasi inefisiensi over-servicing dan under-servicing, serta menguji ketahanan SLA terhadap fluktuasi biaya logistik.
          </p>
        </div>
        <div className="px-3.5 py-2 rounded-xl bg-[#f7f8f7] border border-[#e3e9e7] text-xs font-semibold text-[#202b2a]">
          Total {teams.length} Tim Binaan (35 Sekolah)
        </div>
      </div>

      {/* Grid: 2 Interactive Calculators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cek Kebutuhan Klaster Tim */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#e3e9e7]">
              <Layers className="w-5 h-5 text-[#ce4915]" />
              <h3 className="text-base font-bold text-[#202b2a]">Cek Kebutuhan Klaster Tim</h3>
            </div>

            <label className="block text-xs font-semibold text-[#202b2a] mb-2">
              Pilih Klaster Tim Bimbingan:
            </label>
            <select
              value={selectedClusterIndex}
              onChange={(e) => setSelectedClusterIndex(parseInt(e.target.value))}
              className="w-full text-xs bg-[#fbfcfb] text-[#202b2a] border border-[#dce5e2] rounded-xl p-2.5 outline-none focus:border-[#ce4915]"
            >
              {clusterRules.map((c, idx) => (
                <option key={idx} value={idx}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="mt-4 p-4 rounded-xl bg-[#f7f8f7] border border-[#e3e9e7] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6c7a78]">Lantai Tier:</span>
                <span className="font-mono font-bold text-[#117d78] bg-[#e1f4f0] px-2 py-0.5 rounded">
                  Tier {clusterRules[selectedClusterIndex].floor}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6c7a78]">Plafon Tier:</span>
                <span className="font-mono font-bold text-[#ce4915] bg-[#ffebe4] px-2 py-0.5 rounded">
                  Tier {clusterRules[selectedClusterIndex].ceiling}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6c7a78]">Batas Biaya per Kunjungan:</span>
                <span className="font-bold text-[#202b2a]">
                  {clusterRules[selectedClusterIndex].costLimit}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6c7a78]">Mode Bimbingan Awal:</span>
                <span className="font-bold text-[#202b2a]">
                  {clusterRules[selectedClusterIndex].initialMode}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-[#6c7a78] bg-[#fff2dc] p-3 rounded-xl border border-[#ff9900]/20 leading-relaxed">
            <strong>Penjelasan Aturan:</strong> {clusterRules[selectedClusterIndex].note}
          </p>
        </div>

        {/* Right: Uji Batas Biaya Perjalanan (Tahan Lonjakan Tarif) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#e3e9e7]">
              <DollarSign className="w-5 h-5 text-[#117d78]" />
              <h3 className="text-base font-bold text-[#202b2a]">
                Uji Batas Biaya Perjalanan (Ketahanan Guncangan Tarif)
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#202b2a] mb-1">
                  Pilih Batas SLA Klaster:
                </label>
                <select
                  value={slaBudget}
                  onChange={(e) => setSlaBudget(parseInt(e.target.value))}
                  className="w-full text-xs bg-[#fbfcfb] text-[#202b2a] border border-[#dce5e2] rounded-xl p-2 outline-none focus:border-[#ce4915]"
                >
                  <option value={300000}>Eksekutif (SLA Rp300.000 / kunjungan)</option>
                  <option value={50000}>Reguler (SLA Rp50.000 / kunjungan)</option>
                  <option value={0}>Prioritas (Tanpa batas biaya perjalanan)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#202b2a] mb-1">
                    Biaya Dasar (Rp):
                  </label>
                  <input
                    type="number"
                    step={10000}
                    value={baseCost}
                    onChange={(e) => setBaseCost(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-xs bg-[#fbfcfb] text-[#202b2a] border border-[#dce5e2] rounded-xl p-2 outline-none focus:border-[#ce4915]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#202b2a] mb-1">
                    Kenaikan Terburuk (%):
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={worstSurgePct}
                    onChange={(e) => setWorstSurgePct(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-xs bg-[#fbfcfb] text-[#202b2a] border border-[#dce5e2] rounded-xl p-2 outline-none focus:border-[#ce4915]"
                  />
                </div>
              </div>
            </div>

            {/* Test Outcome Box */}
            <div
              className={`mt-4 p-4 rounded-xl border ${
                isPrioritasUnlimited
                  ? 'bg-[#e1f4f0] border-[#117d78]/30 text-[#117d78]'
                  : isSafe
                  ? 'bg-[#e1f4f0] border-[#117d78]/30 text-[#117d78]'
                  : 'bg-[#ffebe4] border-[#ce4915]/30 text-[#ce4915]'
              }`}
            >
              {isPrioritasUnlimited ? (
                <div>
                  <div className="font-bold text-sm">Tanpa Batas Biaya: Tim Prioritas</div>
                  <div className="text-xs mt-0.5 opacity-90">
                    Tim Medali Nasional selalu mendapatkan alokasi tatap muka mentor Tier A, berapapun lonjakan tarifnya.
                  </div>
                </div>
              ) : isSafe ? (
                <div>
                  <div className="font-bold text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Biaya Terburuk: {formatIDR(worstCost)} Masih di Bawah SLA
                  </div>
                  <div className="text-xs mt-0.5 opacity-90">
                    Sistem mengonfirmasi: <strong>Tatap muka aman</strong>. Fluktuasi tarif 40% terserap oleh batas anggaran.
                  </div>
                </div>
              ) : (
                <div>
                  <div className="font-bold text-sm flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Biaya Terburuk: {formatIDR(worstCost)} Melampaui Batas SLA ({formatIDR(slaBudget)})
                  </div>
                  <div className="text-xs mt-0.5 opacity-90">
                    <strong>Peringatan Rapuh:</strong> Gunakan mode Hybrid! Biaya dasar maksimal yang aman untuk tatap muka adalah {formatIDR(maxAllowableBase)}.
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="mt-4 text-[11px] text-[#6c7a78]">
            Rumus: <code className="bg-[#f7f8f7] px-1 py-0.5 rounded text-[#202b2a]">w = c · (1 + d) &le; B</code>. Bila w &gt; B, sistem otomatis merekomendasikan mode hybrid.
          </p>
        </div>
      </div>

      {/* Teams Table */}
      <div className="bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <h3 className="text-base font-bold text-[#202b2a]">Daftar Tim Riset Binaan</h3>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6c7a78]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari tim, sekolah, kota..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#f7f8f7] border border-[#e3e9e7] rounded-xl outline-none focus:border-[#ce4915]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f7f8f7] text-[#60716e] border-b border-[#e3e9e7] font-semibold">
                <th className="py-3 px-4">ID &amp; Nama Tim</th>
                <th className="py-3 px-4">Sekolah Mitra</th>
                <th className="py-3 px-4">Kota</th>
                <th className="py-3 px-4">Rumpun</th>
                <th className="py-3 px-4">Klaster Target</th>
                <th className="py-3 px-4">Mentor Utama</th>
                <th className="py-3 px-4">Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e9e7]">
              {filteredTeams.map((team) => {
                const mentor = mentors.find((m) => m.id === team.primaryMentorId);
                return (
                  <tr key={team.id} className="hover:bg-[#fbfcfb]">
                    <td className="py-3.5 px-4 font-bold text-[#202b2a]">
                      <span className="font-mono text-[#ce4915] mr-1.5">{team.id}</span>
                      {team.name}
                    </td>
                    <td className="py-3.5 px-4 text-[#6c7a78]">{team.school}</td>
                    <td className="py-3.5 px-4 text-[#202b2a]">{team.city}</td>
                    <td className="py-3.5 px-4 font-medium text-[#202b2a]">{team.field}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          team.cluster === 'prioritas'
                            ? 'bg-[#e1f4f0] text-[#07b3b3]'
                            : team.cluster.includes('eksekutif')
                            ? 'bg-[#fff2dc] text-[#ff9900]'
                            : 'bg-[#ffebe4] text-[#ce4915]'
                        }`}
                      >
                        {team.clusterName.split('–')[0]}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {mentor ? (
                        <span className="text-[#202b2a] font-medium">
                          {mentor.name.split(',')[0]} ({mentor.tier})
                        </span>
                      ) : (
                        <span className="text-[#6c7a78] italic">Belum dialokasikan</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#f7f8f7] border border-[#e3e9e7]">
                        {team.mode}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
