import type { Metadata } from 'next';
import Link from 'next/link';
import { PartnerApplicationForm } from './PartnerApplicationForm';
import { PartnerCopyVersionControl } from './PartnerCopyVersionControl';
import { PartnerHeroTitle } from './PartnerHeroTitle';
import { PartnerHeroVisual } from './PartnerHeroVisual';
import { PartnerPricingBorderControl } from './PartnerPricingBorderControl';
import { PartnerPriceCounter } from './PartnerPriceCounter';
import { PartnerPricingUnitControl } from './PartnerPricingUnitControl';
import { PartnerPricingWidthControl } from './PartnerPricingWidthControl';
import { PartnerScrollAnimator } from './PartnerScrollAnimator';
import { PartnerStatsBackgroundControl } from './PartnerStatsBackgroundControl';

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
  ['01', 'Monitor local demand', 'We watch neighborhood conversations, search & call activity, and review signals for your trade and territory.'],
  ['02', 'Alert you when timing matters', 'Hot alerts hit your phone the moment a real opportunity appears — before the thread fills with other names.'],
  ['03', 'Route & track calls', 'Dedicated call tracking captures and records inbound demand where applicable, so nothing slips.'],
  ['04', 'Send the weekly report', 'Every week: opportunities found, actions taken, calls routed, reputation alerts, and recommended next moves.'],
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
  ['14', 'Opportunities found', 'Neighborhood posts & search signals'],
  ['9', 'Calls / leads routed', 'Tracked & recorded where applicable'],
  ['3', 'Reviews flagged', 'With response drafts ready'],
  ['5', 'Competitor mentions', 'Where rivals were recommended'],
];

const localOpportunities = [
  {
    temperature: 'Hot',
    area: 'Travis Heights',
    detail: 'Water heater leaking, wants same-day. 6 replies, no provider booked.',
    source: 'Nextdoor',
  },
  {
    temperature: 'Warm',
    area: 'Bouldin Creek',
    detail: 'Repeated "low water pressure" search activity in cluster.',
    source: 'Search signal',
  },
  {
    temperature: 'Warm',
    area: 'Zilker',
    detail: 'Homeowner asking for repipe recommendations after slab leak.',
    source: 'Nextdoor',
  },
];

const economics = [
  ['/partners/economics/booked-jobs.webp', '1-3 jobs', 'Can cover the month', 'For many urgent-service trades, a few booked calls can offset the founding price.'],
  ['/partners/economics/protected-lane.webp', '1 partner', 'Protected by trade', 'Where approved, your local category is not sold to a direct competitor.'],
  ['/partners/economics/flat-fee.webp', 'No auction', 'Flat monthly fee', 'No shared-lead bidding. You get monitoring, alerts, and reporting.'],
  ['/partners/economics/fast-signals.webp', 'Fast signals', 'Timing wins work', 'Hot threads, missed calls, bad reviews, and competitor mentions are worth catching early.'],
];

const faqs = [
  ['Is this pay-per-lead?', 'No. This is a flat monthly market-watch service, not a per-lead marketplace. You are not bidding against other contractors or paying for each contact — you get monitoring, alerts, call tracking, and a weekly report for one predictable price.'],
  ['Can this pay for itself?', 'For many home-service trades, yes, it can. A small number of booked jobs can cover the founding price, especially in higher-value categories like plumbing, HVAC, electrical, appliance repair, and similar urgent services. We still do not guarantee booked jobs or revenue.'],
  ['Do you guarantee booked jobs?', 'No, and we will never promise that. We surface local opportunities, demand signals, and reputation alerts, and we route and track calls where applicable. What you do with that timing and information is what turns it into booked work.'],
  ['Is my territory exclusive?', 'Where approved, yes. We limit enrollment by trade and territory and protect approved partners from having a direct competitor signed up in the same area. Availability depends on your specific category and ZIPs, which is why we review before confirming.'],
  ['Can the messaging sound like my company?', 'Yes. During onboarding we learn your tone, service standards, offers, and do-not-say rules, then prepare response drafts, review requests, and follow-up wording that fit your company. You approve or edit before anything is sent.'],
  ['Do you post on social platforms as my business?', 'No. We monitor public local conversations and signals and tell you where the opportunities are. We never post or message as your business — you stay in control of how and when you respond.'],
  ['What happens after I apply?', 'We review availability and fit for your trade and territory, usually within one business day. If your area is open and it is a good match, we confirm your founding spot and onboard you. No payment is charged until you are approved.'],
  ['Why is the founding price lower?', 'Founding partners help us calibrate the service in their local market, so we start with a $500/mo founding pilot for 90 days before the $750/mo standard rate. It is a genuine trial of a high-touch service, not a discount gimmick.'],
];

type PartnersPageProps = {
  searchParams?: Promise<{ checkout?: string }>;
};

export default async function PartnersPage({ searchParams }: PartnersPageProps) {
  const checkoutStatus = (await searchParams)?.checkout;

  return (
    <div className="partner-page partner-standalone">
      <PartnerScrollAnimator />
      <header className="partner-site-nav">
        <Link href="/" className="partner-brand" aria-label="FindALocalPro home">
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
          Checkout complete. We will match it to your Neighborhood Demand Engine onboarding.
        </div>
      )}

      {checkoutStatus === 'cancelled' && (
        <div className="partner-checkout-banner" role="status">
          <span className="material-symbols-outlined">info</span>
          Checkout was cancelled. Your founding partner application can still be reviewed first.
        </div>
      )}

      <main>
        <section className="partner-standalone-hero">
          <span className="partner-neighborhood-bg" aria-hidden="true" />
          <PartnerCopyVersionControl />
          <PartnerPricingWidthControl />
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
                <span>✓ Apply first, pay after approval</span>
                <span>✓ Territory & category exclusivity where approved</span>
              </div>
            </div>
          </div>
        </section>

        <section className="partner-stats-section" aria-label="Recent territory example">
          <div className="partner-shell">
            <div className="partner-stats-heading">
              <span>A recent week in one territory</span>
              <div className="partner-stats-heading-tools">
                <small data-copy-key="recentWeekHelper">Illustrative example · signals found, not guaranteed jobs</small>
                <PartnerStatsBackgroundControl placement="inline" />
              </div>
            </div>
            <div className="partner-stats-grid">
              {stats.map(([value, label, detail]) => (
                <article key={label}>
                  <b>{value}</b>
                  <span>{label}</span>
                  <small>{detail}</small>
                </article>
              ))}
            </div>
          </div>
        </section>

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
              {economics.map(([image, value, title, body], index) => (
                <article key={title}>
                  <span className="partner-economics-image" data-economics-visual={index + 1} aria-hidden="true">
                    <img src={image} alt="" />
                  </span>
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

        <section id="how" className="partner-section">
          <div className="partner-shell">
            <div className="partner-section-heading">
              <span>How it works</span>
              <h2 data-copy-key="howHeading">A local market watch that runs while you're on the job.</h2>
              <p data-copy-key="howBody">No dashboard to babysit. We do the watching and bring you what's worth your time.</p>
            </div>
            <div className="partner-flow-grid">
              {flow.map(([number, title, body]) => (
                <article key={title}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
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
            <div className="partner-report-document">
              <header>
                <div>
                  <span>Neighborhood Demand Report</span>
                  <b>Rivertown Plumbing & Drain</b>
                </div>
                <p>Week of Jun 22-28<br />Territory · 78704 + 4 ZIPs</p>
              </header>

              <div className="partner-report-body">
                <section>
                  <span>Executive snapshot</span>
                  <p>Demand was up week-over-week, driven by heat-wave plumbing and water-heater chatter. Nine inbound calls were tracked and one reputation issue needs your sign-off.</p>
                  <div className="partner-report-metrics">
                    {[
                      ['14', 'Opportunities'],
                      ['9', 'Calls routed'],
                      ['3', 'Reviews flagged'],
                      ['5', 'Competitor refs'],
                    ].map(([value, label]) => (
                      <article key={label}><b>{value}</b><small>{label}</small></article>
                    ))}
                  </div>
                </section>

                <section>
                  <span>New local opportunities</span>
                  <div className="partner-opportunity-list">
                    {localOpportunities.map((opportunity) => (
                      <article key={`${opportunity.area}-${opportunity.source}`} className="partner-opportunity-row">
                        <em className={opportunity.temperature === 'Hot' ? 'is-hot' : undefined}>{opportunity.temperature}</em>
                        <strong>{opportunity.area}</strong>
                        <p>{opportunity.detail}</p>
                        <small>{opportunity.source}</small>
                      </article>
                    ))}
                  </div>
                </section>

                <section>
                  <span>Actions taken</span>
                  <div className="partner-check-list">
                    <p><b>✓</b> Sent 6 hot alerts; you responded to 4 within the hour.</p>
                    <p><b>✓</b> Drafted 2 review responses for your approval.</p>
                    <p><b>✓</b> Prepared 3 review-request messages in your company voice.</p>
                  </div>
                </section>

                <section>
                  <span>Calls & lead outcomes</span>
                  <div className="partner-call-table">
                    <div><b>Tracked call</b><b>Length</b><b>Status</b></div>
                    <div><span>Bouldin Creek — "no hot water"</span><span>4:12</span><strong>Qualified</strong></div>
                    <div><span>South Lamar — quote request</span><span>2:48</span><strong>Booked</strong></div>
                    <div><span>Missed — voicemail left</span><span>0:38</span><strong className="is-warn">Follow up</strong></div>
                  </div>
                </section>

                <section>
                  <span className="is-alert">Reputation alerts</span>
                  <div className="partner-reputation-alert">
                    <strong>New 3★ Google review</strong> mentioning a scheduling mix-up. A calm, professional response draft is ready — approve or edit in one tap.
                  </div>
                </section>

                <section>
                  <span>Competitor watch</span>
                  <p>A nearby competitor was recommended in 5 threads this week, mostly for emergency response speed. Two of those threads are still open — see recommended moves.</p>
                </section>

                <section>
                  <span>Recommended next moves</span>
                  <div className="partner-check-list">
                    <p><b>→</b> Reply to the 2 open Zilker repipe threads while they're warm.</p>
                    <p><b>→</b> Approve the 3★ response draft to protect your rating.</p>
                    <p><b>→</b> Consider a same-day emergency line — competitors are winning on speed.</p>
                  </div>
                </section>
              </div>
            </div>
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
                <li>Apply first — no payment until your category and territory are approved</li>
                <li>One approved partner per trade and territory where available</li>
                <li>Founding price designed to be covered by a small number of booked jobs</li>
                <li>Flat monthly service, not shared-lead bidding</li>
              </ul>
            </div>
            <div className="partner-pricing-card-column">
              <PartnerPricingBorderControl />
              <PartnerPricingUnitControl />
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
                  <p className="partner-pricing-duration"><span aria-hidden="true">✓</span>founding pilot for 90 days</p>
                  <div className="partner-pricing-standard"><img src="/partners/pricing-shield.png" alt="" aria-hidden="true" /><p>Then <strong>$750 / mo</strong> standard</p></div>
                  <a href="#apply" className="partner-primary-button"><span className="partner-pricing-cta-icon" aria-hidden="true">›</span><span data-copy-key="primaryCta">Apply for a Founding Partner Spot</span></a>
                  <p className="partner-pricing-note"><img src="/partners/pricing-no-payment.png" alt="" aria-hidden="true" />No payment due today. We review your trade & territory, then confirm availability before anything is charged.</p>
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
                Apply first — there's no payment today. We review availability in your area and confirm before anything is charged.
              </p>
              <ol className="partner-apply-steps">
                <li><b>1</b><span><strong>Apply</strong> — tell us your trade and service area.</span></li>
                <li><b>2</b><span><strong>Review</strong> — we check territory availability & fit.</span></li>
                <li><b>3</b><span><strong>Onboard</strong> — approved partners go live; first charge after approval.</span></li>
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
            <p>Apply now — no payment today. We'll confirm availability for your trade and area.</p>
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
  );
}
