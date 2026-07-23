import { NextResponse } from 'next/server';
import { issuePartnerCheckoutToken } from '@/lib/partner-checkout-tokens';
import { sendApprovedPartnerCheckout } from '@/lib/partner-email';
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
      if (application.status === 'approved_pending_checkout' && application.approval_email_sent_at) {
        await consumePartnerReviewToken(verified.record.id);
        return resultRedirect(request, 'approved');
      }
      if (!['pending_review', 'approval_delivery_failed', 'approved_pending_checkout'].includes(application.status)) {
        return resultRedirect(request, 'resolved');
      }

      const approved = application.status === 'approved_pending_checkout'
        ? application
        : await updatePartnerApplication(application.id, {
            status: 'approved_pending_checkout',
            approved_at: application.approved_at || new Date().toISOString(),
            failure_reason: null,
          }, ['pending_review', 'approval_delivery_failed']);
      if (!approved) return resultRedirect(request, 'resolved');

      try {
        const checkoutToken = await issuePartnerCheckoutToken(approved.id);
        const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin).replace(/\/$/, '');
        const checkoutUrl = new URL('/partners/checkout', baseUrl);
        checkoutUrl.searchParams.set('token', checkoutToken);
        checkoutUrl.searchParams.set('utm_source', 'partner_approval');
        checkoutUrl.searchParams.set('utm_medium', 'email');
        checkoutUrl.searchParams.set('utm_campaign', 'partner_activation');
        checkoutUrl.searchParams.set('utm_content', 'checkout_link');
        await sendApprovedPartnerCheckout(approved, checkoutUrl.toString());
        await updatePartnerApplication(approved.id, {
          approval_email_sent_at: new Date().toISOString(),
          failure_reason: null,
        }, ['approved_pending_checkout']);
        await consumePartnerReviewToken(verified.record.id);
        return resultRedirect(request, 'approved');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown checkout email failure';
        await updatePartnerApplication(approved.id, {
          status: 'approval_delivery_failed',
          failure_reason: message,
        }, ['approved_pending_checkout']);
        try {
          await sendPartnerOperationsAlert(`Approval email failed for ${approved.business_name} (${approved.id}). ${message}`);
        } catch (alertError) {
          console.error('Partner approval delivery alert failed:', alertError);
        }
        return resultRedirect(request, 'delivery_failed');
      }
    }

    if (application.status === 'declined') {
      await consumePartnerReviewToken(verified.record.id);
      return resultRedirect(request, 'declined');
    }
    if (application.status !== 'pending_review') return resultRedirect(request, 'resolved');

    const declined = await updatePartnerApplication(application.id, {
      status: 'declined',
      declined_at: new Date().toISOString(),
      billing_status: 'not_started',
      failure_reason: null,
    }, ['pending_review']);
    if (!declined) return resultRedirect(request, 'resolved');

    await consumePartnerReviewToken(verified.record.id);
    return resultRedirect(request, 'declined');
  } catch (error) {
    console.error('Partner review action failed:', error);
    return resultRedirect(request, 'error');
  }
}
