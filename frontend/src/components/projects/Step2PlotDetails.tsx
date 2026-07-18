import React from 'react';
import type { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Layers } from 'lucide-react';

interface Step2Props {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

export const Step2PlotDetails: React.FC<Step2Props> = ({ register, setValue, watch }) => {
  const plotLength = watch('plot_details.length') || 0;
  const plotWidth = watch('plot_details.width') || 0;

  // Auto-calculate Total Area
  React.useEffect(() => {
    if (plotLength && plotWidth) {
      setValue('plot_details.total_area', plotLength * plotWidth);
    }
  }, [plotLength, plotWidth, setValue]);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" /> Step 2: Plot & Spatial Dimensions
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Specify plot boundary dimensions, built-up areas, carpet area, and orientation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Plot Length (ft)</label>
          <input
            type="number"
            step="0.1"
            {...register('plot_details.length', { valueAsNumber: true })}
            placeholder="50"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Plot Width (ft)</label>
          <input
            type="number"
            step="0.1"
            {...register('plot_details.width', { valueAsNumber: true })}
            placeholder="40"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Plot Area (sq ft)</label>
          <input
            type="number"
            {...register('plot_details.total_area', { valueAsNumber: true })}
            placeholder="2000"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-slate-900 dark:text-white font-bold"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Built-Up Area (sq ft) *</label>
          <input
            type="number"
            {...register('built_up_area', { valueAsNumber: true })}
            placeholder="1500"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Carpet Area (sq ft)</label>
          <input
            type="number"
            {...register('plot_details.carpet_area', { valueAsNumber: true })}
            placeholder="1250"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Number of Floors</label>
          <input
            type="number"
            min="1"
            {...register('plot_details.floors', { valueAsNumber: true })}
            placeholder="2"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Parking Area (sq ft)</label>
          <input
            type="number"
            {...register('plot_details.parking_area', { valueAsNumber: true })}
            placeholder="250"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Open Garden / Lawn Area (sq ft)</label>
          <input
            type="number"
            {...register('plot_details.open_area', { valueAsNumber: true })}
            placeholder="250"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Plot Geometry / Shape</label>
          <select
            {...register('plot_details.plot_shape')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="Rectangular">Rectangular</option>
            <option value="Square">Square</option>
            <option value="Corner Plot">Corner Plot</option>
            <option value="Irregular">Irregular Polygon</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Facing Direction</label>
          <select
            {...register('plot_details.facing_direction')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="North Facing">North Facing</option>
            <option value="East Facing">East Facing</option>
            <option value="West Facing">West Facing</option>
            <option value="South Facing">South Facing</option>
          </select>
        </div>
      </div>

      {/* Switches for Basement & Road Facing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer">
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">Basement Excavation</span>
            <span className="text-[11px] text-slate-500">Includes foundation retaining walls</span>
          </div>
          <input
            type="checkbox"
            {...register('plot_details.basement_available')}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
          />
        </label>

        <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer">
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">Main Road Facing</span>
            <span className="text-[11px] text-slate-500">Allows direct heavy concrete mixer transit</span>
          </div>
          <input
            type="checkbox"
            {...register('plot_details.road_facing')}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
          />
        </label>
      </div>
    </div>
  );
};
