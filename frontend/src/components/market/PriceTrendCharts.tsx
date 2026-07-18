import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  AreaChart, 
  Area 
} from 'recharts';
import { marketAPI } from '../../services/api';
import type { MarketAnalytics } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  analytics: MarketAnalytics;
}

export const PriceTrendCharts: React.FC<Props> = ({ analytics }) => {
  const [timeframe, setTimeframe] = useState('30D');
  const [historyData, setHistoryData] = useState<any[]>([]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    marketAPI.getHistory(timeframe).then(setHistoryData);
  }, [timeframe]);

  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const tooltipStyle = {
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
    borderColor: isDark ? '#1e293b' : '#e2e8f0',
    color: isDark ? '#f8fafc' : '#0f172a',
    borderRadius: '12px',
    fontSize: '11px',
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Timeframe Selector & Main Price Trend Line Chart */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Historical Spot Price Indices</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Track Steel TMT, Cement, and Aggregates unit rate curves</p>
          </div>

          {/* Timeframe Toggles */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            {['7D', '30D', '3M', '6M', '1Y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeframe === tf
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" stroke={axisColor} tick={{ fontSize: 10 }} />
              <YAxis stroke={axisColor} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="Steel" stroke="#2563eb" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="Cement" stroke="#10b981" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="Sand" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Rising vs Top Falling Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Top Price Increases (Weekly)</h3>
          <div className="space-y-3">
            {analytics.top_rising.map((item, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">{item.name}</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{item.pct} ({item.price})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Top Price Decreases (Weekly)</h3>
          <div className="space-y-3">
            {analytics.top_falling.map((item, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">{item.name}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.pct} ({item.price})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
