import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import fs from 'node:fs/promises';
import path from 'node:path';
import { InteractiveCharts } from './InteractiveCharts';
import { SUPABASE_ANON, SUPABASE_URL } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type DemandEvent = {
  logged_at?: string;
  observed_at?: string;
  created_at?: string;
  platform?: string;
  source_account?: string;
  market?: string;
  state?: string;
  vertical?: string;
  subcategory?: string;
  action_taken?: string;
  replied?: boolean;
  score?: number | string;
  skip_reason?: string;
};

type ELocalLead = {
  created_at?: string;
  source?: string;
  service_category?: string;
  call_status?: string;
  bid_price?: number | string;
  billable_duration?: number | string;
  call_duration?: number | string;
  billable?: boolean;
  paid?: boolean;
  zip_code?: string;
};

type DashboardData = {
  demand: DemandEvent[];
  leads: ELocalLead[];
  errors: string[];
  usingServiceKey: boolean;
};

type ScanRun = {
  timestamp?: string;
  local_time?: string;
  market?: string;
  lane?: string;
  source_account?: string;
  service_events_logged?: number;
  service_demand_events_logged?: number;
  logged_service_demand_events?: number;
  posted_count?: number;
  posted_this_run?: number;
  drafted_count?: number;
  typed_count?: number;
  submitted_count?: number;
  blocked_reason?: string;
  zero_post_reason?: string;
  status?: string;
  posted?: TrackedReply[];
  posted_leads?: TrackedReply[];
  posted_responses?: TrackedReply[];
  replies?: TrackedReply[];
};

type TrackedReply = {
  tracking_id?: string;
  reply_variant_id?: string;
  reply_variant_family?: string;
  tracking_phone?: string;
  tracking_phone_e164?: string;
  conversion_status?: string;
  success_events?: unknown[];
  vertical?: string;
  service?: string;
  market?: string;
  lane?: string;
  timestamp?: string;
  posted_at?: string;
  post_url?: string;
  url?: string;
  post_id?: string;
  need?: string;
  reply?: string;
  reply_text?: string;
  comment?: string;
  status?: string;
  author?: string;
  author_name?: string;
  area?: string;
  neighborhood?: string;
};

type ActivityLogData = {
  runs: ScanRun[];
  replies: TrackedReply[];
  errors: string[];
};

type ScorecardRow = {
  label: string;
  demand: number;
  replies: number;
  calls: number;
  billable: number;
  revenue: number;
  scanDemand?: number;
  scanPosts?: number;
};

const COOKIE_NAME = 'falp_lead_dashboard_auth';
const DEFAULT_WINDOW_DAYS = 30;
const RANGE_OPTIONS = [7, 14, 30, 90];
const TAB_OPTIONS = ['overview', 'control-panel', 'breakdowns'] as const;

type DashboardTab = typeof TAB_OPTIONS[number];

function getDashboardPassword() {
  return process.env.INTERNAL_DASHBOARD_PASSWORD || process.env.LEAD_DASHBOARD_PASSWORD || '';
}

function getSupabaseKey() {
  return process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON;
}

async function unlockDashboard(formData: FormData) {
  'use server';

  const expected = getDashboardPassword();
  const password = String(formData.get('password') || '');

  if (!expected || password !== expected) {
    redirect('/admin/lead-dashboard?error=1');
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, expected, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/admin/lead-dashboard',
    maxAge: 60 * 60 * 12,
  });

  redirect('/admin/lead-dashboard');
}

function parseDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function lastNDays(days: number) {
  const out: string[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push(dateKey(d));
  }
  return out;
}

function numberValue(value: number | string | undefined) {
  if (value === undefined || value === null || value === '') return 0;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function pct(part: number, total: number) {
  if (!total) return '0%';
  return `${Math.round((part / total) * 100)}%`;
}

function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function titleize(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeBucket(value?: string) {
  const raw = (value || '').toLowerCase().trim();
  if (!raw) return 'unknown';
  if (raw.includes('plumb')) return 'plumbing';
  if (raw.includes('handyman') || raw.includes('repair') && raw.includes('small')) return 'handyman';
  if (raw.includes('electric')) return 'electrical';
  if (raw.includes('hvac') || raw.includes('air conditioning') || raw.includes('heating') || raw.includes('cooling')) return 'hvac';
  if (raw.includes('pest') || raw.includes('extermin')) return 'pest control';
  if (raw.includes('appliance') || raw.includes('washer') || raw.includes('dryer') || raw.includes('refrigerator')) return 'appliance';
  if (raw.includes('roof')) return 'roofing';
  if (raw.includes('lawn') || raw.includes('landscap') || raw.includes('tree')) return 'lawn / trees';
  return raw.replace(/[^a-z0-9]+/g, ' ').trim() || 'unknown';
}

function countBy<T>(items: T[], getKey: (item: T) => string | undefined, fallback = 'unknown') {
  const map = new Map<string, number>();
  for (const item of items) {
    const key = getKey(item)?.trim() || fallback;
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function sumBy<T>(items: T[], getValue: (item: T) => number) {
  return items.reduce((total, item) => total + getValue(item), 0);
}

function withinDays(date: Date | null, days: number) {
  if (!date) return false;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return date >= cutoff;
}

function parseRange(value?: string) {
  const parsed = Number(value);
  return RANGE_OPTIONS.includes(parsed) ? parsed : DEFAULT_WINDOW_DAYS;
}

function parseTab(value?: string): DashboardTab {
  return TAB_OPTIONS.includes(value as DashboardTab) ? (value as DashboardTab) : 'overview';
}

function dashboardHref(tab: DashboardTab, rangeDays: number) {
  return `/admin/lead-dashboard?tab=${tab}&range=${rangeDays}`;
}

async function supabaseGet<T>(path: string, key: string): Promise<T[]> {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const res = await fetch(url, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text.slice(0, 180)}`);
  }

  return res.json() as Promise<T[]>;
}

async function getDashboardData(): Promise<DashboardData> {
  const key = getSupabaseKey();
  const usingServiceKey = key !== SUPABASE_ANON;
  const errors: string[] = [];

  const [demand, leads] = await Promise.all([
    supabaseGet<DemandEvent>('service_demand_events?select=observed_at,created_at,platform,source_account,market,state,vertical,subcategory,action_taken,replied,score,skip_reason&order=created_at.desc&limit=5000', key).catch((error) => {
      errors.push(`service_demand_events: ${error.message}`);
      return [];
    }),
    supabaseGet<ELocalLead>('elocal_leads?select=created_at,source,service_category,call_status,bid_price,billable_duration,call_duration,billable,paid,zip_code&order=created_at.desc&limit=1000', key).catch((error) => {
      errors.push(`elocal_leads: ${error.message}`);
      return [];
    }),
  ]);

  return { demand, leads, errors, usingServiceKey };
}

function arrayFromLogValue(value: unknown): ScanRun[] {
  if (Array.isArray(value)) return value.filter((item): item is ScanRun => Boolean(item && typeof item === 'object'));
  return [];
}

function repliesFromRun(run: ScanRun): TrackedReply[] {
  const groups = [run.posted, run.posted_leads, run.posted_responses, run.replies];
  const nestedReplies = groups
    .flatMap((group) => (Array.isArray(group) ? group : []))
    .filter((reply) => reply && typeof reply === 'object')
    .map((reply) => ({
      ...reply,
      market: reply.market || run.market,
      lane: reply.lane || run.lane || run.source_account,
      timestamp: reply.timestamp || reply.posted_at || run.timestamp || run.local_time,
    }));

  const standaloneReply = (run as TrackedReply).tracking_id || (run as TrackedReply).reply_text || (run as TrackedReply).comment || (run as TrackedReply).reply
    ? [{ ...(run as TrackedReply), market: run.market, lane: run.lane || run.source_account, timestamp: run.timestamp || run.local_time }]
    : [];

  return [...nestedReplies, ...standaloneReply];
}

async function getActivityLogData(rangeDays: number): Promise<ActivityLogData> {
  const logFiles = [
    'activity-log.json',
    'activity-log-dad-nextdoor.json',
    'activity-log-pa-franconia.json',
    'activity-log-pa-boyertown.json',
  ];
  const errors: string[] = [];
  const runs: ScanRun[] = [];

  await Promise.all(logFiles.map(async (file) => {
    try {
      const raw = await fs.readFile(path.join(process.cwd(), 'nextdoor', file), 'utf8');
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const fileRuns = [
        ...arrayFromLogValue(parsed.runs),
        ...arrayFromLogValue(parsed.entries),
        ...arrayFromLogValue(parsed.events),
      ];
      if (parsed.timestamp || parsed.local_time) fileRuns.push(parsed as ScanRun);
      runs.push(...fileRuns.map((run) => ({ ...run, source_account: run.source_account || String(parsed.account || '').replace('pa-', '').replace('-nextdoor', '') })));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') errors.push(`${file}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }));

  const recentRuns = runs.filter((run) => withinDays(parseDate(run.timestamp || run.local_time), rangeDays));
  return {
    runs: recentRuns,
    replies: recentRuns.flatMap(repliesFromRun),
    errors,
  };
}

function normalizeMarket(value?: string) {
  const raw = (value || '').toLowerCase().trim();
  if (!raw) return 'unknown';
  if (raw.includes('boyertown')) return 'Pennsylvania / Boyertown';
  if (raw.includes('franconia') || raw.includes('montgomery')) return 'Pennsylvania / Franconia-Montgomery';
  if (raw.includes('warrington') || raw.includes('bucks')) return 'Pennsylvania / Warrington-Bucks';
  if (raw.includes('illinois') || raw.includes('downers') || raw.includes('naperville') || raw.includes('dupage') || raw.includes('chicago')) return 'Illinois / Downers Grove-Naperville';
  if (raw === 'pa' || raw.includes('pennsylvania')) return 'Pennsylvania / unknown';
  return 'unknown';
}

function leadMarket(row: ELocalLead) {
  const source = String(row.source || '').toLowerCase();
  const sourceMarket = normalizeMarket(source);
  if (sourceMarket !== 'unknown') return sourceMarket;

  const zip = String(row.zip_code || '');
  if (/^60|^61/.test(zip)) return 'Illinois / Downers Grove-Naperville';
  if (/^18|^19/.test(zip)) return 'Pennsylvania / unknown';
  return 'unknown';
}

function buildScorecards(recentDemand: DemandEvent[], recentLeads: ELocalLead[], activity: ActivityLogData) {
  const verticals = new Map<string, ScorecardRow>();
  const markets = new Map<string, ScorecardRow>();
  const row = (map: Map<string, ScorecardRow>, label: string) => {
    const key = label || 'unknown';
    if (!map.has(key)) map.set(key, { label: key, demand: 0, replies: 0, calls: 0, billable: 0, revenue: 0, scanDemand: 0, scanPosts: 0 });
    return map.get(key)!;
  };

  for (const event of recentDemand) {
    const repliedEvent = Boolean(event.replied || event.action_taken === 'replied' || event.action_taken === 'posted');
    const v = row(verticals, normalizeBucket(event.vertical || event.subcategory));
    v.demand += 1;
    if (repliedEvent) v.replies += 1;

    const m = row(markets, normalizeMarket(event.market || event.state || event.source_account || 'unknown'));
    m.demand += 1;
    if (repliedEvent) m.replies += 1;
  }

  for (const lead of recentLeads) {
    const revenue = lead.billable ? numberValue(lead.bid_price) : 0;
    const v = row(verticals, normalizeBucket(lead.service_category));
    v.calls += 1;
    if (lead.billable) v.billable += 1;
    v.revenue += revenue;

    const m = row(markets, leadMarket(lead));
    m.calls += 1;
    if (lead.billable) m.billable += 1;
    m.revenue += revenue;
  }

  for (const run of activity.runs) {
    const m = row(markets, normalizeMarket(run.market || run.lane || run.source_account || 'unknown'));
    m.scanDemand = (m.scanDemand || 0) + numberValue(run.service_demand_events_logged ?? run.service_events_logged ?? run.logged_service_demand_events);
    m.scanPosts = (m.scanPosts || 0) + numberValue(run.posted_count ?? run.posted_this_run);
  }

  const sortRows = (rows: ScorecardRow[]) => rows.sort((a, b) => b.revenue - a.revenue || b.calls - a.calls || b.replies - a.replies || b.demand - a.demand);
  return { verticals: sortRows([...verticals.values()]), markets: sortRows([...markets.values()]) };
}

function buildVariantRows(replies: TrackedReply[]) {
  const rows = new Map<string, { label: string; posted: number; successes: number; family: string }>();
  for (const reply of replies) {
    const label = reply.reply_variant_id || reply.reply_variant_family || 'untracked_variant';
    if (!rows.has(label)) rows.set(label, { label, posted: 0, successes: 0, family: reply.reply_variant_family || 'unknown' });
    const row = rows.get(label)!;
    row.posted += 1;
    if (reply.conversion_status === 'success_call_received' || (reply.success_events || []).length > 0) row.successes += 1;
  }
  return [...rows.values()].sort((a, b) => b.successes - a.successes || b.posted - a.posted);
}

function buildRecommendations(verticalRows: ScorecardRow[], marketRows: ScorecardRow[], variantRows: ReturnType<typeof buildVariantRows>) {
  const recommendations: string[] = [];
  const moneyVertical = verticalRows.find((row) => row.revenue > 0 || row.billable > 0 || row.calls > 0);
  if (moneyVertical) recommendations.push(`Push ${titleize(moneyVertical.label)} first: ${moneyVertical.calls} calls, ${money(moneyVertical.revenue)} billable revenue.`);

  const noisyNoMoney = verticalRows.find((row) => row.replies >= 2 && row.calls === 0);
  if (noisyNoMoney) recommendations.push(`${titleize(noisyNoMoney.label)} is getting replies but no calls yet. Tighten the CTA or stop giving it prime scan budget.`);

  const wastedMarket = marketRows.find((row) => (row.scanDemand || row.demand) >= 8 && (row.scanPosts || row.replies) === 0);
  if (wastedMarket) recommendations.push(`${titleize(wastedMarket.label)} is producing demand but no posts. Check dedupe/geography blockers before spending more scans there.`);

  const variantWinner = variantRows.find((row) => row.successes > 0);
  if (variantWinner) recommendations.push(`${titleize(variantWinner.label)} has the best tracked reply signal: ${variantWinner.successes}/${variantWinner.posted} successes.`);

  if (!recommendations.length) recommendations.push('No obvious winner yet. Keep collecting tracked replies and billable-call attribution, because guessing is how you get robbed by your own logs.');
  return recommendations.slice(0, 4);
}

function MetricCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</div>
      {hint ? <div className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{hint}</div> : null}
    </div>
  );
}

function BarList({ rows, limit = 8 }: { rows: [string, number][]; limit?: number }) {
  const shown = rows.slice(0, limit);
  const max = Math.max(...shown.map(([, value]) => value), 1);

  return (
    <div className="space-y-3">
      {shown.map(([label, value]) => (
        <div key={label}>
          <div className="mb-1 flex items-center justify-between gap-4 text-sm">
            <span className="truncate font-semibold text-slate-700">{titleize(label)}</span>
            <span className="tabular-nums text-slate-500">{value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-slate-950" style={{ width: `${Math.max(3, (value / max) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ScoreTable({ title, subtitle, rows }: { title: string; subtitle: string; rows: ScorecardRow[] }) {
  const shown = rows.slice(0, 10);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <h2 className="text-lg font-black text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Segment</th>
              <th className="px-5 py-3 text-right">Demand</th>
              <th className="px-5 py-3 text-right">Replies</th>
              <th className="px-5 py-3 text-right">Calls</th>
              <th className="px-5 py-3 text-right">Billable</th>
              <th className="px-5 py-3 text-right">Revenue</th>
              <th className="px-5 py-3 text-right">Reply → call</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {shown.map((row) => (
              <tr key={row.label}>
                <td className="px-5 py-4 font-black text-slate-900">{titleize(row.label)}</td>
                <td className="px-5 py-4 text-right tabular-nums text-slate-600">{row.demand || row.scanDemand || 0}</td>
                <td className="px-5 py-4 text-right tabular-nums text-slate-600">{row.replies || row.scanPosts || 0}</td>
                <td className="px-5 py-4 text-right tabular-nums text-slate-600">{row.calls}</td>
                <td className="px-5 py-4 text-right tabular-nums text-slate-600">{row.billable}</td>
                <td className="px-5 py-4 text-right font-black tabular-nums text-slate-950">{money(row.revenue)}</td>
                <td className="px-5 py-4 text-right tabular-nums text-slate-600">{pct(row.calls, row.replies || row.scanPosts || 0)}</td>
              </tr>
            ))}
            {!shown.length ? (
              <tr><td colSpan={7} className="px-5 py-8 text-center font-semibold text-slate-400">No data visible for this range.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VariantTable({ rows }: { rows: ReturnType<typeof buildVariantRows> }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <h2 className="text-lg font-black text-slate-950">Reply variant performance</h2>
        <p className="mt-1 text-sm text-slate-500">Tracked Nextdoor wording experiments from local activity logs. Success means a call was attributed back to the reply.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Variant</th>
              <th className="px-5 py-3">Family</th>
              <th className="px-5 py-3 text-right">Posted</th>
              <th className="px-5 py-3 text-right">Successes</th>
              <th className="px-5 py-3 text-right">Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.slice(0, 10).map((row) => (
              <tr key={row.label}>
                <td className="px-5 py-4 font-black text-slate-900">{titleize(row.label)}</td>
                <td className="px-5 py-4 text-slate-600">{titleize(row.family)}</td>
                <td className="px-5 py-4 text-right tabular-nums text-slate-600">{row.posted}</td>
                <td className="px-5 py-4 text-right tabular-nums text-slate-600">{row.successes}</td>
                <td className="px-5 py-4 text-right font-black tabular-nums text-slate-950">{pct(row.successes, row.posted)}</td>
              </tr>
            ))}
            {!rows.length ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center font-semibold text-slate-400">No tracked variants found in local activity logs for this range.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReplyAttributionTable({ replies }: { replies: TrackedReply[] }) {
  const rows = [...replies]
    .sort((a, b) => (parseDate(b.timestamp || b.posted_at)?.getTime() || 0) - (parseDate(a.timestamp || a.posted_at)?.getTime() || 0))
    .slice(0, 25);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <h2 className="text-lg font-black text-slate-950">Posted reply attribution</h2>
        <p className="mt-1 text-sm text-slate-500">Exactly what we said, where it was posted, which variant it used, and whether it has a tracked success yet.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Posted</th>
              <th className="px-5 py-3">Market</th>
              <th className="px-5 py-3">Vertical</th>
              <th className="px-5 py-3">Variant</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">What we said</th>
              <th className="px-5 py-3">Post</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 align-top">
            {rows.map((reply, index) => {
              const href = reply.post_url || reply.url;
              const text = reply.reply_text || reply.comment || reply.reply || '';
              const when = parseDate(reply.timestamp || reply.posted_at);
              const market = normalizeMarket(reply.market || reply.lane || reply.area || reply.neighborhood);
              const rowKey = reply.tracking_id || `${reply.post_id || href || 'reply'}-${index}`;
              return (
                <tr key={rowKey}>
                  <td className="px-5 py-4 whitespace-nowrap text-xs font-semibold text-slate-500">{when ? when.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'unknown'}</td>
                  <td className="px-5 py-4 font-semibold text-slate-700">{titleize(market)}</td>
                  <td className="px-5 py-4 font-semibold text-slate-700">{titleize(normalizeBucket(reply.vertical || reply.service))}</td>
                  <td className="px-5 py-4">
                    <div className="font-black text-slate-900">{titleize(reply.reply_variant_id || 'untracked')}</div>
                    <div className="text-xs font-semibold text-slate-400">{titleize(reply.reply_variant_family || 'unknown')}</div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-700">{titleize(reply.conversion_status || reply.status || 'unknown')}</td>
                  <td className="px-5 py-4 whitespace-nowrap font-mono text-xs text-slate-600">{reply.tracking_phone || reply.tracking_phone_e164 || '—'}</td>
                  <td className="px-5 py-4 max-w-xl text-slate-700">{text || '—'}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {href ? <a className="font-black text-emerald-700 underline" href={href}>Open</a> : <span className="text-slate-400">—</span>}
                  </td>
                </tr>
              );
            })}
            {!rows.length ? (
              <tr><td colSpan={8} className="px-5 py-8 text-center font-semibold text-slate-400">No posted replies found in activity logs for this range.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RecommendationPanel({ items }: { items: string[] }) {
  return (
    <section className="mb-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-emerald-950">Recommendations</h2>
          <p className="text-sm text-emerald-800">Auto-generated from demand, replies, calls, billable status, and tracked variants.</p>
        </div>
        <div className="hidden rounded-full bg-emerald-950 px-3 py-1 text-xs font-black uppercase tracking-wide text-white sm:block">Control panel</div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-emerald-200 bg-white p-4 text-sm font-semibold leading-6 text-slate-800">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

function TabControls({ activeTab, rangeDays }: { activeTab: DashboardTab; rangeDays: number }) {
  const tabs: { id: DashboardTab; label: string; description: string }[] = [
    { id: 'overview', label: 'Overview', description: 'KPIs and trend' },
    { id: 'control-panel', label: 'Control panel', description: 'Markets, verticals, recommendations' },
    { id: 'breakdowns', label: 'Breakdowns', description: 'Raw mix charts' },
  ];

  return (
    <nav className="mb-6 grid gap-3 md:grid-cols-3" aria-label="Dashboard tabs">
      {tabs.map((tab) => (
        <a
          key={tab.id}
          href={dashboardHref(tab.id, rangeDays)}
          className={`rounded-3xl border p-5 shadow-sm transition ${
            activeTab === tab.id
              ? 'border-slate-950 bg-slate-950 text-white'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-950'
          }`}
        >
          <div className="text-lg font-black">{tab.label}</div>
          <div className={`mt-1 text-sm ${activeTab === tab.id ? 'text-slate-300' : 'text-slate-500'}`}>{tab.description}</div>
        </a>
      ))}
    </nav>
  );
}

function RangeControls({ rangeDays, activeTab }: { rangeDays: number; activeTab: DashboardTab }) {
  return (
    <div className="flex flex-wrap gap-2">
      {RANGE_OPTIONS.map((days) => (
        <a
          key={days}
          href={dashboardHref(activeTab, days)}
          className={`rounded-full px-4 py-2 text-sm font-black transition ${
            rangeDays === days
              ? 'bg-slate-950 text-white shadow-sm'
              : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-950'
          }`}
        >
          {days}d
        </a>
      ))}
    </div>
  );
}

function LineChart({ values, rangeDays }: { values: { label: string; demand: number; replies: number; calls: number }[]; rangeDays: number }) {
  const width = 900;
  const height = 240;
  const padding = 28;
  const max = Math.max(...values.flatMap((v) => [v.demand, v.replies, v.calls]), 1);
  const x = (idx: number) => padding + (idx / Math.max(values.length - 1, 1)) * (width - padding * 2);
  const y = (value: number) => height - padding - (value / max) * (height - padding * 2);
  const path = (key: 'demand' | 'replies' | 'calls') => values.map((v, idx) => `${idx === 0 ? 'M' : 'L'} ${x(idx)} ${y(v[key])}`).join(' ');

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-950">{rangeDays}-day trend</h2>
          <p className="text-sm text-slate-500">Demand observed, public replies, and eLocal calls/leads.</p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wide">
          <span className="text-slate-950">● Demand</span>
          <span className="text-blue-600">● Replies</span>
          <span className="text-emerald-600">● Calls</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full">
        {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
          <line key={tick} x1={padding} x2={width - padding} y1={padding + tick * (height - padding * 2)} y2={padding + tick * (height - padding * 2)} stroke="#e2e8f0" strokeWidth="1" />
        ))}
        <path d={path('demand')} fill="none" stroke="#020617" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d={path('replies')} fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d={path('calls')} fill="none" stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {values.map((v, idx) => (
          <g key={v.label}>
            <circle cx={x(idx)} cy={y(v.demand)} r="3" fill="#020617" />
            <circle cx={x(idx)} cy={y(v.replies)} r="3" fill="#2563eb" />
            <circle cx={x(idx)} cy={y(v.calls)} r="3" fill="#059669" />
          </g>
        ))}
      </svg>
      <div className="mt-1 grid grid-cols-3 text-xs font-semibold text-slate-400 sm:grid-cols-6">
        {values.filter((_, idx) => idx % 5 === 0 || idx === values.length - 1).map((v) => (
          <span key={v.label}>{v.label.slice(5)}</span>
        ))}
      </div>
    </div>
  );
}

function FocusLineChart({ values }: { values: { label: string; replies: number; calls: number }[] }) {
  const width = 900;
  const height = 220;
  const padding = 28;
  const max = Math.max(...values.flatMap((v) => [v.replies, v.calls]), 1);
  const x = (idx: number) => padding + (idx / Math.max(values.length - 1, 1)) * (width - padding * 2);
  const y = (value: number) => height - padding - (value / max) * (height - padding * 2);
  const path = (key: 'replies' | 'calls') => values.map((v, idx) => `${idx === 0 ? 'M' : 'L'} ${x(idx)} ${y(v[key])}`).join(' ');

  return (
    <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-950">Reply + call focus</h2>
          <p className="text-sm text-slate-500">Same dates, separate scale. This is the zoomed-in view for the tiny lines.</p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wide">
          <span className="text-blue-600">● Replies</span>
          <span className="text-emerald-600">● Calls</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-60 w-full">
        {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
          <line key={tick} x1={padding} x2={width - padding} y1={padding + tick * (height - padding * 2)} y2={padding + tick * (height - padding * 2)} stroke="#e2e8f0" strokeWidth="1" />
        ))}
        <path d={path('replies')} fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d={path('calls')} fill="none" stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {values.map((v, idx) => (
          <g key={v.label}>
            <circle cx={x(idx)} cy={y(v.replies)} r="3" fill="#2563eb" />
            <circle cx={x(idx)} cy={y(v.calls)} r="3" fill="#059669" />
          </g>
        ))}
      </svg>
      <div className="mt-1 grid grid-cols-3 text-xs font-semibold text-slate-400 sm:grid-cols-6">
        {values.filter((_, idx) => idx % Math.max(1, Math.ceil(values.length / 6)) === 0 || idx === values.length - 1).map((v) => (
          <span key={v.label}>{v.label.slice(5)}</span>
        ))}
      </div>
    </div>
  );
}

function AuthGate({ error }: { error?: string }) {
  const configured = Boolean(getDashboardPassword());

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
        <div className="text-sm font-black uppercase tracking-[0.25em] text-emerald-300">FindALocalPro</div>
        <h1 className="mt-3 text-3xl font-black tracking-tight">Lead dashboard</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">Internal visibility for demand, Nextdoor replies, eLocal calls, and billable progress.</p>

        {!configured ? (
          <div className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
            Set <code className="font-bold">INTERNAL_DASHBOARD_PASSWORD</code> in Vercel/local env before this page is available.
          </div>
        ) : (
          <form action={unlockDashboard} className="mt-6 space-y-4">
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Dashboard password"
              className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-slate-950 outline-none ring-emerald-300 focus:ring-4"
            />
            {error ? <div className="text-sm font-semibold text-red-300">Wrong password. Annoying, but that is the point.</div> : null}
            <button className="w-full rounded-2xl bg-emerald-400 px-4 py-3 font-black text-slate-950 transition hover:bg-emerald-300">
              Open dashboard
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default async function LeadDashboardPage({ searchParams }: { searchParams?: Promise<{ error?: string; range?: string; tab?: string }> }) {
  const password = getDashboardPassword();
  const params = await searchParams;
  const cookieStore = await cookies();
  const authed = password && cookieStore.get(COOKIE_NAME)?.value === password;

  if (!authed) {
    return <AuthGate error={params?.error} />;
  }

  const rangeDays = parseRange(params?.range);
  const activeTab = parseTab(params?.tab);
  const [{ demand, leads, errors, usingServiceKey }, activity] = await Promise.all([
    getDashboardData(),
    getActivityLogData(rangeDays),
  ]);
  const recentDemand = demand.filter((row) => withinDays(parseDate(row.logged_at || row.observed_at || row.created_at), rangeDays));
  const recentLeads = leads.filter((row) => withinDays(parseDate(row.created_at), rangeDays));

  const replied = recentDemand.filter((row) => row.replied || row.action_taken === 'replied' || row.action_taken === 'posted').length;
  const skipped = recentDemand.filter((row) => String(row.action_taken || '').includes('skipped') || String(row.action_taken || '').includes('block')).length;
  const billable = recentLeads.filter((row) => row.billable).length;
  const bridged = recentLeads.filter((row) => ['bridged', 'completed'].includes(String(row.call_status || ''))).length;
  const estimatedRevenue = sumBy(recentLeads.filter((row) => row.billable), (row) => numberValue(row.bid_price));

  const days = lastNDays(rangeDays);
  const series = days.map((day) => ({
    label: day,
    demand: recentDemand.filter((row) => dateKey(parseDate(row.logged_at || row.observed_at || row.created_at) || new Date(0)) === day).length,
    replies: recentDemand.filter((row) => dateKey(parseDate(row.logged_at || row.observed_at || row.created_at) || new Date(0)) === day && (row.replied || row.action_taken === 'replied' || row.action_taken === 'posted')).length,
    calls: recentLeads.filter((row) => dateKey(parseDate(row.created_at) || new Date(0)) === day).length,
  }));

  const verticals = countBy(recentDemand, (row) => row.vertical);
  const markets = countBy(recentDemand, (row) => row.market || row.state);
  const actions = countBy(recentDemand, (row) => row.action_taken);
  const leadStatuses = countBy(recentLeads, (row) => row.call_status);
  const leadServices = countBy(recentLeads, (row) => row.service_category);
  const scorecards = buildScorecards(recentDemand, recentLeads, activity);
  const variantRows = buildVariantRows(activity.replies);
  const recommendations = buildRecommendations(scorecards.verticals, scorecards.markets, variantRows);
  const scanDemand = sumBy(activity.runs, (row) => numberValue(row.service_demand_events_logged ?? row.service_events_logged ?? row.logged_service_demand_events));
  const scanPosts = sumBy(activity.runs, (row) => numberValue(row.posted_count ?? row.posted_this_run));
  const updatedAt = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'medium', timeStyle: 'short' });

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-4 rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl md:flex-row md:items-end">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.25em] text-emerald-300">FindALocalPro</div>
            <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">Lead dashboard</h1>
            <p className="mt-3 max-w-2xl text-slate-300">Demand capture, posting funnel, and eLocal call health. Basically: is the home-service machine machine-ing?</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-slate-300">
            <div className="font-bold text-white">Updated {updatedAt} CT</div>
            <div>{usingServiceKey ? 'Server key active' : 'Anon key fallback'}</div>
          </div>
        </header>

        {errors.length || activity.errors.length || !usingServiceKey ? (
          <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
            <div className="font-black">Data warning</div>
            {!usingServiceKey ? <p className="mt-1">Using the anon Supabase key. Set <code>SUPABASE_SERVICE_KEY</code> for full internal rows.</p> : null}
            {errors.map((error) => <p key={error} className="mt-1 font-mono text-xs">{error}</p>)}
            {activity.errors.map((error) => <p key={error} className="mt-1 font-mono text-xs">activity log: {error}</p>)}
          </div>
        ) : null}

        <TabControls activeTab={activeTab} rangeDays={rangeDays} />

        <section className="mb-6 flex flex-col justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-black text-slate-950">Date range</h2>
            <p className="text-sm text-slate-500">Tighten it up when the graph is too zoomed out. Shocking concept, I know.</p>
          </div>
          <RangeControls rangeDays={rangeDays} activeTab={activeTab} />
        </section>

        {activeTab === 'overview' ? (
          <>
            <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Demand observed" value={recentDemand.length.toLocaleString()} hint={`Last ${rangeDays} days`} />
              <MetricCard label="Public replies" value={replied.toLocaleString()} hint={`${pct(replied, recentDemand.length)} reply rate`} />
              <MetricCard label="eLocal calls/leads" value={recentLeads.length.toLocaleString()} hint={`${bridged} bridged/completed`} />
              <MetricCard label="Billable revenue" value={money(estimatedRevenue)} hint={`${billable} billable calls`} />
            </section>

            <section className="mb-6 grid gap-4 sm:grid-cols-3">
              <MetricCard label="Skipped / blocked" value={skipped.toLocaleString()} hint={`${pct(skipped, recentDemand.length)} safety/quality filter`} />
              <MetricCard label="Billable rate" value={pct(billable, recentLeads.length)} hint="Billable calls / eLocal rows" />
              <MetricCard label="Avg bid" value={money(recentLeads.length ? sumBy(recentLeads, (row) => numberValue(row.bid_price)) / recentLeads.length : 0)} hint="Across eLocal rows" />
            </section>

            <section className="mb-6">
              <InteractiveCharts values={series} rangeDays={rangeDays} />
            </section>
          </>
        ) : null}

        {activeTab === 'control-panel' ? (
          <>
            <RecommendationPanel items={recommendations} />

            <section className="mb-6 grid gap-4 sm:grid-cols-3">
              <MetricCard label="Scan-log demand" value={scanDemand.toLocaleString()} hint="From local Nextdoor activity logs" />
              <MetricCard label="Scan-log posts" value={scanPosts.toLocaleString()} hint={`${pct(scanPosts, scanDemand)} post / logged-demand rate`} />
              <MetricCard label="Tracked variants" value={variantRows.length.toLocaleString()} hint={`${activity.replies.length} tracked replies visible`} />
            </section>

            <section className="mb-6 grid gap-6">
              <ScoreTable title="Market control panel" subtitle="Illinois vs PA lanes, with Supabase demand/calls plus local scan-log demand/post counts where available." rows={scorecards.markets} />
              <ScoreTable title="Vertical control panel" subtitle="Which categories produce demand, replies, calls, billable calls, and actual estimated revenue." rows={scorecards.verticals} />
              <VariantTable rows={variantRows} />
              <ReplyAttributionTable replies={activity.replies} />
            </section>
          </>
        ) : null}

        {activeTab === 'breakdowns' ? (
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-black">Demand by vertical</h2>
              <BarList rows={verticals} />
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-black">Demand by market</h2>
              <BarList rows={markets} />
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-black">Action funnel</h2>
              <BarList rows={actions} />
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-black">eLocal status</h2>
              <BarList rows={leadStatuses.length ? leadStatuses : [['no elocal rows visible', 0]]} />
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
              <h2 className="mb-4 text-lg font-black">eLocal service mix</h2>
              <BarList rows={leadServices.length ? leadServices : [['no elocal rows visible', 0]]} limit={10} />
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
