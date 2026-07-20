import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PartnerApplicationForm } from './PartnerApplicationForm';
import { PartnerDesignReviewProvider } from './PartnerDesignReview';
import { PartnerHeroTitle } from './PartnerHeroTitle';
import { PartnerHeroVisual } from './PartnerHeroVisual';
import { PartnerHowStage } from './PartnerHowStage';
import { PartnerPriceCounter } from './PartnerPriceCounter';
import { PartnerReportDisplay } from './PartnerReportDisplay';
import { PartnerScrollAnimator } from './PartnerScrollAnimator';
import { getStripe } from '@/lib/stripe';

// Next.js route metadata intentionally lives beside the page component.
// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: 'Neighborhood Demand Engine | FindALocalPro Partners',
  description: 'A done-for-you local market watch service for contractors: opportunity monitoring, hot alerts, call tracking, reputation watch, and weekly reports.',
  alternates: { canonical: 'https://findalocalpro.com/partners' },
  openGraph: {
    title: 'Neighborhood Demand Engine by FindALocalPro',
    description: 'Catch local homeowner demand before your competitors do with monitoring, alerts, call tracking, and weekly reports.',
    type: 'website',
    url: 'https://findalocalpro.com/partners',
    images: [{ url: 'https://findalocalpro.com/og-image.png', width: 1200, height: 630 }],
  },
};

const flow = [
  {
    number: '01',
    icon: 'radar',
    title: 'Monitor local demand',
    body: 'We watch neighborhood conversations, search and call activity, and review signals for your trade and territory.',
  },
  {
    number: '02',
    icon: 'notifications_active',
    title: 'Alert you when timing matters',
    body: 'A hot opportunity reaches you while it is still actionable — before the thread fills with other names.',
  },
  {
    number: '03',
    icon: 'phone_in_talk',
    title: 'Route & track calls',
    body: 'Dedicated call tracking captures and records inbound demand where applicable, so nothing slips.',
  },
  {
    number: '04',
    icon: 'description',
    title: 'Send the weekly report',
    body: 'See what surfaced, what we acted on, which calls came in, and the next moves worth making.',
  },
];

const included = [
  ['Local opportunity monitoring', 'Starting with Nextdoor & local neighborhood conversations for your trade and area.'],
  ['Hot lead alerts', 'Real-time notifications the moment a timely opportunity appears in your territory.'],
  ['Featured FindALocalPro placement', 'Priority visibility for your business across the FindALocalPro network.'],
  ['Dedicated call tracking', 'Tracked, recorded inbound calls where applicable, so no demand goes unmeasured.'],
  ['Weekly Neighborhood Demand Report', 'Your seven-section briefing on opportunities, actions, calls, and next moves.'],
  ['Google review monitoring', 'We flag new reviews and prepare professional response drafts for your approval.'],
  ['Competitor mention watch', 'Know when and where rivals get recommended in your local channels.'],
  ['Company-fit messaging', 'Reply drafts, review requests, and follow-up wording matched to your brand voice and service style.'],
  ['Territory & category exclusivity', "Where approved, we won't enroll a direct competitor in your protected area."],
];

const stats = [
  {
    value: '14',
    label: 'Opportunities found',
    detail: 'Neighborhood posts & search signals',
    icon: 'priority_high',
    trend: '+18%',
    trendValue: 18,
    sparkline: '2,31 14,22 25,26 38,11 51,20 66,5 82,14 95,4 112,4',
  },
  {
    value: '9',
    label: 'Calls / leads routed',
    detail: 'Tracked & recorded where applicable',
    icon: 'call',
    trend: '+12%',
    trendValue: 12,
    sparkline: '2,32 16,25 28,29 42,15 56,18 70,7 84,14 98,4 112,4',
  },
  {
    value: '3',
    label: 'Reviews flagged',
    detail: 'With response drafts ready',
    icon: 'star',
    trend: '+7%',
    trendValue: 7,
    sparkline: '2,30 15,24 27,27 39,16 52,21 65,9 79,13 93,5 112,5',
  },
  {
    value: '5',
    label: 'Competitor mentions',
    detail: 'Where rivals were recommended',
    icon: 'alternate_email',
    trend: '+9%',
    trendValue: 9,
    sparkline: '2,31 14,26 26,28 40,17 53,22 67,10 81,15 96,5 112,5',
  },
];

const economics = [
  ['1-3 jobs', 'Can cover the month', 'For many urgent-service trades, a few booked calls can offset the founding price.'],
  ['1 partner', 'Protected by trade', 'Where approved, your local category is not sold to a direct competitor.'],
  ['No auction', 'Flat monthly fee', 'No shared-lead bidding. You get monitoring, alerts, and reporting.'],
  ['Fast signals', 'Timing wins work', 'Hot threads, missed calls, bad reviews, and competitor mentions are worth catching early.'],
];

function EconomicsVisual({ index }: { index: number }) {
  return (
    <span className={`partner-economics-image partner-economics-scene-${index + 1}`} data-economics-visual={index + 1} aria-hidden="true">
      <span className="partner-economics-map" />
      <span className="partner-economics-vignette" />

      {index === 0 && (
        <>
          <i className="partner-economics-route route-one" />
          <i className="partner-economics-route route-two" />
          <i className="partner-economics-route route-three" />
          <EconomicsObject sprite="pin" className="pin-one" />
          <EconomicsObject sprite="pin" className="pin-two" />
          <EconomicsObject sprite="pin" className="pin-three" />
          <EconomicsObject sprite="check" className="check-main" />
          <i className="partner-economics-travel travel-one" />
          <i className="partner-economics-travel travel-two" />
        </>
      )}

      {index === 1 && (
        <>
          <i className="partner-economics-boundary" />
          <EconomicsObject sprite="shield" className="shield-main" />
          <i className="partner-economics-blocked blocked-one">×</i>
          <i className="partner-economics-blocked blocked-two">×</i>
          <i className="partner-economics-blocked blocked-three">×</i>
        </>
      )}

      {index === 2 && (
        <>
          <i className="partner-economics-rays" />
          <span className="partner-flat-fee-visual">
            <span className="partner-flat-fee-card">
              <span className="partner-flat-fee-eyebrow">Fixed rate</span>
              <span className="partner-flat-fee-value">
                <span>$</span>
                <small>/ month</small>
              </span>
              <span className="partner-flat-fee-line"><i /></span>
            </span>
            <span className="partner-flat-fee-check" />
          </span>
        </>
      )}

      {index === 3 && (
        <>
          <i className="partner-economics-route signal-route" />
          <EconomicsObject sprite="alert" className="alert-main" />
          <EconomicsObject sprite="pin" className="signal-pin" />
          <EconomicsObject sprite="phone" className="signal-phone" />
          <EconomicsObject sprite="search" className="signal-search" />
          <EconomicsObject sprite="star" className="signal-star" />
          <i className="partner-economics-travel signal-travel" />
        </>
      )}
    </span>
  );
}

function EconomicsObject({ sprite, className }: { sprite: string; className: string }) {
  return (
    <i className={`partner-economics-object ${className}`}>
      <span className={`partner-economics-base sprite-${sprite}`} />
      <span className={`partner-economics-icon sprite-${sprite}`} />
    </i>
  );
}

const faqs = [
  ['Is this pay-per-lead?', 'No. This is a flat monthly market-watch service, not a per-lead marketplace. You are not bidding against other contractors or paying for each contact — you get monitoring, alerts, call tracking, and a weekly report for one predictable price.'],
  ['Can this pay for itself?', 'For many home-service trades, yes, it can. A small number of booked jobs can cover the founding price, especially in higher-value categories like plumbing, HVAC, electrical, appliance repair, and similar urgent services. We still do not guarantee booked jobs or revenue.'],
  ['Do you guarantee booked jobs?', 'No, and we will never promise that. We surface local opportunities, demand signals, and reputation alerts, and we route and track calls where applicable. What you do with that timing and information is what turns it into booked work.'],
  ['Is my territory exclusive?', 'Where approved, yes. We limit enrollment by trade and territory and protect approved partners from having a direct competitor signed up in the same area. Availability depends on your specific category and ZIPs, which is why we review before confirming.'],
  ['Can the messaging sound like my company?', 'Yes. During onboarding we learn your tone, service standards, offers, and do-not-say rules, then prepare response drafts, review requests, and follow-up wording that fit your company. You approve or edit before anything is sent.'],
  ['Do you post on social platforms as my business?', 'We can support both approaches. With your approval and within agreed guidelines, we can help publish or respond through your business profiles. FindALocalPro can also participate as its own entity to surface and recommend your business in relevant local conversations. You stay in control of the messaging, platforms, and level of involvement.'],
  ['What happens after I apply?', 'We review availability and fit for your trade and territory before any payment. If approved, we email you a private Stripe checkout link for the $500 founding rate. Declined applications are closed without a charge.'],
  ['Why is the founding price lower?', 'Founding partners help us calibrate the service in their local market, so the first three monthly billing cycles are $500 before the ongoing $750/mo standard rate. It is a genuine launch rate for a high-touch service, not a discount gimmick.'],
];

type PartnersPageProps = {
  searchParams?: Promise<{ checkout?: string; session_id?: string }>;
};

export default async function PartnersPage({ searchParams }: PartnersPageProps) {
  const params = await searchParams;
  const checkoutStatus = params?.checkout;
  let checkoutConfirmed = false;
  if (checkoutStatus === 'success' && params?.session_id && process.env.STRIPE_SECRET_KEY) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(params.session_id);
      checkoutConfirmed = session.payment_status === 'paid' && session.metadata?.applicationId != null;
    } catch (error) {
      console.error('Could not verify partner checkout redirect:', error);
    }
  }

  return (
    <PartnerDesignReviewProvider>
      <div className="partner-page partner-standalone">
      <PartnerScrollAnimator />
      <header className="partner-site-nav">
        <Link href="/" className="partner-brand">
          <span>F</span>
          <span className="partner-brand-copy">
            <b>FindA<em>Local</em>Pro</b>
            <small>Neighborhood Demand Engine</small>
          </span>
        </Link>
        <nav aria-label="Partner page navigation">
          <a href="#how">How it works</a>
          <a href="#report">Weekly report</a>
          <a href="#pricing">Pricing</a>
          <a href="#apply">Apply</a>
        </nav>
      </header>

      {checkoutStatus === 'success' && (
        <div className="partner-checkout-banner is-success" role="status">
          <span className="material-symbols-outlined">verified</span>
          {checkoutConfirmed
            ? 'Payment received — your approved founding partner spot is active. We will follow up with onboarding details.'
            : 'Checkout returned successfully. We are securely confirming payment for your approved application.'}
        </div>
      )}

      {checkoutStatus === 'cancelled' && (
        <div className="partner-checkout-banner" role="status">
          <span className="material-symbols-outlined">info</span>
          Checkout was cancelled and no payment was taken. Use the private link in your approval email when you are ready.
        </div>
      )}

      <main>
        <div className="partner-intro-stage">
          <section className="partner-standalone-hero">
            <Image
              className="partner-neighborhood-bg"
              src="/partners/neighborhood-demand-hero.webp"
              alt=""
              aria-hidden="true"
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
            />
            <PartnerHeroVisual />
            <div className="partner-shell partner-hero-grid">
              <div className="partner-hero-panel">
                <p className="partner-kicker">
                  <span className="partner-live-dot"><i /></span>
                  Founding Partner enrollment — limited by trade & territory
                </p>
                <PartnerHeroTitle />
                <p className="partner-hero-lede" data-copy-key="heroLede">
                  We monitor local conversations, review signals, and tracked calls for your trade and territory — then send you the opportunities, alerts, and weekly reports that help turn local demand into booked work.
                </p>
                <div className="partner-hero-actions">
                  <a href="#apply" className="partner-primary-button"><span data-copy-key="primaryCta">Apply for a Founding Partner Spot</span> <span>→</span></a>
                  <a href="#report" className="partner-secondary-button" data-copy-key="secondaryCta">See the Weekly Report</a>
                </div>
                <div className="partner-trust-row">
                  <span>✓ No payment until your territory is approved</span>
                  <span>✓ Territory & category exclusivity where approved</span>
                </div>
              </div>
            </div>
          </section>

          <section className="partner-stats-section" aria-label="Recent territory example">
            <div className="partner-shell">
              <div className="partner-stats-heading">
                <div className="partner-stats-heading-title">
                  <span className="partner-stats-heading-icon material-symbols-outlined" aria-hidden="true">monitoring</span>
                  <span>A recent week in one territory</span>
                </div>
                <small data-copy-key="recentWeekHelper">Illustrative example · signals found, not guaranteed jobs</small>
              </div>
              <div className="partner-stats-grid">
                {stats.map((stat) => (
                  <article className="partner-stat-card" key={stat.label}>
                    <span className="partner-stat-icon" data-stat-icon={stat.icon} aria-hidden="true">
                      <span className="partner-stat-icon-glyph material-symbols-outlined">{stat.icon}</span>
                    </span>
                    <div className="partner-stat-copy">
                      <b className="partner-stat-value">{stat.value}</b>
                      <span className="partner-stat-label">{stat.label}</span>
                      <small className="partner-stat-detail">{stat.detail}</small>
                    </div>
                    <div className="partner-stat-trend" role="img" aria-label={`${stat.trend} illustrative weekly trend`}>
                      <svg viewBox="0 0 114 36" aria-hidden="true" focusable="false">
                        <polyline points={stat.sparkline} pathLength="1" />
                      </svg>
                      <span
                        className="partner-stat-trend-value"
                        aria-hidden="true"
                        style={{
                          '--partner-trend-target': stat.trendValue,
                          '--partner-trend-number': stat.trendValue,
                        } as CSSProperties}
                      >
                        {stat.trend}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className="partner-section partner-economics-section" aria-labelledby="partner-economics-heading">
          <div className="partner-shell">
            <div className="partner-section-heading">
              <span>Why the math can work</span>
              <h2 id="partner-economics-heading">A few good calls can justify the whole month.</h2>
              <p>
                This is built for trades where one timely homeowner call matters. You are not buying random shared leads — you are buying a protected monitoring lane with weekly proof of work.
              </p>
            </div>
            <div className="partner-economics-grid">
              {economics.map(([value, title, body], index) => (
                <article key={title}>
                  <EconomicsVisual index={index} />
                  <b>{value}</b>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
            <p className="partner-economics-note">
              No booked-job guarantee. The value is earlier visibility, category protection where approved, and a clear report showing what happened locally every week.
            </p>
          </div>
        </section>

        <section id="how" className="partner-section partner-how-section">
          <div className="partner-shell">
            <div className="partner-section-heading">
              <span>How it works</span>
              <h2 data-copy-key="howHeading">A local market watch that runs while you're on the job.</h2>
              <p data-copy-key="howBody">No dashboard to babysit. We do the watching and bring you what's worth your time.</p>
            </div>
            <PartnerHowStage flow={flow} />
          </div>
        </section>

        <section id="report" className="partner-section partner-report-section">
          <div className="partner-shell partner-split">
            <div className="partner-sticky-copy">
              <span className="partner-section-label">The weekly Neighborhood Demand Report</span>
              <h2 data-copy-key="reportHeading">One clear read on your local market — every Monday.</h2>
              <p data-copy-key="reportBody">
                A done-for-you briefing, not a dashboard you have to log into. Seven sections, written for a busy owner who has five minutes between jobs.
              </p>
              <div className="partner-report-bullets">
                {['Executive snapshot', 'New local opportunities', 'Actions taken', 'Calls & lead outcomes', 'Reputation alerts', 'Competitor watch', 'Recommended next moves'].map((item) => (
                  <span key={item}><i />{item}</span>
                ))}
              </div>
            </div>
            <PartnerReportDisplay />
          </div>
        </section>

        <section id="pricing" className="partner-section partner-pricing-section">
          <div className="partner-shell partner-split">
            <div>
              <span className="partner-section-label">Founding Partner Plan</span>
              <h2 data-copy-key="pricingHeading">Founding pricing — locked in while we open your territory.</h2>
              <p data-copy-key="pricingBody">
                We're enrolling a first wave of partners by trade and territory. Founding partners help us calibrate the service in their market — so the price reflects that, and it's lower than the standard rate.
              </p>
              <ul className="partner-pricing-points">
                <li>Apply first; no payment until we approve your trade and territory</li>
                <li>One approved partner per trade and territory where available</li>
                <li>Founding price designed to be covered by a small number of booked jobs</li>
                <li>Flat monthly service, not shared-lead bidding</li>
              </ul>
            </div>
            <div className="partner-pricing-card-column">
              <aside className="partner-pricing-box is-price-intro">
                <svg className="partner-pricing-rim" viewBox="0 0 1000 1300" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                  <defs>
                    <linearGradient id="partnerPricingBaseRim" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#a7cfff" stopOpacity="0.32" />
                      <stop offset="35%" stopColor="#4777b4" stopOpacity="0.2" />
                      <stop offset="70%" stopColor="#244b82" stopOpacity="0.16" />
                      <stop offset="100%" stopColor="#168eea" stopOpacity="0.38" />
                    </linearGradient>
                    <linearGradient id="partnerPricingHotRim" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#2f76bd" stopOpacity="0" />
                      <stop offset="35%" stopColor="#179cff" stopOpacity="0.65" />
                      <stop offset="62%" stopColor="#8fe7ff" stopOpacity="1" />
                      <stop offset="78%" stopColor="#dff8ff" stopOpacity="1" />
                      <stop offset="100%" stopColor="#1b91ff" stopOpacity="0.15" />
                    </linearGradient>
                    <filter id="partnerPricingRimGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <rect x="2" y="2" width="996" height="1296" rx="48" fill="none" stroke="url(#partnerPricingBaseRim)" strokeWidth="2" />
                  <path d="M 735 2 H 952 Q 998 2 998 48 V 250" fill="none" stroke="url(#partnerPricingHotRim)" strokeWidth="3" strokeLinecap="round" filter="url(#partnerPricingRimGlow)" />
                  <path d="M 835 2 H 955 Q 998 2 998 45" fill="none" stroke="#dff8ff" strokeOpacity="0.85" strokeWidth="0.8" strokeLinecap="round" />
                </svg>
                <div className="partner-pricing-surface">
                  <div className="partner-pricing-badge-row">
                    <span>Founding Partner</span>
                    <small><i aria-hidden="true" />Limited spots</small>
                  </div>
                  <div className="partner-pricing-anchor" aria-label="Founding partner discount">
                    <div className="partner-pricing-anchor-head">
                      <span data-copy-key="priceAnchorLabel">Full-service pilot value</span>
                      <div className="partner-pricing-anchor-value">
                        <b className="partner-pricing-old">
                          <span className="sr-only">$1,000 per month</span>
                          <span className="partner-pricing-old-text" aria-hidden="true">
                            <span className="partner-pricing-old-amount">$1,000</span>
                            <span className="partner-pricing-old-unit">/ month</span>
                          </span>
                        </b>
                      </div>
                    </div>
                  </div>
                  <p className="partner-pricing-drop-label" data-copy-key="priceDropLabel">founding price drops to</p>
                  <div className="partner-pricing-price">
                    <b>
                      <PartnerPriceCounter />
                    </b>
                    <small>/ month</small>
                    <span className="partner-price-sparkles" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </span>
                  </div>
                  <p className="partner-pricing-duration"><span aria-hidden="true">✓</span>first 3 monthly billing cycles</p>
                  <div className="partner-pricing-standard">
                    <Image src="/partners/pricing-shield.png" alt="" aria-hidden="true" width={256} height={256} sizes="34px" loading="lazy" />
                    <p>Then <strong>$750 / mo</strong> standard</p>
                  </div>
                  <a href="#apply" className="partner-primary-button"><span className="partner-pricing-cta-icon" aria-hidden="true">›</span><span data-copy-key="primaryCta">Apply for a Founding Partner Spot</span></a>
                  <p className="partner-pricing-note">
                    <Image src="/partners/pricing-no-payment.png" alt="" aria-hidden="true" width={256} height={256} sizes="32px" loading="lazy" />
                    No payment with your application. Approved partners receive a private Stripe checkout link for the $500 founding rate.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="partner-included">
          <div className="partner-shell">
            <div className="partner-section-heading is-light">
              <span>What's included</span>
              <h2 data-copy-key="includedHeading">Everything in one done-for-you service.</h2>
            </div>
            <div className="partner-included-grid">
              {included.map(([title, body]) => (
                <article key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="apply" className="partner-section partner-apply-section">
          <div className="partner-shell partner-apply-grid">
            <div>
              <span className="partner-section-label">Apply</span>
              <h2 data-copy-key="applyHeading">Claim your trade & territory.</h2>
              <p data-copy-key="applyBody">
                Apply for your trade and territory with no payment. We review availability first, and approved applicants receive a private $500 Stripe checkout link by email.
              </p>
              <ol className="partner-apply-steps">
                <li><b>1</b><span><strong>Apply</strong> — tell us your trade and service area.</span></li>
                <li><b>2</b><span><strong>Review</strong> — we confirm trade, territory, and category availability before any charge.</span></li>
                <li><b>3</b><span><strong>Checkout & onboard</strong> — approved partners receive a private Stripe checkout link, then onboarding begins.</span></li>
              </ol>
            </div>
            <PartnerApplicationForm />
          </div>
        </section>

        <section className="partner-section">
          <div className="partner-shell partner-faq-shell">
            <div className="partner-section-heading">
              <span>Questions</span>
              <h2>Straight answers for busy owners.</h2>
            </div>
            <div className="partner-faq-list">
              {faqs.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}<span>+</span></summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="partner-final-cta">
          <div className="partner-shell">
            <h2>A founding spot in your territory won't stay open long.</h2>
            <p>Apply with no payment. If your trade and territory are approved, we email your private $500 Stripe checkout link.</p>
            <a href="#apply" className="partner-primary-button"><span data-copy-key="primaryCta">Apply for a Founding Partner Spot</span> <span>→</span></a>
          </div>
        </section>
      </main>

      <footer className="partner-footer">
        <div className="partner-shell">
          <div><span>F</span> FindALocalPro · Neighborhood Demand Engine</div>
          <p>A local market-watch service. We surface opportunities, signals, and reputation alerts — we do not guarantee booked jobs or revenue. partners.findalocalpro.com</p>
        </div>
      </footer>
      </div>
    </PartnerDesignReviewProvider>
  );
}
