import { useState, useEffect, useRef } from "react";

const SWISS_RED = { r: 230, g: 0, b: 0 };
const TOLERANCE = 40;
const OVER_RED_CHECK_INTERVAL = 4; // check every N frames

function isOverRed(x, y) {
  const el = document.elementFromPoint(x, y);
  if (!el) return false;
  let node = el;
  while (node && node !== document.body) {
    const bg = getComputedStyle(node).backgroundColor;
    const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      const r = parseInt(match[1], 10);
      const g = parseInt(match[2], 10);
      const b = parseInt(match[3], 10);
      if (
        Math.abs(r - SWISS_RED.r) <= TOLERANCE &&
        Math.abs(g - SWISS_RED.g) <= TOLERANCE &&
        Math.abs(b - SWISS_RED.b) <= TOLERANCE
      ) {
        return true;
      }
    }
    node = node.parentElement;
  }
  return false;
}

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [overRed, setOverRed] = useState(false);
  const wrapperRef = useRef(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const rafIdRef = useRef(null);
  const frameCountRef = useRef(0);

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      setVisible((v) => (v ? v : true));
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const tick = () => {
      const wrapper = wrapperRef.current;
      if (wrapper) {
        const { x, y } = mouseRef.current;
        wrapper.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      frameCountRef.current += 1;
      if (frameCountRef.current % OVER_RED_CHECK_INTERVAL === 0) {
        const { x, y } = mouseRef.current;
        setOverRed((prev) => {
          const next = isOverRed(x, y);
          return next !== prev ? next : prev;
        });
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.body.addEventListener("mouseleave", onLeave);
    document.body.addEventListener("mouseenter", onEnter);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener("mousemove", onMove);
      document.body.removeEventListener("mouseleave", onLeave);
      document.body.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="custom-cursor-wrapper"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden
    >
      <div
        className={`custom-cursor-dot ${overRed ? "custom-cursor-dot-invert" : ""}`}
      />
    </div>
  );
}
