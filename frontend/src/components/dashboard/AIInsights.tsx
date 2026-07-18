import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, TrendingUp, DollarSign, Clock, ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const INSIGHTS = [
  {
    icon: Clock,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900',
    title: 'Completion Prediction',
    desc: 'Oakridge Villa is estimated to reach 100% structural completion in 5 months based on current casting rate.'
  },
  {
    icon: TrendingUp,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900',
    title: 'Market Trend Alert',
    desc: 'Primary TMT rebar steel prices are projected to increase +3.2% next week. Recommend placing bulk orders today.'
  },
  {
    icon: DollarSign,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900',
    title: 'Material Optimization',
    desc: 'Replacing natural river sand with Manufactured Sand (M-Sand) for brick mortar saves approximately $4,200 (₹35,000).'
  },
  {
    icon: ShieldAlert,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-900',
    title: 'Mix Grade Advisory',
    desc: 'M25 grade concrete specified for columns reduces required steel reinforcement ratio from 2.0% down to 1.5%.'
  }
];

export const AIInsights: React.FC = () => {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-5 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">ConstructAI Copilot Insights</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Engineering optimization & cost saving recommendations</p>
          </div>
        </div>

        <Link
          to="/ai-copilot"
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          Ask Copilot <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {INSIGHTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className={`p-4 rounded-2xl border ${item.bg} space-y-2 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h4>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{item.desc}</p>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  AI Actionable Tip &rarr;
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
