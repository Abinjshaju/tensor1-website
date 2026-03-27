import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function SignupPage() {
  const { signUp, session, loading, configured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Setup | Sign up | Tensor1";
    return () => {
      document.title = "Tensor1 | AI Engineering";
    };
  }, []);

  if (configured && session) {
    return <Navigate to="/setup" replace />;
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
    setMessage("");
    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    const { data, error: err } = await signUp(email.trim(), password, authorName.trim() || undefined);
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (data?.user && !data.session) {
      setMessage(
        "We sent a confirmation link to your email. Open it to verify your account, then return here and sign in on the login page."
      );
      setPassword("");
      setPasswordConfirm("");
    } else if (data?.session) {
      setMessage("Account ready. You can open the dashboard (email confirmation is off in this project).");
    } else {
      setMessage("Check your email for next steps, then sign in.");
    }
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
              Sign up
            </h1>
          </div>
          <div className="col-span-12 lg:col-span-8 p-8 md:p-12 lg:p-16 flex flex-col justify-center gap-6 max-w-xl">
            {!configured && (
              <p className="text-sm font-bold uppercase tracking-tight opacity-80">
                Configure Supabase environment variables before you can create an account.
              </p>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                  Author name (optional)
                </span>
                <input
                  type="text"
                  autoComplete="name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  disabled={!configured || submitting}
                  className="border border-grid bg-transparent px-4 py-3 font-bold uppercase tracking-tight outline-none focus:ring-2 focus:ring-swiss-red/40"
                />
              </label>
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
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={!configured || submitting}
                  className="border border-grid bg-transparent px-4 py-3 font-bold uppercase tracking-tight outline-none focus:ring-2 focus:ring-swiss-red/40"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                  Confirm password
                </span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                  minLength={6}
                  disabled={!configured || submitting}
                  className="border border-grid bg-transparent px-4 py-3 font-bold uppercase tracking-tight outline-none focus:ring-2 focus:ring-swiss-red/40"
                />
              </label>
              {error && (
                <p className="text-sm font-bold uppercase tracking-tight text-swiss-red" role="alert">
                  {error}
                </p>
              )}
              {message && (
                <div className="space-y-4" role="status">
                  <p className="text-sm font-bold uppercase tracking-tight opacity-90 leading-relaxed">
                    {message}
                  </p>
                  <Link
                    to="/setup/login"
                    className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-sm text-swiss-red hover:underline"
                  >
                    Go to login
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </Link>
                </div>
              )}
              <button
                type="submit"
                disabled={!configured || submitting}
                className="self-start px-8 py-4 bg-swiss-black dark:bg-swiss-white text-swiss-white dark:text-swiss-black font-bold uppercase tracking-widest text-sm hover:bg-swiss-red hover:text-swiss-black dark:hover:bg-swiss-red dark:hover:text-swiss-black transition-colors disabled:opacity-40"
              >
                {submitting ? "Creating…" : "Create account"}
              </button>
            </form>
            <p className="text-xs font-bold uppercase tracking-widest opacity-60">
              Already have an account?{" "}
              <Link to="/setup/login" className="text-swiss-red hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
