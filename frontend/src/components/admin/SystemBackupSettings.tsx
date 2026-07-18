import React, { useState } from 'react';
import type { BackupRecord } from '../../types';
import { adminAPI } from '../../services/api';
import { Database, Download, RefreshCw, HardDrive, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Props {
  backups: BackupRecord[];
  onRefresh: () => void;
}

export const SystemBackupSettings: React.FC<Props> = ({ backups, onRefresh }) => {
  const [backingUp, setBackingUp] = useState(false);

  const handleBackup = async () => {
    setBackingUp(true);
    try {
      await adminAPI.triggerBackup();
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setBackingUp(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Settings Grid */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-blue-600" /> Platform System & Security Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Platform Branding</span>
            <div className="font-extrabold text-slate-900 dark:text-white text-sm">ConstructAI Enterprise</div>
            <p className="text-slate-500 text-[11px]">Version 2.4.0 (Build 2026.07)</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Currency & Units</span>
            <div className="font-extrabold text-slate-900 dark:text-white text-sm">USD ($) • Imperial (cu ft)</div>
            <p className="text-slate-500 text-[11px]">Timezone: Central Time (UTC-6)</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Security Policy</span>
            <div className="font-extrabold text-slate-900 dark:text-white text-sm">Session Timeout: 60 Mins</div>
            <p className="text-slate-500 text-[11px]">JWT Auth Expiration: 24 Hours</p>
          </div>
        </div>
      </div>

      {/* Database Backup Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" /> Database Backup & Snapshot Management
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Create immutable SQL dump archives and disaster recovery snapshots</p>
          </div>

          <button
            onClick={handleBackup}
            disabled={backingUp}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${backingUp ? 'animate-spin' : ''}`} /> Trigger 1-Click DB Backup
          </button>
        </div>

        <div className="space-y-2 pt-2">
          {backups.map((b) => (
            <div
              key={b.id}
              className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5">
                <span className="font-mono font-bold text-slate-900 dark:text-white">{b.filename}</span>
                <div className="text-[10px] text-slate-400">{b.size_mb} MB • Created {new Date(b.created_at).toLocaleDateString()}</div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  {b.status}
                </span>
                <button className="text-blue-600 hover:underline font-bold text-[11px] flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> Download Archive
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
