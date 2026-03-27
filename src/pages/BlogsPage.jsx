import { useEffect } from "react";
import { useInView } from "../hooks/useInView";
import { useMergedBlogPosts } from "../hooks/useMergedBlogPosts";
import BlogPostCard from "../components/BlogPostCard";

export default function BlogsPage() {
  const { posts } = useMergedBlogPosts();
  const [listRef, listInView] = useInView({ threshold: 0.05, rootMargin: "0px 0px -40px 0px" });

  useEffect(() => {
    document.title = "Blogs | Tensor1";
    return () => {
      document.title = "Tensor1 | AI Engineering";
    };
  }, []);

  return (
    <div className="flex flex-col min-h-0">
      <div className="border-b border-grid">
        <div className="swiss-grid">
          <div className="col-span-12 lg:col-span-4 p-8 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-grid">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-swiss-red dark:text-swiss-red mb-4 block">
              Writing
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-tight">
              Blogs
            </h1>
          </div>
          <div className="col-span-12 lg:col-span-8 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <p className="uppercase tracking-widest text-sm font-bold opacity-60 leading-relaxed max-w-xl">
              Articles on AI engineering, infrastructure, security, and how we build
              at scale—newest first.
            </p>
          </div>
        </div>
      </div>

      <div className="swiss-grid flex-1" ref={listRef}>
        <div className="col-span-12">
          <ul className="flex flex-col">
            {posts.map((post, index) => (
              <li
                key={post.slug}
                className={`list-item-enter ${listInView ? "list-item-visible" : ""}`}
                style={{ transitionDelay: listInView ? `${index * 0.05}s` : "0s" }}
              >
                <BlogPostCard post={post} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
