'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SUPABASE_URL, DIRECT_CONTACT_ENABLED } from '@/lib/supabase';

interface Provider {
  id: string;
  name: string;
  slug: string;
  trade: string;
  phone: string | null;
  email: string | null;
  website_url: string | null;
  address: string | null;
  zip: string | null;
  description: string | null;
  trust_score: number | null;
  verification_status: string;
  is_verified: boolean;
  year_established: number | null;
  last_verified_at: string | null;
  service_area: string[] | null;
}

interface VerificationCheck {
  source: string;
  status: string;
  summary: string;
  data: Record<string, unknown>;
  checked_at: string;
}

const tradeConfig: Record<string, { icon: string; color: string; bgColor: string; label: string; services: string[] }> = {
  plumbing: {
    icon: 'water_drop', color: 'text-blue-500', bgColor: 'bg-blue-50', label: 'Plumbing',
    services: ['Leak Repair', 'Drain Cleaning', 'Water Heater Service', 'Pipe Repair', 'Fixture Installation', 'Emergency Plumbing'],
  },
  hvac: {
    icon: 'mode_fan', color: 'text-purple-500', bgColor: 'bg-purple-50', label: 'HVAC & Heating',
    services: ['AC Repair', 'Furnace Service', 'System Installation', 'Duct Cleaning', 'Heat Pump Service', 'Thermostat Installation'],
  },
  electrical: {
    icon: 'bolt', color: 'text-yellow-600', bgColor: 'bg-yellow-50', label: 'Electrical',
    services: ['Wiring & Rewiring', 'Panel Upgrades', 'Outlet Installation', 'Lighting', 'EV Charger Installation', 'Emergency Electrical'],
  },
  roofing: {
    icon: 'roofing', color: 'text-red-500', bgColor: 'bg-red-50', label: 'Roofing',
    services: ['Roof Repair', 'Roof Replacement', 'Shingle Repair', 'Gutter Installation', 'Storm Damage', 'Roof Inspection'],
  },
};

const sourceInfo: Record<string, { label: string; icon: string; description: string }> = {
  idfpr: { label: 'IL State License (IDFPR)', icon: 'badge', description: 'Illinois Dept. of Financial & Professional Regulation' },
  sos: { label: 'IL Secretary of State', icon: 'account_balance', description: 'Business registration status' },
  bbb: { label: 'Better Business Bureau', icon: 'workspace_premium', description: 'Rating & complaint history' },
  buildzoom: { label: 'BuildZoom', icon: 'construction', description: 'License verification & contractor score' },
  coi: { label: 'Insurance (COI)', icon: 'verified_user', description: 'Certificate of Insurance on file' },
};

function TrustMeter({ score }: { score: number }) {
  const pct = Math.round(score);
  let color = 'bg-slate-300';
  let label = 'Pending';
  if (pct >= 70) { color = 'bg-brand-teal'; label = 'Verified'; }
  else if (pct >= 40) { color = 'bg-brand-purple'; label = 'Verified'; }
  else if (pct > 0) { color = 'bg-brand-yellow'; label = 'Pending'; }

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Trust Score</h3>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${pct >= 40 ? 'bg-brand-teal text-white' : 'bg-slate-200 text-slate-600'}`}>
          {pct >= 40 && <span className="material-symbols-outlined text-sm">verified</span>}
          {label}
        </span>
      </div>
      <div className="flex items-end gap-3 mb-3">
        <span className="text-5xl font-black text-slate-800">{pct}</span>
        <span className="text-xl text-slate-400 font-bold mb-1">/100</span>
      </div>
      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-slate-400 mt-3">Based on state license, BBB, contractor registrations & business records</p>
    </div>
  );
}

function CheckCard({ check }: { check: VerificationCheck }) {
  const info = sourceInfo[check.source] || { label: check.source, icon: 'fact_check', description: '' };
  const statusConfig: Record<string, { color: string; bg: string; icon: string; text: string }> = {
    pass: { color: 'text-brand-teal', bg: 'bg-green-50', icon: 'check_circle', text: 'Passed' },
    fail: { color: 'text-red-500', bg: 'bg-red-50', icon: 'cancel', text: 'Failed' },
    warning: { color: 'text-amber-500', bg: 'bg-amber-50', icon: 'warning', text: 'Warning' },
    not_found: { color: 'text-slate-400', bg: 'bg-slate-50', icon: 'remove_circle_outline', text: 'Not Found' },
    error: { color: 'text-red-400', bg: 'bg-red-50', icon: 'error_outline', text: 'Error' },
  };
  const sc = statusConfig[check.status] || statusConfig.error;
  const data = check.data || {};

  return (
    <div className={`rounded-2xl border-2 border-slate-100 p-5 ${sc.bg}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className={`material-symbols-outlined text-2xl ${sc.color}`}>{info.icon}</span>
          <div>
            <h4 className="font-bold text-slate-800">{info.label}</h4>
            <p className="text-xs text-slate-400">{info.description}</p>
          </div>
        </div>
        <span className={`flex items-center gap-1 text-sm font-bold ${sc.color}`}>
          <span className="material-symbols-outlined text-base">{sc.icon}</span>
          {sc.text}
        </span>
      </div>
      <p className="text-sm text-slate-600 mt-2">{check.summary}</p>
      {(() => {
        const d = data as Record<string, unknown>;
        const badges: string[] = [];
        if (d.rating) badges.push(`Rating: ${String(d.rating)}`);
        if (d.bz_score) badges.push(`Score: ${String(d.bz_score)}`);
        if (d.accredited) badges.push('✓ Accredited');
        if (d.license_active) badges.push('✓ License Active');
        if (d.primary_license) badges.push(String(d.primary_license));
        if (d.rank_percentile) badges.push(`Top ${String(d.rank_percentile)}%`);
        return badges.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-3">
            {badges.map((b, i) => <span key={i} className="sparkle-badge text-xs">{b}</span>)}
          </div>
        ) : null;
      })()}
    </div>
  );
}

function DirectContactCTA({ provider, trade }: { provider: Provider; trade: typeof tradeConfig[string] }) {
  const [showForm, setShowForm] = useState(false);
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10 || !consent) return;
    setSubmitting(true);
    try {
      await fetch(`${SUPABASE_URL}/functions/v1/sms-webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'website-direct',
          routing: 'direct',
          provider_id: provider.id,
          provider_name: provider.name,
          phone: `+1${digits}`,
          service: trade.label,
        }),
      });
    } catch { /* silent */ }
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 text-center">
        <span className="material-symbols-outlined text-3xl text-brand-teal mb-2">check_circle</span>
        <p className="font-bold text-slate-800">Request sent!</p>
        <p className="text-sm text-slate-500 mt-1">{provider.name} will call you shortly.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {provider.phone && (
        <a href={`tel:${provider.phone}`} className="inline-flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal/90 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg hover:shadow-xl">
          <span className="material-symbols-outlined">call</span>
          Call Now
        </a>
      )}
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="inline-flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-pink text-slate-900 hover:text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg hover:shadow-xl cursor-pointer">
          <span className="material-symbols-outlined">phone_callback</span>
          Request a Call
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-slate-100 rounded-2xl p-5 shadow-lg space-y-3">
          <p className="text-sm font-bold text-slate-700">Get a call from {provider.name}</p>
          <input className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all placeholder:text-slate-300" placeholder="(555) 123-4567" type="tel" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} autoFocus />
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 w-4 h-4 rounded border-2 border-slate-300 text-brand-purple focus:ring-brand-purple/20 cursor-pointer flex-shrink-0" />
            <span className="text-xs text-slate-500 leading-relaxed">
              I agree to receive calls/texts from FindALocalPro about my service request. Message and data rates may apply. Reply STOP to opt out.{' '}
              <Link href="/privacy" className="text-brand-purple hover:underline">Privacy Policy</Link> ·{' '}
              <Link href="/terms" className="text-brand-purple hover:underline">Terms</Link>
            </span>
          </label>
          <button type="submit" disabled={submitting || phone.replace(/\D/g, '').length < 10 || !consent} className="w-full bg-brand-yellow hover:bg-brand-pink text-slate-900 hover:text-white py-3 rounded-xl font-black transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
            {submitting ? 'Sending...' : 'Request Call'}
          </button>
        </form>
      )}
    </div>
  );
}

export function ProviderProfileClient({ provider, checks, tradeLabel }: { provider: Provider; checks: VerificationCheck[]; tradeLabel: string }) {
  const trade = tradeConfig[provider.trade] || tradeConfig.plumbing;
  const passedChecks = checks.filter(c => c.status === 'pass').length;
  const verifiedAt = provider.last_verified_at ? new Date(provider.last_verified_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header step={0} totalSteps={0} />

      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link href="/directory" className="hover:text-brand-purple font-medium">Directory</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link href={`/directory?trade=${provider.trade}`} className="hover:text-brand-purple font-medium capitalize">{trade.label}</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-600 font-bold">{provider.name}</span>
        </nav>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-xl p-8 mb-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${trade.bgColor} ${trade.color} shrink-0`}>
                <span className="material-symbols-outlined text-3xl">{trade.icon}</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">{provider.name}</h1>
                <p className="text-slate-400 font-medium mb-3">{trade.label} · DuPage County, IL</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {provider.year_established && (
                    <span className="sparkle-badge">
                      <span className="material-symbols-outlined text-sm text-brand-purple">calendar_month</span>
                      Est. {provider.year_established}
                    </span>
                  )}
                  {passedChecks > 0 && (
                    <span className="sparkle-badge">
                      <span className="material-symbols-outlined text-sm text-brand-teal">fact_check</span>
                      {passedChecks} checks passed
                    </span>
                  )}
                  {verifiedAt && (
                    <span className="sparkle-badge">
                      <span className="material-symbols-outlined text-sm text-brand-pink">update</span>
                      Verified {verifiedAt}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-4">
                  {provider.phone && (
                    <a href={`tel:${provider.phone}`} className="flex items-center gap-2 text-brand-purple font-bold hover:underline">
                      <span className="material-symbols-outlined">call</span>
                      {provider.phone}
                    </a>
                  )}
                  {provider.website_url && (
                    <a href={provider.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-500 hover:text-brand-purple font-medium">
                      <span className="material-symbols-outlined">language</span>
                      Website
                    </a>
                  )}
                </div>
                {provider.address && (
                  <p className="flex items-center gap-2 text-sm text-slate-400 mt-2">
                    <span className="material-symbols-outlined text-base">pin_drop</span>
                    {provider.address}
                  </p>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="md:text-right shrink-0">
              {DIRECT_CONTACT_ENABLED ? (
                <DirectContactCTA provider={provider} trade={trade} />
              ) : (
                <Link href={`/?service=${encodeURIComponent(trade.label)}`} className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-pink text-slate-900 hover:text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg hover:shadow-xl">
                  Get a Free Quote
                  <span className="material-symbols-outlined font-black">arrow_forward</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-purple">verified</span>
              Verification Details
            </h2>

            {checks.length > 0 ? (
              <div className="space-y-4">
                {checks.map((c, i) => <CheckCard key={i} check={c} />)}
              </div>
            ) : (
              <p className="text-slate-400">No verification checks on file yet.</p>
            )}

            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-brand-teal">checklist</span>
                Common {trade.label} Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trade.services.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                    <span className="material-symbols-outlined text-brand-teal text-base">check</span>
                    <span className="text-sm font-medium text-slate-600">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <TrustMeter score={provider.trust_score || 0} />

            <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-lg p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-pink">info</span>
                What This Means
              </h3>
              <div className="space-y-3 text-sm text-slate-600">
                <p>Our Trust Score is based on <strong>public records</strong>, not paid placements or reviews alone.</p>
                <p>We check:</p>
                <ul className="space-y-2 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-brand-teal text-base mt-0.5">badge</span>
                    <span><strong>State License</strong> — Is their IL license active?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-brand-teal text-base mt-0.5">account_balance</span>
                    <span><strong>Business Registration</strong> — Are they registered with the state?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-brand-teal text-base mt-0.5">workspace_premium</span>
                    <span><strong>BBB Rating</strong> — What&apos;s their complaint history?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-brand-teal text-base mt-0.5">construction</span>
                    <span><strong>Contractor Score</strong> — How do they rank among licensed contractors?</span>
                  </li>
                </ul>
                <p className="text-xs text-slate-400 mt-3">Scores update weekly. Data sourced from IDFPR, IL SOS, BBB, and BuildZoom.</p>
              </div>
            </div>

            {/* Secondary CTA */}
            <div className="bg-brand-purple rounded-3xl p-6 text-white text-center">
              <h3 className="text-lg font-bold mb-2">Need a {trade.label.toLowerCase().replace(' & heating', '')} quote?</h3>
              <p className="text-sm text-purple-200 mb-4">
                {DIRECT_CONTACT_ENABLED ? `Contact ${provider.name} directly or browse more pros.` : 'Get connected with verified pros in 60 seconds.'}
              </p>
              {DIRECT_CONTACT_ENABLED && provider.phone ? (
                <a href={`tel:${provider.phone}`} className="inline-flex items-center gap-2 bg-brand-yellow text-slate-900 px-6 py-3 rounded-2xl font-black hover:shadow-lg transition-all">
                  <span className="material-symbols-outlined">call</span>
                  Call {provider.name}
                </a>
              ) : (
                <Link href={`/?service=${encodeURIComponent(trade.label)}`} className="inline-flex items-center gap-2 bg-brand-yellow text-slate-900 px-6 py-3 rounded-2xl font-black hover:shadow-lg transition-all">
                  <span className="material-symbols-outlined">chat</span>
                  Start Chat
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
