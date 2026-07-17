'use client';

import { FormEvent, useEffect, useRef, useState, type CSSProperties } from 'react';

const categories = [
  'Plumbing',
  'HVAC / Heating & Cooling',
  'Electrical',
  'Appliance Repair',
  'Pest Control',
  'Handyman',
  'Roofing',
  'Lawn & Tree Service',
  'Other',
];

type PartnerForm = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  category: string;
  serviceAreas: string;
  preferredTerritory: string;
  yearsInBusiness: string;
  googleProfile: string;
  notes: string;
  confirmed: boolean;
};

const initialForm: PartnerForm = {
  businessName: '',
  contactName: '',
  email: '',
  phone: '',
  website: '',
  category: '',
  serviceAreas: '',
  preferredTerritory: '',
  yearsInBusiness: '',
  googleProfile: '',
  notes: '',
  confirmed: false,
};

const steps = [
  { label: 'Contact', title: 'Where should we reach you?', eyebrow: 'Start with the essentials' },
  { label: 'Business', title: 'Who are we saving this territory for?', eyebrow: 'Tell us who you are' },
  { label: 'Trade', title: 'What kind of work do you want more of?', eyebrow: 'Choose your lane' },
  { label: 'Territory', title: 'Where do you want us watching?', eyebrow: 'Define your market' },
  { label: 'Review', title: 'Everything look right?', eyebrow: 'Your application is ready' },
] as const;

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function PartnerApplicationForm() {
  const [form, setForm] = useState<PartnerForm>(initialForm);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'exit'>('idle');
  const [captured, setCaptured] = useState('');
  const [justCompleted, setJustCompleted] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [reviewGlowScope, setReviewGlowScope] = useState<'all' | 0 | 1 | 2 | null>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const transitionTimer = useRef<number | null>(null);
  const reviewGlowTimer = useRef<number | null>(null);
  const previousStep = useRef(step);
  const hasReachedReview = useRef(false);
  const editedReviewSection = useRef<0 | 1 | 2 | null>(null);

  useEffect(() => () => {
    if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
    if (reviewGlowTimer.current) window.clearTimeout(reviewGlowTimer.current);
  }, []);

  useEffect(() => {
    const didChangeStep = previousStep.current !== step;
    previousStep.current = step;
    if (didChangeStep && step < steps.length - 1) firstFieldRef.current?.focus({ preventScroll: true });
  }, [step]);

  useEffect(() => {
    if (step !== steps.length - 1) return;

    const scope = hasReachedReview.current ? editedReviewSection.current : 'all';
    hasReachedReview.current = true;
    editedReviewSection.current = null;

    if (scope === null) return;
    setReviewGlowScope(scope);
    if (reviewGlowTimer.current) window.clearTimeout(reviewGlowTimer.current);
    reviewGlowTimer.current = window.setTimeout(() => setReviewGlowScope(null), 1800);
  }, [step]);

  const setField = <K extends keyof PartnerForm>(key: K, value: PartnerForm[K]) => {
    setError('');
    setForm((current) => ({ ...current, [key]: value }));
  };

  const canAdvance = [
    form.email.includes('@') && form.phone.replace(/\D/g, '').length === 10,
    Boolean(form.businessName.trim() && form.contactName.trim()),
    Boolean(form.category),
    Boolean(form.serviceAreas.trim()),
    true,
  ];

  const capturedSummary = () => {
    if (step === 0) return 'Contact saved';
    if (step === 1) return `${form.businessName.trim()} saved`;
    if (step === 2) return `${form.category} selected`;
    return 'Territory saved';
  };

  const advance = () => {
    if (!canAdvance[step] || phase !== 'idle' || step >= steps.length - 1) return;
    setCaptured(capturedSummary());
    setJustCompleted(step);
    setPhase('exit');
    transitionTimer.current = window.setTimeout(() => {
      setStep((current) => Math.min(current + 1, steps.length - 1));
      setPhase('idle');
      window.setTimeout(() => {
        setCaptured('');
        setJustCompleted(null);
      }, 620);
    }, 330);
  };

  const goBack = () => {
    if (phase !== 'idle' || step === 0) return;
    setCaptured('');
    setJustCompleted(null);
    setStep((current) => current - 1);
  };

  const editStep = (nextStep: number) => {
    setCaptured('');
    setJustCompleted(null);
    setReviewGlowScope(null);
    editedReviewSection.current = nextStep as 0 | 1 | 2;
    setStep(nextStep);
  };

  const reviewFieldClass = (section: 0 | 1 | 2, value: string) => {
    const isComplete = Boolean(value.trim());
    const isLocking = isComplete && (reviewGlowScope === 'all' || reviewGlowScope === section);
    return `field-block partner-review-field${isComplete ? ' is-complete' : ''}${isLocking ? ' is-locking' : ''}`;
  };

  const reviewFieldStyle = (section: 0 | 1 | 2, fullOrder: number, sectionOrder: number) => ({
    '--partner-review-lock-delay': `${reviewGlowScope === 'all' ? 260 + (fullOrder * 90) : 100 + (sectionOrder * 90)}ms`,
  }) as CSSProperties;

  const handleStageSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    advance();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');

    try {
      const applicationResponse = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const applicationResult = await applicationResponse.json() as { applicationId?: string; error?: string };
      if (!applicationResponse.ok || !applicationResult.applicationId) {
        throw new Error(applicationResult.error || 'Application could not be saved.');
      }
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error
        ? submitError.message
        : 'That did not send cleanly. Please try again or email hello@findalocalpro.com.');
    } finally {
      setSubmitting(false);
    }
  };

  if (step < steps.length - 1) {
    return (
      <section className="partner-form-shell partner-form-shell--staged">
        <form className="partner-intake-card" onSubmit={handleStageSubmit}>
          <div className="partner-intake-progress" aria-label={`Step ${step + 1} of ${steps.length - 1}`}>
            <div className="partner-intake-progress-copy"><span>Application</span><b>{step + 1} of {steps.length - 1}</b></div>
            <div className="partner-intake-progress-rail" aria-hidden="true">
              {steps.slice(0, -1).map((item, index) => (
                <i key={item.label} className={`${index < step ? 'is-done' : ''} ${index === step ? 'is-active' : ''} ${index === justCompleted ? 'just-completed' : ''}`} />
              ))}
            </div>
          </div>

          {captured && <div className="partner-captured-chip" role="status"><span>✓</span>{captured}</div>}

          <div key={step} className={`partner-intake-step ${phase === 'exit' ? 'is-exiting' : ''}`}>
            <p className="partner-intake-eyebrow">{steps[step].eyebrow}</p>
            <h3>{steps[step].title}</h3>

            {step === 0 && (
              <div className="partner-intake-fields">
                <label className="partner-intake-field">
                  <span>Email address</span>
                  <input ref={firstFieldRef} type="email" value={form.email} onChange={(event) => setField('email', event.target.value)} autoComplete="email" placeholder="you@business.com" required />
                </label>
                <label className="partner-intake-field">
                  <span>Mobile phone</span>
                  <input type="tel" value={form.phone} onChange={(event) => setField('phone', formatPhone(event.target.value))} autoComplete="tel" inputMode="tel" placeholder="(555) 555-0123" required />
                </label>
                <p className="partner-intake-helper">We use this only to follow up about your application and territory availability.</p>
              </div>
            )}

            {step === 1 && (
              <div className="partner-intake-fields">
                <label className="partner-intake-field">
                  <span>Business name</span>
                  <input ref={firstFieldRef} value={form.businessName} onChange={(event) => setField('businessName', event.target.value)} autoComplete="organization" placeholder="Oak Street Plumbing" required />
                </label>
                <label className="partner-intake-field">
                  <span>Your name</span>
                  <input value={form.contactName} onChange={(event) => setField('contactName', event.target.value)} autoComplete="name" placeholder="Jordan Smith" required />
                </label>
              </div>
            )}

            {step === 2 && (
              <div className="partner-intake-fields">
                <label className="partner-intake-field">
                  <span>Primary service category</span>
                  <select value={form.category} onChange={(event) => setField('category', event.target.value)} required autoFocus>
                    <option value="">Choose your trade...</option>
                    {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                </label>
                <p className="partner-intake-helper">We limit enrollment by trade and territory, so this determines which local lane we check.</p>
              </div>
            )}

            {step === 3 && (
              <div className="partner-intake-fields">
                <label className="partner-intake-field">
                  <span>Primary service areas or ZIPs</span>
                  <input ref={firstFieldRef} value={form.serviceAreas} onChange={(event) => setField('serviceAreas', event.target.value)} placeholder="Downers Grove, 60515, 60516" required />
                </label>
                <label className="partner-intake-field">
                  <span>Preferred territory <small>optional</small></span>
                  <input value={form.preferredTerritory} onChange={(event) => setField('preferredTerritory', event.target.value)} placeholder="Western suburbs" />
                </label>
              </div>
            )}
          </div>

          <div className="partner-intake-actions">
            {step > 0 && <button type="button" className="partner-intake-back" onClick={goBack} disabled={phase !== 'idle'}>← Back</button>}
            <button className="partner-intake-next" disabled={!canAdvance[step] || phase !== 'idle'}>Save & continue <span>→</span></button>
          </div>
          <p className="partner-intake-footnote">Your answers stay editable. No payment is collected with this application.</p>
        </form>
      </section>
    );
  }

  if (submitted) {
    return (
      <section className="partner-form-shell partner-form-shell--review" aria-live="polite">
        <div className="partner-intake-card partner-application-success">
          <span className="material-symbols-outlined" aria-hidden="true">mark_email_read</span>
          <p className="partner-intake-eyebrow">Application received</p>
          <h3>Your territory review is pending.</h3>
          <p>No payment was taken. We will review your trade and service area, and approved applicants receive a private Stripe checkout link by email.</p>
          <p className="partner-intake-helper">Check your inbox after approval. The founding rate is $500 for the first three monthly billing cycles, then $750 per month.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="partner-form-shell partner-form-shell--review">
      <form className="partner-application-card partner-application-card--review" onSubmit={handleSubmit}>
        <div className="partner-review-heading">
          <div><p className="partner-intake-eyebrow">Application review</p><h3>Ready when you are.</h3><p>Review the details below, add anything helpful, then apply.</p></div>
          <span className="partner-review-ready">✓ All required details captured</span>
        </div>

        <fieldset className="partner-review-group">
          <legend>Contact <button type="button" onClick={() => editStep(0)}>Edit</button></legend>
          <div className="partner-field-grid">
            <label className={reviewFieldClass(0, form.email)} style={reviewFieldStyle(0, 0, 0)}><span>Email</span><input className="lead-input" type="email" value={form.email} onChange={(event) => setField('email', event.target.value)} autoComplete="email" required /></label>
            <label className={reviewFieldClass(0, form.phone)} style={reviewFieldStyle(0, 1, 1)}><span>Phone</span><input className="lead-input" type="tel" value={form.phone} onChange={(event) => setField('phone', formatPhone(event.target.value))} autoComplete="tel" required /></label>
          </div>
        </fieldset>

        <fieldset className="partner-review-group">
          <legend>Business <button type="button" onClick={() => editStep(1)}>Edit</button></legend>
          <div className="partner-field-grid">
            <label className={reviewFieldClass(1, form.businessName)} style={reviewFieldStyle(1, 2, 0)}><span>Business name</span><input className="lead-input" value={form.businessName} onChange={(event) => setField('businessName', event.target.value)} required /></label>
            <label className={reviewFieldClass(1, form.contactName)} style={reviewFieldStyle(1, 3, 1)}><span>Contact name</span><input className="lead-input" value={form.contactName} onChange={(event) => setField('contactName', event.target.value)} autoComplete="name" required /></label>
          </div>
          <label className="field-block"><span>Website <small>optional</small></span><input className="lead-input" type="url" value={form.website} onChange={(event) => setField('website', event.target.value)} placeholder="https://" /></label>
        </fieldset>

        <fieldset className="partner-review-group">
          <legend>Trade & territory <button type="button" onClick={() => editStep(2)}>Edit</button></legend>
          <label className={reviewFieldClass(2, form.category)} style={reviewFieldStyle(2, 4, 0)}><span>Service category</span><select className="lead-input" value={form.category} onChange={(event) => setField('category', event.target.value)} required><option value="">Select a trade...</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
          <div className="partner-field-grid">
            <label className={reviewFieldClass(2, form.serviceAreas)} style={reviewFieldStyle(2, 5, 1)}><span>Primary service areas / ZIPs</span><input className="lead-input" value={form.serviceAreas} onChange={(event) => setField('serviceAreas', event.target.value)} required /></label>
            <label className={reviewFieldClass(2, form.preferredTerritory)} style={reviewFieldStyle(2, 6, 2)}><span>Preferred territory</span><input className="lead-input" value={form.preferredTerritory} onChange={(event) => setField('preferredTerritory', event.target.value)} /></label>
          </div>
        </fieldset>

        <fieldset className="partner-review-group partner-review-group--optional">
          <legend>Helpful context <span>Optional</span></legend>
          <div className="partner-field-grid">
            <label className="field-block"><span>Years in business</span><input className="lead-input" inputMode="numeric" value={form.yearsInBusiness} onChange={(event) => setField('yearsInBusiness', event.target.value.replace(/[^\d+]/g, '').slice(0, 4))} /></label>
            <label className="field-block"><span>Google Business Profile URL</span><input className="lead-input" type="url" value={form.googleProfile} onChange={(event) => setField('googleProfile', event.target.value)} placeholder="https://" /></label>
          </div>
          <label className="field-block"><span>Notes / specialties</span><textarea className="lead-input" rows={4} value={form.notes} onChange={(event) => setField('notes', event.target.value)} /></label>
        </fieldset>

        <label className="consent-check"><input type="checkbox" checked={form.confirmed} onChange={(event) => setField('confirmed', event.target.checked)} required /><span>I confirm my business is licensed and insured where required for my trade and territory.</span></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className={`form-submit partner-submit ${submitting ? 'is-submitting' : ''}`} disabled={submitting || !form.confirmed}>{submitting ? 'Submitting application...' : 'Submit for territory review'}</button>
        <p className="partner-form-note">No payment today. If approved, we email you a private Stripe checkout link for the $500 founding rate.</p>
      </form>
    </section>
  );
}
