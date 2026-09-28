import React, { useState, useMemo } from 'react';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Search, Filter, X, Droplets, Gauge, ShieldAlert, CheckCircle2, AlertTriangle, AlertOctagon, Layers, Wind, Thermometer, CloudRain, Clock } from 'lucide-react';

export default function SprayingTable({ data, selectedTalhao, setSelectedTalhao }) {
  const { analise } = data;

  // Filter only actual spraying events
  const allPulvs = useMemo(() => {
    return analise.filter(a => a.houve_pulverizacao);
  }, [analise]);

  const [filterTalhao, setFilterTalhao] = useState(selectedTalhao || '');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const rowsPerPage = 15;

  const [activeRow, setActiveRow] = useState(null);

  // Filtered rows
  const filtered = useMemo(() => {
    return allPulvs.filter(r => {
      if (filterTalhao && r.talhao !== filterTalhao) return false;
      if (filterStatus && r.conformidade_operacao_clima !== filterStatus) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const dateFormatted = r.data_calendario.split('-').reverse().join('/');
        if (!r.talhao.includes(term) && !r.data_calendario.includes(term) && !dateFormatted.includes(term) && !r.motivo_condicao_climatica.toLowerCase().includes(term)) {
          return false;
        }
      }
      return true;
    });
  }, [allPulvs, filterTalhao, filterStatus, searchTerm]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const displayedRows = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const getStatusBadge = (conf) => {
    switch (conf) {
      case 'APLICADO_EM_JANELA_IDEAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" /> Ideal
          </span>
        );
      case 'APLICADO_SOB_ALERTA_CLIMATICO':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-3 h-3" /> Alerta
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <AlertOctagon className="w-3 h-3" /> Imprópria
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Table Toolbar */}
      <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por talhão, data ou motivo..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#131316] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Talhão filter */}
          <select
            value={filterTalhao}
            onChange={(e) => { setFilterTalhao(e.target.value); setPage(0); }}
            className="text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#131316] text-zinc-900 dark:text-zinc-100 px-3 py-1.5 focus:outline-none"
          >
            <option value="">Todos os Talhões</option>
            {['11', '12', '27', '28', '44', '45'].map(t => (
              <option key={t} value={t}>Talhão {t}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }}
            className="text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#131316] text-zinc-900 dark:text-zinc-100 px-3 py-1.5 focus:outline-none"
          >
            <option value="">Todos os Status Climáticos</option>
            <option value="APLICADO_EM_JANELA_IDEAL">Janela Ideal</option>
            <option value="APLICADO_SOB_ALERTA_CLIMATICO">Sob Alerta</option>
            <option value="APLICADO_EM_CONDICAO_IMPROPRIA">Condição Imprópria</option>
          </select>
        </div>

        <div className="text-xs text-zinc-500 font-mono">
          Exibindo <strong>{filtered.length}</strong> de 110 operações registradas
        </div>

      </div>

      {/* Main Content Split: Table (full or 2/3) + Details Slide Panel (1/3) */}
      <div className="flex gap-4 items-start">
        
        {/* Table Container */}
        <div className={`transition-all duration-300 ${activeRow ? 'w-full lg:w-2/3' : 'w-full'} bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-zinc-100/90 dark:bg-[#131316]/90 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-3">Data</th>
                  <th className="py-3 px-3">Talhão</th>
                  <th className="py-3 px-3">Área (ha)</th>
                  <th className="py-3 px-3">Taxa (L/ha)</th>
                  <th className="py-3 px-3">Volume (L)</th>
                  <th className="py-3 px-3">Pressão (PSI)</th>
                  <th className="py-3 px-3">Vento Diurno</th>
                  <th className="py-3 px-3">Temp. Diurna</th>
                  <th className="py-3 px-3">Janela Livre</th>
                  <th className="py-3 px-3">Conformidade Jacto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-800 dark:text-zinc-200">
                {displayedRows.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-zinc-400">
                      Nenhuma operação de pulverização encontrada com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  displayedRows.map((r, i) => {
                    const isSelected = activeRow?.data_calendario === r.data_calendario && activeRow?.talhao === r.talhao;
                    return (
                      <tr
                        key={`row-${r.talhao}-${r.data_calendario}-${i}`}
                        onClick={() => setActiveRow(isSelected ? null : r)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-950/60'
                            : 'hover:bg-zinc-50 dark:hover:bg-[#131316]'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-mono font-medium">
                          {r.data_calendario.split('-').reverse().join('/')}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-zinc-950 dark:text-zinc-100">Talhão {r.talhao}</span>
                          <span className="text-[10px] text-zinc-400 block font-mono">({r.pct_cobertura_talhao_dia}% coberto)</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-semibold">
                          {r.area_aplicada_ha} ha
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          {r.dose_l_ha}
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          {r.volume_l.toLocaleString('pt-BR')}
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          {r.pressao_psi}
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          {r.vento_10m_diurno_medio_kmh} km/h
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          {r.temp_diurna_media_c} °C
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold ${
                            r.horas_estimadas_janela_ideal_dia >= 6 
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400' 
                              : r.horas_estimadas_janela_ideal_dia > 0
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                          }`}>
                            {r.horas_estimadas_janela_ideal_dia}h
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          {getStatusBadge(r.conformidade_operacao_clima)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#0c0c0f]/50 flex items-center justify-between text-xs">
            <span className="text-zinc-500">
              Página <strong>{page + 1}</strong> de <strong>{Math.max(1, totalPages)}</strong>
            </span>

            <div className="flex items-center gap-1">
              <button
                disabled={page === 0}
                onClick={() => setPage(0)}
                className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Primeira página"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page === 0}
                onClick={() => setPage(p => Math.max(0, p - 1))}
                className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Próxima página"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(totalPages - 1)}
                className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Última página"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Investigation / Detail Slide-out Panel */}
        {activeRow && (
          <div className="w-full lg:w-1/3 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-lg space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Auditoria Operacional Detalhada
                </span>
                <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">
                  Talhão {activeRow.talhao} • {activeRow.data_calendario.split('-').reverse().join('/')}
                </h3>
              </div>
              <button
                onClick={() => setActiveRow(null)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Summary Banner */}
            <div className="p-3 rounded-lg border bg-zinc-50 dark:bg-[#131316] border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Status Agronômico:</span>
                {getStatusBadge(activeRow.conformidade_operacao_clima)}
              </div>
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mt-2">
                Motivo: <strong className="text-zinc-900 dark:text-zinc-100">{activeRow.motivo_condicao_climatica?.replace(/_/g, ' ')}</strong>
              </p>
            </div>

            {/* Spraying Telemetry */}
            <div>
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Telemetria da Pulverização</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-zinc-50 dark:bg-[#131316] p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-500 text-[10px] block">Área Pulverizada</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{activeRow.area_aplicada_ha} ha</span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">({activeRow.pct_cobertura_talhao_dia}% do talhão)</span>
                </div>
                <div className="bg-zinc-50 dark:bg-[#131316] p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-500 text-[10px] block">Volume Aplicado</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{activeRow.volume_l} L</span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">{activeRow.faixas} passadas</span>
                </div>
                <div className="bg-zinc-50 dark:bg-[#131316] p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-500 text-[10px] block">Taxa de Aplicação</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{activeRow.dose_l_ha} L/ha</span>
                </div>
                <div className="bg-zinc-50 dark:bg-[#131316] p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-500 text-[10px] block">Pressão Média</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{activeRow.pressao_psi} PSI</span>
                </div>
              </div>
            </div>

            {/* Weather Telemetry from WeatherNext 2 */}
            <div>
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Clima no Dia (WeatherNext 2)</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-zinc-50 dark:bg-[#131316] border border-zinc-200 dark:border-zinc-800">
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <Thermometer className="w-3.5 h-3.5 text-amber-500" /> Temp. Diurna (08-14h):
                  </span>
                  <span className="font-mono font-semibold">{activeRow.temp_diurna_media_c} °C</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-zinc-50 dark:bg-[#131316] border border-zinc-200 dark:border-zinc-800">
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <Wind className="w-3.5 h-3.5 text-cyan-500" /> Vento Diurno (10m):
                  </span>
                  <span className="font-mono font-semibold">{activeRow.vento_10m_diurno_medio_kmh} km/h</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-zinc-50 dark:bg-[#131316] border border-zinc-200 dark:border-zinc-800">
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <CloudRain className="w-3.5 h-3.5 text-blue-500" /> Chuva no Dia:
                  </span>
                  <span className="font-mono font-semibold">{activeRow.chuva_acumulada_dia_mm} mm</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-zinc-50 dark:bg-[#131316] border border-zinc-200 dark:border-zinc-800">
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" /> Janela Operacional Livre:
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {activeRow.horas_estimadas_janela_ideal_dia} horas livres
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedTalhao(activeRow.talhao);
                }}
                className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition-colors"
              >
                Filtrar Talhão {activeRow.talhao} no Mapa
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
