interface Service {
  icon: string;
  name: string;
}

const services: Service[] = [
  { icon: 'plumbing', name: 'Plumbing' },
  { icon: 'hvac', name: 'HVAC' },
  { icon: 'electrical_services', name: 'Electrician' },
  { icon: 'roofing', name: 'Roofing' },
  { icon: 'water_damage', name: 'Water Damage' },
  { icon: 'science', name: 'Mold Removal' },
  { icon: 'settings', name: 'Appliance Repair' },
  { icon: 'pest_control', name: 'Pest Control' },
  { icon: 'key', name: 'Locksmith' },
  { icon: 'local_shipping', name: 'Towing' },
  { icon: 'view_column', name: 'Siding' },
  { icon: 'bathtub', name: 'Bath Remodeling' },
  { icon: 'shower', name: 'Bathroom Remodel' },
  { icon: 'countertops', name: 'Kitchen Remodeling' },
  { icon: 'layers', name: 'Flooring' },
  { icon: 'potted_plant', name: 'Landscaping' },
  { icon: 'forest', name: 'Tree Services' },
  { icon: 'cleaning_services', name: 'Carpet Cleaning' },
  { icon: 'handyman', name: 'Handyman' },
  { icon: 'filter_alt', name: 'Gutters' },
  { icon: 'delete_sweep', name: 'Junk Removal' },
  { icon: 'solar_power', name: 'Solar' },
];

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="group bg-white p-6 rounded-lg border border-slate-200 hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer">
      <div className="text-primary mb-4 bg-primary/5 w-12 h-12 flex items-center justify-center rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
        <span className="material-symbols-outlined">{service.icon}</span>
      </div>
      <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">
        {service.name}
      </h3>
    </div>
  );
}

export function ServicesGrid() {
  return (
    <section id="services" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">Our Services</h2>
            <p className="text-slate-600 text-lg">From emergency repairs to major home renovations, we've got a pro for every task.</p>
          </div>
          <div className="flex items-center gap-2 text-primary font-bold cursor-pointer group">
            See All 50+ Services
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {services.map((service) => (
            <ServiceCard key={service.name} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
