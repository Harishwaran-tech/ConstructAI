export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  company_name?: string;
  phone_number?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface PlotDetails {
  length?: number;
  width?: number;
  total_area?: number;
  built_up_area?: number;
  carpet_area?: number;
  floors?: number;
  basement_available?: boolean;
  parking_area?: number;
  open_area?: number;
  road_facing?: boolean;
  plot_shape?: string;
  facing_direction?: string;
}

export interface StructuralDetails {
  foundation_type?: string;
  concrete_grade?: string;
  brick_type?: string;
  wall_thickness?: string;
  beam_size?: string;
  column_size?: string;
  slab_thickness?: string;
  roof_type?: string;
  roof_height?: number;
  floor_height?: number;
  door_count?: number;
  window_count?: number;
  staircase_count?: number;
  lift_available?: boolean;
  water_tank_capacity?: number;
  septic_tank_available?: boolean;
}

export interface MaterialPreferences {
  cement_brand?: string;
  steel_brand?: string;
  brick_type?: string;
  sand_type?: string;
  paint_brand?: string;
  pipe_brand?: string;
  electrical_brand?: string;
}

export interface LabourDetails {
  engineers?: number;
  supervisors?: number;
  masons?: number;
  helpers?: number;
  electricians?: number;
  plumbers?: number;
  painters?: number;
  carpenters?: number;
  total_labourers?: number;
  expected_working_days?: number;
  daily_labour_cost?: number;
}

export interface BudgetDetails {
  estimated_budget?: number;
  max_budget?: number;
  emergency_fund?: number;
  material_budget?: number;
  labour_budget?: number;
  misc_budget?: number;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  client_name?: string;
  owner_name?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  google_maps_url?: string;
  project_type: string;
  built_up_area: number;
  total_budget: number;
  currency: string;
  measurement_units?: string;
  status: string;
  completion_percentage?: number;
  start_date?: string;
  end_date?: string;
  plot_details?: PlotDetails;
  structural_details?: StructuralDetails;
  material_preferences?: MaterialPreferences;
  labour_details?: LabourDetails;
  budget_details?: BudgetDetails;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

export interface MaterialItem {
  name: string;
  category: string;
  recommended_grade?: string;
  recommended_brand?: string;
  req_qty: number;
  unit: string;
  weight: number;
  waste_pct: number;
  final_qty: number;
  unit_price: number;
  total_price: number;
  description?: string;
  alternative?: string;
  specs?: string;
  engineering_notes?: string;
  lifetime?: string;
  usage_instructions?: string;
  storage_instructions?: string;
  safety_notes?: string;
}

export interface EstimationSummary {
  total_materials_count: number;
  total_estimated_quantity: number;
  total_estimated_weight_kg: number;
  total_material_cost: number;
  average_material_cost: number;
  most_expensive_material: string;
  largest_quantity_material: string;
}

export interface EstimationResult {
  concrete_volume_cuft?: number;
  concrete_volume_m3?: number;
  wall_area_sqft?: number;
  items: MaterialItem[];
  summary: EstimationSummary;
}

export interface Estimation {
  id: number;
  title: string;
  category: string;
  input_params: Record<string, any>;
  calculated_results: EstimationResult;
  total_estimated_cost: number;
  notes?: string;
  project_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: number;
  category: string;
  name: string;
  manufacturer?: string;
  unit: string;
  unit_price: number;
  grade_spec?: string;
  rating: number;
  description?: string;
  availability: string;
  tier: string;
  created_at: string;
}

export interface AICopilotResult {
  prompt: string;
  detected_specs: {
    built_up_area_sqft: number;
    floors: number;
    estimated_timeline_months: number;
  };
  category_breakdown: Record<string, number>;
  consolidated_materials: MaterialItem[];
  grand_total_cost: number;
  ai_insights: string[];
}

export interface MaterialPriceItem {
  id: number;
  name: string;
  category: string;
  brand: string;
  company?: string;
  grade?: string;
  unit: string;
  current_price: number;
  previous_price: number;
  price_diff: number;
  pct_change: number;
  trend: string;
  availability: string;
  stock_status: string;
  supplier_name?: string;
  location?: string;
  last_updated: string;
}

export interface PriceAlert {
  id: number;
  user_id: number;
  material_name: string;
  brand?: string;
  target_price: number;
  condition: string;
  is_active: boolean;
  created_at: string;
}

export interface BrandCompareItem {
  brand_name: string;
  manufacturer: string;
  current_price: number;
  grade: string;
  unit: string;
  quality_rating: number;
  popularity: string;
  estimated_delivery: string;
  warranty: string;
  user_rating: number;
  category: string;
}

export interface MarketAnalytics {
  avg_cement_price: number;
  avg_steel_price: number;
  market_price_index: number;
  weekly_change_pct: number;
  monthly_change_pct: number;
  top_rising: { name: string; pct: string; price: string }[];
  top_falling: { name: string; pct: string; price: string }[];
  ai_insights: string[];
}

export interface SupplierDetail {
  id: number;
  name: string;
  company?: string;
  location: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  tier: string;
  rating: number;
  distance: string;
  delivery_time: string;
  delivery_charges: number;
  opening_hours: string;
  categories_stocked?: string[];
  available_brands?: string[];
  description?: string;
}

export interface ProjectHealthScores {
  health_score: number;
  budget_score: number;
  material_efficiency_score: number;
  readiness_score: number;
  risk_level: string;
  confidence_pct: number;
}

export interface AIRecommendation {
  category: string;
  title: string;
  description: string;
  estimated_savings: number;
  impact: string;
  mitigation_step?: string;
}

export interface TimelinePhase {
  phase_name: string;
  duration_days: number;
  estimated_start: string;
  estimated_end: string;
  key_milestones: string[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  mandatory: boolean;
}

export interface ChecklistCategory {
  category: string;
  items: ChecklistItem[];
}

export interface BOQReviewResult {
  missing_items: string[];
  duplicate_items: string[];
  inconsistencies: string[];
  cost_anomalies: string[];
  overall_health_verdict: string;
}

export interface AIProjectReport {
  project_id: number;
  title: string;
  executive_summary: string;
  health_scores: ProjectHealthScores;
  budget_analysis: Record<string, any>;
  material_analysis: Record<string, any>;
  risk_analysis: { risk: string; level: string; impact: string; mitigation: string }[];
  timeline: TimelinePhase[];
  recommendations: AIRecommendation[];
}

export interface ReportItem {
  id: number;
  project_id?: number;
  user_id: number;
  report_type: string;
  title: string;
  description?: string;
  file_format: string;
  file_path?: string;
  file_size_kb: number;
  created_at: string;
}

export interface SupplierMaterial {
  id: number;
  supplier_id: number;
  material_name: string;
  category: string;
  brand: string;
  grade?: string;
  specs?: string;
  unit: string;
  current_price: number;
  discount_pct: number;
  available_qty: number;
  stock_status: string;
  restock_date?: string;
  delivery_time: string;
  delivery_charge: number;
  min_order: number;
  max_order: number;
}

export interface SupplierReview {
  id: number;
  supplier_id: number;
  user_id: number;
  user_name: string;
  rating: number;
  comment: string;
  images?: string[];
  created_at: string;
}

export interface MarketplaceSupplier {
  id: number;
  name: string;
  company: string;
  logo?: string;
  tier: string;
  phone: string;
  email?: string;
  website?: string;
  gst_number?: string;
  business_registration?: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  distance_miles?: number;
  travel_time_mins?: number;
  rating: number;
  review_count: number;
  is_verified: boolean;
  is_open_now: boolean;
  opening_hours: string;
  branches?: string[];
  payment_methods?: string[];
  certifications?: string[];
  gallery?: string[];
  description?: string;
  materials?: SupplierMaterial[];
  reviews?: SupplierReview[];
}

export interface QuotationRequestItem {
  id: number;
  user_id: number;
  project_id?: number;
  supplier_ids: number[];
  items: Record<string, any>[];
  notes?: string;
  status: string;
  total_quoted_amount: number;
  created_at: string;
}

export interface SupplierCompareResult {
  supplier_id: number;
  name: string;
  company: string;
  price_total: number;
  distance_miles: number;
  delivery_time: string;
  delivery_charge: number;
  rating: number;
  stock_availability: string;
  recommendation_badge: string;
}

export interface SystemAnalytics {
  total_users: number;
  active_users: number;
  inactive_users: number;
  total_projects: number;
  materials_estimated: number;
  reports_generated: number;
  total_suppliers: number;
  ai_requests: number;
  user_growth_chart: { date: string; users: number }[];
  project_growth_chart: { date: string; projects: number }[];
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  is_system_role: boolean;
  permissions: string[];
}

export interface Permission {
  id: number;
  code: string;
  name: string;
  category: string;
}

export interface AuditLog {
  id: number;
  user_email?: string;
  action: string;
  category: string;
  details?: string;
  ip_address?: string;
  created_at: string;
}

export interface ApiKeyItem {
  id: number;
  name: string;
  key_prefix: string;
  is_active: boolean;
  rate_limit_per_min: number;
  created_at: string;
}

export interface BackupRecord {
  id: number;
  filename: string;
  size_mb: number;
  status: string;
  created_at: string;
}

export interface UserSearchHistory {
  id: number;
  user_email?: string;
  search_type: string;
  query: string;
  module: string;
  created_at: string;
}

