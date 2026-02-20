import type { Metadata } from 'next';
import { SUPABASE_URL, SUPABASE_ANON } from '@/lib/supabase';
import { DirectoryClient } from './DirectoryClient';

export const metadata: Metadata = {
  title: 'Verified Local Pros — Directory | FindALocalPro',
  description: 'Browse verified, licensed home service professionals in DuPage County, IL. Trust scores based on state license, BBB, and contractor records.',
  openGraph: {
    title: 'Verified Local Pros — Directory',
    description: 'Browse verified, licensed home service professionals in DuPage County, IL.',
    url: 'https://findalocalpro.com/directory',
    images: [{ url: 'https://findalocalpro.com/og-image.png', width: 1200, height: 630 }],
  },
};

interface Provider {
  id: string;
  name: string;
  slug: string;
  trade: string;
  phone: string | null;
  website_url: string | null;
  address: string | null;
  zip: string | null;
  trust_score: number | null;
  verification_status: string;
  is_verified: boolean;
  year_established: number | null;
}

interface VerificationCheck {
  business_id: string;
  source: string;
  status: string;
  summary: string;
  data: Record<string, unknown>;
}

async function getDirectoryData() {
  const headers = {
    apikey: SUPABASE_ANON,
    Authorization: `Bearer ${SUPABASE_ANON}`,
  };

  const provRes = await fetch(
    `${SUPABASE_URL}/rest/v1/businesses?is_active=eq.true&trust_score=gt.0&select=id,name,slug,trade,phone,website_url,address,zip,trust_score,verification_status,is_verified,year_established&order=trust_score.desc`,
    { headers, next: { revalidate: 3600 } }
  );
  const providers: Provider[] = await provRes.json();

  let checksMap: Record<string, VerificationCheck[]> = {};
  if (providers.length > 0) {
    const ids = providers.map(p => p.id);
    const checksRes = await fetch(
      `${SUPABASE_URL}/rest/v1/verification_checks?business_id=in.(${ids.join(',')})&select=business_id,source,status,summary,data&order=checked_at.desc`,
      { headers, next: { revalidate: 3600 } }
    );
    const checksData: VerificationCheck[] = await checksRes.json();

    for (const c of checksData) {
      const bid = c.business_id;
      if (!checksMap[bid]) checksMap[bid] = [];
      if (!checksMap[bid].some(existing => existing.source === c.source)) {
        checksMap[bid].push(c);
      }
    }
  }

  return { providers, checksMap };
}

export default async function DirectoryPage() {
  const { providers, checksMap } = await getDirectoryData();

  return <DirectoryClient providers={providers} checksMap={checksMap} />;
}
