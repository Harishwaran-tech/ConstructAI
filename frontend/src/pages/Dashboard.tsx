import React, { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';
import type { Project } from '../types';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { DashboardCharts } from '../components/dashboard/DashboardCharts';
import { ProjectsTable } from '../components/dashboard/ProjectsTable';
import { AIInsights } from '../components/dashboard/AIInsights';
import { MaterialPriceWidget } from '../components/dashboard/MaterialPriceWidget';
import { QuickActions } from '../components/dashboard/QuickActions';
import { SummaryCardsSkeleton } from '../components/dashboard/Skeletons';
import { Plus } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Project Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [projectType, setProjectType] = useState('Residential');
  const [builtUpArea, setBuiltUpArea] = useState<number>(2000);
  const [totalBudget, setTotalBudget] = useState<number>(200000);

  const fetchProjects = async () => {
    try {
      const data = await projectsAPI.list();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await projectsAPI.create({
        title,
        description,
        location,
        project_type: projectType,
        built_up_area: builtUpArea,
        total_budget: totalBudget,
        currency: 'USD',
        status: 'Planning',
      });
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setLocation('');
      fetchProjects();
    } catch (err) {
      console.error('Failed to create project', err);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await projectsAPI.delete(id);
      fetchProjects();
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Header Banner */}
      <DashboardHeader onOpenNewProject={() => setIsModalOpen(true)} />

      {/* 8 Premium Animated Summary Metric Cards */}
      {loading ? <SummaryCardsSkeleton /> : <SummaryCards />}

      {/* AI Recommendation Insights Panel */}
      <AIInsights />

      {/* 8 Interactive Recharts Visualizations */}
      <DashboardCharts />

      {/* Today's Material Prices Live Widget */}
      <MaterialPriceWidget />

      {/* Recent Projects Table */}
      <ProjectsTable
        projects={projects}
        onDelete={handleDeleteProject}
        onOpenNewProject={() => setIsModalOpen(true)}
      />

      {/* Quick Action Shortcuts Grid */}
      <QuickActions onOpenNewProject={() => setIsModalOpen(true)} />

      {/* Create New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" /> Create Construction Project
              </h2>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Skyline Commercial Complex"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Scope & Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Structural specs, foundation requirements..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Site Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Austin, TX"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Structure Category</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Built-up Area (sq ft)</label>
                  <input
                    type="number"
                    value={builtUpArea}
                    onChange={(e) => setBuiltUpArea(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Planned Budget ($)</label>
                  <input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm"
                >
                  Save & Launch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
