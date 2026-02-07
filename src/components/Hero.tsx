export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40 min-h-[600px] flex items-center">
      {/* Background image */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      ></div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-900/85 via-slate-900/70 to-slate-900/40"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
          <span className="material-symbols-outlined text-sm">verified_user</span>
          Verified Professionals Only
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-8 max-w-4xl mx-auto drop-shadow-lg">
          Your Trusted Local <span className="text-amber-accent">Home Service</span> Experts
        </h1>

        <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto mb-12">
          Connect with licensed, background-checked pros for every home project. Quick, reliable, and guaranteed quality.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto bg-amber-accent hover:bg-amber-600 text-white px-10 py-4 rounded-xl text-lg font-bold transition-all shadow-lg active:scale-95">
            Find a Pro Near You
          </button>
          <button className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border border-white/30 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-white/20 transition-all">
            Browse Services
          </button>
        </div>
      </div>
    </section>
  );
}
