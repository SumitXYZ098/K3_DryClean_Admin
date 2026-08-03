import type React from "react";
import { Routes, Route, Navigate } from "react-router";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";
import SetNewPasswordPage from "../pages/auth/SetNewPasswordPage";
import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import CustomersPage from "../pages/customers/CustomersPage";
import PlaceholderPage from "../pages/common/PlaceholderPage";
import useAuthStore from "../store/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const AppRoute = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicOnlyRoute>
            <ForgotPasswordPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/verify-otp"
        element={
          <PublicOnlyRoute>
            <VerifyOtpPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/set-new-password"
        element={
          <PublicOnlyRoute>
            <SetNewPasswordPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/reset-password"
        element={<Navigate to="/set-new-password" replace />}
      />

      {/* Protected Admin Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/orders"
          element={
            <PlaceholderPage
              title="Orders Management"
              icon="receipt_long"
              description="Monitor, update, and manage customer dry cleaning and laundry orders."
            />
          }
        />
        <Route path="/customers" element={<CustomersPage />} />
        <Route
          path="/drivers"
          element={
            <PlaceholderPage
              title="Driver Logistics"
              icon="local_shipping"
              description="Track live driver routes, active pickups, and deliveries."
            />
          }
        />
        <Route
          path="/staff"
          element={
            <PlaceholderPage
              title="Staff Roster"
              icon="badge"
              description="Manage store employees, shift schedules, and operational permissions."
            />
          }
        />
        <Route
          path="/services"
          element={
            <PlaceholderPage
              title="Services & Pricing"
              icon="dry_cleaning"
              description="Configure dry cleaning services, garment categories, and pricing tiers."
            />
          }
        />
        <Route
          path="/payments"
          element={
            <PlaceholderPage
              title="Payments & Invoices"
              icon="payments"
              description="Review transactions, online payments, payouts, and revenue statements."
            />
          }
        />
        <Route
          path="/promotions"
          element={
            <PlaceholderPage
              title="Promotions & Discounts"
              icon="sell"
              description="Create promo codes, seasonal discounts, and loyalty campaigns."
            />
          }
        />
        <Route
          path="/reports"
          element={
            <PlaceholderPage
              title="Analytics & Reports"
              icon="assessment"
              description="Generate detailed revenue, order volume, and driver performance reports."
            />
          }
        />
        <Route
          path="/settings"
          element={
            <PlaceholderPage
              title="System Settings"
              icon="settings"
              description="Configure store details, notification preferences, and system parameters."
            />
          }
        />
      </Route>

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoute;
