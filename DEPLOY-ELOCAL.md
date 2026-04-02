# eLocal API Integration Deployment Guide

This guide covers deploying the eLocal Call Ping API integration for FindALocalPro.

## Overview

The integration replaces static eLocal numbers with dynamic API calls to:
1. Ping eLocal with service + zip + caller phone
2. Get real provider phone numbers to bridge to
3. Track bidding prices and billable durations
4. Log all activity in new `elocal_leads` table

## Deployment Steps

### 1. Run SQL Migration

Create the `elocal_leads` tracking table:

```bash
# Option A: Using Supabase CLI (if logged in)
cd ~/clawd/findalocalpro
npx supabase db reset --db-url "postgresql://postgres:[PASSWORD]@db.hocipkeeikriqyojiboj.supabase.co:5432/postgres"
# Or apply specific migration
npx supabase db push --db-url "postgresql://postgres:[PASSWORD]@db.hocipkeeikriqyojiboj.supabase.co:5432/postgres"

# Option B: Manual SQL execution via Supabase Dashboard
# 1. Go to https://supabase.com/dashboard/project/hocipkeeikriqyojiboj/sql/new
# 2. Copy/paste the contents of supabase/migrations/create_elocal_leads.sql
# 3. Run the query
```

### 2. Set Environment Variables

Add the eLocal API key to your Supabase project:

```bash
# Via Supabase CLI
npx supabase secrets set ELOCAL_API_KEY=21ce1ee934d06d03c8171d6f31f633f8b500f2d5 --project-ref hocipkeeikriqyojiboj

# Or via Supabase Dashboard:
# 1. Go to Project Settings → Edge Functions → Environment variables
# 2. Add: Key: ELOCAL_API_KEY, Value: 21ce1ee934d06d03c8171d6f31f633f8b500f2d5
```

### 3. Deploy Voice Webhook

Deploy the updated voice webhook function:

```bash
cd ~/clawd/findalocalpro

# Deploy the voice-webhook function
SUPABASE_ACCESS_TOKEN="<token>" npx supabase functions deploy voice-webhook --project-ref hocipkeeikriqyojiboj --no-verify-jwt

# Or if you have Supabase CLI configured with login:
npx supabase functions deploy voice-webhook --project-ref hocipkeeikriqyojiboj --no-verify-jwt
```

### 4. Verify Deployment

Test the deployment in development mode:

**Health Check:**
```bash
curl https://hocipkeeikriqyojiboj.supabase.co/functions/v1/voice-webhook
# Should return: {"status":"ok","service":"FindALocalPro Voice Webhook (eLocal Integrated)","elocal_api":"configured"}
```

**Test eLocal Ping** (safe in dev mode):
1. Call (630) 407-1727
2. Follow IVR prompts (press 1 for plumbing)
3. Enter test zip code: 60515
4. Check Telegram for eLocal ping results
5. Call should bridge to eLocal test number (in dev mode)

### 5. Verify Database

Check that the `elocal_leads` table was created and is logging pings:

```sql
-- Via Supabase Dashboard SQL editor
SELECT * FROM elocal_leads ORDER BY created_at DESC LIMIT 10;

-- Check table structure
\d elocal_leads;
```

## Testing Checklist

### ✅ Pre-Deployment
- [ ] Migration SQL file created
- [ ] Voice webhook updated with eLocal integration
- [ ] Nextdoor templates updated with new phone number
- [ ] eLocal API key added to .env

### ✅ Post-Deployment
- [ ] Health check returns "elocal_api": "configured"
- [ ] SQL table `elocal_leads` exists with correct schema
- [ ] Environment variable `ELOCAL_API_KEY` set in Supabase
- [ ] Voice webhook deployed successfully
- [ ] Test call flows through IVR → zip collection → eLocal ping
- [ ] Telegram notifications show ping results
- [ ] Database logs eLocal ping attempts in `elocal_leads` table

### ✅ Call Flow Testing
- [ ] **Inbound IVR**: (630) 407-1727 → press 1 → enter zip → bridged
- [ ] **SMS callback**: Text service + zip → get callback → bridged
- [ ] **Website callback**: Form submission → callback → bridged
- [ ] **No coverage**: Test with unsupported zip → "no coverage" message
- [ ] **Failed ping**: Verify error handling and logging

## Development Mode Notes

- **Safe to test**: eLocal campaign is in DEVELOPMENT mode
- **Test numbers**: eLocal returns test numbers that route to eLocal for validation
- **No real providers**: Calls don't go to real service providers
- **Full API testing**: All ping/response functionality works normally

## Service to Need ID Mapping

The integration uses these catch-all Need IDs for simplicity:

| Service | Need ID | eLocal Category |
|---------|---------|-----------------|
| plumbing | 10000- | Plumbers |
| hvac | 583- | Heating Contractors |
| electrical | 5000- | Electricians |
| pest control | 6000- | Exterminators |
| appliance repair | 149- | Appliance Repair |
| air conditioning | 584- | Air Conditioning |
| roofing | 584- | Air Conditioning (fallback) |
| default | 10000- | Plumbers (fallback) |

## Monitoring

Key metrics to monitor:

1. **eLocal ping success rate**: `SELECT call_status, COUNT(*) FROM elocal_leads GROUP BY call_status`
2. **Billable calls**: `SELECT COUNT(*) FROM elocal_leads WHERE billable = true`
3. **Revenue tracking**: `SELECT SUM(bid_price) FROM elocal_leads WHERE billable = true`
4. **Coverage by zip**: `SELECT zip_code, call_status, COUNT(*) FROM elocal_leads GROUP BY zip_code, call_status`

## Troubleshooting

### "elocal_api": "missing" in health check
- Check environment variable is set: `ELOCAL_API_KEY`
- Redeploy functions after setting environment variable

### No eLocal pings in database
- Check `elocal_leads` table exists
- Verify voice webhook deployment was successful
- Check Supabase logs for function errors

### Calls not bridging
- Verify eLocal API response in function logs
- Check `call_status` in `elocal_leads` table
- Test with different zip codes (some may have no coverage)

### Telegram notifications missing
- Verify `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` environment variables
- Check function logs for Telegram API errors

## Files Changed

- ✅ `supabase/migrations/create_elocal_leads.sql` (new)
- ✅ `supabase/functions/voice-webhook/index.ts` (updated)
- ✅ `nextdoor/templates.json` (phone number updated)
- ✅ `~/.env` (eLocal API key added)
- ✅ `DEPLOY-ELOCAL.md` (this file)

## Next Steps

After successful deployment and testing:

1. **Go Live**: Work with eLocal to move campaign from development to production
2. **Final Pricing API**: Implement `/call/final_pricing` endpoint for bid optimization
3. **Enhanced Monitoring**: Set up alerts for low ping success rates
4. **A/B Testing**: Test different need IDs vs catch-all for conversion rates