import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { ScrollToTop } from './components/common/ScrollToTop';
import { PublicLayout } from './components/layout/PublicLayout';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { RequestQuotePage } from './pages/RequestQuotePage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner message="Verifying administrative session..." />
      </div>
    );
  }

  return isAuthenticated && isAdmin ? children : <Navigate to="/admin/login" replace />;
}

function ProtectedSuperAdminRoute({ children }: { children: React.ReactNode }) {
  const { isSuperAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner message="Verifying administrative session..." />
      </div>
    );
  }

  return isSuperAdmin ? children : <Navigate to="/admin" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes with Navbar and Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/request-quote" element={<RequestQuotePage />} />
          </Route>

          {/* Admin Management Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard initialTab="csharp" />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/csharp"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard initialTab="csharp" />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/super"
            element={
              <ProtectedSuperAdminRoute>
                <AdminDashboard initialTab="super" />
              </ProtectedSuperAdminRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
