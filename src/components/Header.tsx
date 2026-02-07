interface HeaderProps {
  step: number;
  totalSteps: number;
}

export function Header({ step, totalSteps }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-white">
      <div className="max-w-4xl mx-auto px-6 flex h-20 items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <div className="bg-brand-purple w-10 h-10 rounded-xl flex items-center justify-center text-white rotate-3">
            <span className="material-symbols-outlined font-bold">home_repair_service</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 font-playful">
            Find<span className="text-brand-purple">A</span>Local<span className="text-brand-pink">Pro</span>
          </h2>
        </a>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`progress-dot ${i < step ? 'active' : ''}`}
              />
            ))}
          </div>
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-brand-purple transition-all shadow-lg hover:-translate-y-1">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}
