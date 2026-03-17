export default function Contact() {
  return (
    <section
      id="contact"
      className="border-b border-grid bg-swiss-black text-swiss-white dark:bg-swiss-white dark:text-swiss-black"
    >
      <div className="swiss-grid flex flex-col justify-center">
        <div className="col-span-12 lg:col-span-5 p-8 md:p-16 lg:p-24 border-b lg:border-b-0 lg:border-r border-grid flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-swiss-red dark:text-swiss-black mb-6">
            Get in touch
          </span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-tight">
            Contact
          </h2>
          <p className="text-lg md:text-xl font-medium opacity-80 leading-relaxed max-w-md mb-12">
            Start a project, ask a question, or join the team. We reply within 24
            hours.
          </p>
          <a
            href="mailto:hello@tensor1.xyz"
            className="inline-flex items-center justify-center gap-2 w-full md:w-auto bg-swiss-red text-swiss-black font-bold tracking-widest text-sm py-4 px-8 hover:opacity-90 transition-opacity"
          >
            hello@tensor1.xyz
            <span className="material-symbols-outlined text-xl">mail</span>
          </a>
        </div>
        <div className="col-span-12 lg:col-span-7 p-8 md:p-16 lg:p-24 flex flex-col justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-4">
                Email
              </h3>
              <a
                href="mailto:hello@tensor1.xyz"
                className="text-2xl md:text-3xl font-black tracking-tighter hover:text-swiss-red dark:hover:text-swiss-black transition-colors block"
              >
                hello@tensor1.xyz
              </a>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-4">
                Office
              </h3>
              <p className="text-xl md:text-2xl font-bold tracking-tighter">
                San Francisco, CA
              </p>
              <p className="text-lg font-medium opacity-80 mt-1">
                +1 (555) 000-0000
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
