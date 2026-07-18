import React from 'react';
import type { UseFormRegister } from 'react-hook-form';
import { Wrench, Shield, Home } from 'lucide-react';

interface Step3Props {
  register: UseFormRegister<any>;
}

export const Step3StructuralDetails: React.FC<Step3Props> = ({ register }) => {
  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-5 h-5 text-blue-600" /> Step 3: Structural & Civil Specifications
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Foundation framing, RCC member sizes, concrete grades, masonry types, and utilities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Foundation Type</label>
          <select
            {...register('structural_details.foundation_type')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="Isolated Footing">Isolated Spread Footing</option>
            <option value="Combined Footing">Combined Footing</option>
            <option value="Raft / Mat Foundation">Raft / Mat Slab Foundation</option>
            <option value="Pile Foundation">Deep Pile Foundation</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Concrete Grade Mix</label>
          <select
            {...register('structural_details.concrete_grade')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="M15">M15 (1:2:4)</option>
            <option value="M20">M20 (1:1.5:3) - Standard Slab</option>
            <option value="M25">M25 (1:1:2) - Heavy Beams</option>
            <option value="M30">M30 (1:0.75:1.5) - High Strength Columns</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Masonry Unit Type</label>
          <select
            {...register('structural_details.brick_type')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="Standard Red Clay Brick">Standard Red Clay Brick</option>
            <option value="Fly Ash Bricks">Fly Ash Cement Bricks</option>
            <option value="AAC Lightweight Blocks">Autoclaved Aerated (AAC) Blocks</option>
            <option value="Solid Concrete Blocks">Solid Concrete Blocks</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Outer Wall Thickness</label>
          <select
            {...register('structural_details.wall_thickness')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="9 inches">9 inches (Double Brick Outer)</option>
            <option value="4.5 inches">4.5 inches (Partition Wall)</option>
            <option value="6 inches AAC">6 inches (AAC Block Wall)</option>
            <option value="12 inches">12 inches (Heavy Load Bearing)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Standard Beam Size</label>
          <input
            type="text"
            {...register('structural_details.beam_size')}
            placeholder="e.g. 9 x 12 inches"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Standard Column Size</label>
          <input
            type="text"
            {...register('structural_details.column_size')}
            placeholder="e.g. 9 x 15 inches"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Slab Thickness</label>
          <input
            type="text"
            {...register('structural_details.slab_thickness')}
            placeholder="e.g. 5 inches (0.42 ft)"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Floor-to-Floor Height</label>
          <input
            type="number"
            step="0.5"
            {...register('structural_details.floor_height', { valueAsNumber: true })}
            placeholder="10 ft"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Doors Count</label>
          <input
            type="number"
            {...register('structural_details.door_count', { valueAsNumber: true })}
            placeholder="12"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Windows Count</label>
          <input
            type="number"
            {...register('structural_details.window_count', { valueAsNumber: true })}
            placeholder="16"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Staircases Count</label>
          <input
            type="number"
            {...register('structural_details.staircase_count', { valueAsNumber: true })}
            placeholder="2"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Overhead Tank (Liters)</label>
          <input
            type="number"
            {...register('structural_details.water_tank_capacity', { valueAsNumber: true })}
            placeholder="2000"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer">
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">Passenger / Service Lift</span>
            <span className="text-[11px] text-slate-500">Elevator shaft & motor pit included</span>
          </div>
          <input
            type="checkbox"
            {...register('structural_details.lift_available')}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
          />
        </label>

        <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer">
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">Underground Septic Tank</span>
            <span className="text-[11px] text-slate-500">RCC leak-proof underground pit</span>
          </div>
          <input
            type="checkbox"
            {...register('structural_details.septic_tank_available')}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
          />
        </label>
      </div>
    </div>
  );
};
