import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SUPABASE_URL, SUPABASE_ANON } from '@/lib/supabase';
import { ServiceCallbackForm } from './ServiceCallbackForm';

interface ServiceInfo {
  title: string;
  trade: string;
  icon: string;
  materialIcon: string;
  iconColor: string;
  iconBg: string;
  description: string;
  services: { name: string; desc: string }[];
}

const verticals: Record<string, ServiceInfo> = {
  plumbing: {
    title: 'Plumbing Services', trade: 'plumbing', icon: '🔧', materialIcon: 'water_drop', iconColor: 'text-blue-500', iconBg: 'bg-blue-100',
    description: 'Licensed plumbers in Downers Grove and DuPage County. Leak repair, drain cleaning, water heaters, pipe repair. Verified against state records.',
    services: [
      { name: 'Leak Detection & Repair', desc: 'Find and fix hidden leaks before they cause water damage.' },
      { name: 'Drain Cleaning', desc: 'Clear stubborn clogs in sinks, showers, and main sewer lines.' },
      { name: 'Water Heater Service', desc: 'Installation, repair, and maintenance for tank and tankless systems.' },
      { name: 'Pipe Repair & Replacement', desc: 'Fix burst pipes, corrosion, and outdated plumbing systems.' },
      { name: 'Fixture Installation', desc: 'Faucets, toilets, garbage disposals, and more.' },
      { name: 'Emergency Plumbing', desc: 'Urgent plumbing problems that can\'t wait until tomorrow.' },
    ],
  },
  hvac: {
    title: 'HVAC Services', trade: 'hvac', icon: '❄️', materialIcon: 'mode_fan', iconColor: 'text-purple-500', iconBg: 'bg-purple-100',
    description: 'Expert HVAC service in Downers Grove and DuPage County. AC repair, furnace service, duct cleaning, and new system installation. All verified.',
    services: [
      { name: 'AC Repair & Maintenance', desc: 'Keep your cooling system running efficiently all summer.' },
      { name: 'Furnace Service', desc: 'Heating repair, tune-ups, and new system installation.' },
      { name: 'System Installation', desc: 'New HVAC systems sized and installed for your home.' },
      { name: 'Duct Cleaning & Repair', desc: 'Improve air quality and system efficiency with clean ducts.' },
      { name: 'Thermostat Installation', desc: 'Smart thermostat setup for better comfort and energy savings.' },
      { name: 'Heat Pump Service', desc: 'Installation and repair for energy-efficient heat pump systems.' },
    ],
  },
  electricians: {
    title: 'Electrical Services', trade: 'electrical', icon: '⚡', materialIcon: 'bolt', iconColor: 'text-yellow-600', iconBg: 'bg-yellow-100',
    description: 'Licensed electricians in Downers Grove and DuPage County. Wiring, panel upgrades, EV chargers, emergency repairs. All verified against state records.',
    services: [
      { name: 'Electrical Repairs', desc: 'Fix outlets, switches, breakers, and wiring issues safely.' },
      { name: 'Panel Upgrades', desc: 'Upgrade your electrical panel to handle modern power demands.' },
      { name: 'Lighting Installation', desc: 'Indoor, outdoor, recessed, and landscape lighting.' },
      { name: 'Wiring & Rewiring', desc: 'New construction wiring or updating old knob-and-tube systems.' },
      { name: 'EV Charger Installation', desc: 'Level 2 home charging stations for electric vehicles.' },
      { name: 'Generator Installation', desc: 'Whole-home backup generators for power outage protection.' },
    ],
  },
  roofing: {
    title: 'Roofing Services', trade: 'roofing', icon: '🏠', materialIcon: 'roofing', iconColor: 'text-red-500', iconBg: 'bg-red-100',
    description: 'Licensed roofing contractors in Downers Grove and DuPage County. Roof repair, replacement, inspections, and storm damage. Verified credentials.',
    services: [
      { name: 'Roof Repair', desc: 'Fix leaks, damaged shingles, and flashing issues.' },
      { name: 'Roof Replacement', desc: 'Full roof replacement with quality materials and warranty.' },
      { name: 'Storm Damage Repair', desc: 'Emergency repairs after hail, wind, or tree damage.' },
      { name: 'Roof Inspection', desc: 'Thorough inspection for insurance claims or home sales.' },
      { name: 'Gutter Installation', desc: 'New gutters and gutter guard systems.' },
      { name: 'Flat Roof Service', desc: 'Specialized repair and coating for flat or low-slope roofs.' },
    ],
  },
  'pest-control': {
    title: 'Pest Control Services', trade: 'pest-control', icon: '🐜', materialIcon: 'pest_control', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100',
    description: 'Pest control in Downers Grove and DuPage County. Ants, roaches, rodents, termites, bed bugs, wildlife removal. Licensed, insured pros.',
    services: [
      { name: 'Ant & Roach Control', desc: 'Eliminate common household pests and prevent them from returning.' },
      { name: 'Rodent Removal', desc: 'Mice and rat control with exclusion to keep them out.' },
      { name: 'Termite Treatment', desc: 'Protect your home\'s structure from termite damage.' },
      { name: 'Bed Bug Treatment', desc: 'Thorough bed bug elimination using proven methods.' },
      { name: 'Mosquito & Tick Control', desc: 'Yard treatments to reduce biting insects around your home.' },
      { name: 'Wildlife Removal', desc: 'Humane removal of raccoons, squirrels, and other wildlife.' },
    ],
  },
  'appliance-repair': {
    title: 'Appliance Repair Services', trade: 'appliance-repair', icon: '🔌', materialIcon: 'settings', iconColor: 'text-gray-600', iconBg: 'bg-gray-100',
    description: 'Fast appliance repair in Downers Grove and DuPage County. Fridge, washer, dryer, dishwasher, oven, garbage disposal. Local techs, same-day.',
    services: [
      { name: 'Refrigerator Repair', desc: 'Fix cooling issues, ice makers, and other fridge problems.' },
      { name: 'Washer & Dryer Repair', desc: 'Get your laundry machines back up and running.' },
      { name: 'Dishwasher Repair', desc: 'Fix leaks, drainage issues, and cleaning problems.' },
      { name: 'Oven & Range Repair', desc: 'Repair heating elements, igniters, and temperature issues.' },
      { name: 'Microwave Repair', desc: 'Fix turntable, heating, and display problems.' },
      { name: 'Garbage Disposal Repair', desc: 'Jammed, leaking, or broken disposal units.' },
    ],
  },
};

const areaTags = ['Downers Grove', 'Westmont', 'Lisle', 'Woodridge', 'Darien', 'Naperville', 'Lombard', 'Glen Ellyn', 'Wheaton', 'Hinsdale', 'Oak Brook', 'Bolingbrook'];

interface Provider {
  id: string;
  name: string;
  slug: string;
  trade: string;
  trust_score: number | null;
  is_verified: boolean;
  year_established: number | null;
  phone: string | null;
  address: string | null;
}

interface VerificationCheck {
  business_id: string;
  source: string;
  status: string;
  summary: string;
}

async function getProvidersForTrade(trade: string): Promise<{ providers: Provider[]; checksMap: Record<string, VerificationCheck[]> }> {
  try {
    const headers = { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` };
    const provRes = await fetch(
      `${SUPABASE_URL}/rest/v1/businesses?is_active=eq.true&trust_score=gt.0&trade=eq.${trade}&select=id,name,slug,trade,trust_score,is_verified,year_established,phone,address&order=trust_score.desc`,
      { headers, next: { revalidate: 3600 } }
    );
    const providers: Provider[] = await provRes.json();

    let checksMap: Record<string, VerificationCheck[]> = {};
    if (providers.length > 0) {
      const ids = providers.map(p => p.id);
      const checksRes = await fetch(
        `${SUPABASE_URL}/rest/v1/verification_checks?business_id=in.(${ids.join(',')})&select=business_id,source,status,summary&order=checked_at.desc`,
        { headers, next: { revalidate: 3600 } }
      );
      const checksData: VerificationCheck[] = await checksRes.json();
      for (const c of checksData) {
        if (!checksMap[c.business_id]) checksMap[c.business_id] = [];
        if (!checksMap[c.business_id].some(existing => existing.source === c.source)) {
          checksMap[c.business_id].push(c);
        }
      }
    }
    return { providers, checksMap };
  } catch {
    return { providers: [], checksMap: {} };
  }
}

export async function generateMetadata({ params }: { params: Promise<{ vertical: string }> }): Promise<Metadata> {
  const { vertical } = await params;
  const service = verticals[vertical];
  if (!service) return { title: 'Service Not Found | FindALocalPro' };

  return {
    title: `${service.title} in Downers Grove, IL | FindALocalPro`,
    description: service.description,
    openGraph: {
      title: `${service.title} in Downers Grove, IL`,
      description: service.description,
      url: `https://findalocalpro.com/services/${vertical}`,
      images: [{ url: 'https://findalocalpro.com/og-image.png', width: 1200, height: 630 }],
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(verticals).map(v => ({ vertical: v }));
}

const sourceLabels: Record<string, { icon: string; label: string }> = {
  idfpr: { icon: 'badge', label: 'IDFPR License' },
  bbb: { icon: 'workspace_premium', label: 'BBB' },
  buildzoom: { icon: 'construction', label: 'BuildZoom' },
  sos: { icon: 'account_balance', label: 'IL SOS' },
  google: { icon: 'star', label: 'Google' },
};

export default async function ServiceLandingPage({ params }: { params: Promise<{ vertical: string }> }) {
  const { vertical } = await params;
  const service = verticals[vertical];
  if (!service) notFound();

  const { providers, checksMap } = await getProvidersForTrade(service.trade);

  // Service structured data
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    serviceType: service.trade,
    areaServed: {
      '@type': 'Place',
      name: 'DuPage County, IL',
    },
    provider: {
      '@type': 'Organization',
      name: 'FindALocalPro',
      url: 'https://findalocalpro.com',
    },
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Header step={0} totalSteps={0} />
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Services', href: '/directory' },
            { label: service.title },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-purple/5 via-white to-brand-pink/5 py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-sm font-bold mb-6">
                <span className={`material-symbols-outlined text-base ${service.iconColor}`}>{service.materialIcon}</span>
                {providers.length > 0 ? `${providers.length} Verified Pros` : 'Verified Professionals'}
              </div>

              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-800 mb-6 leading-[1.1]">
                {service.title}<br />
                <span className="text-brand-purple">in Downers Grove, IL</span>
              </h1>

              <p className="text-lg text-slate-500 mb-8 max-w-lg">{service.description}</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/get-matched" className="group inline-flex items-center justify-center gap-2 bg-brand-purple hover:bg-brand-pink text-white px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0">
                  <span className="material-symbols-outlined transition-transform group-hover:scale-110">chat</span>
                  Get Matched Free
                </Link>
                <a href="tel:6307032607" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 px-8 py-4 rounded-2xl font-black text-lg border-2 border-slate-200 transition-all shadow-lg hover:-translate-y-1">
                  <span className="material-symbols-outlined">call</span>
                  (630) 703-2607
                </a>
              </div>
            </div>

            {/* Quick stats */}
            <div className="hidden md:block">
              <div className="bg-white rounded-3xl border-2 border-slate-100 p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${service.iconBg} ${service.iconColor}`}>
                    <span className="material-symbols-outlined text-3xl">{service.materialIcon}</span>
                  </div>
                  <div>
                    <p className="text-slate-800 font-black text-lg">{service.title}</p>
                    <p className="text-slate-400 text-sm">DuPage County, IL</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: 'verified_user', label: `${providers.length} verified pros`, desc: 'Checked against state records' },
                    { icon: 'schedule', label: 'Same-day matching', desc: 'Get connected in minutes' },
                    { icon: 'payments', label: '100% free', desc: 'No cost for homeowners' },
                    { icon: 'shield', label: '4 databases checked', desc: 'IDFPR, SOS, BBB, BuildZoom' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                      <span className="material-symbols-outlined text-brand-teal text-xl">{item.icon}</span>
                      <div>
                        <p className="text-slate-800 text-sm font-bold">{item.label}</p>
                        <p className="text-slate-400 text-xs">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Pros Directory */}
      {providers.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">
                Verified {service.title.replace(' Services', '')} Pros
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Every pro below has been checked against state licensing, business registration, and contractor databases.
              </p>
            </div>

            <div className="space-y-6">
              {providers.map((p) => {
                const checks = checksMap[p.id] || [];
                const passChecks = checks.filter(c => c.status === 'pass');
                const score = Math.round(p.trust_score || 0);

                return (
                  <Link key={p.id} href={`/pro/${p.slug}`} className="block group">
                    <div className="bg-white rounded-2xl border-2 border-slate-100 p-6 hover:border-brand-purple/30 hover:shadow-xl transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Left: Name + info */}
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${service.iconBg} ${service.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                            <span className="material-symbols-outlined text-2xl">{service.materialIcon}</span>
                          </div>
                          <div>
                            <p className="font-black text-slate-800 text-lg group-hover:text-brand-purple transition-colors">{p.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              {p.year_established && (
                                <span className="text-xs text-slate-400">Est. {p.year_established}</span>
                              )}
                              {p.address && (
                                <span className="text-xs text-slate-400">{p.address}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Score + CTA */}
                        <div className="flex items-center gap-4">
                          {score >= 40 && (
                            <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-black bg-brand-teal text-white shadow-sm">
                              <span className="material-symbols-outlined text-sm">verified</span>
                              {score}/100
                            </span>
                          )}
                          <span className="material-symbols-outlined text-slate-300 group-hover:text-brand-purple group-hover:translate-x-1 transition-all">arrow_forward</span>
                        </div>
                      </div>

                      {/* Verification badges */}
                      {passChecks.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                          {passChecks.map((check) => {
                            const src = sourceLabels[check.source] || { icon: 'fact_check', label: check.source };
                            return (
                              <span key={check.source} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-600 border border-slate-100">
                                <span className="material-symbols-outlined text-brand-teal text-sm">check_circle</span>
                                {src.label}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Link href="/directory" className="inline-flex items-center gap-2 text-brand-purple font-bold hover:underline">
                Browse Full Directory <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Services We Cover */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 text-center mb-3">What We Help With</h2>
          <p className="text-slate-500 text-center mb-12">Common {service.title.toLowerCase()} we connect you with pros for</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.services.map((s) => (
              <div key={s.name} className="bg-white border-2 border-slate-100 rounded-2xl p-6 hover:border-brand-purple/30 hover:shadow-lg transition-all duration-300">
                <h3 className="font-black text-slate-800 mb-2">{s.name}</h3>
                <p className="text-slate-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 text-center mb-3">Get Connected in 3 Steps</h2>
          <p className="text-slate-500 text-center mb-14">No account needed. No hidden fees. Just help.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '1', icon: 'chat', title: 'Tell Us What You Need', desc: `Use our chat or call. Describe your ${service.title.toLowerCase().replace(' services', '')} issue and enter your zip.` },
              { num: '2', icon: 'verified_user', title: 'We Find a Verified Pro', desc: 'We match you with a licensed, verified professional in your area — checked against real records.' },
              { num: '3', icon: 'handshake', title: 'Get It Done', desc: 'Your pro contacts you directly. No middleman, no runaround.' },
            ].map((step) => (
              <div key={step.num} className="text-center">
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
            ))}
          </div>
        </div>
      </section>

      {/* Callback Form */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-lg mx-auto px-6">
          <ServiceCallbackForm vertical={vertical} />
        </div>
      </section>

      {/* Service Area */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-slate-800 mb-3">Serving DuPage County & Beyond</h2>
          <p className="text-slate-500 mb-8">Verified {service.title.toLowerCase().replace(' services', '')} pros in your neighborhood</p>
          <div className="flex flex-wrap justify-center gap-3">
            {areaTags.map((area) => (
              <span key={area} className="bg-slate-50 px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 shadow-sm border border-slate-100 hover:border-brand-purple/30 hover:text-brand-purple transition-all cursor-default">{area}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-purple text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Stop Guessing. Start Verifying.</h2>
          <p className="text-purple-200 mb-10 text-lg">Every pro on our site has been checked against state records. Get matched for free.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-matched" className="group inline-flex items-center justify-center gap-2 bg-brand-yellow hover:bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0">
              <span className="material-symbols-outlined transition-transform group-hover:scale-110">chat</span>
              Get Matched Free
            </Link>
            <a href="tel:6307032607" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black text-lg border-2 border-white/30 transition-all">
              <span className="material-symbols-outlined">call</span>
              (630) 703-2607
            </a>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 text-center mb-3">Other Services We Verify</h2>
          <p className="text-slate-500 text-center mb-12">Need help with something else? We verify pros in all home service trades.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(verticals)
              .filter(([key]) => key !== vertical)
              .map(([key, relatedService]) => (
                <Link
                  key={key}
                  href={`/services/${key}`}
                  className="group block bg-white border-2 border-slate-100 rounded-2xl p-6 hover:border-brand-purple/30 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${relatedService.iconBg} ${relatedService.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                      <span className="material-symbols-outlined text-2xl">{relatedService.materialIcon}</span>
                    </div>
                    <h3 className="font-black text-slate-800 group-hover:text-brand-purple transition-colors">{relatedService.title}</h3>
                  </div>
                  <p className="text-slate-500 text-sm mb-4">{relatedService.description.split('.')[0]}.</p>
                  <div className="flex items-center gap-2 text-brand-purple font-bold text-sm group-hover:gap-3 transition-all">
                    View Pros <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
