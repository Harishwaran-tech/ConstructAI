import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../../types';
import { 
  Search, 
  Eye, 
  Edit3, 
  Trash2, 
  Download, 
  MapPin, 
  Square, 
  DollarSign, 
  Filter,
  Plus
} from 'lucide-react';

interface ProjectsTableProps {
  projects: Project[];
  onDelete: (id: number) => void;
  onOpenNewProject: () => void;
}

export const MOCK_FULL_PROJECTS: (Project & { client_name: string })[] = [
  {
    id: 1,
    title: 'Oakridge Residential Villa',
    description: '2-Story RCC Frame structure with AAC block masonry',
    client_name: 'Oakridge Estates India',
    location: 'Mumbai, MH',
    project_type: 'Residential',
    built_up_area: 2800,
    total_budget: 28000000,
    currency: 'INR',
    status: 'In Progress',
    owner_id: 1,
    created_at: '2026-07-02T10:00:00Z',
    updated_at: '2026-07-15T12:00:00Z'
  },
  {
    id: 2,
    title: 'Skyline Commercial Plaza',
    description: '14-Story High-rise commercial complex with basement parking',
    client_name: 'Skyline Properties Group',
    location: 'Delhi NCR',
    project_type: 'Commercial',
    built_up_area: 45000,
    total_budget: 145000000,
    currency: 'INR',
    status: 'In Progress',
    owner_id: 1,
    created_at: '2026-06-18T08:30:00Z',
    updated_at: '2026-07-17T16:00:00Z'
  },
  {
    id: 3,
    title: 'Metro Transit Hub Station',
    description: 'Prestressed concrete girder bridge & station hall',
    client_name: 'City Department of Transportation',
    location: 'Bengaluru, KA',
    project_type: 'Infrastructure',
    built_up_area: 18000,
    total_budget: 89000000,
    currency: 'INR',
    status: 'Planning',
    owner_id: 1,
    created_at: '2026-07-10T14:15:00Z',
    updated_at: '2026-07-10T14:15:00Z'
  },
  {
    id: 4,
    title: 'Apex Industrial Logistics Park',
    description: 'Pre-engineered steel building warehouse & loading docks',
    client_name: 'Apex Logistics Pvt Ltd',
    location: 'Pune, MH',
    project_type: 'Industrial',
    built_up_area: 32000,
    total_budget: 62000000,
    currency: 'INR',
    status: 'Completed',
    owner_id: 1,
    created_at: '2026-04-12T09:00:00Z',
    updated_at: '2026-07-01T11:20:00Z'
  }
];

export const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects,
  onDelete,
  onOpenNewProject
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const displayProjects = projects.length > 0 
    ? projects.map(p => ({ ...p, client_name: 'Apex Client Group' }))
    : MOCK_FULL_PROJECTS;

  const filtered = displayProjects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.toLowerCase().includes(search.toLowerCase()) ||
      p.client_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-5 font-sans">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Construction Projects</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage active sites, client portfolios, and cost allocations</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-white font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Planning">Planning</option>
            <option value="Completed">Completed</option>
          </select>

          <button
            onClick={onOpenNewProject}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>
      </div>

      {/* Search Field */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Filter by title, client, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
              <th className="py-3 px-4">Project Name</th>
              <th className="py-3 px-4">Client Name</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Budget</th>
              <th className="py-3 px-4">Created Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                  {p.title}
                  <div className="text-[11px] font-normal text-slate-400 mt-0.5">{p.built_up_area.toLocaleString()} sq ft ({p.project_type})</div>
                </td>
                <td className="py-3.5 px-4 font-medium">{p.client_name}</td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{p.location || 'Site Location'}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${getStatusBadge(p.status)}`}>
                    {p.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                  ₹{p.total_budget?.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  {new Date(p.created_at).toLocaleDateString()}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to={`/projects/${p.id}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                      title="View Project"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/estimator?projectId=${p.id}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                      title="Add Estimate"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => onDelete(p.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      to="/reports"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                      title="Export BOQ"
                    >
                      <Download className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
