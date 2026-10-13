import React from 'react';
import { UserProfile } from '../types';
import { Sparkles, MessageCircleQuestion } from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  onOpenAiTutor: () => void;
  onScrollTo: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onOpenAiTutor, onScrollTo }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strict 1-Row, 3-Zone Top Bar Contract */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Text Element Wordmark */}
          <button
            onClick={() => onScrollTo('hero')}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2 text-left"
          >
            <span className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              CA
            </span>
            <span>Cakrawala Akademi</span>
          </button>

          {/* Zone 2: 4-5 Clean Single-Line Text Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onScrollTo('kursus')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 text-left"
            >
              Kursus Daring
            </button>
            <button
              onClick={() => onScrollTo('laboratorium')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 text-left"
            >
              Lab Interaktif
            </button>
            <button
              onClick={() => onScrollTo('komunitas')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 text-left"
            >
              Komunitas Pelajar
            </button>
            <button
              onClick={() => onScrollTo('ruang-belajar')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 text-left"
            >
              Ruang Belajar
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAiTutor}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors whitespace-nowrap shrink-0"
            >
              <MessageCircleQuestion className="w-3.5 h-3.5" />
              Tanya Tutor AI
            </button>

            {/* Profile XP Indicator & Action */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover border border-slate-300"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-none">{user.name}</div>
                <div className="text-[10px] text-sky-600 font-mono font-medium tabular-nums mt-0.5">
                  {user.xpPoints} XP · 🔥 {user.streakDays} Hari
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
