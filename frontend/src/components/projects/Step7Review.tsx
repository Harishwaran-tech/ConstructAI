import React from 'react';
import type { UseFormWatch } from 'react-hook-form';
import { ShieldCheck, Edit3, Building, Layers, Wrench, Package, Users, DollarSign } from 'lucide-react';

interface Step7Props {
  watch: UseFormWatch<any>;
  onGoToStep: (step: number) => void;
}

export const Step7Review: React.FC<Step7Props> = ({ watch, onGoToStep }) => {
  const formData = watch();

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" /> Step 7: Final Specification Review
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Review all collected parameters before saving to database and launching takeoff engines.
        </p>
      </div>

      {/* Step 1 Review */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
          <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
            <Building className="w-4 h-4 text-blue-600" /> 1. Project Information
          </h3>
          <button onClick={() => onGoToStep(1)} className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 hover:underline">
            <Edit3 className="w-3 h-3" /> Edit
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 dark:text-slate-400">
          <div>Title: <span className="font-semibold text-slate-900 dark:text-white">{formData.title}</span></div>
          <div>Client: <span className="font-semibold text-slate-900 dark:text-white">{formData.client_name}</span></div>
          <div>Type: <span className="font-semibold text-slate-900 dark:text-white">{formData.project_type}</span></div>
          <div>Location: <span className="font-semibold text-slate-900 dark:text-white">{formData.city}, {formData.state}</span></div>
        </div>
      </div>

      {/* Step 2 Review */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
          <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" /> 2. Plot Dimensions
          </h3>
          <button onClick={() => onGoToStep(2)} className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 hover:underline">
            <Edit3 className="w-3 h-3" /> Edit
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 dark:text-slate-400">
          <div>Built-up: <span className="font-semibold text-slate-900 dark:text-white">{formData.built_up_area} sq ft</span></div>
          <div>Plot Area: <span className="font-semibold text-slate-900 dark:text-white">{formData.plot_details?.total_area} sq ft</span></div>
          <div>Floors: <span className="font-semibold text-slate-900 dark:text-white">{formData.plot_details?.floors}</span></div>
          <div>Facing: <span className="font-semibold text-slate-900 dark:text-white">{formData.plot_details?.facing_direction}</span></div>
        </div>
      </div>

      {/* Step 3 Review */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
          <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-violet-600" /> 3. Structural Specifications
          </h3>
          <button onClick={() => onGoToStep(3)} className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 hover:underline">
            <Edit3 className="w-3 h-3" /> Edit
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 dark:text-slate-400">
          <div>Foundation: <span className="font-semibold text-slate-900 dark:text-white">{formData.structural_details?.foundation_type}</span></div>
          <div>Concrete: <span className="font-semibold text-slate-900 dark:text-white">{formData.structural_details?.concrete_grade}</span></div>
          <div>Masonry: <span className="font-semibold text-slate-900 dark:text-white">{formData.structural_details?.brick_type}</span></div>
          <div>Wall: <span className="font-semibold text-slate-900 dark:text-white">{formData.structural_details?.wall_thickness}</span></div>
        </div>
      </div>

      {/* Step 4 Review */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
          <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
            <Package className="w-4 h-4 text-cyan-600" /> 4. Preferred Brands
          </h3>
          <button onClick={() => onGoToStep(4)} className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 hover:underline">
            <Edit3 className="w-3 h-3" /> Edit
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 dark:text-slate-400">
          <div>Cement: <span className="font-semibold text-slate-900 dark:text-white">{formData.material_preferences?.cement_brand || 'N/A'}</span></div>
          <div>Steel: <span className="font-semibold text-slate-900 dark:text-white">{formData.material_preferences?.steel_brand || 'N/A'}</span></div>
          <div>Paint: <span className="font-semibold text-slate-900 dark:text-white">{formData.material_preferences?.paint_brand || 'N/A'}</span></div>
          <div>Pipes: <span className="font-semibold text-slate-900 dark:text-white">{formData.material_preferences?.pipe_brand || 'N/A'}</span></div>
        </div>
      </div>

      {/* Step 5 & 6 Review */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-600" /> 5. Labour Force
            </h3>
            <button onClick={() => onGoToStep(5)} className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 hover:underline">
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            <div>Workers: <span className="font-bold text-slate-900 dark:text-white">{formData.labour_details?.total_labourers}</span></div>
            <div>Working Days: <span className="font-bold text-slate-900 dark:text-white">{formData.labour_details?.expected_working_days} days</span></div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" /> 6. Budget Allocation
            </h3>
            <button onClick={() => onGoToStep(6)} className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 hover:underline">
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            <div>Total Planned: <span className="font-bold text-emerald-600 dark:text-emerald-400">${formData.total_budget?.toLocaleString()}</span></div>
            <div>Emergency Contingency: <span className="font-bold text-slate-900 dark:text-white">${formData.budget_details?.emergency_fund?.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
