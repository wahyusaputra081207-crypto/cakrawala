import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-900">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <span className="w-6 h-6 rounded bg-sky-600 flex items-center justify-center text-xs">
                CA
              </span>
              <span>Cakrawala Akademi</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Platform pembelajaran interaktif dan ruang komunitas kolaboratif untuk pelajar, mahasiswa, dan pembelajar mandiri di Indonesia.
            </p>
          </div>

          {/* Links 1: Kursus & Lab */}
          <div>
            <div className="font-semibold text-slate-200 mb-3">Kurikulum Interaktif</div>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#kursus" className="hover:text-white transition-colors">Rekayasa Frontend Modern</a></li>
              <li><a href="#kursus" className="hover:text-white transition-colors">Fisiologi & Efek Bohr</a></li>
              <li><a href="#kursus" className="hover:text-white transition-colors">Matematika & Kalkulus Visual</a></li>
              <li><a href="#kursus" className="hover:text-white transition-colors">Fisika Kinematika Parabola</a></li>
            </ul>
          </div>

          {/* Links 2: Komunitas */}
          <div>
            <div className="font-semibold text-slate-200 mb-3">Komunitas Pelajar</div>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#komunitas" className="hover:text-white transition-colors">Kanal #tanya-materi</a></li>
              <li><a href="#komunitas" className="hover:text-white transition-colors">Showcase #proyek-portofolio</a></li>
              <li><a href="#ruang-belajar" className="hover:text-white transition-colors">Ruang Belajar Pomodoro</a></li>
              <li><a href="#komunitas" className="hover:text-white transition-colors">Panduan Etika Diskusi</a></li>
            </ul>
          </div>

          {/* Links 3: Standar & Legal */}
          <div>
            <div className="font-semibold text-slate-200 mb-3">Standar Pembelajaran</div>
            <ul className="space-y-2 text-slate-400">
              <li><span>Metode Socrates & Eksperimen Mandiri</span></li>
              <li><span>Verifikasi Kredensial Sertifikat</span></li>
              <li><span>Akses Terbuka untuk Pelajar</span></li>
              <li><span>Dukungan Web Audio & Sandbox Terisolasi</span></li>
            </ul>
          </div>
        </div>

        {/* Quiet Copyright Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-2">
          <div>
            © 2026 Cakrawala Akademi. Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Kebijakan Privasi</span>
            <span>·</span>
            <span>Ketentuan Penggunaan</span>
            <span>·</span>
            <span>Bantuan Pelajar</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
