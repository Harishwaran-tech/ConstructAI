import React, { useState } from 'react';
import type { AuditLog } from '../../types';
import { ShieldCheck, Search, Clock, Activity, User, Globe } from 'lucide-react';

interface Props {
  logs: AuditLog[];
}

export const AuditLogTimeline: React.FC<Props> = ({ logs }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filtered = logs.filter((l) => {
    const matchesSearch =
      (l.user_email && l.user_email.toLowerCase().includes(search.toLowerCase())) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      (l.details && l.details.toLowerCase().includes(search.toLowerCase()));

    const matchesCat = categoryFilter === 'All' || l.category === categoryFilter;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" /> Platform Security & Audit Trail Logs
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Real-time immutable audit trail for compliance, role shifts, and data exports</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold"
          >
            <option value="All">Category: All</option>
            <option value="Security">Security</option>
            <option value="Users">Users</option>
            <option value="Projects">Projects</option>
            <option value="Reports">Reports</option>
            <option value="System">System</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {filtered.map((l) => (
          <div
            key={l.id}
            className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">{l.action}</span>
                <span className="px-2 py-0.5 text-[9px] font-extrabold rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 border border-indigo-200 uppercase">
                  {l.category}
                </span>
              </div>
              <p className="text-slate-500 font-medium">{l.details || 'System event recorded'}</p>
            </div>

            <div className="text-[11px] text-slate-400 space-y-0.5 sm:text-right font-mono">
              <div className="flex items-center sm:justify-end gap-1">
                <User className="w-3 h-3 text-slate-400" /> {l.user_email || 'System Bot'}
              </div>
              <div className="flex items-center sm:justify-end gap-1">
                <Globe className="w-3 h-3 text-slate-400" /> {l.ip_address || '127.0.0.1'} • {new Date(l.created_at).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
