import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  CartesianGrid, 
  ComposedChart 
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

// Dummy Data Sets
const MATERIAL_DISTRIBUTION_DATA = [
  { name: 'Concrete & Cement', value: 38, color: '#2563eb' },
  { name: 'Structural Steel', value: 28, color: '#6366f1' },
  { name: 'Masonry & Bricks', value: 16, color: '#06b6d4' },
  { name: 'Finishing & Tiles', value: 10, color: '#10b981' },
  { name: 'Plumbing & Electrical', value: 8, color: '#f59e0b' },
];

const COST_BREAKDOWN_DATA = [
  { category: 'Substructure', Labor: 45000, Materials: 95000, Equipment: 20000 },
  { category: 'Superstructure', Labor: 85000, Materials: 180000, Equipment: 45000 },
  { category: 'Masonry', Labor: 30000, Materials: 60000, Equipment: 10000 },
  { category: 'MEP Services', Labor: 40000, Materials: 75000, Equipment: 15000 },
  { category: 'Finishing', Labor: 50000, Materials: 90000, Equipment: 12000 },
];

const MONTHLY_EXPENSES_DATA = [
  { month: 'Jan', expense: 120000, budget: 140000 },
  { month: 'Feb', expense: 155000, budget: 160000 },
  { month: 'Mar', expense: 190000, budget: 180000 },
  { month: 'Apr', expense: 210000, budget: 220000 },
  { month: 'May', expense: 260000, budget: 250000 },
  { month: 'Jun', expense: 295000, budget: 300000 },
  { month: 'Jul', expense: 340000, budget: 350000 },
];

const STEEL_USAGE_DATA = [
  { week: 'W1', TMT_8mm: 4.2, TMT_12mm: 8.5, TMT_16mm: 12.1 },
  { week: 'W2', TMT_8mm: 5.1, TMT_12mm: 9.8, TMT_16mm: 14.3 },
  { week: 'W3', TMT_8mm: 3.8, TMT_12mm: 11.2, TMT_16mm: 15.0 },
  { week: 'W4', TMT_8mm: 6.0, TMT_12mm: 13.0, TMT_16mm: 17.5 },
];

const CEMENT_USAGE_DATA = [
  { site: 'Site A (Villa)', OPC_53: 850, PPC: 420 },
  { site: 'Site B (Tower)', OPC_53: 1600, PPC: 980 },
  { site: 'Site C (Plaza)', OPC_53: 1200, PPC: 650 },
  { site: 'Site D (Bridge)', OPC_53: 2100, PPC: 400 },
];

const BUDGET_VS_ACTUAL_DATA = [
  { project: 'Oakridge Villa', Planned: 150000, Actual: 142000 },
  { project: 'Skyline Tower', Planned: 480000, Actual: 510000 },
  { project: 'Metro Hub Plaza', Planned: 320000, Actual: 298000 },
  { project: 'Apex Warehouse', Planned: 220000, Actual: 215000 },
];

const PROJECT_PROGRESS_DATA = [
  { name: 'Oakridge Villa', progress: 85, fill: '#2563eb' },
  { name: 'Skyline Tower', progress: 62, fill: '#6366f1' },
  { name: 'Metro Hub Plaza', progress: 94, fill: '#10b981' },
  { name: 'Apex Warehouse', progress: 40, fill: '#f59e0b' },
];

const PRICE_TREND_DATA = [
  { date: 'Jul 01', Cement: 8.4, Steel: 0.90, Sand: 1.15 },
  { date: 'Jul 05', Cement: 8.5, Steel: 0.92, Sand: 1.18 },
  { date: 'Jul 10', Cement: 8.4, Steel: 0.94, Sand: 1.20 },
  { date: 'Jul 15', Cement: 8.7, Steel: 0.95, Sand: 1.22 },
  { date: 'Jul 18', Cement: 8.8, Steel: 0.96, Sand: 1.25 },
];

export const DashboardCharts: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const tooltipStyle = {
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
    borderColor: isDark ? '#1e293b' : '#e2e8f0',
    color: isDark ? '#f8fafc' : '#0f172a',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    fontSize: '12px',
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Grid Row 1: Material Distribution & Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Material Distribution Donut */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Material Distribution</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Share of total site volume takeoff</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              100% Vol
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MATERIAL_DISTRIBUTION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {MATERIAL_DISTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Cost Breakdown Stacked Bar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Cost Breakdown by Phase</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Labor vs Materials vs Equipment ($)</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COST_BREAKDOWN_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="category" stroke={axisColor} tick={{ fontSize: 10 }} />
                <YAxis stroke={axisColor} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Materials" stackId="a" fill="#2563eb" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Labor" stackId="a" fill="#6366f1" />
                <Bar dataKey="Equipment" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid Row 2: Monthly Expenses & Budget vs Actual */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Monthly Construction Expenses Area Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Monthly Expense Trajectory</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Actual spending vs planned monthly budget</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_EXPENSES_DATA}>
                <defs>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" stroke={axisColor} tick={{ fontSize: 11 }} />
                <YAxis stroke={axisColor} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="expense" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                <Line type="monotone" dataKey="budget" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Budget vs Actual Grouped Bar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Budget vs Actual by Project</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Planned allocation vs calculated expenditure</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BUDGET_VS_ACTUAL_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="project" stroke={axisColor} tick={{ fontSize: 10 }} />
                <YAxis stroke={axisColor} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Planned" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid Row 3: Steel/Cement Usage & Price Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 5. Steel Usage Trend */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Steel Rebar Usage (Tons)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={STEEL_USAGE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="week" stroke={axisColor} tick={{ fontSize: 10 }} />
                <YAxis stroke={axisColor} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="TMT_12mm" stroke="#2563eb" strokeWidth={2} />
                <Line type="monotone" dataKey="TMT_16mm" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. Cement Consumption Bags */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Cement Consumption (Bags)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CEMENT_USAGE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="site" stroke={axisColor} tick={{ fontSize: 9 }} />
                <YAxis stroke={axisColor} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="OPC_53" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="PPC" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7. Price Trend Overview */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Market Unit Price Index ($)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PRICE_TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke={axisColor} tick={{ fontSize: 10 }} />
                <YAxis stroke={axisColor} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="Cement" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="Steel" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
