-- Create elocal_leads tracking table
-- Tracks all eLocal API pings and call bridging results

CREATE TABLE elocal_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  source TEXT, -- nextdoor, website, sms, direct_call, wiggly
  caller_phone TEXT,
  zip_code TEXT,
  need_id TEXT,
  service_category TEXT,
  elocal_token TEXT,
  elocal_phone TEXT,
  bid_price DECIMAL,
  billable_duration INTEGER,
  call_duration INTEGER,
  call_status TEXT DEFAULT 'pending', -- pending, ping_sent, bridged, completed, failed, no_coverage
  billable BOOLEAN DEFAULT false,
  paid BOOLEAN DEFAULT false,
  nextdoor_post_url TEXT,
  lead_id UUID, -- FK to existing leads table
  twilio_call_sid TEXT,
  notes TEXT
);

-- Indexes for common queries
CREATE INDEX idx_elocal_leads_created ON elocal_leads(created_at);
CREATE INDEX idx_elocal_leads_status ON elocal_leads(call_status);
CREATE INDEX idx_elocal_leads_billable ON elocal_leads(billable);
CREATE INDEX idx_elocal_leads_lead_id ON elocal_leads(lead_id);
CREATE INDEX idx_elocal_leads_caller_phone ON elocal_leads(caller_phone);

-- Comments for documentation
COMMENT ON TABLE elocal_leads IS 'Tracks eLocal API ping requests and call bridging results';
COMMENT ON COLUMN elocal_leads.source IS 'Lead source: nextdoor, website, sms, direct_call, wiggly';
COMMENT ON COLUMN elocal_leads.need_id IS 'eLocal need ID used in API ping (e.g., 10000- for plumbing)';
COMMENT ON COLUMN elocal_leads.service_category IS 'Normalized service category mapped to need_id';
COMMENT ON COLUMN elocal_leads.elocal_token IS 'Token returned by eLocal ping API for tracking';
COMMENT ON COLUMN elocal_leads.elocal_phone IS 'Phone number returned by eLocal to bridge call to';
COMMENT ON COLUMN elocal_leads.bid_price IS 'Price eLocal will pay us for this call (from API response)';
COMMENT ON COLUMN elocal_leads.billable_duration IS 'Minimum call duration for billable call (from API)';
COMMENT ON COLUMN elocal_leads.call_duration IS 'Actual call duration in seconds';
COMMENT ON COLUMN elocal_leads.call_status IS 'Call status: pending, ping_sent, bridged, completed, failed, no_coverage';
COMMENT ON COLUMN elocal_leads.billable IS 'True if call met minimum billable duration';
COMMENT ON COLUMN elocal_leads.paid IS 'True if we have been paid by eLocal for this call';
COMMENT ON COLUMN elocal_leads.lead_id IS 'Foreign key to existing leads table';
COMMENT ON COLUMN elocal_leads.twilio_call_sid IS 'Twilio call SID for tracking';