import React from 'react';
import type { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { Users, Clock, DollarSign } from 'lucide-react';

interface Step5Props {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}

const LABOUR_ROLES = [
  { key: 'engineers', label: 'Site Engineers' },
  { key: 'supervisors', label: 'Site Supervisors' },
  { key: 'masons', label: 'Masons' },
  { key: 'helpers', label: 'Unskilled Helpers' },
  { key: 'electricians', label: 'Electricians' },
  { key: 'plumbers', label: 'Plumbers' },
  { key: 'painters', label: 'Painters' },
  { key: 'carpenters', label: 'Carpenters & Formwork Shuttering' },
];

export const Step5LabourDetails: React.FC<Step5Props> = ({ register, watch, setValue }) => {
  const workingDays = watch('labour_details.expected_working_days') || 120;
  const dailyCost = watch('labour_details.daily_labour_cost') || 35;

  const totalWorkers = LABOUR_ROLES.reduce((acc, r) => {
    return acc + (watch(`labour_details.${r.key}`) || 0);
  }, 0);

  const estimatedTotalLabourCost = totalWorkers * workingDays * dailyCost;

  React.useEffect(() => {
    setValue('labour_details.total_labourers', totalWorkers);
  }, [totalWorkers, setValue]);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" /> Step 5: Labour Force & Execution Schedule
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Specify tradesmen headcount, site supervisors, working days, and wage rates.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {LABOUR_ROLES.map((r) => (
          <div key={r.key}>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">{r.label}</label>
            <input
              type="number"
              min="0"
              {...register(`labour_details.${r.key}`, { valueAsNumber: true })}
              placeholder="0"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Expected Working Days</label>
          <input
            type="number"
            min="1"
            {...register('labour_details.expected_working_days', { valueAsNumber: true })}
            placeholder="120"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Average Daily Wage ($ / day)</label>
          <input
            type="number"
            min="1"
            {...register('labour_details.daily_labour_cost', { valueAsNumber: true })}
            placeholder="35"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Summary Highlight */}
      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-between text-xs">
        <div>
          <div className="font-bold text-slate-900 dark:text-white">Total Labour Force: {totalWorkers} Workers</div>
          <div className="text-slate-500">Duration: {workingDays} days</div>
        </div>

        <div className="text-right">
          <div className="text-slate-400">Est. Total Labour Cost</div>
          <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">${estimatedTotalLabourCost.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};
