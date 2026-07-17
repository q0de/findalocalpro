'use client';

import { FormEvent, useMemo, useState } from 'react';
import { SUPABASE_URL } from '@/lib/supabase';

const tradeLabels: Record<string, string> = {
  plumbing: 'Plumbing',
  hvac: 'HVAC',
  electricians: 'Electrical',
  roofing: 'Roofing',
  'pest-control': 'Pest Control',
  'appliance-repair': 'Appliance Repair',
};

const urgencyHints: Record<string, string> = {
  plumbing: 'Most plumbing emergencies get worse by the hour.',
  hvac: "Don't wait for a breakdown in a Chicago winter.",
  electricians: "Electrical issues are a fire hazard. Don't DIY.",
  roofing: 'Small leaks become big problems fast.',
  'pest-control': 'Pests multiply quickly. Early action saves money.',
  'appliance-repair': 'A broken appliance disrupts the whole routine.',
};

const projectPrompts: Record<string, string[]> = {
  plumbing: ['Leak or burst pipe', 'Clogged drain', 'Water heater', 'Fixture install'],
  hvac: ['No heat or AC', 'System tune-up', 'Strange noise', 'Replacement quote'],
  electricians: ['Outlet or breaker', 'Lighting install', 'Panel issue', 'Safety check'],
  roofing: ['Leak', 'Storm damage', 'Missing shingles', 'Full roof quote'],
  'pest-control': ['Ants', 'Mice or rodents', 'Wasps', 'Inspection'],
  'appliance-repair': ['Washer or dryer', 'Fridge', 'Oven or range', 'Dishwasher'],
};

const timingOptions = [
  { value: 'asap', label: 'ASAP', helper: 'Send the fastest available pro', icon: 'bolt' },
  { value: 'today', label: 'Today', helper: 'A same-day call works', icon: 'today' },
  { value: 'this-week', label: 'This week', helper: 'I can schedule a window', icon: 'calendar_month' },
];

const steps = ['Project', 'Contact'];

type FormState = {
  issue: string;
  timing: string;
  zip: string;
  name: string;
  phone: string;
  description: string;
  consent: boolean;
};

const initialForm: FormState = {
  issue: '',
  timing: 'today',
  zip: '',
  name: '',
  phone: '',
  description: '',
  consent: false,
};

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function stageSummary(form: FormState, trade: string) {
  const issue = form.issue || `${trade} help`;
  const zip = form.zip ? ` in ${form.zip}` : '';
  return `${issue}${zip}`;
}

export function ServiceCallbackForm({ vertical }: { vertical: string }) {
  const trade = tradeLabels[vertical] || 'Home Service';
  const urgency = urgencyHints[vertical];
  const issueOptions = projectPrompts[vertical] || ['Emergency repair', 'Install', 'Inspection', 'Quote'];
  const [form, setForm] = useState<FormState>(initialForm);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'exit'>('idle');
  const [captured, setCaptured] = useState<string | null>(null);
  const [justFilled, setJustFilled] = useState(-1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const canAdvance = useMemo(() => {
    if (step === 0) return form.issue && form.timing && /^\d{5}$/.test(form.zip);
    return form.name.trim() && form.phone.replace(/\D/g, '').length === 10 && form.consent;
  }, [form, step]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setError('');
    setForm((current) => ({ ...current, [key]: value }));
  };

  const advance = () => {
    if (!canAdvance || phase !== 'idle') return;
    setCaptured(stageSummary(form, trade));
    setJustFilled(0);
    setPhase('exit');
    window.setTimeout(() => {
      setStep(1);
      setPhase('idle');
    }, 260);
    window.setTimeout(() => setCaptured(null), 1000);
    window.setTimeout(() => setJustFilled(-1), 760);
  };

  const goBack = () => {
    if (phase !== 'idle') return;
    setPhase('exit');
    window.setTimeout(() => {
      setStep(0);
      setPhase('idle');
    }, 220);
  };

  const submit = async () => {
    if (!canAdvance || submitting) return;
    setSubmitting(true);
    setError('');

    const digits = form.phone.replace(/\D/g, '');

    try {
      await fetch(`${SUPABASE_URL}/functions/v1/sms-webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'website-service-callback',
          routing: 'elocal',
          phone: `+1${digits}`,
          customer_name: form.name.trim(),
          service: trade,
          vertical,
          timing: form.timing,
          zip_code: form.zip,
          issue: form.issue,
          description: form.description.trim(),
          consent: form.consent,
        }),
      });
      setJustFilled(1);
      setSubmitted(true);
    } catch {
      setError("We couldn't send that just now. Please call (630) 407-1727 or try again.");
    } finally {
      setSubmitting(false);
      window.setTimeout(() => setJustFilled(-1), 760);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step === 0) advance();
    if (step === 1) submit();
  };

  if (submitted) {
    return (
      <section className="lead-form-shell lead-form-success" aria-live="polite">
        <div className="success-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <div className="success-mark">
            <span className="material-symbols-outlined">done</span>
          </div>
        </div>
        <p className="form-eyebrow">Request sent</p>
        <h2 className="text-2xl font-bold text-slate-800 text-center">We are matching your {trade.toLowerCase()} request now.</h2>
        <p className="text-slate-500 text-center max-w-sm mx-auto">
          A verified pro can call you at {form.phone}. Keep your phone nearby and we will help bridge the next step.
        </p>
        <div className="success-next-steps">
          <span><b>1</b> We review {form.zip}</span>
          <span><b>2</b> We shortlist pros</span>
          <span><b>3</b> You get the call</span>
        </div>
      </section>
    );
  }

  return (
    <section className="lead-form-shell">
      <div className="lead-form-header">
        <p className="form-eyebrow">Free homeowner match</p>
        <h2 className="text-2xl font-bold text-slate-800 text-center">Get a Call from a Verified {trade} Pro</h2>
        <p className="text-slate-500 text-center">Two quick steps. No account, no obligation.</p>
        {urgency && (
          <p className="urgency-pill">
            <span className="material-symbols-outlined">priority_high</span>
            {urgency}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="lead-form-card">
        <div className="stage-label-row">
          <span>Step {step + 1} of {steps.length}</span>
          <b>{steps[step]}</b>
        </div>
        <div className="stage-bars" aria-hidden="true">
          {steps.map((item, index) => (
            <span
              key={item}
              className={`${index < step ? 'done' : ''} ${index === step ? 'active' : ''} ${index === justFilled ? 'just-filled' : ''}`}
            />
          ))}
        </div>

        {captured && (
          <div className="captured-chip">
            <span className="material-symbols-outlined">check</span>
            {captured}
          </div>
        )}

        <div key={step} className={`lead-step ${phase === 'exit' ? 'lead-step-exit' : ''}`}>
          {step === 0 && (
            <>
              <div className="field-block">
                <label>What do you need help with?</label>
                <div className="issue-grid">
                  {issueOptions.map((issue) => (
                    <button
                      key={issue}
                      type="button"
                      onClick={() => setField('issue', issue)}
                      className={`choice-chip ${form.issue === issue ? 'selected' : ''}`}
                    >
                      <span className="choice-dot" />
                      {issue}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field-block">
                <label>How soon should someone call?</label>
                <div className="timing-grid">
                  {timingOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setField('timing', option.value)}
                      className={`timing-card ${form.timing === option.value ? 'selected' : ''}`}
                    >
                      <span className="material-symbols-outlined">{option.icon}</span>
                      <b>{option.label}</b>
                      <small>{option.helper}</small>
                    </button>
                  ))}
                </div>
              </div>

              <div className="field-block">
                <label htmlFor="zip_code">ZIP code</label>
                <input
                  id="zip_code"
                  name="zip_code"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="60515"
                  maxLength={5}
                  pattern="[0-9]{5}"
                  value={form.zip}
                  onChange={(event) => setField('zip', event.target.value.replace(/\D/g, '').slice(0, 5))}
                  className="lead-input tabular-nums"
                  required
                />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="summary-strip">
                <span className="material-symbols-outlined">home_repair_service</span>
                <div>
                  <b>{stageSummary(form, trade)}</b>
                  <small>{timingOptions.find((option) => option.value === form.timing)?.label || 'Today'} call requested</small>
                </div>
              </div>

              <div className="field-row">
                <div className="field-block">
                  <label htmlFor="customer_name">Your name</label>
                  <input
                    id="customer_name"
                    name="customer_name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Smith"
                    value={form.name}
                    onChange={(event) => setField('name', event.target.value)}
                    className="lead-input"
                    required
                  />
                </div>
                <div className="field-block">
                  <label htmlFor="phone_number">Phone number</label>
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    autoComplete="tel"
                    placeholder="(630) 555-0100"
                    value={form.phone}
                    onChange={(event) => setField('phone', formatPhone(event.target.value))}
                    className="lead-input tabular-nums"
                    required
                  />
                </div>
              </div>

              <div className="field-block">
                <label htmlFor="issue_description">Anything the pro should know?</label>
                <textarea
                  id="issue_description"
                  name="issue_description"
                  rows={3}
                  placeholder="Example: water under the sink, shutoff valve is off, available after 3pm..."
                  value={form.description}
                  onChange={(event) => setField('description', event.target.value)}
                  className="lead-input resize-none"
                />
              </div>

              <label className="consent-check">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(event) => setField('consent', event.target.checked)}
                />
                <span>
                  I agree to be contacted by FindALocalPro and matched pros about this request by phone, text, or email. Message rates may apply.
                </span>
              </label>
            </>
          )}
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          {step > 0 && (
            <button type="button" className="form-back" onClick={goBack} disabled={phase !== 'idle' || submitting}>
              Back
            </button>
          )}
          <button
            type="submit"
            className={`form-submit ripple-btn ${submitting ? 'is-submitting' : ''}`}
            disabled={!canAdvance || phase !== 'idle' || submitting}
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined">progress_activity</span>
                Sending
              </>
            ) : step === 0 ? (
              <>
                Continue
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            ) : (
              <>
                Get My Call
                <span className="material-symbols-outlined">call</span>
              </>
            )}
          </button>
        </div>

        <div className="trust-row">
          <span><span className="material-symbols-outlined">lock</span> Private</span>
          <span><span className="material-symbols-outlined">verified_user</span> Verified pros</span>
          <span><span className="material-symbols-outlined">payments</span> Free</span>
        </div>
      </form>
    </section>
  );
}
