import Link from 'next/link';
import { SUPABASE_URL, SUPABASE_ANON } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChatSection } from './ChatSection';
import { AnimatedSection, CountUpNumber, TrustScoreRing, StaggeredGrid } from './HomeAnimations';

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
  { icon: 'handyman', label: 'Handyman', color: 'bg-orange-100 text-orange-600', href: '/get-matched' },
  { icon: 'water_damage', label: 'Water Damage', color: 'bg-cyan-100 text-cyan-600', href: '/get-matched' },
  { icon: 'science', label: 'Mold Removal', color: 'bg-lime-100 text-lime-600', href: '/get-matched' },
  { icon: 'settings', label: 'Appliance Repair', color: 'bg-gray-100 text-gray-600', href: '/services/appliance-repair' },
  { icon: 'pest_control', label: 'Pest Control', color: 'bg-emerald-100 text-emerald-600', href: '/services/pest-control' },
  { icon: 'key', label: 'Locksmith', color: 'bg-amber-100 text-amber-600', href: '/get-matched' },
  { icon: 'forest', label: 'Tree Services', color: 'bg-emerald-100 text-emerald-700', href: '/get-matched' },
  { icon: 'solar_power', label: 'Solar', color: 'bg-yellow-100 text-yellow-600', href: '/get-matched' },
];

const verificationSources = [
  { icon: 'badge', label: 'State License (IDFPR)', desc: 'Active IL license verified', color: 'text-blue-600 bg-blue-50' },
  { icon: 'account_balance', label: 'Secretary of State', desc: 'Business registration confirmed', color: 'text-indigo-600 bg-indigo-50' },
  { icon: 'workspace_premium', label: 'Better Business Bureau', desc: 'Rating & complaint history', color: 'text-amber-600 bg-amber-50' },
  { icon: 'construction', label: 'BuildZoom', desc: 'Contractor score & rank', color: 'text-emerald-600 bg-emerald-50' },
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
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header step={0} totalSteps={0} />

      {/* ═══════════════════════════════════════════════════════
          HERO — Verification-first messaging
          ═══════════════════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-br from-slate-900 via-brand-purple/90 to-brand-pink/80 py-24 md:py-32 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        <div className="relative max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left — Copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-bold mb-6">
                <span className="material-symbols-outlined text-brand-yellow text-base">verified</span>
                Every pro verified against 4 public databases
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-[1.1]">
                We Checked Their<br />
                <span className="text-brand-yellow">Paperwork.</span><br />
                You Pick Your Pro.
              </h1>
              
              <p className="text-lg text-white/70 mb-8 max-w-lg">
                State licenses, business registration, BBB ratings, contractor scores — we verify it all so you don&apos;t have to. Free for homeowners.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#chat" className="group inline-flex items-center justify-center gap-2 bg-brand-yellow hover:bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0">
                  <span className="material-symbols-outlined transition-transform group-hover:scale-110">chat</span>
                  Get Matched Free
                </a>
                <a href="tel:6307032607" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black text-lg border border-white/20 backdrop-blur-sm transition-all">
                  <span className="material-symbols-outlined">call</span>
                  (630) 703-2607
                </a>
              </div>
            </div>

            {/* Right — Verification visual */}
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <TrustScoreRing score={88} />
                  <div>
                    <p className="text-white font-black text-lg">Trust Score: 88/100</p>
                    <p className="text-white/50 text-sm">Sample verification result</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {verificationSources.map((src, i) => (
                    <AnimatedSection key={src.label} delay={i * 150} direction="right">
                      <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                        <span className="material-symbols-outlined text-brand-teal text-xl">check_circle</span>
                        <div>
                          <p className="text-white text-sm font-bold">{src.label}</p>
                          <p className="text-white/50 text-xs">{src.desc}</p>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SOCIAL PROOF BAR — Animated counters
          ═══════════════════════════════════════════════════════ */}
      <section className="py-10 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { end: 4, suffix: '', label: 'Databases Checked', icon: 'database' },
              { end: 11, suffix: '+', label: 'Verified Pros', icon: 'verified_user' },
              { end: 12, suffix: '', label: 'Towns Served', icon: 'location_on' },
              { end: 60, suffix: 's', label: 'Average Match Time', icon: 'schedule' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="material-symbols-outlined text-brand-purple text-2xl">{stat.icon}</span>
                  <span className="text-3xl md:text-4xl font-black text-slate-800">
                    <CountUpNumber end={stat.end} suffix={stat.suffix} />
                  </span>
                </div>
                <p className="text-xs md:text-sm text-slate-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          THE DIFFERENCE — Why we're not Angi/Thumbtack
          ═══════════════════════════════════════════════════════ */}
      <AnimatedSection>
        <section className="py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">
                Other Sites Sell Ads.<br />
                <span className="text-brand-purple">We Verify Credentials.</span>
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Most home service sites rank pros by who pays the most. We rank by who&apos;s actually licensed, registered, and reputable — checked against real public records.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* What others do */}
              <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-red-400 text-2xl">cancel</span>
                  <h3 className="font-black text-slate-800 text-lg">Other Directories</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'Pay-to-play rankings',
                    'Self-reported credentials',
                    'Fake or incentivized reviews',
                    'No license verification',
                    'Hidden fees for homeowners',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-500">
                      <span className="material-symbols-outlined text-red-300 text-base">close</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What we do */}
              <div className="bg-white rounded-2xl border-2 border-brand-teal/30 p-6 shadow-lg shadow-brand-teal/5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-brand-teal text-2xl">check_circle</span>
                  <h3 className="font-black text-slate-800 text-lg">FindALocalPro</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'Ranked by verified trust score',
                    'State license database checked',
                    'BBB rating & complaints reviewed',
                    'Business registration confirmed',
                    '100% free for homeowners',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-slate-700 font-medium">
                      <span className="material-symbols-outlined text-brand-teal text-base">check</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════
          VERIFICATION DEEP DIVE — The 4 databases
          ═══════════════════════════════════════════════════════ */}
      <AnimatedSection>
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">
                4 Public Databases. 1 Trust Score.
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                We cross-reference every pro against state and federal records. No one else does this for free.
              </p>
            </div>

            <StaggeredGrid>
              {verificationSources.map((src) => (
                <div key={src.label} className="group bg-white border-2 border-slate-100 rounded-2xl p-6 hover:border-brand-purple/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${src.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <span className="material-symbols-outlined text-2xl">{src.icon}</span>
                  </div>
                  <h3 className="font-black text-slate-800 text-lg mb-2">{src.label}</h3>
                  <p className="text-slate-500 text-sm">{src.desc}</p>
                </div>
              ))}
            </StaggeredGrid>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════
          SERVICES — What we cover
          ═══════════════════════════════════════════════════════ */}
      <AnimatedSection>
        <section className="py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 text-center mb-3">Every Home Service Covered</h2>
            <p className="text-slate-500 text-center mb-12">Pick a service or tell us what you need — we&apos;ll find the right pro</p>
            <StaggeredGrid columns={4}>
              {services.map((svc) => (
                <Link key={svc.label} href={svc.href} className="group bg-white border-2 border-slate-100 rounded-2xl p-5 text-center hover:border-brand-purple hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 ${svc.color} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                    <span className="material-symbols-outlined text-2xl">{svc.icon}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-700 group-hover:text-brand-purple transition-colors">{svc.label}</p>
                </Link>
              ))}
            </StaggeredGrid>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════
          HOW IT WORKS — 3 steps
          ═══════════════════════════════════════════════════════ */}
      <AnimatedSection>
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 text-center mb-3">Get Connected in 3 Steps</h2>
            <p className="text-slate-500 text-center mb-14">No account needed. No hidden fees. Just help.</p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { num: '1', icon: 'chat', title: 'Tell Us What You Need', desc: 'Use our chat or call. Pick your service, describe the issue, enter your zip.' },
                { num: '2', icon: 'verified_user', title: 'We Find a Verified Pro', desc: 'We match you with a licensed, verified professional in your area — checked against real records.' },
                { num: '3', icon: 'handshake', title: 'Get It Done', desc: 'Your pro contacts you directly. No middleman, no runaround.' },
              ].map((step, i) => (
                <AnimatedSection key={step.num} delay={i * 200}>
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <div className="absolute inset-0 bg-brand-purple/10 rounded-2xl rotate-6" />
                      <div className="relative w-full h-full bg-brand-purple text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-purple/20">
                        <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center text-sm font-black text-slate-900 shadow-md">
                        {step.num}
                      </div>
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-2">{step.title}</h3>
                    <p className="text-slate-500 text-sm">{step.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════
          FEATURED PROVIDERS — Social proof
          ═══════════════════════════════════════════════════════ */}
      {providers.length > 0 && (
        <AnimatedSection>
          <section className="py-20 bg-slate-50">
            <div className="max-w-4xl mx-auto px-6">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-800">Verified Local Pros</h2>
                  <p className="text-slate-500 mt-2">Real trust scores from real public records — not paid placements</p>
                </div>
                <Link href="/directory" className="hidden md:inline-flex items-center gap-2 text-brand-purple font-bold hover:underline">
                  View All <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </div>
              <StaggeredGrid columns={3}>
                {providers.map((p) => {
                  const trade = tradeConfig[p.trade] || tradeConfig.general;
                  const score = Math.round(p.trust_score || 0);
                  return (
                    <Link key={p.id} href={`/pro/${p.slug}`} className="group bg-white border-2 border-slate-100 rounded-2xl p-6 hover:border-brand-purple hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${trade.bgColor} ${trade.color} transition-transform duration-300 group-hover:scale-110`}>
                          <span className="material-symbols-outlined text-xl">{trade.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-slate-800 truncate group-hover:text-brand-purple transition-colors">{p.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{trade.label}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {score >= 40 && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-brand-teal text-white shadow-sm">
                              <span className="material-symbols-outlined text-xs">verified</span>
                              {score}/100
                            </span>
                          )}
                          {p.year_established && (
                            <span className="text-xs text-slate-400">Est. {p.year_established}</span>
                          )}
                        </div>
                        <span className="material-symbols-outlined text-slate-300 group-hover:text-brand-purple group-hover:translate-x-1 transition-all">arrow_forward</span>
                      </div>
                    </Link>
                  );
                })}
              </StaggeredGrid>
              <div className="mt-8 text-center md:hidden">
                <Link href="/directory" className="inline-flex items-center gap-2 text-brand-purple font-bold">
                  View All Pros <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* ═══════════════════════════════════════════════════════
          CHAT — Primary conversion
          ═══════════════════════════════════════════════════════ */}
      <section id="chat" className="py-20 bg-gradient-to-br from-brand-purple/5 via-white to-brand-pink/5 scroll-mt-20">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">Tell Us What You Need</h2>
              <p className="text-slate-500">We&apos;ll match you with a verified pro in 60 seconds — free, no obligation</p>
            </div>
          </AnimatedSection>
          <ChatSection />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FAQ — SEO + trust
          ═══════════════════════════════════════════════════════ */}
      <AnimatedSection>
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-black text-slate-800 text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {[
                { q: 'How is FindALocalPro different from Angi or Thumbtack?', a: 'We verify every pro against 4 public databases — state licensing (IDFPR), Secretary of State business registration, BBB ratings, and contractor scores. Other sites rank by who pays the most. We rank by who\'s actually credentialed.' },
                { q: 'What does the Trust Score mean?', a: 'Our Trust Score (0-100) is a composite of verified state license status, business registration, BBB rating, and contractor ranking. It\'s based entirely on public records — not reviews or paid placements.' },
                { q: 'Is it really free for homeowners?', a: 'Yes, 100% free. No account needed, no hidden fees. Tell us what you need and we connect you with a verified pro.' },
                { q: 'What services do you cover?', a: 'We cover 20+ home services including plumbing, HVAC, electrical, roofing, handyman, water damage, pest control, appliance repair, landscaping, remodeling, and more.' },
                { q: 'What areas do you serve?', a: 'We currently serve Downers Grove and the greater DuPage County area, including Westmont, Lisle, Naperville, Lombard, Glen Ellyn, Wheaton, Hinsdale, Oak Brook, and surrounding communities.' },
              ].map((faq) => (
                <details key={faq.q} className="group bg-white border-2 border-slate-100 rounded-2xl overflow-hidden hover:border-brand-purple/20 transition-colors">
                  <summary className="flex items-center justify-between p-6 cursor-pointer font-black text-slate-800 hover:text-brand-purple transition-colors">
                    {faq.q}
                    <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform duration-300 shrink-0 ml-4">expand_more</span>
                  </summary>
                  <p className="px-6 pb-6 text-slate-600 leading-relaxed -mt-1">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════
          SERVICE AREA — Local SEO
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-slate-800 mb-3">Serving DuPage County & Beyond</h2>
          <p className="text-slate-500 mb-8">Verified pros in your neighborhood</p>
          <div className="flex flex-wrap justify-center gap-3">
            {areaTags.map((area) => (
              <span key={area} className="bg-white px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 shadow-sm border border-slate-100 hover:border-brand-purple/30 hover:text-brand-purple transition-all cursor-default">{area}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FINAL CTA — Strong close
          ═══════════════════════════════════════════════════════ */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-brand-purple to-brand-pink text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Stop Guessing. Start Verifying.</h2>
          <p className="text-white/60 mb-10 text-lg">Every pro on our site has been checked against state records. Get matched for free.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#chat" className="group inline-flex items-center justify-center gap-2 bg-brand-yellow hover:bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0">
              <span className="material-symbols-outlined transition-transform group-hover:scale-110">chat</span>
              Get Matched Free
            </a>
            <a href="tel:6307032607" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black text-lg border border-white/20 backdrop-blur-sm transition-all">
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
