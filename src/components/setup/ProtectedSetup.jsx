import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Protected /setup admin routes: require a Supabase session.
 * Unauthenticated users are sent to /setup/login (with return path preserved).
 */
export default function ProtectedSetup({ children }) {
  const { session, loading, configured } = useAuth();
  const location = useLocation();

  if (configured && loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Loading</span>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/setup/login" state={{ from: location.pathname }} replace />;
  }

  if (!configured) {
    return (
      <div className="p-8 md:p-12 max-w-xl">
        <p className="text-sm font-bold uppercase tracking-widest opacity-80">
          Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see
          .env.example), then refresh.
        </p>
      </div>
    );
  }

  return children;
}
