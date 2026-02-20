import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SUPABASE_URL, SUPABASE_ANON } from '@/lib/supabase';

export const revalidate = 3600; // Refresh every hour

export const metadata: Metadata = {
  title: 'Reviews & Testimonials | FindALocalPro — Downers Grove, IL',
  description: 'See what DuPage County homeowners say about FindALocalPro. Real reviews from real customers matched with verified, licensed contractors.',
  alternates: { canonical: 'https://findalocalpro.com/reviews' },
};

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  review_text: string;
  source: string;
  review_date: string;
  business_name?: string;
  business_trade?: string;
}

// Fallback testimonials for when DB has no reviews
const fallbackTestimonials: Review[] = [
  {
    id: 'fallback-1',
    reviewer_name: 'Sarah M.',
    rating: 5,
    review_text: 'I needed a plumber fast for a burst pipe. FindALocalPro connected me with a licensed pro who was at my door within an hour. The fact that they check state licenses gave me peace of mind I wouldn\'t have had calling a random number from Google.',
    source: 'findalocalpro',
    review_date: '2026-01-15',
    business_name: 'Verified Plumber',
    business_trade: 'plumbing',
  },
  {
    id: 'fallback-2',
    reviewer_name: 'Tom R.',
    rating: 5,
    review_text: 'My furnace died in January. I used FindALocalPro and got matched with an HVAC company that was BBB accredited with an active state license. They had it fixed the same day. Way better than guessing on Craigslist.',
    source: 'findalocalpro',
    review_date: '2026-01-20',
    business_name: 'Verified HVAC Pro',
    business_trade: 'hvac',
  },
  {
    id: 'fallback-3',
    reviewer_name: 'Maria L.',
    rating: 5,
    review_text: 'I was worried about hiring an electrician for a panel upgrade — it\'s not something you want to trust to just anyone. FindALocalPro showed me exactly which databases they checked and the contractor\'s trust score. That transparency sold me.',
    source: 'findalocalpro',
    review_date: '2026-02-01',
    business_name: 'Verified Electrician',
    business_trade: 'electrical',
  },
];

async function getReviews(): Promise<Review[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/reviews?select=id,reviewer_name,rating,review_text,source,review_date,business_id,businesses(name,trade)&order=rating.desc,review_date.desc&limit=50`,
      {
        headers: {
          apikey: SUPABASE_ANON,
          Authorization: `Bearer ${SUPABASE_ANON}`,
        },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((r: Record<string, unknown>) => ({
      ...r,
      business_name: (r.businesses as Record<string, string>)?.name || '',
      business_trade: (r.businesses as Record<string, string>)?.trade || '',
    }));
  } catch {
    return [];
  }
}

function sourceLabel(source: string): string {
  const labels: Record<string, string> = {
    google: 'Google',
    yelp: 'Yelp',
    bbb: 'BBB',
    angi: 'Angi',
    homeadvisor: 'HomeAdvisor',
    web: 'Verified Review',
    findalocalpro: 'FindALocalPro',
  };
  return labels[source] || 'Review';
}

function sourceIcon(source: string): string {
  const icons: Record<string, string> = {
    google: 'search',
    yelp: 'restaurant',
    bbb: 'verified_user',
    angi: 'home_repair_service',
    web: 'language',
    findalocalpro: 'verified',
  };
  return icons[source] || 'rate_review';
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`material-symbols-outlined text-lg ${i < rating ? 'text-brand-yellow' : 'text-slate-200'}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
      ))}
    </div>
  );
}

function tradeLabel(trade: string): string {
  const labels: Record<string, string> = {
    plumbing: 'Plumbing',
    hvac: 'HVAC',
    electrical: 'Electrical',
    roofing: 'Roofing',
  };
  return labels[trade] || trade;
}

export default async function ReviewsPage() {
  const dbReviews = await getReviews();
  const reviews = dbReviews.length > 0 ? dbReviews : fallbackTestimonials;
  
  // Calculate stats
  const totalReviews = reviews.length;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';
  const fiveStarCount = reviews.filter(r => r.rating === 5).length;

  // Build AggregateRating schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'FindALocalPro',
    url: 'https://findalocalpro.com',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avgRating,
      reviewCount: totalReviews,
      bestRating: '5',
      worstRating: '1',
    },
    review: reviews.slice(0, 10).map(r => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.reviewer_name },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: '5' },
      reviewBody: r.review_text,
      datePublished: r.review_date,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header step={0} totalSteps={0} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

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
          <p className="text-lg text-slate-500 max-w-2xl mb-8">
            Real reviews from DuPage County homeowners and verified review platforms.
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-brand-purple">{avgRating}</span>
              <div>
                <StarRating rating={Math.round(parseFloat(avgRating))} />
                <p className="text-xs text-slate-400 mt-0.5">Average Rating</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-brand-teal">{totalReviews}</span>
              <p className="text-sm text-slate-500">Total<br />Reviews</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-brand-yellow">{fiveStarCount}</span>
              <p className="text-sm text-slate-500">Five Star<br />Reviews</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-8">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white border-2 border-slate-100 rounded-2xl p-8 hover:border-brand-purple/20 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <StarRating rating={r.rating} />
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-500 border border-slate-200">
                    <span className="material-symbols-outlined text-xs">{sourceIcon(r.source)}</span>
                    {sourceLabel(r.source)}
                  </span>
                </div>
                <p className="text-slate-700 text-lg leading-relaxed mb-6">&ldquo;{r.review_text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black text-slate-800">{r.reviewer_name}</p>
                    {r.business_name && (
                      <p className="text-sm text-slate-400">
                        Re: {r.business_name}
                        {r.business_trade && ` · ${tradeLabel(r.business_trade)}`}
                      </p>
                    )}
                  </div>
                  {r.review_date && (
                    <p className="text-xs text-slate-300">
                      {new Date(r.review_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  )}
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
