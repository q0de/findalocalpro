export function Contact() {
  return (
    <section id="contact" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Info */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-6">
              Get Your Free Quote
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-10">
              Tell us about your project and we'll connect you with top-rated professionals in your area. It's fast, free, and there's zero obligation.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">schedule</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Fast Response</h4>
                  <p className="text-slate-500 text-sm">Get matched with pros within minutes, not days.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">payments</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">100% Free Service</h4>
                  <p className="text-slate-500 text-sm">There's no cost to you. Ever. We're paid by the pros.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">support_agent</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">24/7 Support</h4>
                  <p className="text-slate-500 text-sm">Our team is here to help, day or night.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-background-light rounded-2xl p-8 lg:p-10 border border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you! A local pro will reach out to you shortly.');
              }}
            >
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="John Smith"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Service Needed
                  </label>
                  <select
                    id="service"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors bg-white"
                    defaultValue=""
                  >
                    <option value="" disabled>Select a service...</option>
                    <option>Plumbing</option>
                    <option>HVAC</option>
                    <option>Electrician</option>
                    <option>Roofing</option>
                    <option>Water Damage</option>
                    <option>Mold Removal</option>
                    <option>Appliance Repair</option>
                    <option>Pest Control</option>
                    <option>Locksmith</option>
                    <option>Towing</option>
                    <option>Siding</option>
                    <option>Bath Remodeling</option>
                    <option>Bathroom Remodel</option>
                    <option>Kitchen Remodeling</option>
                    <option>Flooring</option>
                    <option>Landscaping</option>
                    <option>Tree Services</option>
                    <option>Carpet Cleaning</option>
                    <option>Handyman</option>
                    <option>Gutters</option>
                    <option>Junk Removal</option>
                    <option>Solar</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="details" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Project Details
                  </label>
                  <textarea
                    id="details"
                    rows={4}
                    placeholder="Tell us about your project..."
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-accent hover:bg-amber-600 text-white py-4 rounded-xl text-lg font-bold transition-all shadow-lg active:scale-[0.98]"
                >
                  Get My Free Quote
                </button>

                <p className="text-center text-xs text-slate-400">
                  By submitting, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
