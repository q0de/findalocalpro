import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { createPartnerReviewToken, getPartnerReviewToken } from '@/lib/partner-store';
import type { PartnerReviewAction } from '@/lib/partner-types';

const REVIEW_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

function getTokenSecret() {
  const secret = process.env.PARTNER_REVIEW_TOKEN_SECRET;
  if (!secret || secret.length < 32) throw new Error('PARTNER_REVIEW_TOKEN_SECRET must be at least 32 characters');
  return secret;
}

function sign(payload: string) {
  return createHmac('sha256', getTokenSecret()).update(payload).digest('base64url');
}

export function hashPartnerReviewToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function issuePartnerReviewToken(applicationId: string, action: PartnerReviewAction) {
  const expiresAt = new Date(Date.now() + REVIEW_WINDOW_MS);
  const payload = `${applicationId}.${action}.${expiresAt.getTime()}.${randomBytes(18).toString('base64url')}`;
  const token = `${payload}.${sign(payload)}`;

  await createPartnerReviewToken({
    applicationId,
    tokenHash: hashPartnerReviewToken(token),
    action,
    expiresAt: expiresAt.toISOString(),
  });

  return token;
}

export async function verifyPartnerReviewToken(token: string) {
  const parts = token.split('.');
  if (parts.length !== 5) return null;
  const [applicationId, actionValue, expiresValue, nonce, providedSignature] = parts;
  if ((actionValue !== 'approve' && actionValue !== 'decline') || !applicationId || !nonce || !providedSignature) return null;

  const payload = `${applicationId}.${actionValue}.${expiresValue}.${nonce}`;
  const expectedSignature = sign(payload);
  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;

  const expiresAt = Number(expiresValue);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null;

  const record = await getPartnerReviewToken(hashPartnerReviewToken(token));
  if (!record || record.consumed_at || new Date(record.expires_at).getTime() <= Date.now()) return null;
  if (record.application_id !== applicationId || record.action !== actionValue) return null;

  return { record, applicationId, action: actionValue as PartnerReviewAction };
}
