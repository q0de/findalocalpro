import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { ServiceCallbackForm } from './ServiceCallbackForm';

interface ServiceInfo {
  title: string;
  icon: string;
  description: string;
  services: { name: string; desc: string }[];
}

const verticals: Record<string, ServiceInfo> = {
  plumbing: {
    title: 'Plumbing Services', icon: '🔧',
    description: 'Licensed plumber in Downers Grove and DuPage County. Leak repair, drain cleaning, water heaters, pipe repair. Free estimates, same-day service.',
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
    title: 'HVAC Services', icon: '❄️',
    description: 'Expert HVAC service in Downers Grove and DuPage County. AC repair, furnace service, duct cleaning, and new system installation. Licensed techs.',
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
    title: 'Electrical Services', icon: '⚡',
    description: 'Licensed electricians in Downers Grove and DuPage County. Wiring, panel upgrades, EV chargers, emergency repairs. Safe, reliable, insured.',
    services: [
      { name: 'Electrical Repairs', desc: 'Fix outlets, switches, breakers, and wiring issues safely.' },
      { name: 'Panel Upgrades', desc: 'Upgrade your electrical panel to handle modern power demands.' },
      { name: 'Lighting Installation', desc: 'Indoor, outdoor, recessed, and landscape lighting.' },
      { name: 'Wiring & Rewiring', desc: 'New construction wiring or updating old knob-and-tube systems.' },
      { name: 'EV Charger Installation', desc: 'Level 2 home charging stations for electric vehicles.' },
      { name: 'Generator Installation', desc: 'Whole-home backup generators for power outage protection.' },
    ],
  },
  'pest-control': {
    title: 'Pest Control Services', icon: '🐜',
    description: 'Pest control in Downers Grove and DuPage County. Ants, roaches, rodents, termites, bed bugs, wildlife removal. Licensed, insured pros.',
    services: [
      { name: 'Ant & Roach Control', desc: 'Eliminate common household pests and prevent them from returning.' },
      { name: 'Rodent Removal', desc: 'Mice and rat control with exclusion to keep them out.' },
      { name: 'Termite Treatment', desc: 'Protect your home\'s structure from termite damage.' },
      { name: 'Bed Bug Treatment', desc: 'Thorough bed bug elimination using proven methods.' },
      { name: 'Mosquito & Tick Control', desc: 'Yard treatments to reduce biting insects around your home.' },
      { name: 'Wildlife Removal', desc: 'Humane removal of raccoons, squirrels, and other wildlife.' },
    ],
  },
  'appliance-repair': {
    title: 'Appliance Repair Services', icon: '🔌',
    description: 'Fast appliance repair in Downers Grove and DuPage County. Fridge, washer, dryer, dishwasher, oven, garbage disposal. Local techs, same-day.',
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

const areaTags = ['Downers Grove', 'Westmont', 'Lisle', 'Woodridge', 'Darien', 'Naperville', 'Lombard', 'Glen Ellyn', 'Wheaton', 'Hinsdale', 'Oak Brook', 'Bolingbrook'];

export async function generateMetadata({ params }: { params: Promise<{ vertical: string }> }): Promise<Metadata> {
  const { vertical } = await params;
  const service = verticals[vertical];
  if (!service) return { title: 'Service Not Found | FindALocalPro' };

  return {
    title: `${service.title} in Downers Grove, IL | FindALocalPro`,
    description: service.description,
    openGraph: {
      title: `${service.title} in Downers Grove, IL`,
      description: service.description,
      url: `https://findalocalpro.com/services/${vertical}`,
      images: [{ url: 'https://findalocalpro.com/og-image.png', width: 1200, height: 630 }],
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(verticals).map(v => ({ vertical: v }));
}

export default async function ServiceLandingPage({ params }: { params: Promise<{ vertical: string }> }) {
  const { vertical } = await params;
  const service = verticals[vertical];
  if (!service) notFound();

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-white">
        <div className="max-w-4xl mx-auto px-6 flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-brand-purple w-10 h-10 rounded-xl flex items-center justify-center text-white rotate-3">
              <span className="material-symbols-outlined font-bold">home_repair_service</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 font-playful">
              Find<span className="text-brand-purple">A</span>Local<span className="text-brand-pink">Pro</span>
            </h2>
          </Link>
          <a href="tel:6307032607" className="bg-brand-purple text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-brand-pink transition-all shadow-lg hover:-translate-y-1">
            📞 630-703-2607
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-purple/5 to-brand-pink/5 py-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-6xl mb-6 block">{service.icon}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            {service.title} in Downers Grove, IL
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">{service.description}</p>
          <a href="tel:6307032607" className="inline-flex items-center gap-2 bg-brand-purple text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-brand-pink transition-all shadow-xl hover:-translate-y-1">
            📞 Call Now: 630-703-2607
          </a>
          <p className="text-sm text-slate-400 mt-3">Speak with a local pro today</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-3">How It Works</h2>
          <p className="text-slate-500 text-center mb-12">Get connected with a local professional in minutes</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '1', title: 'Call Us', desc: `Give us a call and tell us about your ${vertical.replace('-', ' ')} needs.` },
              { num: '2', title: 'We Connect You', desc: 'We match you with a qualified local professional in your area.' },
              { num: '3', title: 'Get Service', desc: 'Your pro handles the job. Simple, fast, and hassle-free.' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 bg-brand-purple text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">{step.num}</div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">What We Help With</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.services.map((s) => (
              <div key={s.name} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-slate-800 mb-2">{s.name}</h3>
                <p className="text-slate-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Callback Form */}
      <section className="py-16 bg-white">
        <div className="max-w-lg mx-auto px-6">
          <ServiceCallbackForm vertical={vertical} />
        </div>
      </section>

      {/* Service Area */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Service Area</h2>
          <p className="text-slate-500 mb-8">Proudly serving Downers Grove and surrounding communities</p>
          <div className="flex flex-wrap justify-center gap-3">
            {areaTags.map((area) => (
              <span key={area} className="bg-white px-4 py-2 rounded-full text-sm font-semibold text-slate-600 shadow-sm">{area}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-brand-purple text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started? Call Now.</h2>
          <a href="tel:6307032607" className="inline-flex items-center gap-2 bg-white text-brand-purple px-8 py-4 rounded-full text-lg font-bold hover:bg-brand-pink hover:text-white transition-all shadow-xl hover:-translate-y-1">
            📞 630-703-2607
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
