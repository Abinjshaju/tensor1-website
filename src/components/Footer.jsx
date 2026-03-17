const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com/company/tensor1" },
  { label: "Instagram", href: "https://instagram.com/tensor1" },
  { label: "X ( Twitter )", href: "https://x.com/tensor1" },
  { label: "YouTube", href: "https://youtube.com/@tensor1" },
  { label: "GitHub", href: "https://github.com/tensor1" },
];

export default function Footer() {
  return (
    <footer className="bg-swiss-white dark:bg-swiss-black border-t border-grid">
      <div className="swiss-grid items-center">
        <div className="col-span-12 lg:col-span-3 flex items-center gap-3 py-6 px-6 border-b lg:border-b-0 lg:border-r border-grid">
          <div className="w-8 h-8 bg-swiss-red flex items-center justify-center font-bold text-swiss-black text-sm">
            T1
          </div>
          <span className="text-xl font-black tracking-tighter">
            TENSOR1<span className="text-swiss-red">.</span>
          </span>
        </div>
        <nav className="col-span-12 lg:col-span-6 py-6 px-6 border-b lg:border-b-0 lg:border-r border-grid">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm font-bold uppercase tracking-widest">
            <a href="#contact" className="hover:text-swiss-red transition-colors">
              Contact
            </a>
            <a
              href="mailto:hello@tensor1.xyz"
              className="hover:text-swiss-red transition-colors"
            >
              Email
            </a>
          </div>
        </nav>
        <div className="col-span-12 lg:col-span-3 py-6 px-6 border-b lg:border-b-0">
          <p className="text-sm font-bold uppercase tracking-widest opacity-50">
            © 2026 Tensor1 Engineering
          </p>
        </div>
      </div>
      <div className="border-t border-grid py-6 px-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-bold uppercase tracking-widest">
          {SOCIAL_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-swiss-red transition-colors opacity-80 hover:opacity-100"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
