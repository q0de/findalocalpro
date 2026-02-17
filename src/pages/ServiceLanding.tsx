import { useParams, Link } from 'react-router-dom';
import { Footer } from '../components/Footer';

interface ServiceInfo {
  title: string;
  icon: string;
  description: string;
  services: { name: string; desc: string }[];
}

const verticals: Record<string, ServiceInfo> = {
  plumbing: {
    title: 'Plumbing Services',
    icon: '🔧',
    description: 'From leaky faucets to major pipe repairs, get connected with an experienced local plumber who can solve your problem quickly.',
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
    title: 'HVAC Services',
    icon: '❄️',
    description: 'Stay comfortable year-round. Get connected with a local HVAC technician for heating, cooling, and air quality solutions.',
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
    title: 'Electrical Services',
    icon: '⚡',
    description: 'Electrical work requires a professional. Get connected with a qualified local electrician for safe, reliable service.',
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
    title: 'Pest Control Services',
    icon: '🐜',
    description: 'Don\'t let pests take over your home. Get connected with a local exterminator who can eliminate the problem for good.',
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
    title: 'Appliance Repair Services',
    icon: '🔌',
    description: 'When your appliances break down, you need a fix fast. Get connected with a local appliance repair technician today.',
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

export function ServiceLanding() {
  const { vertical } = useParams<{ vertical: string }>();
  const service = vertical ? verticals[vertical] : null;

  if (!service) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Service Not Found</h1>
        <Link to="/" className="text-brand-purple font-bold hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-white">
        <div className="max-w-4xl mx-auto px-6 flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
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
            {service.title} in<br />Downers Grove, IL
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
              { num: '1', title: 'Call Us', desc: `Give us a call and tell us about your ${vertical?.replace('-', ' ')} needs.` },
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
          <div className="bg-slate-50 rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">Request a Callback</h2>
            <p className="text-slate-500 text-center mb-8">Prefer not to call? Leave your info and we'll reach out.</p>
            <form
              onSubmit={(e) => { e.preventDefault(); alert('Thank you! We will call you shortly.'); }}
              toolname="request_service_callback"
              tooldescription={`Request a callback from a licensed ${vertical?.replace('-', ' ')} professional in your area. A matched pro will call you back within minutes.`}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Your Name</label>
                  <input name="customer_name" type="text" required placeholder="John Smith" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-purple focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                  <input name="phone_number" type="tel" required placeholder="(630) 555-0100" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-purple focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">ZIP Code</label>
                  <input name="zip_code" type="text" required placeholder="60515" maxLength={5} pattern="[0-9]{5}" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-purple focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Describe Your Issue</label>
                  <textarea name="issue_description" rows={3} placeholder="Tell us what you need help with..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-purple focus:outline-none resize-none" />
                </div>
                <button type="submit" className="w-full bg-brand-purple text-white py-3 rounded-xl font-bold hover:bg-brand-pink transition-colors">
                  Request Callback
                </button>
              </div>
            </form>
          </div>
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
