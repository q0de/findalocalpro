import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'About Us — How We Verify Contractors | FindALocalPro',
  description: 'We check every contractor against 4 government databases: IDFPR, IL SOS, BBB, and BuildZoom. Learn how our verification works.',
  openGraph: {
    title: 'About Us — How We Verify Contractors',
    description: 'Every pro verified against 4 public databases. Learn our process.',
    type: 'website',
    url: 'https://findalocalpro.com/about',
    images: [{ url: 'https://findalocalpro.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us — How We Verify Contractors',
    description: 'Every pro verified against 4 public databases. Learn our process.',
    images: ['https://findalocalpro.com/og-image.png'],
  },
  alternates: { canonical: 'https://findalocalpro.com/about' },
};

const verificationSteps = [
  {
    num: '1',
    icon: 'badge',
    title: 'IDFPR License Check',
    desc: 'We query the Illinois Department of Financial and Professional Regulation database to confirm every contractor holds a current, active license. We check for disciplinary actions, complaints, and license expiration dates.',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    num: '2',
    icon: 'account_balance',
    title: 'Secretary of State Verification',
    desc: 'We verify each business is properly registered with the Illinois Secretary of State. This confirms they\'re a legitimate, legally operating entity — not a fly-by-night operation.',
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    num: '3',
    icon: 'workspace_premium',
    title: 'BBB Rating & Complaints',
    desc: 'We pull Better Business Bureau data including accreditation status, letter grade, complaint history, and resolution patterns. A business with unresolved complaints gets flagged.',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    num: '4',
    icon: 'construction',
    title: 'BuildZoom Contractor Score',
    desc: 'BuildZoom analyzes building permit data and contractor performance. We use their score to round out our trust assessment with real project history and performance data.',
    color: 'text-emerald-600 bg-emerald-50',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header step={0} totalSteps={0} />

      <div className="max-w-4xl mx-auto px-6 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'About' },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-brand-purple/5 via-white to-brand-pink/5">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-800 mb-6 leading-[1.1]">
            Why We Built<br />
            <span className="text-brand-purple">FindALocalPro</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl">
            Most home service directories rank contractors by who pays the most. We thought homeowners deserved better — a directory where every pro is verified against real public records, not self-reported credentials.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-black text-slate-800 mb-6">The Problem We Solve</h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Hiring a home service professional shouldn&apos;t feel like gambling. But on most platforms, you&apos;re trusting self-reported credentials, paid placements, and reviews that may be incentivized or fake. There&apos;s no easy way for a homeowner in Downers Grove or DuPage County to verify that a plumber actually has a current state license, or that an electrician&apos;s business is properly registered.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              We built FindALocalPro to fix that. Every contractor in our directory has been cross-referenced against four independent public databases. We don&apos;t charge homeowners. We don&apos;t let pros pay their way to the top. Your trust score is earned from real records — period.
            </p>
          </div>
        </div>
      </section>

      {/* Verification Methodology */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-black text-slate-800 mb-3">How We Verify Every Pro</h2>
          <p className="text-slate-500 mb-12">Our Trust Score (0-100) is calculated from four independent data sources. No self-reporting. No pay-to-play.</p>

          <div className="space-y-8">
            {verificationSteps.map((step) => (
              <div key={step.num} className="flex gap-6 items-start">
                <div className="shrink-0">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${step.color}`}>
                    <span className="material-symbols-outlined text-2xl">{step.icon}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg mb-2">Step {step.num}: {step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-2xl border-2 border-brand-teal/20 p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-brand-teal text-2xl">calculate</span>
              <h3 className="font-black text-slate-800 text-lg">The Trust Score</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Results from all four checks are combined into a single Trust Score from 0-100. Pros with active licenses, clean BBB records, confirmed business registration, and strong contractor scores rank highest. We re-verify periodically to keep scores current. If a license lapses or a complaint is filed, the score updates.
            </p>
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-black text-slate-800 mb-6">Where We Operate</h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            FindALocalPro currently serves Downers Grove and the greater DuPage County area in Illinois. We&apos;re focused on depth over breadth — thoroughly verifying every pro in our coverage area rather than listing thousands of unverified contractors nationwide.
          </p>
          <div className="flex flex-wrap gap-3">
            {['Downers Grove', 'Westmont', 'Lisle', 'Woodridge', 'Darien', 'Naperville', 'Lombard', 'Glen Ellyn', 'Wheaton', 'Hinsdale', 'Oak Brook', 'Bolingbrook'].map((town) => (
              <span key={town} className="bg-slate-50 px-4 py-2 rounded-full text-sm font-bold text-slate-600 border border-slate-100">{town}</span>
            ))}
          </div>
        </div>
      </section>

      {/* For Homeowners / For Pros */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border-2 border-slate-100 p-8">
              <span className="material-symbols-outlined text-brand-purple text-3xl mb-4 block">home</span>
              <h3 className="font-black text-slate-800 text-xl mb-3">For Homeowners</h3>
              <p className="text-slate-600 leading-relaxed">
                FindALocalPro is 100% free for homeowners. Tell us what you need, and we&apos;ll connect you with a verified professional. No account required, no hidden fees, no data sold to lead aggregators.
              </p>
            </div>
            <div className="bg-white rounded-2xl border-2 border-slate-100 p-8">
              <span className="material-symbols-outlined text-brand-teal text-3xl mb-4 block">handyman</span>
              <h3 className="font-black text-slate-800 text-xl mb-3">For Professionals</h3>
              <p className="text-slate-600 leading-relaxed">
                If you&apos;re a licensed home service professional in DuPage County, you may already be in our directory. We verify contractors proactively using public records. Want to claim or update your listing? <a href="tel:6304071727" className="text-brand-purple font-bold hover:underline">Call us at (630) 407-1727</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-purple text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-black text-white mb-4">Ready to Find a Verified Pro?</h2>
          <p className="text-purple-200 mb-8">Every contractor checked against state records. Free for homeowners.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-matched" className="inline-flex items-center justify-center gap-2 bg-brand-yellow hover:bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl hover:-translate-y-1">
              <span className="material-symbols-outlined">chat</span>
              Get Matched Free
            </Link>
            <a href="tel:6304071727" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black text-lg border-2 border-white/30 transition-all">
              <span className="material-symbols-outlined">call</span>
              (630) 407-1727
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
