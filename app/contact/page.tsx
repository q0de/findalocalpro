import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Contact FindALocalPro — Downers Grove, IL | (630) 703-2607',
  description: 'Contact FindALocalPro for verified home service professionals in Downers Grove and DuPage County, IL. Call (630) 703-2607 or use our free matching service.',
  openGraph: {
    title: 'Contact FindALocalPro — Downers Grove, IL',
    description: 'Get connected with verified home service professionals. Call (630) 703-2607.',
    url: 'https://findalocalpro.com/contact',
  },
  alternates: { canonical: 'https://findalocalpro.com/contact' },
};

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'FindALocalPro',
  url: 'https://findalocalpro.com',
  telephone: '+1-630-703-2607',
  description: 'Verified home service professionals in Downers Grove and DuPage County, IL. Every pro checked against 4 government databases.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Downers Grove',
    addressRegion: 'IL',
    postalCode: '60515',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '41.7920',
    longitude: '-88.0112',
  },
  areaServed: [
    { '@type': 'City', name: 'Downers Grove', containedInPlace: { '@type': 'State', name: 'Illinois' } },
    { '@type': 'City', name: 'Westmont' },
    { '@type': 'City', name: 'Lisle' },
    { '@type': 'City', name: 'Woodridge' },
    { '@type': 'City', name: 'Darien' },
    { '@type': 'City', name: 'Naperville' },
    { '@type': 'City', name: 'Lombard' },
    { '@type': 'City', name: 'Glen Ellyn' },
    { '@type': 'City', name: 'Wheaton' },
    { '@type': 'City', name: 'Hinsdale' },
    { '@type': 'City', name: 'Oak Brook' },
    { '@type': 'City', name: 'Bolingbrook' },
  ],
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '14:00' },
  ],
  priceRange: 'Free',
  serviceType: ['Plumbing', 'HVAC', 'Electrical', 'Roofing', 'Handyman', 'Pest Control', 'Appliance Repair'],
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header step={0} totalSteps={0} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }} />

      <div className="max-w-4xl mx-auto px-6 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Contact' },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-brand-purple/5 via-white to-brand-pink/5">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-800 mb-6 leading-[1.1]">
            Get in Touch
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl">
            Need a verified home service professional? We&apos;re here to help — call us directly or use our free matching service.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Phone */}
            <a href="tel:6307032607" className="group bg-white rounded-2xl border-2 border-slate-100 p-8 text-center hover:border-brand-purple hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-brand-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-purple/20 transition-colors">
                <span className="material-symbols-outlined text-brand-purple text-3xl">call</span>
              </div>
              <h2 className="font-black text-slate-800 text-lg mb-2">Call Us</h2>
              <p className="text-brand-purple font-black text-xl">(630) 703-2607</p>
              <p className="text-slate-400 text-sm mt-2">Mon-Fri 8am-6pm, Sat 9am-2pm</p>
            </a>

            {/* Chat */}
            <Link href="/get-matched" className="group bg-white rounded-2xl border-2 border-slate-100 p-8 text-center hover:border-brand-teal hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-brand-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-teal/20 transition-colors">
                <span className="material-symbols-outlined text-brand-teal text-3xl">chat</span>
              </div>
              <h2 className="font-black text-slate-800 text-lg mb-2">Chat with Us</h2>
              <p className="text-slate-600 font-bold">Free Matching Service</p>
              <p className="text-slate-400 text-sm mt-2">Get matched in under 60 seconds</p>
            </Link>

            {/* Email */}
            <a href="mailto:hello@findalocalpro.com" className="group bg-white rounded-2xl border-2 border-slate-100 p-8 text-center hover:border-brand-pink hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-brand-pink/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-pink/20 transition-colors">
                <span className="material-symbols-outlined text-brand-pink text-3xl">mail</span>
              </div>
              <h2 className="font-black text-slate-800 text-lg mb-2">Email Us</h2>
              <p className="text-slate-600 font-bold">hello@findalocalpro.com</p>
              <p className="text-slate-400 text-sm mt-2">We respond within 24 hours</p>
            </a>
          </div>
        </div>
      </section>

      {/* Service Area + Details */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-black text-slate-800 mb-6">Service Area</h2>
              <p className="text-slate-600 mb-6">
                FindALocalPro serves Downers Grove and the greater DuPage County area. Every pro in our directory is verified against Illinois state records.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Downers Grove', 'Westmont', 'Lisle', 'Woodridge', 'Darien', 'Naperville', 'Lombard', 'Glen Ellyn', 'Wheaton', 'Hinsdale', 'Oak Brook', 'Bolingbrook'].map((town) => (
                  <span key={town} className="bg-white px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 border border-slate-100">{town}</span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-800 mb-6">Business Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-brand-purple mt-0.5">location_on</span>
                  <div>
                    <p className="font-bold text-slate-800">Location</p>
                    <p className="text-slate-600">Downers Grove, IL 60515</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-brand-purple mt-0.5">schedule</span>
                  <div>
                    <p className="font-bold text-slate-800">Hours</p>
                    <p className="text-slate-600">Mon-Fri: 8:00 AM – 6:00 PM</p>
                    <p className="text-slate-600">Saturday: 9:00 AM – 2:00 PM</p>
                    <p className="text-slate-600">Sunday: Closed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-brand-purple mt-0.5">verified_user</span>
                  <div>
                    <p className="font-bold text-slate-800">Services</p>
                    <p className="text-slate-600">Plumbing, HVAC, Electrical, Roofing, Pest Control, Appliance Repair, and more</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-black text-slate-800 mb-8">Common Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'Is FindALocalPro really free?', a: 'Yes, 100% free for homeowners. We connect you with verified professionals at no cost. No account needed, no hidden fees.' },
              { q: 'How do I claim my business listing?', a: 'If you\'re a licensed home service professional in DuPage County, call us at (630) 703-2607. We can update your listing with accurate contact information and verify your credentials.' },
              { q: 'I had a bad experience with a listed pro. What do I do?', a: 'Call us at (630) 703-2607 or email hello@findalocalpro.com. We take complaints seriously and will re-verify the contractor\'s standing. Trust scores are updated based on new information.' },
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

      <Footer />
    </div>
  );
}
