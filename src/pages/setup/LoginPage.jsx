import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { SETUP_SIGNUP_ENABLED } from "../../config/setupFlags";

export default function LoginPage() {
  const { signIn, session, loading, configured } = useAuth();
  const location = useLocation();
  const from = location.state?.from || "/setup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Setup | Login | Tensor1";
    return () => {
      document.title = "Tensor1 | AI Engineering";
    };
  }, []);

  if (configured && session) {
    return <Navigate to={from} replace />;
  }

  if (configured && loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] p-16">
        <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Loading</span>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error: err } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (err) setError(err.message);
  }

  return (
    <div className="flex flex-col min-h-0 flex-1">
      <div className="border-b border-grid">
        <div className="swiss-grid">
          <div className="col-span-12 lg:col-span-4 p-8 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-grid">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-swiss-red dark:text-swiss-red mb-4 block">
              Setup
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
              Login
            </h1>
          </div>
          <div className="col-span-12 lg:col-span-8 p-8 md:p-12 lg:p-16 flex flex-col justify-center gap-6 max-w-xl">
            {!configured && (
              <p className="text-sm font-bold uppercase tracking-tight opacity-80">
                Configure Supabase environment variables before you can sign in.
              </p>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-widest opacity-60">Email</span>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={!configured || submitting}
                  className="border border-grid bg-transparent px-4 py-3 font-bold uppercase tracking-tight outline-none focus:ring-2 focus:ring-swiss-red/40"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-widest opacity-60">Password</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={!configured || submitting}
                  className="border border-grid bg-transparent px-4 py-3 font-bold uppercase tracking-tight outline-none focus:ring-2 focus:ring-swiss-red/40"
                />
              </label>
              {error && (
                <p className="text-sm font-bold uppercase tracking-tight text-swiss-red" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={!configured || submitting}
                className="self-start px-8 py-4 bg-swiss-black dark:bg-swiss-white text-swiss-white dark:text-swiss-black font-bold uppercase tracking-widest text-sm hover:bg-swiss-red hover:text-swiss-black dark:hover:bg-swiss-red dark:hover:text-swiss-black transition-colors disabled:opacity-40"
              >
                {submitting ? "Signing in…" : "Sign in"}
              </button>
            </form>
            <p className="text-xs font-bold uppercase tracking-widest opacity-60">
              {SETUP_SIGNUP_ENABLED ? (
                <>
                  No account?{" "}
                  <Link to="/setup/signup" className="text-swiss-red hover:underline">
                    Sign up
                  </Link>
                </>
              ) : (
                <>New account registration is temporarily paused.</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
