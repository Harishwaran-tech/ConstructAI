import React, { useState } from 'react';
import type { Role, Permission } from '../../types';
import { adminAPI } from '../../services/api';
import { Shield, Plus, CheckSquare, Square, Lock, Copy } from 'lucide-react';

interface Props {
  roles: Role[];
  permissions: Permission[];
  onRefresh: () => void;
}

export const RolePermissionsMatrix: React.FC<Props> = ({ roles, permissions, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<string[]>(['view_dashboard', 'view_reports']);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return;
    try {
      await adminAPI.createRole({
        name: roleName,
        description: roleDesc,
        permissions: selectedPerms
      });
      setIsModalOpen(false);
      setRoleName('');
      setRoleDesc('');
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const togglePerm = (code: string) => {
    if (selectedPerms.includes(code)) {
      setSelectedPerms(selectedPerms.filter((p) => p !== code));
    } else {
      setSelectedPerms([...selectedPerms, code]);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" /> Enterprise Role-Based Access Control (RBAC) Matrix
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Database-decoupled role permissions matrix and security policy manager</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create Custom Role
        </button>
      </div>

      {/* RBAC Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
              <th className="py-3 px-4">Permission Code</th>
              <th className="py-3 px-4">Category</th>
              {roles.map((r) => (
                <th key={r.id} className="py-3 px-4 text-center">
                  <span className="font-bold text-slate-900 dark:text-white block">{r.name}</span>
                  <span className="text-[9px] font-normal text-slate-400 lowercase">{r.is_system_role ? 'System' : 'Custom'}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
            {permissions.map((perm) => (
              <tr key={perm.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                  {perm.code}
                  <span className="block text-[10px] font-normal text-slate-400 font-sans">{perm.name}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-50 dark:bg-blue-950 text-blue-600">
                    {perm.category}
                  </span>
                </td>
                {roles.map((r) => {
                  const hasAccess = r.permissions.includes(perm.code);
                  return (
                    <td key={r.id} className="py-3 px-4 text-center">
                      {hasAccess ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" /> Create Custom Security Role
            </h3>

            <form onSubmit={handleCreateRole} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Role Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quantity Surveyor Supervisor"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Responsibilities & access scope"
                  value={roleDesc}
                  onChange={(e) => setRoleDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">Assign Permissions</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  {permissions.map((p) => {
                    const isChecked = selectedPerms.includes(p.code);
                    return (
                      <div
                        key={p.id}
                        onClick={() => togglePerm(p.code)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className="font-medium text-slate-900 dark:text-white truncate">{p.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Save & Assign Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
