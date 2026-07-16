import type { Metadata } from 'next';
import Link from 'next/link';
import { getPartnerApplication } from '@/lib/partner-store';
import { verifyPartnerReviewToken } from '@/lib/partner-review-tokens';

// Next.js route metadata intentionally lives beside the page component.
// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: 'Partner application review | FindALocalPro',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

type ReviewPageProps = {
  searchParams?: Promise<{ token?: string; result?: string }>;
};

const results: Record<string, { icon: string; title: string; body: string; tone?: string }> = {
  approved: {
    icon: 'check_circle',
    title: 'Partner approved',
    body: 'The application is approved and the scheduled subscription remains active. You can begin onboarding.',
    tone: 'is-success',
  },
  declined_refunded: {
    icon: 'currency_exchange',
    title: 'Declined and refunded',
    body: 'The subscription was cancelled and all captured pre-approval payments were refunded through Stripe.',
    tone: 'is-success',
  },
  refund_failed: {
    icon: 'error',
    title: 'The refund needs attention',
    body: 'The application is marked for manual review and an urgent Telegram alert was sent. You may retry the same decline link.',
    tone: 'is-error',
  },
  processing: {
    icon: 'pending',
    title: 'Action already processing',
    body: 'Another request is handling this application. Check Stripe and the application record before trying again.',
  },
  resolved: {
    icon: 'lock',
    title: 'Application already resolved',
    body: 'This application can no longer be changed with this review link.',
  },
  invalid: {
    icon: 'link_off',
    title: 'Review link unavailable',
    body: 'This link is invalid, expired, or has already been used.',
    tone: 'is-error',
  },
  error: {
    icon: 'error',
    title: 'Review action failed',
    body: 'No new decision was recorded. Check the operational alert and try again.',
    tone: 'is-error',
  },
};

export default async function PartnerReviewPage({ searchParams }: ReviewPageProps) {
  const params = await searchParams;
  const result = params?.result ? results[params.result] : null;

  if (result) {
    return (
      <main className="partner-review-page">
        <section className={`partner-review-confirmation ${result.tone ?? ''}`}>
          <span className="material-symbols-outlined" aria-hidden="true">{result.icon}</span>
          <p>FindALocalPro · Partner review</p>
          <h1>{result.title}</h1>
          <p>{result.body}</p>
          <Link href="/partners">Return to the partners page</Link>
        </section>
      </main>
    );
  }

  const token = params?.token ?? '';
  const verified = token ? await verifyPartnerReviewToken(token) : null;
  const application = verified ? await getPartnerApplication(verified.applicationId) : null;

  if (!verified || !application) {
    const invalid = results.invalid;
    return (
      <main className="partner-review-page">
        <section className="partner-review-confirmation is-error">
          <span className="material-symbols-outlined" aria-hidden="true">{invalid.icon}</span>
          <p>FindALocalPro · Partner review</p>
          <h1>{invalid.title}</h1>
          <p>{invalid.body}</p>
        </section>
      </main>
    );
  }

  const isApprove = verified.action === 'approve';
  return (
    <main className="partner-review-page">
      <section className={`partner-review-confirmation ${isApprove ? 'is-success' : 'is-warning'}`}>
        <span className="material-symbols-outlined" aria-hidden="true">{isApprove ? 'verified' : 'currency_exchange'}</span>
        <p>Confirm {isApprove ? 'approval' : 'decline and refund'}</p>
        <h1>{application.business_name}</h1>
        <dl>
          <div><dt>Trade</dt><dd>{application.category}</dd></div>
          <div><dt>Territory</dt><dd>{application.preferred_territory || application.service_areas}</dd></div>
          <div><dt>Contact</dt><dd>{application.contact_name} · {application.email}</dd></div>
          <div><dt>Current status</dt><dd>{application.status.replaceAll('_', ' ')}</dd></div>
        </dl>
        <p className="partner-review-warning">
          {isApprove
            ? 'Approval keeps the subscription active and confirms this partner for onboarding.'
            : 'Declining cancels the subscription and refunds every payment captured before approval.'}
        </p>
        <form method="post" action="/api/partners/review">
          <input type="hidden" name="token" value={token} />
          <button className={isApprove ? '' : 'is-decline'}>
            {isApprove ? 'Approve this partner' : 'Decline, cancel, and refund'}
          </button>
        </form>
        <Link href="/partners">Cancel without making a change</Link>
      </section>
    </main>
  );
}
