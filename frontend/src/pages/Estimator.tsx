import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { projectsAPI, estimationsAPI } from '../services/api';
import type { Project, Estimation, MaterialItem } from '../types';
import { EstimationSummary } from '../components/estimator/EstimationSummary';
import { MaterialCharts } from '../components/estimator/MaterialCharts';
import { MaterialTable } from '../components/estimator/MaterialTable';
import { MaterialDetailDrawer } from '../components/estimator/MaterialDetailDrawer';
import { 
  Calculator, 
  Sparkles, 
  RotateCw, 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Building2, 
  Plus 
} from 'lucide-react';

export const Estimator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialProjectId = searchParams.get('projectId');

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    initialProjectId ? Number(initialProjectId) : null
  );

  const [currentEstimation, setCurrentEstimation] = useState<Estimation | null>(null);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();

  // Load Projects on Mount
  useEffect(() => {
    projectsAPI.list().then((res) => {
      setProjects(res);
      if (!selectedProjectId && res.length > 0) {
        setSelectedProjectId(res[0].id);
      }
    });
  }, []);

  // Fetch Existing or Calculate Estimation when selected project changes
  const loadEstimation = async (projId: number) => {
    setLoading(true);
    try {
      const existing = await estimationsAPI.list(projId);
      if (existing.length > 0) {
        setCurrentEstimation(existing[0]);
      } else {
        const generated = await estimationsAPI.generateForProject(projId);
        setCurrentEstimation(generated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      loadEstimation(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handleRecalculate = async () => {
    if (!currentEstimation) return;
    setCalculating(true);
    try {
      const updated = await estimationsAPI.recalculate(currentEstimation.id);
      setCurrentEstimation(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  const handleExportCSV = () => {
    if (!currentEstimation || !currentEstimation.calculated_results?.items) return;
    const items = currentEstimation.calculated_results.items;
    let csv = "Material Name,Category,Recommended Brand,Recommended Grade,Quantity,Unit,Waste %,Unit Price,Total Cost\n";
    items.forEach(i => {
      csv += `"${i.name}","${i.category}","${i.recommended_brand || ''}","${i.recommended_grade || ''}",${i.final_qty},"${i.unit}",${i.waste_pct},${i.unit_price},${i.total_price}\n`;
    });

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ConstructAI_Material_Takeoff_Report_${currentEstimation.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const items = currentEstimation?.calculated_results?.items || [];
  const summary = currentEstimation?.calculated_results?.summary;

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-600" /> Material Estimation Engine
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Automated civil engineering quantity takeoff, wastage calculation, and brand cost allocation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Project Selector */}
          <select
            value={selectedProjectId || ''}
            onChange={(e) => setSelectedProjectId(Number(e.target.value))}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white shadow-xs"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>Project: {p.title}</option>
            ))}
          </select>

          <button
            onClick={handleRecalculate}
            disabled={calculating || !currentEstimation}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${calculating ? 'animate-spin' : ''}`} /> Recalculate
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-emerald-500" /> Export CSV
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-blue-500" /> Print
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-sm text-slate-500">Calculating engineering material takeoffs...</div>
      ) : !currentEstimation || items.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-base font-bold text-slate-900 dark:text-white">No active material estimation report found.</p>
          <p className="text-xs text-slate-500">Click below to trigger automated engineering material calculations for this project.</p>
          <button
            onClick={() => selectedProjectId && loadEstimation(selectedProjectId)}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            <Sparkles className="w-4 h-4" /> Run Civil Takeoff Engine
          </button>
        </div>
      ) : (
        <>
          {/* 7 Metric Summary Cards */}
          {summary && <EstimationSummary summary={summary} />}

          {/* 6 Recharts Visualizations */}
          <MaterialCharts items={items} />

          {/* Itemized Material Table */}
          <MaterialTable
            items={items}
            onSelectItem={(item) => {
              setSelectedMaterial(item);
              setDrawerOpen(true);
            }}
          />

          {/* Side Drawer Detail View */}
          <MaterialDetailDrawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            item={selectedMaterial}
          />
        </>
      )}
    </div>
  );
};
