'use client';

import { useEffect, useRef, useState } from 'react';
import { getPartnerCampaignProperties, trackPlausible, trackPlausibleBeforeNavigation } from '@/lib/plausible';

type PartnerCheckoutButtonProps = {
  className?: string;
  label?: string;
  payload?: {
    token?: string;
  };
  checkoutStatus?: string;
  trade?: string;
};

export function PartnerCheckoutButton({
  className = 'form-submit partner-checkout-button',
  label = 'Start Stripe checkout',
  payload = {},
  checkoutStatus,
  trade,
}: PartnerCheckoutButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [error, setError] = useState('');
  const viewed = useRef(false);

  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    trackPlausible('Partner Checkout Viewed', {
      ...getPartnerCampaignProperties(),
      checkout_status: checkoutStatus === 'cancelled' ? 'returned_cancelled' : 'ready',
      trade,
    });
  }, [checkoutStatus, trade]);

  const startCheckout = async () => {
    if (status === 'loading') return;

    setStatus('loading');
    setError('');
    trackPlausible('Partner Checkout Clicked', {
      ...getPartnerCampaignProperties(),
      trade,
    });

    try {
      const response = await fetch('/api/checkout/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Checkout is not available yet.');
      }

      await trackPlausibleBeforeNavigation('Partner Checkout Started', {
        ...getPartnerCampaignProperties(),
        trade,
      });
      window.location.assign(data.url);
    } catch (checkoutError) {
      trackPlausible('Partner Checkout Error', {
        ...getPartnerCampaignProperties(),
        trade,
        error_type: checkoutError instanceof TypeError ? 'network' : 'checkout_unavailable',
      });
      setError(checkoutError instanceof Error ? checkoutError.message : 'Checkout is not available yet.');
      setStatus('idle');
    }
  };

  return (
    <div className="partner-checkout-wrap">
      <button type="button" className={className} onClick={startCheckout} disabled={status === 'loading'}>
        {status === 'loading' ? (
          <>
            <span className="material-symbols-outlined">progress_activity</span>
            Opening checkout
          </>
        ) : (
          <>
            {label}
            <span className="material-symbols-outlined">lock</span>
          </>
        )}
      </button>
      {error && <p className="form-error partner-checkout-error">{error}</p>}
    </div>
  );
}
