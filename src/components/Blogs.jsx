import { Link } from "react-router-dom";
import { useInView } from "../hooks/useInView";
import { useMergedBlogPosts } from "../hooks/useMergedBlogPosts";
import BlogPostCard from "./BlogPostCard";

const RECENT_COUNT = 4;

export default function Blogs() {
  const { posts } = useMergedBlogPosts();
  const [listRef, listInView] = useInView({ threshold: 0.08, rootMargin: "0px 0px -80px 0px" });
  const recent = posts.slice(0, RECENT_COUNT);

  return (
    <section id="blogs" className="border-b border-grid">
      <div className="swiss-grid">
        <div className="col-span-12 lg:col-span-3 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-grid">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-4">
            Blogs
          </h2>
          <p className="opacity-60 font-medium">
            Insights on AI engineering, infrastructure, and building at scale.
          </p>
        </div>
        <div className="col-span-12 lg:col-span-9 flex flex-col min-h-0" ref={listRef}>
          <ul className="flex flex-col">
            {recent.map((post, index) => (
              <li
                key={post.slug}
                className={`list-item-enter ${listInView ? "list-item-visible" : ""}`}
                style={{ transitionDelay: listInView ? `${index * 0.08}s` : "0s" }}
              >
                <BlogPostCard post={post} />
              </li>
            ))}
          </ul>
          <div className="border-t border-grid">
            <Link
              to="/blogs"
              className="flex items-center justify-center gap-2 w-full p-8 md:p-10 font-bold uppercase tracking-widest text-sm hover:bg-swiss-red hover:text-swiss-black dark:hover:bg-swiss-red dark:hover:text-swiss-black transition-colors duration-200 group"
            >
              Read more blogs
              <span className="material-symbols-outlined text-lg transform group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
