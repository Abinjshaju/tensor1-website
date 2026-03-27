import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { supabase } from "../lib/supabaseClient";

const mdComponents = {
  h1: ({ node, ...props }) => (
    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mt-10 mb-4" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight mt-8 mb-3" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="text-lg font-bold uppercase tracking-tight mt-6 mb-2" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className="text-sm md:text-base font-medium leading-relaxed opacity-90 mb-4" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className="list-disc pl-6 mb-4 space-y-2 text-sm md:text-base font-medium opacity-90" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="list-decimal pl-6 mb-4 space-y-2 text-sm md:text-base font-medium opacity-90" {...props} />
  ),
  li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
  a: ({ node, ...props }) => (
    <a className="underline font-bold hover:text-swiss-red transition-colors" {...props} />
  ),
  code: ({ node, className, children, ...props }) => {
    const isInline = !String(children).includes("\n") && !className;
    return isInline ? (
      <code className="text-sm font-mono bg-swiss-black/5 dark:bg-swiss-white/10 px-1 py-0.5" {...props}>
        {children}
      </code>
    ) : (
      <code
        className="block text-sm font-mono bg-swiss-black/5 dark:bg-swiss-white/10 p-4 overflow-x-auto mb-4 border border-grid"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ node, ...props }) => <pre className="mb-4 overflow-x-auto" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="border-l-4 border-swiss-red pl-4 my-4 italic opacity-90 text-sm md:text-base"
      {...props}
    />
  ),
};

export default function BlogPostPage() {
  const { slug } = useParams();
  const [remote, setRemote] = useState(null);
  const [remoteLoaded, setRemoteLoaded] = useState(!supabase);

  useEffect(() => {
    if (!supabase || !slug) {
      setRemote(null);
      setRemoteLoaded(true);
      return;
    }
    setRemoteLoaded(false);
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
      if (!cancelled) {
        setRemote(data);
        setRemoteLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const article = remote?.published_at && !remote?.archived_at ? remote : null;

  useEffect(() => {
    const t = article?.title;
    document.title = t ? `${t} | Tensor1` : "Blog | Tensor1";
    return () => {
      document.title = "Tensor1 | AI Engineering";
    };
  }, [article?.title]);

  if (!remoteLoaded) {
    return (
      <div className="flex flex-col min-h-0 flex-1 items-center justify-center p-16">
        <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Loading</span>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col min-h-0 flex-1">
        <div className="border-b border-grid p-8 md:p-12 lg:p-16">
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">Not found</h1>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-sm hover:text-swiss-red transition-colors group"
          >
            <span className="material-symbols-outlined text-lg transform group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            Back to blogs
          </Link>
        </div>
      </div>
    );
  }

  const title = article.title;
  const category = article.category || "Blog";
  const excerpt = article.excerpt || "";
  const image = article.cover_image_url?.trim() || "/images/blog/cover-1.svg";
  const author = article.author_name ?? null;
  const publishedLabel = article.published_at
    ? new Date(article.published_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;
  const bodyMd = article.body_markdown ?? null;

  return (
    <div className="flex flex-col min-h-0 flex-1">
      <div className="border-b border-grid">
        <div className="swiss-grid">
          <div className="col-span-12 lg:col-span-4 p-8 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-grid">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-swiss-red dark:text-swiss-red mb-4 block">
              {category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-tight mb-6">
              {title}
            </h1>
            {(author || publishedLabel) && (
              <p className="text-xs font-bold uppercase tracking-widest opacity-60 space-y-1">
                {author && <span className="block">{author}</span>}
                {publishedLabel && <span className="block">{publishedLabel}</span>}
              </p>
            )}
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 mt-8 font-bold uppercase tracking-widest text-sm hover:text-swiss-red transition-colors group"
            >
              <span className="material-symbols-outlined text-lg transform group-hover:-translate-x-1 transition-transform">
                arrow_back
              </span>
              All blogs
            </Link>
          </div>
          <div className="col-span-12 lg:col-span-8 border-b lg:border-b-0 border-grid aspect-[16/10] lg:aspect-auto lg:min-h-[280px] overflow-hidden bg-swiss-black/5 dark:bg-swiss-white/5">
            <img
              src={image}
              alt=""
              className="w-full h-full object-cover"
              width={1200}
              height={675}
              decoding="async"
            />
          </div>
        </div>
      </div>

      <div className="swiss-grid flex-1">
        <div className="col-span-12 lg:col-span-10 lg:col-start-2 p-8 md:p-12 lg:p-16 max-w-4xl">
          {bodyMd ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
              components={mdComponents}
            >
              {bodyMd}
            </ReactMarkdown>
          ) : (
            <div className="space-y-6">
              <p className="text-lg md:text-xl font-bold uppercase tracking-tight leading-relaxed opacity-90">
                {excerpt}
              </p>
              <p className="text-sm font-bold uppercase tracking-widest opacity-50">
                No article body yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
