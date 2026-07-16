import Link from 'next/link';

const proofStats = [
  { value: '11', label: 'Local opportunities found' },
  { value: '3', label: 'Fast alerts sent' },
  { value: '2', label: 'Calls routed or logged' },
  { value: '1', label: 'Review needing attention' },
];

export function PartnersHero() {
  return (
    <section className="partners-hero partners-hero-media gradient-dark">
      <div className="partner-hero-image-layer" aria-hidden="true">
        <img src="/partners/partner-hero-layout-safe-desk.png" alt="" className="partner-hero-bg-image" />
      </div>
      <div className="partner-hero-gradient" aria-hidden="true" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1.04fr_0.96fr] gap-10 items-center">
          <div className="partner-hero-copy">
            <div className="partner-hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-yellow/20 border border-brand-yellow/40 text-slate-800 text-sm font-black mb-6">
              <span className="material-symbols-outlined text-brand-purple text-base">radar</span>
              Neighborhood Demand Engine by FindALocalPro
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-800 leading-[1.02] mb-5">
              Catch homeowner demand before your competitors do.
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mb-7">
              We monitor local conversations, review signals, and tracked calls for your trade and territory, then send the opportunities, alerts, and weekly reports that help turn local demand into booked work.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="#apply" className="form-submit partner-hero-cta">
                Apply for a Founding Partner Spot
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link href="#report" className="partner-secondary-cta">
                See the weekly report
              </Link>
            </div>
            <p className="text-sm font-bold text-slate-400 mt-4">
              $500/mo for the first 3 billing cycles, then $750/mo. Full refund if your territory cannot be approved.
            </p>
          </div>

          <div className="partner-proof-card">
            <p className="form-eyebrow justify-start">Weekly report preview</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {proofStats.map((stat) => (
                <div key={stat.label} className="partner-stat-tile">
                  <b>{stat.value}</b>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
            <div className="partner-territory-strip">
              <span>Example territory focus</span>
              <b>One approved trade and service area per founding partner</b>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
