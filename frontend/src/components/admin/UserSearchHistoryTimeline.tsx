import React, { useState } from 'react';
import type { UserSearchHistory } from '../../types';
import { Search, Clock, MessageSquare, User, Filter, Cpu, Database, MapPin, Calculator } from 'lucide-react';

interface Props {
  history: UserSearchHistory[];
}

export const UserSearchHistoryTimeline: React.FC<Props> = ({ history }) => {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');

  const filtered = history.filter((h) => {
    const matchesSearch =
      (h.user_email && h.user_email.toLowerCase().includes(search.toLowerCase())) ||
      h.search_type.toLowerCase().includes(search.toLowerCase()) ||
      h.query.toLowerCase().includes(search.toLowerCase()) ||
      h.module.toLowerCase().includes(search.toLowerCase());

    const matchesMod = moduleFilter === 'All' || h.module === moduleFilter;

    return matchesSearch && matchesMod;
  });

  const getModuleIcon = (mod: string) => {
    switch (mod) {
      case 'AI Assistant':
        return <Cpu className="w-4 h-4 text-purple-500" />;
      case 'Nearby Suppliers':
        return <MapPin className="w-4 h-4 text-blue-500" />;
      case 'Estimator Engine':
        return <Calculator className="w-4 h-4 text-emerald-500" />;
      default:
        return <Search className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600" /> User Input & Search History Audit
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            SuperAdmin view tracking all user search queries, AI copilot prompts, and estimation inputs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search user queries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-900 dark:text-white"
          >
            <option value="All">Module: All</option>
            <option value="AI Assistant">AI Assistant</option>
            <option value="Nearby Suppliers">Nearby Suppliers</option>
            <option value="Estimator Engine">Estimator Engine</option>
            <option value="Admin System">Admin System</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No search or input activity records found matching your filters.</div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  {getModuleIcon(item.module)}
                  <span className="font-bold text-slate-900 dark:text-white">{item.search_type}</span>
                  <span className="px-2 py-0.5 text-[9px] font-extrabold rounded bg-purple-50 dark:bg-purple-950 text-purple-600 border border-purple-200 dark:border-purple-800 uppercase">
                    {item.module}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] leading-relaxed">
                  "{item.query}"
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1 sm:text-right font-mono shrink-0">
                <div className="flex items-center sm:justify-end gap-1.5 font-semibold text-slate-600 dark:text-slate-300">
                  <User className="w-3.5 h-3.5 text-blue-500" /> {item.user_email || 'Anonymous User'}
                </div>
                <div className="flex items-center sm:justify-end gap-1 text-slate-400">
                  <Clock className="w-3 h-3 text-slate-400" /> {new Date(item.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
