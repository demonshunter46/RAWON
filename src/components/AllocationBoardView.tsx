import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Filter, 
  Search, 
  MapPin, 
  Building2, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { ResearchTeam, Mentor, Mode, Tier } from '../types/rawon';

interface AllocationBoardViewProps {
  teams: ResearchTeam[];
  mentors: Mentor[];
  onUpdateTeam: (teamId: string, updates: Partial<ResearchTeam>) => void;
  onRunAutoSolve: () => void;
  onResetBoard: () => void;
  isSolving?: boolean;
}

export const AllocationBoardView: React.FC<AllocationBoardViewProps> = ({
  teams,
  mentors,
  onUpdateTeam,
  onRunAutoSolve,
  onResetBoard,
  isSolving = false,
}) => {
  const [selectedClusterFilter, setSelectedClusterFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewScope, setViewScope] = useState<'pilot20' | 'all120'>('pilot20');

  // Filter teams based on scope, search, and cluster
  const displayedTeams = teams.filter((t) => {
    if (viewScope === 'pilot20' && parseInt(t.id.replace('T-', '')) > 20) {
      return false;
    }
    if (selectedClusterFilter !== 'all' && t.cluster !== selectedClusterFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.school.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.field.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate stats
  let completeCount = 0;
  let sameErrorCount = 0;
  let usedTierACount = 0;

  teams.forEach((t) => {
    if (t.primaryMentorId && t.backupMentorId) {
      if (t.primaryMentorId === t.backupMentorId) {
        sameErrorCount++;
      } else {
        completeCount++;
        const pMentor = mentors.find((m) => m.id === t.primaryMentorId);
        if (pMentor?.tier === 'A') {
          usedTierACount++;
        }
      }
    }
  });

  // Helper for available primary mentors per cluster
  const getAvailablePrimaryMentors = (cluster: string): Mentor[] => {
    if (cluster === 'prioritas') {
      return mentors.filter((m) => m.tier === 'A');
    }
    if (cluster === 'eksekutif_finalis') {
      return mentors.filter((m) => m.tier === 'A' || m.tier === 'B');
    }
    if (cluster === 'eksekutif_kti') {
      // Tier A STRICTLY PROHIBITED
      return mentors.filter((m) => m.tier === 'B');
    }
    // Reguler: Tier A STRICTLY PROHIBITED
    return mentors.filter((m) => m.tier === 'B' || m.tier === 'C');
  };

  // Helper for available backup mentors
  const getAvailableBackupMentors = (cluster: string, primaryId?: string): Mentor[] => {
    let allowed: Mentor[] = [];
    if (cluster === 'prioritas') {
      allowed = mentors.filter((m) => m.tier === 'A');
    } else if (cluster === 'eksekutif_finalis' || cluster === 'eksekutif_kti') {
      allowed = mentors.filter((m) => m.tier === 'A' || m.tier === 'B');
    } else {
      allowed = mentors.filter((m) => m.tier === 'B' || m.tier === 'C');
    }
    return allowed.filter((m) => m.id !== primaryId);
  };

  const handleExportCSV = () => {
    const headers = ['ID Tim', 'Nama Tim', 'Sekolah', 'Kota', 'Klaster', 'Rumpun', 'Mentor Utama', 'Tier Utama', 'Mentor Cadangan', 'Mode', 'Status'];
    const rows = displayedTeams.map((t) => {
      const pm = mentors.find((m) => m.id === t.primaryMentorId);
      const bm = mentors.find((m) => m.id === t.backupMentorId);
      return [
        t.id,
        `"${t.name}"`,
        `"${t.school}"`,
        t.city,
        t.clusterName,
        t.field,
        pm ? `"${pm.name} (${pm.id})"` : 'Belum Ditugaskan',
        pm ? pm.tier : '-',
        bm ? `"${bm.name} (${bm.id})"` : 'Belum Ditugaskan',
        t.mode,
        t.status
      ].join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_alokasi_rawon_${viewScope}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-[#e3e9e7] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#202b2a] flex items-center gap-2">
            Papan Alokasi Mentor
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ffebe4] text-[#ce4915] font-semibold border border-[#ce4915]/20">
              {viewScope === 'pilot20' ? 'Prototipe Pilot 20 Tim' : 'Skala Penuh 120 Tim'}
            </span>
          </h2>
          <p className="text-xs text-[#6c7a78] mt-1 max-w-2xl leading-relaxed">
            Pilih mentor utama, cadangan, dan mode bimbingan. Sistem secara otomatis membatasi pilihan sesuai lantai dan plafon tier klaster guna mencegah over-servicing dan under-servicing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Scope toggle */}
          <div className="bg-[#f7f8f7] p-1 rounded-xl border border-[#e3e9e7] flex items-center">
            <button
              onClick={() => setViewScope('pilot20')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewScope === 'pilot20'
                  ? 'bg-white text-[#ce4915] shadow-xs'
                  : 'text-[#6c7a78] hover:text-[#202b2a]'
              }`}
            >
              Pilot 20 Tim
            </button>
            <button
              onClick={() => setViewScope('all120')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewScope === 'all120'
                  ? 'bg-white text-[#ce4915] shadow-xs'
                  : 'text-[#6c7a78] hover:text-[#202b2a]'
              }`}
            >
              Semua 120 Tim
            </button>
          </div>

          <button
            onClick={onResetBoard}
            className="px-3 py-2 text-xs font-semibold text-[#6c7a78] bg-white hover:bg-[#f7f8f7] border border-[#e3e9e7] rounded-xl flex items-center gap-1.5 cursor-pointer"
            title="Kosongkan alokasi pada papan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Kosongkan</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold text-[#117d78] bg-[#e1f4f0] hover:bg-[#d0ece6] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={onRunAutoSolve}
            disabled={isSolving}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#ce4915] hover:bg-[#b83f10] rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-60"
          >
            {isSolving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memproses MILP...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Jalankan Auto-Solve MILP</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Status Callout */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          sameErrorCount > 0
            ? 'bg-[#ffebe4] border-[#ce4915]/40 text-[#ce4915]'
            : completeCount === displayedTeams.length
            ? 'bg-[#e1f4f0] border-[#117d78]/40 text-[#117d78]'
            : 'bg-[#fff2dc] border-[#ff9900]/40 text-[#9b6200]'
        }`}
      >
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 font-medium">
            {sameErrorCount > 0 ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-[#ce4915]" />
            ) : completeCount === displayedTeams.length ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#117d78]" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#ff9900]" />
            )}
            <span>
              Lengkap:{' '}
              <strong className="text-sm font-bold">
                {completeCount} / {displayedTeams.length}
              </strong>{' '}
              tim. Mentor Tier A terpakai pada tim lengkap:{' '}
              <strong className="text-sm font-bold">{usedTierACount}</strong> tim.
            </span>
          </div>

          {sameErrorCount > 0 && (
            <div className="font-semibold text-xs text-[#ce4915] bg-white/80 px-2.5 py-1 rounded-lg">
              Perhatian: Ada {sameErrorCount} tim dengan cadangan sama dengan mentor utama!
            </div>
          )}
        </div>
      </div>

      {/* Special Bottleneck Callout Banner from HTML */}
      <div className="bg-gradient-to-r from-[#ffebe4] to-[#fff2dc] p-4 rounded-2xl border border-[#ce4915]/30 text-xs text-[#202b2a] flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-[#ce4915] shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-[#ce4915]">
            Titik Rawan Pasokan Tier A IPS Teridentifikasi:
          </strong>{' '}
          Tier A IPS hanya memiliki 2 mentor nasional, yaitu <strong>M-017 (Yogyakarta)</strong> dan{' '}
          <strong>M-011 (Malang)</strong>. Sementara itu, terdapat 2 tim Prioritas IPS di Jakarta dan Surabaya.
          Keduanya hanya bisa saling menggantikan (kemiripan 0,922), sehingga perjalanan antarkota tidak terhindarkan dan cadangan harus ditetapkan di muka!
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e3e9e7] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6c7a78]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tim, sekolah, atau rumpun..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#f7f8f7] border border-[#e3e9e7] rounded-xl outline-none focus:border-[#ce4915]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-[#6c7a78] font-medium shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Klaster:
          </span>
          {[
            { id: 'all', label: 'Semua' },
            { id: 'prioritas', label: 'Prioritas' },
            { id: 'eksekutif_finalis', label: 'Eksekutif (Finalis)' },
            { id: 'eksekutif_kti', label: 'Eksekutif (KTI)' },
            { id: 'reguler', label: 'Reguler' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClusterFilter(c.id)}
              className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                selectedClusterFilter === c.id
                  ? 'bg-[#ce4915] text-white font-semibold shadow-xs'
                  : 'bg-[#f7f8f7] text-[#6c7a78] hover:bg-[#e3e9e7]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-[#e3e9e7] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f7f8f7] text-[#60716e] border-b border-[#e3e9e7] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Tim &amp; Sekolah</th>
                <th className="py-3 px-3">Klaster</th>
                <th className="py-3 px-3">Rumpun</th>
                <th className="py-3 px-3">Tier Boleh</th>
                <th className="py-3 px-3 min-w-[190px]">Mentor Utama</th>
                <th className="py-3 px-3 min-w-[190px]">Cadangan</th>
                <th className="py-3 px-3 min-w-[130px]">Mode</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e9e7]">
              {displayedTeams.map((team) => {
                const primaryOptions = getAvailablePrimaryMentors(team.cluster);
                const backupOptions = getAvailableBackupMentors(team.cluster, team.primaryMentorId);

                // Validation
                const isConflictSame = team.primaryMentorId && team.backupMentorId && team.primaryMentorId === team.backupMentorId;
                const isComplete = team.primaryMentorId && team.backupMentorId && !isConflictSame;
                const isPartial = team.primaryMentorId && !team.backupMentorId;

                const primaryMentor = mentors.find((m) => m.id === team.primaryMentorId);
                const backupMentor = mentors.find((m) => m.id === team.backupMentorId);

                return (
                  <tr key={team.id} className="hover:bg-[#fbfcfb] transition-colors">
                    {/* Tim & Sekolah */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#202b2a]">{team.name}</div>
                      <div className="text-[11px] text-[#6c7a78] flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-[#ce4915] font-semibold">{team.id}</span>
                        <span>•</span>
                        <span>{team.school} ({team.city})</span>
                      </div>
                    </td>

                    {/* Klaster */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          team.cluster === 'prioritas'
                            ? 'bg-[#e1f4f0] text-[#07b3b3] border border-[#07b3b3]/20'
                            : team.cluster.includes('eksekutif')
                            ? 'bg-[#fff2dc] text-[#ff9900] border border-[#ff9900]/20'
                            : 'bg-[#ffebe4] text-[#ce4915] border border-[#ce4915]/20'
                        }`}
                      >
                        {team.cluster === 'prioritas'
                          ? 'Prioritas'
                          : team.cluster === 'eksekutif_finalis'
                          ? 'Eks (Finalis)'
                          : team.cluster === 'eksekutif_kti'
                          ? 'Eks (KTI)'
                          : 'Reguler'}
                      </span>
                    </td>

                    {/* Rumpun */}
                    <td className="py-3.5 px-3 font-medium text-[#202b2a]">
                      {team.field}
                    </td>

                    {/* Tier Boleh */}
                    <td className="py-3.5 px-3">
                      <span className="font-mono text-xs font-semibold text-[#202b2a] bg-[#f7f8f7] px-2 py-0.5 rounded border border-[#e3e9e7]">
                        {team.cluster === 'prioritas'
                          ? 'A'
                          : team.cluster === 'eksekutif_finalis'
                          ? 'B–A'
                          : team.cluster === 'eksekutif_kti'
                          ? 'B'
                          : 'C–B'}
                      </span>
                    </td>

                    {/* Mentor Utama Select */}
                    <td className="py-3.5 px-3">
                      <select
                        value={team.primaryMentorId || ''}
                        onChange={(e) =>
                          onUpdateTeam(team.id, { primaryMentorId: e.target.value || undefined })
                        }
                        className="w-full text-xs bg-[#fbfcfb] text-[#202b2a] border border-[#dce5e2] rounded-xl px-2.5 py-1.5 outline-none focus:border-[#ce4915]"
                      >
                        <option value="">Pilih Mentor...</option>
                        {primaryOptions.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.id} ({m.tier}) – {m.name.split(',')[0]} [{m.city}]
                          </option>
                        ))}
                      </select>
                      {primaryMentor && (
                        <div className="text-[10px] text-[#6c7a78] mt-1 flex items-center justify-between">
                          <span>{primaryMentor.city}</span>
                          <span className="text-[#117d78] font-medium">MQI: {primaryMentor.mqiScore.toFixed(3)}</span>
                        </div>
                      )}
                    </td>

                    {/* Mentor Cadangan Select */}
                    <td className="py-3.5 px-3">
                      <select
                        value={team.backupMentorId || ''}
                        onChange={(e) =>
                          onUpdateTeam(team.id, { backupMentorId: e.target.value || undefined })
                        }
                        className={`w-full text-xs bg-[#fbfcfb] text-[#202b2a] border rounded-xl px-2.5 py-1.5 outline-none ${
                          isConflictSame
                            ? 'border-[#ce4915] text-[#ce4915] bg-[#ffebe4]/40 font-bold'
                            : 'border-[#dce5e2] focus:border-[#ce4915]'
                        }`}
                      >
                        <option value="">Pilih Cadangan...</option>
                        {backupOptions.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.id} ({m.tier}) – {m.name.split(',')[0]} [{m.city}]
                          </option>
                        ))}
                      </select>
                      {backupMentor && (
                        <div className="text-[10px] text-[#6c7a78] mt-1 flex items-center justify-between">
                          <span>{backupMentor.city}</span>
                          <span className="text-[#117d78] font-medium">MQI: {backupMentor.mqiScore.toFixed(3)}</span>
                        </div>
                      )}
                    </td>

                    {/* Mode Select */}
                    <td className="py-3.5 px-3">
                      {team.cluster === 'prioritas' ? (
                        <div className="text-xs font-semibold text-[#117d78] bg-[#e1f4f0] px-2.5 py-1.5 rounded-xl border border-[#117d78]/20 text-center">
                          Tatap Muka
                        </div>
                      ) : (
                        <select
                          value={team.mode}
                          onChange={(e) =>
                            onUpdateTeam(team.id, { mode: e.target.value as Mode })
                          }
                          className="w-full text-xs bg-[#fbfcfb] text-[#202b2a] border border-[#dce5e2] rounded-xl px-2.5 py-1.5 outline-none focus:border-[#ce4915]"
                        >
                          <option value="Tatap Muka">Tatap Muka</option>
                          <option value="Hybrid">Hybrid</option>
                          {team.cluster === 'reguler' && <option value="Online">Online</option>}
                        </select>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      {isConflictSame ? (
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#ffebe4] text-[#ce4915] border border-[#ce4915]/30">
                          Cadangan Sama
                        </span>
                      ) : isComplete ? (
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#e1f4f0] text-[#117d78] border border-[#117d78]/30">
                          Lengkap
                        </span>
                      ) : isPartial ? (
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#fff2dc] text-[#9b6200]">
                          Pilih Cadangan
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#f7f8f7] text-[#6c7a78]">
                          Kosong
                        </span>
                      )}
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
