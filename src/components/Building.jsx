import { useRef, useState, useCallback, useEffect } from "react";
import { useInView } from "../hooks/useInView";
import { services } from "../data/services";

function useDragScroll() {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startScrollTop = useRef(0);
  const gestureStartY = useRef(0);
  const significantDrag = useRef(false);

  const onMouseDown = useCallback((e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    significantDrag.current = false;
    gestureStartY.current = e.clientY;
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
      if (Math.abs(e.clientY - gestureStartY.current) > 10) {
        significantDrag.current = true;
      }
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

  const touchGestureStartY = useRef(0);
  const onTouchStart = useCallback((e) => {
    if (!scrollRef.current || e.touches.length !== 1) return;
    significantDrag.current = false;
    touchGestureStartY.current = e.touches[0].clientY;
    startY.current = e.touches[0].clientY;
    startScrollTop.current = scrollRef.current.scrollTop;
  }, []);
  const onTouchMove = useCallback((e) => {
    if (!scrollRef.current || e.touches.length !== 1) return;
    e.preventDefault();
    if (Math.abs(e.touches[0].clientY - touchGestureStartY.current) > 10) {
      significantDrag.current = true;
    }
    const dy = startY.current - e.touches[0].clientY;
    scrollRef.current.scrollTop = startScrollTop.current + dy;
    startScrollTop.current = scrollRef.current.scrollTop;
    startY.current = e.touches[0].clientY;
  }, []);

  return {
    scrollRef,
    isDragging,
    significantDrag,
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
  const { scrollRef, isDragging, significantDrag, dragHandlers } = useDragScroll();
  const [expandedId, setExpandedId] = useState(null);

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

  const toggleRow = (id) => {
    if (significantDrag.current) return;
    setExpandedId((prev) => (prev === id ? null : id));
  };

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
              {services.map((item, index) => {
                const expanded = expandedId === item.id;
                return (
                  <li
                    key={item.id}
                    className={`border-b border-grid last:border-b-0 group list-item-enter flex-shrink-0 ${listInView ? "list-item-visible" : ""}`}
                    style={{
                      transitionDelay: listInView ? `${index * 0.1}s` : "0s",
                    }}
                  >
                    <div
                      className={`transition-colors duration-200 ${
                        expanded
                          ? "bg-swiss-red text-swiss-black dark:bg-swiss-red dark:text-swiss-black"
                          : "group-hover:bg-swiss-red group-hover:text-swiss-black dark:group-hover:bg-swiss-red dark:group-hover:text-swiss-black"
                      }`}
                    >
                      <button
                        type="button"
                        aria-expanded={expanded}
                        className="w-full text-left p-8 md:px-12 md:py-10 flex justify-between items-center gap-4 outline-none focus-visible:ring-2 focus-visible:ring-swiss-black focus-visible:ring-inset dark:focus-visible:ring-swiss-white"
                        onClick={() => toggleRow(item.id)}
                      >
                        <span className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase min-w-0 overflow-hidden text-ellipsis">
                          {item.label}
                        </span>
                        <span
                          className={`material-symbols-outlined text-4xl md:text-5xl flex-shrink-0 transition-transform duration-200 ${
                            expanded ? "rotate-180" : "group-hover:rotate-45"
                          }`}
                          aria-hidden
                        >
                          expand_more
                        </span>
                      </button>
                      {expanded && (
                        <div className="px-8 md:px-12 pb-8 md:pb-10 pt-0 max-w-3xl">
                          <p className="text-sm md:text-base font-medium leading-relaxed opacity-90 border-t border-swiss-black/20 dark:border-swiss-black/20 pt-6">
                            {item.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
