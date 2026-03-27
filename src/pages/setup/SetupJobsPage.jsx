import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { isValidRoleId, roleIdHint } from "../../utils/roleId";
import { AdminJobCard } from "../../components/setup/AdminEntityCards";

const jobsCardGridClass = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

export default function SetupJobsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobEditId, setJobEditId] = useState(null);
  const [jobRoleId, setJobRoleId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [jobMessage, setJobMessage] = useState("");
  const [jobError, setJobError] = useState("");
  const [jobBusy, setJobBusy] = useState(false);
  const [jobsList, setJobsList] = useState([]);

  useEffect(() => {
    document.title = "Setup | Jobs | Tensor1";
    return () => {
      document.title = "Tensor1 | AI Engineering";
    };
  }, []);

  const loadMyJobs = useCallback(async () => {
    if (!supabase || !user) return;
    const { data, error } = await supabase
      .from("job_postings")
      .select("id, role_id, title, description, experience, created_at, archived_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) setJobsList(data);
  }, [user]);

  useEffect(() => {
    loadMyJobs();
  }, [loadMyJobs]);

  useEffect(() => {
    const editJobId = location.state?.editJobId;
    if (!editJobId || !supabase || !user) return;
    let cancelled = false;
    (async () => {
      await loadJob(editJobId);
      if (!cancelled) navigate("/setup/jobs", { replace: true, state: {} });
    })();
    return () => {
      cancelled = true;
    };
  }, [location.state?.editJobId, user?.id]);

  function resetJobForm() {
    setJobEditId(null);
    setJobRoleId("");
    setJobTitle("");
    setJobDescription("");
    setJobExperience("");
    setJobMessage("");
    setJobError("");
  }

  async function loadJob(id) {
    if (!supabase || !user) return;
    setJobError("");
    setJobMessage("");
    const { data, error } = await supabase
      .from("job_postings")
      .select("id, role_id, title, description, experience")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (error || !data) {
      setJobError(error?.message || "Job not found.");
      return;
    }
    setJobEditId(data.id);
    setJobRoleId(data.role_id ?? "");
    setJobTitle(data.title ?? "");
    setJobDescription(data.description ?? "");
    setJobExperience(data.experience ?? "");
  }

  async function handleJobSubmit(e) {
    e.preventDefault();
    setJobError("");
    setJobMessage("");
    if (!supabase || !user) return;

    if (jobEditId) {
      setJobBusy(true);
      const { error } = await supabase
        .from("job_postings")
        .update({
          title: jobTitle.trim(),
          description: jobDescription.trim() || null,
          experience: jobExperience.trim() || null,
        })
        .eq("id", jobEditId)
        .eq("user_id", user.id);
      setJobBusy(false);
      if (error) setJobError(error.message);
      else {
        setJobMessage("Job updated.");
        await loadMyJobs();
      }
      return;
    }

    const rid = jobRoleId.trim().toUpperCase();
    if (!isValidRoleId(rid)) {
      setJobError(`Role ID must match ${roleIdHint()}`);
      return;
    }
    setJobBusy(true);
    const { error } = await supabase.from("job_postings").insert({
      user_id: user.id,
      role_id: rid,
      title: jobTitle.trim(),
      description: jobDescription.trim() || null,
      experience: jobExperience.trim() || null,
    });
    setJobBusy(false);
    if (error) setJobError(error.message);
    else {
      setJobMessage("Job posting created.");
      resetJobForm();
      await loadMyJobs();
    }
  }

  async function deleteJob(id) {
    if (!supabase || !user) return;
    if (!window.confirm("Delete this job posting permanently? This cannot be undone.")) return;
    const { error } = await supabase.from("job_postings").delete().eq("id", id).eq("user_id", user.id);
    if (error) window.alert(error.message);
    else {
      if (jobEditId === id) resetJobForm();
      await loadMyJobs();
    }
  }

  async function archiveJob(id) {
    if (!supabase || !user) return;
    const { error } = await supabase
      .from("job_postings")
      .update({ archived_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) window.alert(error.message);
    await loadMyJobs();
  }

  async function unarchiveJob(id) {
    if (!supabase || !user) return;
    const { error } = await supabase
      .from("job_postings")
      .update({ archived_at: null })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) window.alert(error.message);
    await loadMyJobs();
  }

  const inputClass =
    "border border-grid bg-transparent px-4 py-3 font-bold uppercase tracking-tight outline-none focus:ring-2 focus:ring-swiss-red/40 w-full";
  const labelClass = "text-xs font-bold uppercase tracking-widest opacity-60";

  const jobsLive = jobsList.filter((j) => !j.archived_at);
  const jobsArchived = jobsList.filter((j) => j.archived_at);

  return (
    <div className="flex flex-col min-h-0 flex-1">
      <div className="border-b border-grid">
        <div className="swiss-grid">
          <div className="col-span-12 lg:col-span-4 p-8 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-grid">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-swiss-red dark:text-swiss-red mb-4 block">
              Setup
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
              Jobs
            </h1>
            <p className="mt-6 uppercase tracking-widest text-sm font-bold opacity-60 leading-relaxed max-w-sm">
              Create and edit listings shown on the careers page. Archive hides a job from the public site.
              Role ID cannot be changed when editing.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-8 p-8 md:p-12 lg:p-16 flex flex-col gap-16">
            <section>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                <h2 className="text-xl font-black uppercase tracking-tighter">
                  {jobEditId ? "Edit job" : "New job posting"}
                </h2>
                {jobEditId && (
                  <button
                    type="button"
                    onClick={resetJobForm}
                    className="self-start font-bold uppercase tracking-widest text-xs border border-grid px-4 py-2 hover:bg-swiss-red hover:text-swiss-black transition-colors"
                  >
                    New job
                  </button>
                )}
              </div>
              <form onSubmit={handleJobSubmit} className="flex flex-col gap-6 max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-widest opacity-60 max-w-2xl leading-relaxed">
                  {roleIdHint()}
                </p>
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Role ID</span>
                  <input
                    type="text"
                    value={jobRoleId}
                    onChange={(e) => setJobRoleId(e.target.value.toUpperCase())}
                    className={`${inputClass} ${jobEditId ? "opacity-70 cursor-not-allowed" : ""}`}
                    placeholder="T-101234"
                    required={!jobEditId}
                    disabled={Boolean(jobEditId)}
                    readOnly={Boolean(jobEditId)}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Job title</span>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className={inputClass}
                    required
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Job description</span>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={5}
                    className={`${inputClass} resize-y min-h-[6rem] font-medium normal-case tracking-normal`}
                    required
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Experience</span>
                  <textarea
                    value={jobExperience}
                    onChange={(e) => setJobExperience(e.target.value)}
                    rows={3}
                    className={`${inputClass} resize-y min-h-[4rem] font-medium normal-case tracking-normal`}
                  />
                </label>
                {jobError && (
                  <p className="text-sm font-bold uppercase tracking-tight text-swiss-red">{jobError}</p>
                )}
                {jobMessage && (
                  <p className="text-sm font-bold uppercase tracking-tight opacity-90">{jobMessage}</p>
                )}
                <button
                  type="submit"
                  disabled={jobBusy}
                  className="self-start px-8 py-4 bg-swiss-black dark:bg-swiss-white text-swiss-white dark:text-swiss-black font-bold uppercase tracking-widest text-sm hover:bg-swiss-red hover:text-swiss-black transition-colors disabled:opacity-40"
                >
                  {jobBusy ? "Saving…" : jobEditId ? "Update job" : "Create job posting"}
                </button>
              </form>

              {(jobsLive.length > 0 || jobsArchived.length > 0) && (
                <div className="mt-12 space-y-10 w-full">
                  {jobsLive.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-4">
                        Live job postings
                      </h3>
                      <ul className={jobsCardGridClass}>
                        {jobsLive.map((j) => (
                          <li key={j.id} className="min-w-0">
                            <AdminJobCard
                              job={j}
                              onEdit={loadJob}
                              onArchive={archiveJob}
                              onUnarchive={unarchiveJob}
                              onDelete={deleteJob}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {jobsArchived.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-4">
                        Archived jobs (hidden from careers page)
                      </h3>
                      <ul className={jobsCardGridClass}>
                        {jobsArchived.map((j) => (
                          <li key={j.id} className="min-w-0">
                            <AdminJobCard
                              job={j}
                              onEdit={loadJob}
                              onArchive={archiveJob}
                              onUnarchive={unarchiveJob}
                              onDelete={deleteJob}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
