const stats = [
  { value: '10,000+', label: 'Homeowners Served' },
  { value: '2,500+', label: 'Verified Pros' },
  { value: '50+', label: 'Service Categories' },
  { value: '4.8/5', label: 'Average Rating' },
];

export function About() {
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-6">
              Why Homeowners Trust FindALocalPro
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              We started FindALocalPro with a simple mission: make it easy for homeowners to find reliable, trustworthy professionals in their neighborhood. No more guesswork, no more bad experiences.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Every professional in our network is licensed, insured, and background-checked. We stand behind every connection with our satisfaction guarantee — because your home deserves the best.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                Background-Checked Pros
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                Licensed &amp; Insured
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                Satisfaction Guarantee
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                No Hidden Fees
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-8 border border-slate-200 text-center shadow-sm">
                <div className="text-3xl lg:text-4xl font-extrabold text-primary mb-2">{stat.value}</div>
                <div className="text-sm font-semibold text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
