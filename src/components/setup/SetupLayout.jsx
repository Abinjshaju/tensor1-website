import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { SETUP_SIGNUP_ENABLED } from "../../config/setupFlags";

export default function SetupLayout() {
  const { toggleTheme } = useTheme();
  const { session, signOut, configured } = useAuth();
  const location = useLocation();
  const isAuthScreen =
    location.pathname === "/setup/login" || location.pathname === "/setup/signup";

  useEffect(() => {
    document.body.classList.add("setup-route");
    return () => document.body.classList.remove("setup-route");
  }, []);

  return (
    <div className="setup-root bg-swiss-white dark:bg-swiss-black text-swiss-black dark:text-swiss-white transition-colors duration-200 antialiased overflow-x-hidden font-swiss border-x border-grid max-w-[1920px] mx-auto min-h-screen flex flex-col">
      <header
        className="border-b border-grid sticky top-0 bg-swiss-white dark:bg-swiss-black z-50 transition-colors duration-200"
        style={{ borderBottomWidth: 2 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-stretch min-h-20">
          <Link
            to={session ? "/setup" : "/setup/login"}
            className="flex items-center gap-3 px-6 py-4 border-b lg:border-b-0 lg:border-r border-grid lg:w-[28%] xl:w-[26%] shrink-0"
          >
            <div className="w-8 h-8 bg-swiss-red flex items-center justify-center font-bold text-swiss-black text-sm shrink-0">
              T1
            </div>
            <span className="text-xl font-black tracking-tighter">
              TENSOR1<span className="text-swiss-red">.</span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest opacity-50 hidden sm:inline">
              Setup
            </span>
          </Link>

          {!session && (
            <div className="flex-1 px-6 py-4 border-b lg:border-b-0 lg:border-r border-grid flex items-center min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest opacity-60">
                Sign in to manage blogs and job postings
              </p>
            </div>
          )}

          <div className="flex items-stretch shrink-0">
            <Link
              to="/"
              className="flex-1 min-w-[5rem] flex items-center justify-center font-bold text-xs uppercase tracking-widest border-r border-grid hover:bg-swiss-red hover:text-swiss-black transition-colors px-4"
            >
              Site
            </Link>
            {session ? (
              <button
                type="button"
                onClick={() => signOut()}
                className="flex-1 min-w-[5rem] flex items-center justify-center font-bold text-xs uppercase tracking-widest border-r border-grid hover:bg-swiss-red hover:text-swiss-black transition-colors px-4"
              >
                Sign out
              </button>
            ) : (
              <>
                <Link
                  to="/setup/login"
                  className="flex-1 min-w-[5rem] flex items-center justify-center font-bold text-xs uppercase tracking-widest border-r border-grid hover:bg-swiss-red hover:text-swiss-black transition-colors px-4"
                >
                  Login
                </Link>
                {SETUP_SIGNUP_ENABLED && (
                  <Link
                    to="/setup/signup"
                    className="flex-1 min-w-[5rem] flex items-center justify-center font-bold text-xs uppercase tracking-widest border-r border-grid hover:bg-swiss-red hover:text-swiss-black transition-colors px-4"
                  >
                    Sign up
                  </Link>
                )}
              </>
            )}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-16 md:w-20 flex items-center justify-center hover:bg-swiss-red hover:text-swiss-black transition-colors outline-none shrink-0 border-r border-grid lg:border-r-0"
              aria-label="Toggle theme"
            >
              <span className="material-symbols-outlined dark:hidden">dark_mode</span>
              <span className="material-symbols-outlined hidden dark:block">light_mode</span>
            </button>
          </div>
        </div>
      </header>

      {session && !isAuthScreen && (
        <nav className="flex flex-wrap border-b border-grid">
          <NavLink
            end
            to="/setup"
            className={({ isActive }) =>
              `flex-1 min-w-[5.5rem] flex items-center justify-center font-bold text-xs uppercase tracking-widest border-r border-grid py-3 hover:bg-swiss-red hover:text-swiss-black transition-colors ${
                isActive ? "bg-swiss-red/15 dark:bg-swiss-red/20" : ""
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/setup/blog"
            className={({ isActive }) =>
              `flex-1 min-w-[5.5rem] flex items-center justify-center font-bold text-xs uppercase tracking-widest border-r border-grid py-3 hover:bg-swiss-red hover:text-swiss-black transition-colors ${
                isActive ? "bg-swiss-red/15 dark:bg-swiss-red/20" : ""
              }`
            }
          >
            Blogs
          </NavLink>
          <NavLink
            to="/setup/jobs"
            className={({ isActive }) =>
              `flex-1 min-w-[5.5rem] flex items-center justify-center font-bold text-xs uppercase tracking-widest border-r border-grid py-3 hover:bg-swiss-red hover:text-swiss-black transition-colors ${
                isActive ? "bg-swiss-red/15 dark:bg-swiss-red/20" : ""
              }`
            }
          >
            Jobs
          </NavLink>
          <NavLink
            to="/setup/dashboard"
            className={({ isActive }) =>
              `flex-1 min-w-[5.5rem] flex items-center justify-center font-bold text-xs uppercase tracking-widest py-3 hover:bg-swiss-red hover:text-swiss-black transition-colors ${
                isActive ? "bg-swiss-red/15 dark:bg-swiss-red/20" : ""
              }`
            }
          >
            Profile
          </NavLink>
        </nav>
      )}

      <main className="flex-1 flex flex-col min-h-0">
        {!configured && (
          <div className="border-b border-grid px-6 py-3 bg-swiss-black/5 dark:bg-swiss-white/5">
            <p className="text-xs font-bold uppercase tracking-widest text-swiss-red">
              Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example)
            </p>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}
