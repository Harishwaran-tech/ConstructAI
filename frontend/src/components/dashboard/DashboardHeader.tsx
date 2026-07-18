import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Plus, FileSpreadsheet, Calculator, TrendingUp, Sparkles } from 'lucide-react';

interface DashboardHeaderProps {
  onOpenNewProject: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onOpenNewProject }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-700 to-slate-900 text-white shadow-xl relative overflow-hidden font-sans">
      {/* Background Subtle Accent */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-200">
            <Sparkles className="w-4 h-4 text-blue-300 animate-pulse" /> ConstructAI Enterprise Command Center
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name?.split(' ')[0] || 'User'}! 👋
          </h1>

          <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl leading-relaxed">
            {todayFormatted} • <span className="font-semibold text-white">{user?.role || 'Civil Engineer'}</span> at {user?.company_name || 'Apex Construction Group'}. Manage site takeoffs, track price indices, and control construction budgets.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenNewProject}
            className="px-4 py-2.5 rounded-xl bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs shadow-md transition-all flex items-center gap-2 hover:scale-102"
          >
            <Plus className="w-4 h-4 text-blue-600" /> New Project
          </button>

          <button
            onClick={() => navigate('/reports')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-xs transition-colors flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-200" /> Generate Report
          </button>

          <button
            onClick={() => navigate('/estimator')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-xs transition-colors flex items-center gap-2"
          >
            <Calculator className="w-4 h-4 text-blue-200" /> Estimate Materials
          </button>

          <button
            onClick={() => navigate('/brands')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-xs transition-colors flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4 text-blue-200" /> View Prices
          </button>
        </div>
      </div>
    </div>
  );
};
