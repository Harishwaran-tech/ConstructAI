import React from 'react';
import { motion } from 'framer-motion';
import type { ProjectHealthScores } from '../../types';
import { ShieldCheck, PieChart, Activity, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

interface Props {
  scores: ProjectHealthScores;
}

export const ProjectHealthBanner: React.FC<Props> = ({ scores }) => {
  const CARDS = [
    {
      title: 'Project Health Score',
      value: `${scores.health_score} / 100`,
      desc: 'Overall structural & financial health',
      icon: ShieldCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800'
    },
    {
      title: 'Budget Allocation Score',
      value: `${scores.budget_score} / 100`,
      desc: 'Financial cap utilization',
      icon: PieChart,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/70 border-blue-200 dark:border-blue-800'
    },
    {
      title: 'Material Efficiency',
      value: `${scores.material_efficiency_score} / 100`,
      desc: 'Wastage & brand optimization',
      icon: Activity,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-800'
    },
    {
      title: 'Construction Readiness',
      value: `${scores.readiness_score} / 100`,
      desc: 'Permits & site prep status',
      icon: CheckCircle2,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-50 dark:bg-cyan-950/70 border-cyan-200 dark:border-cyan-800'
    },
    {
      title: 'Structural Risk Level',
      value: scores.risk_level,
      desc: 'Contingency & market risk',
      icon: AlertTriangle,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800'
    },
    {
      title: 'AI Confidence Indicator',
      value: `${scores.confidence_pct}%`,
      desc: 'Database formula accuracy',
      icon: Sparkles,
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/70 border-teal-200 dark:border-teal-800'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
      {CARDS.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-2xl border ${card.bg}`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>

            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {card.value}
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {card.desc}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
