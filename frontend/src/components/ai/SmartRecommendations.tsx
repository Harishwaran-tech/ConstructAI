import React from 'react';
import type { AIRecommendation } from '../../types';
import { Lightbulb, DollarSign, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface Props {
  recommendations: AIRecommendation[];
}

export const SmartRecommendations: React.FC<Props> = ({ recommendations }) => {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4 font-sans">
      <div>
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" /> Smart Engineering Recommendations
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Actionable budget, material alternative, and procurement optimizations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-50 dark:bg-blue-950 text-blue-600 uppercase">
                  {rec.category}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <DollarSign className="w-3 h-3" /> Save ~${rec.estimated_savings.toLocaleString()}
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">{rec.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{rec.description}</p>
            </div>

            {rec.mitigation_step && (
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 text-[11px] text-slate-500 font-medium flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Action: {rec.mitigation_step}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
