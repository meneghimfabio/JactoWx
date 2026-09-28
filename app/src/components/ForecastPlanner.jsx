import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Calendar, CloudRain, Wind, Thermometer, Clock, ShieldCheck, CheckCircle2, AlertTriangle, AlertOctagon, Sparkles, Filter } from 'lucide-react';

export default function ForecastPlanner({ data, selectedTalhao, setSelectedTalhao, isDark }) {
  const { analise, clima_6h, talhoes } = data;

  // Filter 15-day forecast records
  const forecastRecords = analise.filter(a => a.tipo_horizonte === 'PREVISAO_FUTURA_15D');
  
  // Unique dates in the forecast
  const uniqueDates = [...new Set(forecastRecords.map(a => a.data_calendario))].sort();
  const [activeDate, setActiveDate] = useState(uniqueDates[0] || '2026-09-29');

  // Filtered by selected talhao or all
  const filteredRecords = selectedTalhao
    ? forecastRecords.filter(a => a.talhao === selectedTalhao)
    : forecastRecords;

  // Clima 6h records for the active date
  const activeDate6h = clima_6h.filter(c => c.data_local_mt === activeDate && c.tipo_horizonte === 'PREVISAO_FUTURA_15D');

  // ECharts 15-day trend data (daily average)
  const chartDates = uniqueDates;
  const tempSeries = [];
  const windSeries = [];
  const rainSeries = [];
  const hoursSeries = [];

  chartDates.forEach(d => {
    const dayRows = forecastRecords.filter(a => a.data_calendario === d);
    if (dayRows.length) {
      const avgTemp = dayRows.reduce((acc, r) => acc + (r.temp_media_dia_c || 0), 0) / dayRows.length;
      const avgWind = dayRows.reduce((acc, r) => acc + (r.vento_10m_medio_dia_kmh || 0), 0) / dayRows.length;
      const avgRain = dayRows.reduce((acc, r) => acc + (r.chuva_acumulada_dia_mm || 0), 0) / dayRows.length;
      const avgHours = dayRows.reduce((acc, r) => acc + (r.horas_estimadas_janela_ideal_dia || 0), 0) / dayRows.length;

      tempSeries.push(Number(avgTemp.toFixed(1)));
      windSeries.push(Number(avgWind.toFixed(1)));
      rainSeries.push(Number(avgRain.toFixed(2)));
      hoursSeries.push(Math.round(avgHours));
    }
  });

  const chartOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? '#0c0c0f' : '#ffffff',
      borderColor: isDark ? '#1e1e24' : '#e4e4e7',
      textStyle: { color: isDark ? '#fafafa' : '#09090b', fontFamily: 'DM Sans, sans-serif' },
    },
    legend: {
      data: ['Temperatura (°C)', 'Vento 10m (km/h)', 'Chuva Prevista (mm)', 'Horas Janela Ideal (h)'],
      textStyle: { color: isDark ? '#a1a1aa' : '#71717a' },
      bottom: 0,
    },
    grid: { left: '3%', right: '3%', bottom: '12%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: chartDates.map(d => d.split('-').reverse().slice(0, 2).join('/')),
      axisLine: { lineStyle: { color: isDark ? '#27272a' : '#e4e4e7' } },
      axisLabel: { color: isDark ? '#71717a' : '#71717a', fontSize: 11 },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Clima (°C / km/h / mm)',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } },
        axisLabel: { color: '#71717a' },
      },
      {
        type: 'value',
        name: 'Horas Ideais (0-24h)',
        max: 24,
        axisLine: { show: false },
        splitLine: { show: false },
        axisLabel: { color: '#10b981' },
      }
    ],
    series: [
      {
        name: 'Temperatura (°C)',
        type: 'line',
        smooth: true,
        data: tempSeries,
        itemStyle: { color: '#f59e0b' },
      },
      {
        name: 'Vento 10m (km/h)',
        type: 'line',
        smooth: true,
        data: windSeries,
        itemStyle: { color: '#06b6d4' },
      },
      {
        name: 'Chuva Prevista (mm)',
        type: 'bar',
        data: rainSeries,
        itemStyle: { color: '#3b82f6' },
      },
      {
        name: 'Horas Janela Ideal (h)',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: hoursSeries,
        itemStyle: { color: '#10b981' },
        lineStyle: { width: 3, type: 'dashed' },
      }
    ]
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'IDEAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" /> IDEAL
          </span>
        );
      case 'ALERTA':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-3 h-3" /> ALERTA
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <AlertOctagon className="w-3 h-3" /> IMPRÓPRIA
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-purple-900/20 border border-blue-200 dark:border-blue-900/40 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">
              Planejador Operacional WeatherNext 2 (Horizonte de 15 Dias)
            </h3>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            Recomendações agronômicas baseadas na inicialização mais recente de 64 membros de ensemble para os 6 talhões da Fazenda Girassol.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500">Período:</span>
          <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#131316] border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
            29/09/2026 a 12/10/2026
          </span>
        </div>
      </div>

      {/* 15-Day Trend Chart */}
      <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Curva Meteorológica & Janelas Disponíveis (15 Dias)</h4>
            <p className="text-xs text-zinc-500">Evolução esperada de temperatura, vento, chuva e horas ideais para pulverização.</p>
          </div>
        </div>
        <div className="h-[280px] w-full">
          <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* 15-Day Date Cards Carousel/Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Selecione uma data para detalhamento dos turnos:
          </h4>
          <span className="text-xs text-zinc-400 font-mono">14 datas previstas</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {uniqueDates.map(d => {
            const dayRows = forecastRecords.filter(a => a.data_calendario === d);
            const status = dayRows.some(r => r.status_janela_pulverizacao_dia === 'IDEAL')
              ? 'IDEAL'
              : dayRows.some(r => r.status_janela_pulverizacao_dia === 'ALERTA')
              ? 'ALERTA'
              : 'IMPROPRIA';
            const avgHours = dayRows.length
              ? Math.round(dayRows.reduce((acc, r) => acc + (r.horas_estimadas_janela_ideal_dia || 0), 0) / dayRows.length)
              : 0;
            const avgRain = dayRows.length
              ? (dayRows.reduce((acc, r) => acc + (r.chuva_acumulada_dia_mm || 0), 0) / dayRows.length).toFixed(1)
              : 0;

            const isSelected = activeDate === d;

            return (
              <div
                key={d}
                onClick={() => setActiveDate(d)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 shadow-sm ring-1 ring-blue-500'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0f] hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {d.split('-').reverse().slice(0, 2).join('/')}
                  </span>
                  {getStatusBadge(status)}
                </div>

                <div className="mt-2.5 text-[11px] space-y-1 text-zinc-600 dark:text-zinc-400">
                  <div className="flex justify-between">
                    <span>Horas Ideais:</span>
                    <strong className="font-mono text-emerald-600 dark:text-emerald-400">{avgHours}h</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Chuva Prev.:</span>
                    <strong className="font-mono text-zinc-800 dark:text-zinc-200">{avgRain} mm</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Turno Breakdown & Talhões Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Talhões Status for the active day (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Condições por Talhão • {activeDate.split('-').reverse().join('/')}
              </h4>
              <p className="text-xs text-zinc-500">Janela operacional e restrições climáticas específicas</p>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              6 talhões avaliados
            </span>
          </div>

          <div className="space-y-2">
            {(selectedTalhao ? forecastRecords.filter(r => r.talhao === selectedTalhao) : forecastRecords)
              .filter(r => r.data_calendario === activeDate)
              .map(t => (
              <div
                key={`talhao-fc-${t.talhao}`}
                className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#131316]/50 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Talhão {t.talhao}</span>
                    <span className="text-[11px] text-zinc-500">({t.area_talhao_ha} ha)</span>
                    {getStatusBadge(t.status_janela_pulverizacao_dia)}
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                    {t.motivo_condicao_climatica?.replace(/_/g, ' ')}
                  </p>
                </div>

                <div className="text-right text-xs">
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {t.horas_estimadas_janela_ideal_dia}h livres
                  </div>
                  <div className="text-zinc-500 text-[11px] font-mono mt-0.5">
                    {t.temp_media_dia_c}°C • {t.vento_10m_medio_dia_kmh} km/h • {t.chuva_acumulada_dia_mm}mm
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6-Hour Shift Detail for the active day (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Turnos de 6 Horas • {activeDate.split('-').reverse().join('/')}
              </h4>
              <p className="text-xs text-zinc-500">Detalhamento dos 4 períodos em Mato Grosso</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {activeDate6h.length === 0 ? (
              <div className="text-center py-8 text-zinc-400 text-xs">
                Turnos horários integrados na média diária do talhão.
              </div>
            ) : (
              activeDate6h.map((c, i) => (
                <div
                  key={`shift-${i}`}
                  className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#131316]/50"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      {c.periodo_dia?.replace(/_/g, ' ')}
                    </span>
                    {getStatusBadge(c.status_janela_6h)}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-center text-xs font-mono">
                    <div className="bg-white dark:bg-[#0c0c0f] p-1.5 rounded border border-zinc-100 dark:border-zinc-800">
                      <span className="text-[10px] text-zinc-500 block">Temp.</span>
                      <strong className="text-zinc-900 dark:text-zinc-100">{c.temp_media_c}°C</strong>
                    </div>
                    <div className="bg-white dark:bg-[#0c0c0f] p-1.5 rounded border border-zinc-100 dark:border-zinc-800">
                      <span className="text-[10px] text-zinc-500 block">Vento 10m</span>
                      <strong className="text-cyan-600 dark:text-cyan-400">{c.vento_10m_medio_kmh} km/h</strong>
                    </div>
                    <div className="bg-white dark:bg-[#0c0c0f] p-1.5 rounded border border-zinc-100 dark:border-zinc-800">
                      <span className="text-[10px] text-zinc-500 block">Chuva 6h</span>
                      <strong className="text-blue-600 dark:text-blue-400">{c.chuva_6h_media_mm} mm</strong>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
