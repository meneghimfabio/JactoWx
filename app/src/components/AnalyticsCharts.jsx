import React from 'react';
import ReactECharts from 'echarts-for-react';
import { BarChart3, ScatterChart, PieChart, TrendingUp, Layers, Wind } from 'lucide-react';

export default function AnalyticsCharts({ data, selectedTalhao, isDark }) {
  const { pulverizacoes, analise, talhoes } = data;

  const activePulvs = selectedTalhao
    ? pulverizacoes.filter(p => p.talhao === selectedTalhao)
    : pulverizacoes;

  // Chart 1: Scatter Dose vs Pressão
  const scatterData = activePulvs.map(p => {
    return [p.dose_l_ha, p.pressao_psi, p.area_aplicada_ha, p.talhao, p.data_operacao];
  });

  const scatterOption = {
    backgroundColor: 'transparent',
    tooltip: {
      formatter: (param) => {
        const val = param.value;
        return `
          <div style="font-size: 11px; padding: 2px;">
            <strong>Talhão ${val[3]} • ${val[4]}</strong><br/>
            Taxa: <strong>${val[0]} L/ha</strong><br/>
            Pressão: <strong>${val[1]} PSI</strong><br/>
            Área: <strong>${val[2]} ha</strong>
          </div>
        `;
      },
      backgroundColor: isDark ? '#0c0c0f' : '#ffffff',
      borderColor: isDark ? '#1e1e24' : '#e4e4e7',
      textStyle: { color: isDark ? '#fafafa' : '#09090b', fontFamily: 'DM Sans, sans-serif' }
    },
    grid: { left: '4%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
    xAxis: {
      name: 'Dose (L/ha)',
      type: 'value',
      axisLine: { lineStyle: { color: isDark ? '#27272a' : '#e4e4e7' } },
      splitLine: { lineStyle: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } },
      axisLabel: { color: '#71717a' },
    },
    yAxis: {
      name: 'Pressão (PSI)',
      type: 'value',
      axisLine: { lineStyle: { color: isDark ? '#27272a' : '#e4e4e7' } },
      splitLine: { lineStyle: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } },
      axisLabel: { color: '#71717a' },
    },
    series: [
      {
        name: 'Operações',
        type: 'scatter',
        symbolSize: (data) => Math.min(28, Math.max(8, data[2] / 4)),
        data: scatterData,
        itemStyle: {
          color: '#3b82f6',
          opacity: 0.8,
          borderColor: '#60a5fa',
          borderWidth: 1,
        }
      }
    ]
  };

  // Chart 2: Volume & Área Acumulada por Talhão
  const talhoesSummary = talhoes.map(t => {
    const pulvsT = pulverizacoes.filter(p => p.talhao === t.talhao);
    const totalArea = pulvsT.reduce((acc, p) => acc + p.area_aplicada_ha, 0);
    const totalVol = pulvsT.reduce((acc, p) => acc + p.volume_l, 0);
    return {
      talhao: `Talhão ${t.talhao}`,
      area_cadastrada: t.area_ha,
      area_aplicada: Number(totalArea.toFixed(1)),
      volume_calda: Math.round(totalVol),
      coberturas: Number((totalArea / t.area_ha).toFixed(1))
    };
  });

  const barOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? '#0c0c0f' : '#ffffff',
      borderColor: isDark ? '#1e1e24' : '#e4e4e7',
      textStyle: { color: isDark ? '#fafafa' : '#09090b', fontFamily: 'DM Sans, sans-serif' }
    },
    legend: {
      data: ['Área Aplicada (ha)', 'Volume Calda (L / 100)', 'Vezes Coberto (x)'],
      textStyle: { color: isDark ? '#a1a1aa' : '#71717a' },
      bottom: 0,
    },
    grid: { left: '4%', right: '4%', bottom: '12%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: talhoesSummary.map(t => t.talhao),
      axisLine: { lineStyle: { color: isDark ? '#27272a' : '#e4e4e7' } },
      axisLabel: { color: isDark ? '#fafafa' : '#09090b', fontWeight: 500 },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Área / Vol.',
        splitLine: { lineStyle: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } },
        axisLabel: { color: '#71717a' },
      },
      {
        type: 'value',
        name: 'Coberturas (x)',
        axisLine: { show: false },
        splitLine: { show: false },
        axisLabel: { color: '#10b981' },
      }
    ],
    series: [
      {
        name: 'Área Aplicada (ha)',
        type: 'bar',
        data: talhoesSummary.map(t => t.area_aplicada),
        itemStyle: { color: '#3b82f6', borderRadius: [4, 4, 0, 0] },
      },
      {
        name: 'Volume Calda (L / 100)',
        type: 'bar',
        data: talhoesSummary.map(t => Math.round(t.volume_calda / 100)),
        itemStyle: { color: '#06b6d4', borderRadius: [4, 4, 0, 0] },
      },
      {
        name: 'Vezes Coberto (x)',
        type: 'line',
        yAxisIndex: 1,
        data: talhoesSummary.map(t => t.coberturas),
        itemStyle: { color: '#10b981' },
        lineStyle: { width: 3 },
      }
    ]
  };

  // Chart 3: Monthly Spraying Window Breakdown
  const months = ['2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07'];
  const monthlyData = months.map(m => {
    const monthRows = analise.filter(a => a.data_calendario.startsWith(m) && a.houve_pulverizacao);
    const ideal = monthRows.filter(r => r.conformidade_operacao_clima === 'APLICADO_EM_JANELA_IDEAL').length;
    const alerta = monthRows.filter(r => r.conformidade_operacao_clima === 'APLICADO_SOB_ALERTA_CLIMATICO').length;
    const impropria = monthRows.filter(r => r.conformidade_operacao_clima === 'APLICADO_EM_CONDICAO_IMPROPRIA').length;
    return {
      month: m.split('-').reverse().join('/'),
      ideal,
      alerta,
      impropria,
    };
  });

  const monthlyOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: isDark ? '#0c0c0f' : '#ffffff',
      borderColor: isDark ? '#1e1e24' : '#e4e4e7',
      textStyle: { color: isDark ? '#fafafa' : '#09090b', fontFamily: 'DM Sans, sans-serif' }
    },
    legend: {
      data: ['Janela Ideal', 'Sob Alerta', 'Condição Imprópria'],
      textStyle: { color: isDark ? '#a1a1aa' : '#71717a' },
      bottom: 0,
    },
    grid: { left: '3%', right: '3%', bottom: '12%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: monthlyData.map(m => m.month),
      axisLine: { lineStyle: { color: isDark ? '#27272a' : '#e4e4e7' } },
      axisLabel: { color: '#71717a', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      name: 'Operações',
      splitLine: { lineStyle: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } },
      axisLabel: { color: '#71717a' },
    },
    series: [
      {
        name: 'Janela Ideal',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#10b981' },
        data: monthlyData.map(m => m.ideal),
      },
      {
        name: 'Sob Alerta',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#f59e0b' },
        data: monthlyData.map(m => m.alerta),
      },
      {
        name: 'Condição Imprópria',
        type: 'bar',
        stack: 'total',
        itemStyle: { color: '#ef4444' },
        data: monthlyData.map(m => m.impropria),
      }
    ]
  };

  return (
    <div className="space-y-6">
      
      {/* Row 1: Bar Chart (Volume & Cobertura por Talhão) */}
      <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500" />
              Cobertura e Volume Acumulado por Talhão (Safra 2025/2026)
            </h4>
            <p className="text-xs text-zinc-500">
              Comparativo de hectares pulverizados, litros aplicados e número de voltas completas em cada talhão.
            </p>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ReactECharts option={barOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* Row 2: 2 Column Split (Scatter + Monthly Stacked) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Scatter Chart */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
          <div>
            <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
              <ScatterChart className="w-4 h-4 text-cyan-500" />
              Dispersão: Dose Aplicada (L/ha) × Pressão (PSI)
            </h4>
            <p className="text-xs text-zinc-500">
              O tamanho da bolha reflete a área pulverizada no dia.
            </p>
          </div>
          <div className="h-[280px] w-full mt-2">
            <ReactECharts option={scatterOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Monthly Stacked Bar */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
          <div>
            <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              Distribuição Mensal da Conformidade de Pulverização
            </h4>
            <p className="text-xs text-zinc-500">
              Aplicações realizadas em janela Ideal, Alerta ou Imprópria mês a mês.
            </p>
          </div>
          <div className="h-[280px] w-full mt-2">
            <ReactECharts option={monthlyOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

      </div>

    </div>
  );
}
