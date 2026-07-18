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
  CartesianGrid 
} from 'recharts';
import type { MaterialItem } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  items: MaterialItem[];
}

const COLORS = ['#2563eb', '#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899', '#14b8a6'];

export const MaterialCharts: React.FC<Props> = ({ items }) => {
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
    fontSize: '11px',
  };

  // 1. Cost by Category
  const categoryMap: Record<string, number> = {};
  const categoryQtyMap: Record<string, number> = {};
  items.forEach((item) => {
    categoryMap[item.category] = (categoryMap[item.category] || 0) + item.total_price;
    categoryQtyMap[item.category] = (categoryQtyMap[item.category] || 0) + item.final_qty;
  });

  const categoryCostData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  const categoryQtyData = Object.entries(categoryQtyMap).map(([name, value]) => ({ name, value }));

  // 2. Top 10 Expensive Materials
  const topExpensive = [...items]
    .sort((a, b) => b.total_price - a.total_price)
    .slice(0, 10)
    .map((i) => ({ name: i.name.split(' ')[0] + ' ' + (i.name.split(' ')[1] || ''), cost: i.total_price }));

  // 3. Top Quantities
  const topQuantities = [...items]
    .sort((a, b) => b.final_qty - a.final_qty)
    .slice(0, 8)
    .map((i) => ({ name: i.name.split(' ')[0], qty: i.final_qty }));

  return (
    <div className="space-y-6 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Category Pie Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Cost Distribution by Category</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total cost split across engineering categories</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryCostData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryCostData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(val: any) => `$${Number(val || 0).toLocaleString()}`} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Top 10 Expensive Materials Bar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Top 10 High Cost Materials</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Highest expenditure items ($)</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topExpensive}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={axisColor} tick={{ fontSize: 9 }} />
                <YAxis stroke={axisColor} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(val: any) => `$${Number(val || 0).toLocaleString()}`} />
                <Bar dataKey="cost" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Cost by Category Horizontal Bar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Category Cost Breakdown</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Line item budget per trade category</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={categoryCostData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis type="number" stroke={axisColor} tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" stroke={axisColor} tick={{ fontSize: 9 }} width={120} />
                <Tooltip contentStyle={tooltipStyle} formatter={(val: any) => `$${Number(val || 0).toLocaleString()}`} />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Quantity Comparison */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Quantity Comparison Volume</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total units calculated for major materials</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topQuantities}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={axisColor} tick={{ fontSize: 9 }} />
                <YAxis stroke={axisColor} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="qty" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
