import React from 'react';
import { TrendingUp, TrendingDown, Clock, Building2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface MaterialPriceItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  changePct: number;
  isUp: boolean;
  lastUpdated: string;
}

export const MATERIAL_PRICES: MaterialPriceItem[] = [
  { id: '1', name: 'UltraTech PPC Cement', category: 'Cement', unit: '50kg Bag', price: 385.00, changePct: 1.8, isUp: true, lastUpdated: '10 mins ago' },
  { id: '2', name: 'Tata Tiscon 550SD TMT', category: 'Steel', unit: 'kg', price: 66.50, changePct: 2.4, isUp: true, lastUpdated: '15 mins ago' },
  { id: '3', name: 'Standard Modular Red Bricks', category: 'Bricks', unit: 'piece', price: 9.50, changePct: 0.0, isUp: true, lastUpdated: '1 hour ago' },
  { id: '4', name: 'Manufactured M-Sand', category: 'Sand', unit: 'cu ft', price: 55.00, changePct: -1.2, isUp: false, lastUpdated: '2 hours ago' },
  { id: '5', name: 'Coarse Aggregate (20mm)', category: 'Aggregate', unit: 'cu ft', price: 48.00, changePct: 0.5, isUp: true, lastUpdated: '3 hours ago' },
  { id: '6', name: 'Asian Paints Royale Emulsion', category: 'Paint', unit: 'Liter', price: 480.00, changePct: 0.8, isUp: true, lastUpdated: 'Today' },
  { id: '7', name: 'Kajaria Vitrified Tiles (2x2)', category: 'Tiles', unit: 'sq ft', price: 85.00, changePct: -0.5, isUp: false, lastUpdated: 'Today' },
  { id: '8', name: 'Astral CPVC Pro Pipe (1")', category: 'PVC Pipes', unit: 'meter', price: 145.00, changePct: 1.1, isUp: true, lastUpdated: 'Today' },
  { id: '9', name: 'Copper Wire 2.5 sq mm', category: 'Electrical', unit: 'meter', price: 32.00, changePct: 3.1, isUp: true, lastUpdated: 'Today' },
];

export const MaterialPriceWidget: React.FC = () => {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" /> Today's Live Material Rates
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Regional spot pricing & market index</p>
        </div>

        <Link
          to="/brands"
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          Full Matrix <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {MATERIAL_PRICES.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between hover:border-blue-300 dark:hover:border-blue-800 transition-all"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {item.category}
              </span>
              <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {item.lastUpdated}
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                ₹{item.price} <span className="text-[10px] font-normal text-slate-400">/{item.unit}</span>
              </div>
              <div
                className={`text-[11px] font-bold flex items-center justify-end gap-0.5 ${
                  item.isUp ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {item.isUp ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {item.changePct > 0 ? `+${item.changePct}%` : `${item.changePct}%`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
