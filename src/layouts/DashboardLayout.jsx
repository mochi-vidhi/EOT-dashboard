import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

/**
 * DashboardLayout — shell for all protected pages.
 * Add Sidebar / Topbar / Navbar here later.
 */
export default function DashboardLayout() {
  const dispatch = useDispatch();

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      {/* Minimal top bar — replace with real Topbar component */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <span className="font-bold text-base">EOT Crane Management</span>
        <button
          onClick={() => dispatch(logout())}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          Sign out
        </button>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

