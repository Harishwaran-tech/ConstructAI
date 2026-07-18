import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { MapPin, Globe, Calendar, DollarSign, Building } from 'lucide-react';

const PROJECT_TYPES = [
  'Residential',
  'Commercial',
  'Industrial',
  'Apartment',
  'Villa',
  'Hospital',
  'School',
  'Bridge',
  'Road',
  'Warehouse'
];

interface Step1Props {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export const Step1ProjectInfo: React.FC<Step1Props> = ({ register, errors }) => {
  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-600" /> Step 1: Basic Project Information
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Enter project identification, client details, site location, and timeline.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Project Title / Name *
          </label>
          <input
            type="text"
            {...register('title')}
            placeholder="e.g. Oakridge 2-Story Residential Villa"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600"
          />
          {errors.title && <p className="text-red-500 text-[11px] mt-1">{String(errors.title.message)}</p>}
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Client Name *
          </label>
          <input
            type="text"
            {...register('client_name')}
            placeholder="e.g. Oakridge Estates Inc."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600"
          />
          {errors.client_name && <p className="text-red-500 text-[11px] mt-1">{String(errors.client_name.message)}</p>}
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Owner / Lead Manager Name
          </label>
          <input
            type="text"
            {...register('owner_name')}
            placeholder="e.g. John Doe (Chief Architect)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Project Category Type *
          </label>
          <select
            {...register('project_type')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600"
          >
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Project Description & Scope
        </label>
        <textarea
          rows={3}
          {...register('description')}
          placeholder="Detailed description of architectural style, structural requirements, foundation details..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Location Fields */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <h3 className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-blue-600" /> Site Address & Location
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">City *</label>
            <input
              type="text"
              {...register('city')}
              placeholder="Mumbai"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">State / Province</label>
            <input
              type="text"
              {...register('state')}
              placeholder="Maharashtra"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Country</label>
            <input
              type="text"
              {...register('country')}
              placeholder="India"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Pincode / Zip</label>
            <input
              type="text"
              {...register('pincode')}
              placeholder="400001"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Google Maps Location Embed / URL
          </label>
          <input
            type="url"
            {...register('google_maps_url')}
            placeholder="https://maps.google.com/..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
          />
        </div>
      </div>

      {/* Dates & Units */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Expected Start Date</label>
          <input
            type="date"
            {...register('start_date')}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Completion Target Date</label>
          <input
            type="date"
            {...register('end_date')}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Currency</label>
          <select
            {...register('currency')}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Measurement Units</label>
          <select
            {...register('measurement_units')}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="Imperial (ft)">Imperial (Feet / Feet²)</option>
            <option value="Metric (m)">Metric (Meters / Meters²)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
