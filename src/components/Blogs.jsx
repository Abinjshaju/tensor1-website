import { useInView } from "../hooks/useInView";

const POSTS = [
  { category: "Engineering", title: "Building Reliable RAG Pipelines" },
  { category: "Infrastructure", title: "MLOps in Production" },
  { category: "AI", title: "From Prototype to Production" },
  { category: "Strategy", title: "Data Stacks That Scale" },
];

export default function Blogs() {
  const [listRef, listInView] = useInView({ threshold: 0.08, rootMargin: "0px 0px -80px 0px" });

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
        <div className="col-span-12 lg:col-span-9" ref={listRef}>
          <ul className="flex flex-col">
            {POSTS.map((post, index) => (
              <li
                key={post.title}
                className={`border-b border-grid last:border-b-0 group list-item-enter ${listInView ? "list-item-visible" : ""}`}
                style={{ transitionDelay: listInView ? `${index * 0.08}s` : "0s" }}
              >
                <a
                  href="#"
                  className="block p-8 md:px-12 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 group-hover:bg-swiss-red group-hover:text-swiss-black transition-colors dark:group-hover:bg-swiss-red dark:group-hover:text-swiss-black"
                >
                  <div className="border-l-4 border-swiss-red pl-4">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                      {post.category}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mt-1">
                      {post.title}
                    </h3>
                  </div>
                  <span className="material-symbols-outlined text-3xl md:text-4xl transform group-hover:rotate-45 transition-transform flex-shrink-0">
                    arrow_upward
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
