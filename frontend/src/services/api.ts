import api from '../lib/axios';
import type { 
  User, 
  Project, 
  Estimation, 
  Brand, 
  AICopilotResult, 
  EstimationResult,
  MaterialPriceItem,
  PriceAlert,
  BrandCompareItem,
  MarketAnalytics,
  SupplierDetail,
  ProjectHealthScores,
  AIRecommendation,
  TimelinePhase,
  ChecklistCategory,
  BOQReviewResult,
  AIProjectReport,
  ReportItem,
  MarketplaceSupplier,
  SupplierMaterial,
  QuotationRequestItem,
  SupplierReview,
  SupplierCompareResult,
  SystemAnalytics,
  Role,
  Permission,
  AuditLog,
  ApiKeyItem,
  BackupRecord,
  UserSearchHistory
} from '../types';

export const authAPI = {
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (data: { email: string; password: string; full_name: string; role?: string; company_name?: string; phone_number?: string }) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
  forgotPassword: async (email: string) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },
  resetPassword: async (reset_token: string, new_password: string) => {
    const res = await api.post('/auth/reset-password', { reset_token, new_password });
    return res.data;
  },
  getProfile: async (): Promise<User> => {
    const res = await api.get('/users/profile');
    return res.data;
  },
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const res = await api.put('/users/profile', data);
    return res.data;
  },
};

export const projectsAPI = {
  list: async (params?: { q?: string; project_type?: string; status_filter?: string; min_budget?: number; max_budget?: number }): Promise<Project[]> => {
    const res = await api.get('/projects/', { params });
    return res.data;
  },
  get: async (id: number): Promise<Project> => {
    const res = await api.get(`/projects/${id}`);
    return res.data;
  },
  create: async (data: Partial<Project>): Promise<Project> => {
    const res = await api.post('/projects/', data);
    return res.data;
  },
  update: async (id: number, data: Partial<Project>): Promise<Project> => {
    const res = await api.put(`/projects/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
  duplicate: async (id: number): Promise<Project> => {
    const res = await api.post(`/projects/${id}/duplicate`);
    return res.data;
  },
};

export const estimationsAPI = {
  calculate: async (payload: any): Promise<EstimationResult> => {
    const res = await api.post('/estimations/calculate', payload);
    return res.data;
  },
  generateForProject: async (projectId: number): Promise<Estimation> => {
    const res = await api.post(`/estimations/generate/${projectId}`);
    return res.data;
  },
  recalculate: async (id: number): Promise<Estimation> => {
    const res = await api.post(`/estimations/${id}/recalculate`);
    return res.data;
  },
  save: async (data: {
    title: string;
    category: string;
    input_params: any;
    calculated_results: any;
    total_estimated_cost: number;
    notes?: string;
    project_id?: number;
  }): Promise<Estimation> => {
    const res = await api.post('/estimations/', data);
    return res.data;
  },
  list: async (project_id?: number): Promise<Estimation[]> => {
    const res = await api.get('/estimations/', { params: { project_id } });
    return res.data;
  },
  get: async (id: number): Promise<Estimation> => {
    const res = await api.get(`/estimations/${id}`);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/estimations/${id}`);
  },
};

export const brandsAPI = {
  list: async (category?: string): Promise<Brand[]> => {
    const res = await api.get('/brands/', { params: { category } });
    return res.data;
  },
};

export const marketAPI = {
  getLivePrices: async (params?: { category?: string; brand?: string; q?: string }): Promise<MaterialPriceItem[]> => {
    const res = await api.get('/market/prices', { params });
    return res.data;
  },
  getHistory: async (timeframe: string = '30D'): Promise<any[]> => {
    const res = await api.get('/market/history', { params: { timeframe } });
    return res.data;
  },
  compareBrands: async (category?: string): Promise<BrandCompareItem[]> => {
    const res = await api.get('/market/compare', { params: { category } });
    return res.data;
  },
  getAnalytics: async (): Promise<MarketAnalytics> => {
    const res = await api.get('/market/analytics');
    return res.data;
  },
  createAlert: async (data: { material_name: string; brand?: string; target_price: number; condition?: string }): Promise<PriceAlert> => {
    const res = await api.post('/market/alerts', data);
    return res.data;
  },
  listAlerts: async (): Promise<PriceAlert[]> => {
    const res = await api.get('/market/alerts');
    return res.data;
  },
  toggleAlert: async (id: number): Promise<PriceAlert> => {
    const res = await api.put(`/market/alerts/${id}`);
    return res.data;
  },
  deleteAlert: async (id: number): Promise<void> => {
    await api.delete(`/market/alerts/${id}`);
  },
  getSuppliers: async (params?: { category?: string; q?: string }): Promise<SupplierDetail[]> => {
    const res = await api.get('/market/suppliers', { params });
    return res.data;
  },
  getSupplier: async (id: number): Promise<SupplierDetail> => {
    const res = await api.get(`/market/suppliers/${id}`);
    return res.data;
  },
};

export const aiAPI = {
  estimatePrompt: async (prompt: string): Promise<AICopilotResult> => {
    const res = await api.post('/ai/estimate-prompt', { prompt });
    return res.data;
  },
  chat: async (message: string, project_id?: number): Promise<{ reply: string; suggested_followups: string[]; explanation: string }> => {
    const res = await api.post('/ai/chat', { message, project_id });
    return res.data;
  },
  getInsights: async (project_id: number): Promise<ProjectHealthScores> => {
    const res = await api.get(`/ai/insights/${project_id}`);
    return res.data;
  },
  getRecommendations: async (project_id: number): Promise<AIRecommendation[]> => {
    const res = await api.post(`/ai/recommendations/${project_id}`);
    return res.data;
  },
  getTimeline: async (project_id: number): Promise<TimelinePhase[]> => {
    const res = await api.post(`/ai/timeline/${project_id}`);
    return res.data;
  },
  getChecklists: async (project_id: number): Promise<ChecklistCategory[]> => {
    const res = await api.post(`/ai/checklist/${project_id}`);
    return res.data;
  },
  reviewBOQ: async (project_id: number): Promise<BOQReviewResult> => {
    const res = await api.post(`/ai/boq-review/${project_id}`);
    return res.data;
  },
  getReport: async (project_id: number): Promise<AIProjectReport> => {
    const res = await api.post(`/ai/report/${project_id}`);
    return res.data;
  },
};

export const reportsAPI = {
  generate: async (data: { project_id: number; report_type: string; file_format?: string; title?: string; custom_notes?: string }): Promise<ReportItem> => {
    const res = await api.post('/reports/generate', data);
    return res.data;
  },
  listHistory: async (params?: { project_id?: number; report_type?: string; q?: string }): Promise<ReportItem[]> => {
    const res = await api.get('/reports/history', { params });
    return res.data;
  },
  download: async (report_id: number): Promise<Blob> => {
    const res = await api.get(`/reports/${report_id}/download`, { responseType: 'blob' });
    return res.data;
  },
  emailReport: async (report_id: number, data: { recipient_email: string; subject?: string; message?: string; attach_format?: string }) => {
    const res = await api.post(`/reports/${report_id}/email`, data);
    return res.data;
  },
  delete: async (report_id: number): Promise<void> => {
    await api.delete(`/reports/${report_id}`);
  },
  duplicate: async (report_id: number): Promise<ReportItem> => {
    const res = await api.post(`/reports/${report_id}/duplicate`);
    return res.data;
  },
};

export const marketplaceAPI = {
  getSuppliers: async (params?: { category?: string; max_distance?: number; min_rating?: number; verified_only?: boolean; q?: string; sort_by?: string }): Promise<MarketplaceSupplier[]> => {
    const res = await api.get('/marketplace/suppliers', { params });
    return res.data;
  },
  getSupplier: async (id: number): Promise<MarketplaceSupplier> => {
    const res = await api.get(`/marketplace/suppliers/${id}`);
    return res.data;
  },
  getSupplierMaterials: async (id: number): Promise<SupplierMaterial[]> => {
    const res = await api.get(`/marketplace/suppliers/${id}/materials`);
    return res.data;
  },
  requestQuotation: async (data: { project_id?: number; supplier_ids: number[]; items: any[]; notes?: string }): Promise<QuotationRequestItem> => {
    const res = await api.post('/marketplace/quotations', data);
    return res.data;
  },
  listQuotations: async (): Promise<QuotationRequestItem[]> => {
    const res = await api.get('/marketplace/quotations');
    return res.data;
  },
  compareSuppliers: async (supplier_ids: number[]): Promise<SupplierCompareResult[]> => {
    const res = await api.post('/marketplace/compare', supplier_ids);
    return res.data;
  },
  submitReview: async (supplier_id: number, data: { rating: number; comment: string; images?: string[] }): Promise<SupplierReview> => {
    const res = await api.post(`/marketplace/suppliers/${supplier_id}/reviews`, data);
    return res.data;
  },
  toggleFavorite: async (supplier_id: number): Promise<{ status: string; is_favorite: boolean }> => {
    const res = await api.post(`/marketplace/suppliers/${supplier_id}/favorite`);
    return res.data;
  },
};

export const adminAPI = {
  getAnalytics: async (): Promise<SystemAnalytics> => {
    const res = await api.get('/admin/analytics');
    return res.data;
  },
  listUsers: async (): Promise<User[]> => {
    const res = await api.get('/admin/users');
    return res.data;
  },
  createUser: async (data: any): Promise<User> => {
    const res = await api.post('/admin/users', data);
    return res.data;
  },
  toggleUserStatus: async (user_id: number): Promise<User> => {
    const res = await api.put(`/admin/users/${user_id}/status`);
    return res.data;
  },
  listRoles: async (): Promise<Role[]> => {
    const res = await api.get('/admin/roles');
    return res.data;
  },
  listPermissions: async (): Promise<Permission[]> => {
    const res = await api.get('/admin/permissions');
    return res.data;
  },
  createRole: async (data: { name: string; description?: string; permissions: string[] }): Promise<Role> => {
    const res = await api.post('/admin/roles', data);
    return res.data;
  },
  getAuditLogs: async (params?: { category?: string; q?: string }): Promise<AuditLog[]> => {
    const res = await api.get('/admin/audit-logs', { params });
    return res.data;
  },
  getSearchHistory: async (params?: { module?: string; q?: string }): Promise<UserSearchHistory[]> => {
    const res = await api.get('/admin/search-history', { params });
    return res.data;
  },
  logSearch: async (data: { search_type: string; query: string; module?: string }): Promise<UserSearchHistory> => {
    const res = await api.post('/admin/log-search', data);
    return res.data;
  },
  getApiKeys: async (): Promise<ApiKeyItem[]> => {
    const res = await api.get('/admin/api-keys');
    return res.data;
  },
  createApiKey: async (name: string): Promise<ApiKeyItem> => {
    const res = await api.post('/admin/api-keys', null, { params: { name } });
    return res.data;
  },
  getBackups: async (): Promise<BackupRecord[]> => {
    const res = await api.get('/admin/backups');
    return res.data;
  },
  triggerBackup: async (): Promise<BackupRecord> => {
    const res = await api.post('/admin/backups');
    return res.data;
  },
};
