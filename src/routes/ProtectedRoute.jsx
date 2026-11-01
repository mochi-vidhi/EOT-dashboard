import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectIsAuthenticated } from "../store/authSlice";

/**
 * ProtectedRoute
 * Wraps any routes that require authentication.
 * Redirects unauthenticated users to /login,
 * storing the intended destination in location.state.from
 * so we can redirect back after login.
 */
export default function ProtectedRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}

