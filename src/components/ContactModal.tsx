import React, { useState } from 'react';
import { X, Headphones, Send, CheckCircle2, MessageSquare, Phone, Mail } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [topic, setTopic] = useState('Kendala Alokasi Mentor');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setMessage('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-[#e3e9e7] relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-[#6c7a78] hover:text-[#202b2a] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#e1f4f0] text-[#117d78] flex items-center justify-center">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#202b2a]">Pusat Bantuan Tim RAWON</h3>
            <p className="text-xs text-[#6c7a78]">
              Dukungan operasional untuk EduTech X, sekolah mitra, dan mentor riset.
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#e1f4f0] text-[#117d78] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-[#202b2a]">Pesan Terkirim ke Tim Support!</h4>
            <p className="text-xs text-[#6c7a78] max-w-xs mx-auto">
              Koordinator operasional RAWON akan merespons dalam waktu maksimal 15 menit.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#202b2a] mb-1">
                Kategori Permasalahan:
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full text-xs bg-[#f7f8f7] border border-[#e3e9e7] rounded-xl p-2.5 outline-none focus:border-[#ce4915]"
              >
                <option value="Kendala Alokasi Mentor">Kendala Alokasi / Penugasan Mentor</option>
                <option value="Lonjakan Biaya Perjalanan">Eskalasi Lonjakan Biaya Tiket Transportasi</option>
                <option value="Perubahan Jadwal Sekolah">Permohonan Rescheduling Jadwal Sekolah</option>
                <option value="Laporan Burnout Mentor">Laporan Kendala Akademis / Burnout Mentor</option>
                <option value="Lainnya">Pertanyaan Umum Platform</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202b2a] mb-1">
                Detail Laporan / Pesan:
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan kendala Anda secara spesifik (nama sekolah, tim, atau ID mentor)..."
                className="w-full text-xs bg-[#f7f8f7] border border-[#e3e9e7] rounded-xl p-3 outline-none focus:border-[#ce4915] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 text-[11px] text-[#6c7a78]">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#f7f8f7]">
                <Mail className="w-3.5 h-3.5 text-[#ce4915]" />
                <span>support@rawon-edutech.id</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#f7f8f7]">
                <Phone className="w-3.5 h-3.5 text-[#117d78]" />
                <span>Hotline: +62 811-2345-6789</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e3e9e7]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#6c7a78] hover:bg-[#f7f8f7] rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#117d78] hover:bg-[#0e6b66] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Pesan</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
