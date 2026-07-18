import React, { useState, useEffect } from 'react';
import { estimationsAPI } from '../services/api';
import type { Estimation } from '../types';
import { History, Calculator, Calendar, Trash2, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProjectHistory: React.FC = () => {
  const [estimations, setEstimations] = useState<Estimation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEstimations = async () => {
    try {
      const data = await estimationsAPI.list();
      setEstimations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimations();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Delete this historical calculation?')) {
      await estimationsAPI.delete(id);
      fetchEstimations();
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <History className="w-6 h-6 text-indigo-600" /> Estimation Audit & Project History
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Complete log of saved civil engineering material estimations, quantities, and cost audits.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-slate-500">Loading calculation history...</div>
      ) : estimations.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-sm text-slate-500">
          No historical calculations recorded yet.
        </div>
      ) : (
        <div className="space-y-4">
          {estimations.map((est) => (
            <div key={est.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-50 dark:bg-blue-950 text-blue-600 uppercase">
                    {est.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {new Date(est.created_at).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{est.title}</h3>
                {est.notes && <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{est.notes}</p>}
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Total Calculated</div>
                  <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                    ${est.total_estimated_cost?.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/reports"
                    className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                    title="Generate BOQ Report"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(est.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
