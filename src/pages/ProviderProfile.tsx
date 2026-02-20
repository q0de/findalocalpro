import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const SUPABASE_URL = 'https://hocipkeeikriqyojiboj.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvY2lwa2VlaWtyaXF5b2ppYm9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExOTE2NDYsImV4cCI6MjA4Njc2NzY0Nn0.4WmlnsXdcUfTC0znL04CC254HKnVwfHqnWLeplXtBwA';

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
      {/* Show key data points */}
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

export function ProviderProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [checks, setChecks] = useState<VerificationCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const headers = {
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${SUPABASE_ANON}`,
      };

      const provRes = await fetch(
        `${SUPABASE_URL}/rest/v1/businesses?slug=eq.${slug}&is_active=eq.true&select=*`,
        { headers }
      );
      const provData = await provRes.json();
      if (!provData.length) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const prov = provData[0];
      setProvider(prov);

      // Fetch checks — get latest per source
      const checksRes = await fetch(
        `${SUPABASE_URL}/rest/v1/verification_checks?business_id=eq.${prov.id}&select=source,status,summary,data,checked_at&order=checked_at.desc`,
        { headers }
      );
      const checksData = await checksRes.json();
      // Dedupe: keep only latest check per source
      const seen = new Set<string>();
      const deduped: VerificationCheck[] = [];
      for (const c of checksData) {
        if (!seen.has(c.source)) {
          seen.add(c.source);
          deduped.push(c);
        }
      }
      setChecks(deduped);
      setLoading(false);
    }
    fetchData();
  }, [slug]);

  // SEO: dynamic page title and meta
  useEffect(() => {
    if (provider) {
      const t = tradeConfig[provider.trade] || tradeConfig.plumbing;
      document.title = `${provider.name} — Verified ${t.label} Pro | FindALocalPro`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', `${provider.name} — Trust Score ${Math.round(provider.trust_score || 0)}/100. Verified ${t.label.toLowerCase()} professional in DuPage County, IL. License, BBB rating, and contractor score checked.`);
      }
    }
  }, [provider]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
        <Header step={0} totalSteps={0} />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-3 h-3 bg-brand-purple rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-brand-pink rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="ml-2 font-bold">Loading provider...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !provider) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
        <Header step={0} totalSteps={0} />
        <div className="flex-grow flex flex-col items-center justify-center text-center px-6">
          <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">search_off</span>
          <h1 className="text-2xl font-bold text-slate-400 mb-2">Provider Not Found</h1>
          <p className="text-slate-400 mb-6">This provider doesn't exist or is no longer active.</p>
          <Link to="/directory" className="inline-flex items-center gap-2 bg-brand-purple text-white px-6 py-3 rounded-2xl font-black">
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Directory
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const trade = tradeConfig[provider.trade] || tradeConfig.plumbing;
  const passedChecks = checks.filter(c => c.status === 'pass').length;
  const verifiedAt = provider.last_verified_at ? new Date(provider.last_verified_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null;

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: provider.name,
    url: provider.website_url || `https://findalocalpro.com/pro/${provider.slug}`,
    telephone: provider.phone,
    address: provider.address ? {
      '@type': 'PostalAddress',
      streetAddress: provider.address,
      addressLocality: provider.address?.split(',')[1]?.trim(),
      addressRegion: 'IL',
      postalCode: provider.zip,
    } : undefined,
    foundingDate: provider.year_established ? String(provider.year_established) : undefined,
    additionalType: `https://schema.org/${provider.trade === 'plumbing' ? 'Plumber' : provider.trade === 'electrical' ? 'Electrician' : 'HomeAndConstructionBusiness'}`,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header step={0} totalSteps={0} />

      {/* JSON-LD for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link to="/directory" className="hover:text-brand-purple font-medium">Directory</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link to={`/directory?trade=${provider.trade}`} className="hover:text-brand-purple font-medium capitalize">{trade.label}</Link>
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

                {/* Quick badges */}
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

                {/* Contact */}
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
              <Link
                to={`/?service=${encodeURIComponent(trade.label)}`}
                className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-pink text-slate-900 hover:text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg hover:shadow-xl"
              >
                Get a Free Quote
                <span className="material-symbols-outlined font-black">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column: Verification */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-purple">verified</span>
              Verification Details
            </h2>

            {checks.length > 0 ? (
              <div className="space-y-4">
                {checks.map((c, i) => (
                  <CheckCard key={i} check={c} />
                ))}
              </div>
            ) : (
              <p className="text-slate-400">No verification checks on file yet.</p>
            )}

            {/* Services */}
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

          {/* Right column: Trust Score + CTA */}
          <div className="space-y-6">
            <TrustMeter score={provider.trust_score || 0} />

            {/* What this means */}
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
                    <span><strong>BBB Rating</strong> — What's their complaint history?</span>
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
              <p className="text-sm text-purple-200 mb-4">Get connected with verified pros in 60 seconds.</p>
              <Link
                to={`/?service=${encodeURIComponent(trade.label)}`}
                className="inline-flex items-center gap-2 bg-brand-yellow text-slate-900 px-6 py-3 rounded-2xl font-black hover:shadow-lg transition-all"
              >
                <span className="material-symbols-outlined">chat</span>
                Start Chat
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
