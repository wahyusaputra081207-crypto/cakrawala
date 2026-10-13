import React, { useState } from 'react';
import { BohrEffectSimulation } from './labs/BohrEffectSimulation';
import { CodeRunnerSimulation } from './labs/CodeRunnerSimulation';
import { ProjectilePhysicsSimulation } from './labs/ProjectilePhysicsSimulation';
import { CalculusTangentSimulation } from './labs/CalculusTangentSimulation';
import { Activity, Code2, Target, LineChart } from 'lucide-react';

interface InteractiveLabsProps {
  initialLab?: 'bohr_sim' | 'code_runner' | 'projectile_sim' | 'calculus_sim';
}

export const InteractiveLabs: React.FC<InteractiveLabsProps> = ({ initialLab = 'bohr_sim' }) => {
  const [activeLab, setActiveLab] = useState<'bohr_sim' | 'code_runner' | 'projectile_sim' | 'calculus_sim'>(initialLab);

  const labsConfig = [
    {
      id: 'bohr_sim' as const,
      title: 'Efek Bohr & Oksigen Seluler',
      category: 'Sains Fisiologi',
      icon: Activity,
      desc: 'Simulasi kurva disosiasi hemoglobin & pertukaran gas kapiler'
    },
    {
      id: 'code_runner' as const,
      title: 'Editor Kode & DOM Sandbox',
      category: 'Teknologi Web',
      icon: Code2,
      desc: 'Eksperimen langsung HTML, CSS, JavaScript dengan tinjauan instan'
    },
    {
      id: 'projectile_sim' as const,
      title: 'Kinematika Gerak Parabola',
      category: 'Fisika Eksperimental',
      icon: Target,
      desc: 'Kendalikan sudut luncur peluru, kecepatan awal & medan gravitasi'
    },
    {
      id: 'calculus_sim' as const,
      title: 'Garis Singgung & Turunan',
      category: 'Matematika Visual',
      icon: LineChart,
      desc: 'Visualisasi kemiringan lereng sesaat f\'(x) pada bidang Kartesius'
    }
  ];

  return (
    <section id="laboratorium" className="py-12 bg-slate-950 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading adhering to anti-slop rules: natural title case, no // comment prefixes */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-slate-800 gap-4">
          <div>
            <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
              Laboratorium Virtual Pembelajar
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Simulasi Interaktif & Eksperimen Mandiri
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Pelajari sains dan rekayasa bukan hanya dengan membaca teori, melainkan dengan memanipulasi variabel langsung, mengamati fenomena mikroskopis, dan menguji kode di sandbox.
            </p>
          </div>

          <div className="text-xs text-slate-400">
            4 Modul Lab Aktif · Bebas Eksperimen
          </div>
        </div>

        {/* Tab Selector Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 my-6">
          {labsConfig.map((lab) => {
            const Icon = lab.icon;
            const isActive = activeLab === lab.id;
            return (
              <button
                key={lab.id}
                onClick={() => setActiveLab(lab.id)}
                className={`p-3 rounded-lg text-left transition-all border ${
                  isActive
                    ? 'bg-slate-900 border-sky-500 shadow-sm'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span className="text-[11px] font-medium text-slate-400">{lab.category}</span>
                </div>
                <div className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {lab.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Simulation Stage */}
        <div className="mt-4">
          {activeLab === 'bohr_sim' && <BohrEffectSimulation />}
          {activeLab === 'code_runner' && <CodeRunnerSimulation />}
          {activeLab === 'projectile_sim' && <ProjectilePhysicsSimulation />}
          {activeLab === 'calculus_sim' && <CalculusTangentSimulation />}
        </div>
      </div>
    </section>
  );
};
