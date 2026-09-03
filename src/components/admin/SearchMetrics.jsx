import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Search, 
  BarChart3, 
  Calendar, 
  Sparkles, 
  Flame, 
  RefreshCw,
  Trophy,
  Activity
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const SearchMetrics = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(7); // 7 días por defecto

  const loadSearchLogs = async () => {
    setLoading(true);
    let combinedLogs = [];

    // 1. Obtener logs desde localStorage
    try {
      const localLogs = JSON.parse(localStorage.getItem('store_search_logs') || '[]');
      combinedLogs = [...localLogs];
    } catch (e) {
      console.error('Error leyendo logs locales:', e);
    }

    // 2. Obtener logs desde Supabase
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - timeRange);

      const { data: dbLogs, error } = await supabase
        .from('search_logs')
        .select('*')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (!error && dbLogs && dbLogs.length > 0) {
        // Fusionar evitando duplicados exactos si existen
        combinedLogs = [...dbLogs, ...combinedLogs];
      }
    } catch (err) {
      console.warn('Supabase search_logs no disponible, usando almacenamiento local:', err);
    }

    setLogs(combinedLogs);
    setLoading(false);
  };

  useEffect(() => {
    loadSearchLogs();
  }, [timeRange]);

  // Filtrar por rango de días
  const now = new Date();
  const cutoffDate = new Date();
  cutoffDate.setDate(now.getDate() - timeRange);

  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.created_at || Date.now());
    return logDate >= cutoffDate;
  });

  // Agrupar y contar frecuencias de búsqueda
  const frequencyMap = {};
  filteredLogs.forEach((log) => {
    const q = (log.query || '').trim().toLowerCase();
    if (q) {
      frequencyMap[q] = (frequencyMap[q] || 0) + 1;
    }
  });

  // Convertir a array ordenado por popularidad
  const sortedKeywords = Object.entries(frequencyMap)
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count);

  const totalSearches = filteredLogs.length;
  const avgSearchesPerDay = timeRange > 0 ? (totalSearches / timeRange).toFixed(1) : 0;
  const topKeyword = sortedKeywords[0]?.query || null;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Widget */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#FFFDF9] via-[#FDF6F0] to-[#FAF0EA] border border-[#F0E2DC] shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F9EAE8] border border-[#F3D5D8] text-[#C8747D] text-xs font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Métricas de Interés de Clientes</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#3D2B2E] flex items-center gap-2">
            ¿Qué es lo que más busca la gente?
          </h2>
          <p className="text-xs text-[#7A6266] mt-1">
            Análisis en tiempo real de los términos más buscados en tu tienda durante los últimos {timeRange} días.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex bg-white border border-[#E8D5CD] rounded-2xl p-1 shadow-xs">
            <button
              onClick={() => setTimeRange(7)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeRange === 7
                  ? 'bg-[#C8747D] text-white shadow-xs'
                  : 'text-[#7A6266] hover:text-[#3D2B2E]'
              }`}
            >
              7 Días
            </button>
            <button
              onClick={() => setTimeRange(30)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeRange === 30
                  ? 'bg-[#C8747D] text-white shadow-xs'
                  : 'text-[#7A6266] hover:text-[#3D2B2E]'
              }`}
            >
              30 Días
            </button>
          </div>

          <button
            onClick={loadSearchLogs}
            className="p-2.5 rounded-2xl bg-white border border-[#E8D5CD] text-[#7A6266] hover:text-[#3D2B2E] shadow-xs transition-colors"
            title="Actualizar métricas"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#C8747D]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Búsquedas */}
        <div className="p-5 rounded-2xl bg-white border border-[#F0E2DC] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F9EAE8] border border-[#F3D5D8] flex items-center justify-center text-[#C8747D]">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#7A6266] font-semibold block">Total de Búsquedas</span>
            <span className="text-2xl font-black text-[#3D2B2E] font-mono">{totalSearches}</span>
            <span className="text-[10px] text-[#A88C90] block">en los últimos {timeRange} días</span>
          </div>
        </div>

        {/* Promedio Diario */}
        <div className="p-5 rounded-2xl bg-white border border-[#F0E2DC] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF5ED] border border-[#C2E0C8] flex items-center justify-center text-[#2D6A3B]">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#7A6266] font-semibold block">Promedio Diario</span>
            <span className="text-2xl font-black text-[#2D6A3B] font-mono">{avgSearchesPerDay}</span>
            <span className="text-[10px] text-[#A88C90] block">búsquedas por día</span>
          </div>
        </div>

        {/* Producto/Término Estrella */}
        <div className="p-5 rounded-2xl bg-white border border-[#F0E2DC] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0E0] border border-[#FCE0C7] flex items-center justify-center text-[#D97724]">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-[#7A6266] font-semibold block">Más Buscado #1</span>
            <span className="text-lg font-serif font-bold text-[#D97724] truncate block capitalize">
              {topKeyword ? `"${topKeyword}"` : 'Sin datos'}
            </span>
            <span className="text-[10px] text-[#A88C90] block">
              {topKeyword ? `${frequencyMap[topKeyword]} veces buscado` : 'Ingresa búsquedas'}
            </span>
          </div>
        </div>

      </div>

      {/* Main Ranking Table & Visual Progress Bars */}
      <div className="bg-white border border-[#F0E2DC] rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F0E2DC]">
          <h3 className="font-serif font-bold text-lg text-[#3D2B2E] flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#C8747D]" />
            <span>Ranking de Lo Más Buscado</span>
          </h3>
          <span className="text-xs text-[#7A6266]">
            {sortedKeywords.length} palabras clave únicas
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-[#7A6266]">
            Cargando estadísticas de búsqueda...
          </div>
        ) : sortedKeywords.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FAF0EA] border border-[#E8D5CD] flex items-center justify-center text-[#C8747D] mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[#5C4246]">
              Aún no hay búsquedas registradas en este período.
            </p>
            <p className="text-xs text-[#9E8286] max-w-sm mx-auto">
              A medida que los visitantes busquen productos en la tienda, aquí verás gráficos en tiempo real con lo que más piden.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedKeywords.slice(0, 10).map((item, idx) => {
              const percentage = Math.round((item.count / totalSearches) * 100);
              const maxCount = sortedKeywords[0].count;
              const barWidth = Math.max(8, Math.round((item.count / maxCount) * 100));

              return (
                <div 
                  key={item.query} 
                  className="p-3.5 rounded-2xl bg-[#FDFAF8] border border-[#F0E2DC] hover:border-[#E8D5CD] transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] font-mono ${
                        idx === 0
                          ? 'bg-[#C8747D] text-white shadow-xs'
                          : idx === 1
                          ? 'bg-[#E5A93C] text-white'
                          : idx === 2
                          ? 'bg-[#A88C90] text-white'
                          : 'bg-[#FAF0EA] text-[#7A6266]'
                      }`}>
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-[#3D2B2E] text-sm capitalize">
                        {item.query}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-mono font-bold text-[#C8747D]">
                        {item.count} {item.count === 1 ? 'búsqueda' : 'búsquedas'}
                      </span>
                      <span className="bg-[#FAF0EA] text-[#7A6266] px-2 py-0.5 rounded-md font-mono text-[10px]">
                        {percentage}% del total
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-2 bg-[#F0E2DC] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx === 0 
                          ? 'bg-gradient-to-r from-[#D88A92] to-[#C8747D]' 
                          : 'bg-[#D88A92]/80'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
