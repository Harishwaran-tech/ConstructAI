import React, { useState, useEffect } from 'react';
import { marketplaceAPI } from '../../services/api';
import type { SupplierCompareResult } from '../../types';
import { Award, Star, Truck, MapPin, CheckCircle2, Sparkles, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  supplierIds: number[];
}

export const QuoteCompareModal: React.FC<Props> = ({
  isOpen,
  onClose,
  supplierIds
}) => {
  if (!isOpen) return null;

  const [comparison, setComparison] = useState<SupplierCompareResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supplierIds.length > 0) {
      setLoading(true);
      marketplaceAPI.compareSuppliers(supplierIds).then((res) => {
        setComparison(res);
        setLoading(false);
      });
    }
  }, [supplierIds]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">Multi-Vendor Procurement Audit</span>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" /> Side-by-Side Quotation Comparison
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Auditing vendor quotes and logistics charges...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comparison.map((item) => (
              <div
                key={item.supplier_id}
                className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-blue-50 dark:bg-blue-950 text-blue-600">
                        {item.recommendation_badge}
                      </span>
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white mt-1">{item.name}</h4>
                      <p className="text-xs text-slate-500">{item.company}</p>
                    </div>

                    <span className="px-2 py-0.5 text-xs font-bold rounded-lg bg-amber-50 text-amber-700 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {item.rating}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Total Quoted Takeoff Price</span>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      ${item.price_total.toLocaleString()}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200/60 dark:border-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Distance Radius:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{item.distance_miles} miles</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Delivery Lead Time:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{item.delivery_time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Truck Logistics Fee:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">${item.delivery_charge}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Stock Availability:</span>
                      <span className="font-bold text-emerald-600">{item.stock_availability}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors">
                  Accept & Award Order
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
