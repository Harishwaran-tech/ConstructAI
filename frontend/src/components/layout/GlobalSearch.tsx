import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Building2, Layers, FileText, MapPin, Activity } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const SEARCH_RESULTS = [
    { title: 'Austin Commercial Facility', category: 'Project', url: '/projects/1', icon: Building2 },
    { title: 'UltraTech PPC Cement', category: 'Material', url: '/estimator?projectId=1', icon: Layers },
    { title: 'Bill of Quantities (BOQ) PDF', category: 'Report', url: '/reports', icon: FileText },
    { title: 'Austin Central Building Materials', category: 'Supplier', url: '/suppliers', icon: MapPin },
    { title: 'Tata Tiscon 550SD Live Spot Rate', category: 'Market Rate', url: '/brands', icon: Activity }
  ];

  const filtered = SEARCH_RESULTS.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-start justify-center pt-20 p-4 font-sans">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search projects, materials, reports, suppliers, prices..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600"
          />
          <button onClick={onClose} className="absolute right-3 top-3 text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1 max-h-64 overflow-y-auto">
          {filtered.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => {
                  navigate(item.url);
                  onClose();
                }}
                className="p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-semibold text-slate-900 dark:text-white">{item.title}</span>
                </div>
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {item.category}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
