import React from 'react';
import { Course } from '../types';
import { X, Award, Printer, CheckCircle, ShieldCheck } from 'lucide-react';

interface CertificateModalProps {
  course: Course;
  studentName: string;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  course,
  studentName,
  onClose
}) => {
  const certId = `CKR-2026-${course.id.toUpperCase().slice(0, 4)}-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl border border-slate-300 shadow-2xl flex flex-col overflow-hidden text-slate-900">
        {/* Modal Controls Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">Sertifikat Kelulusan Resmi</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak / Simpan PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Certificate Canvas */}
        <div className="p-8 sm:p-12 m-4 sm:m-6 rounded-xl border-8 border-double border-slate-300 bg-linear-to-b from-amber-50/20 via-white to-sky-50/20 relative text-center">
          {/* Top Seal & Heading */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center shadow-md">
              <Award className="w-8 h-8" />
            </div>
          </div>

          <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-1">
            Cakrawala Akademi · Indonesia
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Sertifikat Kompetensi & Kelulusan
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Nomor Verifikasi Kredensial: <span className="font-mono font-semibold text-slate-700">{certId}</span>
          </p>

          <div className="my-8 space-y-2">
            <p className="text-xs text-slate-500 italic">Sertifikat ini diberikan dengan bangga kepada:</p>
            <div className="text-2xl sm:text-3xl font-bold text-sky-950 font-serif border-b-2 border-slate-300 pb-2 max-w-md mx-auto">
              {studentName}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto pt-2 leading-relaxed">
              Telah berhasil menyelesaikan seluruh modul teori, eksperimen laboratorium simulasi interaktif, dan kuis evaluasi pada kurikulum:
            </p>
            <div className="text-lg sm:text-xl font-bold text-slate-900 pt-1">
              {course.title}
            </div>
            <div className="text-xs text-slate-500">
              Bidang: {course.categoryLabel} · Tingkat: {course.level}
            </div>
          </div>

          {/* Signatures & Verification Stamp */}
          <div className="mt-10 pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 items-end max-w-lg mx-auto text-xs">
            <div className="text-left">
              <div className="font-semibold text-slate-900">{course.instructor.name}</div>
              <div className="text-[11px] text-slate-500">{course.instructor.role}</div>
              <div className="text-[10px] text-slate-400 mt-1">Instruktur Kurikulum</div>
            </div>

            <div className="text-right">
              <div className="font-mono font-medium text-slate-800">{dateFormatted}</div>
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center justify-end gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Terverifikasi Sistem
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Direktorat Akademik</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
