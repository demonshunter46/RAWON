import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  GraduationCap, 
  School, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Layers,
  ArrowRight,
  Eye
} from 'lucide-react';
import { UserRole } from '../types/rawon';

interface RolesViewProps {
  currentRole: UserRole;
  onRoleSelect: (role: UserRole) => void;
}

export const RolesView: React.FC<RolesViewProps> = ({ currentRole, onRoleSelect }) => {
  const roleDetails: Record<
    UserRole,
    {
      role: UserRole;
      icon: React.ElementType;
      summary: string;
      screens: string[];
      tasks: string[];
      permissions: string[];
      triggers: string[];
      kpis: string[];
      accentColor: string;
      bgColor: string;
    }
  > = {
    'Allocation owner': {
      role: 'Allocation owner',
      icon: ShieldCheck,
      summary: 'Menjaga kualitas riset siswa dan efisiensi biaya alokasi, terutama untuk tim Prioritas Medali Nasional.',
      screens: [
        'Dasbor Eksekutif: tim belum teralokasi, tim berisiko, selisih biaya hasil re-optimasi',
        'Papan alokasi dengan justifikasi algoritma tiap penugasan',
        'Antrean persetujuan eskalasi dan rotasi',
        'Pengaturan parameter solver dan log audit transaksi',
      ],
      tasks: [
        'Menyetujui hasil komputasi solver MILP sebelum dikunci secara final',
        'Menyetujui rotasi tim Prioritas ke mentor lain',
        'Menyetujui klausul surcharge B2B saat tarif transportasi naik ≥ 40%',
        'Mengubah bobot, ambang kemiripan, dan batas SLA biaya',
      ],
      permissions: [
        'Mengubah dan mengunci alokasi seluruh tim nasional',
        'Mengubah parameter ρ (83%), θ (0,80), δ, SLA',
        'Tim Medali Nasional tidak boleh turun di bawah Tier A',
      ],
      triggers: [
        'Tarif penerbangan/kereta naik ≥ 35%',
        'Mentor tim Prioritas berhalangan hadir',
        'Tim Prioritas tanpa cadangan Tier A',
      ],
      kpis: [
        'Persentase tim sesuai tier (target: 100%)',
        'Jumlah penugasan ulang mendadak',
        'Tingkat kepatuhan SLA biaya perjalanan',
        'Penghematan logistik vs baseline manual',
      ],
      accentColor: '#ce4915',
      bgColor: '#ffebe4',
    },
    'Koordinator wilayah': {
      role: 'Koordinator wilayah',
      icon: UserCheck,
      summary: 'Memastikan sesi di kotanya tetap berjalan optimal dan biaya perjalanan antarkota terkendali.',
      screens: [
        'Daftar sekolah mitra, mentor aktif, dan tim per kota',
        'Kalender kunjungan bimbingan mingguan & bulanan',
        'Input tarif transportasi aktual lokal',
        'Status konfirmasi kesiapan mentor H-3',
      ],
      tasks: [
        'Memperbarui tarif transportasi lokal terkini',
        'Menagih konfirmasi kesiapan mentor pada H-3',
        'Mencari pengganti di kota yang sama bila terjadi kendala',
        'Menjadwalkan ulang tatap muka ke tonggak berikutnya bila perlu',
        'Mencatat realisasi kunjungan dan biaya lapangan',
      ],
      permissions: [
        'Menyetujui peringatan tarif naik ≥ 20%',
        'Menyetujui pengganti untuk klaster Reguler dan Eksekutif',
        'Dilarang mengubah penugasan Prioritas tanpa persetujuan Allocation Owner',
      ],
      triggers: [
        'Tarif wilayah naik ≥ 20%',
        'Mentor belum melakukan konfirmasi pada H-3',
        'Sekolah mengajukan perubahan jadwal',
      ],
      kpis: [
        'Tingkat konfirmasi H-3 tepat waktu',
        'Waktu respon pencarian pengganti (< 4 jam)',
        'Deviasi biaya aktual dibanding estimasi',
      ],
      accentColor: '#117d78',
      bgColor: '#e1f4f0',
    },
    'Mentor': {
      role: 'Mentor',
      icon: GraduationCap,
      summary: 'Menerima penugasan yang jelas dengan beban kerja yang terukur agar tidak mengalami burnout.',
      screens: [
        'Daftar tim riset yang ditugaskan & kalender sesi bimbingan',
        'Tombol konfirmasi kesiapan bimbingan H-3',
        'Pengaturan batas beban pribadi (maks 83% kuota)',
        'Formulir pelaporan kendala atau sinyal burnout',
      ],
      tasks: [
        'Mengonfirmasi kesiapan membimbing pada H-3',
        'Menurunkan batas beban sendiri (maksimal 83% kuota)',
        'Melapor lebih awal bila ada kendala mendesak',
        'Mengisi catatan progres dan logbook setelah sesi riset',
      ],
      permissions: [
        'Hanya melihat data tim bimbingan yang ditugaskan kepadanya',
        'Hanya dapat menurunkan batas beban mandiri, bukan menaikkannya melebihi 83%',
      ],
      triggers: [
        'Pengingat otomatis konfirmasi H-3',
        'Penugasan baru atau pergantian mode (tatap muka ↔ hybrid)',
        'Pemberitahuan perubahan jadwal dari pihak sekolah',
      ],
      kpis: [
        'Tingkat kehadiran sesi (target > 98%)',
        'Beban utilisasi terhadap batas pribadi',
        'Skor evaluasi dan umpan balik dari sekolah binaan',
      ],
      accentColor: '#ff9900',
      bgColor: '#fff2dc',
    },
    'Sekolah': {
      role: 'Sekolah',
      icon: School,
      summary: 'Mengetahui identitas mentor, jadwal sesi, dan mengajukan rescheduling secara transparan.',
      screens: [
        'Jadwal sesi tim riset sekolah',
        'Profil dan riwayat portofolio mentor utama & cadangan',
        'Formulir pengajuan perubahan jadwal bimbingan',
        'Riwayat sesi dan penilaian kepuasan pendampingan',
      ],
      tasks: [
        'Mengajukan perubahan jadwal sedini mungkin bila bentrok dengan ujian',
        'Mengonfirmasi sesi bimbingan di lingkungan sekolah',
        'Memberikan penilaian mutu berkala setelah sesi selesai',
      ],
      permissions: [
        'Hanya dapat melihat tim riset milik sekolah yang bersangkutan',
        'Tidak dapat memilih mentor secara langsung (usulan melalui koordinator)',
        'Sistem memperingatkan bahwa rescheduling melipatgandakan beban mentor',
      ],
      triggers: [
        'Perubahan mentor atau alih mode bimbingan',
        'Sesi tatap muka pada tonggak penting penelitian',
        'Konfirmasi jadwal final H-1',
      ],
      kpis: [
        'Persentase sesi riset terlaksana sesuai kurikulum',
        'Frekuensi perubahan jadwal per periode riset',
        'Indeks kepuasan pendampingan olimpiade',
      ],
      accentColor: '#07b3b3',
      bgColor: '#e1f4f0',
    },
  };

  const activeDetail = roleDetails[currentRole];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#202b2a] flex items-center gap-2">
            Struktur Akses 4 Peran Pengguna
          </h2>
          <p className="text-xs text-[#6c7a78] mt-1 max-w-2xl leading-relaxed">
            RAWON membagi sistem menjadi 4 hak akses terpisah guna memastikan transparansi, pemisahan tugas persetujuan, dan kenyamanan seluruh pemangku kepentingan.
          </p>
        </div>
      </div>

      {/* Role Selection Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.keys(roleDetails) as UserRole[]).map((roleKey) => {
          const item = roleDetails[roleKey];
          const Icon = item.icon;
          const isSelected = currentRole === roleKey;

          return (
            <button
              key={roleKey}
              onClick={() => onRoleSelect(roleKey)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#ce4915] shadow-md ring-2 ring-[#ce4915]/20'
                  : 'bg-white border-[#e3e9e7] hover:bg-[#f7f8f7]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: item.bgColor, color: item.accentColor }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {isSelected && (
                  <span className="text-[10px] font-bold text-[#ce4915] bg-[#ffebe4] px-2 py-0.5 rounded-full">
                    Aktif
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#202b2a]">{item.role}</h4>
                <p className="text-[11px] text-[#6c7a78] line-clamp-2 mt-0.5 leading-snug">
                  {item.summary}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Role Detailed Panels */}
      <div className="bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#e3e9e7]">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: activeDetail.bgColor, color: activeDetail.accentColor }}
          >
            <activeDetail.icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#202b2a]">Peran: {activeDetail.role}</h3>
            <p className="text-xs text-[#6c7a78]">{activeDetail.summary}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Layar Utama */}
          <div className="p-4 rounded-xl bg-[#fbfcfb] border border-[#e3e9e7]">
            <h4 className="text-xs font-bold text-[#202b2a] mb-2 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#ce4915]" /> Layar Utama
            </h4>
            <ul className="text-xs text-[#6c7a78] space-y-1.5 list-disc pl-4">
              {activeDetail.screens.map((s, idx) => (
                <li key={idx} className="leading-snug">{s}</li>
              ))}
            </ul>
          </div>

          {/* Tugas */}
          <div className="p-4 rounded-xl bg-[#fbfcfb] border border-[#e3e9e7]">
            <h4 className="text-xs font-bold text-[#202b2a] mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#117d78]" /> Tugas Utama
            </h4>
            <ul className="text-xs text-[#6c7a78] space-y-1.5 list-disc pl-4">
              {activeDetail.tasks.map((t, idx) => (
                <li key={idx} className="leading-snug">{t}</li>
              ))}
            </ul>
          </div>

          {/* Izin dan Batasan */}
          <div className="p-4 rounded-xl bg-[#fbfcfb] border border-[#e3e9e7]">
            <h4 className="text-xs font-bold text-[#202b2a] mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ff9900]" /> Izin &amp; Batasan
            </h4>
            <ul className="text-xs text-[#6c7a78] space-y-1.5 list-disc pl-4">
              {activeDetail.permissions.map((p, idx) => (
                <li key={idx} className="leading-snug">{p}</li>
              ))}
            </ul>
          </div>

          {/* Pemicu Notifikasi */}
          <div className="p-4 rounded-xl bg-[#fbfcfb] border border-[#e3e9e7]">
            <h4 className="text-xs font-bold text-[#202b2a] mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#07b3b3]" /> Pemicu Notifikasi
            </h4>
            <ul className="text-xs text-[#6c7a78] space-y-1.5 list-disc pl-4">
              {activeDetail.triggers.map((trig, idx) => (
                <li key={idx} className="leading-snug">{trig}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Case Example: Mentor Drop Out Flow (From HTML) */}
      <div className="bg-white p-6 rounded-2xl border border-[#e3e9e7] shadow-xs">
        <h3 className="text-base font-bold text-[#202b2a] mb-2">
          Studi Alur Operasional: Mentor Top-Tier Drop Out pada H-1
        </h3>
        <p className="text-xs text-[#6c7a78] mb-4">
          Bagaimana keempat peran berkolaborasi saat krisis terjadi untuk menjaga kesinambungan bimbingan siswa tanpa panik.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#f7f8f7] text-[#60716e] border-b border-[#e3e9e7] font-semibold">
                <th className="py-2.5 px-3">Waktu</th>
                <th className="py-2.5 px-3">Peran Terkait</th>
                <th className="py-2.5 px-4">Tindakan Respons Real-Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e9e7]">
              <tr>
                <td className="py-3 px-3 font-mono font-bold text-[#ce4915]">H-3</td>
                <td className="py-3 px-3 font-semibold text-[#202b2a]">Mentor</td>
                <td className="py-3 px-4 text-[#6c7a78]">
                  Gagal konfirmasi kesiapan atau menandai sinyal burnout di portal; sistem menandai tim binaan terkait dengan status risiko.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-mono font-bold text-[#ce4915]">H-3</td>
                <td className="py-3 px-3 font-semibold text-[#202b2a]">Koordinator wilayah</td>
                <td className="py-3 px-4 text-[#6c7a78]">
                  Menghubungi mentor, memverifikasi kondisi lapangan, lalu menyiapkan usulan pengganti.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-mono font-bold text-[#117d78]">H-2</td>
                <td className="py-3 px-3 font-semibold text-[#202b2a]">RAWON System</td>
                <td className="py-3 px-4 text-[#6c7a78]">
                  Mengusulkan pengganti sesuai hierarki: cadangan pra-tetap, kota sama, kota lain, atau alih hybrid.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-mono font-bold text-[#117d78]">H-2</td>
                <td className="py-3 px-3 font-semibold text-[#202b2a]">Allocation owner</td>
                <td className="py-3 px-4 text-[#6c7a78]">
                  Menyetujui pengganti untuk tim Prioritas; koordinator menyetujui untuk klaster Eksekutif dan Reguler.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-mono font-bold text-[#ff9900]">H-1</td>
                <td className="py-3 px-3 font-semibold text-[#202b2a]">Sekolah</td>
                <td className="py-3 px-4 text-[#6c7a78]">
                  Menerima pemberitahuan profil mentor baru atau perubahan mode bimbingan, lalu mengonfirmasi jadwal.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-mono font-bold text-[#07b3b3]">Pasca Sesi</td>
                <td className="py-3 px-3 font-semibold text-[#202b2a]">Semua Peran</td>
                <td className="py-3 px-4 text-[#6c7a78]">
                  Keputusan dan alasan penugasan tersimpan permanen di log audit guna pembaharuan model prediktif.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
