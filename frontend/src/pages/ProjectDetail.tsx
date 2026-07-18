import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectsAPI, estimationsAPI } from '../services/api';
import type { Project, Estimation } from '../types';
import { 
  FolderKanban, 
  MapPin, 
  Square, 
  DollarSign, 
  Calculator, 
  Plus, 
  ArrowLeft, 
  Trash2, 
  FileSpreadsheet, 
  Download, 
  Sparkles, 
  Layers, 
  Wrench, 
  Package, 
  Users, 
  Building2, 
  CheckCircle2,
  FileText
} from 'lucide-react';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [estimations, setEstimations] = useState<Estimation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'plot' | 'structural' | 'brands' | 'labour' | 'budget'>('overview');

  const loadData = async () => {
    try {
      const [projRes, estRes] = await Promise.all([
        projectsAPI.get(projectId),
        estimationsAPI.list(projectId)
      ]);
      setProject(projRes);
      setEstimations(estRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadData();
    }
  }, [projectId]);

  const handleDeleteEstimation = async (estId: number) => {
    if (confirm('Delete this estimation record?')) {
      await estimationsAPI.delete(estId);
      loadData();
    }
  };

  const handleExportExcel = () => {
    if (!project) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + `Project Title,${project.title}\nClient,${project.client_name || 'N/A'}\nLocation,${project.location || ''}\nBudget,${project.total_budget}\nBuilt up Area,${project.built_up_area}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Project_Export_${project.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-8 text-center text-sm text-slate-500">Loading project details...</div>;
  if (!project) return <div className="p-8 text-center text-sm text-red-500">Project not found.</div>;

  const totalCalculatedCost = estimations.reduce((acc, e) => acc + (e.total_estimated_cost || 0), 0);
  const budgetUtilization = project.total_budget > 0 ? (totalCalculatedCost / project.total_budget) * 100 : 0;

  return (
    <div className="space-y-8 pb-16 font-sans">
      <Link to="/projects" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Projects Directory
      </Link>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                {project.project_type}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {project.status} ({project.completion_percentage || 0}% Complete)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{project.title}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
              Client: <span className="font-semibold text-slate-700 dark:text-slate-300">{project.client_name || 'General Client'}</span> • Site: {project.city || project.location || 'Austin, TX'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              to={`/estimator?projectId=${project.id}`}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5"
            >
              <Calculator className="w-4 h-4" /> Estimate Materials
            </Link>

            <Link
              to="/cost-estimation"
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5"
            >
              <DollarSign className="w-4 h-4 text-emerald-600" /> Estimate Cost
            </Link>

            <Link
              to="/reports"
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-500" /> BOQ & PDF
            </Link>

            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-emerald-500" /> Export Excel
            </button>

            <Link
              to="/ai-copilot"
              className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold text-xs flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800"
            >
              <Sparkles className="w-4 h-4" /> AI Suggestions
            </Link>
          </div>
        </div>

        {/* Metric Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Built-Up Area</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{project.built_up_area?.toLocaleString()} sq ft</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Total Planned Budget</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">${project.total_budget?.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Calculated Materials Takeoff</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">${totalCalculatedCost.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Measurement System</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{project.measurement_units || 'Imperial (ft)'}</span>
          </div>
        </div>
      </div>

      {/* Detail Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {[
          { id: 'overview', label: 'Overview & Attached Estimates', icon: FolderKanban },
          { id: 'plot', label: 'Plot & Spatial Specs', icon: Layers },
          { id: 'structural', label: 'Structural & Concrete', icon: Wrench },
          { id: 'brands', label: 'Material Brands', icon: Package },
          { id: 'labour', label: 'Labour Force', icon: Users },
          { id: 'budget', label: 'Budget Allocations', icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" /> Calculated BOQs ({estimations.length})
            </h2>
            <Link
              to={`/estimator?projectId=${project.id}`}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Calculation
            </Link>
          </div>

          {estimations.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-sm text-slate-500">
              No estimations calculated for this project yet. Launch the Material Estimator to generate BOQs.
            </div>
          ) : (
            <div className="space-y-4">
              {estimations.map((est) => (
                <div key={est.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-50 dark:bg-blue-950 text-blue-600 uppercase">
                        {est.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">{est.title}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Estimated Cost</div>
                      <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                        ${est.total_estimated_cost?.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                          <th className="py-2 pr-4">Material</th>
                          <th className="py-2 px-4">Qty</th>
                          <th className="py-2 px-4">Rate</th>
                          <th className="py-2 pl-4 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {(est.calculated_results?.items || []).map((m: any, idx: number) => (
                          <tr key={idx}>
                            <td className="py-2 pr-4 font-semibold">{m.name}</td>
                            <td className="py-2 px-4">{m.final_qty || m.req_qty} {m.unit}</td>
                            <td className="py-2 px-4">${m.unit_price}</td>
                            <td className="py-2 pl-4 text-right font-bold">${m.total_price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'plot' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>Length: <span className="font-bold">{project.plot_details?.length || 50} ft</span></div>
          <div>Width: <span className="font-bold">{project.plot_details?.width || 40} ft</span></div>
          <div>Plot Area: <span className="font-bold">{project.plot_details?.total_area || 2000} sq ft</span></div>
          <div>Carpet Area: <span className="font-bold">{project.plot_details?.carpet_area || 1250} sq ft</span></div>
          <div>Floors: <span className="font-bold">{project.plot_details?.floors || 2}</span></div>
          <div>Facing: <span className="font-bold">{project.plot_details?.facing_direction || 'North Facing'}</span></div>
          <div>Shape: <span className="font-bold">{project.plot_details?.plot_shape || 'Rectangular'}</span></div>
          <div>Basement: <span className="font-bold">{project.plot_details?.basement_available ? 'Yes' : 'No'}</span></div>
        </div>
      )}

      {activeTab === 'structural' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>Foundation: <span className="font-bold">{project.structural_details?.foundation_type || 'Isolated Footing'}</span></div>
          <div>Concrete Grade: <span className="font-bold">{project.structural_details?.concrete_grade || 'M20'}</span></div>
          <div>Brick Unit: <span className="font-bold">{project.structural_details?.brick_type || 'Red Clay Brick'}</span></div>
          <div>Wall Thickness: <span className="font-bold">{project.structural_details?.wall_thickness || '9 inches'}</span></div>
        </div>
      )}

      {activeTab === 'brands' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>Cement: <span className="font-bold">{project.material_preferences?.cement_brand || 'UltraTech'}</span></div>
          <div>Steel TMT: <span className="font-bold">{project.material_preferences?.steel_brand || 'Tata Tiscon'}</span></div>
          <div>Paint: <span className="font-bold">{project.material_preferences?.paint_brand || 'Asian Paints'}</span></div>
          <div>Pipes: <span className="font-bold">{project.material_preferences?.pipe_brand || 'Astral'}</span></div>
        </div>
      )}

      {activeTab === 'labour' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
          <div className="font-bold text-sm">Labour Workforce Breakdown</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>Engineers: <span className="font-bold">{project.labour_details?.engineers || 1}</span></div>
            <div>Supervisors: <span className="font-bold">{project.labour_details?.supervisors || 1}</span></div>
            <div>Masons: <span className="font-bold">{project.labour_details?.masons || 4}</span></div>
            <div>Helpers: <span className="font-bold">{project.labour_details?.helpers || 8}</span></div>
            <div>Working Days: <span className="font-bold">{project.labour_details?.expected_working_days || 120} days</span></div>
            <div>Daily Wage: <span className="font-bold">${project.labour_details?.daily_labour_cost || 35}/day</span></div>
          </div>
        </div>
      )}

      {activeTab === 'budget' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>Material Allocation: <span className="font-bold text-blue-600">${project.budget_details?.material_budget?.toLocaleString() || '90,000'}</span></div>
          <div>Labour Allocation: <span className="font-bold text-indigo-600">${project.budget_details?.labour_budget?.toLocaleString() || '45,000'}</span></div>
          <div>Emergency Contingency: <span className="font-bold text-amber-600">${project.budget_details?.emergency_fund?.toLocaleString() || '10,000'}</span></div>
          <div>Total Budget: <span className="font-bold text-emerald-600 text-sm">${project.total_budget?.toLocaleString()}</span></div>
        </div>
      )}
    </div>
  );
};
