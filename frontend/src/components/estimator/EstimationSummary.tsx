import React from 'react';
import { motion } from 'framer-motion';
import type { EstimationSummary as SummaryType } from '../../types';
import { Boxes, Weight, DollarSign, PieChart, TrendingUp, Sparkles, Scale } from 'lucide-react';

interface Props {
  summary: SummaryType;
}

export const EstimationSummary: React.FC<Props> = ({ summary }) => {
  const CARDS = [
    {
      title: 'Total Materials Count',
      value: `${summary.total_materials_count} items`,
      sub: 'Itemized takeoff items',
      icon: Boxes,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/70 border-blue-200 dark:border-blue-800'
    },
    {
      title: 'Total Estimated Weight',
      value: `${(summary.total_estimated_weight_kg / 1000).toFixed(1)} Tons`,
      sub: `${summary.total_estimated_weight_kg.toLocaleString()} kg total mass`,
      icon: Weight,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-800'
    },
    {
      title: 'Total Material Cost',
      value: `₹${summary.total_material_cost.toLocaleString()}`,
      sub: 'Direct takeoff allocation',
      icon: DollarSign,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800'
    },
    {
      title: 'Average Material Unit Cost',
      value: `₹${summary.average_material_cost.toLocaleString()}`,
      sub: 'Per item line allocation',
      icon: Scale,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-50 dark:bg-cyan-950/70 border-cyan-200 dark:border-cyan-800'
    },
    {
      title: 'Total Material Quantity',
      value: summary.total_estimated_quantity.toLocaleString(),
      sub: 'Calculated units',
      icon: PieChart,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-950/70 border-violet-200 dark:border-violet-800'
    },
    {
      title: 'Most Expensive Material',
      value: summary.most_expensive_material,
      sub: 'Highest line budget item',
      icon: TrendingUp,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800'
    },
    {
      title: 'Largest Quantity Material',
      value: summary.largest_quantity_material,
      sub: 'Highest bulk volume',
      icon: Sparkles,
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/70 border-teal-200 dark:border-teal-800'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
      {CARDS.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-2xl border ${card.bg}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>

              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3 line-clamp-1">
                {card.value}
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {card.sub}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
