import type { Metadata } from 'next';
import Link from 'next/link';
import { verifyPartnerCheckoutToken } from '@/lib/partner-checkout-tokens';
import { PartnerCheckoutButton } from '../PartnerCheckoutButton';

// Next.js route metadata intentionally lives beside the page component.
// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: 'Complete partner checkout | FindALocalPro',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

type PartnerCheckoutPageProps = {
  searchParams?: Promise<{ token?: string; checkout?: string }>;
};

export default async function PartnerCheckoutPage({ searchParams }: PartnerCheckoutPageProps) {
  const params = await searchParams;
  const token = params?.token ?? '';
  const application = token ? await verifyPartnerCheckoutToken(token) : null;

  if (!application) {
    return (
      <main className="partner-review-page">
        <section className="partner-review-confirmation is-error">
          <span className="material-symbols-outlined" aria-hidden="true">link_off</span>
          <p>FindALocalPro · Approved partner checkout</p>
          <h1>Checkout link unavailable</h1>
          <p>This private checkout link is invalid, expired, or has already been completed. Contact FindALocalPro for help.</p>
          <Link href="/partners">Return to the partners page</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="partner-review-page">
      <section className="partner-review-confirmation is-success">
        <span className="material-symbols-outlined" aria-hidden="true">verified</span>
        <p>FindALocalPro · Territory approved</p>
        <h1>Activate {application.business_name}</h1>
        <p>Your trade and territory have been approved. No payment was taken with your application.</p>
        <dl>
          <div><dt>Trade</dt><dd>{application.category}</dd></div>
          <div><dt>Territory</dt><dd>{application.preferred_territory || application.service_areas}</dd></div>
          <div><dt>Founding rate</dt><dd>$500/mo for 3 billing cycles</dd></div>
          <div><dt>Standard rate</dt><dd>$750/mo beginning with cycle 4</dd></div>
        </dl>
        {params?.checkout === 'cancelled' && (
          <p className="partner-review-warning">Checkout was cancelled and no payment was taken. You can reopen it when ready.</p>
        )}
        <PartnerCheckoutButton
          label="Continue to secure Stripe checkout — $500"
          payload={{ token }}
          checkoutStatus={params?.checkout}
          trade={application.category}
        />
        <Link href="/partners">Return without paying</Link>
      </section>
    </main>
  );
}
