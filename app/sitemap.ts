import type { MetadataRoute } from 'next';
import { SUPABASE_URL, SUPABASE_ANON } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: 'https://findalocalpro.com', lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: 'https://findalocalpro.com/directory', lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://findalocalpro.com/privacy', lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: 'https://findalocalpro.com/terms', lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: 'https://findalocalpro.com/about', lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://findalocalpro.com/contact', lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://findalocalpro.com/get-matched', lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://findalocalpro.com/reviews', lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
  ];

  // Service vertical pages
  const verticals = ['plumbing', 'hvac', 'electricians', 'roofing', 'pest-control', 'appliance-repair'];
  const servicePages: MetadataRoute.Sitemap = verticals.map(v => ({
    url: `https://findalocalpro.com/services/${v}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Dynamic provider pages from Supabase
  let providerPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/businesses?is_active=eq.true&trust_score=gt.0&select=slug,updated_at`,
      {
        headers: {
          apikey: SUPABASE_ANON,
          Authorization: `Bearer ${SUPABASE_ANON}`,
        },
        next: { revalidate: 3600 },
      }
    );
    const providers: { slug: string; updated_at: string }[] = await res.json();
    providerPages = providers.map(p => ({
      url: `https://findalocalpro.com/pro/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch {
    // Silent — sitemap still works with static pages
  }

  return [...staticPages, ...servicePages, ...providerPages];
}
