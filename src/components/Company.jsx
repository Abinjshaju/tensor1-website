import { useInView } from "../hooks/useInView";

const CAPS = [
  {
    num: "01",
    title: "AI Platforms",
    desc: "End-to-end intelligent platforms built on modern machine learning infrastructure.",
  },
  {
    num: "02",
    title: "AI-Native Applications",
    desc: "Software designed from the ground up with AI capabilities at the core.",
  },
  {
    num: "03",
    title: "Autonomous Systems",
    desc: "Agents and automation systems that interact with data, APIs, and complex workflows.",
  },
  {
    num: "04",
    title: "Data Intelligence Systems",
    desc: "Platforms that transform raw data into actionable insight using modern ML pipelines.",
  },
];

export default function Company() {
  const [cardsRef, cardsInView] = useInView({ threshold: 0.08, rootMargin: "0px 0px -80px 0px" });

  return (
    <section id="company" className="border-b border-grid">
      <div className="swiss-grid border-b border-grid">
        <div className="col-span-12 lg:col-span-3 p-8 border-b lg:border-b-0 lg:border-r border-grid text-xl font-bold uppercase tracking-widest flex items-center">
          01 / Company
        </div>
        <div className="col-span-12 lg:col-span-9 p-8 md:p-12 text-xl md:text-3xl font-medium leading-tight">
          Tensor1 is a technology studio focused on building intelligent software
          systems at the intersection of software engineering, artificial
          intelligence, and modern infrastructure. We help companies design,
          build, and deploy advanced AI-powered products that are reliable,
          scalable, and production-ready.
          <br />
          <br />
          Our team works across the full stack of modern AI development — from
          foundational software engineering to cutting-edge machine learning
          systems. Whether it&apos;s integrating AI into existing products or
          building entirely new intelligent platforms, we focus on practical
          solutions that deliver real-world impact.
        </div>
      </div>

      <div className="swiss-grid" ref={cardsRef}>
        {CAPS.map((cap, index) => (
          <div
            key={cap.num}
            className={`col-span-12 md:col-span-6 lg:col-span-3 border-b lg:border-b-0 border-r border-grid p-8 md:p-12 hover:bg-swiss-red hover:text-swiss-black transition-colors dark:hover:bg-swiss-red group flex flex-col last:border-r-0 list-item-enter ${cardsInView ? "list-item-visible" : ""}`}
            style={{ transitionDelay: cardsInView ? `${index * 0.08}s` : "0s" }}
          >
            <div className="text-5xl font-black mb-16 opacity-20 group-hover:opacity-100 transition-opacity">
              {cap.num}
            </div>
            <h3 className="text-3xl font-bold uppercase tracking-tighter mb-6 leading-none mt-auto">
              {cap.title}
            </h3>
            <p className="text-base opacity-80 leading-relaxed font-medium">
              {cap.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
