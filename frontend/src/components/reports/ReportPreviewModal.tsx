import React from 'react';
import type { Project, Estimation } from '../../types';
import { Printer, X, Download, ShieldCheck, Building2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reportType: string;
  project: Project | null;
  estimation: Estimation | null;
}

export const ReportPreviewModal: React.FC<Props> = ({
  isOpen,
  onClose,
  reportType,
  project,
  estimation
}) => {
  if (!isOpen || !project) return null;

  const handlePrint = () => {
    window.print();
  };

  const items = estimation?.calculated_results?.items || [];
  const grandTotal = estimation?.total_estimated_cost || project.total_budget * 0.52;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Controls Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/60 rounded-t-3xl">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">A4 Printable Layout</span>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{reportType} Preview</h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print Document
            </button>
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable A4 Body */}
        <div className="p-8 overflow-y-auto space-y-6 bg-white text-slate-900 text-xs leading-relaxed printable-document">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-blue-600 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-sm">C</div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">ConstructAI</span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">AI-Powered Construction Material Estimation Platform</p>
            </div>

            <div className="text-right space-y-0.5">
              <h2 className="text-base font-extrabold text-blue-600 uppercase">{reportType}</h2>
              <p className="text-[10px] text-slate-500">Date: {new Date().toLocaleDateString()}</p>
              <p className="text-[10px] text-slate-500">Doc ID: CAI-RPT-{Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Project Information</span>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">{project.title}</p>
              <p className="text-slate-600">Location: {project.city || 'Austin'}, {project.state || 'TX'}</p>
              <p className="text-slate-600">Built-up Area: {project.built_up_area.toLocaleString()} sq ft</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Client & Engineer</span>
              <p className="font-bold text-slate-900">{project.client_name || 'Acme Construction Corp'}</p>
              <p className="text-slate-600">Lead Engineer: {project.owner_name || 'Chief Civil Engineer'}</p>
              <p className="text-slate-600">Planned Budget: ${project.total_budget.toLocaleString()}</p>
            </div>
          </div>

          {/* Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-1">Itemized Takeoff & BOQ Breakdown</h4>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100 text-slate-700 font-bold">
                  <th className="py-2 px-3">Item #</th>
                  <th className="py-2 px-3">Specification & Brand</th>
                  <th className="py-2 px-3 text-center">Qty</th>
                  <th className="py-2 px-3 text-center">Unit</th>
                  <th className="py-2 px-3 text-right">Unit Rate</th>
                  <th className="py-2 px-3 text-right">Amount ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.slice(0, 10).map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-3 font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">
                      {item.name}
                      <span className="block text-[10px] font-normal text-slate-500">{item.recommended_brand} • {item.recommended_grade}</span>
                    </td>
                    <td className="py-2 px-3 text-center font-mono">{item.final_qty}</td>
                    <td className="py-2 px-3 text-center text-slate-600">{item.unit}</td>
                    <td className="py-2 px-3 text-right text-slate-600">${item.unit_price}</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">${item.total_price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-white flex justify-between items-center">
            <span className="font-extrabold text-sm uppercase">Grand Total Estimated Cost</span>
            <span className="font-extrabold text-xl text-emerald-400">${grandTotal.toLocaleString()}</span>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
            <span>Prepared by ConstructAI Enterprise Platform</span>
            <span>CONFIDENTIAL - FOR AUTHORIZED USE ONLY</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
