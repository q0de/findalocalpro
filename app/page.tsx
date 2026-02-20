import Link from 'next/link';
import { SUPABASE_URL, SUPABASE_ANON } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChatSection } from './ChatSection';

interface Provider {
  id: string;
  name: string;
  slug: string;
  trade: string;
  trust_score: number | null;
  is_verified: boolean;
  year_established: number | null;
}

const tradeConfig: Record<string, { icon: string; color: string; bgColor: string; label: string }> = {
  plumbing: { icon: 'water_drop', color: 'text-blue-500', bgColor: 'bg-blue-100', label: 'Plumbing' },
  hvac: { icon: 'mode_fan', color: 'text-purple-500', bgColor: 'bg-purple-100', label: 'HVAC & Heating' },
  electrical: { icon: 'bolt', color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Electrical' },
  roofing: { icon: 'roofing', color: 'text-red-500', bgColor: 'bg-red-100', label: 'Roofing' },
  handyman: { icon: 'handyman', color: 'text-orange-600', bgColor: 'bg-orange-100', label: 'Handyman' },
  general: { icon: 'home_repair_service', color: 'text-slate-600', bgColor: 'bg-slate-100', label: 'General' },
};

const services = [
  { icon: 'water_drop', label: 'Plumbing', color: 'bg-blue-100 text-blue-500', href: '/services/plumbing' },
  { icon: 'mode_fan', label: 'HVAC & Heating', color: 'bg-purple-100 text-purple-500', href: '/services/hvac' },
  { icon: 'bolt', label: 'Electrician', color: 'bg-yellow-100 text-yellow-600', href: '/services/electricians' },
  { icon: 'roofing', label: 'Roofing', color: 'bg-red-100 text-red-500', href: '/services/roofing' },
  { icon: 'handyman', label: 'Handyman', color: 'bg-orange-100 text-orange-600', href: '#chat' },
  { icon: 'water_damage', label: 'Water Damage', color: 'bg-cyan-100 text-cyan-600', href: '#chat' },
  { icon: 'science', label: 'Mold Removal', color: 'bg-lime-100 text-lime-600', href: '#chat' },
  { icon: 'settings', label: 'Appliance Repair', color: 'bg-gray-100 text-gray-600', href: '/services/appliance-repair' },
  { icon: 'pest_control', label: 'Pest Control', color: 'bg-emerald-100 text-emerald-600', href: '/services/pest-control' },
  { icon: 'key', label: 'Locksmith', color: 'bg-amber-100 text-amber-600', href: '#chat' },
  { icon: 'forest', label: 'Tree Services', color: 'bg-emerald-100 text-emerald-700', href: '#chat' },
  { icon: 'solar_power', label: 'Solar', color: 'bg-yellow-100 text-yellow-600', href: '#chat' },
];

const areaTags = ['Downers Grove', 'Westmont', 'Lisle', 'Woodridge', 'Darien', 'Naperville', 'Lombard', 'Glen Ellyn', 'Wheaton', 'Hinsdale', 'Oak Brook', 'Bolingbrook'];

async function getFeaturedProviders(): Promise<Provider[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/businesses?is_active=eq.true&trust_score=gt.0&select=id,name,slug,trade,trust_score,is_verified,year_established&order=trust_score.desc&limit=6`,
      {
        headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
        next: { revalidate: 3600 },
      }
    );
    return await res.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const providers = await getFeaturedProviders();

  return (
    <div className="min-h-screen flex flex-col">
      <Header step={0} totalSteps={0} />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-purple/5 via-white to-brand-pink/5 py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-800 font-playful mb-6">
            Find Trusted <span className="text-brand-purple">Home Service</span> Pros Near You
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Connect with vetted, licensed professionals for plumbing, HVAC, electrical, roofing, and 20+ more services. Free for homeowners — get matched in 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#chat" className="inline-flex items-center justify-center gap-2 bg-brand-purple hover:bg-brand-pink text-white px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl hover:-translate-y-1">
              <span className="material-symbols-outlined">chat</span>
              Get Matched Now
            </a>
            <a href="tel:6307032607" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 px-8 py-4 rounded-2xl font-black text-lg border-2 border-slate-200 transition-all shadow-lg hover:-translate-y-1">
              <span className="material-symbols-outlined">call</span>
              Call (630) 703-2607
            </a>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: 'verified_user', label: 'Licensed & Insured', desc: 'Every pro is verified' },
              { icon: 'receipt_long', label: 'Free Estimates', desc: 'No obligation quotes' },
              { icon: 'schedule', label: '24/7 Emergency', desc: 'Always available' },
              { icon: 'thumb_up', label: 'Satisfaction Guaranteed', desc: 'We stand behind our pros' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-teal/10 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-brand-teal">{item.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-3">Our Services</h2>
          <p className="text-slate-500 text-center mb-10">Professional help for every home project</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {services.map((svc) => (
              <Link key={svc.label} href={svc.href} className="group bg-white border-2 border-slate-100 rounded-2xl p-4 text-center hover:border-brand-purple hover:shadow-lg transition-all">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${svc.color} group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined">{svc.icon}</span>
                </div>
                <p className="text-sm font-bold text-slate-700">{svc.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-3">How It Works</h2>
          <p className="text-slate-500 text-center mb-12">Get connected with a local professional in minutes</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '1', icon: 'chat', title: 'Tell Us What You Need', desc: 'Use our chat or call us. Pick your service, timing, and zip code.' },
              { num: '2', icon: 'person_search', title: 'We Match You', desc: 'We connect you with a vetted, licensed pro in your area — fast.' },
              { num: '3', icon: 'handshake', title: 'Get It Done', desc: 'Your pro handles the job. No hassle, no runaround, guaranteed.' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-16 h-16 bg-brand-purple text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Verified Pros */}
      {providers.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Verified Local Pros</h2>
                <p className="text-slate-500 mt-1">Trust scores based on state license, BBB, and contractor records</p>
              </div>
              <Link href="/directory" className="hidden md:inline-flex items-center gap-2 text-brand-purple font-bold hover:underline">
                View All <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {providers.map((p) => {
                const trade = tradeConfig[p.trade] || tradeConfig.general;
                const score = Math.round(p.trust_score || 0);
                return (
                  <Link key={p.id} href={`/pro/${p.slug}`} className="group bg-white border-2 border-slate-100 rounded-2xl p-5 hover:border-brand-purple hover:shadow-lg transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${trade.bgColor} ${trade.color}`}>
                        <span className="material-symbols-outlined">{trade.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate group-hover:text-brand-purple transition-colors">{p.name}</p>
                        <p className="text-xs text-slate-400">{trade.label}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {score >= 40 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-brand-teal text-white">
                            <span className="material-symbols-outlined text-xs">verified</span>
                            {score}
                          </span>
                        )}
                        {p.year_established && (
                          <span className="text-xs text-slate-400">Est. {p.year_established}</span>
                        )}
                      </div>
                      <span className="material-symbols-outlined text-slate-300 group-hover:text-brand-purple transition-colors">arrow_forward</span>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-6 text-center md:hidden">
              <Link href="/directory" className="inline-flex items-center gap-2 text-brand-purple font-bold">
                View All Pros <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Chat Section */}
      <section id="chat" className="py-16 bg-gradient-to-br from-brand-purple/5 to-brand-pink/5 scroll-mt-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Get Matched With a Pro</h2>
            <p className="text-slate-500">Tell us what you need and we&apos;ll connect you in 60 seconds</p>
          </div>
          <ChatSection />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'How does FindALocalPro work?', a: 'Tell us what service you need, when you need it, and your zip code. We instantly match you with vetted, licensed professionals in your area. A pro will call you directly — usually within minutes.' },
              { q: 'Is FindALocalPro free to use?', a: 'Yes! FindALocalPro is completely free for homeowners. We connect you with trusted professionals at no cost to you.' },
              { q: 'Are the professionals licensed and insured?', a: 'Yes. Every professional on our platform is vetted against state license databases, BBB ratings, and contractor registrations. We verify credentials before they can receive jobs.' },
              { q: 'What services do you cover?', a: 'We cover 20+ home services including plumbing, HVAC, electrical, roofing, handyman, water damage, pest control, landscaping, remodeling, and more.' },
              { q: 'What areas do you serve?', a: 'We currently serve Downers Grove and the greater DuPage County area, including Westmont, Lisle, Naperville, Lombard, Glen Ellyn, Wheaton, Hinsdale, and surrounding communities.' },
            ].map((faq) => (
              <details key={faq.q} className="group bg-white border-2 border-slate-100 rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-slate-800 hover:text-brand-purple transition-colors">
                  {faq.q}
                  <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <p className="px-5 pb-5 text-slate-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Service Area</h2>
          <p className="text-slate-500 mb-8">Proudly serving Downers Grove and surrounding communities</p>
          <div className="flex flex-wrap justify-center gap-3">
            {areaTags.map((area) => (
              <span key={area} className="bg-white px-4 py-2 rounded-full text-sm font-semibold text-slate-600 shadow-sm">{area}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-brand-purple text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-purple-200 mb-8">Call now or use our chat to get matched with a verified local pro</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#chat" className="inline-flex items-center justify-center gap-2 bg-brand-yellow text-slate-900 px-8 py-4 rounded-2xl font-black text-lg hover:shadow-xl transition-all">
              <span className="material-symbols-outlined">chat</span>
              Start Chat
            </a>
            <a href="tel:6307032607" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-lg border-2 border-white/30 hover:bg-white/20 transition-all">
              <span className="material-symbols-outlined">call</span>
              (630) 703-2607
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
