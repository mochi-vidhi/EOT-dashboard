import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../store/authSlice";

import ProtectedRoute from "./ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Auth pages
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Dashboard placeholder — replace with real pages later
function DashboardHome() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">EOT Dashboard</h1>
      <p className="text-muted-foreground mt-2">Welcome! You are logged in.</p>
    </div>
  );
}

/**
 * GuestRoute — redirects authenticated users away from auth pages
 */
function GuestRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Default redirect ── */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ── Auth routes (guest-only) ── */}
      <Route
        element={
          <GuestRoute>
            <AuthLayout />
          </GuestRoute>
        }
      >
        <Route path="/login"           element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />
      </Route>

      {/* ── Protected routes (auth required) ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          {/* Add more protected routes here */}
        </Route>
      </Route>

      {/* ── 404 catch-all ── */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

