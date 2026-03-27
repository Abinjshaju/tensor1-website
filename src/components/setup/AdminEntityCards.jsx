const BLOG_FALLBACK_IMAGE = "/images/blog/cover-1.svg";

const actionBtnClass =
  "font-bold uppercase tracking-widest text-[10px] border border-grid px-3 py-2 hover:bg-swiss-red hover:text-swiss-black transition-colors shrink-0";

/**
 * Compact admin card for a blog post (published or archived).
 */
export function AdminBlogPostCard({ post, onEdit, onArchive, onUnarchive, onDelete, previewHref }) {
  const archived = Boolean(post.archived_at);
  const image = post.cover_image_url?.trim() || BLOG_FALLBACK_IMAGE;
  const category = post.category?.trim() || "Blog";
  const dateLabel = post.published_at
    ? new Date(post.published_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <article
      className={`border border-grid flex flex-col h-full overflow-hidden ${archived ? "opacity-80" : ""}`}
    >
      <div className="aspect-[16/10] overflow-hidden bg-swiss-black/5 dark:bg-swiss-white/5 border-b border-grid">
        <img
          src={image}
          alt=""
          className="w-full h-full object-cover"
          width={640}
          height={400}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2 min-h-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-swiss-red">{category}</span>
          {archived && (
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border border-grid">
              Archived
            </span>
          )}
        </div>
        <h3 className="text-base font-black uppercase tracking-tight leading-snug line-clamp-2">{post.title}</h3>
        {post.excerpt ? (
          <p className="text-xs font-medium leading-relaxed opacity-70 line-clamp-2 normal-case tracking-normal">
            {post.excerpt}
          </p>
        ) : null}
        <p className="text-[10px] font-mono font-bold uppercase tracking-tight opacity-50 truncate" title={post.slug}>
          {post.slug}
        </p>
        {dateLabel && (
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">{dateLabel}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-auto pt-4">
          <button type="button" onClick={() => onEdit(post.id)} className={actionBtnClass}>
            Edit
          </button>
          {archived ? (
            <button type="button" onClick={() => onUnarchive(post.id)} className={actionBtnClass}>
              Unarchive
            </button>
          ) : (
            <button type="button" onClick={() => onArchive(post.id)} className={actionBtnClass}>
              Archive
            </button>
          )}
          <button type="button" onClick={() => onDelete(post.id)} className={actionBtnClass}>
            Delete
          </button>
          {previewHref ? (
            <a
              href={previewHref}
              target="_blank"
              rel="noreferrer"
              className={`${actionBtnClass} inline-flex items-center`}
            >
              View
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/**
 * Compact admin card for a job posting.
 */
export function AdminJobCard({ job, onEdit, onArchive, onUnarchive, onDelete }) {
  const archived = Boolean(job.archived_at);
  const descPreview = job.description?.trim()?.slice(0, 120);

  return (
    <article className={`border border-grid flex flex-col h-full p-5 ${archived ? "opacity-80" : ""}`}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="text-xs font-bold uppercase tracking-widest opacity-50 font-mono">{job.role_id}</span>
        {archived && (
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border border-grid">
            Archived
          </span>
        )}
      </div>
      <h3 className="text-lg font-black uppercase tracking-tight leading-snug">{job.title}</h3>
      {descPreview ? (
        <p className="text-xs font-medium leading-relaxed opacity-70 mt-2 line-clamp-3 normal-case tracking-normal">
          {descPreview}
          {job.description && job.description.length > 120 ? "…" : ""}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2 mt-auto pt-5">
        <button type="button" onClick={() => onEdit(job.id)} className={actionBtnClass}>
          Edit
        </button>
        {archived ? (
          <button type="button" onClick={() => onUnarchive(job.id)} className={actionBtnClass}>
            Unarchive
          </button>
        ) : (
          <button type="button" onClick={() => onArchive(job.id)} className={actionBtnClass}>
            Archive
          </button>
        )}
        <button type="button" onClick={() => onDelete(job.id)} className={actionBtnClass}>
          Delete
        </button>
      </div>
    </article>
  );
}
