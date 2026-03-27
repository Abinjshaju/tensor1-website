import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { services } from "../data/services";

function ServiceCycler() {
  const [index, setIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(0);
      setTimeout(() => {
        setIndex((i) => (i + 1) % services.length);
        setOpacity(1);
      }, 300);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  const svc = services[index];
  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      className="flex-1 p-8 md:p-12 bg-swiss-black text-swiss-white dark:bg-swiss-darkgray flex flex-col justify-center items-start relative transition-opacity duration-300 min-h-[280px] lg:min-h-[320px]"
      style={{ opacity }}
    >
      <div className="text-5xl lg:text-7xl font-black mb-6 text-swiss-red opacity-80">
        {num}
      </div>
      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-tighter mb-4 leading-tight">
        {svc.label}
      </h3>
      <p className="text-xs sm:text-sm lg:text-base font-medium opacity-80 leading-relaxed max-w-md">
        {svc.description}
      </p>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="border-b border-grid" style={{ borderBottomWidth: 2 }}>
      <div className="swiss-grid">
        <div className="col-span-12 lg:col-span-8 p-8 md:p-16 lg:p-24 border-b lg:border-b-0 lg:border-r border-grid bg-swiss-red text-swiss-black flex flex-col justify-center">
          <p className="font-bold text-sm mb-8 uppercase tracking-widest border-l-4 border-swiss-black pl-4">
            AIML / SOFTWARE Solutions
          </p>
          <h1 className="text-[5rem] md:text-[8rem] lg:text-[11rem] font-bold leading-[0.8] tracking-tighter uppercase break-words hyphens-auto mt-4 mb-12">
            TENSOR1
            <br />
            ENG.
          </h1>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col">
          <div className="flex-1 p-8 md:p-12 border-b border-grid flex flex-col justify-center">
            <p className="text-2xl md:text-3xl font-medium leading-tight mb-8 max-w-lg">
              We design, build, and deploy AI-native software systems that scale.
            </p>
            <Link
              to="/#services"
              className="inline-flex items-center self-start gap-2 font-bold uppercase tracking-widest text-sm hover:text-swiss-red transition-colors group"
            >
              Services
              <span className="material-symbols-outlined transform group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
          <ServiceCycler />
        </div>
      </div>
    </section>
  );
}
