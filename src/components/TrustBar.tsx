const badges = [
  { icon: 'verified', label: 'Licensed & Insured', description: 'Fully vetted professionals' },
  { icon: 'request_quote', label: 'Free Estimates', description: 'No upfront costs or obligations' },
  { icon: 'emergency_home', label: '24/7 Emergency', description: 'Help when you need it most' },
  { icon: 'thumb_up', label: 'Satisfaction Guaranteed', description: '100% money-back protection' },
];

export function TrustBar() {
  return (
    <section className="bg-white border-y border-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {badges.map((badge) => (
            <div key={badge.label} className="flex flex-col items-center text-center gap-3">
              <div className="text-primary">
                <span className="material-symbols-outlined text-4xl">{badge.icon}</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{badge.label}</h4>
                <p className="text-sm text-slate-500">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
