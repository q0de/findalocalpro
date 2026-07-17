import { NextRequest, NextResponse } from 'next/server';
import { verifyPartnerCheckoutToken } from '@/lib/partner-checkout-tokens';
import { updatePartnerApplication } from '@/lib/partner-store';
import { validatePartnerPriceConfiguration } from '@/lib/partner-billing';
import { getStripe } from '@/lib/stripe';

function getBaseUrl(request: NextRequest) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (configuredUrl) return configuredUrl.replace(/\/$/, '');
  return request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json() as { token?: string };
    if (!token) return NextResponse.json({ error: 'Approved checkout token is required.' }, { status: 400 });

    const application = await verifyPartnerCheckoutToken(token);
    if (!application) return NextResponse.json({ error: 'This approved checkout link is invalid or expired.' }, { status: 403 });

    const stripe = getStripe();
    const prices = await validatePartnerPriceConfiguration();
    if (application.stripe_checkout_session_id) {
      const existing = await stripe.checkout.sessions.retrieve(application.stripe_checkout_session_id);
      if (existing.status === 'open' && existing.url) return NextResponse.json({ url: existing.url });
    }

    const baseUrl = getBaseUrl(request);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: prices.founding, quantity: 1 }],
      success_url: `${baseUrl}/partners?checkout=success&session_id={CHECKOUT_SESSION_ID}#apply`,
      cancel_url: `${baseUrl}/partners/checkout?checkout=cancelled&token=${encodeURIComponent(token)}`,
      customer_email: application.email,
      client_reference_id: application.id,
      metadata: { applicationId: application.id },
      subscription_data: { metadata: { applicationId: application.id } },
    });

    if (!session.url) return NextResponse.json({ error: 'Stripe did not return a checkout URL.' }, { status: 502 });

    await updatePartnerApplication(application.id, {
      stripe_checkout_session_id: session.id,
      billing_status: 'checkout_open',
    }, ['approved_pending_checkout']);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Partner checkout error:', error);
    return NextResponse.json({ error: 'Could not start secure checkout.' }, { status: 500 });
  }
}
