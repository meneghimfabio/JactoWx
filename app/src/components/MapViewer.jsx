import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Play, Pause, SkipBack, SkipForward, Calendar, Wind, Thermometer,
  CloudRain, Clock, AlertTriangle, CheckCircle2, AlertOctagon,
  Eye, EyeOff, Layers, MapPin
} from 'lucide-react';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom pin for WeatherNext points
const createCustomIcon = (label) => {
  return L.divIcon({
    className: 'custom-weather-marker',
    html: `
      <div style="
        background: #2563eb;
        color: white;
        border: 2px solid white;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 11px;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.4);
      ">${label}</div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

const weatherGrid = [
  { id: 'CELULA_NORTE_-54.00_-16.75', name: 'WeatherNext Norte (-54.00, -16.75)', lat: -16.75, lon: -54.00, label: 'N' },
  { id: 'CELULA_SUL_-54.00_-17.00', name: 'WeatherNext Sul (-54.00, -17.00)', lat: -17.00, lon: -54.00, label: 'S' }
];

// Google Maps Tile Providers
const GOOGLE_MAP_LAYERS = {
  hybrid: {
    name: 'Google Satélite Híbrido',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  },
  satellite: {
    name: 'Google Satélite Puro',
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  },
  terrain: {
    name: 'Google Relevo',
    url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  },
  roadmap: {
    name: 'Google Vetor',
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  }
};

function MapCenterController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapViewer({ data, selectedTalhao, setSelectedTalhao, isDark }) {
  const { talhoes = [], pulverizacoes = [], analise = [] } = data;

  const [googleLayerType, setGoogleLayerType] = useState('hybrid');
  const [showSwaths, setShowSwaths] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  // Timeline Playback
  const sprayingDates = [...new Set(pulverizacoes.map(p => p.data_operacao))].sort();
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentDate = sprayingDates[currentDateIndex] || '2025-09-17';
  const dayPulvs = pulverizacoes.filter(p => p.data_operacao === currentDate);
  const dayAnalise = analise.filter(a => a.data_calendario === currentDate);
  const weatherForDay = dayAnalise[0] || {};

  // Center of Fazenda Girassol
  const centerLat = -16.866;
  const centerLon = -54.057;

  // Playback timer
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentDateIndex(prev => {
          if (prev >= sprayingDates.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, sprayingDates.length]);

  // Talhão style
  const getTalhaoStyle = (talhaoNum) => {
    const isSelected = selectedTalhao === talhaoNum;
    const isSprayingToday = dayPulvs.some(p => p.talhao === talhaoNum);

    return {
      fillColor: isSelected ? '#3b82f6' : isSprayingToday ? '#10b981' : '#ffffff',
      fillOpacity: isSelected ? 0.45 : isSprayingToday ? 0.35 : 0.08,
      color: isSelected ? '#93c5fd' : isSprayingToday ? '#34d399' : '#f4f4f5',
      weight: isSelected ? 3.5 : isSprayingToday ? 2.5 : 1.5,
      dashArray: isSprayingToday ? null : '3',
    };
  };

  const swathStyle = {
    fillColor: '#06b6d4',
    fillOpacity: 0.65,
    color: '#22d3ee',
    weight: 1.2,
  };

  const statusColor = weatherForDay.status_janela_pulverizacao_dia === 'IDEAL'
    ? 'text-emerald-400 bg-emerald-950/70 border-emerald-800'
    : weatherForDay.status_janela_pulverizacao_dia === 'ALERTA'
    ? 'text-amber-400 bg-amber-950/70 border-amber-800'
    : 'text-rose-400 bg-rose-950/70 border-rose-800';

  const activeLayer = GOOGLE_MAP_LAYERS[googleLayerType] || GOOGLE_MAP_LAYERS.hybrid;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      
      {/* Map Column (8 cols) */}
      <div className="lg:col-span-8 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col">
        
        {/* Top Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">
                Google Maps • Limites dos Talhões & Passadas Efetivas
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40">
                Google Maps Satellite
              </span>
            </div>
            <p className="text-xs text-zinc-500">Fazenda Girassol • Itiquira / Rondonópolis - MT</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Google Maps Layer Type Buttons */}
            <div className="flex items-center bg-zinc-100 dark:bg-[#131316] p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium">
              <button
                onClick={() => setGoogleLayerType('hybrid')}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                  googleLayerType === 'hybrid'
                    ? 'bg-white dark:bg-[#1e1e24] text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                Google Satélite Híbrido
              </button>
              <button
                onClick={() => setGoogleLayerType('satellite')}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                  googleLayerType === 'satellite'
                    ? 'bg-white dark:bg-[#1e1e24] text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                Satélite Puro
              </button>
              <button
                onClick={() => setGoogleLayerType('terrain')}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                  googleLayerType === 'terrain'
                    ? 'bg-white dark:bg-[#1e1e24] text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                Relevo
              </button>
              <button
                onClick={() => setGoogleLayerType('roadmap')}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                  googleLayerType === 'roadmap'
                    ? 'bg-white dark:bg-[#1e1e24] text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                Vetor
              </button>
            </div>

            {/* Layer toggles */}
            <button
              onClick={() => setShowSwaths(!showSwaths)}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                showSwaths
                  ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border-cyan-300 dark:border-cyan-800'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700'
              }`}
              title="Alternar camada de passadas do pulverizador"
            >
              {showSwaths ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              Faixas ({dayPulvs.length})
            </button>
          </div>
        </div>

        {/* Leaflet Map Container with Google Maps Tiles */}
        <div className="w-full h-[520px] rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 relative bg-[#0c0c0f]">
          <MapContainer
            center={[centerLat, centerLon]}
            zoom={12}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <MapCenterController center={[centerLat, centerLon]} zoom={12} />
            
            {/* Google Maps Layer */}
            <TileLayer
              key={`google-tile-${googleLayerType}`}
              url={activeLayer.url}
              attribution='&copy; Google Maps'
              maxZoom={activeLayer.maxZoom}
              subdomains={activeLayer.subdomains}
            />

            {/* Talhões Polygons */}
            {talhoes.map(t => (
              <GeoJSON
                key={`talhao-${t.talhao}-${selectedTalhao}-${currentDate}`}
                data={t.geojson}
                style={() => getTalhaoStyle(t.talhao)}
                eventHandlers={{
                  click: () => setSelectedTalhao(selectedTalhao === t.talhao ? null : t.talhao),
                }}
              >
                <Popup>
                  <div className="p-1 text-xs">
                    <p className="font-bold text-sm text-blue-400">Talhão {t.talhao}</p>
                    <p className="text-zinc-300 mt-1">Área Oficial: <strong className="text-white">{t.area_ha} ha</strong></p>
                    <p className="text-zinc-400 text-[10px]">ID Field: {t.id_field}</p>
                    <p className="text-zinc-400 text-[10px]">Vigência: {t.valido_de} a {t.valido_ate}</p>
                  </div>
                </Popup>
              </GeoJSON>
            ))}

            {/* Spraying Swaths for the selected day */}
            {showSwaths && dayPulvs.map((p, idx) => (
              <GeoJSON
                key={`swath-${p.talhao}-${p.data_operacao}-${idx}`}
                data={p.geojson}
                style={swathStyle}
              >
                <Popup>
                  <div className="p-1 text-xs">
                    <p className="font-bold text-cyan-400">Passada Efetiva • Talhão {p.talhao}</p>
                    <p className="text-zinc-300">Data: {p.data_operacao.split('-').reverse().join('/')}</p>
                    <p className="text-zinc-300">Área Aplicada: <strong>{p.area_aplicada_ha} ha</strong></p>
                    <p className="text-zinc-300">Taxa: <strong>{p.dose_l_ha} L/ha</strong> | Calda: {p.volume_l} L</p>
                    <p className="text-zinc-300">Pressão: {p.pressao_psi} PSI | Faixas: {p.faixas}</p>
                  </div>
                </Popup>
              </GeoJSON>
            ))}

            {/* WeatherNext 2 Grid Points */}
            {showGrid && weatherGrid.map(pt => (
              <Marker
                key={pt.id}
                position={[pt.lat, pt.lon]}
                icon={createCustomIcon(pt.label)}
              >
                <Popup>
                  <div className="p-1 text-xs">
                    <strong className="text-blue-400">{pt.name}</strong>
                    <p className="text-zinc-300 text-[11px] mt-1">Grade WeatherNext 2 de 0,25°</p>
                    <p className="text-zinc-400 text-[10px]">64 Membros de Ensemble</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Floating Day Weather Overlay */}
          <div className="absolute top-3 right-3 z-[1000] bg-white/95 dark:bg-[#0c0c0f]/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 shadow-xl max-w-[250px]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                {currentDate.split('-').reverse().join('/')}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${statusColor}`}>
                {weatherForDay.status_janela_pulverizacao_dia || 'DESCONHECIDO'}
              </span>
            </div>
            
            <div className="mt-2.5 space-y-1.5 text-[11px] text-zinc-600 dark:text-zinc-300">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-zinc-500"><Thermometer className="w-3.5 h-3.5 text-amber-500" /> Temp. Diurna:</span>
                <span className="font-mono font-semibold">{weatherForDay.temp_diurna_media_c || weatherForDay.temp_media_dia_c || '--'} °C</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-zinc-500"><Wind className="w-3.5 h-3.5 text-cyan-500" /> Vento Diurno:</span>
                <span className="font-mono font-semibold">{weatherForDay.vento_10m_diurno_medio_kmh || weatherForDay.vento_10m_medio_dia_kmh || '--'} km/h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-zinc-500"><CloudRain className="w-3.5 h-3.5 text-blue-500" /> Chuva no Dia:</span>
                <span className="font-mono font-semibold">{weatherForDay.chuva_acumulada_dia_mm ?? '--'} mm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-zinc-500"><Clock className="w-3.5 h-3.5 text-emerald-500" /> Janela Ideal:</span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">{weatherForDay.horas_estimadas_janela_ideal_dia ?? '--'} h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Playback Scrubber */}
        <div className="mt-3 bg-zinc-50 dark:bg-[#131316] border border-zinc-200 dark:border-zinc-800 rounded-lg p-3">
          <div className="flex items-center justify-between gap-3">
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDateIndex(prev => Math.max(0, prev - 1))}
                className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                title="Dia anterior"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlaying ? 'Pausar' : 'Playback Safra'}
              </button>
              <button
                onClick={() => setCurrentDateIndex(prev => Math.min(sprayingDates.length - 1, prev + 1))}
                className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                title="Próximo dia"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 px-4">
              <input
                type="range"
                min="0"
                max={sprayingDates.length - 1}
                value={currentDateIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCurrentDateIndex(Number(e.target.value));
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="text-zinc-500 font-sans">Data:</span>
              <span className="px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-800">{currentDate.split('-').reverse().join('/')}</span>
              <span className="text-zinc-400 text-[11px]">({currentDateIndex + 1}/{sprayingDates.length})</span>
            </div>

          </div>
        </div>

      </div>

      {/* Side Information Panel (4 cols) */}
      <div className="lg:col-span-4 space-y-4">
        
        {/* Selected Day Operations Card */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Aplicações na Data</h4>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono mt-0.5">
                {currentDate.split('-').reverse().join('/')}
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
              {dayPulvs.length} {dayPulvs.length === 1 ? 'talhão aplicado' : 'talhões aplicados'}
            </span>
          </div>

          <div className="mt-3 space-y-3">
            {dayPulvs.length === 0 ? (
              <div className="text-center py-8 text-zinc-400 text-xs">
                Nenhuma aplicação registrada com barra aberta nesta data.
              </div>
            ) : (
              dayPulvs.map(p => (
                <div
                  key={`day-pulv-${p.talhao}`}
                  onClick={() => setSelectedTalhao(p.talhao)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedTalhao === p.talhao
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-blue-500'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#131316]/50 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-zinc-950 dark:text-zinc-50">Talhão {p.talhao}</span>
                    <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {p.pct_cobertura_talhao_dia}% coberto
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div>
                      <span className="text-zinc-500 text-[10px] block">Área Aplicada</span>
                      <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">{p.area_aplicada_ha} ha</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] block">Volume de Calda</span>
                      <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">{p.volume_l} L</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] block">Taxa de Aplicação</span>
                      <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">{p.dose_l_ha} L/ha</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] block">Pressão</span>
                      <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">{p.pressao_psi} PSI</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Agronomic Conditions Card */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Diagnóstico Agronômico Jacto</h4>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
            {weatherForDay.motivo_condicao_climatica?.replace(/_/g, ' ') || 'Condições monitoradas pela estação WeatherNext 2'}
          </p>

          <div className="mt-3 p-3 rounded-lg bg-zinc-50 dark:bg-[#131316] border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Risco de Deriva (Vento &gt; 15 km/h):</span>
              <span className="font-mono font-semibold">{weatherForDay.prob_max_vento_deriva_pct ?? 0}% prob.</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Risco de Inversão Térmica (&lt; 3 km/h):</span>
              <span className="font-mono font-semibold">{weatherForDay.prob_max_vento_calmo_inversao_pct ?? 0}% prob.</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Risco de Evaporação (Temp &gt; 30°C):</span>
              <span className="font-mono font-semibold">{weatherForDay.prob_max_calor_evaporacao_pct ?? 0}% prob.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
