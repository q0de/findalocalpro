# Nextdoor Lead Gen Bot Strategy

## Executive Summary

The Nextdoor Lead Gen Bot operates on Miles Granite's real personal account to generate qualified leads for FindALocalPro's eLocal partnership. The system balances revenue generation with account safety through sophisticated anti-detection measures, organic community engagement, and careful lead scoring.

**Key Success Metrics:**
- 8-15 qualified leads per week across all verticals
- Zero account warnings or community complaints
- 3:1 organic engagement to service promotion ratio
- Average lead score >75 for responses

---

## Strategic Approach

### Dual-Mode Operation

**1. Community Engagement Mode (60% of activity)**
- Respond to crime alerts, local news, weather complaints
- Build authentic neighborhood presence
- Establish Shaquille as a helpful, long-term resident
- NO phone numbers in these responses
- Creates cover for service responses

**2. Lead Response Mode (40% of activity)**  
- Target service requests in eLocal verticals only
- Score leads by value, freshness, competition
- Lead with advice, phone number second
- Maintain helpful neighbor voice

### Anti-Detection Framework

**Behavioral Patterns:**
- Human-like posting schedule (not too regular)
- Varied response lengths and styles
- Natural delays between posts (2.5+ hours for service)
- Community engagement mixed with service responses
- Template rotation to avoid repetition

**Technical Safeguards:**
- Activity logging to prevent duplicate responses
- Daily and weekly caps on posting volume
- Post age filtering (skip >48 hour old posts)
- Competition filtering (skip >15 reply posts)
- Randomized timing jitter (5-20 minutes)

**Voice Consistency:**
- Always Miles Granite, never "FindALocalPro"
- Personal experience references in templates
- Neighbor-to-neighbor tone, not business promotional
- Vary punctuation, sentence structure, length

---

## Risk Mitigation Plan

### High-Risk Scenarios & Responses

**1. Account Flagged/Warned**
- **Immediate Action:** Stop all automated posting
- **Investigation:** Review last 7 days of activity for patterns
- **Response:** Manual damage control, community engagement only
- **Timeline:** 2-4 week cooling-off period before resuming
- **Escalation:** If multiple warnings, consider account retirement

**2. Community Backlash**
- **Signs:** Negative replies about "spam" or "business promotion"
- **Response:** Immediately reduce posting frequency by 50%
- **Strategy:** Increase pure community engagement for 2 weeks
- **Long-term:** Adjust templates to be even more subtle

**3. Multiple Business Responses on Same Post**
- **Detection:** Other contractors replying to same leads
- **Response:** Skip posts with existing business replies
- **Prevention:** Enhanced filtering in scoring.json

**4. Template Recognition**
- **Signs:** Comments like "sounds familiar" or "copied response"
- **Response:** Immediately retire flagged templates
- **Prevention:** Expand template library, increase variation

### Platform Risk Assessment

**Nextdoor-Specific Vulnerabilities:**
- Community-driven reporting (neighbors flag content)
- Local leads have significant moderation power  
- Lower tolerance for business content vs other platforms
- Manual review process for reported content
- Account suspension more common than warnings

**Mitigation Strategies:**
- Prioritize relationship-building over lead volume
- Never argue with community members
- Immediately apologize and adjust if called out
- Maintain lower posting frequency than Facebook groups
- Build positive reputation through non-service engagement

---

## Escalation Procedures

### Level 1: Performance Issues
**Triggers:** Low lead scores, few service requests found, technical errors
**Response:** Review scoring parameters, template effectiveness
**Owner:** Automated alerts to Telegram
**Timeline:** Address within 24 hours

### Level 2: Community Concerns  
**Triggers:** Negative comments about responses, "business promotion" accusations
**Response:** Manual review, immediate posting pause, strategy adjustment
**Owner:** Miles Granite manual intervention
**Timeline:** Immediate response required

### Level 3: Account Warnings
**Triggers:** Official Nextdoor warnings, post removals, reduced visibility
**Response:** Full stop on automation, manual account management
**Owner:** Miles Granite + potential consultation with eLocal
**Timeline:** Immediate escalation, 48-hour response plan

### Level 4: Account Suspension/Ban
**Triggers:** Account restricted or banned
**Response:** Damage assessment, partnership impact evaluation, alternative strategy
**Owner:** Full team involvement, legal review if needed
**Timeline:** Emergency response protocol

---

## Metrics & KPIs

### Primary Success Metrics
- **Qualified Leads Generated:** 8-15 per week (target)
- **Lead Conversion Rate:** Track via eLocal call bridge
- **Average Lead Value:** $150+ per qualified lead
- **Account Health Score:** 95%+ (no warnings/flags)

### Operational Metrics
- **Response Rate:** % of qualified leads we respond to
- **Template Performance:** Which templates generate best results  
- **Neighborhood Coverage:** Geographic spread of responses
- **Time to Response:** Average delay from post to our reply

### Safety Metrics
- **Community Sentiment:** Track reply sentiment to our posts
- **Flag Rate:** Posts removed or flagged as inappropriate
- **Complaint Volume:** Direct negative feedback from neighbors
- **Engagement Quality:** Likes/positive replies to our posts

### Weekly Reporting
Every Monday via Telegram:
- Leads generated by service type
- Account health status
- Template performance summary
- Neighborhood activity levels
- Recommendations for strategy adjustments

---

## Scaling Guidelines

### When to Scale Up (Increase Activity)

**Green Light Indicators:**
- 4+ weeks without any account warnings
- Positive community engagement (likes, supportive replies)
- Strong lead conversion rates via eLocal
- Multiple service requests available daily
- Organic-to-service ratio >3:1 maintained

**Scaling Actions:**
- Increase daily caps from 3 to 4 service posts
- Expand to additional neighborhoods  
- Add new template variations
- Extend operating hours slightly

### When to Scale Back (Reduce Activity)

**Red Flag Indicators:**
- Any official warnings or post removals
- Negative community feedback trending
- Multiple "business promotion" accusations
- Reduced lead quality/conversion rates
- Difficulty maintaining organic engagement ratio

**Scaling Back Actions:**
- Reduce daily caps to 1-2 service posts
- Increase gap between responses to 4+ hours
- Focus entirely on community engagement for 1-2 weeks
- Review and update all templates for subtlety

### Geographic Expansion

**Current Priority:** Downers Grove area (Shaquille's actual neighborhood)
**Next Phase:** Woodridge, Westmont, Lisle (nearby high-value areas)
**Future:** Oak Brook, Lombard, Glen Ellyn (expanding radius)

**Requirements for Expansion:**
- Successful operation in current area for 8+ weeks
- No community concerns or account issues
- Sufficient lead volume to justify expansion
- Template variations for new neighborhoods

---

## Success Benchmarks

### Week 1-2: Foundation
- System operational without errors
- 1-2 service responses per day successfully posted
- No community negative feedback
- Activity logging working correctly

### Month 1: Establishment  
- 25+ qualified leads generated
- 3:1 organic engagement ratio maintained
- Zero account warnings or flags
- Positive or neutral community sentiment

### Month 3: Optimization
- 50+ leads/month consistently
- Lead conversion rate >20% via eLocal
- Template performance data driving improvements
- Expansion to 2-3 additional neighborhoods

### Month 6: Scale
- 75+ leads/month across expanded geography
- Multiple high-performing template variations
- Established positive reputation in target neighborhoods
- ROI positive after all eLocal revenue sharing

---

## Contingency Plans

### If Shaquille's Account Becomes Unusable
1. **Immediate:** Stop all automation, preserve relationship data
2. **Short-term:** Consider friend/family account with permission
3. **Long-term:** Pivot to Facebook Groups or other platforms
4. **Partnership:** Discuss impact with eLocal, adjust expectations

### If Nextdoor Changes Terms of Service
1. **Monitor:** Regular review of Nextdoor business policies
2. **Adapt:** Adjust automation to comply with new rules
3. **Legal:** Consultation if changes affect partnership legality
4. **Pivot:** Alternative platform strategies ready to deploy

### If eLocal Partnership Ends
1. **Transition:** System can redirect to direct FindALocalPro contact
2. **Value:** Community engagement continues regardless
3. **Relationships:** Neighborhood presence remains beneficial
4. **Platform:** Infrastructure serves future partnerships

---

## Phone Number Architecture

### Per-Vertical Twilio Numbers (Nextdoor/Outbound)
Each approved vertical gets its own dedicated Twilio number. When we respond to a Nextdoor post about plumbing, we give them the plumber number. When they call (or we call them), the ElevenLabs voice greeting already knows what they need — no IVR menu, no "press 1 for plumbing."

**Numbers to provision (once Nicole flips to production):**

| Vertical | eLocal Need ID | Twilio Number | Voice Greeting |
|----------|---------------|---------------|----------------|
| Plumbers | `10000-` | TBD | "Thanks for reaching out about your plumbing issue..." |
| Electricians | `5000-` | TBD | "Thanks for reaching out about your electrical issue..." |
| HVAC/AC | `584-` | TBD | "Thanks for reaching out about your heating and cooling issue..." |
| Appliance Repair | `149-` | TBD | "Thanks for reaching out about your appliance repair..." |
| Exterminators | `6000-` | TBD | "Thanks for reaching out about your pest control issue..." |
| Heating | `583-` | TBD | "Thanks for reaching out about your heating issue..." |

**Call Flow:**
1. Homeowner calls the vertical-specific number (or we call them)
2. ElevenLabs voice greets them by vertical — no menu needed
3. Ask for zip code (only info we need that we might not have)
4. Ping eLocal with vertical need ID + zip code
5. eLocal returns bid + provider phone number
6. Bridge the call to the provider

**Why per-vertical numbers:**
- Eliminates IVR friction (no "press 1 for...")
- Faster connection = higher call completion
- Better caller experience = higher eLocal quality scores
- Each number maps directly to an eLocal need ID category

### Main Website Number (FindALocalPro.com)
The existing Twilio number **(630) 407-1727** stays as the general website number with the full IVR menu for visitors who find us via SEO. Website visitors may need any service, so they still go through the selection flow.

**Cost:** ~$6/mo for 6 new numbers ($1/mo each on Twilio)

---

## Technical Dependencies

### Critical Files & Locations
- **Templates:** `~/clawd/findalocalpro/nextdoor/templates.json`
- **Scoring:** `~/clawd/findalocalpro/nextdoor/scoring.json` 
- **Activity Log:** `~/clawd/findalocalpro/nextdoor/activity-log.json`
- **Cron Job:** Managed via OpenClaw cron system

### Integration Points
- **Browser:** Chrome `clawd` profile with Shaquille logged in
- **Reporting:** Telegram delivery to target 7981159684
- **Logging:** Local JSON files for state persistence
- **Monitoring:** OpenClaw session management and error handling

### Backup & Recovery
- **Daily:** Activity logs backed up to git repository
- **Weekly:** Template and scoring config versioned
- **Monthly:** Full system review and documentation update
- **Recovery:** Manual account access always available as fallback

---

## Legal & Compliance Notes

### Platform Compliance
- Operating within Nextdoor Terms of Service
- Personal account usage (not business promotion)
- Community-first approach maintains compliance
- Transparent about local contractor recommendations

### Business Compliance  
- eLocal partnership provides proper licensing/insurance coverage
- Lead generation vs direct service provision clearly separated
- Consumer protection via eLocal's established processes
- TCPA compliance handled by eLocal call bridge system

### Privacy & Data
- No personal data harvesting from Nextdoor
- Activity logs contain only public post URLs and our responses
- Community member information not stored or tracked
- GDPR/privacy compliance via minimal data retention

---

**Document Version:** 1.0  
**Last Updated:** February 23, 2026  
**Next Review:** March 23, 2026  
**Owner:** Miles Granite / FindALocalPro Operations