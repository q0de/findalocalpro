'use client';

import { FormEvent, useState } from 'react';

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

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function PartnerApplicationForm() {
  const [form, setForm] = useState<PartnerForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const setField = <K extends keyof PartnerForm>(key: K, value: PartnerForm[K]) => {
    setError('');
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch {
      setError('That did not send cleanly. Please try again or email hello@findalocalpro.com.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="partner-form-shell partner-form-success" aria-live="polite">
        <div className="partner-success-mark">✓</div>
        <p className="form-eyebrow">Application received</p>
        <h2>Thanks — we're checking availability in your territory now.</h2>
        <p>You'll hear from us within one business day. No payment is due until you're approved.</p>
      </section>
    );
  }

  return (
    <section className="partner-form-shell">
      <form className="partner-application-card" onSubmit={handleSubmit}>
        <div className="partner-field-grid">
          <label className="field-block">
            <span>Business name</span>
            <input className="lead-input" value={form.businessName} onChange={(event) => setField('businessName', event.target.value)} required />
          </label>
          <label className="field-block">
            <span>Contact name</span>
            <input className="lead-input" value={form.contactName} onChange={(event) => setField('contactName', event.target.value)} autoComplete="name" required />
          </label>
        </div>

        <div className="partner-field-grid">
          <label className="field-block">
            <span>Email</span>
            <input className="lead-input" type="email" value={form.email} onChange={(event) => setField('email', event.target.value)} autoComplete="email" required />
          </label>
          <label className="field-block">
            <span>Phone</span>
            <input className="lead-input" type="tel" value={form.phone} onChange={(event) => setField('phone', formatPhone(event.target.value))} autoComplete="tel" required />
          </label>
        </div>

        <label className="field-block">
          <span>Website</span>
          <input className="lead-input" type="url" value={form.website} onChange={(event) => setField('website', event.target.value)} />
        </label>

        <label className="field-block">
          <span>Service category</span>
          <select className="lead-input" value={form.category} onChange={(event) => setField('category', event.target.value)} required>
            <option value="">Select a trade...</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>

        <div className="partner-field-grid">
          <label className="field-block">
            <span>Primary service areas / ZIPs</span>
            <input className="lead-input" value={form.serviceAreas} onChange={(event) => setField('serviceAreas', event.target.value)} required />
          </label>
          <label className="field-block">
            <span>Preferred territory</span>
            <input className="lead-input" value={form.preferredTerritory} onChange={(event) => setField('preferredTerritory', event.target.value)} />
          </label>
        </div>

        <div className="partner-field-grid">
          <label className="field-block">
            <span>Years in business</span>
            <input className="lead-input" inputMode="numeric" value={form.yearsInBusiness} onChange={(event) => setField('yearsInBusiness', event.target.value.replace(/[^\d+]/g, '').slice(0, 4))} />
          </label>
          <label className="field-block">
            <span>Google Business Profile URL</span>
            <input className="lead-input" type="url" value={form.googleProfile} onChange={(event) => setField('googleProfile', event.target.value)} />
          </label>
        </div>

        <label className="field-block">
          <span>Notes / specialties</span>
          <textarea className="lead-input" rows={4} value={form.notes} onChange={(event) => setField('notes', event.target.value)} />
        </label>

        <label className="consent-check">
          <input type="checkbox" checked={form.confirmed} onChange={(event) => setField('confirmed', event.target.checked)} required />
          <span>I confirm my business is licensed and insured where required for my trade and territory.</span>
        </label>

        {error && <p className="form-error">{error}</p>}

        <button className={`form-submit partner-submit ${submitting ? 'is-submitting' : ''}`} disabled={submitting}>
          {submitting ? 'Sending...' : 'Apply for a Founding Partner Spot'}
        </button>

        <p className="partner-form-note">No payment due today. By applying you agree to be contacted about availability in your territory.</p>
      </form>
    </section>
  );
}
