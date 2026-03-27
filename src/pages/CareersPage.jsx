import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [jobsLoaded, setJobsLoaded] = useState(!supabase);

  useEffect(() => {
    document.title = "Careers | Tensor1";
    return () => {
      document.title = "Tensor1 | AI Engineering";
    };
  }, []);

  useEffect(() => {
    if (!supabase) {
      setJobsLoaded(true);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("job_postings")
        .select("id, role_id, title, description, experience, created_at")
        .is("archived_at", null)
        .order("created_at", { ascending: false });
      if (!cancelled) {
        if (!error && data) setJobs(data);
        setJobsLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col min-h-0">
      <div className="border-b border-grid">
        <div className="swiss-grid">
          <div className="col-span-12 lg:col-span-4 p-8 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-grid">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-swiss-red dark:text-swiss-red mb-4 block">
              Join us
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-tight">
              Careers
            </h1>
          </div>
          <div className="col-span-12 lg:col-span-8 p-8 md:p-12 lg:p-16 flex flex-col justify-center gap-6">
            <p className="text-lg md:text-xl font-bold uppercase tracking-tight">
              Build with a team that ships production AI systems.
            </p>
            <p className="uppercase tracking-widest text-sm font-bold opacity-60 leading-relaxed max-w-2xl">
              Open roles are listed below. For general inquiries, send your resume and a short note about
              what you want to build.
            </p>
            <a
              href="mailto:careers@tensor1.xyz"
              className="inline-flex items-center gap-2 self-start font-bold uppercase tracking-widest text-sm hover:text-swiss-red transition-colors group mt-2"
            >
              careers@tensor1.xyz
              <span className="material-symbols-outlined text-lg transform group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="swiss-grid flex-1">
        <div className="col-span-12">
          {!jobsLoaded && (
            <div className="p-8 md:p-12 border-b border-grid">
              <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Loading roles</span>
            </div>
          )}
          {jobsLoaded && jobs.length === 0 && (
            <div className="border-b border-grid p-8 md:p-12 lg:p-16">
              <p className="text-lg md:text-xl font-bold uppercase tracking-tight mb-4">
                We are not hiring right now.
              </p>
              <p className="uppercase tracking-widest text-sm font-bold opacity-60 leading-relaxed max-w-2xl">
                We are always on the lookout for new talent. If you would like us to keep you in mind, send
                your resume and a short note about what you want to build.
              </p>
            </div>
          )}
          {jobs.length > 0 && (
            <ul className="flex flex-col">
              {jobs.map((job) => (
                <li key={job.id} className="border-b border-grid last:border-b-0">
                  <article className="group transition-colors duration-200 hover:bg-swiss-red hover:text-swiss-black dark:hover:bg-swiss-red dark:hover:text-swiss-black">
                    <div className="p-8 md:p-10 lg:p-12 flex flex-col gap-4">
                      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest opacity-60 group-hover:opacity-80">
                          {job.role_id}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-widest opacity-50 group-hover:opacity-70">
                          {job.created_at
                            ? new Date(job.created_at).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : null}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase">
                        {job.title}
                      </h2>
                      {job.experience && (
                        <p className="text-sm font-bold uppercase tracking-widest opacity-80 max-w-3xl">
                          Experience: {job.experience}
                        </p>
                      )}
                      {job.description && (
                        <p className="text-sm md:text-base font-medium leading-relaxed opacity-90 max-w-3xl whitespace-pre-wrap">
                          {job.description}
                        </p>
                      )}
                      <a
                        href={`mailto:careers@tensor1.xyz?subject=${encodeURIComponent(`Application: ${job.role_id} ${job.title}`)}`}
                        className="inline-flex items-center gap-2 self-start font-bold uppercase tracking-widest text-sm mt-2 underline-offset-4 hover:underline"
                      >
                        Apply
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                      </a>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
