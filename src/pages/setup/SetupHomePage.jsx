import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { AdminBlogPostCard, AdminJobCard } from "../../components/setup/AdminEntityCards";

const linkClass =
  "group flex flex-col border border-grid p-6 md:p-8 hover:bg-swiss-red hover:text-swiss-black transition-colors duration-200";

const cardGridClass = "grid gap-6 sm:grid-cols-2 xl:grid-cols-3";

export default function SetupHomePage() {
  const navigate = useNavigate();
  const { user, profile, updateProfile, refreshProfile } = useAuth();
  const [authorName, setAuthorName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [publishedPosts, setPublishedPosts] = useState([]);
  const [jobs, setJobs] = useState([]);

  const loadPublished = useCallback(async () => {
    if (!supabase || !user) return;
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("user_id", user.id)
      .not("published_at", "is", null)
      .order("published_at", { ascending: false });
    if (!error && data) setPublishedPosts(data);
  }, [user]);

  const loadJobs = useCallback(async () => {
    if (!supabase || !user) return;
    const { data, error } = await supabase
      .from("job_postings")
      .select("id, role_id, title, description, experience, created_at, archived_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) setJobs(data);
  }, [user]);

  useEffect(() => {
    document.title = "Setup | Tensor1";
    return () => {
      document.title = "Tensor1 | AI Engineering";
    };
  }, []);

  useEffect(() => {
    if (profile) {
      setAuthorName(profile.author_name ?? "");
      setContactEmail(profile.contact_email ?? "");
    }
  }, [profile]);

  useEffect(() => {
    loadPublished();
    loadJobs();
  }, [loadPublished, loadJobs]);

  async function handleProfileSave(e) {
    e.preventDefault();
    setProfileError("");
    setProfileMessage("");
    setProfileSaving(true);
    const { error } = await updateProfile({
      author_name: authorName.trim() || null,
      contact_email: contactEmail.trim() || null,
    });
    setProfileSaving(false);
    if (error) setProfileError(error.message);
    else {
      setProfileMessage("Profile saved.");
      await refreshProfile();
    }
  }

  async function deleteBlogPost(id) {
    if (!supabase || !user) return;
    if (!window.confirm("Delete this article permanently? This cannot be undone.")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id).eq("user_id", user.id);
    if (error) window.alert(error.message);
    else await loadPublished();
  }

  async function archiveBlogPost(id) {
    if (!supabase || !user) return;
    const { error } = await supabase
      .from("blog_posts")
      .update({ archived_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) window.alert(error.message);
    else await loadPublished();
  }

  async function unarchiveBlogPost(id) {
    if (!supabase || !user) return;
    const { error } = await supabase
      .from("blog_posts")
      .update({ archived_at: null })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) window.alert(error.message);
    else await loadPublished();
  }

  async function deleteJob(id) {
    if (!supabase || !user) return;
    if (!window.confirm("Delete this job posting permanently? This cannot be undone.")) return;
    const { error } = await supabase.from("job_postings").delete().eq("id", id).eq("user_id", user.id);
    if (error) window.alert(error.message);
    else await loadJobs();
  }

  async function archiveJob(id) {
    if (!supabase || !user) return;
    const { error } = await supabase
      .from("job_postings")
      .update({ archived_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) window.alert(error.message);
    else await loadJobs();
  }

  async function unarchiveJob(id) {
    if (!supabase || !user) return;
    const { error } = await supabase
      .from("job_postings")
      .update({ archived_at: null })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) window.alert(error.message);
    else await loadJobs();
  }

  const publishedLive = publishedPosts.filter((p) => !p.archived_at);
  const publishedArchived = publishedPosts.filter((p) => p.archived_at);
  const jobsLive = jobs.filter((j) => !j.archived_at);
  const jobsArchived = jobs.filter((j) => j.archived_at);

  const inputClass =
    "border border-grid bg-transparent px-4 py-3 font-bold uppercase tracking-tight outline-none focus:ring-2 focus:ring-swiss-red/40 w-full";
  const labelClass = "text-xs font-bold uppercase tracking-widest opacity-60";

  return (
    <div className="flex flex-col min-h-0 flex-1">
      <div className="border-b border-grid">
        <div className="swiss-grid">
          <div className="col-span-12 lg:col-span-4 p-8 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-grid">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-swiss-red dark:text-swiss-red mb-4 block">
              Setup
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
              Admin
            </h1>
            <p className="mt-6 uppercase tracking-widest text-sm font-bold opacity-60 leading-relaxed max-w-sm">
              Profile, published articles, and job postings. Use cards to edit on the blog or jobs pages, archive to
              hide from the public site, or delete permanently.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-8 p-8 md:p-12 lg:p-16">
            <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">More tools</p>
            <ul className="grid gap-4 sm:grid-cols-3 max-w-3xl">
              <li>
                <Link to="/setup/blog" className={linkClass}>
                  <span className="text-sm font-black uppercase tracking-tighter">Blogs</span>
                  <span className="mt-2 text-[10px] font-bold uppercase tracking-widest opacity-70">
                    Composer and drafts
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/setup/jobs" className={linkClass}>
                  <span className="text-sm font-black uppercase tracking-tighter">Jobs</span>
                  <span className="mt-2 text-[10px] font-bold uppercase tracking-widest opacity-70">
                    Create and archive
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/setup/dashboard" className={linkClass}>
                  <span className="text-sm font-black uppercase tracking-tighter">Profile</span>
                  <span className="mt-2 text-[10px] font-bold uppercase tracking-widest opacity-70">Dedicated page</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-b border-grid">
        <div className="swiss-grid">
          <div className="col-span-12 lg:col-span-4 p-8 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-grid">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Profile</h2>
            <p className="mt-4 uppercase tracking-widest text-xs font-bold opacity-60 leading-relaxed max-w-sm">
              Stored in Supabase <span className="font-mono text-[10px]">profiles</span>.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-8 p-8 md:p-12 lg:p-16">
            <form onSubmit={handleProfileSave} className="flex flex-col gap-6 max-w-xl">
              <label className="flex flex-col gap-2">
                <span className={labelClass}>Author name</span>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className={inputClass}
                  autoComplete="name"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className={labelClass}>Contact email</span>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className={inputClass}
                  autoComplete="email"
                />
              </label>
              {profileError && (
                <p className="text-sm font-bold uppercase tracking-tight text-swiss-red">{profileError}</p>
              )}
              {profileMessage && (
                <p className="text-sm font-bold uppercase tracking-tight opacity-90">{profileMessage}</p>
              )}
              <button
                type="submit"
                disabled={profileSaving}
                className="self-start px-8 py-4 bg-swiss-black dark:bg-swiss-white text-swiss-white dark:text-swiss-black font-bold uppercase tracking-widest text-sm hover:bg-swiss-red hover:text-swiss-black transition-colors disabled:opacity-40"
              >
                {profileSaving ? "Saving…" : "Save profile"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-b border-grid">
        <div className="swiss-grid">
          <div className="col-span-12 p-8 md:p-12 lg:p-16 border-b border-grid">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Published articles</h2>
            <p className="mt-2 uppercase tracking-widest text-xs font-bold opacity-60 max-w-2xl">
              Live posts appear on the site; archived are hidden. Edit opens the blog composer.
            </p>
          </div>
          <div className="col-span-12 px-8 md:px-12 lg:px-16 pb-12 md:pb-16 space-y-12">
            {publishedPosts.length === 0 ? (
              <p className="text-sm font-bold uppercase tracking-tight opacity-60">
                No published articles yet.{" "}
                <Link to="/setup/blog" className="text-swiss-red hover:underline">
                  Create one in the blog editor
                </Link>
                .
              </p>
            ) : (
              <>
                {publishedLive.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-4">
                      Live on site ({publishedLive.length})
                    </h3>
                    <ul className={cardGridClass}>
                      {publishedLive.map((post) => (
                        <li key={post.id} className="min-w-0">
                          <AdminBlogPostCard
                            post={post}
                            onEdit={(id) => navigate("/setup/blog", { state: { editPostId: id } })}
                            onArchive={archiveBlogPost}
                            onUnarchive={unarchiveBlogPost}
                            onDelete={deleteBlogPost}
                            previewHref={`/blogs/${post.slug}`}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {publishedArchived.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-4">
                      Archived ({publishedArchived.length})
                    </h3>
                    <ul className={cardGridClass}>
                      {publishedArchived.map((post) => (
                        <li key={post.id} className="min-w-0">
                          <AdminBlogPostCard
                            post={post}
                            onEdit={(id) => navigate("/setup/blog", { state: { editPostId: id } })}
                            onArchive={archiveBlogPost}
                            onUnarchive={unarchiveBlogPost}
                            onDelete={deleteBlogPost}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-b border-grid">
        <div className="swiss-grid">
          <div className="col-span-12 p-8 md:p-12 lg:p-16 border-b border-grid">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Job postings</h2>
            <p className="mt-2 uppercase tracking-widest text-xs font-bold opacity-60 max-w-2xl">
              Live roles appear on Careers. Edit opens the jobs form.
            </p>
          </div>
          <div className="col-span-12 px-8 md:px-12 lg:px-16 pb-12 md:pb-16 space-y-12">
            {jobs.length === 0 ? (
              <p className="text-sm font-bold uppercase tracking-tight opacity-60">
                No job postings yet.{" "}
                <Link to="/setup/jobs" className="text-swiss-red hover:underline">
                  Add one under Jobs
                </Link>
                .
              </p>
            ) : (
              <>
                {jobsLive.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-4">
                      Live on careers ({jobsLive.length})
                    </h3>
                    <ul className={cardGridClass}>
                      {jobsLive.map((job) => (
                        <li key={job.id} className="min-w-0">
                          <AdminJobCard
                            job={job}
                            onEdit={(id) => navigate("/setup/jobs", { state: { editJobId: id } })}
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
                      Archived ({jobsArchived.length})
                    </h3>
                    <ul className={cardGridClass}>
                      {jobsArchived.map((job) => (
                        <li key={job.id} className="min-w-0">
                          <AdminJobCard
                            job={job}
                            onEdit={(id) => navigate("/setup/jobs", { state: { editJobId: id } })}
                            onArchive={archiveJob}
                            onUnarchive={unarchiveJob}
                            onDelete={deleteJob}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
