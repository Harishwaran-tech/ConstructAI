import React from 'react';
import type { MarketplaceSupplier } from '../../types';
import { MapPin, Navigation, Clock, Building2, Truck } from 'lucide-react';

interface Props {
  suppliers: MarketplaceSupplier[];
  selectedSupplier?: MarketplaceSupplier | null;
}

export const SupplierMapVisualizer: React.FC<Props> = ({ suppliers, selectedSupplier }) => {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" /> Regional Geolocation & Delivery Route Visualizer
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Project site, nearby supplier yards, and logistics travel times</p>
        </div>

        <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
          <Navigation className="w-3.5 h-3.5 text-blue-500" /> Active Site: Austin Commercial Site (78745)
        </div>
      </div>

      {/* Map Graphic Container */}
      <div className="relative h-64 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-6 text-white shadow-inner">
        {/* Simulated Map Overlay & Grid Lines */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Top Floating Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Live Dispatch Radius: 15 Miles
          </div>

          <div className="text-[11px] font-medium text-slate-300">
            {suppliers.length} Supplier Yards Discovered
          </div>
        </div>

        {/* Map Markers Representation */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 my-auto">
          {suppliers.slice(0, 3).map((s, idx) => {
            const isSelected = selectedSupplier?.id === s.id;
            return (
              <div
                key={s.id}
                className={`p-3 rounded-xl backdrop-blur-md border transition-all ${
                  isSelected
                    ? 'bg-blue-600/40 border-blue-400 shadow-lg scale-105'
                    : 'bg-white/10 border-white/15 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span className="truncate">{s.name}</span>
                  <span className="text-[10px] font-bold text-amber-300">★ {s.rating}</span>
                </div>
                <div className="text-[10px] text-slate-300 flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-blue-400" /> {s.distance_miles} mi</span>
                  <span className="flex items-center gap-0.5"><Clock className="w-3 h-3 text-emerald-400" /> {s.travel_time_mins} mins</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Route Summary */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-300 border-t border-white/10 pt-2">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-indigo-400" />
            <span>Optimal Truck Route: I-35 South Highway Bypass</span>
          </div>
          <span className="font-bold text-white">Average Fleet ETA: 24 Hours</span>
        </div>
      </div>
    </div>
  );
};
