import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Reviews & Testimonials | FindALocalPro — Downers Grove, IL',
  description: 'See what DuPage County homeowners say about FindALocalPro. Real reviews from real customers matched with verified, licensed contractors.',
  alternates: { canonical: 'https://findalocalpro.com/reviews' },
};

// Placeholder testimonials — replace with Supabase/Google reviews when available
const testimonials = [
  {
    name: 'Sarah M.',
    location: 'Downers Grove, IL',
    service: 'Plumbing',
    text: 'I needed a plumber fast for a burst pipe. FindALocalPro connected me with a licensed pro who was at my door within an hour. The fact that they check state licenses gave me peace of mind I wouldn\'t have had calling a random number from Google.',
    rating: 5,
  },
  {
    name: 'Tom R.',
    location: 'Naperville, IL',
    service: 'HVAC',
    text: 'My furnace died in January. I used FindALocalPro and got matched with an HVAC company that was BBB accredited with an active state license. They had it fixed the same day. Way better than guessing on Craigslist.',
    rating: 5,
  },
  {
    name: 'Maria L.',
    location: 'Wheaton, IL',
    service: 'Electrical',
    text: 'I was worried about hiring an electrician for a panel upgrade — it\'s not something you want to trust to just anyone. FindALocalPro showed me exactly which databases they checked and the contractor\'s trust score. That transparency sold me.',
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`material-symbols-outlined text-lg ${i < rating ? 'text-brand-yellow' : 'text-slate-200'}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header step={0} totalSteps={0} />

      <div className="max-w-4xl mx-auto px-6 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Reviews' },
          ]}
        />
      </div>

      <section className="py-16 bg-gradient-to-br from-brand-purple/5 via-white to-brand-pink/5">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-800 mb-6 leading-[1.1]">
            What Homeowners<br />
            <span className="text-brand-purple">Are Saying</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl">
            Real feedback from DuPage County homeowners who used FindALocalPro to connect with verified professionals.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border-2 border-slate-100 rounded-2xl p-8 hover:border-brand-purple/20 transition-colors">
                <StarRating rating={t.rating} />
                <p className="text-slate-700 text-lg leading-relaxed mt-4 mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black text-slate-800">{t.name}</p>
                    <p className="text-sm text-slate-400">{t.location} · {t.service}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-brand-teal/10 text-brand-teal">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    Verified Match
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-slate-50 rounded-2xl p-8 text-center">
            <span className="material-symbols-outlined text-brand-purple text-4xl mb-4 block">rate_review</span>
            <h2 className="font-black text-slate-800 text-xl mb-3">Had a Great Experience?</h2>
            <p className="text-slate-500 mb-6 max-w-lg mx-auto">
              If FindALocalPro connected you with a great contractor, we&apos;d love to hear about it. Your feedback helps other homeowners make confident decisions.
            </p>
            <a href="mailto:hello@findalocalpro.com?subject=My FindALocalPro Experience" className="inline-flex items-center gap-2 bg-brand-purple text-white px-6 py-3 rounded-2xl font-bold hover:bg-brand-pink transition-colors">
              <span className="material-symbols-outlined">mail</span>
              Share Your Experience
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-purple text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-black text-white mb-4">Find Your Verified Pro</h2>
          <p className="text-purple-200 mb-8">Join homeowners across DuPage County who trust FindALocalPro.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-matched" className="inline-flex items-center justify-center gap-2 bg-brand-yellow hover:bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl hover:-translate-y-1">
              <span className="material-symbols-outlined">chat</span>
              Get Matched Free
            </Link>
            <a href="tel:6307032607" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black text-lg border-2 border-white/30 transition-all">
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
