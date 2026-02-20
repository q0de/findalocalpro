import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SUPABASE_URL, SUPABASE_ANON } from '@/lib/supabase';

interface TownInfo {
  name: string;
  county: string;
  state: string;
  zip: string[];
  lat: number;
  lng: number;
  population: string;
  description: string;
  neighborhoods: string[];
  localTips: string;
  commonIssues: string[];
}

const towns: Record<string, TownInfo> = {
  'downers-grove': {
    name: 'Downers Grove',
    county: 'DuPage',
    state: 'IL',
    zip: ['60515', '60516'],
    lat: 41.7959,
    lng: -88.0112,
    population: '49,670',
    description: 'Downers Grove is a thriving village in the heart of DuPage County known for its tree-lined streets, historic downtown, and strong sense of community. With homes ranging from 1920s bungalows to modern new construction, homeowners here need reliable pros who understand both older plumbing systems and modern building codes.',
    neighborhoods: ['Downtown Downers Grove', 'Belmont', 'Fairview', 'Prince Pond', 'Prentiss Creek', 'Meadowbrook'],
    localTips: 'Many Downers Grove homes built before 1960 still have galvanized steel pipes and knob-and-tube wiring. If your home is in the Belmont or Fairview area, ask your contractor about lead pipe replacement programs through the village.',
    commonIssues: ['Aging galvanized pipes in pre-1960 homes', 'Basement flooding from high water table', 'Ice dam damage on older roofs', 'Electrical panel upgrades for modern loads', 'Sump pump failures during spring thaws'],
  },
  'westmont': {
    name: 'Westmont',
    county: 'DuPage',
    state: 'IL',
    zip: ['60559'],
    lat: 41.7959,
    lng: -87.9748,
    population: '24,900',
    description: 'Westmont sits right next to Downers Grove and shares many of the same home maintenance challenges. The village has a mix of 1970s-era townhomes and single-family residences. Its location along Ogden Avenue means many homes deal with road vibration wear on foundations and HVAC systems.',
    neighborhoods: ['Downtown Westmont', 'Ty Warner Park area', 'Oakwood', 'Pasquinelli Estates'],
    localTips: 'Westmont experienced devastating tornado damage in 1991 (an EF4 tornado hit the Plainfield-Crest Hill-Westmont corridor). Many homes were rebuilt or heavily repaired afterward. If buying or maintaining a home rebuilt in 1991-1993, verify all permits were properly closed with the village.',
    commonIssues: ['Townhome shared-wall HVAC efficiency problems', 'Foundation settling near Ogden Avenue corridor', 'Roof wear from 1990s-era rebuilds nearing replacement age', 'Pest control — ant and rodent pressure from nearby retention ponds'],
  },
  'lisle': {
    name: 'Lisle',
    county: 'DuPage',
    state: 'IL',
    zip: ['60532'],
    lat: 41.8011,
    lng: -88.0748,
    population: '23,270',
    description: 'Lisle is known for the Morton Arboretum and its family-friendly neighborhoods. Many homes here were built in the 1980s-1990s suburban boom, meaning roofs, HVAC systems, and water heaters from that era are now reaching end-of-life. Smart homeowners are planning replacements before emergency failures.',
    neighborhoods: ['Green Trails', 'River Bend', 'Four Lakes', 'Kingston', 'Lisle Station Park area'],
    localTips: 'The DuPage River runs through Lisle, and homes near the river or in the Green Trails subdivision should have sump pumps with battery backup. Lisle also has strict tree removal ordinances — if a contractor needs to remove a tree for roof or utility access, check with the village first.',
    commonIssues: ['Aging 1980s-90s HVAC systems reaching end-of-life', 'Sump pump reliance near DuPage River', 'Original builder-grade water heaters failing', 'Tree root intrusion into sewer lines', 'Insulation gaps in 1980s construction'],
  },
  'woodridge': {
    name: 'Woodridge',
    county: 'DuPage',
    state: 'IL',
    zip: ['60517'],
    lat: 41.7470,
    lng: -88.0504,
    population: '33,500',
    description: 'Woodridge is a diverse, growing community in southern DuPage County. The village has expanded significantly since the 1990s, with newer subdivisions on the south and west sides. This mix of housing eras means contractors see everything from 1970s split-levels to 2020s smart homes.',
    neighborhoods: ['Seven Bridges', 'Janes Avenue corridor', 'Crabtree', 'Summerfield', 'Forest Glen'],
    localTips: 'Seven Bridges is Woodridge\'s premium subdivision with HOA requirements that can affect exterior work — check with your HOA before hiring a roofer or starting exterior renovations. The village also offers a sewer lateral repair assistance program worth asking about.',
    commonIssues: ['Split-level homes with multiple HVAC zone challenges', 'Sewer lateral issues in older sections', 'HOA compliance for exterior contractors', 'Pest pressure from nearby forest preserves', 'Electrical upgrades for EV charger installations'],
  },
  'darien': {
    name: 'Darien',
    county: 'DuPage',
    state: 'IL',
    zip: ['60561'],
    lat: 41.7498,
    lng: -87.9820,
    population: '22,200',
    description: 'Darien bills itself as "a nice place to live" — and it is. This quiet residential community between Downers Grove and Willowbrook features well-maintained homes, many built in the 1960s-1980s. The village\'s stable housing stock means consistent demand for maintenance and modernization.',
    neighborhoods: ['The Farmingdale area', 'Indian Head Park border', 'Cass Avenue corridor', 'Brookhaven'],
    localTips: 'Darien homes along the Cass Avenue corridor often have older septic systems that may need conversion to municipal sewer. The village has been expanding sewer access — check with public works before investing in septic repairs.',
    commonIssues: ['Septic to sewer conversion needs', '1960s-era electrical systems needing panel upgrades', 'Basement waterproofing in clay-heavy soil', 'HVAC ductwork in low-clearance crawlspaces', 'Original steel casement windows creating insulation issues'],
  },
  'naperville': {
    name: 'Naperville',
    county: 'DuPage',
    state: 'IL',
    zip: ['60540', '60563', '60564', '60565'],
    lat: 41.7508,
    lng: -88.1535,
    population: '149,500',
    description: 'Naperville is one of the largest cities in Illinois and consistently ranked among the best places to live in the country. With neighborhoods ranging from historic downtown Victorian homes to sprawling modern subdivisions, the demand for qualified home service professionals is enormous — and so is the risk of hiring unlicensed operators.',
    neighborhoods: ['Downtown Historic District', 'Ashwood Park', 'Cress Creek', 'White Eagle', 'Tall Grass', 'Hobson West'],
    localTips: 'Naperville has some of the strictest building permit requirements in DuPage County. Any electrical, plumbing, or structural work requires permits through the city. Contractors who tell you "we don\'t need a permit for this" are a red flag. The city also has a contractor registration requirement — verify it.',
    commonIssues: ['Strict permit requirements catching unprepared homeowners', 'Historic district renovation restrictions downtown', 'Large-home HVAC zoning complexity', 'Irrigation system winterization and repair', 'High demand creating long wait times for quality pros'],
  },
  'lombard': {
    name: 'Lombard',
    county: 'DuPage',
    state: 'IL',
    zip: ['60148'],
    lat: 41.8800,
    lng: -88.0078,
    population: '44,050',
    description: 'Lombard — the "Lilac Village" — has a charming downtown and diverse housing stock spanning a full century of construction. From 1920s Craftsman homes near the train station to 1990s subdivisions on the edges, Lombard contractors need to handle everything from knob-and-tube rewiring to smart home installations.',
    neighborhoods: ['Downtown Lombard', 'Lilacia Park area', 'Glenbard East area', 'Four Season', 'Churchill'],
    localTips: 'Lombard\'s older homes near Main Street and the Metra station often have limestone foundations that can develop moisture issues. Don\'t assume a "wet basement" needs full waterproofing — sometimes tuckpointing the limestone and improving exterior grading solves it at a fraction of the cost.',
    commonIssues: ['Limestone foundation moisture in pre-1940 homes', 'Knob-and-tube wiring in historic properties', 'Clay sewer pipes cracking and allowing root intrusion', 'Asbestos in 1950s-60s homes requiring abatement before renovation', 'Galvanized to copper pipe transitions corroding'],
  },
  'glen-ellyn': {
    name: 'Glen Ellyn',
    county: 'DuPage',
    state: 'IL',
    zip: ['60137'],
    lat: 41.8775,
    lng: -88.0673,
    population: '28,200',
    description: 'Glen Ellyn combines small-town charm with excellent schools and a walkable downtown. The village has a strong mix of pre-war homes in the historic core and mid-century properties throughout. Homeowners here tend to invest in quality maintenance and expect contractors who understand older home systems.',
    neighborhoods: ['Downtown Glen Ellyn', 'Lake Ellyn area', 'Churchill', 'Newton Park', 'Forest Glen'],
    localTips: 'Glen Ellyn has flooding concerns near Lake Ellyn and along the East Branch DuPage River. The village participates in FEMA flood mitigation programs — before paying for basement waterproofing, check if your property qualifies for village-subsidized improvements.',
    commonIssues: ['Flood zone concerns near Lake Ellyn', 'Pre-war plumbing and electrical needing full replacement', 'Ice dams on steep-pitch vintage roofs', 'Tree root damage to sewer laterals (village has many mature elms)', 'Radon levels — DuPage County is Zone 1 (highest risk)'],
  },
  'wheaton': {
    name: 'Wheaton',
    county: 'DuPage',
    state: 'IL',
    zip: ['60187', '60189'],
    lat: 41.8662,
    lng: -88.1071,
    population: '53,970',
    description: 'Wheaton is the county seat of DuPage County and home to several colleges. The city has a distinctive mix of grand older homes near downtown, post-war ranch homes in established neighborhoods, and newer construction on the outskirts. As the county seat, building inspections here tend to be thorough — hire licensed.',
    neighborhoods: ['College Avenue corridor', 'Arrowhead', 'Danada', 'Stonehedge', 'Wheaton Oaks'],
    localTips: 'As the DuPage County seat, Wheaton has direct access to county building department resources. The city requires contractor registration AND proper licensing. Pro tip: you can verify any contractor\'s permit history through the city\'s online portal before hiring.',
    commonIssues: ['Older homes near colleges converted to multi-unit needing code compliance', 'Foundation issues in clay-heavy DuPage soil', 'Aging municipal water infrastructure affecting home plumbing', 'HVAC efficiency in large older homes with poor insulation', 'Radon mitigation (DuPage County Zone 1)'],
  },
  'hinsdale': {
    name: 'Hinsdale',
    county: 'DuPage',
    state: 'IL',
    zip: ['60521'],
    lat: 41.8006,
    lng: -87.9370,
    population: '17,500',
    description: 'Hinsdale is one of the most affluent suburbs in the Chicago area, known for its historic homes, top-rated schools, and meticulous property maintenance. Homeowners here expect premium quality work and won\'t tolerate cut corners. Many properties are historic with specific renovation requirements.',
    neighborhoods: ['Southeast Hinsdale', 'Woodlands', 'Burns Field', 'Fullersburg', 'Katherine Legge Memorial Park area'],
    localTips: 'Hinsdale has a Historic Preservation Commission that reviews exterior changes to homes in the historic district. If your property is designated historic, your contractor needs to work within those guidelines or risk having work ordered removed. Check the village website for your property\'s status.',
    commonIssues: ['Historic preservation compliance for exterior work', 'High-end system installations (whole-home generators, geothermal)', 'Large property landscape drainage and irrigation', 'Premium fixture and material requirements', 'Insurance and bonding verification (high-value properties)'],
  },
  'oak-brook': {
    name: 'Oak Brook',
    county: 'DuPage',
    state: 'IL',
    zip: ['60523'],
    lat: 41.8328,
    lng: -87.9290,
    population: '8,700',
    description: 'Oak Brook is a unique DuPage County village known for its corporate campuses, Oakbrook Center mall, and polo grounds. The residential areas feature large-lot luxury homes and gated communities. Despite its small population, the village has significant commercial and residential service needs.',
    neighborhoods: ['Oak Brook Hills', 'Trinity Lakes', 'Ginger Creek', 'Midwest Club area'],
    localTips: 'Oak Brook has very specific building and zoning codes due to its mix of residential and commercial properties. Some residential streets are private roads maintained by HOAs — contractors may need HOA approval and proof of insurance before starting work. Also, the village mandates specific waste haulers for construction debris.',
    commonIssues: ['Large-lot drainage and grading issues', 'Commercial-grade HVAC in luxury homes', 'HOA and village dual-approval requirements', 'Aged underground sprinkler systems', 'High-value property insurance requirements for contractors'],
  },
  'bolingbrook': {
    name: 'Bolingbrook',
    county: 'Will',
    state: 'IL',
    zip: ['60440', '60490'],
    lat: 41.6986,
    lng: -88.0684,
    population: '75,200',
    description: 'Bolingbrook straddles the DuPage-Will County border and is one of the fastest-growing communities in the region. With massive residential expansion from the 1970s through today, the village has homes at every stage of their lifecycle. The southern sections are newer; the northern areas near I-55 are reaching the age where major systems need replacement.',
    neighborhoods: ['Old Town', 'Colonial Village', 'Lakewood Falls', 'Winston Park', 'Ashbury'],
    localTips: 'Bolingbrook spans two counties (DuPage and Will), which can create confusion around permits and inspections. Make sure your contractor pulls permits from the correct county. The village also has a very active code enforcement division — unpermitted work gets flagged.',
    commonIssues: ['Dual-county permit confusion (DuPage vs Will)', '1970s-80s homes needing full system replacements', 'Large subdivision cookie-cutter builds with known defects', 'Slab foundation cracking in some developments', 'Aggressive code enforcement on unpermitted work'],
  },
};

const serviceVerticals = [
  { slug: 'plumbing', name: 'Plumbing', icon: 'water_drop' },
  { slug: 'hvac', name: 'HVAC & Heating', icon: 'mode_fan' },
  { slug: 'electricians', name: 'Electricians', icon: 'bolt' },
  { slug: 'roofing', name: 'Roofing', icon: 'roofing' },
  { slug: 'pest-control', name: 'Pest Control', icon: 'pest_control' },
  { slug: 'appliance-repair', name: 'Appliance Repair', icon: 'settings' },
];

interface Provider {
  id: string;
  name: string;
  slug: string;
  trade: string;
  trust_score: number | null;
  is_verified: boolean;
  phone: string | null;
}

async function getAllProviders(): Promise<Provider[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/businesses?is_active=eq.true&trust_score=gt.0&select=id,name,slug,trade,trust_score,is_verified,phone&order=trust_score.desc`,
      {
        headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
        next: { revalidate: 3600 },
      }
    );
    return await res.json();
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  return Object.keys(towns).map((town) => ({ town }));
}

export async function generateMetadata({ params }: { params: Promise<{ town: string }> }): Promise<Metadata> {
  const { town: townSlug } = await params;
  const town = towns[townSlug];
  if (!town) return { title: 'Location Not Found | FindALocalPro' };

  const title = `Verified Home Service Pros in ${town.name}, ${town.state} | FindALocalPro`;
  const description = `Find licensed, verified plumbers, electricians, HVAC techs & roofers in ${town.name}, ${town.state}. Every pro checked against 4 government databases. Free for homeowners. (630) 703-2607`;

  return {
    title,
    description,
    openGraph: {
      title: `Verified Home Pros in ${town.name}, ${town.state}`,
      description,
      url: `https://findalocalpro.com/locations/${townSlug}`,
      images: [{ url: 'https://findalocalpro.com/og-image.png', width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `https://findalocalpro.com/locations/${townSlug}`,
    },
  };
}

export default async function LocationPage({ params }: { params: Promise<{ town: string }> }) {
  const { town: townSlug } = await params;
  const town = towns[townSlug];
  if (!town) notFound();

  const providers = await getAllProviders();

  // Group providers by trade
  const byTrade: Record<string, Provider[]> = {};
  for (const p of providers) {
    if (!byTrade[p.trade]) byTrade[p.trade] = [];
    byTrade[p.trade].push(p);
  }

  const otherTowns = Object.entries(towns)
    .filter(([slug]) => slug !== townSlug)
    .slice(0, 6);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `FindALocalPro — ${town.name}`,
    description: `Verified home service professionals serving ${town.name}, ${town.state}`,
    url: `https://findalocalpro.com/locations/${townSlug}`,
    telephone: '(630) 703-2607',
    address: {
      '@type': 'PostalAddress',
      addressLocality: town.name,
      addressRegion: town.state,
      postalCode: town.zip[0],
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: town.lat,
      longitude: town.lng,
    },
    areaServed: {
      '@type': 'City',
      name: town.name,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: `${town.county} County`,
      },
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '19:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '08:00', closes: '16:00' },
    ],
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="min-h-screen bg-white">
        {/* Breadcrumbs */}
        <nav className="max-w-5xl mx-auto px-6 pt-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-slate-500">
            <li><Link href="/" className="hover:text-purple-600 transition-colors">Home</Link></li>
            <li><span className="material-symbols-rounded text-xs">chevron_right</span></li>
            <li><Link href="/directory" className="hover:text-purple-600 transition-colors">Directory</Link></li>
            <li><span className="material-symbols-rounded text-xs">chevron_right</span></li>
            <li className="text-slate-900 font-medium">{town.name}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="max-w-5xl mx-auto px-6 pt-8 pb-12">
          <div className="flex items-center gap-2 text-purple-600 text-sm font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-rounded text-lg">location_on</span>
            {town.name}, {town.state} {town.zip[0]}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Verified Home Pros in {town.name}
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
            {town.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/get-matched" className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors">
              <span className="material-symbols-rounded">search</span>
              Find a Pro in {town.name}
            </Link>
            <a href="tel:6307032607" className="inline-flex items-center gap-2 border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors">
              <span className="material-symbols-rounded">call</span>
              (630) 703-2607
            </a>
          </div>
        </section>

        {/* Services Available */}
        <section className="bg-slate-50 py-12">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl font-black text-slate-900 mb-6">
              Services Available in {town.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {serviceVerticals.map((svc) => {
                const count = byTrade[svc.slug]?.length ?? 0;
                return (
                  <Link
                    key={svc.slug}
                    href={`/services/${svc.slug}`}
                    className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all"
                  >
                    <span className="material-symbols-rounded text-2xl text-purple-600">{svc.icon}</span>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{svc.name}</div>
                      <div className="text-xs text-slate-500">
                        {count > 0 ? `${count} verified pro${count > 1 ? 's' : ''}` : 'Coming soon'}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Verified Pros */}
        {providers.length > 0 && (
          <section className="max-w-5xl mx-auto px-6 py-12">
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              {providers.length} Verified Pros Serving {town.name}
            </h2>
            <p className="text-slate-600 mb-8">
              Every contractor below has been verified against IDFPR license records, IL Secretary of State business registration, BBB, and BuildZoom.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {providers.map((pro) => (
                <Link
                  key={pro.id}
                  href={`/pro/${pro.slug}`}
                  className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="font-bold text-slate-900">{pro.name}</div>
                    <div className="text-sm text-slate-500 capitalize">{pro.trade?.replace('-', ' ')}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {pro.trust_score && (
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-rounded text-sm text-emerald-500">verified</span>
                        <span className="text-sm font-bold text-emerald-600">{pro.trust_score}</span>
                      </div>
                    )}
                    <span className="material-symbols-rounded text-slate-400">chevron_right</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Local Tips */}
        <section className="bg-amber-50 border-y border-amber-200 py-12">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-start gap-4">
              <span className="material-symbols-rounded text-3xl text-amber-600 mt-1">tips_and_updates</span>
              <div>
                <h2 className="text-xl font-black text-slate-900 mb-3">
                  {town.name} Homeowner Tip
                </h2>
                <p className="text-slate-700 leading-relaxed">{town.localTips}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Common Issues */}
        <section className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-black text-slate-900 mb-6">
            Common Home Issues in {town.name}
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {town.commonIssues.map((issue, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl">
                <span className="material-symbols-rounded text-red-400 mt-0.5">warning</span>
                <span className="text-slate-700">{issue}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Link href="/get-matched" className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors">
              Get Matched with a Verified Pro
            </Link>
            <Link href="/directory" className="inline-flex items-center gap-2 text-purple-600 font-bold hover:underline text-sm">
              Browse Full Directory <span className="material-symbols-rounded text-base">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* Neighborhoods */}
        <section className="bg-slate-50 py-12">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl font-black text-slate-900 mb-4">
              Neighborhoods We Serve in {town.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {town.neighborhoods.map((hood) => (
                <span key={hood} className="bg-white border border-slate-200 px-3 py-1.5 rounded-full text-sm text-slate-700">
                  {hood}
                </span>
              ))}
            </div>
            <p className="text-sm text-slate-500 mt-4">
              We serve all neighborhoods in {town.name} and surrounding {town.county} County communities. ZIP codes: {town.zip.join(', ')}.
            </p>
          </div>
        </section>

        {/* Nearby Towns */}
        <section className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-black text-slate-900 mb-6">
            Also Serving Nearby
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {otherTowns.map(([slug, t]) => (
              <Link
                key={slug}
                href={`/locations/${slug}`}
                className="flex items-center gap-2 bg-white border border-slate-200 p-3 rounded-xl hover:border-purple-300 transition-colors"
              >
                <span className="material-symbols-rounded text-purple-500">location_on</span>
                <span className="font-medium text-slate-900 text-sm">{t.name}, {t.state}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-purple-900 text-white py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-black mb-4">
              Need a Pro in {town.name}?
            </h2>
            <p className="text-purple-200 mb-8">
              Every pro on FindALocalPro is verified against 4 government databases. No ads, no pay-to-play. Just verified credentials.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/get-matched" className="inline-flex items-center gap-2 bg-white text-purple-900 px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors">
                Get Matched Free
              </Link>
              <a href="tel:6307032607" className="inline-flex items-center gap-2 border-2 border-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors">
                Call (630) 703-2607
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
