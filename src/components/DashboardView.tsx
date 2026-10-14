import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  Coins, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight, 
  ChevronDown, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  MapPin,
  Laptop,
  Radio,
  FileCheck2
} from 'lucide-react';
import { SystemAlert, SystemActivity, ResearchTeam } from '../types/rawon';
import { NavigationTab } from './Sidebar';

interface DashboardViewProps {
  alerts: SystemAlert[];
  activities: SystemActivity[];
  recentAllocations: ResearchTeam[];
  onNavigate: (tab: NavigationTab) => void;
  onSolveOptimization: () => void;
  isSolving?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  alerts,
  activities,
  recentAllocations,
  onNavigate,
  onSolveOptimization,
  isSolving = false,
}) => {
  const [selectedSegmentFilter, setSelectedSegmentFilter] = useState<string>('Semua Segmen');
  const [showSegmentMenu, setShowSegmentMenu] = useState(false);

  return (
    <div className="space-y-6">
      {/* 5 Top Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
        {/* Card 1: Total Mentor Aktif */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#e3e9e7] shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-[#6c7a78]">Total Mentor Aktif</span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#e1f4f0] flex items-center justify-center text-[#117d78] shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold text-[#202b2a]">70</div>
            <div className="text-[10px] sm:text-[11px] text-[#117d78] font-medium flex items-center gap-1.5 mt-0.5 sm:mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#117d78]" />
              <span>100% aktif</span>
            </div>
          </div>
        </div>

        {/* Card 2: Tim Riset */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#e3e9e7] shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-[#6c7a78]">Tim Riset</span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#fff2dc] flex items-center justify-center text-[#ff9900] shrink-0">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold text-[#202b2a]">120</div>
            <div className="text-[10px] sm:text-[11px] text-[#ff9900] font-medium flex items-center gap-1.5 mt-0.5 sm:mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff9900]" />
              <span>35 sekolah</span>
            </div>
          </div>
        </div>

        {/* Card 3: Alokasi Berjalan */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#e3e9e7] shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-[#6c7a78]">Alokasi Berjalan</span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#e1f4f0] flex items-center justify-center text-[#07b3b3] shrink-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold text-[#202b2a]">98</div>
            <div className="text-[10px] sm:text-[11px] text-[#07b3b3] font-medium flex items-center gap-1.5 mt-0.5 sm:mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#07b3b3]" />
              <span>81,7% total</span>
            </div>
          </div>
        </div>

        {/* Card 4: Estimasi Efisiensi Biaya */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#e3e9e7] shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-[#6c7a78]">Efisiensi Biaya</span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#ffebe4] flex items-center justify-center text-[#ce4915] shrink-0">
              <Coins className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold text-[#202b2a]">Rp2,17 M</div>
            <div className="text-[10px] sm:text-[11px] text-[#ce4915] font-medium flex items-center gap-1.5 mt-0.5 sm:mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ce4915]" />
              <span>Hemat 52,7%</span>
            </div>
          </div>
        </div>

        {/* Card 5: Tingkat Kesesuaian */}
        <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl p-3.5 sm:p-5 border border-[#e3e9e7] shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-[#6c7a78]">Kesesuaian</span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#e1f4f0] flex items-center justify-center text-[#117d78] shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-bold text-[#202b2a]">92,4%</div>
            <div className="text-[10px] sm:text-[11px] text-[#117d78] font-medium flex items-center gap-1.5 mt-0.5 sm:mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#117d78]" />
              <span>Rerata kecocokan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Banner for MILP Re-optimization */}
      <div className="bg-gradient-to-r from-[#ce4915] via-[#ff9559] to-[#07b3b3] p-0.5 rounded-2xl shadow-sm">
        <div className="bg-white rounded-[15px] px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffebe4] flex items-center justify-center text-[#ce4915] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#202b2a]">
                Mesin Alokasi Cerdas RAWON (MCDM &amp; MILP Solver)
              </h3>
              <p className="text-xs text-[#6c7a78]">
                Mengatasi risiko over-servicing &amp; under-servicing dengan minimasi biaya logistik dan mitigasi lonjakan tarif real-time.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('board')}
              className="px-4 py-2 text-xs font-semibold text-[#ce4915] bg-[#ffebe4] hover:bg-[#ffdfd6] rounded-xl transition-colors cursor-pointer"
            >
              Buka Papan Alokasi
            </button>
            <button
              onClick={onSolveOptimization}
              disabled={isSolving}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#ce4915] hover:bg-[#b83f10] rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isSolving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Mengoptimalkan Solver...</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4" />
                  <span>Jalankan Auto-Solve MILP</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Middle Row: Ringkasan Alokasi (Left) & Tugas & Peringatan (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ringkasan Alokasi (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#e3e9e7] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-[#202b2a]">Ringkasan Alokasi</h3>
              <div className="relative">
                <button
                  onClick={() => setShowSegmentMenu(!showSegmentMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#e3e9e7] text-xs font-medium text-[#202b2a] hover:bg-[#f7f8f7] cursor-pointer"
                >
                  <span>{selectedSegmentFilter}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#6c7a78]" />
                </button>
                {showSegmentMenu && (
                  <div className="absolute right-0 mt-1 w-40 bg-white border border-[#e3e9e7] rounded-xl shadow-lg p-1.5 z-20">
                    {['Semua Segmen', 'Prioritas', 'Eksekutif', 'Reguler'].map((seg) => (
                      <button
                        key={seg}
                        onClick={() => {
                          setSelectedSegmentFilter(seg);
                          setShowSegmentMenu(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-[#202b2a] hover:bg-[#f7f8f7] rounded-lg cursor-pointer"
                      >
                        {seg}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Inner Content: Donut Chart + Legend + Mode Distribution */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              {/* Donut Chart visual */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f4" strokeWidth="16" />
                    {/* Prioritas: 55% = strokeDasharray="131 239" */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#07b3b3"
                      strokeWidth="16"
                      strokeDasharray="131.3 238.7"
                      strokeDashoffset="0"
                    />
                    {/* Eksekutif: 28% = strokeDasharray="66.8 238.7" */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#ff9900"
                      strokeWidth="16"
                      strokeDasharray="66.8 238.7"
                      strokeDashoffset="-131.3"
                    />
                    {/* Reguler: 17% = strokeDasharray="40.6 238.7" */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#ff9559"
                      strokeWidth="16"
                      strokeDasharray="40.6 238.7"
                      strokeDashoffset="-198.1"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-extrabold text-[#202b2a]">120</span>
                    <span className="text-[10px] text-[#6c7a78] font-medium">Tim Riset</span>
                  </div>
                </div>
              </div>

              {/* Cluster Breakdown & Mode Breakdown (8 cols) */}
              <div className="sm:col-span-8 space-y-4">
                {/* Segments Legend */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-3 border-b border-[#e3e9e7]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#07b3b3]" />
                      <span className="text-xs font-semibold text-[#202b2a]">Prioritas</span>
                    </div>
                    <div className="text-xs text-[#6c7a78] mt-0.5 pl-4.5">
                      <span className="font-bold text-[#202b2a]">66</span> tim (55%)
                    </div>
                    <div className="text-[10px] text-[#6c7a78] pl-4.5">SLA tertinggi</div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff9900]" />
                      <span className="text-xs font-semibold text-[#202b2a]">Eksekutif</span>
                    </div>
                    <div className="text-xs text-[#6c7a78] mt-0.5 pl-4.5">
                      <span className="font-bold text-[#202b2a]">34</span> tim (28%)
                    </div>
                    <div className="text-[10px] text-[#6c7a78] pl-4.5">SLA menengah</div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff9559]" />
                      <span className="text-xs font-semibold text-[#202b2a]">Reguler</span>
                    </div>
                    <div className="text-xs text-[#6c7a78] mt-0.5 pl-4.5">
                      <span className="font-bold text-[#202b2a]">20</span> tim (17%)
                    </div>
                    <div className="text-[10px] text-[#6c7a78] pl-4.5">SLA dasar</div>
                  </div>
                </div>

                {/* Mode Distribution */}
                <div>
                  <div className="text-xs font-bold text-[#202b2a] mb-2.5">
                    Distribusi Alokasi Mode
                  </div>
                  <div className="space-y-2">
                    {/* Tatap Muka */}
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#e1f4f0] text-[#117d78] flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="text-[#202b2a]">Tatap Muka</span>
                          <span className="text-[#117d78] font-bold">53% (64 tim)</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#e3e9e7] rounded-full overflow-hidden">
                          <div className="h-full bg-[#117d78] rounded-full" style={{ width: '53%' }} />
                        </div>
                      </div>
                    </div>

                    {/* Hybrid */}
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#fff2dc] text-[#ff9900] flex items-center justify-center shrink-0">
                        <Laptop className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="text-[#202b2a]">Hybrid</span>
                          <span className="text-[#ff9900] font-bold">32% (38 tim)</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#e3e9e7] rounded-full overflow-hidden">
                          <div className="h-full bg-[#ff9900] rounded-full" style={{ width: '32%' }} />
                        </div>
                      </div>
                    </div>

                    {/* Online */}
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#ffebe4] text-[#ce4915] flex items-center justify-center shrink-0">
                        <Radio className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="text-[#202b2a]">Online</span>
                          <span className="text-[#ce4915] font-bold">18 tim (15%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#e3e9e7] rounded-full overflow-hidden">
                          <div className="h-full bg-[#ce4915] rounded-full" style={{ width: '15%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Info Banner */}
          <div className="mt-5 p-3.5 rounded-xl bg-[#e1f4f0]/80 border border-[#117d78]/20 flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-[#117d78] shrink-0" />
            <p className="text-xs text-[#117d78] font-medium leading-relaxed">
              Sistem RAWON telah mengoptimalkan alokasi sesuai kecocokan keahlian, biaya perjalanan, kapasitas mentor, dan kebijakan SLA tiap segmen.
            </p>
          </div>
        </div>

        {/* Tugas & Peringatan (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#e3e9e7] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#202b2a]">Tugas &amp; Peringatan</h3>
              <button
                onClick={() => onNavigate('disruptions')}
                className="text-xs text-[#ce4915] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {alerts.slice(0, 4).map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => onNavigate('disruptions')}
                  className="p-3 rounded-xl border border-[#e3e9e7] hover:border-[#ce4915]/40 transition-all bg-[#f7f8f7]/50 hover:bg-[#f7f8f7] cursor-pointer"
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                      style={{ backgroundColor: alert.dotColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#202b2a]">{alert.title}</h4>
                        <span className="text-[10px] text-[#6c7a78]">{alert.timeAgo}</span>
                      </div>
                      <p className="text-xs text-[#6c7a78] mt-1 leading-snug">{alert.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#e3e9e7]">
            <div className="text-[11px] text-[#6c7a78] flex items-center justify-between">
              <span>SOP Otomatis: Batas Utilisasi &le; 83%</span>
              <span className="font-semibold text-[#117d78]">Aktif</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Alokasi Terbaru (Left 8 cols) & Aktivitas Sistem (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Alokasi Terbaru Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#e3e9e7] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#202b2a]">Alokasi Terbaru</h3>
            <button
              onClick={() => onNavigate('board')}
              className="text-xs text-[#ce4915] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e3e9e7] text-[#6c7a78] font-semibold">
                  <th className="pb-3 pr-4">Tim Riset</th>
                  <th className="pb-3 px-4">Sekolah</th>
                  <th className="pb-3 px-4">Mentor Utama</th>
                  <th className="pb-3 px-4">Mode</th>
                  <th className="pb-3 px-4">Segmen</th>
                  <th className="pb-3 pl-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f4]">
                {recentAllocations.slice(0, 5).map((team) => {
                  return (
                    <tr key={team.id} className="hover:bg-[#f7f8f7]/70 transition-colors">
                      <td className="py-3.5 pr-4 font-semibold text-[#202b2a]">
                        {team.name}
                      </td>
                      <td className="py-3.5 px-4 text-[#6c7a78]">
                        {team.school}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <img
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                            alt="Mentor"
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="font-medium text-[#202b2a]">
                            {team.id === 'T-001'
                              ? 'Dr. Maya Lestari'
                              : team.id === 'T-002'
                              ? 'Dr. Raka Pratama'
                              : team.id === 'T-006'
                              ? 'Dr. Andi Wijaya'
                              : team.id === 'T-004'
                              ? 'Dr. Putri Hakim'
                              : 'Dr. Budi Santoso'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                            team.mode === 'Tatap Muka'
                              ? 'bg-[#e1f4f0] text-[#117d78] border border-[#117d78]/20'
                              : team.mode === 'Hybrid'
                              ? 'bg-[#fff2dc] text-[#ff9900] border border-[#ff9900]/20'
                              : 'bg-[#ffebe4] text-[#ce4915] border border-[#ce4915]/20'
                          }`}
                        >
                          {team.mode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                            team.cluster === 'prioritas'
                              ? 'bg-[#e1f4f0] text-[#07b3b3]'
                              : team.cluster.includes('eksekutif')
                              ? 'bg-[#fff2dc] text-[#ff9900]'
                              : 'bg-[#ffebe4] text-[#ce4915]'
                          }`}
                        >
                          {team.cluster === 'prioritas'
                            ? 'Prioritas'
                            : team.cluster.includes('eksekutif')
                            ? 'Eksekutif'
                            : 'Reguler'}
                        </span>
                      </td>
                      <td className="py-3.5 pl-4 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#117d78]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#117d78]" />
                          Aktif
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Aktivitas Sistem Timeline */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#e3e9e7] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#202b2a]">Aktivitas Sistem</h3>
            <button
              onClick={() => onNavigate('settings')}
              className="text-xs text-[#ce4915] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#e3e9e7]">
            {activities.map((act) => (
              <div key={act.id} className="relative">
                {/* Dot */}
                <div
                  className="absolute -left-[27px] top-1 w-3 h-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: act.dotColor }}
                />
                <div>
                  <div className="text-[11px] font-bold text-[#6c7a78]">{act.time}</div>
                  <p className="text-xs text-[#202b2a] font-medium mt-0.5 leading-snug">{act.title}</p>
                  <p className="text-[10px] text-[#6c7a78] mt-0.5">{act.actor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
