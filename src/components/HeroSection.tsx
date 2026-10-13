import React from 'react';
import { HERO_IMAGE } from '../data/mockData';
import { ArrowRight, Sparkles, Beaker, Users } from 'lucide-react';

interface HeroSectionProps {
  onExploreCourses: () => void;
  onExploreLabs: () => void;
  onExploreCommunity: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCourses,
  onExploreLabs,
  onExploreCommunity
}) => {
  return (
    <section id="hero" className="relative bg-slate-50 pt-8 pb-14 border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2-Column Balanced Split: Copy Left, Media Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Zone */}
          <div className="lg:col-span-7 space-y-6">
            {/* Unboxed Kicker */}
            <div className="text-xs font-semibold text-sky-700 tracking-wide uppercase">
              Platform Edukasi Eksperimental Terbuka
            </div>

            {/* Display Headline with text-wrap: balance */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight text-balance">
              Belajar Konsep Sains & Teknologi Lewat Simulasi Nyata
            </h1>

            {/* Explanatory Paragraph */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Tinggalkan hafalan pasif. Di Cakrawala Akademi, Anda mengendalikan parameter fisik, menguji kurva afinitas hemoglobin, menulis kode komponen di sandbox, dan berdiskusi aktif dalam komunitas pelajar yang saling mendukung.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreCourses}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-xs transition-colors"
              >
                <span>Jelajahi Kursus Daring</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreLabs}
                className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl border border-slate-300 flex items-center gap-2 transition-colors"
              >
                <Beaker className="w-4 h-4 text-sky-600" />
                <span>Buka Lab Interaktif</span>
              </button>

              <button
                onClick={onExploreCommunity}
                className="px-4 py-2.5 text-slate-600 hover:text-slate-900 font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
              >
                <Users className="w-4 h-4 text-slate-500" />
                <span>Ruang Diskusi Komunitas</span>
              </button>
            </div>
          </div>

          {/* Right Visual Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-900 aspect-16/10 lg:aspect-4/3">
              <img
                src={HERO_IMAGE}
                alt="Pelajar Berkolaborasi Interaktif"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                <div className="text-white text-xs space-y-0.5">
                  <div className="font-bold text-sm">Laboratorium & Komunitas Kolaboratif</div>
                  <div className="text-slate-300 text-[11px]">
                    Simulasi kurva fisiologi, gerak parabola fisika, editor kode web, dan forum tanya-jawab.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Proof Stats Row in Tabular Numerals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-200">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              12.450+
            </div>
            <div className="text-xs text-slate-500 mt-1">Pelajar Aktif Terdaftar</div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-600 font-mono tabular-nums">
              4 Lab
            </div>
            <div className="text-xs text-slate-500 mt-1">Simulator Interaktif Terbuka</div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              480+
            </div>
            <div className="text-xs text-slate-500 mt-1">Topik Diskusi Terpecahkan</div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
              98.2%
            </div>
            <div className="text-xs text-slate-500 mt-1">Kepuasan Pemahaman Konsep</div>
          </div>
        </div>
      </div>
    </section>
  );
};
