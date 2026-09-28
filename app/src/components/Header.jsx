import React from 'react';
import { Sun, Moon, CloudRain, Wind, Sprout, ShieldCheck, MapPin } from 'lucide-react';

export default function Header({ isDark, setIsDark, activeTab, setActiveTab, selectedTalhao, setSelectedTalhao, talhoes }) {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-[#0c0c0f]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold text-lg">
              JW
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-zinc-950 dark:text-zinc-50">JactoWX</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40">
                  Fazenda Girassol
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
                Cockpit de Pulverização & Meteorologia de Precisão (WeatherNext 2)
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Pill style) */}
          <div className="hidden md:flex items-center bg-zinc-100 dark:bg-[#131316] p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'map'
                  ? 'bg-white dark:bg-[#1e1e24] text-zinc-950 dark:text-zinc-50 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
              }`}
            >
              Mapa & Playback
            </button>
            <button
              onClick={() => setActiveTab('forecast')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'forecast'
                  ? 'bg-white dark:bg-[#1e1e24] text-zinc-950 dark:text-zinc-50 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
              }`}
            >
              Previsão 15 Dias
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'table'
                  ? 'bg-white dark:bg-[#1e1e24] text-zinc-950 dark:text-zinc-50 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
              }`}
            >
              Operações ({talhoes ? '110' : '...'})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white dark:bg-[#1e1e24] text-zinc-950 dark:text-zinc-50 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
              }`}
            >
              Gráficos & KPIs
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Talhão Quick Filter */}
            <select
              value={selectedTalhao || ''}
              onChange={(e) => setSelectedTalhao(e.target.value || null)}
              className="bg-zinc-100 dark:bg-[#131316] border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="">Todos os Talhões (6)</option>
              {talhoes?.map((t) => (
                <option key={t.talhao} value={t.talhao}>
                  Talhão {t.talhao} ({t.area_ha} ha)
                </option>
              ))}
            </select>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg bg-zinc-100 dark:bg-[#131316] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-[#1e1e24] border border-zinc-200 dark:border-zinc-800 transition-colors"
              title="Alternar tema Claro/Escuro"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
