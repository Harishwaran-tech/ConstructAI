import React from 'react';
import type { TimelinePhase } from '../../types';
import { Calendar, Clock, Flag } from 'lucide-react';

interface Props {
  timeline: TimelinePhase[];
}

export const ConstructionTimeline: React.FC<Props> = ({ timeline }) => {
  const totalDays = timeline.reduce((acc, curr) => acc + curr.duration_days, 0);

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" /> Construction Execution Schedule
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Sequential phase estimates and critical milestone path</p>
        </div>

        <div className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 rounded-xl border border-blue-200 self-start sm:self-auto">
          Total Estimated Duration: {totalDays} Days (~{Math.round(totalDays / 30)} Months)
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {timeline.map((phase, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <span className="font-bold text-slate-900 dark:text-white">{idx + 1}. {phase.phase_name}</span>
              <span className="text-slate-500 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {phase.estimated_start} &rarr; {phase.estimated_end} ({phase.duration_days} Days)
              </span>
            </div>

            {/* Visual Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full"
                style={{ width: `${Math.min(100, (phase.duration_days / 45) * 100)}%` }}
              />
            </div>

            <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 pt-1">
              {phase.key_milestones.map((m, mIdx) => (
                <span key={mIdx} className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-1 font-medium">
                  <Flag className="w-3 h-3 text-blue-500" /> {m}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
