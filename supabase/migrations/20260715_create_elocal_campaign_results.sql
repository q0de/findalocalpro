-- Store eLocal Affiliate campaign-results v2 call-level payout truth.
-- This is the accounting source of truth for payable/unpayable/adjusted/payout,
-- separate from our optimistic ping/bridge estimates in elocal_leads.

CREATE TABLE IF NOT EXISTS elocal_campaign_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_uuid TEXT NOT NULL,
  campaign_name TEXT,
  call_id TEXT NOT NULL,
  provider_call_id TEXT,
  call_ping_token TEXT,
  call_date TIMESTAMPTZ,
  caller_phone TEXT,
  did_phone TEXT,
  zip_code TEXT,
  category_id INTEGER,
  category_name TEXT,
  call_duration_seconds INTEGER,
  call_price NUMERIC,
  gross_call_value NUMERIC,
  payable_status TEXT,
  payable_status_reason TEXT,
  is_adjusted TEXT,
  adjustment_category TEXT,
  credit_reason TEXT,
  call_quality_tags JSONB,
  raw_row JSONB NOT NULL DEFAULT '{}'::jsonb,
  matched_elocal_lead_id UUID REFERENCES elocal_leads(id) ON DELETE SET NULL,
  matched_twilio_call_sid TEXT,
  match_confidence NUMERIC,
  match_method TEXT,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (campaign_uuid, call_id)
);

CREATE INDEX IF NOT EXISTS idx_elocal_campaign_results_call_date ON elocal_campaign_results(call_date DESC);
CREATE INDEX IF NOT EXISTS idx_elocal_campaign_results_token ON elocal_campaign_results(call_ping_token);
CREATE INDEX IF NOT EXISTS idx_elocal_campaign_results_provider_call_id ON elocal_campaign_results(provider_call_id);
CREATE INDEX IF NOT EXISTS idx_elocal_campaign_results_payable_status ON elocal_campaign_results(payable_status);
CREATE INDEX IF NOT EXISTS idx_elocal_campaign_results_matched_lead ON elocal_campaign_results(matched_elocal_lead_id);

COMMENT ON TABLE elocal_campaign_results IS 'Imported eLocal Affiliate campaign-results v2 call-level payout/payable source of truth.';
COMMENT ON COLUMN elocal_campaign_results.call_price IS 'Actual payout for this call from eLocal. Usually 0 for non-payable calls.';
COMMENT ON COLUMN elocal_campaign_results.gross_call_value IS 'Gross call value from eLocal, before any non-payable/credit logic where provided.';
COMMENT ON COLUMN elocal_campaign_results.payable_status IS 'eLocal payment status such as PAYABLE or NON_PAYABLE.';
COMMENT ON COLUMN elocal_campaign_results.payable_status_reason IS 'eLocal reason explaining payable/non-payable status.';
COMMENT ON COLUMN elocal_campaign_results.call_ping_token IS 'Token returned by our eLocal /call/ping request; strongest match back to elocal_leads.elocal_token when present.';
