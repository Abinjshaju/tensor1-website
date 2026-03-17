import { useEffect, useRef, useState } from "react";

/**
 * @param {Object} options - IntersectionObserver options
 * @param {number} [options.threshold=0.1] - How much of the element must be visible (0-1)
 * @param {string} [options.rootMargin='0px 0px -50px 0px'] - Margin around root (e.g. trigger a bit before fully in view)
 */
export function useInView(options = {}) {
  const { threshold = 0.1, rootMargin = "0px 0px -50px 0px" } = options;
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isInView];
}
