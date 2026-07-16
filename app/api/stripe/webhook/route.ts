import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { configurePartnerSubscriptionSchedule } from '@/lib/partner-billing';
import { issuePartnerReviewToken } from '@/lib/partner-review-tokens';
import {
  claimPartnerStripeEvent,
  finishPartnerStripeEvent,
  getPartnerApplication,
  getPartnerApplicationBySubscription,
  updatePartnerApplication,
} from '@/lib/partner-store';
import { sendPaidPartnerApplication, sendPartnerOperationsAlert } from '@/lib/partner-telegram';
import { getStripe } from '@/lib/stripe';

function idOf(value: string | { id: string } | null | undefined) {
  if (!value) return null;
  return typeof value === 'string' ? value : value.id;
}

function getApplicationIdFromInvoice(invoice: Stripe.Invoice) {
  const subscription = invoice.parent?.subscription_details?.subscription;
  return idOf(subscription);
}

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://findalocalpro.com').replace(/\/$/, '');
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const applicationId = session.metadata?.applicationId;
  const subscriptionId = idOf(session.subscription);
  if (!applicationId || !subscriptionId) throw new Error('Completed partner checkout is missing application metadata or subscription');
  if (session.payment_status !== 'paid') throw new Error(`Partner checkout completed with payment status ${session.payment_status}`);

  const application = await getPartnerApplication(applicationId);
  if (!application) throw new Error(`Partner application ${applicationId} was not found`);

  let billing;
  try {
    billing = await configurePartnerSubscriptionSchedule(applicationId, subscriptionId);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown billing setup failure';
    await updatePartnerApplication(applicationId, {
      status: 'billing_setup_failed',
      billing_status: 'setup_failed',
      stripe_checkout_session_id: session.id,
      stripe_customer_id: idOf(session.customer),
      stripe_subscription_id: subscriptionId,
      failure_reason: message,
    });
    await sendPartnerOperationsAlert(`Paid application ${applicationId} needs billing setup review. ${message}`);
    throw error;
  }

  const updated = await updatePartnerApplication(applicationId, {
    status: 'paid_pending_review',
    billing_status: billing.subscription.status,
    stripe_checkout_session_id: session.id,
    stripe_customer_id: idOf(session.customer),
    stripe_subscription_id: billing.subscription.id,
    stripe_schedule_id: billing.schedule.id,
    amount_paid_cents: session.amount_total ?? 50000,
    currency: session.currency ?? 'usd',
    failure_reason: null,
  });
  if (!updated) throw new Error(`Partner application ${applicationId} could not be updated after checkout`);

  if (!updated.telegram_notified_at) {
    try {
      const [approveToken, declineToken] = await Promise.all([
        issuePartnerReviewToken(applicationId, 'approve'),
        issuePartnerReviewToken(applicationId, 'decline'),
      ]);
      const baseUrl = getBaseUrl();
      await sendPaidPartnerApplication(updated, {
        approve: `${baseUrl}/partners/review?token=${encodeURIComponent(approveToken)}`,
        decline: `${baseUrl}/partners/review?token=${encodeURIComponent(declineToken)}`,
      });
      await updatePartnerApplication(applicationId, {
        telegram_notified_at: new Date().toISOString(),
        failure_reason: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown Telegram notification failure';
      await updatePartnerApplication(applicationId, { failure_reason: `Telegram review alert pending: ${message}` });
      throw error;
    }
  }
}

async function handleInvoice(invoice: Stripe.Invoice, succeeded: boolean) {
  const subscriptionId = getApplicationIdFromInvoice(invoice);
  if (!subscriptionId) return;
  const application = await getPartnerApplicationBySubscription(subscriptionId);
  if (!application) return;
  const paidInvoices = succeeded
    ? await getStripe().invoices.list({ subscription: subscriptionId, status: 'paid', limit: 100 })
    : null;
  await updatePartnerApplication(application.id, {
    billing_status: succeeded ? 'active' : 'past_due',
    stripe_last_invoice_id: invoice.id,
    ...(paidInvoices ? { amount_paid_cents: paidInvoices.data.reduce((total, paidInvoice) => total + paidInvoice.amount_paid, 0) } : {}),
  });
}

async function handleSubscription(subscription: Stripe.Subscription, deleted: boolean) {
  const applicationId = subscription.metadata.applicationId;
  const application = applicationId
    ? await getPartnerApplication(applicationId)
    : await getPartnerApplicationBySubscription(subscription.id);
  if (!application) return;

  const shouldCancelApplication = deleted && ['checkout_pending', 'paid_pending_review'].includes(application.status);
  await updatePartnerApplication(application.id, {
    billing_status: deleted ? 'cancelled' : subscription.status,
    ...(shouldCancelApplication ? { status: 'cancelled' as const } : {}),
  });
}

async function processEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object);
      break;
    case 'checkout.session.expired': {
      const applicationId = event.data.object.metadata?.applicationId;
      if (applicationId) await updatePartnerApplication(applicationId, { billing_status: 'checkout_expired' }, ['checkout_pending']);
      break;
    }
    case 'invoice.payment_succeeded':
      await handleInvoice(event.data.object, true);
      break;
    case 'invoice.payment_failed':
      await handleInvoice(event.data.object, false);
      break;
    case 'customer.subscription.updated':
      await handleSubscription(event.data.object, false);
      break;
    case 'customer.subscription.deleted':
      await handleSubscription(event.data.object, true);
      break;
    default:
      break;
  }
}

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) return NextResponse.json({ error: 'Stripe webhook is not configured.' }, { status: 503 });

  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid Stripe signature';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const claim = await claimPartnerStripeEvent(event.id, event.type);
  if (claim !== 'claimed') return NextResponse.json({ received: true, duplicate: true });

  try {
    await processEvent(event);
    await finishPartnerStripeEvent(event.id);
    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Stripe webhook failure';
    await finishPartnerStripeEvent(event.id, message);
    console.error('Partner Stripe webhook failed:', error);
    return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 500 });
  }
}
