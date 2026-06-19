import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Local Partner Program | FindALocalPro',
  description: 'Exclusive local sponsor slots for plumbers, HVAC companies, electricians, and other trusted home-service providers.',
  alternates: { canonical: 'https://partners.findalocalpro.com' },
  openGraph: {
    title: 'FindALocalPro Local Partner Program',
    description: 'Get recommended when local homeowners ask for your service. One provider per trade per area.',
    url: 'https://partners.findalocalpro.com',
    type: 'website',
  },
};

const verticals = [
  { name: 'Plumbing', demand: '547 tracked asks', note: 'Leaks, drains, water heaters, sump pumps' },
  { name: 'HVAC', demand: '187 tracked asks', note: 'AC, heating, furnaces, emergency cooling' },
  { name: 'Electrical', demand: '253 tracked asks', note: 'Panels, outlets, fixtures, troubleshooting' },
];

const futureVerticals = ['Pest control', 'Appliance repair', 'Handyman', 'Roofing / gutters', 'Lawn / landscaping / trees', 'Concrete / masonry'];

const howItWorks = [
  {
    title: 'We monitor local demand',
    body: 'FindALocalPro tracks homeowner service requests across local neighborhood channels and service-intent conversations.',
    icon: 'radar',
  },
  {
    title: 'One verified provider gets the slot',
    body: 'Each trade and area is exclusive. We do not sell the same local category slot to five competitors.',
    icon: 'verified',
  },
  {
    title: 'You get calls and proof',
    body: 'Partners receive tracked calls plus a monthly proof report showing relevant opportunities and market demand.',
    icon: 'call',
  },
];

const faqs = [
  {
    q: 'Is this pay-per-lead?',
    a: 'No. This is a local sponsorship slot with monitored demand, recommendation routing, call tracking, and monthly proof reporting. We may use fallback lead partners where no direct sponsor exists.',
  },
  {
    q: 'Can any contractor buy a slot instantly?',
    a: 'No. Applications are reviewed first. The program depends on trust, territory fit, and a credible local reputation.',
  },
  {
    q: 'What does exclusive mean?',
    a: 'One provider per trade per approved local territory. Example: one Warrington plumber, one Doylestown HVAC provider, one Naperville electrician.',
  },
  {
    q: 'What happens after I apply?',
    a: 'We review your business, service area, reviews, and slot availability. If it fits, we confirm territory, set up call tracking, and send payment/onboarding details.',
  },
];

const fieldClass = 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10';
const labelClass = 'text-sm font-black text-slate-700';

export default async function PartnersPage({ searchParams }: { searchParams?: Promise<{ applied?: string }> }) {
  const params = searchParams ? await searchParams : {};
  const applied = params?.applied === '1';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header step={0} totalSteps={0} />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-purple/10 via-white to-brand-teal/10 py-20 md:py-28">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-pink/20 blur-3xl" />
          <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-brand-purple/20 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-purple/20 bg-white/80 px-4 py-2 text-sm font-black text-brand-purple shadow-sm">
                  <span className="material-symbols-outlined text-base text-brand-teal">workspace_premium</span>
                  Founding partner slots now open
                </div>
                <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight text-slate-900 md:text-7xl">
                  Get recommended when local homeowners ask for your service.
                </h1>
                <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-600">
                  Exclusive local sponsor slots for plumbers, HVAC companies, and electricians. One verified provider per trade per area.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href="#apply" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-purple px-7 py-4 text-lg font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl">
                    Apply for your local slot
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </a>
                  <a href="#pricing" className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-7 py-4 text-lg font-black text-slate-800 shadow-sm transition hover:border-brand-purple/40">
                    See pricing
                  </a>
                </div>
                <p className="mt-4 text-sm font-bold text-slate-500">$99 setup. $99/month founding rate for 6 months. Cancel anytime.</p>
              </div>

              <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-2xl backdrop-blur">
                <div className="rounded-3xl bg-slate-900 p-6 text-white">
                  <p className="text-sm font-black uppercase tracking-widest text-brand-teal">Monthly proof report preview</p>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {[
                      ['Requests monitored', '2325'],
                      ['Relevant calls tracked', '72'],
                      ['Top direct category', 'Plumbing'],
                      ['Slot model', 'Exclusive'],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl bg-white/10 p-4">
                        <p className="text-2xl font-black">{value}</p>
                        <p className="mt-1 text-sm text-white/65">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-2xl bg-white p-4 text-slate-900">
                    <p className="font-black">Example territory</p>
                    <p className="mt-1 text-sm text-slate-600">Warrington Plumbing, Doylestown HVAC, Naperville Electrical</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-6 md:grid-cols-3">
              {howItWorks.map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                  <span className="material-symbols-outlined rounded-2xl bg-brand-purple/10 p-3 text-3xl text-brand-purple">{item.icon}</span>
                  <h2 className="mt-5 text-2xl font-black text-slate-900">{item.title}</h2>
                  <p className="mt-3 leading-7 text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="text-sm font-black uppercase tracking-wider text-brand-purple">Founding offer</p>
                <h2 className="mt-2 text-4xl font-black text-slate-900 md:text-5xl">Simple enough to test. Useful enough to keep.</h2>
                <p className="mt-4 text-lg leading-8 text-slate-600">
                  The first version is intentionally manual: application review, exclusive territory approval, call tracking, and monthly proof reporting before heavy software automation.
                </p>
              </div>
              <div className="rounded-[2rem] border-2 border-brand-purple bg-white p-8 shadow-xl">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest text-brand-purple">Founding partner</p>
                    <div className="mt-3 flex items-end gap-2">
                      <span className="text-6xl font-black text-slate-900">$99</span>
                      <span className="pb-2 text-xl font-bold text-slate-500">/month</span>
                    </div>
                    <p className="mt-2 font-bold text-slate-600">Locked for 6 months for early partners.</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">
                    <p>$99 setup fee</p>
                    <p>Standard starts at $149/mo</p>
                    <p>Cancel anytime</p>
                  </div>
                </div>
                <ul className="mt-8 grid gap-3 text-slate-700 sm:grid-cols-2">
                  {['Exclusive category placement', 'Tracked phone number', 'Monthly proof report', 'Manual approval workflow', 'Territory availability check', 'Fallback coverage where needed'].map((item) => (
                    <li key={item} className="flex items-center gap-3 font-bold">
                      <span className="material-symbols-outlined text-brand-teal">check_circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-wider text-brand-purple">Initial categories</p>
                <h2 className="mt-2 text-4xl font-black text-slate-900">Start where homeowner demand is already visible.</h2>
              </div>
              <p className="max-w-xl text-slate-600">Demand counts are internal tracked service requests, used to prioritize partner inventory and outreach.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {verticals.map((v) => (
                <div key={v.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-3xl font-black text-slate-900">{v.name}</p>
                  <p className="mt-3 inline-flex rounded-full bg-brand-teal/15 px-3 py-1 text-sm font-black text-teal-700">{v.demand}</p>
                  <p className="mt-4 text-slate-600">{v.note}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-6">
              <p className="font-black text-slate-900">Future expansion categories</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {futureVerticals.map((v) => <span key={v} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">{v}</span>)}
              </div>
            </div>
          </div>
        </section>

        <section id="apply" className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="text-sm font-black uppercase tracking-wider text-brand-purple">Apply first, pay later</p>
                <h2 className="mt-2 text-4xl font-black text-slate-900 md:text-5xl">Claiming a slot starts with verification.</h2>
                <p className="mt-4 text-lg leading-8 text-slate-600">
                  Tell us about your business and preferred service area. If the category and territory are open, we will review your reputation, confirm fit, and send onboarding details.
                </p>
                {applied && (
                  <div className="mt-6 rounded-2xl border border-brand-teal/30 bg-brand-teal/10 p-5 font-bold text-teal-800">
                    Application received. We will review the slot and follow up shortly.
                  </div>
                )}
              </div>

              <form action="/api/partners/apply" method="post" className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl md:p-8">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className={labelClass}>Business name</span>
                    <input className={fieldClass} name="businessName" required />
                  </label>
                  <label className="space-y-2">
                    <span className={labelClass}>Contact name</span>
                    <input className={fieldClass} name="contactName" required />
                  </label>
                  <label className="space-y-2">
                    <span className={labelClass}>Email</span>
                    <input className={fieldClass} name="email" type="email" required />
                  </label>
                  <label className="space-y-2">
                    <span className={labelClass}>Phone</span>
                    <input className={fieldClass} name="phone" type="tel" required />
                  </label>
                  <label className="space-y-2">
                    <span className={labelClass}>Website</span>
                    <input className={fieldClass} name="website" type="url" placeholder="https://" />
                  </label>
                  <label className="space-y-2">
                    <span className={labelClass}>Service category</span>
                    <select className={fieldClass} name="serviceCategory" required defaultValue="">
                      <option value="" disabled>Select one</option>
                      <option>Plumbing</option>
                      <option>HVAC</option>
                      <option>Electrical</option>
                      <option>Pest control</option>
                      <option>Appliance repair</option>
                      <option>Handyman</option>
                      <option>Roofing / gutters</option>
                      <option>Lawn / landscaping / trees</option>
                      <option>Concrete / masonry</option>
                    </select>
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span className={labelClass}>Primary service areas / ZIPs</span>
                    <input className={fieldClass} name="serviceAreas" required placeholder="Example: Warrington, Doylestown, 18976" />
                  </label>
                  <label className="space-y-2">
                    <span className={labelClass}>Years in business</span>
                    <input className={fieldClass} name="yearsInBusiness" />
                  </label>
                  <label className="space-y-2">
                    <span className={labelClass}>Google Business Profile URL</span>
                    <input className={fieldClass} name="googleBusinessProfile" type="url" placeholder="https://" />
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span className={labelClass}>Preferred territory</span>
                    <input className={fieldClass} name="preferredTerritory" required placeholder="Example: Warrington Plumbing" />
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span className={labelClass}>Notes / special services</span>
                    <textarea className={fieldClass} name="notes" rows={4} placeholder="Emergency availability, response time, licensing, insurance, specialties..." />
                  </label>
                </div>
                <label className="mt-5 flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">
                  <input className="mt-1 h-4 w-4 accent-brand-purple" type="checkbox" name="licenseConfirmed" required />
                  <span>I confirm this business is properly licensed/insured where required and can be reviewed before approval.</span>
                </label>
                <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-purple px-7 py-4 text-lg font-black text-white shadow-xl transition hover:-translate-y-0.5" type="submit">
                  Submit partner application
                  <span className="material-symbols-outlined">send</span>
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 py-16 text-white">
          <div className="mx-auto max-w-4xl px-6">
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-wider text-brand-teal">FAQ</p>
              <h2 className="mt-2 text-4xl font-black">Built for trust, not lead spam.</h2>
            </div>
            <div className="mt-10 space-y-4">
              {faqs.map((faq) => (
                <details key={faq.q} className="rounded-2xl bg-white/10 p-6 open:bg-white open:text-slate-900">
                  <summary className="cursor-pointer text-lg font-black">{faq.q}</summary>
                  <p className="mt-4 leading-7 text-slate-300 open:text-slate-600">{faq.a}</p>
                </details>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/" className="font-bold text-brand-teal hover:underline">Back to FindALocalPro homeowner site</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
