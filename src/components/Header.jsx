import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { label: "Company", to: "/", hash: "company" },
  { label: "Services", to: "/", hash: "services" },
  { label: "Careers", to: "/careers" },
];

export default function Header() {
  const { toggleTheme } = useTheme();
  const contactTo = "/#contact";

  return (
    <header
      className="border-y border-grid sticky top-0 bg-swiss-white dark:bg-swiss-black z-50 transition-colors duration-200"
      style={{ borderBottomWidth: 2, borderTopWidth: 0 }}
    >
      <div className="swiss-grid items-stretch h-20">
        <Link
          to="/"
          className="col-span-6 md:col-span-3 lg:col-span-2 px-6 flex items-center gap-3 border-r border-grid"
        >
          <div className="w-8 h-8 bg-swiss-red flex items-center justify-center font-bold text-swiss-black text-sm">
            T1
          </div>
          <span className="text-xl font-black tracking-tighter">
            TENSOR1<span className="text-swiss-red">.</span>
          </span>
        </Link>

        <nav className="hidden select-none md:flex col-span-4 lg:col-span-8 border-r border-grid">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.hash ? `${item.to}#${item.hash}` : item.to}
              className="flex-1 flex items-center justify-center font-bold text-sm uppercase tracking-widest hover:bg-swiss-red hover:text-swiss-black transition-colors border-r border-grid last:border-r-0"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="col-span-6 md:col-span-5 lg:col-span-2 flex items-stretch">
          <button
            type="button"
            onClick={toggleTheme}
            className="w-16 md:w-20 border-l border-grid md:border-l-0 border-r border-grid flex items-center justify-center hover:bg-swiss-red hover:text-swiss-black transition-colors outline-none"
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined dark:hidden">dark_mode</span>
            <span className="material-symbols-outlined hidden dark:block">light_mode</span>
          </button>
          <Link
            to={contactTo}
            className="flex-1 flex items-center justify-center bg-swiss-black dark:bg-swiss-white text-swiss-white dark:text-swiss-black font-bold uppercase tracking-widest text-xs lg:text-sm hover:bg-swiss-red hover:text-swiss-black dark:hover:bg-swiss-red dark:hover:text-swiss-black transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}
