import React from 'react';
import { 
  FileText, 
  Layers, 
  DollarSign, 
  Users, 
  Wrench, 
  Calculator, 
  ShoppingCart, 
  GitCompare, 
  TrendingUp, 
  Sparkles, 
  ShieldAlert, 
  Calendar, 
  PieChart, 
  CheckCircle2,
  Download,
  Printer,
  Mail
} from 'lucide-react';

interface Props {
  onGenerate: (type: string, format: string) => void;
}

export const CATALOG_ITEMS = [
  { type: "Project Summary Report", icon: FileText, desc: "Executive overview of project specs, client info, timeline & budget." },
  { type: "Material Estimation Report", icon: Layers, desc: "Full itemized takeoff quantities, wastage %, and material weight." },
  { type: "Material Cost Report", icon: DollarSign, desc: "Category budget breakdown & material expenditure allocation." },
  { type: "Labour Cost Report", icon: Users, desc: "Engineering & trades manday calculations, daily rates & totals." },
  { type: "Equipment Cost Report", icon: Wrench, desc: "Scaffolding, concrete mixer, & heavy machinery rental costs." },
  { type: "Construction Cost Report", icon: Calculator, desc: "Combined structural takeoff, labor, equipment & contingency reserves." },
  { type: "Bill of Quantities (BOQ)", icon: Layers, desc: "Official 10-column BOQ statement for client & tender submissions." },
  { type: "Material Purchase Report", icon: ShoppingCart, desc: "Recommended brand procurement list, order timing & quantities." },
  { type: "Supplier Comparison Report", icon: GitCompare, desc: "Side-by-side vendor quotes, delivery speeds, & rating matrix." },
  { type: "Market Price Report", icon: TrendingUp, desc: "Regional spot price trends, weekly surge indices & best brand rates." },
  { type: "AI Recommendation Report", icon: Sparkles, desc: "ConstructAI Copilot savings tips, rebar optimization & material swaps." },
  { type: "Risk Assessment Report", icon: ShieldAlert, desc: "Probability, financial impact & mitigation for price & site risks." },
  { type: "Timeline Report", icon: Calendar, desc: "Gantt phase schedule from Foundation to Finishing with milestones." },
  { type: "Budget Optimization Report", icon: PieChart, desc: "Target vs actual variance analysis & contingency reserve strategies." },
  { type: "Project Completion Report", icon: CheckCircle2, desc: "Final quality audit, handover checklists & structural sign-off." }
];

export const ReportCatalogGrid: React.FC<Props> = ({ onGenerate }) => {
  return (
    <div className="space-y-4 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Report & Document Catalog</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Select any official template below to generate instant A4 PDF, Excel, or CSV documents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CATALOG_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col justify-between space-y-4 hover:shadow-card transition-all"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">{item.type}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => onGenerate(item.type, "pdf")}
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" /> PDF
                </button>
                <button
                  onClick={() => onGenerate(item.type, "excel")}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Excel
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
