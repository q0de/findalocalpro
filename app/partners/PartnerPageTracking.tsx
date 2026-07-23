'use client';

import { useEffect, useRef } from 'react';
import { getPartnerCampaignProperties, trackPlausible } from '@/lib/plausible';

type PartnerPageTrackingProps = {
  checkoutStatus?: string;
  checkoutConfirmed: boolean;
};

export function PartnerPageTracking({
  checkoutStatus,
  checkoutConfirmed,
}: PartnerPageTrackingProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    const campaign = getPartnerCampaignProperties();
    trackPlausible('Partner Page Viewed', campaign);

    if (campaign.medium === 'email') {
      trackPlausible('Partner Email Landing', campaign);
    }

    if (checkoutStatus === 'success') {
      trackPlausible(
        checkoutConfirmed ? 'Partner Checkout Completed' : 'Partner Checkout Returned',
        { ...campaign, checkout_status: checkoutConfirmed ? 'paid' : 'pending_verification' },
      );
    } else if (checkoutStatus === 'cancelled') {
      trackPlausible('Partner Checkout Cancelled', {
        ...campaign,
        checkout_status: 'cancelled',
      });
    }
  }, [checkoutConfirmed, checkoutStatus]);

  useEffect(() => {
    const trackCta = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const cta = target.closest<HTMLElement>('[data-partner-cta]');
      if (!cta) return;

      trackPlausible('Partner CTA Clicked', {
        ...getPartnerCampaignProperties(),
        placement: cta.dataset.partnerPlacement || 'unknown',
      });
    };

    document.addEventListener('click', trackCta);
    return () => document.removeEventListener('click', trackCta);
  }, []);

  return null;
}
