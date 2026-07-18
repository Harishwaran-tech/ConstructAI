import React from 'react';
import type { SupplierMaterial } from '../../types';
import { Package, Clock, CheckCircle2, AlertTriangle, XCircle, Tag } from 'lucide-react';

interface Props {
  materials: SupplierMaterial[];
}

export const SupplierInventoryCatalog: React.FC<Props> = ({ materials }) => {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" /> Supplier Material & Inventory Catalog
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Live stock quantities, volume discounts, and delivery lead times</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
              <th className="py-3 px-4">Material Specification</th>
              <th className="py-3 px-4">Brand & Grade</th>
              <th className="py-3 px-4">Current Rate</th>
              <th className="py-3 px-4">Volume Discount</th>
              <th className="py-3 px-4">Stock Status</th>
              <th className="py-3 px-4">Delivery Lead Time</th>
              <th className="py-3 px-4 text-right">Order Limits</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
            {materials.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                  {m.material_name}
                  <span className="block text-[10px] font-normal text-slate-400 mt-0.5">{m.specs || 'Standard Specification'}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-slate-900 dark:text-white">{m.brand}</span>
                  <span className="block text-[10px] text-slate-500">{m.grade || 'Standard'}</span>
                </td>
                <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white text-sm">
                  ${m.current_price} <span className="text-[10px] font-normal text-slate-400">/ {m.unit}</span>
                </td>
                <td className="py-3.5 px-4">
                  {m.discount_pct > 0 ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1 w-max">
                      <Tag className="w-3 h-3" /> {m.discount_pct}% OFF
                    </span>
                  ) : (
                    <span className="text-slate-400">Standard</span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                      m.stock_status === 'In Stock'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : m.stock_status === 'Low Stock'
                        ? 'bg-amber-50 text-amber-600 border-amber-200'
                        : 'bg-red-50 text-red-600 border-red-200'
                    }`}
                  >
                    {m.stock_status} ({m.available_qty.toLocaleString()} {m.unit})
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" /> {m.delivery_time} (${m.delivery_charge} fee)
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                  {m.min_order} - {m.max_order.toLocaleString()} {m.unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
