import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MaterialItem } from '../../types';
import { X, Wrench, ShieldAlert, Package, Info, Clock, CheckCircle2, DollarSign } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: MaterialItem | null;
}

export const MaterialDetailDrawer: React.FC<Props> = ({ isOpen, onClose, item }) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col z-50 overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-10">
              <div>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-blue-50 dark:bg-blue-950 text-blue-600 uppercase">
                  {item.category}
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{item.name}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-6 text-xs text-slate-700 dark:text-slate-300">
              {/* Cost & Quantity Summary */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 block font-medium">Final Takeoff Qty</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">{item.final_qty.toLocaleString()} {item.unit}</span>
                  <span className="text-[10px] text-slate-400 block">+ {item.waste_pct}% Wastage included</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Total Cost Line</span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">${item.total_price.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 block">${item.unit_price} / {item.unit}</span>
                </div>
              </div>

              {/* Description */}
              {item.description && (
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-600" /> Material Overview
                  </h3>
                  <p className="leading-relaxed bg-slate-50/50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800">{item.description}</p>
                </div>
              )}

              {/* Specifications & Grade */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Recommended Grade</span>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold block">{item.recommended_grade || 'Standard'}</span>
                </div>

                <div>
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Recommended Brand</span>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold block">{item.recommended_brand || 'Manufacturer Standard'}</span>
                </div>
              </div>

              {item.specs && (
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-indigo-600" /> Engineering Specifications
                  </h3>
                  <p className="leading-relaxed bg-slate-50/50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800">{item.specs}</p>
                </div>
              )}

              {item.engineering_notes && (
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Civil Engineering Advisory
                  </h3>
                  <p className="leading-relaxed bg-emerald-50/50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200/60 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300">{item.engineering_notes}</p>
                </div>
              )}

              {/* Alternatives & Lifetime */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Alternative Brands</span>
                  <span className="text-slate-600 dark:text-slate-400">{item.alternative || 'Local Stockist'}</span>
                </div>

                <div>
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Estimated Lifetime</span>
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {item.lifetime || '50+ Years'}
                  </span>
                </div>
              </div>

              {/* Usage & Storage */}
              {item.usage_instructions && (
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">Site Application & Usage Instructions</span>
                  <p className="text-slate-500 leading-relaxed">{item.usage_instructions}</p>
                </div>
              )}

              {item.storage_instructions && (
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">Site Storage Requirements</span>
                  <p className="text-slate-500 leading-relaxed">{item.storage_instructions}</p>
                </div>
              )}

              {/* Safety Notes */}
              {item.safety_notes && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1">
                  <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" /> Safety Precaution Note
                  </span>
                  <p className="text-amber-700 dark:text-amber-400 text-[11px] leading-relaxed">{item.safety_notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
