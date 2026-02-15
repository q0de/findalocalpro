# FindALocalPro — Landing Page

Professional landing page for [findalocalpro.com](https://findalocalpro.com) — a home services platform connecting homeowners with trusted local professionals across 22+ trade categories.

## Quick Start

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

Output goes to `dist/` — deploy to Vercel, Netlify, or any static host.

## Deploy to Vercel

1. Connect this repo to [Vercel](https://vercel.com)
2. Framework: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. That's it — auto-deploys on push to `main`

## Tech Stack

- **React 19** + TypeScript
- **Vite** for build tooling
- **Tailwind CSS v3** (CDN) for styling
- **Google Material Symbols** for icons
- **Plus Jakarta Sans** for typography

## Service Categories

Plumbing, HVAC, Electrician, Water Damage, Mold Removal, Roofing, Appliance Repair, Pest Control, Locksmith, Towing, Siding, Bath Remodeling, Bathroom Remodel, Kitchen Remodeling, Flooring, Landscaping, Tree Services, Carpet Cleaning, Handyman, Gutters, Junk Removal, Solar

## Page Sections

1. **Navbar** — sticky nav with logo + links + "Get a Free Quote" CTA
2. **Hero** — background image, headline, two CTAs
3. **Trust Bar** — Licensed & Insured, Free Estimates, 24/7 Emergency, Satisfaction Guaranteed
4. **Services Grid** — 22 service cards with Material icons
5. **How It Works** — 3-step process
6. **About** — company story + stats
7. **Contact** — quote request form with service dropdown
8. **Final CTA** — blue card with amber button
9. **Footer** — logo, legal links, social icons

## SMS Webhook Auto-Responder

The `/api/sms` endpoint provides an automated SMS lead qualification system via Twilio webhook integration.

### Features

- **4-Step Conversation Flow:** Service type → Zip code → Name → Confirmation
- **Intelligent Service Matching:** Handles variations like "plumber" → "plumbing"
- **State Management:** Tracks conversation progress per phone number
- **Lead Logging:** Stores qualified leads in JSONL format
- **Opt-out Handling:** Supports STOP/START commands
- **Urgent Flag:** Detects and flags urgent requests

### Twilio Setup

1. **Get a Twilio Phone Number**
   - Log into [Twilio Console](https://console.twilio.com)
   - Navigate to Phone Numbers → Manage → Buy a number
   - Choose a number with SMS capabilities

2. **Configure Webhook URL**
   - Go to Phone Numbers → Manage → Active numbers
   - Click your phone number
   - Set webhook URL to: `https://your-domain.vercel.app/api/sms`
   - HTTP method: `POST`
   - Account SID: Your Twilio Account SID (starts with `AC`)

3. **Test the Flow**
   ```
   Text your Twilio number: "Hello"
   Bot: "Hi! Thanks for reaching out to FindALocalPro. What type of service do you need? (Plumbing, HVAC, Electrical, Pest Control, or Appliance Repair)"
   
   You: "plumbing"
   Bot: "Great! What's your zip code?"
   
   You: "12345"  
   Bot: "Got it! What's your name so we can connect you with a pro?"
   
   You: "John Smith"
   Bot: "Thanks John Smith! A local plumbing pro will be reaching out shortly. If you need immediate help, reply URGENT."
   ```

### Conversation Flow

| Step | User Input | Bot Response | State Transition |
|------|------------|--------------|------------------|
| 1 | Any message | "Hi! Thanks for reaching out to FindALocalPro. What type of service do you need? (Plumbing, HVAC, Electrical, Pest Control, or Appliance Repair)" | `initial` → `awaiting_service` |
| 2 | Service type | "Great! What's your zip code?" | `awaiting_service` → `awaiting_zip` |
| 3 | Zip code | "Got it! What's your name so we can connect you with a pro?" | `awaiting_zip` → `awaiting_name` |
| 4 | Name | "Thanks [name]! A local [service] pro will be reaching out shortly. If you need immediate help, reply URGENT." | `awaiting_name` → `complete` |

### Special Commands

- **STOP**: Unsubscribes user, removes from session store
- **START**: Re-subscribes user, starts new conversation
- **URGENT**: Flags request as urgent (works during or after conversation)

### Supported Services

The system recognizes these services and common variations:

- **Plumbing** (plumb, plumber, pipe, leak)
- **HVAC** (heating, cooling, air conditioning, furnace)  
- **Electrical** (electric, electrician, wiring, outlet)
- **Pest Control** (pest, bug, exterminator, insects)
- **Appliance Repair** (appliance, washer, dryer, refrigerator, dishwasher)

### Data Storage

- **Sessions**: `/tmp/findalocalpro-data/sessions.json`
- **Leads**: `/tmp/findalocalpro-data/leads.jsonl`

Sample lead record:
```json
{
  "phoneNumber": "+1234567890",
  "serviceType": "plumbing", 
  "zipCode": "12345",
  "name": "John Smith",
  "timestamp": "2024-02-15T20:30:00.000Z",
  "urgentFlag": false
}
```

### Testing Locally

```bash
# Install dependencies
npm install

# Test the webhook logic (doesn't require Twilio)
node test-sms.js
```

### Deployment

The SMS webhook automatically deploys with your Vercel site. No additional configuration needed — just ensure your Twilio webhook URL points to your deployed domain.

