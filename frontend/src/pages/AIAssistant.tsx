import React, { useState, useEffect } from 'react';
import { projectsAPI, aiAPI } from '../services/api';
import type { 
  Project, 
  ProjectHealthScores, 
  AIRecommendation, 
  TimelinePhase, 
  ChecklistCategory, 
  BOQReviewResult, 
  AIProjectReport 
} from '../types';
import { ProjectHealthBanner } from '../components/ai/ProjectHealthBanner';
import { AIChatInterface } from '../components/ai/AIChatInterface';
import { SmartRecommendations } from '../components/ai/SmartRecommendations';
import { RiskAnalysisMatrix } from '../components/ai/RiskAnalysisMatrix';
import { ConstructionTimeline } from '../components/ai/ConstructionTimeline';
import { ChecklistGenerator } from '../components/ai/ChecklistGenerator';
import { Sparkles, FileText, Download, Printer, CheckCircle, AlertOctagon, RefreshCw } from 'lucide-react';

export const AIAssistant: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const [scores, setScores] = useState<ProjectHealthScores | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [timeline, setTimeline] = useState<TimelinePhase[]>([]);
  const [checklists, setChecklists] = useState<ChecklistCategory[]>([]);
  const [boqReview, setBoqReview] = useState<BOQReviewResult | null>(null);
  const [report, setReport] = useState<AIProjectReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsAPI.list().then((res) => {
      setProjects(res);
      if (res.length > 0) {
        setSelectedProjectId(res[0].id);
      }
    });
  }, []);

  const loadAIData = async (projId: number) => {
    setLoading(true);
    try {
      const [sRes, rRes, tRes, cRes, bRes] = await Promise.all([
        aiAPI.getInsights(projId),
        aiAPI.getRecommendations(projId),
        aiAPI.getTimeline(projId),
        aiAPI.getChecklists(projId),
        aiAPI.reviewBOQ(projId)
      ]);
      setScores(sRes);
      setRecommendations(rRes);
      setTimeline(tRes);
      setChecklists(cRes);
      setBoqReview(bRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      loadAIData(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handleGenerateReport = async () => {
    if (!selectedProjectId) return;
    try {
      const rep = await aiAPI.getReport(selectedProjectId);
      setReport(rep);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    if (!report) return;
    let csv = "Category,Title,Description,Estimated Savings,Impact\n";
    report.recommendations.forEach((r) => {
      csv += `"${r.category}","${r.title}","${r.description}",${r.estimated_savings},"${r.impact}"\n`;
    });
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ConstructAI_Report_Project_${selectedProjectId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const mockRisks = [
    { risk: "Steel Price Inflation", level: "Medium", impact: "High ($2,100)", mitigation: "Bulk purchase before spot rate revision." },
    { risk: "Monsoon Curing Delay", level: "Low", impact: "Medium (5 Days)", mitigation: "Cover active slab with waterproof tarpaulins." },
    { risk: "M-Sand Supply Bottleneck", level: "Low", impact: "Low", mitigation: "Lock regional quarry supply contract." },
    { risk: "Electrical Conduit Fitting Shortage", level: "Low", impact: "Low", mitigation: "Source from alternative Pflugerville stockist." }
  ];

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" /> AI Construction Intelligence Hub
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Provider-independent decision support, structural health scores, BOQ audits, and automated site checklists.
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
            onClick={handleGenerateReport}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-4 h-4" /> Generate Full AI Report
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-blue-500" /> Print
          </button>
        </div>
      </div>

      {loading || !scores ? (
        <div className="p-16 text-center text-sm text-slate-500">Evaluating civil engineering project intelligence...</div>
      ) : (
        <>
          {/* Project Health Scores Banner */}
          <ProjectHealthBanner scores={scores} />

          {/* Interactive Chat Assistant */}
          <AIChatInterface projectId={selectedProjectId || undefined} />

          {/* Smart Recommendations */}
          <SmartRecommendations recommendations={recommendations} />

          {/* Project Risk Analysis Matrix */}
          <RiskAnalysisMatrix risks={mockRisks} />

          {/* Construction Timeline Visualizer */}
          <ConstructionTimeline timeline={timeline} />

          {/* BOQ Review & Audit Card */}
          {boqReview && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertOctagon className="w-5 h-5 text-indigo-600" /> AI Bill of Quantities (BOQ) Audit
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Automated structural takeoff inconsistency & missing item detection</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 space-y-1">
                  <span className="font-bold text-amber-800 dark:text-amber-300">Missing Structural Items</span>
                  <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-0.5">
                    {boqReview.missing_items.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 space-y-1">
                  <span className="font-bold text-blue-800 dark:text-blue-300">Unit Rate Inconsistencies</span>
                  <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-0.5">
                    {boqReview.inconsistencies.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Site Execution Checklists */}
          <ChecklistGenerator checklists={checklists} />

          {/* AI Project Analysis Report Modal View */}
          {report && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-blue-950 text-white shadow-2xl space-y-4 border border-blue-800">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-blue-500 text-white">
                    Executive Document
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-1">{report.title}</h3>
                </div>

                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-xs flex items-center gap-1.5 hover:bg-slate-100"
                >
                  <Download className="w-4 h-4 text-emerald-600" /> Download CSV Report
                </button>
              </div>

              <div className="space-y-2 text-xs text-blue-100 border-t border-blue-800/80 pt-3">
                <p className="leading-relaxed font-medium">{report.executive_summary}</p>
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="p-3 rounded-xl bg-white/10">Planned Budget: <span className="font-bold text-white block">${report.budget_analysis.planned_budget?.toLocaleString()}</span></div>
                  <div className="p-3 rounded-xl bg-white/10">Material Takeoff: <span className="font-bold text-white block">${report.budget_analysis.material_takeoff?.toLocaleString()}</span></div>
                  <div className="p-3 rounded-xl bg-white/10">Potential Savings: <span className="font-bold text-emerald-400 block">${report.budget_analysis.potential_savings?.toLocaleString()}</span></div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
