import React from 'react';
import { Check, Info, Layers, Wrench, Package, Users, DollarSign, ShieldCheck } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  icon: React.ElementType;
}

export const STEPS: Step[] = [
  { id: 1, title: 'Project Info', icon: Info },
  { id: 2, title: 'Plot Details', icon: Layers },
  { id: 3, title: 'Structural', icon: Wrench },
  { id: 4, title: 'Materials', icon: Package },
  { id: 5, title: 'Labour', icon: Users },
  { id: 6, title: 'Budget', icon: DollarSign },
  { id: 7, title: 'Review', icon: ShieldCheck },
];

interface WizardProgressBarProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const WizardProgressBar: React.FC<WizardProgressBarProps> = ({ currentStep, onStepClick }) => {
  return (
    <div className="w-full font-sans py-4">
      <div className="flex items-center justify-between overflow-x-auto gap-2 pb-2">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div
              key={step.id}
              onClick={() => {
                if (step.id < currentStep) onStepClick(step.id);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isCurrent
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : isCompleted
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 cursor-pointer'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                  isCurrent
                    ? 'bg-white/20 text-white'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {isCompleted ? <Check className="w-3 h-3" /> : step.id}
              </div>

              <span className="hidden sm:inline">{step.title}</span>
            </div>
          );
        })}
      </div>

      {/* Progress Track */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
          style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
};
