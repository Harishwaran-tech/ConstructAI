import React, { useState } from 'react';
import type { ReportItem } from '../../types';
import { reportsAPI } from '../../services/api';
import { Search, Download, Mail, Trash2, Copy, FileText, Clock } from 'lucide-react';

interface Props {
  reports: ReportItem[];
  onRefresh: () => void;
  onEmail: (report: ReportItem) => void;
}

export const ReportHistoryTable: React.FC<Props> = ({ reports, onRefresh, onEmail }) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = reports.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.report_type.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || r.report_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleDownload = async (reportId: number, title: string) => {
    try {
      const blob = await reportsAPI.download(reportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '_')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDuplicate = async (id: number) => {
    await reportsAPI.duplicate(id);
    onRefresh();
  };

  const handleDelete = async (id: number) => {
    await reportsAPI.delete(id);
    onRefresh();
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Report History Archive</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">All previously generated official documents and export logs</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
              <th className="py-3 px-4">Document Title</th>
              <th className="py-3 px-4">Report Type</th>
              <th className="py-3 px-4">Format</th>
              <th className="py-3 px-4">Size</th>
              <th className="py-3 px-4">Generated Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{r.title}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-50 dark:bg-blue-950 text-blue-600">
                    {r.report_type}
                  </span>
                </td>
                <td className="py-3.5 px-4 uppercase font-bold text-[10px] text-slate-500">{r.file_format}</td>
                <td className="py-3.5 px-4 font-mono text-slate-500">{r.file_size_kb} KB</td>
                <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleDownload(r.id, r.title)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Download File"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEmail(r)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Email Report"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(r.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Duplicate Report"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
