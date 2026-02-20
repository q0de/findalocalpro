import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-16 bg-slate-900 text-slate-400">
      <div className="max-w-5xl mx-auto px-6">
        {/* Top grid — links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Services */}
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/services/plumbing" className="text-sm hover:text-white transition-colors">Plumbing</Link></li>
              <li><Link href="/services/hvac" className="text-sm hover:text-white transition-colors">HVAC & Heating</Link></li>
              <li><Link href="/services/electricians" className="text-sm hover:text-white transition-colors">Electricians</Link></li>
              <li><Link href="/services/roofing" className="text-sm hover:text-white transition-colors">Roofing</Link></li>
              <li><Link href="/services/pest-control" className="text-sm hover:text-white transition-colors">Pest Control</Link></li>
              <li><Link href="/services/appliance-repair" className="text-sm hover:text-white transition-colors">Appliance Repair</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/reviews" className="text-sm hover:text-white transition-colors">Reviews</Link></li>
              <li><Link href="/directory" className="text-sm hover:text-white transition-colors">Pro Directory</Link></li>
            </ul>
          </div>

          {/* For Homeowners */}
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-wider mb-4">Homeowners</h3>
            <ul className="space-y-2">
              <li><Link href="/get-matched" className="text-sm hover:text-white transition-colors">Get Matched Free</Link></li>
              <li><Link href="/about#verification" className="text-sm hover:text-white transition-colors">How We Verify</Link></li>
              <li><a href="tel:6307032607" className="text-sm hover:text-white transition-colors">(630) 703-2607</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Service area tags */}
        <div className="border-t border-slate-800 pt-8 mb-8">
          <p className="text-xs text-slate-500 mb-3 font-bold uppercase tracking-wider">Serving DuPage County, IL</p>
          <div className="flex flex-wrap gap-2">
            {['Downers Grove', 'Westmont', 'Lisle', 'Woodridge', 'Darien', 'Naperville', 'Lombard', 'Glen Ellyn', 'Wheaton', 'Hinsdale', 'Oak Brook', 'Bolingbrook'].map((town) => (
              <span key={town} className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">{town}</span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-brand-purple w-8 h-8 rounded-lg flex items-center justify-center text-white rotate-3">
              <span className="material-symbols-outlined text-sm font-bold">home_repair_service</span>
            </div>
            <p className="text-sm">
              &copy; 2026 FindALocalPro. Every pro verified against 4 government databases.
            </p>
          </div>
          <p className="text-xs text-slate-600">
            Downers Grove, IL · (630) 703-2607
          </p>
        </div>
      </div>
    </footer>
  );
}
