-- Move partner enrollment to approval-first: no Stripe checkout before review.

alter table public.partner_applications
  add column if not exists approval_email_sent_at timestamptz,
  add column if not exists checkout_token_hash text,
  add column if not exists checkout_token_expires_at timestamptz;

create unique index if not exists partner_applications_checkout_token_idx
  on public.partner_applications(checkout_token_hash)
  where checkout_token_hash is not null;

alter table public.partner_applications alter column status set default 'pending_review';

alter table public.partner_applications
  drop constraint if exists partner_applications_status_check;

alter table public.partner_applications
  add constraint partner_applications_status_check check (status in (
    'pending_review',
    'approval_delivery_failed',
    'approved_pending_checkout',
    'declined',
    'active',
    'checkout_pending',
    'paid_pending_review',
    'approved',
    'decline_processing',
    'declined_refunded',
    'refund_failed',
    'cancelled',
    'billing_setup_failed'
  ));

update public.partner_applications
set status = 'pending_review', billing_status = 'not_started'
where status = 'checkout_pending'
  and amount_paid_cents = 0
  and stripe_subscription_id is null;

comment on table public.partner_applications is
  'Approval-first founding-partner applications and their billing lifecycle.';
