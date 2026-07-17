'use client';

import { useState } from 'react';

type PartnerCheckoutButtonProps = {
  className?: string;
  label?: string;
  payload?: {
    token?: string;
  };
};

export function PartnerCheckoutButton({
  className = 'form-submit partner-checkout-button',
  label = 'Start Stripe checkout',
  payload = {},
}: PartnerCheckoutButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [error, setError] = useState('');

  const startCheckout = async () => {
    if (status === 'loading') return;

    setStatus('loading');
    setError('');

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

      window.location.assign(data.url);
    } catch (checkoutError) {
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
