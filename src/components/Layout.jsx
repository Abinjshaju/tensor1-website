import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import CustomCursor from "./CustomCursor";

export default function Layout() {
  const { pathname, hash } = useLocation();
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    setShowCursor(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const scrollToEl = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const t = setTimeout(scrollToEl, 100);
    return () => clearTimeout(t);
  }, [pathname, hash]);

  return (
    <div className="bg-swiss-white dark:bg-swiss-black text-swiss-black dark:text-swiss-white transition-colors duration-200 antialiased overflow-x-hidden font-swiss border-x border-grid max-w-[1920px] mx-auto min-h-screen flex flex-col">
      {showCursor && <CustomCursor />}
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
