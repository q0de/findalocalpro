import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import type { PartnerApplication } from '@/lib/partner-types';

function getPartnerPriceIds() {
  const founding = process.env.STRIPE_PARTNER_FOUNDING_PRICE_ID;
  const standard = process.env.STRIPE_PARTNER_STANDARD_PRICE_ID;
  if (!founding || !standard) {
    throw new Error('STRIPE_PARTNER_FOUNDING_PRICE_ID and STRIPE_PARTNER_STANDARD_PRICE_ID are required');
  }
  return { founding, standard };
}

export async function validatePartnerPriceConfiguration() {
  const stripe = getStripe();
  const prices = getPartnerPriceIds();
  const [founding, standard] = await Promise.all([
    stripe.prices.retrieve(prices.founding),
    stripe.prices.retrieve(prices.standard),
  ]);

  const validMonthlyPrice = (price: Stripe.Price, expectedAmount: number) => (
    price.active
    && price.currency === 'usd'
    && price.unit_amount === expectedAmount
    && price.recurring?.interval === 'month'
  );
  if (!validMonthlyPrice(founding, 50000) || !validMonthlyPrice(standard, 75000)) {
    throw new Error('Partner Stripe prices must be active monthly USD prices for exactly $500 and $750');
  }
  return prices;
}

function idOf(value: string | { id: string } | null | undefined) {
  if (!value) return null;
  return typeof value === 'string' ? value : value.id;
}

export async function configurePartnerSubscriptionSchedule(applicationId: string, subscriptionId: string) {
  const stripe = getStripe();
  const prices = await validatePartnerPriceConfiguration();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const attachedScheduleId = idOf(subscription.schedule);
  const schedule = attachedScheduleId
    ? await stripe.subscriptionSchedules.retrieve(attachedScheduleId)
    : await stripe.subscriptionSchedules.create(
        { from_subscription: subscriptionId },
        { idempotencyKey: `partner-schedule-${applicationId}` },
      );

  if (!schedule.current_phase) throw new Error('Stripe schedule did not expose a current phase');

  const updated = await stripe.subscriptionSchedules.update(schedule.id, {
    end_behavior: 'release',
    proration_behavior: 'none',
    metadata: { applicationId },
    phases: [
      {
        start_date: schedule.current_phase.start_date,
        duration: { interval: 'month', interval_count: 3 },
        items: [{ price: prices.founding, quantity: 1 }],
        metadata: { applicationId, partnerRate: 'founding_500' },
        proration_behavior: 'none',
      },
      {
        duration: { interval: 'month', interval_count: 1 },
        items: [{ price: prices.standard, quantity: 1 }],
        metadata: { applicationId, partnerRate: 'standard_750' },
        proration_behavior: 'none',
      },
    ],
  });

  return { subscription, schedule: updated };
}

export async function cancelAndRefundPartnerApplication(application: PartnerApplication) {
  const stripe = getStripe();
  if (!application.stripe_subscription_id) throw new Error('Partner application has no Stripe subscription');

  const subscription = await stripe.subscriptions.retrieve(application.stripe_subscription_id);
  if (subscription.status !== 'canceled') {
    if (application.stripe_schedule_id) {
      try {
        const schedule = await stripe.subscriptionSchedules.retrieve(application.stripe_schedule_id);
        if (schedule.status === 'active' || schedule.status === 'not_started') {
          await stripe.subscriptionSchedules.cancel(application.stripe_schedule_id);
        } else {
          await stripe.subscriptions.cancel(application.stripe_subscription_id);
        }
      } catch (error) {
        if (!(error instanceof Stripe.errors.StripeInvalidRequestError)) throw error;
        const latestSubscription = await stripe.subscriptions.retrieve(application.stripe_subscription_id);
        if (latestSubscription.status !== 'canceled') await stripe.subscriptions.cancel(application.stripe_subscription_id);
      }
    } else {
      await stripe.subscriptions.cancel(application.stripe_subscription_id);
    }
  }

  const invoices = await stripe.invoices.list({
    subscription: application.stripe_subscription_id,
    status: 'paid',
    limit: 100,
  });
  const refundIds: string[] = [];
  let refundedCents = 0;

  for (const invoice of invoices.data) {
    const payments = await stripe.invoicePayments.list({ invoice: invoice.id, status: 'paid', limit: 100 });
    for (const invoicePayment of payments.data) {
      const paymentIntentId = idOf(invoicePayment.payment.payment_intent);
      const chargeId = idOf(invoicePayment.payment.charge);
      if (!paymentIntentId && !chargeId) continue;

      const refund = await stripe.refunds.create(
        {
          ...(paymentIntentId ? { payment_intent: paymentIntentId } : { charge: chargeId! }),
          reason: 'requested_by_customer',
          metadata: { applicationId: application.id, invoiceId: invoice.id },
        },
        { idempotencyKey: `partner-refund-${application.id}-${invoice.id}` },
      );
      refundIds.push(refund.id);
      refundedCents += refund.amount;
    }
  }

  if (refundIds.length === 0 && application.amount_paid_cents > 0) {
    throw new Error('No refundable Stripe invoice payments were found');
  }

  return { refundIds, refundedCents };
}
