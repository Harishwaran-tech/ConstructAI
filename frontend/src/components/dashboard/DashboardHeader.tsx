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

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-1.5 flex-wrap">
            Welcome back, {user?.full_name?.split(' ')[0] || 'User'}!
            <span className="inline-block align-middle waving-hand-container">
              <style>{`
                @keyframes wave-animation {
                  0% { transform: rotate( 0.0deg) }
                  10% { transform: rotate(14.0deg) }
                  20% { transform: rotate(-8.0deg) }
                  30% { transform: rotate(14.0deg) }
                  40% { transform: rotate(-4.0deg) }
                  50% { transform: rotate(10.0deg) }
                  60% { transform: rotate( 0.0deg) }
                  100% { transform: rotate( 0.0deg) }
                }
                .waving-hand-container {
                  animation: wave-animation 2.5s infinite;
                  transform-origin: 70% 70%;
                }
              `}</style>
              <svg
                className="w-8 h-8 text-amber-300 drop-shadow-md"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M21.8,11.5c-0.4-0.4-1-0.4-1.4,0l-1.3,1.3c0-0.1,0-0.2,0-0.3v-8c0-0.8-0.7-1.5-1.5-1.5s-1.5,0.7-1.5,1.5v5h-1v-9c0-0.8-0.7-1.5-1.5-1.5S12,1.2,12,2v8h-1V1c0-0.8-0.7-1.5-1.5-1.5S8,0.2,8,1v9H7V3.5C7,2.7,6.3,2,5.5,2S4,2.7,4,3.5v10c0,4.7,3.8,8.5,8.5,8.5h3.3c3.5,0,6.5-2.7,6.8-6.2l0.2-2.9C22.8,12.5,22.4,11.9,21.8,11.5z" />
              </svg>
            </span>
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
