import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SUPABASE_URL, SUPABASE_ANON } from '@/lib/supabase';
import { ProviderProfileClient } from './ProviderProfileClient';

interface Provider {
  id: string;
  name: string;
  slug: string;
  trade: string;
  phone: string | null;
  email: string | null;
  website_url: string | null;
  address: string | null;
  zip: string | null;
  description: string | null;
  trust_score: number | null;
  verification_status: string;
  is_verified: boolean;
  year_established: number | null;
  last_verified_at: string | null;
  service_area: string[] | null;
}

interface VerificationCheck {
  source: string;
  status: string;
  summary: string;
  data: Record<string, unknown>;
  checked_at: string;
}

interface Review {
  id: string;
  business_id: string;
  rating: number;
  review_text: string;
  reviewer_name: string;
  source: string;
  review_date: string;
}

const tradeLabels: Record<string, string> = {
  plumbing: 'Plumbing',
  hvac: 'HVAC & Heating',
  electrical: 'Electrical',
  roofing: 'Roofing',
};

async function getProvider(slug: string): Promise<{ provider: Provider; checks: VerificationCheck[]; reviews: Review[] } | null> {
  const headers = {
    apikey: SUPABASE_ANON,
    Authorization: `Bearer ${SUPABASE_ANON}`,
  };

  const provRes = await fetch(
    `${SUPABASE_URL}/rest/v1/businesses?slug=eq.${slug}&is_active=eq.true&select=*`,
    { headers, next: { revalidate: 3600 } }
  );
  const provData = await provRes.json();
  if (!provData.length) return null;

  const provider = provData[0];

  const checksRes = await fetch(
    `${SUPABASE_URL}/rest/v1/verification_checks?business_id=eq.${provider.id}&select=source,status,summary,data,checked_at&order=checked_at.desc`,
    { headers, next: { revalidate: 3600 } }
  );
  const checksData = await checksRes.json();

  // Dedupe: keep only latest check per source
  const seen = new Set<string>();
  const checks: VerificationCheck[] = [];
  for (const c of checksData) {
    if (!seen.has(c.source)) {
      seen.add(c.source);
      checks.push(c);
    }
  }

  // Fetch reviews
  const reviewsRes = await fetch(
    `${SUPABASE_URL}/rest/v1/reviews?business_id=eq.${provider.id}&select=*&order=rating.desc,review_date.desc`,
    { headers, next: { revalidate: 3600 } }
  );
  const reviews: Review[] = await reviewsRes.json();

  return { provider, checks, reviews };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProvider(slug);
  if (!data) return { title: 'Provider Not Found | FindALocalPro' };

  const { provider } = data;
  const tradeLabel = tradeLabels[provider.trade] || provider.trade;
  const score = Math.round(provider.trust_score || 0);

  return {
    title: `${provider.name} — Verified ${tradeLabel} Pro | FindALocalPro`,
    description: `${provider.name} — Trust Score ${score}/100. Verified ${tradeLabel.toLowerCase()} professional in DuPage County, IL. License, BBB rating, and contractor score checked.`,
    openGraph: {
      title: `${provider.name} — Verified ${tradeLabel} Pro`,
      description: `Trust Score ${score}/100. Verified ${tradeLabel.toLowerCase()} pro in DuPage County, IL.`,
      type: 'website',
      url: `https://findalocalpro.com/pro/${slug}`,
      images: [{ url: 'https://findalocalpro.com/og-image.png', width: 1200, height: 630 }],
    },
  };
}

export default async function ProviderProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProvider(slug);
  if (!data) notFound();

  const { provider, checks, reviews } = data;
  const tradeLabel = tradeLabels[provider.trade] || provider.trade;

  // Calculate aggregate rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  // Structured data for SEO — rendered server-side!
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: provider.name,
    url: provider.website_url || `https://findalocalpro.com/pro/${provider.slug}`,
    telephone: provider.phone,
    address: provider.address ? {
      '@type': 'PostalAddress',
      streetAddress: provider.address,
      addressLocality: provider.address?.split(',')[1]?.trim(),
      addressRegion: 'IL',
      postalCode: provider.zip,
    } : undefined,
    foundingDate: provider.year_established ? String(provider.year_established) : undefined,
    additionalType: `https://schema.org/${provider.trade === 'plumbing' ? 'Plumber' : provider.trade === 'electrical' ? 'Electrician' : 'HomeAndConstructionBusiness'}`,
    ...(reviews.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating.toFixed(2),
        reviewCount: reviews.length,
        bestRating: '5',
        worstRating: '1',
      },
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <ProviderProfileClient provider={provider} checks={checks} reviews={reviews} tradeLabel={tradeLabel} />
    </>
  );
}
