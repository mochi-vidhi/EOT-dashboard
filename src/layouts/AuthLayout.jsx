import { Outlet } from "react-router-dom";

/**
 * AuthLayout — wraps all public auth pages (Login, ForgotPassword, ResetPassword).
 * Renders nothing extra; child pages own their full-screen split layout.
 */
export default function AuthLayout() {
  return <Outlet />;
}

