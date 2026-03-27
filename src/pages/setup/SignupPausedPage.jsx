import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function SignupPausedPage() {
  useEffect(() => {
    document.title = "Setup | Sign up | Tensor1";
    return () => {
      document.title = "Tensor1 | AI Engineering";
    };
  }, []);

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
            <p className="text-lg md:text-xl font-bold uppercase tracking-tight">
              New account registration is temporarily paused.
            </p>
            <p className="uppercase tracking-widest text-sm font-bold opacity-60 leading-relaxed">
              If you already have an account, sign in below. Contact your administrator if you need
              access.
            </p>
            <Link
              to="/setup/login"
              className="inline-flex items-center gap-2 self-start px-8 py-4 bg-swiss-black dark:bg-swiss-white text-swiss-white dark:text-swiss-black font-bold uppercase tracking-widest text-sm hover:bg-swiss-red hover:text-swiss-black transition-colors"
            >
              Go to login
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
