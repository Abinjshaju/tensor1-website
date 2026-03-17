import { useEffect } from "react";
import { useInView } from "../hooks/useInView";
import Contact from "../components/Contact";

const CATEGORIES = [
  {
    id: "ai",
    title: "AI",
    icon: "psychology",
    items: [
      "Consulting",
      "Model Development",
      "Fine-tuning",
      "RAG Systems",
      "AI Automation",
      "AI Prototyping",
    ],
  },
  {
    id: "software",
    title: "Software",
    icon: "code",
    items: [
      "Custom Software",
      "Websites, Mobile Apps, Desktop Apps",
      "AI Applications",
      "Product Engineering",
    ],
  },
  {
    id: "ops",
    title: "Ops",
    icon: "settings",
    items: [
      "Software / AI Infrastructure",
      "Data Pipelines",
      "Model Deployment / Finetuning / Hosting",
      "Inference Optimization",
    ],
  },
];

export default function ServicesPage() {
  const [sectionRef, sectionInView] = useInView({
    threshold: 0.05,
    rootMargin: "0px 0px -40px 0px",
  });

  useEffect(() => {
    document.title = "Services | Tensor1";
    return () => {
      document.title = "Tensor1 | AI Engineering";
    };
  }, []);

  return (
    <div ref={sectionRef} className="flex flex-col min-h-0">
      {/* Intro – matches site CTA style */}
      <div className="border-b border-grid">
        <div className="swiss-grid">
          <div className="col-span-12 lg:col-span-4 p-8 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-grid">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-swiss-red dark:text-swiss-red mb-4 block">
              What we do
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-tight">
              Services
            </h1>
          </div>
          <div className="col-span-12 lg:col-span-8 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <p className="uppercase tracking-widest text-sm font-bold opacity-60 leading-relaxed max-w-xl">
              Custom solutions across AI, software, and infrastructure—tailored
              to your technical environment and goals.
            </p>
          </div>
        </div>
      </div>

      {/* 3 categories – swiss grid, same border/hover language */}
      <div className="swiss-grid flex-1">
        {CATEGORIES.map((category, categoryIndex) => (
          <div
            key={category.id}
            className={`col-span-12 md:col-span-6 lg:col-span-4 border-b border-grid md:border-r last:border-r-0 ${categoryIndex === 1 ? "md:border-r-0 lg:border-r" : ""} list-item-enter ${sectionInView ? "list-item-visible" : ""}`}
            style={{
              transitionDelay: sectionInView ? `${categoryIndex * 0.08}s` : "0s",
            }}
          >
            <article className="h-full p-8 md:p-10 lg:p-12 bg-swiss-white dark:bg-swiss-black group hover:bg-swiss-red hover:text-swiss-black dark:hover:bg-swiss-red dark:hover:text-swiss-black transition-colors duration-200 flex flex-col">
              <div className="flex items-start gap-4 mb-6">
                <span className="material-symbols-outlined text-3xl md:text-4xl text-swiss-red group-hover:text-swiss-black dark:group-hover:text-swiss-black flex-shrink-0 mt-0.5">
                  {category.icon}
                </span>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter pt-0.5">
                  {category.title}
                </h2>
              </div>
              <ul className="space-y-3 flex-1">
                {category.items.map((item) => (
                  <li
                    key={item}
                    className="text-sm md:text-base font-bold uppercase tracking-wide opacity-80 group-hover:opacity-100 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-current opacity-60 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        ))}
      </div>

      {/* CTA strip – matches Building / Home CTA */}
      <div className="border-b border-grid">
        <a
          href="#contact"
          className="block border-t border-grid p-8 md:p-12 text-center hover:bg-swiss-red hover:text-swiss-black dark:hover:bg-swiss-red dark:hover:text-swiss-black transition-colors duration-200 group"
        >
          <p className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-tight">
            Let&apos;s build something cool.
          </p>
          <span className="inline-flex items-center gap-2 mt-6 text-sm font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100">
            Get in touch
            <span className="material-symbols-outlined text-lg transform group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </span>
        </a>
      </div>

      <Contact />
    </div>
  );
}
