import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const FALLBACK_IMAGE = "/images/blog/cover-1.svg";

/**
 * Published, non-archived posts from Supabase only, sorted by publishedAt descending.
 */
export function useMergedBlogPosts() {
  const [remoteRows, setRemoteRows] = useState([]);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("slug, title, excerpt, cover_image_url, category, published_at")
        .not("published_at", "is", null)
        .is("archived_at", null)
        .order("published_at", { ascending: false });
      if (!cancelled) {
        if (!error && data) setRemoteRows(data);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const posts = useMemo(
    () =>
      remoteRows.map((r) => ({
        slug: r.slug,
        category: r.category || "Blog",
        title: r.title,
        excerpt: r.excerpt || "",
        image: r.cover_image_url?.trim() || FALLBACK_IMAGE,
        publishedAt: r.published_at,
        source: "supabase",
      })),
    [remoteRows]
  );

  return { posts, loading };
}
