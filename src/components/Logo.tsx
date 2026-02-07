export function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#" className="flex items-center gap-3">
      <div className="bg-primary p-2 rounded-lg text-white">
        <span className="material-symbols-outlined text-2xl">home_repair_service</span>
      </div>
      <span className={`text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>
        Find<span className="text-primary">A</span>Local<span className="text-amber-accent">Pro</span>
      </span>
    </a>
  );
}
