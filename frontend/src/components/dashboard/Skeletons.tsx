import React from 'react';

export const SummaryCardsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="p-5 rounded-3xl bg-slate-100 dark:bg-slate-800/60 animate-pulse space-y-4 h-36">
          <div className="flex justify-between items-center">
            <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
            <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
          </div>
          <div className="w-32 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          <div className="w-20 h-3 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
        </div>
      ))}
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-800/60 animate-pulse h-80 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="w-40 h-5 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
        <div className="w-60 h-3 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
      </div>
      <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
    </div>
  );
};
