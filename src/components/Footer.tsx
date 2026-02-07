import { Logo } from './Logo';

const legalLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Safety Guide', href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-slate-800 pb-12 mb-8">
          <Logo light />

          <div className="flex items-center gap-8 text-sm">
            {legalLinks.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white cursor-pointer transition-all">
              <span className="material-symbols-outlined text-xl">public</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white cursor-pointer transition-all">
              <span className="material-symbols-outlined text-xl">chat</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs">&copy; 2026 FindALocalPro. All rights reserved. Connecting homeowners with professional experts since 2010.</p>
      </div>
    </footer>
  );
}
