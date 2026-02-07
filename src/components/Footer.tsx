const trustBadges = [
  { icon: 'shield', label: 'Vetted Pros', hoverColor: 'group-hover:bg-brand-teal' },
  { icon: 'receipt_long', label: 'Clear Pricing', hoverColor: 'group-hover:bg-brand-pink' },
  { icon: 'support_agent', label: '24/7 Support', hoverColor: 'group-hover:bg-brand-yellow' },
  { icon: 'star_half', label: 'Top Rated', hoverColor: 'group-hover:bg-brand-purple' },
];

export function Footer() {
  return (
    <footer className="mt-20 py-12 bg-white border-t-8 border-brand-purple/10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="flex flex-col items-center gap-3 group cursor-default">
              <div className={`w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center ${badge.hoverColor} group-hover:text-white transition-colors`}>
                <span className="material-symbols-outlined text-2xl">{badge.icon}</span>
              </div>
              <span className="text-xs font-black text-slate-500 uppercase tracking-tighter">{badge.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-100">
          <p className="text-sm font-medium text-slate-400">
            &copy; 2026 FindALocalPro. Making home care delightful! ✨
          </p>
          <div className="flex gap-8">
            <a className="text-sm font-bold text-slate-400 hover:text-brand-purple transition-colors" href="#">Privacy</a>
            <a className="text-sm font-bold text-slate-400 hover:text-brand-purple transition-colors" href="#">Terms</a>
            <a className="text-sm font-bold text-brand-pink hover:scale-110 transition-all" href="#">Become a Pro</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
