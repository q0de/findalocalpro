# Research: Verification Data Sources & Methodology

> Researched: 2026-02-20

## 1. IDFPR License Lookup

### Single Lookup
- **URL:** https://online-dfpr.micropact.com/lookup/licenselookup.aspx
- **Also:** https://ilesonline.idfpr.illinois.gov/DFPR/Lookup/LicenseLookup.aspx (newer CORE system)
- **Method:** ASP.NET WebForms — requires Playwright/headless browser
- **Updates:** Daily
- **Approved as primary source** by The Joint Commission, NCQA, and AOA

### Bulk Lookup
- **URL:** Referenced on https://idfpr.illinois.gov/checklicense.html
- **Instructions PDF:** https://idfpr.illinois.gov/content/dam/soi/en/web/idfpr/forms/data-portal-search-for-licenses.pdf
- **Scope:** Division of Professional Regulation, Division of Real Estate, collection agencies under DFI
- **Updates:** Weekly
- **Key insight:** This is a DATA PORTAL — may support structured queries or CSV export. Need to access and explore.

### Illinois Open Data Portal
- **data.illinois.gov** — searched but no direct IDFPR license dataset found as downloadable CSV
- **Next step:** Access the bulk lookup data portal directly and explore its export capabilities

### Recommended Approach
1. **Primary:** Use the bulk lookup data portal for batch verification
2. **Fallback:** Playwright scraper for single lookups
3. **Supplement:** Tavily search `"[name]" IDFPR license Illinois` for quick checks

---

## 2. DuPage County Contractor Registration

### ✅ PUBLIC DATABASE EXISTS!
- **Search URL:** https://aca-prod.accela.com/DUPAGE/GeneralProperty/PropertyLookUp.aspx?isLicensee=Y&TabName=Home
- **Platform:** Accela Citizen Access (common gov platform)
- **Searchable by:** Type, Licensing Board, Number, Name, Business Name, Address, Trade, License #
- **Full contractor list (PDF):** Available via report link on county site

### Registration Requirements
- ALL general and sub-contractors in unincorporated DuPage County must register
- Plumbers, irrigation & fire alarm contractors register for free but still required
- Valid for ONE YEAR from registration date
- Certificate of Insurance required (building & zoning dept as holder)
- Contact: 630-407-6700

### Recommended Approach
1. **Primary:** Scrape Accela portal — it's a structured web app with search params
2. **Bulk:** Download the registered contractors PDF report for initial seeding
3. The Accela platform likely has API endpoints (common with Accela implementations)

---

## 3. Google Maps MCP (Grounding Lite)

### What It Is
- **Official Google MCP server:** https://mapstools.googleapis.com/mcp
- **Launched:** December 10, 2025
- **Name:** Maps Grounding Lite

### Available Tools
| Tool | What It Does |
|------|-------------|
| `search_places` | Find businesses, get reviews, ratings, hours, phone, address |
| `lookup_weather` | Weather data (not relevant for us) |
| `compute_routes` | Routing (not relevant) |

### search_places Details
- **Input:** `text_query` (required), `location_bias` (optional), `language_code`, `region_code`
- **Returns:** Business name, address, phone, rating, reviews, hours, photos
- **Example:** `"plumbers in Downers Grove, IL"` returns local business profiles

### How to Use
```bash
curl --location 'https://mapstools.googleapis.com/mcp' \
  --header 'content-type: application/json' \
  --header 'accept: application/json, text/event-stream' \
  --data '{
    "method": "tools/call",
    "params": {
      "name": "search_places",
      "arguments": {
        "text_query": "plumbers in Downers Grove, IL"
      }
    },
    "jsonrpc": "2.0",
    "id": 1
  }'
```

### Auth
- Likely requires Google Cloud API key or OAuth
- Need to check if Maps Grounding Lite has a free tier
- Alternative: Direct Google Places API (already in our stack)
- Also: `mcp-google-map` community MCP server on GitHub (https://github.com/cablate/mcp-google-map)

### Value for FindALocalPro
- **Reviews + Ratings:** Direct from Google — most trusted source
- **Business info:** Hours, phone, address, photos — enrichment data for free
- **Discovery:** Find new providers to verify

---

## 4. BBB + IL SOS via Search APIs

### BBB
- **Direct scraping:** Blocked (JS-rendered, returns "No Results" for requests lib)
- **Tavily/Brave approach:** Search `"Business Name" site:bbb.org Illinois` returns rating in snippets
- **Reliability:** BBB ratings (A+ through F) and accreditation status usually appear in search snippets
- **Recommendation:** Tavily search as primary, Playwright as fallback

### IL Secretary of State
- **Direct scraping:** Site blocks/times out with requests lib
- **URL:** https://apps.ilsos.gov/corporatellc/CorporateLlcController
- **Tavily/Brave approach:** Search `"Business Name LLC" site:ilsos.gov` 
- **Alternative:** The SOS site may work with Playwright (ASP.NET form similar to IDFPR)
- **Recommendation:** Try Playwright first (more reliable structured data), Tavily as supplement

---

## 5. Revised Scraper Architecture

| Source | Primary Method | Fallback | Data Frequency |
|--------|---------------|----------|----------------|
| IDFPR | Bulk data portal → Playwright | Tavily search | Monthly |
| DuPage County | Accela portal scraper | PDF report download | Quarterly |
| IL SOS | Playwright | Tavily `site:ilsos.gov` | Quarterly |
| BBB | Tavily `site:bbb.org` | Playwright | Quarterly |
| Google reviews | Google Maps MCP `search_places` | Google Places API | Weekly |
| Enrichment | Twilio outbound calls | Onboarding form | Ongoing |

---

## 6. Next Steps

1. [ ] Access IDFPR bulk data portal — explore export/API options
2. [ ] Test Accela portal scraping for DuPage contractor data
3. [ ] Test Google Maps MCP endpoint with API key
4. [ ] Build Tavily-based BBB lookup wrapper
5. [ ] Test Playwright on IL SOS site
6. [ ] Download DuPage registered contractor PDF for initial provider seeding
