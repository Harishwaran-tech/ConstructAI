import React, { useState } from 'react';
import type { MaterialItem } from '../../types';
import { Search, Filter, Eye, ChevronRight } from 'lucide-react';

interface Props {
  items: MaterialItem[];
  onSelectItem: (item: MaterialItem) => void;
}

export const MaterialTable: React.FC<Props> = ({ items, onSelectItem }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'price' | 'qty' | 'name'>('price');

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category)))];
  const brands = ['All', ...Array.from(new Set(items.map((i) => i.recommended_brand).filter(Boolean))) as string[]];

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      (item.recommended_brand && item.recommended_brand.toLowerCase().includes(search.toLowerCase()));

    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesBrand = brandFilter === 'All' || item.recommended_brand === brandFilter;

    return matchesSearch && matchesCat && matchesBrand;
  }).sort((a, b) => {
    if (sortBy === 'price') return b.total_price - a.total_price;
    if (sortBy === 'qty') return b.final_qty - a.final_qty;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-5 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Itemized Material Takeoff Schedule</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Click any material row to inspect engineering specifications & safety guidelines</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-xs font-medium text-slate-900 dark:text-white"
          >
            <option value="price">Sort by Total Cost (High to Low)</option>
            <option value="qty">Sort by Final Quantity</option>
            <option value="name">Sort by Material Name</option>
          </select>
        </div>
      </div>

      {/* Search & Multi-Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search material, brand, trade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white"
          >
            {categories.map((c) => (
              <option key={c} value={c}>Trade: {c}</option>
            ))}
          </select>

          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
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
              <th className="py-3 px-4">Material Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Recommended Brand</th>
              <th className="py-3 px-4">Grade Spec</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Waste %</th>
              <th className="py-3 px-4">Unit Price</th>
              <th className="py-3 px-4 text-right">Total Price</th>
              <th className="py-3 px-4 text-center">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
            {filtered.map((item, idx) => (
              <tr
                key={idx}
                onClick={() => onSelectItem(item)}
                className="hover:bg-blue-50/50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
              >
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white group-hover:text-blue-600">
                  {item.name}
                  {item.weight > 0 && (
                    <span className="block text-[10px] font-normal text-slate-400 mt-0.5">
                      Est. Weight: {item.weight.toLocaleString()} kg
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {item.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{item.recommended_brand || 'Standard'}</td>
                <td className="py-3.5 px-4 text-slate-500">{item.recommended_grade || 'Standard'}</td>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                  {item.final_qty.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">{item.unit}</span>
                </td>
                <td className="py-3.5 px-4 text-slate-500">+{item.waste_pct}%</td>
                <td className="py-3.5 px-4 font-medium">₹{item.unit_price}</td>
                <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 dark:text-white">
                  ₹{item.total_price.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <div className="p-1 rounded-lg text-slate-400 group-hover:text-blue-600 inline-flex">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
