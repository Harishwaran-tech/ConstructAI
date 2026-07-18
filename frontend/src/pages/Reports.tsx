import React, { useState, useEffect } from 'react';
import { projectsAPI, estimationsAPI, reportsAPI } from '../services/api';
import type { Project, Estimation, ReportItem } from '../types';
import { ReportCatalogGrid } from '../components/reports/ReportCatalogGrid';
import { ReportPreviewModal } from '../components/reports/ReportPreviewModal';
import { EmailReportModal } from '../components/reports/EmailReportModal';
import { ReportHistoryTable } from '../components/reports/ReportHistoryTable';
import { FileText, Printer, Download, Sparkles, FolderDown } from 'lucide-react';

export const Reports: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeEstimation, setActiveEstimation] = useState<Estimation | null>(null);

  const [history, setHistory] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewType, setPreviewType] = useState('Project Summary Report');

  const [emailOpen, setEmailOpen] = useState(false);
  const [emailReport, setEmailReport] = useState<ReportItem | null>(null);

  const loadInitial = async () => {
    try {
      const pRes = await projectsAPI.list();
      setProjects(pRes);
      if (pRes.length > 0) {
        setSelectedProjectId(pRes[0].id);
        setActiveProject(pRes[0]);
      }
      const hRes = await reportsAPI.listHistory();
      setHistory(hRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitial();
  }, []);

  const loadProjectEstimation = async (projId: number) => {
    const proj = projects.find((p) => p.id === projId) || null;
    setActiveProject(proj);
    try {
      const ests = await estimationsAPI.list(projId);
      if (ests.length > 0) {
        setActiveEstimation(ests[0]);
      } else {
        setActiveEstimation(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      loadProjectEstimation(selectedProjectId);
    }
  }, [selectedProjectId]);

  const refreshHistory = async () => {
    const hRes = await reportsAPI.listHistory();
    setHistory(hRes);
  };

  const handleGenerate = async (type: string, format: string) => {
    if (!selectedProjectId) return;
    setPreviewType(type);
    try {
      await reportsAPI.generate({
        project_id: selectedProjectId,
        report_type: type,
        file_format: format
      });
      refreshHistory();
      setPreviewOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Header & Project Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" /> Official Reports & Document Generator
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Render 15 client-ready A4 construction documents, BOQs, PDF/Excel exports, and email dispatches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedProjectId || ''}
            onChange={(e) => setSelectedProjectId(Number(e.target.value))}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white shadow-xs"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>Project: {p.title}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-sm text-slate-500">Loading document generation catalog...</div>
      ) : (
        <>
          {/* 15 Report Catalog Cards */}
          <ReportCatalogGrid onGenerate={handleGenerate} />

          {/* Report History Archive */}
          <ReportHistoryTable
            reports={history}
            onRefresh={refreshHistory}
            onEmail={(rep) => {
              setEmailReport(rep);
              setEmailOpen(true);
            }}
          />

          {/* Printable A4 Document Preview Modal */}
          <ReportPreviewModal
            isOpen={previewOpen}
            onClose={() => setPreviewOpen(false)}
            reportType={previewType}
            project={activeProject}
            estimation={activeEstimation}
          />

          {/* Email Report Dispatch Modal */}
          <EmailReportModal
            isOpen={emailOpen}
            onClose={() => setEmailOpen(false)}
            reportId={emailReport?.id || null}
            reportTitle={emailReport?.title || ''}
          />
        </>
      )}
    </div>
  );
};
