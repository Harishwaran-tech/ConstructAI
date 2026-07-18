import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import type { Project } from '../types';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  MapPin, 
  Square, 
  DollarSign, 
  Copy, 
  Trash2, 
  ExternalLink, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [budgetMax, setBudgetMax] = useState<number>(2000000);

  const navigate = useNavigate();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectsAPI.list({
        q: search || undefined,
        project_type: typeFilter === 'All' ? undefined : typeFilter,
        status_filter: statusFilter === 'All' ? undefined : statusFilter,
        max_budget: budgetMax
      });
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search, typeFilter, statusFilter, budgetMax]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await projectsAPI.delete(id);
      fetchProjects();
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await projectsAPI.duplicate(id);
      fetchProjects();
    } catch (err) {
      console.error('Duplication failed', err);
    }
  };

  const handleExportAll = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(projects, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `ConstructAI_Projects_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Completed':
        return 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Planning':
        return 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-blue-600" /> Construction Projects Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage architectural sites, client portfolios, structural specs, and takeoff budgets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportAll}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-emerald-500" /> Export JSON
          </button>

          <Link
            to="/projects/new"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" /> New Project Wizard
          </Link>
        </div>
      </div>

      {/* Multi-Criteria Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search title, client, city, state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-medium"
          >
            <option value="All">All Categories</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Hospital">Hospital</option>
            <option value="School">School</option>
            <option value="Infrastructure">Infrastructure</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Planning">Planning</option>
            <option value="Completed">Completed</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Projects Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-sm text-slate-500">Loading projects directory...</div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-base font-bold text-slate-900 dark:text-white">No projects match your filter criteria.</p>
          <p className="text-xs text-slate-500">Launch the 7-step wizard to create your first enterprise project.</p>
          <Link
            to="/projects/new"
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            <Plus className="w-4 h-4" /> Start New Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const completion = project.completion_percentage || (project.status === 'Completed' ? 100 : project.status === 'In Progress' ? 65 : 15);
            return (
              <div
                key={project.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${getStatusBadge(project.status)}`}>
                      {project.status}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">#PRJ-{project.id}</span>
                  </div>

                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-2 line-clamp-1">{project.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Client: <span className="font-semibold">{project.client_name || 'General Client'}</span></p>

                  {project.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{project.description}</p>
                  )}

                  {/* Specification Pill Summary */}
                  <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{project.city || project.location || 'Mumbai, MH'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{project.built_up_area?.toLocaleString()} sq ft ({project.project_type})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="font-bold text-slate-900 dark:text-white">₹{project.total_budget?.toLocaleString()} Budget</span>
                    </div>
                  </div>

                  {/* Completion Progress Bar */}
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-slate-500">Progress</span>
                      <span className="text-blue-600 dark:text-blue-400">{completion}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(project.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                      title="Duplicate Project"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link
                    to={`/projects/${project.id}`}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors text-xs font-bold flex items-center gap-1.5"
                  >
                    View Project <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
