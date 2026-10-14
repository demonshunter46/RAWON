import React, { useState } from 'react';
import { 
  FileText, 
  TrendingDown, 
  ShieldCheck, 
  AlertOctagon, 
  Coins, 
  MapPin, 
  BarChart3, 
  Layers, 
  Download,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { CITY_COST_MATRIX } from '../data/rawonData';

export const ReportsView: React.FC = () => {
  const [selectedOriginCity, setSelectedOriginCity] = useState<string>('Jakarta');

  const cities = ['Jakarta', 'Surabaya', 'Bandung', 'Yogyakarta', 'Malang', 'Semarang', 'Bogor'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#202b2a] flex items-center gap-2">
            Laporan Analisis Efisiensi &amp; Dampak Bisnis
          </h2>
          <p className="text-xs text-[#6c7a78] mt-1 max-w-2xl leading-relaxed">
            Perbandingan komprehensif antara operasional manual (As-Is) dan optimasi algoritma RAWON (To-Be) dalam menekan biaya logistik dan menjaga brand equity EduTech X.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-[#f7f8f7] hover:bg-[#e3e9e7] border border-[#e3e9e7] text-xs font-semibold text-[#202b2a] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Cetak Ringkasan Eksekutif</span>
          </button>
        </div>
      </div>

      {/* 3 Main Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Efisiensi Biaya */}
        <div className="bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ce4915]">
                Penghematan Logistik
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#ffebe4] flex items-center justify-center text-[#ce4915]">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#202b2a]">Rp2,17 M</div>
            <div className="text-xs font-semibold text-[#ce4915] mt-1 flex items-center gap-1">
              <TrendingDown className="w-4 h-4" /> Efisiensi 52,7% vs Baseline Manual
            </div>
            <p className="text-xs text-[#6c7a78] mt-3 leading-relaxed">
              Biaya perjalanan terpangkas dari estimasi manual Rp4,12 Miliar menjadi Rp1,95 Miliar melalui optimalisasi rute dan kuota kota lokal.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#e3e9e7] text-[11px] text-[#6c7a78] flex justify-between">
            <span>Baseline: Rp4,12 M</span>
            <span className="font-bold text-[#117d78]">To-Be: Rp1,95 M</span>
          </div>
        </div>

        {/* Card 2: Eliminasi Over-servicing */}
        <div className="bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#117d78]">
                Alokasi Top-Tier Tepat
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#e1f4f0] flex items-center justify-center text-[#117d78]">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#202b2a]">0 Kasus</div>
            <div className="text-xs font-semibold text-[#117d78] mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> 100% Bebas Over-servicing
            </div>
            <p className="text-xs text-[#6c7a78] mt-3 leading-relaxed">
              Penerapan plafon tier mencegah terbuangnya mentor langka Tier A pada segmen riset dasar yang semestinya ditangani Tier C &amp; B.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#e3e9e7] text-[11px] text-[#6c7a78] flex justify-between">
            <span>Manual: 38% Miskonfigurasi</span>
            <span className="font-bold text-[#117d78]">RAWON: 0%</span>
          </div>
        </div>

        {/* Card 3: Pencegahan Under-servicing & Burnout */}
        <div className="bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ff9900]">
                Linearitas &amp; Retensi
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#fff2dc] flex items-center justify-center text-[#ff9900]">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#202b2a]">92,4%</div>
            <div className="text-xs font-semibold text-[#ff9900] mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Linearitas Keilmuan Terverifikasi
            </div>
            <p className="text-xs text-[#6c7a78] mt-3 leading-relaxed">
              Tingkat pembatalan jadwal mendadak akibat mentor burnout ditekan dari 15% menjadi 1,8% dengan batas kapasitas kuota 83%.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#e3e9e7] text-[11px] text-[#6c7a78] flex justify-between">
            <span>Pembatalan As-Is: 15%</span>
            <span className="font-bold text-[#117d78]">Tingkat Batal: 1,8%</span>
          </div>
        </div>
      </div>

      {/* Comparison Table: As-Is vs To-Be */}
      <div className="bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs">
        <h3 className="text-base font-bold text-[#202b2a] mb-4">
          Matriks Perbandingan: Proses Manual (As-Is) vs Sistem RAWON (To-Be)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#f7f8f7] text-[#60716e] border-b border-[#e3e9e7] font-semibold">
                <th className="py-3 px-4">Indikator Kinerja Utama</th>
                <th className="py-3 px-4 text-[#ce4915]">Proses Manual (As-Is)</th>
                <th className="py-3 px-4 text-[#117d78]">Sistem Cerdas RAWON (To-Be)</th>
                <th className="py-3 px-4">Metode Penyelesaian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e9e7]">
              <tr>
                <td className="py-3.5 px-4 font-bold text-[#202b2a]">
                  Alokasi Mentor Tier A (Over-servicing)
                </td>
                <td className="py-3.5 px-4 text-[#ce4915] font-semibold">
                  38% Mentor Tier A tertugaskan pada riset dasar/reguler
                </td>
                <td className="py-3.5 px-4 text-[#117d78] font-bold">
                  0% (100% terkunci pada Tim Prioritas Medali)
                </td>
                <td className="py-3.5 px-4 text-[#6c7a78]">
                  Enforcement Plafon &amp; Lantai Tier Klaster
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-[#202b2a]">
                  Linearitas Keilmuan (Under-servicing)
                </td>
                <td className="py-3.5 px-4 text-[#ce4915] font-semibold">
                  31% mentor tidak linier dengan proyek siswa
                </td>
                <td className="py-3.5 px-4 text-[#117d78] font-bold">
                  Skor kecocokan rata-rata 92,4% (&ge; 0,80)
                </td>
                <td className="py-3.5 px-4 text-[#6c7a78]">
                  Multi-Criteria Decision Making (MCDM) &amp; Kemiripan Rumpun
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-[#202b2a]">
                  Respon Terhadap Lonjakan Tarif (+40%)
                </td>
                <td className="py-3.5 px-4 text-[#ce4915] font-semibold">
                  Pembengkakan anggaran hingga 40% tanpa kontrol
                </td>
                <td className="py-3.5 px-4 text-[#117d78] font-bold">
                  Otomatis beralih ke Hybrid / Rotasi Lokal sesuai SLA
                </td>
                <td className="py-3.5 px-4 text-[#6c7a78]">
                  Linear Programming Minimasi Biaya &amp; Uji Guncangan
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-[#202b2a]">
                  Pembatalan Sesi Akibat Mentor Burnout
                </td>
                <td className="py-3.5 px-4 text-[#ce4915] font-semibold">
                  15% sesi dibatalkan mendadak oleh mentor
                </td>
                <td className="py-3.5 px-4 text-[#117d78] font-bold">
                  Turun ke 1,8% dengan konfirmasi H-3 &amp; cadangan otomatis
                </td>
                <td className="py-3.5 px-4 text-[#6c7a78]">
                  Batas Kapasitas &rho; = 83% &amp; Urutan Pengganti 5 Langkah
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-[#202b2a]">
                  Waktu Pemrosesan Matching 120 Tim
                </td>
                <td className="py-3.5 px-4 text-[#ce4915] font-semibold">
                  7–10 Hari Kerja (Manual Spreadsheet)
                </td>
                <td className="py-3.5 px-4 text-[#117d78] font-bold">
                  &lt; 2 Detik (MILP Solver Komputasi)
                </td>
                <td className="py-3.5 px-4 text-[#6c7a78]">
                  Branch-and-Bound Simplex Algorithm
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Inter-city Travel Cost Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#202b2a]">
              Matriks Biaya Logistik Antarkota (7 Kota Operasional)
            </h3>
            <p className="text-xs text-[#6c7a78] mt-0.5">
              Digunakan oleh MILP solver untuk menghitung biaya transportasi per kunjungan mentor.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#6c7a78]">Kota Asal:</span>
            <select
              value={selectedOriginCity}
              onChange={(e) => setSelectedOriginCity(e.target.value)}
              className="text-xs bg-[#f7f8f7] border border-[#e3e9e7] rounded-xl px-3 py-1.5 outline-none font-semibold text-[#202b2a]"
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {cities.map((destCity) => {
            const cost = CITY_COST_MATRIX[selectedOriginCity]?.[destCity] || 0;
            const isSameCity = selectedOriginCity === destCity;

            return (
              <div
                key={destCity}
                className={`p-3.5 rounded-xl border text-center ${
                  isSameCity
                    ? 'bg-[#e1f4f0] border-[#117d78]/30 text-[#117d78]'
                    : 'bg-[#fbfcfb] border-[#e3e9e7] text-[#202b2a]'
                }`}
              >
                <div className="text-[11px] font-semibold text-[#6c7a78] truncate">{destCity}</div>
                <div className="text-sm font-extrabold mt-1">
                  Rp{cost.toLocaleString('id-ID')}
                </div>
                <div className="text-[10px] mt-0.5 opacity-80">
                  {isSameCity ? 'Lokal / Transportasi Kota' : 'Kereta / Pesawat'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
