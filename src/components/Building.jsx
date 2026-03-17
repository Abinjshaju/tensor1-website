import { useRef, useState, useCallback, useEffect } from "react";
import { useInView } from "../hooks/useInView";

const ITEMS = [
  "AI / ML",
  "Software Development",
  "Mobile App Development",
  "Quality Assurance",
  "Digital Transformation",
  "Web App Development",
  "Legacy System Modernization",
  "Cloud & DevOps",
  "Robotic Process Automation",
  "IoT Solutions",
  "Startup Consulting",
  "Product Engineering",
  "IT Infrastructure & Cybersecurity",
  "Data Science & Analytics",
  "Business Process Optimization",
  "Emerging Technologies",
];

function useDragScroll() {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startScrollTop = useRef(0);

  const onMouseDown = useCallback((e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    startY.current = e.clientY;
    startScrollTop.current = scrollRef.current.scrollTop;
  }, []);

  const onMouseUp = useCallback(() => {
    startY.current = 0;
    startScrollTop.current = 0;
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const move = (e) => {
      if (!scrollRef.current) return;
      const dy = startY.current - e.clientY;
      scrollRef.current.scrollTop = startScrollTop.current + dy;
    };
    const up = () => setIsDragging(false);
    document.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseup", up);
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
  }, [isDragging]);

  const onTouchStart = useCallback((e) => {
    if (!scrollRef.current || e.touches.length !== 1) return;
    startY.current = e.touches[0].clientY;
    startScrollTop.current = scrollRef.current.scrollTop;
  }, []);
  const onTouchMove = useCallback((e) => {
    if (!scrollRef.current || e.touches.length !== 1) return;
    e.preventDefault();
    const dy = startY.current - e.touches[0].clientY;
    scrollRef.current.scrollTop = startScrollTop.current + dy;
    startScrollTop.current = scrollRef.current.scrollTop;
    startY.current = e.touches[0].clientY;
  }, []);

  return {
    scrollRef,
    isDragging,
    dragHandlers: {
      onMouseDown,
      onMouseLeave: onMouseUp,
      onTouchStart,
      onTouchMove,
    },
  };
}

export default function Services() {
  const [listRef, listInView] = useInView({ threshold: 0.08, rootMargin: "0px 0px -80px 0px" });
  const { scrollRef, isDragging, dragHandlers } = useDragScroll();

  // Wheel scroll on carousel (passive: false so preventDefault works)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const maxScroll = scrollHeight - clientHeight;
      if (maxScroll <= 0) return;
      const delta = e.deltaY;
      const willScrollUp = delta < 0 && scrollTop > 0;
      const willScrollDown = delta > 0 && scrollTop < maxScroll;
      if (willScrollUp || willScrollDown) {
        e.preventDefault();
        el.scrollTop = Math.max(0, Math.min(maxScroll, scrollTop + delta));
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [scrollRef]);

  return (
    <section id="services" className="border-b border-grid">
      <div className="swiss-grid">
        <div className="col-span-12 lg:col-span-4 p-8 md:p-16 border-b lg:border-b-0 lg:border-r border-grid">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">
            02 / Services
          </h2>
          <p className="uppercase tracking-widest text-sm font-bold opacity-60 leading-relaxed">
            Custom solutions tailored to enterprise specific needs and technical
            environments.
          </p>
        </div>
        <div
          className="col-span-12 lg:col-span-8 flex flex-col min-h-0"
          ref={listRef}
        >
          <div
            ref={scrollRef}
            className={`services-scroll grab flex-1 min-h-0 max-h-[70vh] select-none ${isDragging ? "dragging" : ""}`}
            {...dragHandlers}
          >
            <ul className="flex flex-col min-h-min">
              {ITEMS.map((label, index) => (
                <li
                  key={label}
                  className={`border-b border-grid last:border-b-0 group list-item-enter flex-shrink-0 ${listInView ? "list-item-visible" : ""}`}
                  style={{
                    transitionDelay: listInView ? `${index * 0.1}s` : "0s",
                  }}
                >
                  <a
                    href="#"
                    className="block p-8 md:px-12 md:py-10 flex justify-between items-center group-hover:bg-swiss-red group-hover:text-swiss-black transition-colors duration-200 dark:group-hover:bg-swiss-red dark:group-hover:text-swiss-black"
                    onClick={(e) => isDragging && e.preventDefault()}
                  >
                    <span className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis mr-4">
                      {label}
                    </span>
                    <span className="material-symbols-outlined text-4xl md:text-5xl transform group-hover:rotate-45 transition-transform duration-200 flex-shrink-0">
                      arrow_upward
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}