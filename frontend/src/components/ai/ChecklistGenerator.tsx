import React, { useState } from 'react';
import type { ChecklistCategory } from '../../types';
import { CheckSquare, Square, ShieldCheck, Download } from 'lucide-react';

interface Props {
  checklists: ChecklistCategory[];
}

export const ChecklistGenerator: React.FC<Props> = ({ checklists }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [localChecklists, setLocalChecklists] = useState(checklists);

  const toggleCheck = (catIdx: number, itemId: string) => {
    const updated = [...localChecklists];
    const cat = updated[catIdx];
    cat.items = cat.items.map((i) => (i.id === itemId ? { ...i, completed: !i.completed } : i));
    setLocalChecklists(updated);
  };

  const currentCat = localChecklists[activeTab] || localChecklists[0];

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> Automated Site Execution Checklists
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Quality assurance, structural compliance, and worker safety protocols</p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          {localChecklists.map((c, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === idx
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {c.category}
            </button>
          ))}
        </div>
      </div>

      {currentCat && (
        <div className="space-y-2 pt-2">
          {currentCat.items.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(activeTab, item.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                item.completed
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-slate-500 line-through'
                  : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.completed ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className="font-semibold">{item.title}</span>
              </div>

              {item.mandatory && (
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-red-50 dark:bg-red-950 text-red-600 border border-red-200">
                  Mandatory
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
