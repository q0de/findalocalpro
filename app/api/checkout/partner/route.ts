import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';

type CheckoutPayload = {
  businessName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  category?: string;
  serviceAreas?: string;
  preferredTerritory?: string;
};

function clean(value: unknown, maxLength = 200) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function getBaseUrl(request: NextRequest) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (configuredUrl) return configuredUrl.replace(/\/$/, '');

  const origin = request.headers.get('origin');
  if (origin) return origin;

  const host = request.headers.get('host');
  return host ? `https://${host}` : 'https://findalocalpro.com';
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe secret key is not configured.' },
        { status: 500 },
      );
    }

    const payload = (await request.json().catch(() => ({}))) as CheckoutPayload;
    const baseUrl = getBaseUrl(request);
    const stripe = getStripe();
    const monthlyPriceId = process.env.STRIPE_PARTNER_MONTHLY_PRICE_ID;
    const setupPriceId = process.env.STRIPE_PARTNER_SETUP_PRICE_ID;
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      monthlyPriceId
        ? { price: monthlyPriceId, quantity: 1 }
        : {
            price_data: {
              currency: 'usd',
              unit_amount: 49700,
              recurring: { interval: 'month' },
              product_data: {
                name: 'Neighborhood Demand Engine Founding Partner',
                description: 'Local opportunity monitoring, hot alerts, call tracking where applicable, reputation watch, and weekly reporting.',
              },
            },
            quantity: 1,
          },
      ...(setupPriceId ? [{ price: setupPriceId, quantity: 1 }] : []),
    ];

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: lineItems,
      success_url: `${baseUrl}/partners?checkout=success&session_id={CHECKOUT_SESSION_ID}#apply`,
      cancel_url: `${baseUrl}/partners?checkout=cancelled#pricing`,
      customer_email: clean(payload.email) || undefined,
      allow_promotion_codes: true,
      metadata: {
        source: 'partners_page',
        offer: 'neighborhood_demand_engine_founding_partner',
        businessName: clean(payload.businessName),
        contactName: clean(payload.contactName),
        phone: clean(payload.phone),
        category: clean(payload.category),
        serviceAreas: clean(payload.serviceAreas, 500),
        preferredTerritory: clean(payload.preferredTerritory, 500) || 'Recommend best open territory',
      },
      subscription_data: {
        metadata: {
          source: 'partners_page',
          offer: 'neighborhood_demand_engine_founding_partner',
          businessName: clean(payload.businessName),
          category: clean(payload.category),
          serviceAreas: clean(payload.serviceAreas, 500),
          preferredTerritory: clean(payload.preferredTerritory, 500) || 'Recommend best open territory',
        },
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe did not return a checkout URL.' }, { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Partner checkout error:', error);
    return NextResponse.json({ error: 'Could not start Stripe Checkout.' }, { status: 500 });
  }
}
