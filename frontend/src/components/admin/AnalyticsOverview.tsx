import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import type { SystemAnalytics } from '../../types';
import { Users, Building2, Layers, FileText, ShoppingCart, Sparkles, Activity } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  analytics: SystemAnalytics;
}

export const AnalyticsOverview: React.FC<Props> = ({ analytics }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const tooltipStyle = {
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
    borderColor: isDark ? '#1e293b' : '#e2e8f0',
    color: isDark ? '#f8fafc' : '#0f172a',
    borderRadius: '12px',
    fontSize: '11px',
  };

  const KPIS = [
    { label: 'Total Registered Users', val: analytics.total_users, sub: `${analytics.active_users} Active`, icon: Users, color: 'text-blue-600' },
    { label: 'Total Projects Onboarded', val: analytics.total_projects, sub: 'Active Construction Sites', icon: Building2, color: 'text-indigo-600' },
    { label: 'Materials Estimated', val: analytics.materials_estimated.toLocaleString(), sub: 'Calculated Takeoffs', icon: Layers, color: 'text-emerald-600' },
    { label: 'Reports Generated', val: analytics.reports_generated, sub: 'PDF & Excel Exports', icon: FileText, color: 'text-amber-600' },
    { label: 'Verified Suppliers', val: analytics.total_suppliers, sub: 'Regional Marketplace Yards', icon: ShoppingCart, color: 'text-purple-600' },
    { label: 'AI Copilot Requests', val: analytics.ai_requests.toLocaleString(), sub: 'LLM Invocations', icon: Sparkles, color: 'text-teal-600' },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* 6 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {KPIS.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2"
            >
              <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-wider">
                <span>{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{kpi.val}</div>
              <div className="text-[11px] text-slate-400 font-medium">{kpi.sub}</div>
            </div>
          );
        })}
      </div>

      {/* 2 Recharts Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Enterprise User Acquisition Curve</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.user_growth_chart}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke={axisColor} tick={{ fontSize: 10 }} />
                <YAxis stroke={axisColor} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Active Construction Project Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.project_growth_chart}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke={axisColor} tick={{ fontSize: 10 }} />
                <YAxis stroke={axisColor} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="projects" stroke="#10b981" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
