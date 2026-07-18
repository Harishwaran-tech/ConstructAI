import React, { useState } from 'react';
import type { ApiKeyItem } from '../../types';
import { adminAPI } from '../../services/api';
import { Key, Plus, CheckCircle2, Shield, Trash2 } from 'lucide-react';

interface Props {
  apiKeys: ApiKeyItem[];
  onRefresh: () => void;
}

export const ApiKeyManagement: React.FC<Props> = ({ apiKeys, onRefresh }) => {
  const [keyName, setKeyName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;
    try {
      await adminAPI.createApiKey(keyName);
      setKeyName('');
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-500" /> Third-Party API Key & Integration Credentials
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Google Maps, Gemini 1.5, OpenAI, Claude, and SMTP integration keys</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Issue API Secret Key
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apiKeys.map((k) => (
          <div
            key={k.id}
            className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-slate-900 dark:text-white">{k.name}</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-600 border border-emerald-200">
                  {k.is_active ? 'Active' : 'Revoked'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 text-white font-mono text-xs flex justify-between items-center">
                <span>{k.key_prefix}••••••••••••</span>
                <span className="text-[10px] text-slate-400">{k.rate_limit_per_min} req/min</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700">
              <span>Created: {new Date(k.created_at).toLocaleDateString()}</span>
              <button className="text-red-500 hover:underline font-bold">Revoke Key</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-600" /> Issue API Integration Key
            </h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Key Identifier Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Claude 3.5 Sonnet Integration Key"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
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
                  Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
