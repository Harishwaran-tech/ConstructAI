import React, { useState } from 'react';
import type { MaterialPriceItem } from '../../types';
import { Search, TrendingUp, TrendingDown, Clock, MapPin, Building2, ExternalLink } from 'lucide-react';

interface Props {
  prices: MaterialPriceItem[];
}

export const LivePricesTable: React.FC<Props> = ({ prices }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [brand, setBrand] = useState('All');
  const [sortBy, setSortBy] = useState<'low-to-high' | 'high-to-low' | 'updated'>('updated');

  const categories = ['All', ...Array.from(new Set(prices.map((p) => p.category)))];
  const brands = ['All', ...Array.from(new Set(prices.map((p) => p.brand)))];

  const filtered = prices
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        (p.location && p.location.toLowerCase().includes(search.toLowerCase()));

      const matchesCat = category === 'All' || p.category === category;
      const matchesBrand = brand === 'All' || p.brand === brand;

      return matchesSearch && matchesCat && matchesBrand;
    })
    .sort((a, b) => {
      if (sortBy === 'low-to-high') return a.current_price - b.current_price;
      if (sortBy === 'high-to-low') return b.current_price - a.current_price;
      return 0;
    });

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-5 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Live Regional Material Spot Index</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Pluggable multi-provider real-time price feeds</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white font-medium"
          >
            <option value="updated">Latest Updated</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search material, brand, supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white"
          >
            {categories.map((c) => (
              <option key={c} value={c}>Category: {c}</option>
            ))}
          </select>

          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white"
          >
            {brands.map((b) => (
              <option key={b} value={b}>Brand: {b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
              <th className="py-3 px-4">Material Specification</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Brand</th>
              <th className="py-3 px-4">Grade</th>
              <th className="py-3 px-4">Current Spot Price</th>
              <th className="py-3 px-4">Change</th>
              <th className="py-3 px-4">Supplier & Location</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                  {item.name}
                  <span className="block text-[10px] font-normal text-slate-400 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Updated {new Date(item.last_updated).toLocaleTimeString()}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-50 dark:bg-blue-950 text-blue-600">
                    {item.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{item.brand}</td>
                <td className="py-3.5 px-4 text-slate-500">{item.grade || 'Standard'}</td>
                <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white text-sm">
                  ${item.current_price} <span className="text-[10px] font-normal text-slate-400">/ {item.unit}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`font-bold flex items-center gap-0.5 ${
                      item.trend === 'up'
                        ? 'text-amber-600 dark:text-amber-400'
                        : item.trend === 'down'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {item.trend === 'up' ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : item.trend === 'down' ? (
                      <TrendingDown className="w-3.5 h-3.5" />
                    ) : null}
                    {item.pct_change > 0 ? `+${item.pct_change}%` : `${item.pct_change}%`}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{item.supplier_name || 'Direct Mill'}</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {item.location || 'Austin, TX'}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                    {item.availability}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
