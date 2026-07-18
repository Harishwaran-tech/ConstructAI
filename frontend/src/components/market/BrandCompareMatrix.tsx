import React, { useState, useEffect } from 'react';
import { marketAPI } from '../../services/api';
import type { BrandCompareItem } from '../../types';
import { Star, Truck, ShieldCheck, Award, ThumbsUp, Sparkles } from 'lucide-react';

export const BrandCompareMatrix: React.FC = () => {
  const [category, setCategory] = useState('Cement');
  const [items, setItems] = useState<BrandCompareItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    marketAPI.compareBrands(category).then((res) => {
      setItems(res.filter((i) => i.category === category));
      setLoading(false);
    });
  }, [category]);

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" /> Multi-Brand Procurement Matrix
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Side-by-side quality, delivery speeds, warranties, and unit price comparison</p>
        </div>

        <div className="flex items-center gap-2">
          {['Cement', 'Steel', 'Paint', 'Plumbing'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                category === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading brand comparison matrix...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, idx) => {
            const isBestValue = idx === 1 || item.brand_name.includes('JSW') || item.brand_name.includes('ACC');
            return (
              <div
                key={item.brand_name}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 relative ${
                  isBestValue
                    ? 'bg-blue-50/40 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800 shadow-card'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                {isBestValue && (
                  <span className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Best Value Choice
                  </span>
                )}

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {item.manufacturer}
                    </span>
                    <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{item.brand_name}</h4>
                    <span className="text-xs text-slate-500 font-semibold">{item.grade}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      ${item.current_price} <span className="text-xs font-normal text-slate-400">/ {item.unit}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Quality Rating</span>
                      <span className="font-bold text-slate-900 dark:text-white">{item.quality_rating} / 5.0</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5 text-blue-500" /> Market Popularity</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{item.popularity}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-indigo-500" /> Delivery Speed</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{item.estimated_delivery}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Warranty Guarantee</span>
                      <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">{item.warranty}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors">
                  Lock & Request Supplier Quotes
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
