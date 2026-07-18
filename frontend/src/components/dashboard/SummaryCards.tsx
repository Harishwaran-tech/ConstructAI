import React from 'react';
import { motion } from 'framer-motion';
import { 
  FolderKanban, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  TrendingUp, 
  Boxes, 
  PieChart, 
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

const METRICS: MetricCardProps[] = [
  {
    title: 'Total Projects',
    value: '24',
    subValue: 'Active Portfolios',
    change: '+14% this month',
    isPositive: true,
    icon: FolderKanban,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-50 dark:bg-blue-950/70 border-blue-200 dark:border-blue-800'
  },
  {
    title: 'Projects in Progress',
    value: '14',
    subValue: 'Under Active Construction',
    change: '+3 active sites',
    isPositive: true,
    icon: Clock,
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-800'
  },
  {
    title: 'Completed Projects',
    value: '10',
    subValue: 'Sign-off Delivered',
    change: '+2 this quarter',
    isPositive: true,
    icon: CheckCircle2,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800'
  },
  {
    title: 'Estimated Total Cost',
    value: '₹18,40,50,000',
    subValue: 'Calculated Takeoff',
    change: '-4.2% vs budget',
    isPositive: true,
    icon: DollarSign,
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    iconBg: 'bg-cyan-50 dark:bg-cyan-950/70 border-cyan-200 dark:border-cyan-800'
  },
  {
    title: "Today's Material Price Index",
    value: '108.4',
    subValue: 'Market Rate Benchmark',
    change: '+1.8% week trend',
    isPositive: false,
    icon: TrendingUp,
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800'
  },
  {
    title: 'Estimated Material Quantity',
    value: '42,500 units',
    subValue: 'Cement, Steel, Bricks',
    change: '+8% volume',
    isPositive: true,
    icon: Boxes,
    iconColor: 'text-violet-600 dark:text-violet-400',
    iconBg: 'bg-violet-50 dark:bg-violet-950/70 border-violet-200 dark:border-violet-800'
  },
  {
    title: 'Monthly Construction Budget',
    value: '₹3,50,00,000',
    subValue: 'Allocation for July',
    change: '76% utilized',
    isPositive: true,
    icon: PieChart,
    iconColor: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-teal-50 dark:bg-teal-950/70 border-teal-200 dark:border-teal-800'
  },
  {
    title: 'Total Procurement Savings',
    value: '₹1,24,80,000',
    subValue: 'Via Brand Matrix',
    change: '+9.4% saved',
    isPositive: true,
    icon: PiggyBank,
    iconColor: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-50 dark:bg-green-950/70 border-green-200 dark:border-green-800'
  }
];

export const SummaryCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-sans">
      {METRICS.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {metric.title}
                </span>
                <div className={`p-2.5 rounded-2xl border ${metric.iconBg}`}>
                  <Icon className={`w-4 h-4 ${metric.iconColor}`} />
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
                {metric.value}
              </div>

              {metric.subValue && (
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {metric.subValue}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span
                className={`font-semibold flex items-center gap-0.5 ${
                  metric.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {metric.isPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                {metric.change}
              </span>
              <span className="text-[11px] text-slate-400">vs prev cycle</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
