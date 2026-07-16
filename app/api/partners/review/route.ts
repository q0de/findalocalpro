import { NextResponse } from 'next/server';
import { cancelAndRefundPartnerApplication } from '@/lib/partner-billing';
import { verifyPartnerReviewToken } from '@/lib/partner-review-tokens';
import {
  consumePartnerReviewToken,
  getPartnerApplication,
  updatePartnerApplication,
} from '@/lib/partner-store';
import { sendPartnerOperationsAlert } from '@/lib/partner-telegram';

function resultRedirect(request: Request, result: string) {
  return NextResponse.redirect(new URL(`/partners/review?result=${encodeURIComponent(result)}`, request.url), 303);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const token = typeof form.get('token') === 'string' ? String(form.get('token')) : '';

  try {
    const verified = await verifyPartnerReviewToken(token);
    if (!verified) return resultRedirect(request, 'invalid');

    const application = await getPartnerApplication(verified.applicationId);
    if (!application) return resultRedirect(request, 'invalid');

    if (verified.action === 'approve') {
      if (application.status === 'approved') {
        await consumePartnerReviewToken(verified.record.id);
        return resultRedirect(request, 'approved');
      }
      if (application.status !== 'paid_pending_review') return resultRedirect(request, 'resolved');

      const approved = await updatePartnerApplication(application.id, {
        status: 'approved',
        approved_at: new Date().toISOString(),
        failure_reason: null,
      }, ['paid_pending_review']);
      if (!approved) return resultRedirect(request, 'resolved');

      await consumePartnerReviewToken(verified.record.id);
      return resultRedirect(request, 'approved');
    }

    if (application.status === 'declined_refunded') {
      await consumePartnerReviewToken(verified.record.id);
      return resultRedirect(request, 'declined_refunded');
    }
    if (!['paid_pending_review', 'refund_failed', 'billing_setup_failed'].includes(application.status)) {
      return resultRedirect(request, application.status === 'decline_processing' ? 'processing' : 'resolved');
    }

    const claimed = await updatePartnerApplication(application.id, {
      status: 'decline_processing',
      declined_at: new Date().toISOString(),
      failure_reason: null,
    }, ['paid_pending_review', 'refund_failed', 'billing_setup_failed']);
    if (!claimed) return resultRedirect(request, 'processing');

    try {
      const refund = await cancelAndRefundPartnerApplication(claimed);
      await updatePartnerApplication(claimed.id, {
        status: 'declined_refunded',
        billing_status: 'refunded',
        stripe_refund_ids: refund.refundIds,
        refunded_at: new Date().toISOString(),
        failure_reason: null,
      }, ['decline_processing']);
      await consumePartnerReviewToken(verified.record.id);
      return resultRedirect(request, 'declined_refunded');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown cancellation or refund failure';
      await updatePartnerApplication(claimed.id, {
        status: 'refund_failed',
        billing_status: 'refund_failed',
        failure_reason: message,
      }, ['decline_processing']);
      await sendPartnerOperationsAlert(`Refund failed for ${claimed.business_name} (${claimed.id}). ${message}`);
      return resultRedirect(request, 'refund_failed');
    }
  } catch (error) {
    console.error('Partner review action failed:', error);
    return resultRedirect(request, 'error');
  }
}
