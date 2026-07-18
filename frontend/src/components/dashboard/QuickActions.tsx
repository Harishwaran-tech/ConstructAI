import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderPlus, 
  Calculator, 
  FileSpreadsheet, 
  Download, 
  Building2, 
  MapPin, 
  ArrowRight 
} from 'lucide-react';

interface QuickActionsProps {
  onOpenNewProject: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onOpenNewProject }) => {
  const navigate = useNavigate();

  const ACTIONS = [
    {
      title: 'Create New Project',
      desc: 'Set up built-up area, location & budget',
      icon: FolderPlus,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900',
      action: onOpenNewProject
    },
    {
      title: 'Estimate Materials',
      desc: 'Concrete, Brickwork, Steel, Finishing',
      icon: Calculator,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-900',
      action: () => navigate('/estimator')
    },
    {
      title: 'Generate BOQ',
      desc: 'Calculate itemized Bill of Quantities',
      icon: FileSpreadsheet,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900',
      action: () => navigate('/reports')
    },
    {
      title: 'Export PDF Report',
      desc: 'Official client & contractor signoff PDF',
      icon: Download,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-900',
      action: () => navigate('/reports')
    },
    {
      title: 'Compare Brand Prices',
      desc: 'Cement, Steel, Paint, Tile matrix',
      icon: Building2,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900',
      action: () => navigate('/brands')
    },
    {
      title: 'Nearby Suppliers',
      desc: 'Local vendors & primary material mills',
      icon: MapPin,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-950/60 border-violet-200 dark:border-violet-900',
      action: () => navigate('/suppliers')
    }
  ];

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4 font-sans">
      <div>
        <h3 className="font-bold text-base text-slate-900 dark:text-white">Quick Workflow Shortcuts</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Launch material takeoff tools and project management actions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACTIONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={item.action}
              className={`p-4 rounded-2xl border ${item.bg} text-left flex items-start justify-between hover:scale-101 transition-all group`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0 mt-0.5" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
