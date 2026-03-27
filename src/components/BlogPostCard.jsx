import { Link } from "react-router-dom";

/**
 * Linked card for home and /blogs archive (opens full post).
 */
export default function BlogPostCard({ post, className = "" }) {
  return (
    <article className={`border-b border-grid last:border-b-0 group ${className}`}>
      <Link
        to={`/blogs/${post.slug}`}
        className="block cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-swiss-red"
      >
        <div className="flex flex-col md:flex-row md:items-stretch transition-colors duration-200 group-hover:bg-swiss-red group-hover:text-swiss-black dark:group-hover:bg-swiss-red dark:group-hover:text-swiss-black">
          <div className="md:w-2/5 lg:w-1/3 border-b md:border-b-0 md:border-r border-grid aspect-[16/10] md:aspect-auto md:min-h-[200px] overflow-hidden bg-swiss-black/5 dark:bg-swiss-white/5">
            <img
              src={post.image}
              alt=""
              className="w-full h-full object-cover"
              width={800}
              height={450}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="flex-1 p-8 md:p-10 lg:p-12 flex flex-col justify-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest opacity-60">{post.category}</span>
            <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase">{post.title}</h3>
            <p className="text-sm md:text-base font-medium leading-relaxed opacity-80 max-w-2xl">
              {post.excerpt}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
