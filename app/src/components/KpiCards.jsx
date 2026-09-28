import React from 'react';
import { Layers, Droplets, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

export default function KpiCards({ data, selectedTalhao }) {
  const { talhoes = [], pulverizacoes = [], analise = [] } = data || {};

  // Filter if talhao selected
  const activeTalhoes = selectedTalhao ? talhoes.filter(t => t.talhao === selectedTalhao) : talhoes;
  const activePulv = selectedTalhao ? pulverizacoes.filter(p => p.talhao === selectedTalhao) : pulverizacoes;

  // Defensive numeric sums
  const totalAreaCadastrada = activeTalhoes.reduce((acc, t) => acc + (Number(t.area_ha) || 0), 0);
  const totalAreaAplicada = activePulv.reduce((acc, p) => acc + (Number(p.area_aplicada_ha) || 0), 0);
  const totalVolume = activePulv.reduce((acc, p) => acc + (Number(p.volume_l) || 0), 0);
  const avgDose = totalAreaAplicada > 0 ? (totalVolume / totalAreaAplicada) : 0;
  const coberturas = totalAreaCadastrada > 0 ? (totalAreaAplicada / totalAreaCadastrada) : 0;

  // Conformity breakdown
  const activeAnalisePulv = analise.filter(a => a.houve_pulverizacao && (!selectedTalhao || a.talhao === selectedTalhao));
  const countIdeal = activeAnalisePulv.filter(a => a.status_janela_pulverizacao_dia === 'IDEAL').length;
  const countAlerta = activeAnalisePulv.filter(a => a.status_janela_pulverizacao_dia === 'ALERTA').length;
  const countImpropria = activeAnalisePulv.filter(a => a.status_janela_pulverizacao_dia === 'IMPROPRIA').length;
  const pctConforme = activeAnalisePulv.length ? Math.round(((countIdeal + countAlerta) / activeAnalisePulv.length) * 100) : 0;

  // Next Ideal Window from forecast
  const futureForecast = analise.filter(a => a.tipo_horizonte === 'PREVISAO_FUTURA_15D' && (!selectedTalhao || a.talhao === selectedTalhao));
  const nextIdeal = futureForecast.find(a => a.status_janela_pulverizacao_dia === 'IDEAL');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      
      {/* KPI 1: Área Cadastrada */}
      <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Área Cadastrada</span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 font-mono">
            {totalAreaCadastrada.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </span>
          <span className="text-xs font-semibold text-zinc-500">ha</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[10px] font-semibold text-zinc-700 dark:text-zinc-300">
            {activeTalhoes.length} {activeTalhoes.length === 1 ? 'talhão' : 'talhões'}
          </span>
          <span>vigência até 2200</span>
        </div>
      </div>

      {/* KPI 2: Área Aplicada & Coberturas */}
      <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Área Pulverizada</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 font-mono">
            {totalAreaAplicada.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </span>
          <span className="text-xs font-semibold text-zinc-500">ha</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px]">
          <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold text-[10px]">
            {coberturas.toFixed(1)}x coberturas
          </span>
          <span className="text-zinc-500 dark:text-zinc-400">{activePulv.length} operações</span>
        </div>
      </div>

      {/* KPI 3: Volume & Taxa Média */}
      <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Volume Total Calda</span>
          <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <Droplets className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 font-mono">
            {totalVolume.toLocaleString('pt-BR')}
          </span>
          <span className="text-xs font-semibold text-zinc-500">L</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span className="font-mono text-zinc-900 dark:text-zinc-200 font-semibold">{avgDose.toFixed(1)} L/ha</span>
          <span>taxa média</span>
        </div>
      </div>

      {/* KPI 4: Auditoria de Conformidade Climática */}
      <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Auditoria Meteorológica</span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 font-mono">
            {countAlerta + countIdeal}
            <span className="text-sm text-zinc-400 font-normal">/{activeAnalisePulv.length}</span>
          </span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {pctConforme}% operável
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1 text-[10px]">
          <span className="px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
            {countIdeal} Ideal
          </span>
          <span className="px-1 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
            {countAlerta} Alerta
          </span>
          <span className="px-1 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium">
            {countImpropria} Imprópria
          </span>
        </div>
      </div>

      {/* KPI 5: Próxima Janela Favorável */}
      <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-[#0c0c16] dark:to-[#0f1124] border border-blue-200 dark:border-blue-900/40 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">Próxima Janela Ideal</span>
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-xl font-bold tracking-tight text-blue-950 dark:text-blue-100 font-mono">
            {nextIdeal ? nextIdeal.data_calendario.split('-').reverse().slice(0, 2).join('/') : '30/09'}
          </span>
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
            {nextIdeal?.horas_estimadas_janela_ideal_dia || 18}h livres
          </span>
        </div>
        <div className="mt-2 text-[11px] text-blue-800 dark:text-blue-300 font-medium truncate">
          Vento ~8.7 km/h • 27.2°C • 0.8mm
        </div>
      </div>

    </div>
  );
}
