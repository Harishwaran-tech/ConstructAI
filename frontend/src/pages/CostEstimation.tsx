import React, { useState } from 'react';
import { DollarSign, PieChart, TrendingUp, ShieldCheck, Calculator, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CostEstimation: React.FC = () => {
  const [builtUpArea, setBuiltUpArea] = useState<number>(2000);
  const [qualityGrade, setQualityGrade] = useState<string>('Standard');
  const [floors, setFloors] = useState<number>(2);

  // Cost estimates per sq ft based on grade:
  // Economy: $80/sqft, Standard: $120/sqft, Premium: $175/sqft
  const ratePerSqFt = qualityGrade === 'Economy' ? 80 : qualityGrade === 'Standard' ? 120 : 175;
  const totalCost = builtUpArea * ratePerSqFt;

  const laborCost = roundCost(totalCost * 0.35);
  const materialCost = roundCost(totalCost * 0.52);
  const equipmentCost = roundCost(totalCost * 0.13);

  function roundCost(val: number) {
    return Math.round(val);
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-emerald-600" /> Cost Estimation & Financial Forecasting
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Macro project budget forecasting, structural phase split, labor vs material breakdown.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <h2 className="font-bold text-base text-slate-900 dark:text-white">Project Cost Parameters</h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Built-Up Area (sq ft)</label>
            <input
              type="number"
              value={builtUpArea}
              onChange={(e) => setBuiltUpArea(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Specification Tier</label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              >
                <option value="Economy">Economy ($80/sqft)</option>
                <option value="Standard">Standard ($120/sqft)</option>
                <option value="Premium">Premium ($175/sqft)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Number of Stories</label>
              <input
                type="number"
                min="1"
                value={floors}
                onChange={(e) => setFloors(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">Total Project Projection</span>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  ${totalCost.toLocaleString()}
                </div>
              </div>
              <Link
                to="/estimator"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                Detailed BOQ <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                <div className="text-xs text-blue-600 font-semibold">Materials (52%)</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">${materialCost.toLocaleString()}</div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
                <div className="text-xs text-indigo-600 font-semibold">Labor (35%)</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">${laborCost.toLocaleString()}</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                <div className="text-xs text-emerald-600 font-semibold">Equipment (13%)</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">${equipmentCost.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
