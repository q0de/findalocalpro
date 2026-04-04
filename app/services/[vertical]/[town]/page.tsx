import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SUPABASE_URL, SUPABASE_ANON } from '@/lib/supabase';

/* ------------------------------------------------------------------ */
/*  Service verticals (same as parent [vertical]/page.tsx)            */
/* ------------------------------------------------------------------ */

interface ServiceInfo {
  title: string;
  singular: string;
  trade: string;
  icon: string;
  materialIcon: string;
  iconColor: string;
  iconBg: string;
  description: string;
  services: { name: string; desc: string }[];
}

const verticals: Record<string, ServiceInfo> = {
  plumbing: {
    title: 'Plumbing Services', singular: 'Plumber', trade: 'plumbing', icon: '🔧', materialIcon: 'water_drop', iconColor: 'text-blue-500', iconBg: 'bg-blue-100',
    description: 'Licensed plumbers for leak repair, drain cleaning, water heaters, pipe repair. Verified against state records.',
    services: [
      { name: 'Leak Detection & Repair', desc: 'Find and fix hidden leaks before they cause water damage.' },
      { name: 'Drain Cleaning', desc: 'Clear stubborn clogs in sinks, showers, and main sewer lines.' },
      { name: 'Water Heater Service', desc: 'Installation, repair, and maintenance for tank and tankless systems.' },
      { name: 'Pipe Repair & Replacement', desc: 'Fix burst pipes, corrosion, and outdated plumbing systems.' },
      { name: 'Fixture Installation', desc: 'Faucets, toilets, garbage disposals, and more.' },
      { name: 'Emergency Plumbing', desc: 'Urgent plumbing problems that can\'t wait until tomorrow.' },
    ],
  },
  hvac: {
    title: 'HVAC Services', singular: 'HVAC Technician', trade: 'hvac', icon: '❄️', materialIcon: 'mode_fan', iconColor: 'text-purple-500', iconBg: 'bg-purple-100',
    description: 'Expert HVAC service — AC repair, furnace service, duct cleaning, and new system installation. All verified.',
    services: [
      { name: 'AC Repair & Maintenance', desc: 'Keep your cooling system running efficiently all summer.' },
      { name: 'Furnace Service', desc: 'Heating repair, tune-ups, and new system installation.' },
      { name: 'System Installation', desc: 'New HVAC systems sized and installed for your home.' },
      { name: 'Duct Cleaning & Repair', desc: 'Improve air quality and system efficiency with clean ducts.' },
      { name: 'Thermostat Installation', desc: 'Smart thermostat setup for better comfort and energy savings.' },
      { name: 'Heat Pump Service', desc: 'Installation and repair for energy-efficient heat pump systems.' },
    ],
  },
  electricians: {
    title: 'Electrical Services', singular: 'Electrician', trade: 'electrical', icon: '⚡', materialIcon: 'bolt', iconColor: 'text-yellow-600', iconBg: 'bg-yellow-100',
    description: 'Licensed electricians for wiring, panel upgrades, EV chargers, emergency repairs. Verified against state records.',
    services: [
      { name: 'Electrical Repairs', desc: 'Fix outlets, switches, breakers, and wiring issues safely.' },
      { name: 'Panel Upgrades', desc: 'Upgrade your electrical panel to handle modern power demands.' },
      { name: 'Lighting Installation', desc: 'Indoor, outdoor, recessed, and landscape lighting.' },
      { name: 'Wiring & Rewiring', desc: 'New construction wiring or updating old knob-and-tube systems.' },
      { name: 'EV Charger Installation', desc: 'Level 2 home charging stations for electric vehicles.' },
      { name: 'Generator Installation', desc: 'Whole-home backup generators for power outage protection.' },
    ],
  },
  roofing: {
    title: 'Roofing Services', singular: 'Roofer', trade: 'roofing', icon: '🏠', materialIcon: 'roofing', iconColor: 'text-red-500', iconBg: 'bg-red-100',
    description: 'Licensed roofing contractors for roof repair, replacement, inspections, and storm damage. Verified credentials.',
    services: [
      { name: 'Roof Repair', desc: 'Fix leaks, damaged shingles, and flashing issues.' },
      { name: 'Roof Replacement', desc: 'Full roof replacement with quality materials and warranty.' },
      { name: 'Storm Damage Repair', desc: 'Emergency repairs after hail, wind, or tree damage.' },
      { name: 'Roof Inspection', desc: 'Thorough inspection for insurance claims or home sales.' },
      { name: 'Gutter Installation', desc: 'New gutters and gutter guard systems.' },
      { name: 'Flat Roof Service', desc: 'Specialized repair and coating for flat or low-slope roofs.' },
    ],
  },
  'pest-control': {
    title: 'Pest Control Services', singular: 'Pest Control Pro', trade: 'pest-control', icon: '🐜', materialIcon: 'pest_control', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100',
    description: 'Pest control for ants, roaches, rodents, termites, bed bugs. Licensed, insured pros.',
    services: [
      { name: 'Ant & Roach Control', desc: 'Eliminate common household pests and prevent them from returning.' },
      { name: 'Rodent Removal', desc: 'Mice and rat control with exclusion to keep them out.' },
      { name: 'Termite Treatment', desc: 'Protect your home\'s structure from termite damage.' },
      { name: 'Bed Bug Treatment', desc: 'Thorough bed bug elimination using proven methods.' },
      { name: 'Mosquito & Tick Control', desc: 'Yard treatments to reduce biting insects around your home.' },
    ],
  },
  'appliance-repair': {
    title: 'Appliance Repair Services', singular: 'Appliance Repair Tech', trade: 'appliance-repair', icon: '🔌', materialIcon: 'settings', iconColor: 'text-gray-600', iconBg: 'bg-gray-100',
    description: 'Fast appliance repair — fridge, washer, dryer, dishwasher, oven, garbage disposal. Local techs, same-day.',
    services: [
      { name: 'Refrigerator Repair', desc: 'Fix cooling issues, ice makers, and other fridge problems.' },
      { name: 'Washer & Dryer Repair', desc: 'Get your laundry machines back up and running.' },
      { name: 'Dishwasher Repair', desc: 'Fix leaks, drainage issues, and cleaning problems.' },
      { name: 'Oven & Range Repair', desc: 'Repair heating elements, igniters, and temperature issues.' },
      { name: 'Microwave Repair', desc: 'Fix turntable, heating, and display problems.' },
      { name: 'Garbage Disposal Repair', desc: 'Jammed, leaking, or broken disposal units.' },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Town data (same as locations/[town]/page.tsx)                     */
/* ------------------------------------------------------------------ */

interface TownInfo {
  name: string;
  county: string;
  state: string;
  zip: string[];
  population: string;
  description: string;
  neighborhoods: string[];
  localTips: string;
  commonIssues: string[];
}

const towns: Record<string, TownInfo> = {
  'downers-grove': {
    name: 'Downers Grove', county: 'DuPage', state: 'IL', zip: ['60515', '60516'], population: '49,670',
    description: 'Downers Grove is a thriving village in the heart of DuPage County known for its tree-lined streets, historic downtown, and strong sense of community. With homes ranging from 1920s bungalows to modern new construction, homeowners here need reliable pros who understand both older systems and modern building codes.',
    neighborhoods: ['Downtown Downers Grove', 'Belmont', 'Fairview', 'Prince Pond', 'Prentiss Creek', 'Meadowbrook'],
    localTips: 'Many Downers Grove homes built before 1960 still have galvanized steel pipes and knob-and-tube wiring. If your home is in the Belmont or Fairview area, ask your contractor about lead pipe replacement programs through the village.',
    commonIssues: ['Aging galvanized pipes in pre-1960 homes', 'Basement flooding from high water table', 'Ice dam damage on older roofs', 'Electrical panel upgrades for modern loads', 'Sump pump failures during spring thaws'],
  },
  'westmont': {
    name: 'Westmont', county: 'DuPage', state: 'IL', zip: ['60559'], population: '24,900',
    description: 'Westmont sits right next to Downers Grove and shares many of the same home maintenance challenges. The village has a mix of 1970s-era townhomes and single-family residences.',
    neighborhoods: ['Downtown Westmont', 'Ty Warner Park area', 'Oakwood', 'Pasquinelli Estates'],
    localTips: 'Westmont experienced devastating tornado damage in 1991. Many homes were rebuilt or heavily repaired afterward. If buying or maintaining a home rebuilt in 1991-1993, verify all permits were properly closed with the village.',
    commonIssues: ['Townhome shared-wall HVAC efficiency problems', 'Foundation settling near Ogden Avenue corridor', 'Roof wear from 1990s-era rebuilds nearing replacement age', 'Pest control — ant and rodent pressure from nearby retention ponds'],
  },
  'lisle': {
    name: 'Lisle', county: 'DuPage', state: 'IL', zip: ['60532'], population: '23,270',
    description: 'Lisle is known for the Morton Arboretum and its family-friendly neighborhoods. Many homes were built in the 1980s-1990s suburban boom, meaning roofs, HVAC systems, and water heaters from that era are now reaching end-of-life.',
    neighborhoods: ['Green Trails', 'River Bend', 'Four Lakes', 'Kingston', 'Lisle Station Park area'],
    localTips: 'The DuPage River runs through Lisle, and homes near the river should have sump pumps with battery backup. Lisle also has strict tree removal ordinances — check with the village before removing any trees.',
    commonIssues: ['Aging 1980s-90s HVAC systems reaching end-of-life', 'Sump pump reliance near DuPage River', 'Original builder-grade water heaters failing', 'Tree root intrusion into sewer lines', 'Insulation gaps in 1980s construction'],
  },
  'woodridge': {
    name: 'Woodridge', county: 'DuPage', state: 'IL', zip: ['60517'], population: '33,500',
    description: 'Woodridge is a diverse, growing community in southern DuPage County. The village has expanded significantly since the 1990s with a mix of housing eras from 1970s split-levels to 2020s smart homes.',
    neighborhoods: ['Seven Bridges', 'Janes Avenue corridor', 'Crabtree', 'Summerfield', 'Forest Glen'],
    localTips: 'Seven Bridges is Woodridge\'s premium subdivision with HOA requirements that can affect exterior work — check with your HOA before hiring a roofer or starting exterior renovations.',
    commonIssues: ['Split-level homes with multiple HVAC zone challenges', 'Sewer lateral issues in older sections', 'HOA compliance for exterior contractors', 'Pest pressure from nearby forest preserves', 'Electrical upgrades for EV charger installations'],
  },
  'darien': {
    name: 'Darien', county: 'DuPage', state: 'IL', zip: ['60561'], population: '22,200',
    description: 'Darien is a quiet residential community between Downers Grove and Willowbrook featuring well-maintained homes, many built in the 1960s-1980s. Stable housing stock means consistent demand for maintenance and modernization.',
    neighborhoods: ['The Farmingdale area', 'Indian Head Park border', 'Cass Avenue corridor', 'Brookhaven'],
    localTips: 'Darien homes along the Cass Avenue corridor often have older septic systems that may need conversion to municipal sewer. The village has been expanding sewer access — check with public works before investing in septic repairs.',
    commonIssues: ['Septic to sewer conversion needs', '1960s-era electrical systems needing panel upgrades', 'Basement waterproofing in clay-heavy soil', 'HVAC ductwork in low-clearance crawlspaces', 'Original steel casement windows creating insulation issues'],
  },
  'naperville': {
    name: 'Naperville', county: 'DuPage', state: 'IL', zip: ['60540', '60563', '60564', '60565'], population: '149,500',
    description: 'Naperville is one of the largest cities in Illinois and consistently ranked among the top places to live. With neighborhoods ranging from historic downtown Victorians to sprawling modern subdivisions, the demand for qualified home service professionals is enormous.',
    neighborhoods: ['Downtown Historic District', 'Ashwood Park', 'Cress Creek', 'White Eagle', 'Tall Grass', 'Hobson West'],
    localTips: 'Naperville has some of the strictest building permit requirements in DuPage County. Any electrical, plumbing, or structural work requires permits. Contractors who say "we don\'t need a permit" are a red flag.',
    commonIssues: ['Strict permit requirements catching unprepared homeowners', 'Historic district renovation restrictions downtown', 'Large-home HVAC zoning complexity', 'Irrigation system winterization and repair', 'High demand creating long wait times for quality pros'],
  },
  'lombard': {
    name: 'Lombard', county: 'DuPage', state: 'IL', zip: ['60148'], population: '44,050',
    description: 'Lombard — the "Lilac Village" — has a charming downtown and diverse housing stock spanning a full century of construction. From 1920s Craftsman homes to 1990s subdivisions, contractors need to handle everything from knob-and-tube rewiring to smart home installations.',
    neighborhoods: ['Downtown Lombard', 'Lilacia Park area', 'Glenbard East area', 'Four Season', 'Churchill'],
    localTips: 'Lombard\'s older homes near Main Street often have limestone foundations that can develop moisture issues. Don\'t assume a "wet basement" needs full waterproofing — tuckpointing and grading can solve it at a fraction of the cost.',
    commonIssues: ['Limestone foundation moisture in pre-1940 homes', 'Knob-and-tube wiring in historic properties', 'Clay sewer pipes cracking and allowing root intrusion', 'Asbestos in 1950s-60s homes requiring abatement', 'Galvanized to copper pipe transitions corroding'],
  },
  'glen-ellyn': {
    name: 'Glen Ellyn', county: 'DuPage', state: 'IL', zip: ['60137'], population: '28,200',
    description: 'Glen Ellyn combines small-town charm with excellent schools and a walkable downtown. The village has a strong mix of pre-war homes in the historic core and mid-century properties. Homeowners here invest in quality maintenance.',
    neighborhoods: ['Downtown Glen Ellyn', 'Lake Ellyn area', 'Churchill', 'Newton Park', 'Forest Glen'],
    localTips: 'Glen Ellyn has flooding concerns near Lake Ellyn and along the East Branch DuPage River. The village participates in FEMA flood mitigation programs — check if your property qualifies before paying for waterproofing.',
    commonIssues: ['Flood zone concerns near Lake Ellyn', 'Pre-war plumbing and electrical needing full replacement', 'Ice dams on steep-pitch vintage roofs', 'Tree root damage to sewer laterals', 'Radon levels — DuPage County is Zone 1 (highest risk)'],
  },
  'wheaton': {
    name: 'Wheaton', county: 'DuPage', state: 'IL', zip: ['60187', '60189'], population: '53,970',
    description: 'Wheaton is the county seat of DuPage County and home to several colleges. The city has a mix of grand older homes near downtown, post-war ranch homes, and newer construction on the outskirts.',
    neighborhoods: ['College Avenue corridor', 'Arrowhead', 'Danada', 'Stonehedge', 'Wheaton Oaks'],
    localTips: 'As the DuPage County seat, Wheaton requires contractor registration AND proper licensing. You can verify any contractor\'s permit history through the city\'s online portal before hiring.',
    commonIssues: ['Older homes near colleges converted to multi-unit needing code compliance', 'Foundation issues in clay-heavy soil', 'Aging municipal water infrastructure affecting home plumbing', 'HVAC efficiency in large older homes with poor insulation', 'Radon mitigation (DuPage County Zone 1)'],
  },
  'hinsdale': {
    name: 'Hinsdale', county: 'DuPage', state: 'IL', zip: ['60521'], population: '17,500',
    description: 'Hinsdale is one of the most affluent suburbs in the Chicago area, known for historic homes, top-rated schools, and meticulous property maintenance. Homeowners expect premium quality work.',
    neighborhoods: ['Southeast Hinsdale', 'Woodlands', 'Burns Field', 'Fullersburg', 'Katherine Legge Memorial Park area'],
    localTips: 'Hinsdale has a Historic Preservation Commission that reviews exterior changes to homes in the historic district. Your contractor needs to work within those guidelines or risk having work ordered removed.',
    commonIssues: ['Historic preservation compliance for exterior work', 'High-end system installations (generators, geothermal)', 'Large property landscape drainage and irrigation', 'Premium fixture and material requirements', 'Insurance and bonding verification (high-value properties)'],
  },
  'oak-brook': {
    name: 'Oak Brook', county: 'DuPage', state: 'IL', zip: ['60523'], population: '8,700',
    description: 'Oak Brook features corporate campuses, Oakbrook Center mall, and polo grounds. Residential areas have large-lot luxury homes and gated communities with significant service needs.',
    neighborhoods: ['Oak Brook Hills', 'Trinity Lakes', 'Ginger Creek', 'Midwest Club area'],
    localTips: 'Oak Brook has very specific building codes due to its mix of residential and commercial properties. Some residential streets are private roads — contractors may need HOA approval and proof of insurance.',
    commonIssues: ['Large-lot drainage and grading issues', 'Commercial-grade HVAC in luxury homes', 'HOA and village dual-approval requirements', 'Aged underground sprinkler systems', 'High-value property insurance requirements for contractors'],
  },
  'bolingbrook': {
    name: 'Bolingbrook', county: 'Will', state: 'IL', zip: ['60440', '60490'], population: '75,200',
    description: 'Bolingbrook straddles the DuPage-Will County border and is one of the fastest-growing communities in the region. Homes span every stage of their lifecycle, from 1970s originals to brand-new construction.',
    neighborhoods: ['Old Town', 'Colonial Village', 'Lakewood Falls', 'Winston Park', 'Ashbury'],
    localTips: 'Bolingbrook spans two counties (DuPage and Will), which can create confusion around permits. Make sure your contractor pulls permits from the correct county.',
    commonIssues: ['Dual-county permit confusion (DuPage vs Will)', '1970s-80s homes needing full system replacements', 'Large subdivision builds with known defects', 'Slab foundation cracking in some developments', 'Aggressive code enforcement on unpermitted work'],
  },
};

/* ------------------------------------------------------------------ */
/*  Phone numbers                                                     */
/* ------------------------------------------------------------------ */

const verticalPhones: Record<string, { display: string; tel: string }> = {
  plumbing:     { display: '(630) 756-5104', tel: '6307565104' },
  electricians: { display: '(630) 318-3024', tel: '6303183024' },
  hvac:         { display: '(630) 599-8262', tel: '6305998262' },
};
const DEFAULT_PHONE = { display: '(630) 407-1727', tel: '6304071727' };

/* ------------------------------------------------------------------ */
/*  Supabase data fetching                                            */
/* ------------------------------------------------------------------ */

interface Provider {
  id: string;
  name: string;
  slug: string;
  trade: string;
  trust_score: number | null;
  is_verified: boolean;
  year_established: number | null;
  phone: string | null;
  address: string | null;
}

interface VerificationCheck {
  business_id: string;
  source: string;
  status: string;
  summary: string;
}

async function getProvidersForTrade(trade: string): Promise<{ providers: Provider[]; checksMap: Record<string, VerificationCheck[]> }> {
  try {
    const headers = { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` };
    const provRes = await fetch(
      `${SUPABASE_URL}/rest/v1/businesses?is_active=eq.true&trust_score=gt.0&trade=eq.${trade}&select=id,name,slug,trade,trust_score,is_verified,year_established,phone,address&order=trust_score.desc`,
      { headers, next: { revalidate: 3600 } },
    );
    const providers: Provider[] = await provRes.json();

    let checksMap: Record<string, VerificationCheck[]> = {};
    if (providers.length > 0) {
      const ids = providers.map(p => p.id);
      const checksRes = await fetch(
        `${SUPABASE_URL}/rest/v1/verification_checks?business_id=in.(${ids.join(',')})&select=business_id,source,status,summary&order=checked_at.desc`,
        { headers, next: { revalidate: 3600 } },
      );
      const checksData: VerificationCheck[] = await checksRes.json();
      for (const c of checksData) {
        if (!checksMap[c.business_id]) checksMap[c.business_id] = [];
        if (!checksMap[c.business_id].some(existing => existing.source === c.source)) {
          checksMap[c.business_id].push(c);
        }
      }
    }
    return { providers, checksMap };
  } catch {
    return { providers: [], checksMap: {} };
  }
}

/* ------------------------------------------------------------------ */
/*  Static params — all 72 combos                                     */
/* ------------------------------------------------------------------ */

export async function generateStaticParams() {
  const combos: { vertical: string; town: string }[] = [];
  for (const v of Object.keys(verticals)) {
    for (const t of Object.keys(towns)) {
      combos.push({ vertical: v, town: t });
    }
  }
  return combos;
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                          */
/* ------------------------------------------------------------------ */

export async function generateMetadata({ params }: { params: Promise<{ vertical: string; town: string }> }): Promise<Metadata> {
  const { vertical, town: townSlug } = await params;
  const service = verticals[vertical];
  const town = towns[townSlug];
  if (!service || !town) return { title: 'Page Not Found | FindALocalPro' };

  const title = `${service.title} in ${town.name}, IL | FindALocalPro`;
  const description = `Find verified ${service.title.toLowerCase().replace(' services', '')} pros in ${town.name}, ${town.state}. Every contractor checked against 4 government databases. Free matching.`.slice(0, 155);
  const ogTitle = `${service.title} in ${town.name}, ${town.state}`;

  return {
    title,
    description,
    keywords: `${service.singular.toLowerCase()} ${town.name}, ${service.title.toLowerCase()} ${town.name} IL, licensed ${service.trade} ${town.name}, verified ${service.trade} near me, ${town.zip.join(', ')}`,
    alternates: {
      canonical: `https://findalocalpro.com/services/${vertical}/${townSlug}`,
    },
    openGraph: {
      title: ogTitle,
      description,
      type: 'website',
      url: `https://findalocalpro.com/services/${vertical}/${townSlug}`,
      images: [{ url: 'https://findalocalpro.com/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: ['https://findalocalpro.com/og-image.png'],
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Source labels for verification badges                              */
/* ------------------------------------------------------------------ */

const sourceLabels: Record<string, { icon: string; label: string }> = {
  idfpr: { icon: 'badge', label: 'IDFPR License' },
  bbb: { icon: 'workspace_premium', label: 'BBB' },
  buildzoom: { icon: 'construction', label: 'BuildZoom' },
  sos: { icon: 'account_balance', label: 'IL SOS' },
  google: { icon: 'star', label: 'Google' },
};

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */

export default async function ServiceTownPage({ params }: { params: Promise<{ vertical: string; town: string }> }) {
  const { vertical, town: townSlug } = await params;
  const service = verticals[vertical];
  const town = towns[townSlug];
  if (!service || !town) notFound();

  const phone = verticalPhones[vertical] ?? DEFAULT_PHONE;
  const { providers, checksMap } = await getProvidersForTrade(service.trade);

  /* --- Structured data --- */

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${service.title} in ${town.name}, ${town.state}`,
    description: `${service.description} Serving ${town.name}, ${town.state}.`,
    serviceType: service.trade,
    areaServed: {
      '@type': 'City',
      name: town.name,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: `${town.county} County, ${town.state}`,
      },
    },
    provider: {
      '@type': 'Organization',
      name: 'FindALocalPro',
      url: 'https://findalocalpro.com',
      telephone: phone.display,
    },
  };

  /* --- Cross-link data --- */

  const otherTowns = Object.entries(towns).filter(([slug]) => slug !== townSlug);
  const otherVerticals = Object.entries(verticals).filter(([key]) => key !== vertical);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <Header step={0} totalSteps={0} />

      <div className="max-w-5xl mx-auto px-6 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Services', href: '/directory' },
            { label: service.title, href: `/services/${vertical}` },
            { label: town.name },
          ]}
        />
      </div>

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-br from-brand-purple/5 via-white to-brand-pink/5 py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-sm font-bold mb-6">
                <span className={`material-symbols-outlined text-base ${service.iconColor}`}>{service.materialIcon}</span>
                {providers.length > 0 ? `${providers.length} Verified Pros` : 'Verified Professionals'}
              </div>

              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-800 mb-6 leading-[1.1]">
                {service.title}<br />
                <span className="text-brand-purple">in {town.name}, IL</span>
              </h1>

              <p className="text-lg text-slate-500 mb-8 max-w-lg">
                {service.description} Serving {town.name} and surrounding {town.county} County communities.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/get-matched" className="group inline-flex items-center justify-center gap-2 bg-brand-purple hover:bg-brand-pink text-white px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0">
                  <span className="material-symbols-outlined transition-transform group-hover:scale-110">chat</span>
                  Get Matched Free
                </Link>
                <a href={`tel:${phone.tel}`} className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 px-8 py-4 rounded-2xl font-black text-lg border-2 border-slate-200 transition-all shadow-lg hover:-translate-y-1">
                  <span className="material-symbols-outlined">call</span>
                  {phone.display}
                </a>
              </div>
            </div>

            {/* Quick stats card */}
            <div className="hidden md:block">
              <div className="bg-white rounded-3xl border-2 border-slate-100 p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${service.iconBg} ${service.iconColor}`}>
                    <span className="material-symbols-outlined text-3xl">{service.materialIcon}</span>
                  </div>
                  <div>
                    <p className="text-slate-800 font-black text-lg">{service.title}</p>
                    <p className="text-slate-400 text-sm">{town.name}, {town.state}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: 'verified_user', label: `${providers.length} verified pros`, desc: 'Checked against state records' },
                    { icon: 'schedule', label: 'Same-day matching', desc: 'Get connected in minutes' },
                    { icon: 'payments', label: '100% free', desc: 'No cost for homeowners' },
                    { icon: 'shield', label: '4 databases checked', desc: 'IDFPR, SOS, BBB, BuildZoom' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                      <span className="material-symbols-outlined text-brand-teal text-xl">{item.icon}</span>
                      <div>
                        <p className="text-slate-800 text-sm font-bold">{item.label}</p>
                        <p className="text-slate-400 text-xs">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VERIFIED PROS ================= */}
      {providers.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">
                Verified {service.title.replace(' Services', '')} Pros in {town.name}
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Every pro below has been checked against state licensing, business registration, and contractor databases.
              </p>
            </div>

            <div className="space-y-6">
              {providers.map((p) => {
                const checks = checksMap[p.id] || [];
                const passChecks = checks.filter(c => c.status === 'pass');
                const score = Math.round(p.trust_score || 0);

                return (
                  <Link key={p.id} href={`/pro/${p.slug}`} className="block group">
                    <div className="bg-white rounded-2xl border-2 border-slate-100 p-6 hover:border-brand-purple/30 hover:shadow-xl transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${service.iconBg} ${service.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                            <span className="material-symbols-outlined text-2xl">{service.materialIcon}</span>
                          </div>
                          <div>
                            <p className="font-black text-slate-800 text-lg group-hover:text-brand-purple transition-colors">{p.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              {p.year_established && <span className="text-xs text-slate-400">Est. {p.year_established}</span>}
                              {p.address && <span className="text-xs text-slate-400">{p.address}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {score >= 40 && (
                            <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-black bg-brand-teal text-white shadow-sm">
                              <span className="material-symbols-outlined text-sm">verified</span>
                              {score}/100
                            </span>
                          )}
                          <span className="material-symbols-outlined text-slate-300 group-hover:text-brand-purple group-hover:translate-x-1 transition-all">arrow_forward</span>
                        </div>
                      </div>
                      {passChecks.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                          {passChecks.map((check) => {
                            const src = sourceLabels[check.source] || { icon: 'fact_check', label: check.source };
                            return (
                              <span key={check.source} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-600 border border-slate-100">
                                <span className="material-symbols-outlined text-brand-teal text-sm">check_circle</span>
                                {src.label}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Link href="/directory" className="inline-flex items-center gap-2 text-brand-purple font-bold hover:underline">
                Browse Full Directory <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ================= SUB-SERVICES ================= */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 text-center mb-3">
            {service.title} in {town.name}
          </h2>
          <p className="text-slate-500 text-center mb-12">
            Common {service.title.toLowerCase()} we connect {town.name} homeowners with pros for
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.services.map((s) => (
              <div key={s.name} className="bg-white border-2 border-slate-100 rounded-2xl p-6 hover:border-brand-purple/30 hover:shadow-lg transition-all duration-300">
                <h3 className="font-black text-slate-800 mb-2">{s.name}</h3>
                <p className="text-slate-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TOWN-SPECIFIC CONTENT ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-black text-slate-800 mb-4">
            About {town.name}
          </h2>
          <p className="text-slate-600 leading-relaxed mb-8">{town.description}</p>

          {/* Local tip */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-2xl text-amber-600 mt-0.5">tips_and_updates</span>
              <div>
                <h3 className="font-black text-slate-900 mb-2">{town.name} Homeowner Tip</h3>
                <p className="text-slate-700 leading-relaxed">{town.localTips}</p>
              </div>
            </div>
          </div>

          {/* Common issues */}
          <h3 className="text-2xl font-black text-slate-800 mb-4">
            Common Home Issues in {town.name}
          </h3>
          <div className="grid md:grid-cols-2 gap-3 mb-8">
            {town.commonIssues.map((issue, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl">
                <span className="material-symbols-outlined text-red-400 mt-0.5">warning</span>
                <span className="text-slate-700">{issue}</span>
              </div>
            ))}
          </div>

          {/* Neighborhoods */}
          <h3 className="text-2xl font-black text-slate-800 mb-4">
            Neighborhoods We Serve in {town.name}
          </h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {town.neighborhoods.map((hood) => (
              <span key={hood} className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-full text-sm font-bold text-slate-600">
                {hood}
              </span>
            ))}
          </div>
          <p className="text-sm text-slate-400 mt-3">
            Serving all of {town.name} — ZIP codes: {town.zip.join(', ')}. Population: {town.population}.
          </p>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 text-center mb-3">Get Connected in 3 Steps</h2>
          <p className="text-slate-500 text-center mb-14">No account needed. No hidden fees. Just help.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '1', icon: 'chat', title: 'Tell Us What You Need', desc: `Describe your ${service.title.toLowerCase().replace(' services', '')} issue in ${town.name} and enter your zip.` },
              { num: '2', icon: 'verified_user', title: 'We Find a Verified Pro', desc: `We match you with a licensed, verified ${service.singular.toLowerCase()} in ${town.name} — checked against real records.` },
              { num: '3', icon: 'handshake', title: 'Get It Done', desc: 'Your pro contacts you directly. No middleman, no runaround.' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-brand-purple/10 rounded-2xl rotate-6" />
                  <div className="relative w-full h-full bg-brand-purple text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-purple/20">
                    <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center text-sm font-black text-slate-900 shadow-md">
                    {step.num}
                  </div>
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 bg-brand-purple text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Need a {service.singular} in {town.name}?
          </h2>
          <p className="text-purple-200 mb-10 text-lg">
            Every pro on our site has been checked against state records. Get matched for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-matched" className="group inline-flex items-center justify-center gap-2 bg-brand-yellow hover:bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0">
              <span className="material-symbols-outlined transition-transform group-hover:scale-110">chat</span>
              Get Matched Free
            </Link>
            <a href={`tel:${phone.tel}`} className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black text-lg border-2 border-white/30 transition-all">
              <span className="material-symbols-outlined">call</span>
              {phone.display}
            </a>
          </div>
        </div>
      </section>

      {/* ================= CROSS-LINKS: OTHER TOWNS ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-black text-slate-800 text-center mb-3">
            {service.title} in Other Towns
          </h2>
          <p className="text-slate-500 text-center mb-8">
            We also connect homeowners with verified {service.title.toLowerCase().replace(' services', '')} pros in these communities.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {otherTowns.map(([slug, t]) => (
              <Link
                key={slug}
                href={`/services/${vertical}/${slug}`}
                className="flex items-center gap-2 bg-white border border-slate-200 p-3 rounded-xl hover:border-brand-purple/30 hover:shadow-md transition-all"
              >
                <span className="material-symbols-outlined text-brand-purple text-lg">location_on</span>
                <span className="font-bold text-slate-800 text-sm">{t.name}, {t.state}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CROSS-LINKS: OTHER SERVICES ================= */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-black text-slate-800 text-center mb-3">
            Other Services in {town.name}
          </h2>
          <p className="text-slate-500 text-center mb-8">
            Need help with something else in {town.name}? We verify pros in all home service trades.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherVerticals.map(([key, relatedService]) => (
              <Link
                key={key}
                href={`/services/${key}/${townSlug}`}
                className="group block bg-white border-2 border-slate-100 rounded-2xl p-6 hover:border-brand-purple/30 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${relatedService.iconBg} ${relatedService.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                    <span className="material-symbols-outlined text-2xl">{relatedService.materialIcon}</span>
                  </div>
                  <h3 className="font-black text-slate-800 group-hover:text-brand-purple transition-colors">{relatedService.title}</h3>
                </div>
                <p className="text-slate-500 text-sm mb-4">{relatedService.description.split('.')[0]}.</p>
                <div className="flex items-center gap-2 text-brand-purple font-bold text-sm group-hover:gap-3 transition-all">
                  View Pros <span className="material-symbols-outlined text-base">arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
