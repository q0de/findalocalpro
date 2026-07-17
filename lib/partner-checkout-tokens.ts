import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { getPartnerApplication, updatePartnerApplication } from '@/lib/partner-store';

const CHECKOUT_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

function getTokenSecret() {
  const secret = process.env.PARTNER_REVIEW_TOKEN_SECRET;
  if (!secret || secret.length < 32) throw new Error('PARTNER_REVIEW_TOKEN_SECRET must be at least 32 characters');
  return secret;
}

function sign(payload: string) {
  return createHmac('sha256', getTokenSecret()).update(payload).digest('base64url');
}

function hash(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function issuePartnerCheckoutToken(applicationId: string) {
  const expiresAt = new Date(Date.now() + CHECKOUT_WINDOW_MS);
  const payload = `${applicationId}.${expiresAt.getTime()}.${randomBytes(24).toString('base64url')}`;
  const token = `${payload}.${sign(payload)}`;

  const updated = await updatePartnerApplication(applicationId, {
    checkout_token_hash: hash(token),
    checkout_token_expires_at: expiresAt.toISOString(),
  }, ['approved_pending_checkout']);
  if (!updated) throw new Error('Approved application could not receive a checkout token');

  return token;
}

export async function verifyPartnerCheckoutToken(token: string) {
  const parts = token.split('.');
  if (parts.length !== 4) return null;
  const [applicationId, expiresValue, nonce, providedSignature] = parts;
  if (!applicationId || !nonce || !providedSignature) return null;

  const payload = `${applicationId}.${expiresValue}.${nonce}`;
  const expectedSignature = sign(payload);
  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;

  const expiresAt = Number(expiresValue);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null;

  const application = await getPartnerApplication(applicationId);
  if (!application || application.status !== 'approved_pending_checkout') return null;
  if (!application.checkout_token_hash || application.checkout_token_hash !== hash(token)) return null;
  if (!application.checkout_token_expires_at || new Date(application.checkout_token_expires_at).getTime() <= Date.now()) return null;

  return application;
}
