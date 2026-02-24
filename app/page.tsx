import Link from 'next/link';
import { SUPABASE_URL, SUPABASE_ANON } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AnimatedSection, CountUpNumber, TrustScoreRing, StaggeredGrid, FloatingCard, HeroAnimatedHeadline, HeroCTAButtons, HeroFadeIn } from './HomeAnimations';
import { ChatModal, ChatTrigger } from './ChatModal';

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
  { icon: 'water_drop', label: 'Plumbing', bg: 'bg-blue-50', text: 'text-blue-500', href: '/services/plumbing' },
  { icon: 'mode_fan', label: 'HVAC & Heating', bg: 'bg-purple-50', text: 'text-purple-500', href: '/services/hvac' },
  { icon: 'bolt', label: 'Electrician', bg: 'bg-yellow-50', text: 'text-yellow-600', href: '/services/electricians' },
  { icon: 'roofing', label: 'Roofing', bg: 'bg-red-50', text: 'text-red-500', href: '/services/roofing' },
  { icon: 'handyman', label: 'Handyman', bg: 'bg-orange-50', text: 'text-orange-600', href: '/get-matched' },
  { icon: 'water_damage', label: 'Water Damage', bg: 'bg-cyan-50', text: 'text-cyan-600', href: '/get-matched' },
  { icon: 'science', label: 'Mold Removal', bg: 'bg-lime-50', text: 'text-lime-600', href: '/get-matched' },
  { icon: 'settings', label: 'Appliance Repair', bg: 'bg-gray-50', text: 'text-gray-600', href: '/services/appliance-repair' },
  { icon: 'pest_control', label: 'Pest Control', bg: 'bg-emerald-50', text: 'text-emerald-600', href: '/services/pest-control' },
  { icon: 'key', label: 'Locksmith', bg: 'bg-amber-50', text: 'text-amber-600', href: '/get-matched' },
  { icon: 'forest', label: 'Tree Services', bg: 'bg-emerald-50', text: 'text-emerald-700', href: '/get-matched' },
  { icon: 'solar_power', label: 'Solar', bg: 'bg-yellow-50', text: 'text-yellow-600', href: '/get-matched' },
];

const verificationSources = [
  { icon: 'badge', label: 'IDFPR', desc: 'Confirms your pro passed state licensing exams and carries required insurance. Expired or revoked? They\'re not on our site.', color: 'text-blue-600 bg-blue-50' },
  { icon: 'account_balance', label: 'Secretary of State', desc: 'Proves they\'re a real, registered Illinois business — not a fly-by-night operation that disappears after cashing your check.', color: 'text-indigo-600 bg-indigo-50' },
  { icon: 'workspace_premium', label: 'BBB', desc: 'Shows complaint history and how they handle disputes. The stuff they don\'t put on their website — but you need to know.', color: 'text-amber-600 bg-amber-50' },
  { icon: 'construction', label: 'BuildZoom', desc: 'Ranks contractors by actual permit history and project quality. Real track record, not just marketing claims.', color: 'text-emerald-600 bg-emerald-50' },
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
      <section className="relative bg-gradient-to-br from-brand-purple/5 via-white to-brand-pink/5 py-24 md:py-32 overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left — Copy */}
            <div>
              <HeroFadeIn delay={0} direction="up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-sm font-bold mb-6">
                  <span className="material-symbols-outlined text-brand-teal text-base">verified</span>
                  Every pro verified against 4 public databases
                </div>
              </HeroFadeIn>
              
              <HeroAnimatedHeadline />
              
              <HeroFadeIn delay={1800} direction="up">
                <p className="text-lg text-slate-500 mb-8 max-w-lg">
                  4 databases checked for every pro: state license • BBB rating • business registration • contractor score. Always free.
                </p>
              </HeroFadeIn>
              
              <HeroCTAButtons>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">Get Matched Free</span>
                    <ChatTrigger className="hero-cta-primary hero-cta-glow ripple-btn group inline-flex items-center justify-center gap-2 bg-brand-purple text-white px-6 sm:px-8 py-4 rounded-2xl font-black text-base sm:text-lg cursor-pointer shadow-xl">
                      <span className="material-symbols-outlined transition-transform group-hover:scale-110">chat</span>
                      Find My Pro
                    </ChatTrigger>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Call Now</span>
                    <a href="tel:6304071727" className="hero-cta-secondary inline-flex items-center justify-center gap-2 bg-white text-slate-800 px-6 sm:px-8 py-4 rounded-2xl font-black text-base sm:text-lg border-2 border-slate-200 shadow-lg">
                      <span className="material-symbols-outlined phone-ring">call</span>
                      (630) 407-1727
                    </a>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-brand-teal text-sm">lock</span>
                  No spam, no credit card. Takes 60 seconds.
                </p>
                <p className="mt-2 text-xs text-slate-400 max-w-md">
                  By using our chat or calling, you provide prior express written consent to receive calls and SMS from FindALocalPro, including via automated technology and artificial/prerecorded voice, regarding your service request. Consent is not a condition of service. Msg &amp; data rates may apply. Reply STOP to opt out.
                </p>
              </HeroCTAButtons>
            </div>

            {/* Right — Verification visual */}
            <HeroFadeIn delay={600} direction="right">
            <FloatingCard className="hidden md:block">
              <div className="bg-white rounded-3xl border-2 border-slate-100 p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <TrustScoreRing score={88} light />
                  <div>
                    <p className="text-slate-800 font-black text-lg">Trust Score: 88/100</p>
                    <p className="text-slate-400 text-sm">Sample verification result</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'State License (IDFPR)', desc: 'Active IL license verified' },
                    { label: 'Secretary of State', desc: 'Business registration confirmed' },
                    { label: 'Better Business Bureau', desc: 'Rating & complaint history' },
                    { label: 'BuildZoom', desc: 'Contractor score & rank' },
                  ].map((src, i) => (
                    <AnimatedSection key={src.label} delay={i * 150} direction="right">
                      <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                        <span className="material-symbols-outlined text-brand-teal text-xl">check_circle</span>
                        <div>
                          <p className="text-slate-800 text-sm font-bold">{src.label}</p>
                          <p className="text-slate-400 text-xs">{src.desc}</p>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </FloatingCard>
            </HeroFadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SOCIAL PROOF BAR — Animated counters
          ═══════════════════════════════════════════════════════ */}
      <section className="py-10 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8">
            {[
              { end: 4, suffix: '', label: 'Government Databases', icon: 'database' },
              { end: 137, suffix: '+', label: 'Records Analyzed', icon: 'verified_user' },
              { end: 60, suffix: 's', label: 'Under 60s Match', icon: 'schedule' },
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
              <AnimatedSection delay={0} direction="left">
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
                    ].map((item, i) => (
                      <AnimatedSection key={item} delay={200 + i * 100} direction="left">
                        <li className="flex items-center gap-3 text-slate-500">
                          <span className="material-symbols-outlined text-red-300 text-base">close</span>
                          {item}
                        </li>
                      </AnimatedSection>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>

              {/* What we do */}
              <AnimatedSection delay={100} direction="right">
                <div className="bg-white rounded-2xl border-2 border-brand-teal/30 p-6 shadow-lg shadow-brand-teal/5 hover:shadow-xl hover:border-brand-teal/50 transition-all duration-500">
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
                    ].map((item, i) => (
                      <AnimatedSection key={item} delay={300 + i * 100} direction="right">
                        <li className="flex items-center gap-3 text-slate-700 font-medium">
                          <span className="material-symbols-outlined text-brand-teal text-base">check</span>
                          {item}
                        </li>
                      </AnimatedSection>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

      {/* ═══════════════════════════════════════════════════════
          VERIFICATION DEEP DIVE — The 4 databases
          ═══════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════
          SERVICES — What we cover
          ═══════════════════════════════════════════════════════ */}
              <section className="py-20 bg-slate-50 overflow-hidden">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 text-center mb-3">Every Home Service Covered</h2>
            <p className="text-slate-500 text-center mb-12">Pick a service or tell us what you need — we&apos;ll find the right pro</p>
            <div className="grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {services.map((svc, i) => (
                <AnimatedSection key={svc.label} delay={i * 60}>
                  <Link href={svc.href} className="group block bg-white border-2 border-slate-100 rounded-2xl p-3 sm:p-5 text-center shadow-sm hover:border-brand-purple hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 ${svc.bg} ${svc.text} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <span className="material-symbols-outlined text-2xl">{svc.icon}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 group-hover:text-brand-purple transition-colors">{svc.label}</p>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

      {/* ═══════════════════════════════════════════════════════
          HOW IT WORKS — 3 steps
          ═══════════════════════════════════════════════════════ */}
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
                    <div className="relative w-20 h-20 mx-auto mb-6 overflow-hidden rounded-2xl">
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

      {/* ═══════════════════════════════════════════════════════
          FEATURED PROVIDERS — Social proof
          ═══════════════════════════════════════════════════════ */}
      {providers.length > 0 && (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {providers.map((p, i) => {
                  const trade = tradeConfig[p.trade] || tradeConfig.general;
                  const score = Math.round(p.trust_score || 0);
                  return (
                    <AnimatedSection key={p.id} delay={i * 80}>
                    <Link href={`/pro/${p.slug}`} className="group block bg-white border-2 border-slate-100 rounded-2xl p-6 hover:border-brand-purple hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
                        <span className="material-symbols-outlined text-slate-300 group-hover:text-brand-purple transition-colors">arrow_forward</span>
                      </div>
                    </Link>
                    </AnimatedSection>
                  );
                })}
              </div>
              <div className="mt-8 text-center md:hidden">
                <Link href="/directory" className="inline-flex items-center gap-2 text-brand-purple font-bold">
                  View All Pros <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </div>
            </div>
          </section>
      )}

      {/* Chat Modal — desktop: popover, mobile: redirects to /get-matched */}
      <ChatModal />

      {/* ═══════════════════════════════════════════════════════
          FAQ — SEO + trust
          ═══════════════════════════════════════════════════════ */}
              <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-black text-slate-800 text-center mb-10">What Homeowners Ask Us</h2>
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

      {/* ═══════════════════════════════════════════════════════
          SERVICE AREA — Local SEO
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-slate-800 mb-3">Serving DuPage County & Beyond</h2>
          <p className="text-slate-500 mb-8">Verified pros in your neighborhood — click a town to learn more</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { name: 'Downers Grove', slug: 'downers-grove' }, { name: 'Westmont', slug: 'westmont' },
              { name: 'Lisle', slug: 'lisle' }, { name: 'Woodridge', slug: 'woodridge' },
              { name: 'Darien', slug: 'darien' }, { name: 'Naperville', slug: 'naperville' },
              { name: 'Lombard', slug: 'lombard' }, { name: 'Glen Ellyn', slug: 'glen-ellyn' },
              { name: 'Wheaton', slug: 'wheaton' }, { name: 'Hinsdale', slug: 'hinsdale' },
              { name: 'Oak Brook', slug: 'oak-brook' }, { name: 'Bolingbrook', slug: 'bolingbrook' },
            ].map((town) => (
              <Link key={town.slug} href={`/locations/${town.slug}`} className="bg-white px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 shadow-sm border border-slate-100 hover:border-brand-purple/30 hover:text-brand-purple hover:shadow-md transition-all">{town.name}</Link>
            ))}
          </div>
          <Link href="/directory" className="inline-flex items-center gap-2 bg-brand-purple text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-pink transition-all shadow-lg hover:-translate-y-0.5">
            <span className="material-symbols-outlined text-base">list_alt</span>
            Browse Full Directory
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FINAL CTA — Strong close
          ═══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-brand-purple text-center">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedSection delay={0}>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Stop Guessing. Start Verifying.</h2>
            <p className="text-purple-200 mb-10 text-lg">Every pro on our site has been checked against state records. Find yours for free.</p>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ChatTrigger className="hero-cta-primary group inline-flex items-center justify-center gap-2 bg-brand-yellow hover:bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 cursor-pointer">
                <span className="material-symbols-outlined transition-transform group-hover:scale-110">chat</span>
                Find My Pro
              </ChatTrigger>
              <a href="tel:6304071727" className="hero-cta-secondary inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black text-lg border-2 border-white/30 transition-all">
                <span className="material-symbols-outlined phone-ring">call</span>
                (630) 407-1727
              </a>
            </div>
            <p className="mt-4 text-xs text-white/50 max-w-lg mx-auto">
              By using our chat or calling, you provide prior express written consent to receive calls and SMS from FindALocalPro, including via automated technology and artificial/prerecorded voice, regarding your service request. Consent is not a condition of service. Msg &amp; data rates may apply. Reply STOP to opt out.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
