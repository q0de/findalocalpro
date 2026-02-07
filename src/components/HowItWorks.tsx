const steps = [
  {
    number: '1',
    icon: 'edit_note',
    title: 'Tell Us What You Need',
    description: 'Describe your project — whether it\'s a leaky faucet or a full kitchen remodel, we\'ll match you with the right pros.',
  },
  {
    number: '2',
    icon: 'groups',
    title: 'Get Matched Instantly',
    description: 'We connect you with licensed, local professionals who specialize in exactly what you need. Fast and free.',
  },
  {
    number: '3',
    icon: 'thumb_up',
    title: 'Get the Job Done Right',
    description: 'Hire with confidence knowing every pro is vetted, insured, and backed by our satisfaction guarantee.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-slate-600 text-lg">
            Getting help with your home project is simple. Three steps and you're done.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-slate-200"></div>

          {steps.map((step) => (
            <div key={step.number} className="relative text-center">
              <div className="relative z-10 mx-auto w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-primary/25 mb-6">
                {step.number}
              </div>

              <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-3xl text-primary">{step.icon}</span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-500 leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
