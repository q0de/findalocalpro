import type { Metadata } from 'next';
import Link from 'next/link';
import { PartnerApplicationForm } from './PartnerApplicationForm';
import { PartnerHeroTitle } from './PartnerHeroTitle';
import { PartnerHeroVisual } from './PartnerHeroVisual';

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
  ['Review request templates', 'Ready-to-send templates to turn happy customers into 5-star reviews.'],
  ['Territory & category exclusivity', "Where approved, we won't enroll a direct competitor in your protected area."],
];

const stats = [
  ['14', 'Opportunities found', 'Neighborhood posts & search signals'],
  ['9', 'Calls / leads routed', 'Tracked & recorded where applicable'],
  ['3', 'Reviews flagged', 'With response drafts ready'],
  ['5', 'Competitor mentions', 'Where rivals were recommended'],
];

const faqs = [
  ['Is this pay-per-lead?', 'No. This is a flat monthly market-watch service, not a per-lead marketplace. You are not bidding against other contractors or paying for each contact — you get monitoring, alerts, call tracking, and a weekly report for one predictable price.'],
  ['Do you guarantee booked jobs?', 'No, and we will never promise that. We surface local opportunities, demand signals, and reputation alerts, and we route and track calls where applicable. What you do with that timing and information is what turns it into booked work.'],
  ['Is my territory exclusive?', 'Where approved, yes. We limit enrollment by trade and territory and protect approved partners from having a direct competitor signed up in the same area. Availability depends on your specific category and ZIPs, which is why we review before confirming.'],
  ['Do you post on social platforms as my business?', 'No. We monitor public local conversations and signals and tell you where the opportunities are. We never post or message as your business — you stay in control of how and when you respond.'],
  ['What happens after I apply?', 'We review availability and fit for your trade and territory, usually within one business day. If your area is open and it is a good match, we confirm your founding spot and onboard you. No payment is charged until you are approved.'],
  ['Why is the founding price lower?', 'Founding partners help us calibrate the service in their local market, so we lock in a lower rate of $497/month for the first 3 months before the standard $750/month rate. It is a genuine trial of a high-touch service, not a discount gimmick.'],
];

type PartnersPageProps = {
  searchParams?: Promise<{ checkout?: string }>;
};

export default async function PartnersPage({ searchParams }: PartnersPageProps) {
  const checkoutStatus = (await searchParams)?.checkout;

  return (
    <div className="partner-page partner-standalone">
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
          <PartnerHeroVisual />
          <div className="partner-shell partner-hero-grid">
            <div className="partner-hero-panel">
              <p className="partner-kicker">
                <span className="partner-live-dot"><i /></span>
                Founding Partner enrollment — limited by trade & territory
              </p>
              <PartnerHeroTitle />
              <p className="partner-hero-lede">
                We monitor local conversations, review signals, and tracked calls for your trade and territory — then send you the opportunities, alerts, and weekly reports that help turn local demand into booked work.
              </p>
              <div className="partner-hero-actions">
                <a href="#apply" className="partner-primary-button">Apply for a Founding Partner Spot <span>→</span></a>
                <a href="#report" className="partner-secondary-button">See the Weekly Report</a>
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
              <small>Illustrative example · signals found, not guaranteed jobs</small>
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

        <section id="how" className="partner-section">
          <div className="partner-shell">
            <div className="partner-section-heading">
              <span>How it works</span>
              <h2>A local market watch that runs while you're on the job.</h2>
              <p>No dashboard to babysit. We do the watching and bring you what's worth your time.</p>
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
              <h2>One clear read on your local market — every Monday.</h2>
              <p>
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
                    <p><em className="is-hot">Hot</em><strong>Travis Heights</strong> — water heater leaking, wants same-day. 6 replies, no provider booked. <small>Nextdoor</small></p>
                    <p><em>Warm</em><strong>Bouldin Creek</strong> — repeated "low water pressure" search activity in cluster. <small>Search signal</small></p>
                    <p><em>Warm</em><strong>Zilker</strong> — homeowner asking for repipe recommendations after slab leak. <small>Nextdoor</small></p>
                  </div>
                </section>

                <section>
                  <span>Actions taken</span>
                  <div className="partner-check-list">
                    <p><b>✓</b> Sent 6 hot alerts; you responded to 4 within the hour.</p>
                    <p><b>✓</b> Drafted 2 review responses for your approval.</p>
                    <p><b>✓</b> Sent 3 review-request templates to recent completed jobs.</p>
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
              <h2>Founding pricing — locked in while we open your territory.</h2>
              <p>
                We're enrolling a first wave of partners by trade and territory. Founding partners help us calibrate the service in their market — so the price reflects that, and it's lower than the standard rate.
              </p>
              <ul className="partner-pricing-points">
                <li>Apply first — you only pay after you're approved</li>
                <li>Limited by trade and territory</li>
                <li>Territory / category exclusivity where approved</li>
              </ul>
            </div>
            <aside className="partner-pricing-box">
              <div className="partner-pricing-badge-row">
                <span>Founding Partner</span>
                <small>Limited spots</small>
              </div>
              <div className="partner-pricing-price">
                <b>$497</b>
                <small>/ month</small>
              </div>
              <p>for your first 3 months</p>
              <div className="partner-pricing-standard">Then <strong>$750 / month</strong> standard rate</div>
              <a href="#apply" className="partner-primary-button">Apply for a Founding Partner Spot</a>
              <p className="partner-pricing-note">No payment due today. We review your trade & territory, then confirm availability before anything is charged.</p>
            </aside>
          </div>
        </section>

        <section className="partner-included">
          <div className="partner-shell">
            <div className="partner-section-heading is-light">
              <span>What's included</span>
              <h2>Everything in one done-for-you service.</h2>
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
              <h2>Claim your trade & territory.</h2>
              <p>
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
            <a href="#apply" className="partner-primary-button">Apply for a Founding Partner Spot <span>→</span></a>
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
