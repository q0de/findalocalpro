-- Durable partner applications, Stripe event tracking, and one-use review links.

create table if not exists public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  business_name text not null,
  contact_name text not null,
  email text not null,
  phone text not null,
  website text,
  category text not null,
  service_areas text not null,
  preferred_territory text,
  years_in_business text,
  google_profile text,
  notes text,
  confirmed boolean not null default false,
  status text not null default 'checkout_pending' check (status in (
    'checkout_pending',
    'paid_pending_review',
    'approved',
    'decline_processing',
    'declined_refunded',
    'refund_failed',
    'cancelled',
    'billing_setup_failed'
  )),
  billing_status text not null default 'unpaid',
  stripe_checkout_session_id text unique,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  stripe_schedule_id text unique,
  stripe_last_invoice_id text,
  stripe_refund_ids text[] not null default '{}',
  amount_paid_cents integer not null default 0,
  currency text not null default 'usd',
  approved_at timestamptz,
  declined_at timestamptz,
  refunded_at timestamptz,
  telegram_notified_at timestamptz,
  failure_reason text
);

create index if not exists partner_applications_status_idx on public.partner_applications(status);
create index if not exists partner_applications_email_idx on public.partner_applications(lower(email));
create index if not exists partner_applications_subscription_idx on public.partner_applications(stripe_subscription_id);

create table if not exists public.partner_stripe_events (
  event_id text primary key,
  event_type text not null,
  status text not null default 'processing' check (status in ('processing', 'processed', 'failed')),
  attempts integer not null default 1,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  processed_at timestamptz
);

create table if not exists public.partner_review_tokens (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.partner_applications(id) on delete cascade,
  token_hash text not null unique,
  action text not null check (action in ('approve', 'decline')),
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists partner_review_tokens_application_idx on public.partner_review_tokens(application_id);
create index if not exists partner_review_tokens_expiry_idx on public.partner_review_tokens(expires_at);

create or replace function public.set_partner_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists partner_applications_updated_at on public.partner_applications;
create trigger partner_applications_updated_at
before update on public.partner_applications
for each row execute function public.set_partner_updated_at();

drop trigger if exists partner_stripe_events_updated_at on public.partner_stripe_events;
create trigger partner_stripe_events_updated_at
before update on public.partner_stripe_events
for each row execute function public.set_partner_updated_at();

alter table public.partner_applications enable row level security;
alter table public.partner_stripe_events enable row level security;
alter table public.partner_review_tokens enable row level security;

comment on table public.partner_applications is 'Paid founding-partner applications and their review/billing lifecycle.';
comment on table public.partner_stripe_events is 'Idempotency ledger for Stripe partner webhooks.';
comment on table public.partner_review_tokens is 'Hashed, expiring, one-use Telegram review links.';
