import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { slugify, uniqueSlugPart } from "../../utils/slugify";
import { AdminBlogPostCard } from "../../components/setup/AdminEntityCards";

function toDatetimeLocalValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const publishedCardGridClass = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

export default function SetupBlogPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [editId, setEditId] = useState(null);
  const [currentSlug, setCurrentSlug] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [category, setCategory] = useState("Blog");
  const [publishAtLocal, setPublishAtLocal] = useState("");
  const [bodyMarkdown, setBodyMarkdown] = useState("");
  const [blogMessage, setBlogMessage] = useState("");
  const [blogError, setBlogError] = useState("");
  const [blogBusy, setBlogBusy] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [publishedPosts, setPublishedPosts] = useState([]);

  useEffect(() => {
    document.title = "Setup | Blogs | Tensor1";
    return () => {
      document.title = "Tensor1 | AI Engineering";
    };
  }, []);

  const loadDrafts = useCallback(async () => {
    if (!supabase || !user) return;
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, updated_at")
      .eq("user_id", user.id)
      .is("published_at", null)
      .order("updated_at", { ascending: false });
    if (!error && data) setDrafts(data);
  }, [user]);

  const loadPublishedPosts = useCallback(async () => {
    if (!supabase || !user) return;
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, cover_image_url, category, published_at, archived_at")
      .eq("user_id", user.id)
      .not("published_at", "is", null)
      .order("published_at", { ascending: false });
    if (!error && data) setPublishedPosts(data);
  }, [user]);

  useEffect(() => {
    loadDrafts();
    loadPublishedPosts();
  }, [loadDrafts, loadPublishedPosts]);

  useEffect(() => {
    const editPostId = location.state?.editPostId;
    if (!editPostId || !supabase || !user) return;
    let cancelled = false;
    (async () => {
      await loadDraft(editPostId);
      if (!cancelled) navigate("/setup/blog", { replace: true, state: {} });
    })();
    return () => {
      cancelled = true;
    };
  }, [location.state?.editPostId, user?.id]);

  function resetBlogForm() {
    setEditId(null);
    setCurrentSlug("");
    setTitle("");
    setExcerpt("");
    setCoverUrl("");
    setCategory("Blog");
    setPublishAtLocal(toDatetimeLocalValue(new Date().toISOString()));
    setBodyMarkdown("");
    setBlogMessage("");
    setBlogError("");
  }

  useEffect(() => {
    if (!publishAtLocal) {
      setPublishAtLocal(toDatetimeLocalValue(new Date().toISOString()));
    }
  }, []);

  const snapshotAuthor =
    profile?.author_name?.trim() ||
    profile?.contact_email?.trim() ||
    user?.email?.split("@")[0] ||
    "Author";

  async function persistBlog({ publish }) {
    if (!supabase || !user) return;
    setBlogError("");
    setBlogMessage("");
    if (!title.trim()) {
      setBlogError("Title is required.");
      return;
    }
    if (publish) {
      if (!publishAtLocal) {
        setBlogError("Choose a publishing date and time.");
        return;
      }
    }
    setBlogBusy(true);
    const author_name = snapshotAuthor;
    const base = {
      title: title.trim(),
      excerpt: excerpt.trim() || null,
      cover_image_url: coverUrl.trim() || null,
      body_markdown: bodyMarkdown || null,
      author_name,
      category: category.trim() || "Blog",
    };
    if (publish) {
      if (Number.isNaN(new Date(publishAtLocal).getTime())) {
        setBlogError("Invalid publishing date.");
        setBlogBusy(false);
        return;
      }
      base.published_at = new Date(publishAtLocal).toISOString();
      base.archived_at = null;
    } else {
      base.published_at = null;
    }

    try {
      if (editId) {
        const { error } = await supabase
          .from("blog_posts")
          .update(base)
          .eq("id", editId)
          .eq("user_id", user.id);
        if (error) throw error;
        setBlogMessage(publish ? "Published." : "Draft saved.");
      } else {
        let slug = `${slugify(title)}-${uniqueSlugPart()}`;
        let inserted = false;
        for (let attempt = 0; attempt < 5; attempt++) {
          const { data, error } = await supabase
            .from("blog_posts")
            .insert({ user_id: user.id, slug, archived_at: null, ...base })
            .select("id, slug")
            .single();
          if (!error && data) {
            setEditId(data.id);
            setCurrentSlug(data.slug);
            setBlogMessage(publish ? "Published." : "Draft saved.");
            inserted = true;
            break;
          }
          if (error?.code === "23505") {
            slug = `${slugify(title)}-${uniqueSlugPart()}`;
            continue;
          }
          throw error;
        }
        if (!inserted) throw new Error("Could not allocate a unique slug.");
      }
      await loadDrafts();
      await loadPublishedPosts();
    } catch (err) {
      setBlogError(err.message || "Could not save post.");
    }
    setBlogBusy(false);
  }

  async function loadDraft(id) {
    if (!supabase || !user) return;
    setBlogError("");
    setBlogMessage("");
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (error || !data) {
      setBlogError(error?.message || "Post not found.");
      return;
    }
    setEditId(data.id);
    setCurrentSlug(data.slug);
    setTitle(data.title ?? "");
    setExcerpt(data.excerpt ?? "");
    setCoverUrl(data.cover_image_url ?? "");
    setCategory(data.category ?? "Blog");
    setPublishAtLocal(
      data.published_at
        ? toDatetimeLocalValue(data.published_at)
        : toDatetimeLocalValue(new Date().toISOString())
    );
    setBodyMarkdown(data.body_markdown ?? "");
  }

  async function deleteBlogPost(id) {
    if (!supabase || !user) return;
    if (!window.confirm("Delete this article permanently? This cannot be undone.")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id).eq("user_id", user.id);
    if (error) {
      window.alert(error.message);
      return;
    }
    if (editId === id) resetBlogForm();
    await loadDrafts();
    await loadPublishedPosts();
  }

  async function archiveBlogPost(id) {
    if (!supabase || !user) return;
    const { error } = await supabase
      .from("blog_posts")
      .update({ archived_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) window.alert(error.message);
    await loadPublishedPosts();
  }

  async function unarchiveBlogPost(id) {
    if (!supabase || !user) return;
    const { error } = await supabase
      .from("blog_posts")
      .update({ archived_at: null })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) window.alert(error.message);
    await loadPublishedPosts();
  }

  const inputClass =
    "border border-grid bg-transparent px-4 py-3 font-bold uppercase tracking-tight outline-none focus:ring-2 focus:ring-swiss-red/40 w-full";
  const labelClass = "text-xs font-bold uppercase tracking-widest opacity-60";
  const actionBtnClass =
    "font-bold uppercase tracking-widest text-[10px] sm:text-xs border border-grid px-3 py-2 hover:bg-swiss-red hover:text-swiss-black transition-colors shrink-0";

  const publishedLive = publishedPosts.filter((p) => !p.archived_at);
  const publishedArchived = publishedPosts.filter((p) => p.archived_at);

  return (
    <div className="flex flex-col min-h-0 flex-1">
      <div className="border-b border-grid">
        <div className="swiss-grid">
          <div className="col-span-12 lg:col-span-4 p-8 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-grid">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-swiss-red dark:text-swiss-red mb-4 block">
              Setup
            </span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
              Blogs
            </h1>
            <p className="mt-6 uppercase tracking-widest text-sm font-bold opacity-60 leading-relaxed max-w-sm">
              Composer, drafts, and published posts. Archive hides posts from the public site; delete removes
              them permanently.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-8 p-8 md:p-12 lg:p-16 flex flex-col gap-16">
            <section className="border-b border-grid pb-16">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                <h2 className="text-xl font-black uppercase tracking-tighter">Blog composer</h2>
                <button
                  type="button"
                  onClick={resetBlogForm}
                  className="self-start font-bold uppercase tracking-widest text-xs border border-grid px-4 py-2 hover:bg-swiss-red hover:text-swiss-black transition-colors"
                >
                  New post
                </button>
              </div>
              <div className="grid gap-6 max-w-3xl">
                <p className={`${labelClass} !opacity-100`}>
                  Author on posts: <span className="text-swiss-black dark:text-swiss-white">{snapshotAuthor}</span>
                </p>
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Title</span>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={inputClass}
                  />
                </label>
                {currentSlug && (
                  <p className="text-xs font-bold uppercase tracking-widest opacity-50">Slug: {currentSlug}</p>
                )}
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Description (excerpt)</span>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={3}
                    className={`${inputClass} resize-y min-h-[5rem] font-medium normal-case tracking-normal`}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Cover image URL</span>
                  <input
                    type="url"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    className={`${inputClass} font-medium normal-case tracking-normal`}
                    placeholder="https://…"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Category</span>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Date of publishing</span>
                  <input
                    type="datetime-local"
                    value={publishAtLocal}
                    onChange={(e) => setPublishAtLocal(e.target.value)}
                    className={`${inputClass} font-medium normal-case tracking-normal`}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Body (Markdown)</span>
                  <textarea
                    value={bodyMarkdown}
                    onChange={(e) => setBodyMarkdown(e.target.value)}
                    rows={14}
                    className={`${inputClass} resize-y min-h-[12rem] font-medium normal-case tracking-normal leading-relaxed`}
                  />
                </label>
                {blogError && (
                  <p className="text-sm font-bold uppercase tracking-tight text-swiss-red">{blogError}</p>
                )}
                {blogMessage && (
                  <p className="text-sm font-bold uppercase tracking-tight opacity-90">{blogMessage}</p>
                )}
                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    disabled={blogBusy}
                    onClick={() => persistBlog({ publish: false })}
                    className="px-8 py-4 border-2 border-grid font-bold uppercase tracking-widest text-sm hover:bg-swiss-red hover:text-swiss-black hover:border-swiss-red transition-colors disabled:opacity-40"
                  >
                    Save draft
                  </button>
                  <button
                    type="button"
                    disabled={blogBusy}
                    onClick={() => persistBlog({ publish: true })}
                    className="px-8 py-4 bg-swiss-black dark:bg-swiss-white text-swiss-white dark:text-swiss-black font-bold uppercase tracking-widest text-sm hover:bg-swiss-red hover:text-swiss-black transition-colors disabled:opacity-40"
                  >
                    Publish
                  </button>
                </div>
              </div>

              {drafts.length > 0 && (
                <div className="mt-12 max-w-3xl">
                  <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-4">Drafts</h3>
                  <ul className="border border-grid divide-y divide-grid">
                    {drafts.map((d) => (
                      <li key={d.id} className="flex flex-col sm:flex-row sm:items-stretch">
                        <button
                          type="button"
                          onClick={() => loadDraft(d.id)}
                          className="flex-1 text-left px-4 py-4 font-bold uppercase tracking-tight hover:bg-swiss-red hover:text-swiss-black transition-colors flex flex-col gap-1"
                        >
                          <span>{d.title || d.slug}</span>
                          <span className="text-xs font-bold uppercase tracking-widest opacity-50">{d.slug}</span>
                        </button>
                        <div className="flex border-t sm:border-t-0 sm:border-l border-grid sm:w-auto">
                          <button
                            type="button"
                            onClick={() => deleteBlogPost(d.id)}
                            className={`${actionBtnClass} flex-1 sm:flex-none`}
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(publishedLive.length > 0 || publishedArchived.length > 0) && (
                <div className="mt-12 space-y-10 w-full">
                  {publishedLive.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-4">
                        Published (live on site)
                      </h3>
                      <ul className={publishedCardGridClass}>
                        {publishedLive.map((p) => (
                          <li key={p.id} className="min-w-0">
                            <AdminBlogPostCard
                              post={p}
                              onEdit={loadDraft}
                              onArchive={archiveBlogPost}
                              onUnarchive={unarchiveBlogPost}
                              onDelete={deleteBlogPost}
                              previewHref={`/blogs/${p.slug}`}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {publishedArchived.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-4">
                        Archived articles (hidden from site)
                      </h3>
                      <ul className={publishedCardGridClass}>
                        {publishedArchived.map((p) => (
                          <li key={p.id} className="min-w-0">
                            <AdminBlogPostCard
                              post={p}
                              onEdit={loadDraft}
                              onArchive={archiveBlogPost}
                              onUnarchive={unarchiveBlogPost}
                              onDelete={deleteBlogPost}
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
