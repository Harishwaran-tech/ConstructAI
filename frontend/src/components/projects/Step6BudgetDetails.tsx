import React from 'react';
import type { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { DollarSign, PieChart, ShieldAlert } from 'lucide-react';

interface Step6Props {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}

export const Step6BudgetDetails: React.FC<Step6Props> = ({ register, watch, setValue }) => {
  const matBudget = watch('budget_details.material_budget') || 0;
  const labBudget = watch('budget_details.labour_budget') || 0;
  const miscBudget = watch('budget_details.misc_budget') || 0;
  const emergencyFund = watch('budget_details.emergency_fund') || 0;

  const totalCalculated = matBudget + labBudget + miscBudget + emergencyFund;

  React.useEffect(() => {
    if (totalCalculated > 0) {
      setValue('total_budget', totalCalculated);
      setValue('budget_details.estimated_budget', totalCalculated);
    }
  }, [totalCalculated, setValue]);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-600" /> Step 6: Budget Allocation & Financial Caps
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Define financial ceilings, material allocations, labor budgets, and contingency reserves.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Material Allocation Budget ($)</label>
          <input
            type="number"
            {...register('budget_details.material_budget', { valueAsNumber: true })}
            placeholder="110000"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Labour Allocation Budget ($)</label>
          <input
            type="number"
            {...register('budget_details.labour_budget', { valueAsNumber: true })}
            placeholder="60000"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Emergency Contingency Fund ($)</label>
          <input
            type="number"
            {...register('budget_details.emergency_fund', { valueAsNumber: true })}
            placeholder="15000"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Miscellaneous & Permits ($)</label>
          <input
            type="number"
            {...register('budget_details.misc_budget', { valueAsNumber: true })}
            placeholder="15000"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Maximum Hard Cap Limit ($)</label>
          <input
            type="number"
            {...register('budget_details.max_budget', { valueAsNumber: true })}
            placeholder="220000"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex justify-between items-center text-xs">
        <div>
          <span className="font-bold text-slate-900 dark:text-white text-sm block">Total Estimated Project Budget</span>
          <span className="text-slate-500">Materials + Labour + Contingency + Permits</span>
        </div>
        <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
          ${totalCalculated.toLocaleString()}
        </div>
      </div>
    </div>
  );
};
