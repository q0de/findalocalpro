export function FinalCTA() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
      <div className="bg-primary rounded-xl md:rounded-3xl p-8 md:p-16 lg:p-24 text-center relative overflow-hidden shadow-2xl">
        {/* Abstract pattern decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-accent/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto mb-10">
            Join thousands of homeowners who trust FindALocalPro for their repair and renovation needs.
          </p>
          <button className="bg-amber-accent hover:bg-amber-600 text-white px-12 py-5 rounded-xl text-lg font-bold transition-all shadow-xl active:scale-95">
            Find a Pro Near You
          </button>
          <p className="mt-6 text-white/60 text-sm">No credit card required &bull; Licensed Professionals &bull; Fast Response</p>
        </div>
      </div>
    </section>
  );
}
