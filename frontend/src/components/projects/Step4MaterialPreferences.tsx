import React from 'react';
import type { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { Package, CheckCircle2 } from 'lucide-react';

interface Step4Props {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

const BRAND_GROUPS = [
  {
    key: 'material_preferences.cement_brand',
    title: 'Cement Brand',
    options: ['UltraTech', 'ACC', 'Ramco', 'Dalmia', 'Birla']
  },
  {
    key: 'material_preferences.steel_brand',
    title: 'TMT Rebar Steel Brand',
    options: ['Tata Tiscon', 'JSW', 'Vizag', 'Kamdhenu']
  },
  {
    key: 'material_preferences.brick_type',
    title: 'Masonry Unit Type',
    options: ['Red Brick', 'Fly Ash Brick', 'AAC Block']
  },
  {
    key: 'material_preferences.sand_type',
    title: 'Aggregate / Sand Type',
    options: ['River Sand', 'M Sand']
  },
  {
    key: 'material_preferences.paint_brand',
    title: 'Interior & Exterior Paint',
    options: ['Asian Paints', 'Berger', 'Nerolac', 'Dulux']
  },
  {
    key: 'material_preferences.pipe_brand',
    title: 'Plumbing & Drainage Pipes',
    options: ['Astral', 'Ashirvad', 'Supreme', 'Finolex']
  },
  {
    key: 'material_preferences.electrical_brand',
    title: 'Electrical & Wiring Manufacturer',
    options: ['Havells', 'Anchor', 'Legrand', 'Schneider', 'Polycab']
  }
];

export const Step4MaterialPreferences: React.FC<Step4Props> = ({ setValue, watch }) => {
  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" /> Step 4: Preferred Construction Brands
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Select primary manufacturer brands to lock unit pricing in material estimations.
        </p>
      </div>

      <div className="space-y-5">
        {BRAND_GROUPS.map((group) => {
          const selectedVal = watch(group.key);
          return (
            <div key={group.key} className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                {group.title}
              </label>
              <div className="flex flex-wrap gap-2.5">
                {group.options.map((opt) => {
                  const isSelected = selectedVal === opt;
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setValue(group.key, opt)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
