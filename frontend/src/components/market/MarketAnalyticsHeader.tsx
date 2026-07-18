import React from 'react';
import { motion } from 'framer-motion';
import type { MarketAnalytics } from '../../types';
import { TrendingUp, TrendingDown, Sparkles, DollarSign, Activity, Lightbulb } from 'lucide-react';

interface Props {
  analytics: MarketAnalytics;
}

export const MarketAnalyticsHeader: React.FC<Props> = ({ analytics }) => {
  return (
    <div className="space-y-6 font-sans">
      {/* 4 Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Avg Cement Rate</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">${analytics.avg_cement_price} <span className="text-xs font-normal text-slate-400">/ 50kg Bag</span></div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> Stable spot rate
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Avg Steel TMT Rate</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">${analytics.avg_steel_price} <span className="text-xs font-normal text-slate-400">/ kg</span></div>
          <div className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +2.15% weekly surge
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Market Price Index</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{analytics.market_price_index}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            +{analytics.weekly_change_pct}% week • +{analytics.monthly_change_pct}% month
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Top Price Mover</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-white truncate">
            {analytics.top_rising[0]?.name || 'Copper Wires'}
          </div>
          <div className="text-[11px] text-amber-600 font-bold">
            {analytics.top_rising[0]?.pct} ({analytics.top_rising[0]?.price})
          </div>
        </div>
      </div>

      {/* AI Market Insights Cards */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 text-white shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
            <Sparkles className="w-4 h-4 text-blue-300 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">ConstructAI Market Copilot Insights</h3>
            <p className="text-xs text-blue-200">Algorithmic purchase recommendations & price index forecasts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {analytics.ai_insights.map((tip, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-100 leading-relaxed">{tip}</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                Action Recommendation &rarr;
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
