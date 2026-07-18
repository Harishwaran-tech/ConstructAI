import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';

import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';

import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectWizard } from './pages/ProjectWizard';
import { ProjectDetail } from './pages/ProjectDetail';
import { Estimator } from './pages/Estimator';
import { CostEstimation } from './pages/CostEstimation';
import { BrandComparison } from './pages/BrandComparison';
import { NearbySuppliers } from './pages/NearbySuppliers';
import { AIAssistant } from './pages/AIAssistant';
import { Reports } from './pages/Reports';
import { SupplierProfile } from './pages/SupplierProfile';
import { AdminSystem } from './pages/AdminSystem';
import { ProjectHistory } from './pages/ProjectHistory';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected Enterprise Layout Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/new" element={<ProjectWizard />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/estimator" element={<Estimator />} />
                <Route path="/cost-estimation" element={<CostEstimation />} />
                <Route path="/brands" element={<BrandComparison />} />
                <Route path="/suppliers" element={<NearbySuppliers />} />
                <Route path="/suppliers/:id" element={<SupplierProfile />} />
                <Route path="/ai-copilot" element={<AIAssistant />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/admin" element={<AdminSystem />} />
                <Route path="/history" element={<ProjectHistory />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Catch-all Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
