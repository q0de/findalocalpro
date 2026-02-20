import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  website_url: string | null;
  address: string | null;
  zip: string | null;
  trust_score: number | null;
  verification_status: string;
  is_verified: boolean;
  year_established: number | null;
}

interface VerificationCheck {
  source: string;
  status: string;
  summary: string;
  data: Record<string, unknown>;
}

const tradeConfig: Record<string, { icon: string; color: string; bgColor: string; label: string }> = {
  plumbing: { icon: 'water_drop', color: 'text-blue-500', bgColor: 'bg-blue-100', label: 'Plumbing' },
  hvac: { icon: 'mode_fan', color: 'text-purple-500', bgColor: 'bg-purple-100', label: 'HVAC & Heating' },
  electrical: { icon: 'bolt', color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Electrical' },
  roofing: { icon: 'roofing', color: 'text-red-500', bgColor: 'bg-red-100', label: 'Roofing' },
  handyman: { icon: 'handyman', color: 'text-orange-600', bgColor: 'bg-orange-100', label: 'Handyman' },
  general: { icon: 'home_repair_service', color: 'text-slate-600', bgColor: 'bg-slate-100', label: 'General' },
};

function TrustBadge({ score }: { score: number | null }) {
  if (!score) return null;
  const pct = Math.round(score);
  let color = 'bg-slate-200 text-slate-600';
  let label = 'Pending';
  if (pct >= 70) { color = 'bg-brand-teal text-white'; label = 'Verified'; }
  else if (pct >= 40) { color = 'bg-brand-purple text-white'; label = 'Verified'; }
  else if (pct > 0) { color = 'bg-brand-yellow text-slate-900'; label = 'Pending'; }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${color}`}>
      {pct >= 40 && <span className="material-symbols-outlined text-sm">verified</span>}
      {label} · {pct}
    </span>
  );
}

function CheckBadge({ check }: { check: VerificationCheck }) {
  const icons: Record<string, string> = {
    bbb: 'workspace_premium',
    buildzoom: 'construction',
    idfpr: 'badge',
    google: 'star',
  };
  const statusColors: Record<string, string> = {
    pass: 'text-brand-teal',
    warning: 'text-brand-yellow',
    not_found: 'text-slate-300',
    error: 'text-red-400',
  };
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={`material-symbols-outlined text-base ${statusColors[check.status] || 'text-slate-400'}`}>
        {check.status === 'pass' ? 'check_circle' : check.status === 'not_found' ? 'remove_circle_outline' : 'error_outline'}
      </span>
      <span className={`material-symbols-outlined text-sm text-slate-400`}>{icons[check.source] || 'fact_check'}</span>
      <span className="text-slate-600 truncate">{check.summary}</span>
    </div>
  );
}

function ProviderCard({ provider, checks }: { provider: Provider; checks: VerificationCheck[] }) {
  const trade = tradeConfig[provider.trade] || tradeConfig.general;
  const [expanded, setExpanded] = useState(false);
  const passChecks = checks.filter(c => c.status === 'pass');
  const bbbCheck = checks.find(c => c.source === 'bbb' && c.status === 'pass');
  const bzCheck = checks.find(c => c.source === 'buildzoom' && c.status === 'pass');

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-lg hover:shadow-xl transition-all overflow-hidden group">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${trade.bgColor} ${trade.color}`}>
              <span className="material-symbols-outlined text-2xl">{trade.icon}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 leading-tight">{provider.name}</h3>
              <p className="text-sm text-slate-400 font-medium">{trade.label}</p>
            </div>
          </div>
          <TrustBadge score={provider.trust_score} />
        </div>

        {/* Quick info */}
        <div className="flex flex-wrap gap-3 mb-4">
          {bbbCheck && (
            <div className="sparkle-badge">
              <span className="material-symbols-outlined text-sm text-brand-pink">workspace_premium</span>
              BBB {(bbbCheck.data as Record<string, string>)?.rating || 'Accredited'}
            </div>
          )}
          {bzCheck && (
            <div className="sparkle-badge">
              <span className="material-symbols-outlined text-sm text-brand-teal">construction</span>
              BZ Score: {(bzCheck.data as Record<string, number>)?.bz_score || '—'}
            </div>
          )}
          {provider.year_established && (
            <div className="sparkle-badge">
              <span className="material-symbols-outlined text-sm text-brand-purple">calendar_month</span>
              Est. {provider.year_established}
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="flex flex-wrap gap-4 text-sm">
          {provider.phone && (
            <a href={`tel:${provider.phone}`} className="flex items-center gap-1.5 text-brand-purple font-bold hover:underline">
              <span className="material-symbols-outlined text-base">call</span>
              {provider.phone}
            </a>
          )}
          {provider.website_url && (
            <a href={provider.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-slate-500 hover:text-brand-purple font-medium">
              <span className="material-symbols-outlined text-base">language</span>
              Website
            </a>
          )}
          {provider.address && (
            <span className="flex items-center gap-1.5 text-slate-400 font-medium">
              <span className="material-symbols-outlined text-base">pin_drop</span>
              {provider.address}
            </span>
          )}
        </div>
      </div>

      {/* Expandable verification details */}
      {checks.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-slate-500 hover:text-brand-purple transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">fact_check</span>
              {passChecks.length} of {checks.length} checks passed
            </span>
            <span className={`material-symbols-outlined text-base transition-transform ${expanded ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>
          {expanded && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-2 animate-fade-in-up">
              {checks.map((c, i) => (
                <CheckBadge key={i} check={c} />
              ))}
            </div>
          )}
        </>
      )}

      {/* CTA */}
      <div className="px-6 py-4 border-t border-slate-100">
        <Link
          to={`/?service=${encodeURIComponent(trade.label)}`}
          className="w-full inline-flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-pink text-slate-900 hover:text-white px-6 py-3 rounded-2xl font-black transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          Get a Free Quote
          <span className="material-symbols-outlined font-black">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}

const tradeFilters = [
  { value: 'all', label: 'All Trades', icon: 'apps' },
  { value: 'plumbing', label: 'Plumbing', icon: 'water_drop' },
  { value: 'hvac', label: 'HVAC', icon: 'mode_fan' },
  { value: 'electrical', label: 'Electrical', icon: 'bolt' },
  { value: 'roofing', label: 'Roofing', icon: 'roofing' },
];

export function Directory() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [checks, setChecks] = useState<Record<string, VerificationCheck[]>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'score' | 'name'>('score');

  useEffect(() => {
    async function fetchData() {
      try {
        const headers = {
          apikey: SUPABASE_ANON,
          Authorization: `Bearer ${SUPABASE_ANON}`,
        };

        // Fetch verified providers (score > 0, active)
        const provRes = await fetch(
          `${SUPABASE_URL}/rest/v1/businesses?is_active=eq.true&trust_score=gt.0&select=id,name,slug,trade,phone,website_url,address,zip,trust_score,verification_status,is_verified,year_established&order=trust_score.desc`,
          { headers }
        );
        const provData: Provider[] = await provRes.json();
        setProviders(provData);

        // Fetch all verification checks for these providers
        if (provData.length > 0) {
          const ids = provData.map(p => p.id);
          const checksRes = await fetch(
            `${SUPABASE_URL}/rest/v1/verification_checks?business_id=in.(${ids.join(',')})&select=business_id,source,status,summary,data&order=checked_at.desc`,
            { headers }
          );
          const checksData = await checksRes.json();

          // Group by business_id
          const grouped: Record<string, VerificationCheck[]> = {};
          for (const c of checksData) {
            const bid = c.business_id;
            if (!grouped[bid]) grouped[bid] = [];
            grouped[bid].push(c);
          }
          setChecks(grouped);
        }
      } catch (err) {
        console.error('Failed to load directory:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtered = providers
    .filter(p => filter === 'all' || p.trade === filter)
    .sort((a, b) => {
      if (sortBy === 'score') return (b.trust_score || 0) - (a.trust_score || 0);
      return a.name.localeCompare(b.name);
    });

  const verifiedCount = filtered.filter(p => p.is_verified).length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header step={0} totalSteps={0} />

      <main className="flex-grow max-w-5xl mx-auto w-full px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-800 font-playful mb-4">
            Verified <span className="text-brand-purple">Local</span> Pros
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Every pro is verified against state license databases, BBB ratings, and contractor registrations.
            Real data, not just reviews.
          </p>
          <div className="flex justify-center gap-6 mt-6">
            <div className="sparkle-badge">
              <span className="material-symbols-outlined text-sm text-brand-teal">verified</span>
              {verifiedCount} Verified Pros
            </div>
            <div className="sparkle-badge">
              <span className="material-symbols-outlined text-sm text-brand-purple">fact_check</span>
              Multi-Source Checks
            </div>
            <div className="sparkle-badge">
              <span className="material-symbols-outlined text-sm text-brand-pink">update</span>
              Updated Weekly
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {tradeFilters.map(tf => (
              <button
                key={tf.value}
                onClick={() => setFilter(tf.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${
                  filter === tf.value
                    ? 'bg-brand-purple text-white shadow-md'
                    : 'bg-white text-slate-600 border-2 border-slate-100 hover:border-brand-purple'
                }`}
              >
                <span className="material-symbols-outlined text-base">{tf.icon}</span>
                {tf.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSortBy(sortBy === 'score' ? 'name' : 'score')}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-white text-slate-500 border-2 border-slate-100 hover:border-brand-purple transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">sort</span>
            {sortBy === 'score' ? 'By Score' : 'A-Z'}
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-3 h-3 bg-brand-purple rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-brand-pink rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-3 h-3 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="ml-2 font-bold">Loading verified pros...</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">search_off</span>
            <p className="text-xl font-bold text-slate-400">No verified pros found for this trade yet.</p>
            <p className="text-slate-400 mt-2">We're adding new pros every week!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map(p => (
              <ProviderCard key={p.id} provider={p} checks={checks[p.id] || []} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-3 font-playful">
              Are you a <span className="text-brand-pink">Pro</span>? 🔧
            </h2>
            <p className="text-slate-500 mb-6">
              Get verified and start receiving qualified leads from homeowners in your area.
            </p>
            <a
              href="tel:6307032607"
              className="inline-flex items-center gap-2 bg-brand-purple hover:bg-brand-pink text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              <span className="material-symbols-outlined">call</span>
              Become a Verified Pro
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
