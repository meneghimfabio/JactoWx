import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import KpiCards from './components/KpiCards';
import MapViewer from './components/MapViewer';
import ForecastPlanner from './components/ForecastPlanner';
import SprayingTable from './components/SprayingTable';
import AnalyticsCharts from './components/AnalyticsCharts';

import appData from './data/jacto_data.json';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('map');
  const [selectedTalhao, setSelectedTalhao] = useState(null);

  // Sync dark class on document root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 flex flex-col font-sans transition-colors duration-200">
      
      {/* Header */}
      <Header
        isDark={isDark}
        setIsDark={setIsDark}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedTalhao={selectedTalhao}
        setSelectedTalhao={setSelectedTalhao}
        talhoes={appData.talhoes}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* KPI Cards Row */}
        <KpiCards
          data={appData}
          selectedTalhao={selectedTalhao}
        />

        {/* Dynamic View Tab */}
        <div>
          {activeTab === 'map' && (
            <MapViewer
              data={appData}
              selectedTalhao={selectedTalhao}
              setSelectedTalhao={setSelectedTalhao}
              isDark={isDark}
            />
          )}

          {activeTab === 'forecast' && (
            <ForecastPlanner
              data={appData}
              selectedTalhao={selectedTalhao}
              setSelectedTalhao={setSelectedTalhao}
              isDark={isDark}
            />
          )}

          {activeTab === 'table' && (
            <SprayingTable
              data={appData}
              selectedTalhao={selectedTalhao}
              setSelectedTalhao={setSelectedTalhao}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsCharts
              data={appData}
              selectedTalhao={selectedTalhao}
              isDark={isDark}
            />
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0f] py-4 text-xs text-zinc-500">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-900 dark:text-zinc-200">JactoWX</span>
            <span>• Conectado ao BigQuery: <code className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400">demonstracoes-fabio.JactoWX</code></span>
          </div>
          <div>
            <span>Modelagem Meteorológica Ensemble: <strong>Google WeatherNext 2</strong> (64 membros • 0.25°)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
