import React from 'react';
import { AlertTriangle, ShieldAlert, CheckSquare } from 'lucide-react';

interface RiskItem {
  risk: string;
  level: string;
  impact: string;
  mitigation: string;
}

interface Props {
  risks: RiskItem[];
}

export const RiskAnalysisMatrix: React.FC<Props> = ({ risks }) => {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4 font-sans">
      <div>
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-500" /> Project Risk Analysis Matrix
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Probability, financial impact, and mitigation protocols</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {risks.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> {item.risk}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 border border-amber-200">
                Level: {item.level}
              </span>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Impact: <span className="font-bold text-slate-900 dark:text-white">{item.impact}</span>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200/60 dark:border-slate-700 flex items-start gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
              <span>Mitigation: {item.mitigation}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
