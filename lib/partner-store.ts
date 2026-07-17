import { SUPABASE_URL } from '@/lib/supabase';
import type {
  PartnerApplication,
  PartnerApplicationInput,
  PartnerApplicationStatus,
  PartnerReviewAction,
  PartnerReviewToken,
} from '@/lib/partner-types';

type PartnerApplicationPatch = Partial<Omit<PartnerApplication, 'id' | 'created_at' | 'updated_at'>>;

function getAdminConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) throw new Error('Supabase partner storage is not configured');
  return { url: url.replace(/\/$/, ''), key };
}

async function adminRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { url, key } = getAdminConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase partner request failed (${response.status}): ${detail}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function nullable(value: string | undefined) {
  const cleaned = value?.trim();
  return cleaned || null;
}

export async function createPartnerApplication(input: PartnerApplicationInput) {
  const rows = await adminRequest<PartnerApplication[]>('partner_applications?select=*', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      business_name: input.businessName.trim(),
      contact_name: input.contactName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      website: nullable(input.website),
      category: input.category.trim(),
      service_areas: input.serviceAreas.trim(),
      preferred_territory: nullable(input.preferredTerritory),
      years_in_business: nullable(input.yearsInBusiness),
      google_profile: nullable(input.googleProfile),
      notes: nullable(input.notes),
      confirmed: input.confirmed,
      status: 'pending_review',
      billing_status: 'not_started',
    }),
  });

  if (!rows[0]) throw new Error('Supabase did not return the partner application');
  return rows[0];
}

export async function getPartnerApplication(id: string) {
  const rows = await adminRequest<PartnerApplication[]>(`partner_applications?id=eq.${encodeURIComponent(id)}&select=*&limit=1`);
  return rows[0] ?? null;
}

export async function getPartnerApplicationBySubscription(subscriptionId: string) {
  const rows = await adminRequest<PartnerApplication[]>(`partner_applications?stripe_subscription_id=eq.${encodeURIComponent(subscriptionId)}&select=*&limit=1`);
  return rows[0] ?? null;
}

export async function updatePartnerApplication(
  id: string,
  patch: PartnerApplicationPatch,
  expectedStatuses?: PartnerApplicationStatus[],
) {
  const statusFilter = expectedStatuses?.length
    ? `&status=in.(${expectedStatuses.map(encodeURIComponent).join(',')})`
    : '';
  const rows = await adminRequest<PartnerApplication[]>(
    `partner_applications?id=eq.${encodeURIComponent(id)}${statusFilter}&select=*`,
    {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(patch),
    },
  );
  return rows[0] ?? null;
}

export async function createPartnerReviewToken(input: {
  applicationId: string;
  tokenHash: string;
  action: PartnerReviewAction;
  expiresAt: string;
}) {
  const rows = await adminRequest<PartnerReviewToken[]>('partner_review_tokens?select=*', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      application_id: input.applicationId,
      token_hash: input.tokenHash,
      action: input.action,
      expires_at: input.expiresAt,
    }),
  });
  if (!rows[0]) throw new Error('Supabase did not return the partner review token');
  return rows[0];
}

export async function getPartnerReviewToken(tokenHash: string) {
  const rows = await adminRequest<PartnerReviewToken[]>(`partner_review_tokens?token_hash=eq.${encodeURIComponent(tokenHash)}&select=*&limit=1`);
  return rows[0] ?? null;
}

export async function consumePartnerReviewToken(id: string) {
  const rows = await adminRequest<PartnerReviewToken[]>(
    `partner_review_tokens?id=eq.${encodeURIComponent(id)}&consumed_at=is.null&select=*`,
    {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ consumed_at: new Date().toISOString() }),
    },
  );
  return rows[0] ?? null;
}

type StripeEventClaim = 'claimed' | 'processed' | 'processing';

export async function claimPartnerStripeEvent(eventId: string, eventType: string): Promise<StripeEventClaim> {
  const { url, key } = getAdminConfig();
  const response = await fetch(`${url}/rest/v1/partner_stripe_events`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ event_id: eventId, event_type: eventType, status: 'processing' }),
  });

  if (response.ok) return 'claimed';
  if (response.status !== 409) throw new Error(`Could not claim Stripe event (${response.status}): ${await response.text()}`);

  const existing = await adminRequest<Array<{ status: string; attempts: number; updated_at: string }>>(
    `partner_stripe_events?event_id=eq.${encodeURIComponent(eventId)}&select=status,attempts,updated_at&limit=1`,
  );
  if (existing[0]?.status === 'processed') return 'processed';
  const isFreshClaim = existing[0]?.status === 'processing'
    && Date.now() - new Date(existing[0].updated_at).getTime() < 5 * 60 * 1000;
  if (isFreshClaim) return 'processing';

  await adminRequest(`partner_stripe_events?event_id=eq.${encodeURIComponent(eventId)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ status: 'processing', error: null, attempts: (existing[0]?.attempts ?? 1) + 1 }),
  });
  return 'claimed';
}

export async function finishPartnerStripeEvent(eventId: string, error?: string) {
  await adminRequest(`partner_stripe_events?event_id=eq.${encodeURIComponent(eventId)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify(error
      ? { status: 'failed', error: error.slice(0, 1000) }
      : { status: 'processed', error: null, processed_at: new Date().toISOString() }),
  });
}
