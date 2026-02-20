'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

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
  review_summary: string | null;
}

interface VerificationCheck {
  source: string;
  status: string;
  summary: string;
  data: Record<string, unknown>;
}

interface Review {
  business_id: string;
  rating: number;
  review_text: string;
  reviewer_name: string;
  source: string;
  review_date: string;
}

interface BusinessReviewStats {
  averageRating: number;
  totalReviews: number;
  topReview?: Review;
}

const tradeConfig: Record<string, { icon: string; color: string; bgColor: string; label: string }> = {
  plumbing: { icon: 'water_drop', color: 'text-blue-500', bgColor: 'bg-blue-100', label: 'Plumbing' },
  hvac: { icon: 'mode_fan', color: 'text-purple-500', bgColor: 'bg-purple-100', label: 'HVAC & Heating' },
  electrical: { icon: 'bolt', color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Electrical' },
  roofing: { icon: 'roofing', color: 'text-red-500', bgColor: 'bg-red-100', label: 'Roofing' },
  handyman: { icon: 'handyman', color: 'text-orange-600', bgColor: 'bg-orange-100', label: 'Handyman' },
  general: { icon: 'home_repair_service', color: 'text-slate-600', bgColor: 'bg-slate-100', label: 'General' },
};

function StarRating({ rating, size = 'base' }: { rating: number; size?: 'sm' | 'base' }) {
  const filled = Math.floor(rating);
  const hasHalf = rating - filled >= 0.25;
  const empty = 5 - filled - (hasHalf ? 1 : 0);

  const sizeClass = size === 'sm' ? 'text-sm' : 'text-base';
  const fillStyle = { fontVariationSettings: '"FILL" 1' };
  const emptyStyle = { fontVariationSettings: '"FILL" 0' };

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(filled)].map((_, i) => (
        <span key={`f-${i}`} className={`material-symbols-outlined ${sizeClass} text-yellow-400`} style={fillStyle}>star</span>
      ))}
      {hasHalf && (
        <span className={`material-symbols-outlined ${sizeClass} text-yellow-400`} style={fillStyle}>star_half</span>
      )}
      {[...Array(empty)].map((_, i) => (
        <span key={`e-${i}`} className={`material-symbols-outlined ${sizeClass} text-slate-200`} style={emptyStyle}>star</span>
      ))}
    </div>
  );
}

function ReviewSnippet({ stats }: { stats: BusinessReviewStats }) {
  const { averageRating, totalReviews } = stats;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <StarRating rating={averageRating} />
      <span className="text-sm font-bold text-slate-800">{averageRating.toFixed(1)}</span>
      <span className="text-sm text-slate-400">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
    </div>
  );
}

function TrustBadge({ score }: { score: number | null }) {
  if (!score) return null;
  const pct = Math.round(score);
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const ringColor = pct >= 70 ? '#2dd4bf' : pct >= 40 ? '#a855f7' : '#facc15';

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-10 h-10 shrink-0">
        <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
          <circle cx="20" cy="20" r={radius} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="3" />
          <circle
            cx="20" cy="20" r={radius} fill="none"
            stroke={ringColor} strokeWidth="3" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-black text-slate-800">{pct}</span>
        </div>
      </div>
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
        {pct >= 40 ? 'Verified' : 'Pending'}
      </span>
    </div>
  );
}

function CheckBadge({ check }: { check: VerificationCheck }) {
  const icons: Record<string, string> = { bbb: 'workspace_premium', buildzoom: 'construction', idfpr: 'badge', google: 'star' };
  const statusColors: Record<string, string> = { pass: 'text-brand-teal', warning: 'text-brand-yellow', not_found: 'text-slate-300', error: 'text-red-400' };
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={`material-symbols-outlined text-base ${statusColors[check.status] || 'text-slate-400'}`}>
        {check.status === 'pass' ? 'check_circle' : check.status === 'not_found' ? 'remove_circle_outline' : 'error_outline'}
      </span>
      <span className="material-symbols-outlined text-sm text-slate-400">{icons[check.source] || 'fact_check'}</span>
      <span className="text-slate-600 truncate">{check.summary}</span>
    </div>
  );
}

function AISummary({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-4 px-4 py-3 bg-brand-purple/5 rounded-xl border border-brand-purple/10 relative overflow-hidden">
      <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-5xl text-brand-purple/10 pointer-events-none" style={{ fontVariationSettings: '"FILL" 1' }}>auto_awesome</span>
      <div
        className="relative transition-all duration-500 ease-in-out"
        style={{ maxHeight: expanded ? '500px' : '3.6rem', overflow: 'hidden' }}
      >
        <p className="text-sm text-slate-600 leading-relaxed italic text-left">{text}</p>
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-12" style={{ background: 'linear-gradient(to top, #f5f0ff 20%, #f5f0ff80 60%, transparent)' }} />
        )}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs font-bold text-brand-purple hover:text-brand-pink mt-1 cursor-pointer relative"
      >
        {expanded ? 'Show less' : 'Read more'}
        <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>expand_more</span>
      </button>
    </div>
  );
}

function ProviderCard({ provider, checks, reviewStats }: { provider: Provider; checks: VerificationCheck[]; reviewStats?: BusinessReviewStats }) {
  const trade = tradeConfig[provider.trade] || tradeConfig.general;
  const [expanded, setExpanded] = useState(false);
  const passChecks = checks.filter(c => c.status === 'pass');
  const bbbCheck = checks.find(c => c.source === 'bbb' && c.status === 'pass');
  const bzCheck = checks.find(c => c.source === 'buildzoom' && c.status === 'pass');

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-lg hover:shadow-xl transition-all overflow-hidden group">
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${trade.bgColor} ${trade.color}`}>
              <span className="material-symbols-outlined text-2xl">{trade.icon}</span>
            </div>
            <div>
              <Link href={`/pro/${provider.slug}`} className="text-lg font-bold text-slate-800 leading-tight hover:text-brand-purple transition-colors">
                {provider.name}
              </Link>
              <p className="text-sm text-slate-400 font-medium">{trade.label}</p>
            </div>
          </div>
          <TrustBadge score={provider.trust_score} />
        </div>

        {reviewStats && (
          <Link href={`/pro/${provider.slug}#reviews`} className="block mb-3 hover:opacity-80 transition-opacity">
            <ReviewSnippet stats={reviewStats} />
          </Link>
        )}

        {provider.review_summary && <AISummary text={provider.review_summary} />}

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

      {checks.length > 0 && (
        <>
          <button onClick={() => setExpanded(!expanded)} className="w-full px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-slate-500 hover:text-brand-purple transition-colors cursor-pointer">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">fact_check</span>
              {passChecks.length} of {checks.length} checks passed
            </span>
            <span className={`material-symbols-outlined text-base transition-transform ${expanded ? 'rotate-180' : ''}`}>expand_more</span>
          </button>
          {expanded && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-2 animate-fade-in-up">
              {checks.map((c, i) => <CheckBadge key={i} check={c} />)}
            </div>
          )}
        </>
      )}

      <div className="px-6 py-4 border-t border-slate-100">
        <Link href={`/?service=${encodeURIComponent(trade.label)}`} className="w-full inline-flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-pink text-slate-900 hover:text-white px-6 py-3 rounded-2xl font-black transition-all shadow-md hover:shadow-lg cursor-pointer">
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

export function DirectoryClient({ providers, checksMap, reviewsMap }: { providers: Provider[]; checksMap: Record<string, VerificationCheck[]>; reviewsMap: Record<string, BusinessReviewStats> }) {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'score' | 'name'>('score');

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

      <main className="grow max-w-5xl mx-auto w-full px-6 py-12">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Directory' },
          ]}
        />
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-800 font-playful mb-4">
            Verified Local Pros
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Every pro is verified against state license databases, BBB ratings, and contractor registrations. Real data, not just reviews.
          </p>
          <div className="flex justify-center gap-6 mt-6">
            <div className="sparkle-badge"><span className="material-symbols-outlined text-sm text-brand-teal">verified</span>{verifiedCount} Verified Pros</div>
            <div className="sparkle-badge"><span className="material-symbols-outlined text-sm text-brand-purple">fact_check</span>Multi-Source Checks</div>
            <div className="sparkle-badge"><span className="material-symbols-outlined text-sm text-brand-pink">update</span>Updated Weekly</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {tradeFilters.map(tf => (
              <button key={tf.value} onClick={() => setFilter(tf.value)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${filter === tf.value ? 'bg-brand-purple text-white shadow-md' : 'bg-white text-slate-600 border-2 border-slate-100 hover:border-brand-purple'}`}>
                <span className="material-symbols-outlined text-base">{tf.icon}</span>{tf.label}
              </button>
            ))}
          </div>
          <button onClick={() => setSortBy(sortBy === 'score' ? 'name' : 'score')} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-white text-slate-500 border-2 border-slate-100 hover:border-brand-purple transition-all cursor-pointer">
            <span className="material-symbols-outlined text-base">sort</span>{sortBy === 'score' ? 'By Score' : 'A-Z'}
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">search_off</span>
            <p className="text-xl font-bold text-slate-400">No verified pros found for this trade yet.</p>
            <p className="text-slate-400 mt-2">We&apos;re adding new pros every week!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map(p => <ProviderCard key={p.id} provider={p} checks={checksMap[p.id] || []} reviewStats={reviewsMap[p.id]} />)}
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-3 font-playful">Are you a <span className="text-brand-pink">Pro</span>? 🔧</h2>
            <p className="text-slate-500 mb-6">Get verified and start receiving qualified leads from homeowners in your area.</p>
            <a href="tel:6307032607" className="inline-flex items-center gap-2 bg-brand-purple hover:bg-brand-pink text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg hover:shadow-xl cursor-pointer">
              <span className="material-symbols-outlined">call</span>Become a Verified Pro
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
