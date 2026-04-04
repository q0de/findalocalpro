import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Verification Methodology | FindALocalPro',
  description: 'How we verify every contractor against 4 government databases: IDFPR, IL SOS, BBB, and BuildZoom. Learn how Trust Scores work.',
  openGraph: {
    title: 'Verification Methodology | FindALocalPro',
    description: 'How we verify every contractor against 4 government databases and calculate Trust Scores.',
    type: 'website',
    url: 'https://findalocalpro.com/methodology',
    images: [{ url: 'https://findalocalpro.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verification Methodology | FindALocalPro',
    description: 'How we verify every contractor against 4 government databases and calculate Trust Scores.',
    images: ['https://findalocalpro.com/og-image.png'],
  },
  alternates: { canonical: 'https://findalocalpro.com/methodology' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'FindALocalPro Verification Methodology',
  description: 'How FindALocalPro verifies every contractor against 4 government databases.',
  url: 'https://findalocalpro.com/methodology',
  publisher: { '@type': 'Organization', name: 'FindALocalPro', url: 'https://findalocalpro.com' },
};

export default function MethodologyPage() {
  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 pt-6">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Our Methodology' }]} />
        </div>

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 pt-8 pb-12">
          <div className="flex items-center gap-2 text-purple-600 text-sm font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-rounded text-lg">verified</span>
            Verification Methodology
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            How We Verify Every Contractor
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
            Every pro on FindALocalPro is checked against 4 public government databases before they appear in our directory. No paid placements. No sponsored listings. Just verified public records.
          </p>
        </section>

        {/* Why It Matters */}
        <section className="bg-red-50 border-y border-red-200 py-12">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-rounded text-red-500">warning</span>
              Why Verification Matters
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-5 border border-red-100">
                <div className="text-3xl font-black text-red-600 mb-2">1 in 5</div>
                <p className="text-slate-600 text-sm">contractors operating without proper licensing in Illinois, according to IDFPR enforcement data</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-red-100">
                <div className="text-3xl font-black text-red-600 mb-2">$4.2B</div>
                <p className="text-slate-600 text-sm">annual cost of unlicensed contracting to US homeowners (NASCLA estimate)</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-red-100">
                <div className="text-3xl font-black text-red-600 mb-2">No Recourse</div>
                <p className="text-slate-600 text-sm">If an unlicensed contractor damages your home, you may have no legal recourse through state regulatory bodies</p>
              </div>
            </div>
          </div>
        </section>

        {/* The 4 Databases */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-black text-slate-900 mb-10 text-center">
            The 4-Database Verification Process
          </h2>

          <div className="space-y-8">
            {/* IDFPR */}
            <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <span className="text-purple-700 font-black">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">IDFPR — State License Verification</h3>
                  <p className="text-sm text-purple-600 font-semibold mb-3">Illinois Department of Financial and Professional Regulation</p>
                  <p className="text-slate-600 mb-4">
                    We check every contractor against IDFPR&apos;s public license database. For regulated trades — plumbing, electrical, roofing — Illinois law requires active state licensure.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-bold text-slate-900 text-sm mb-2">What we verify:</p>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li className="flex items-start gap-2"><span className="material-symbols-rounded text-emerald-500 text-base mt-0.5">check</span> License exists and is Active</li>
                        <li className="flex items-start gap-2"><span className="material-symbols-rounded text-emerald-500 text-base mt-0.5">check</span> License type matches claimed trade</li>
                        <li className="flex items-start gap-2"><span className="material-symbols-rounded text-emerald-500 text-base mt-0.5">check</span> No disciplinary actions on record</li>
                        <li className="flex items-start gap-2"><span className="material-symbols-rounded text-emerald-500 text-base mt-0.5">check</span> License expiration date is in the future</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm mb-2">What it means for you:</p>
                      <p className="text-sm text-slate-600">An active IDFPR license confirms your contractor passed state licensing exams, meets education and experience requirements, and carries the insurance required by the state. It also means you can file a complaint with IDFPR if something goes wrong.</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <p className="text-sm text-red-700"><strong>Disqualification:</strong> Expired, revoked, or suspended license. No exceptions.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SOS */}
            <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <span className="text-purple-700 font-black">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">IL Secretary of State — Business Registration</h3>
                  <p className="text-sm text-purple-600 font-semibold mb-3">Cyber Drive Illinois Business Entity Search</p>
                  <p className="text-slate-600 mb-4">
                    A legitimate contractor operates as a registered business entity. We verify registration status and good standing with the Illinois Secretary of State.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-bold text-slate-900 text-sm mb-2">What we verify:</p>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li className="flex items-start gap-2"><span className="material-symbols-rounded text-emerald-500 text-base mt-0.5">check</span> Business entity is registered in Illinois</li>
                        <li className="flex items-start gap-2"><span className="material-symbols-rounded text-emerald-500 text-base mt-0.5">check</span> Status shows Active or In Good Standing</li>
                        <li className="flex items-start gap-2"><span className="material-symbols-rounded text-emerald-500 text-base mt-0.5">check</span> Business name matches the operating name</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm mb-2">What it means for you:</p>
                      <p className="text-sm text-slate-600">A registered, active business entity means you&apos;re dealing with a real company — not a fly-by-night operator. If disputes arise, a registered business can be held legally accountable. Dissolved businesses cannot.</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <p className="text-sm text-red-700"><strong>Disqualification:</strong> Dissolved, revoked, or &quot;not in good standing&quot; status.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* BBB */}
            <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <span className="text-purple-700 font-black">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">Better Business Bureau — Rating & Complaints</h3>
                  <p className="text-sm text-purple-600 font-semibold mb-3">BBB Chicago & Northern Illinois</p>
                  <p className="text-slate-600 mb-4">
                    The BBB tracks complaint patterns and how businesses handle disputes. We review ratings, complaint volume, and resolution history.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-bold text-slate-900 text-sm mb-2">What we check:</p>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li className="flex items-start gap-2"><span className="material-symbols-rounded text-emerald-500 text-base mt-0.5">check</span> BBB rating (A+ through F)</li>
                        <li className="flex items-start gap-2"><span className="material-symbols-rounded text-emerald-500 text-base mt-0.5">check</span> Complaint volume relative to business size</li>
                        <li className="flex items-start gap-2"><span className="material-symbols-rounded text-emerald-500 text-base mt-0.5">check</span> Complaint resolution patterns</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm mb-2">What it means for you:</p>
                      <p className="text-sm text-slate-600">The BBB rating shows how a business handles problems — not just how they perform when things go right. A contractor with an A+ rating and resolved complaints demonstrates accountability. An F rating shows a pattern of unresolved disputes.</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <p className="text-sm text-red-700"><strong>Disqualification:</strong> F rating.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* BuildZoom */}
            <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <span className="text-purple-700 font-black">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">BuildZoom — Permit History & Ranking</h3>
                  <p className="text-sm text-purple-600 font-semibold mb-3">Building Permit Aggregation Platform</p>
                  <p className="text-slate-600 mb-4">
                    BuildZoom aggregates building permit data from municipalities. This shows what work a contractor has actually done — not just what they claim.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-bold text-slate-900 text-sm mb-2">What we check:</p>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li className="flex items-start gap-2"><span className="material-symbols-rounded text-emerald-500 text-base mt-0.5">check</span> Building permit history in the service area</li>
                        <li className="flex items-start gap-2"><span className="material-symbols-rounded text-emerald-500 text-base mt-0.5">check</span> BuildZoom contractor ranking score</li>
                        <li className="flex items-start gap-2"><span className="material-symbols-rounded text-emerald-500 text-base mt-0.5">check</span> Volume and recency of permitted work</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm mb-2">What it means for you:</p>
                      <p className="text-sm text-slate-600">A strong permit history confirms the contractor actually pulls permits and does work through proper channels. Contractors with zero permit history either work outside the area or skip permits — both are concerning for homeowners.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Score */}
        <section className="bg-slate-50 border-y border-slate-200 py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-black text-slate-900 mb-4 text-center">The Trust Score</h2>
            <p className="text-slate-600 text-center mb-10 max-w-2xl mx-auto">
              Every verified pro receives a Trust Score from 0-100 based on the weighted results of all four database checks plus customer reviews.
            </p>

            <div className="grid md:grid-cols-5 gap-4 mb-10">
              {[
                { label: 'License (IDFPR)', weight: '40%', color: 'bg-purple-600' },
                { label: 'Business Registration', weight: '25%', color: 'bg-purple-500' },
                { label: 'BBB Rating', weight: '15%', color: 'bg-purple-400' },
                { label: 'BuildZoom Score', weight: '10%', color: 'bg-purple-300' },
                { label: 'Customer Reviews', weight: '10%', color: 'bg-purple-200' },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-xl p-4 border border-slate-200 text-center">
                  <div className={`w-12 h-12 rounded-full ${item.color} mx-auto mb-3 flex items-center justify-center`}>
                    <span className="text-white font-black text-sm">{item.weight}</span>
                  </div>
                  <p className="text-slate-900 font-bold text-sm">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="font-black text-slate-900 mb-4">Scoring Details</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><strong>License (40%):</strong> Active license = full points. Expired/revoked = disqualified (not listed).</li>
                <li><strong>Business Registration (25%):</strong> Active/good standing = full points. Dissolved = disqualified.</li>
                <li><strong>BBB (15%):</strong> A+ = 15 pts, A = 13, B = 10, C = 7, D = 4, F = disqualified.</li>
                <li><strong>BuildZoom (10%):</strong> Normalized from BuildZoom&apos;s contractor ranking algorithm.</li>
                <li><strong>Reviews (10%):</strong> 4.5+ stars = 10 pts, 4.0+ = 7, 3.5+ = 4, below 3.5 = 1. Zero reviews = no penalty (score scales without review weight). 1-2 reviews = half weight.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Re-verification */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Ongoing Verification</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="material-symbols-rounded text-emerald-600">autorenew</span>
                Monthly Re-verification
              </h3>
              <p className="text-slate-600 text-sm">Every provider in our directory is re-verified monthly against all 4 databases. If a license expires or a business is dissolved, the provider is flagged and removed from active listings.</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="material-symbols-rounded text-amber-600">flag</span>
                Community Reporting
              </h3>
              <p className="text-slate-600 text-sm">Homeowners can report concerns about any listed provider. Reports trigger an immediate re-verification outside the normal monthly cycle. Contact us at (630) 407-1727.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-purple-900 text-white py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-black mb-4">See Verification in Action</h2>
            <p className="text-purple-200 mb-8">Browse our directory to see Trust Scores, verification details, and verified credentials for every listed pro.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/directory" className="inline-flex items-center gap-2 bg-white text-purple-900 px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors">
                Browse Directory
              </Link>
              <Link href="/get-matched" className="inline-flex items-center gap-2 border-2 border-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors">
                Get Matched Free
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
