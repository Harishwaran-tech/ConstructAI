import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import type { SystemAnalytics, User, Role, Permission, AuditLog, ApiKeyItem, BackupRecord, UserSearchHistory } from '../types';
import { AnalyticsOverview } from '../components/admin/AnalyticsOverview';
import { UserManagementTable } from '../components/admin/UserManagementTable';
import { RolePermissionsMatrix } from '../components/admin/RolePermissionsMatrix';
import { AuditLogTimeline } from '../components/admin/AuditLogTimeline';
import { UserSearchHistoryTimeline } from '../components/admin/UserSearchHistoryTimeline';
import { ApiKeyManagement } from '../components/admin/ApiKeyManagement';
import { SystemBackupSettings } from '../components/admin/SystemBackupSettings';
import { ShieldAlert, Activity, Users, Shield, Key, Database, RefreshCw, MessageSquare } from 'lucide-react';

export const AdminSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'rbac' | 'audit' | 'search-history' | 'apikeys' | 'backups'>('analytics');

  const [analytics, setAnalytics] = useState<SystemAnalytics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [searchHistory, setSearchHistory] = useState<UserSearchHistory[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [backups, setBackups] = useState<BackupRecord[]>([]);

  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [aRes, uRes, rRes, pRes, lRes, sRes, kRes, bRes] = await Promise.all([
        adminAPI.getAnalytics(),
        adminAPI.listUsers(),
        adminAPI.listRoles(),
        adminAPI.listPermissions(),
        adminAPI.getAuditLogs(),
        adminAPI.getSearchHistory(),
        adminAPI.getApiKeys(),
        adminAPI.getBackups()
      ]);
      setAnalytics(aRes);
      setUsers(uRes);
      setRoles(rRes);
      setPermissions(pRes);
      setAuditLogs(lRes);
      setSearchHistory(sRes);
      setApiKeys(kRes);
      setBackups(bRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-blue-600" /> Enterprise Administration System
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Platform governance, database-decoupled RBAC, security audit trail, user search & AI prompt history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAdminData}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-100 flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4 text-blue-500" /> Refresh Admin State
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" /> Overview & Analytics
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'users' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" /> User Management
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'rbac' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" /> Roles & RBAC Matrix
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'audit' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" /> Security Audit Logs
        </button>

        <button
          onClick={() => setActiveTab('search-history')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'search-history' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> User Search & Input History
        </button>

        <button
          onClick={() => setActiveTab('apikeys')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'apikeys' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Key className="w-4 h-4" /> API Keys & Integrations
        </button>

        <button
          onClick={() => setActiveTab('backups')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'backups' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" /> Settings & Backups
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-slate-500">Loading enterprise administration state...</div>
      ) : (
        <>
          {activeTab === 'analytics' && analytics && <AnalyticsOverview analytics={analytics} />}

          {activeTab === 'users' && <UserManagementTable users={users} onRefresh={loadAdminData} />}

          {activeTab === 'rbac' && (
            <RolePermissionsMatrix roles={roles} permissions={permissions} onRefresh={loadAdminData} />
          )}

          {activeTab === 'audit' && <AuditLogTimeline logs={auditLogs} />}

          {activeTab === 'search-history' && <UserSearchHistoryTimeline history={searchHistory} />}

          {activeTab === 'apikeys' && <ApiKeyManagement apiKeys={apiKeys} onRefresh={loadAdminData} />}

          {activeTab === 'backups' && <SystemBackupSettings backups={backups} onRefresh={loadAdminData} />}
        </>
      )}
    </div>
  );
};
