import React, { useState, useId } from 'react';
import { RotateCcw, LineChart, Compass } from 'lucide-react';

interface FunctionModel {
  id: string;
  name: string;
  formula: string;
  fn: (x: number) => number;
  derivative: (x: number) => number;
  derivativeFormula: string;
}

const FUNCTIONS: FunctionModel[] = [
  {
    id: 'parabola',
    name: 'Fungsi Kuadrat (Parabola)',
    formula: 'f(x) = 0.4x² - 2',
    fn: (x) => 0.4 * Math.pow(x, 2) - 2,
    derivative: (x) => 0.8 * x,
    derivativeFormula: "f'(x) = 0.8x"
  },
  {
    id: 'cubic',
    name: 'Fungsi Kubik Bergelombang',
    formula: 'f(x) = 0.15x³ - x',
    fn: (x) => 0.15 * Math.pow(x, 3) - x,
    derivative: (x) => 0.45 * Math.pow(x, 2) - 1,
    derivativeFormula: "f'(x) = 0.45x² - 1"
  },
  {
    id: 'sine',
    name: 'Fungsi Sinusoidal',
    formula: 'f(x) = 2 sin(x)',
    fn: (x) => 2 * Math.sin(x),
    derivative: (x) => 2 * Math.cos(x),
    derivativeFormula: "f'(x) = 2 cos(x)"
  }
];

export const CalculusTangentSimulation: React.FC = () => {
  const [selectedFuncId, setSelectedFuncId] = useState<string>('parabola');
  const [x0, setX0] = useState<number>(1.5);

  const x0InputId = useId();

  const currentFunc = FUNCTIONS.find((f) => f.id === selectedFuncId) || FUNCTIONS[0];

  const y0 = currentFunc.fn(x0);
  const slope = currentFunc.derivative(x0);

  // SVG Coordinate mapping: width 500, height 300, center at (250, 150)
  // Scale: 1 math unit = 32 SVG pixels
  const cx = 250;
  const cy = 150;
  const scale = 32;

  const toSvgX = (x: number) => cx + x * scale;
  const toSvgY = (y: number) => cy - y * scale;

  // Generate curve path
  const curvePoints: string[] = [];
  for (let x = -6.5; x <= 6.5; x += 0.2) {
    const y = currentFunc.fn(x);
    curvePoints.push(`${toSvgX(x).toFixed(1)},${toSvgY(y).toFixed(1)}`);
  }
  const curveD = `M ${curvePoints.join(' L ')}`;

  // Generate tangent line segment spanning around x0 +/- 3
  const tangentX1 = x0 - 3;
  const tangentY1 = y0 + slope * (tangentX1 - x0);
  const tangentX2 = x0 + 3;
  const tangentY2 = y0 + slope * (tangentX2 - x0);

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-5 md:p-6 border border-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2">
          <LineChart className="w-5 h-5 text-sky-400" />
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Eksplorasi Geometri Garis Singgung & Laju Sesaat</h3>
            <p className="text-xs text-slate-400">Visualisasi konsep limit turunan pertama f'(x) sebagai kemiringan sudut garis singgung kurva.</p>
          </div>
        </div>

        {/* Function selector tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-lg">
          {FUNCTIONS.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFuncId(f.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                selectedFuncId === f.id ? 'bg-sky-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: SVG Visual Plane & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        {/* Left Column: Visual Plane */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          <div className="bg-slate-950 rounded-lg border border-slate-800 p-2 flex flex-col items-center">
            <svg viewBox="0 0 500 300" className="w-full h-auto max-h-[300px] select-none">
              {/* Coordinate Grid Lines */}
              {[-6, -4, -2, 2, 4, 6].map((x) => (
                <line key={`gx-${x}`} x1={toSvgX(x)} y1={20} x2={toSvgX(x)} y2={280} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
              ))}
              {[-4, -2, 2, 4].map((y) => (
                <line key={`gy-${y}`} x1={20} y1={toSvgY(y)} x2={480} y2={toSvgY(y)} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
              ))}

              {/* Main Axes */}
              <line x1={20} y1={cy} x2={480} y2={cy} stroke="#475569" strokeWidth="1.5" />
              <line x1={cx} y1={20} x2={cx} y2={280} stroke="#475569" strokeWidth="1.5" />

              {/* Axis Label Ticks */}
              {[-6, -4, -2, 2, 4, 6].map((x) => (
                <text key={`tx-${x}`} x={toSvgX(x)} y={cy + 14} fill="#64748b" fontSize="8" textAnchor="middle" className="font-mono">
                  {x}
                </text>
              ))}
              {[-4, -2, 2, 4].map((y) => (
                <text key={`ty-${y}`} x={cx - 10} y={toSvgY(y) + 3} fill="#64748b" fontSize="8" textAnchor="end" className="font-mono">
                  {y}
                </text>
              ))}

              {/* Function Curve */}
              <path d={curveD} fill="none" stroke="#38bdf8" strokeWidth="2.5" />

              {/* Tangent Line */}
              <line
                x1={toSvgX(tangentX1)}
                y1={toSvgY(tangentY1)}
                x2={toSvgX(tangentX2)}
                y2={toSvgY(tangentY2)}
                stroke="#f43f5e"
                strokeWidth="2"
              />

              {/* Point of Tangency (x0, y0) */}
              <circle cx={toSvgX(x0)} cy={toSvgY(y0)} r="5" fill="#f43f5e" />
              <circle cx={toSvgX(x0)} cy={toSvgY(y0)} r="8" fill="none" stroke="#f43f5e" strokeWidth="1.5" opacity="0.6" />

              {/* Coordinates Label */}
              <text x={toSvgX(x0) + 10} y={toSvgY(y0) - 10} fill="#f43f5e" fontSize="10" fontWeight="bold" className="font-mono">
                P({x0.toFixed(2)}, {y0.toFixed(2)})
              </text>
            </svg>
          </div>

          {/* Telemetry Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Fungsi Asal</span>
              <div className="text-sm font-semibold font-mono text-sky-400 mt-1">
                {currentFunc.formula}
              </div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Turunan Pertama</span>
              <div className="text-sm font-semibold font-mono text-amber-400 mt-1">
                {currentFunc.derivativeFormula}
              </div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Gradien Lereng (m)</span>
              <div className={`text-sm font-bold font-mono mt-1 ${slope > 0 ? 'text-emerald-400' : slope < 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                m = {slope.toFixed(2)} {slope === 0 ? '(Titik Ekstrim / Datar)' : slope > 0 ? '(Naik)' : '(Turun)'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Sliders & Equation Details */}
        <div className="lg:col-span-4 bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-sky-400" />
              Titik Singgung
            </span>
            <button
              onClick={() => setX0(1.0)}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset (x=1)
            </button>
          </div>

          {/* Slider for x0 */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label htmlFor={x0InputId} className="text-slate-300 font-medium">Koordinat x₀</label>
              <span className="font-mono font-semibold tabular-nums text-rose-400">
                x₀ = {x0.toFixed(2)}
              </span>
            </div>
            <input
              id={x0InputId}
              type="range"
              min="-4.0"
              max="4.0"
              step="0.1"
              value={x0}
              onChange={(e) => setX0(parseFloat(e.target.value))}
              className="w-full accent-rose-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>-4.0</span>
              <span>0.0</span>
              <span>+4.0</span>
            </div>
          </div>

          {/* Equation Box */}
          <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-2 text-xs">
            <div className="font-semibold text-slate-200">Persamaan Garis Singgung:</div>
            <div className="p-2 bg-slate-950 rounded font-mono text-[11px] text-emerald-400 border border-slate-800">
              y - ({y0.toFixed(2)}) = {slope.toFixed(2)} · (x - ({x0.toFixed(2)}))
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed pt-1">
              Ketika nilai gradien <code className="text-amber-300">m = 0</code>, garis singgung berada dalam posisi horizontal sempurna. Titik ini menandai puncak lokal (maksimum) atau lembah lokal (minimum) dari fungsi!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
