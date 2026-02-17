import { useState, useEffect, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/*  Service data                                                       */
/* ------------------------------------------------------------------ */

interface Service {
  icon: string;
  label: string;
  color: string;
  hoverColor: string;
}

const primaryServices: Service[] = [
  { icon: 'water_drop', label: 'Plumbing', color: 'bg-blue-100 text-blue-500', hoverColor: 'group-hover:bg-blue-500' },
  { icon: 'mode_fan', label: 'HVAC & Heating', color: 'bg-purple-100 text-purple-500', hoverColor: 'group-hover:bg-purple-500' },
  { icon: 'bolt', label: 'Electrician', color: 'bg-yellow-100 text-yellow-600', hoverColor: 'group-hover:bg-yellow-500' },
  { icon: 'roofing', label: 'Roofing', color: 'bg-red-100 text-red-500', hoverColor: 'group-hover:bg-red-500' },
  { icon: 'handyman', label: 'Handyman', color: 'bg-orange-100 text-orange-600', hoverColor: 'group-hover:bg-orange-500' },
  { icon: 'add', label: 'More Services', color: 'bg-slate-100 text-slate-600', hoverColor: 'group-hover:bg-slate-500' },
];

const moreServices: Service[] = [
  { icon: 'water_damage', label: 'Water Damage', color: 'bg-cyan-100 text-cyan-600', hoverColor: 'group-hover:bg-cyan-500' },
  { icon: 'science', label: 'Mold Removal', color: 'bg-lime-100 text-lime-600', hoverColor: 'group-hover:bg-lime-500' },
  { icon: 'settings', label: 'Appliance Repair', color: 'bg-gray-100 text-gray-600', hoverColor: 'group-hover:bg-gray-500' },
  { icon: 'pest_control', label: 'Pest Control', color: 'bg-emerald-100 text-emerald-600', hoverColor: 'group-hover:bg-emerald-500' },
  { icon: 'key', label: 'Locksmith', color: 'bg-amber-100 text-amber-600', hoverColor: 'group-hover:bg-amber-500' },
  { icon: 'local_shipping', label: 'Towing', color: 'bg-indigo-100 text-indigo-600', hoverColor: 'group-hover:bg-indigo-500' },
  { icon: 'view_column', label: 'Siding', color: 'bg-stone-100 text-stone-600', hoverColor: 'group-hover:bg-stone-500' },
  { icon: 'bathtub', label: 'Bath Remodeling', color: 'bg-sky-100 text-sky-600', hoverColor: 'group-hover:bg-sky-500' },
  { icon: 'countertops', label: 'Kitchen Remodel', color: 'bg-rose-100 text-rose-600', hoverColor: 'group-hover:bg-rose-500' },
  { icon: 'layers', label: 'Flooring', color: 'bg-teal-100 text-teal-600', hoverColor: 'group-hover:bg-teal-500' },
  { icon: 'potted_plant', label: 'Landscaping', color: 'bg-green-100 text-green-600', hoverColor: 'group-hover:bg-green-500' },
  { icon: 'forest', label: 'Tree Services', color: 'bg-emerald-100 text-emerald-700', hoverColor: 'group-hover:bg-emerald-600' },
  { icon: 'cleaning_services', label: 'Carpet Cleaning', color: 'bg-violet-100 text-violet-600', hoverColor: 'group-hover:bg-violet-500' },
  { icon: 'filter_alt', label: 'Gutters', color: 'bg-zinc-100 text-zinc-600', hoverColor: 'group-hover:bg-zinc-500' },
  { icon: 'delete_sweep', label: 'Junk Removal', color: 'bg-orange-100 text-orange-700', hoverColor: 'group-hover:bg-orange-600' },
  { icon: 'solar_power', label: 'Solar', color: 'bg-yellow-100 text-yellow-600', hoverColor: 'group-hover:bg-yellow-600' },
  { icon: 'shower', label: 'Bathroom Remodel', color: 'bg-blue-100 text-blue-600', hoverColor: 'group-hover:bg-blue-500' },
];

/* ------------------------------------------------------------------ */
/*  Typing indicator                                                   */
/* ------------------------------------------------------------------ */

function TypingIndicator() {
  return (
    <div className="flex items-start gap-4 animate-fade-in-up">
      <div className="avatar-container -rotate-6">
        <span className="material-symbols-outlined text-white text-3xl">face_6</span>
      </div>
      <div className="chat-bubble-bot flex items-center gap-1.5 py-4">
        <div className="w-2.5 h-2.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2.5 h-2.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2.5 h-2.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Service card                                                       */
/* ------------------------------------------------------------------ */

function ServiceCard({ service, selected, onClick }: {
  service: Service;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className={`option-button group ${selected ? 'selected' : ''}`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 transition-colors ${
        selected
          ? 'bg-brand-purple text-white'
          : `${service.color} ${service.hoverColor} group-hover:text-white`
      }`}>
        <span className="material-symbols-outlined">{service.icon}</span>
      </div>
      {service.label}
      {selected && (
        <span className="absolute -top-2 -right-2 bg-brand-yellow text-slate-900 rounded-full p-1 shadow-md border-2 border-white">
          <span className="material-symbols-outlined text-sm font-black">check</span>
        </span>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main ChatFlow                                                      */
/* ------------------------------------------------------------------ */

interface ChatFlowProps {
  onStepChange: (step: number) => void;
}

// Visible "slots" that get revealed in sequence
const Slot = {
  Greeting: 0,
  Question: 1,
  ServiceGrid: 2,
  UserConfirm: 3,
  BotMatch: 4,
  TimingQuestion: 5,
  TimingOptions: 6,
  ZipQuestion: 7,
  ZipInput: 8,
  // Quote path (Just Quotes)
  QuoteLoading: 9,
  QuoteResult: 10,
  QuoteDeliveryQuestion: 11,
  QuoteDeliveryOptions: 12,
  QuoteContactInput: 13,
  QuoteSent: 14,
  // Call path (Right Now / Schedule Later)
  PhoneQuestion: 15,
  PhoneInput: 16,
  Celebration: 17,
} as const;

export function ChatFlow({ onStepChange }: ChatFlowProps) {
  const [visibleUpTo, setVisibleUpTo] = useState(-1); // nothing visible yet
  const [typing, setTyping] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [selectedTiming, setSelectedTiming] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [proCount] = useState(() => Math.floor(Math.random() * 30) + 20);
  const [quoteData, setQuoteData] = useState<{
    estimate: string; low: string; high: string; details: string;
    sources?: { title: string; url: string }[];
  } | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState('');

  // Reveal a slot after a delay, showing typing indicator in between
  const revealSlot = useCallback((slot: number, delay: number) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setVisibleUpTo(slot);
    }, delay);
  }, []);

  // Initial reveal sequence on mount
  useEffect(() => {
    // Greeting appears after 600ms
    revealSlot(Slot.Greeting, 800);

    // Question appears after greeting
    const t1 = setTimeout(() => revealSlot(Slot.Question, 1000), 1800);

    // Service grid appears after question
    const t2 = setTimeout(() => {
      setTyping(false);
      setVisibleUpTo(Slot.ServiceGrid);
    }, 3200);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [revealSlot]);

  const visible = (slot: number) => visibleUpTo >= slot;

  const handleServiceSelect = (label: string) => {
    if (label === 'More Services') {
      setShowMore(true);
      return;
    }
    setSelectedService(label);
    onStepChange(1);

    // Show user confirmation bubble immediately
    setVisibleUpTo(Slot.UserConfirm);

    // Then bot responds
    setTimeout(() => revealSlot(Slot.BotMatch, 1200), 400);

    // Then timing question
    setTimeout(() => revealSlot(Slot.TimingQuestion, 800), 2200);

    // Then timing options
    setTimeout(() => {
      setTyping(false);
      setVisibleUpTo(Slot.TimingOptions);
    }, 3400);
  };

  const handleTimingSelect = (timing: string) => {
    setSelectedTiming(timing);
    onStepChange(2);

    // Show zip question
    setTimeout(() => revealSlot(Slot.ZipQuestion, 900), 300);

    // Show zip input
    setTimeout(() => {
      setTyping(false);
      setVisibleUpTo(Slot.ZipInput);
    }, 1600);
  };

  const fetchQuote = async (service: string, zip: string) => {
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service, zip }),
      });
      if (res.ok) {
        const data = await res.json();
        setQuoteData(data);
      } else {
        setQuoteData({
          estimate: '$150 - $500',
          low: '$150',
          high: '$500',
          details: `${service} costs vary based on the scope of work. For a precise quote tailored to your situation, we can connect you with a local pro.`,
        });
      }
    } catch {
      setQuoteData({
        estimate: '$150 - $500',
        low: '$150',
        high: '$500',
        details: `${service} costs vary based on the scope of work. For a precise quote tailored to your situation, we can connect you with a local pro.`,
      });
    }
  };

  const handleZipSubmit = () => {
    if (zipCode.length >= 3) {
      onStepChange(3);

      if (selectedTiming === 'Just Quotes') {
        // Quote path: fetch estimate via AI
        setVisibleUpTo(Slot.QuoteLoading);
        setTyping(true);
        fetchQuote(selectedService, zipCode).then(() => {
          setTyping(false);
          setVisibleUpTo(Slot.QuoteResult);
          // After showing quote, ask how they want it delivered
          setTimeout(() => revealSlot(Slot.QuoteDeliveryQuestion, 1000), 1500);
          setTimeout(() => {
            setTyping(false);
            setVisibleUpTo(Slot.QuoteDeliveryOptions);
          }, 3000);
        });
      } else {
        // Call path: go to phone step
        setTimeout(() => revealSlot(Slot.PhoneQuestion, 900), 200);
        setTimeout(() => {
          setTyping(false);
          setVisibleUpTo(Slot.PhoneInput);
        }, 1500);
      }
    }
  };

  const handleDeliverySelect = (method: string) => {
    setDeliveryMethod(method);
    setTimeout(() => {
      setTyping(false);
      setVisibleUpTo(Slot.QuoteContactInput);
    }, 300);
  };

  const handleQuoteContactSubmit = async () => {
    if (!contactInfo.trim()) return;
    setSubmitting(true);

    try {
      await fetch('https://hocipkeeikriqyojiboj.supabase.co/functions/v1/sms-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'website-quote',
          contact: contactInfo,
          delivery_method: deliveryMethod,
          service: selectedService,
          timing: selectedTiming,
          zip_code: zipCode,
          quote_estimate: quoteData?.estimate,
        }),
      }).catch(() => {});
    } catch {
      // Silent
    }

    setSubmitting(false);
    onStepChange(4);
    setTimeout(() => revealSlot(Slot.QuoteSent, 800), 200);
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(formatPhone(e.target.value));
  };

  const handleFinalSubmit = async () => {
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length < 10) return;

    setSubmitting(true);

    try {
      // Submit lead to backend
      await fetch('https://hocipkeeikriqyojiboj.supabase.co/functions/v1/sms-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'website',
          phone: `+1${digits}`,
          service: selectedService,
          timing: selectedTiming,
          zip_code: zipCode,
        }),
      }).catch(() => {}); // Fire and forget — don't block the UI
    } catch {
      // Silent — we show celebration regardless
    }

    setSubmitting(false);
    onStepChange(4);
    setTimeout(() => revealSlot(Slot.Celebration, 1000), 200);
  };

  const submitted = visibleUpTo >= Slot.Celebration || visibleUpTo >= Slot.QuoteSent;

  return (
    <div className="flex flex-col gap-10">

      {/* ---- Greeting ---- */}
      {visible(Slot.Greeting) && (
        <div className="flex flex-col gap-4 animate-fade-in-up">
          <div className="flex items-start gap-4">
            <div className="avatar-container -rotate-6">
              <span className="material-symbols-outlined text-white text-3xl">waving_hand</span>
            </div>
            <div className="chat-bubble-bot">
              <p className="text-lg font-medium leading-relaxed">
                Hey there! Welcome to <span className="text-brand-purple font-bold">FindALocalPro</span>! 🌈
              </p>
              <p className="text-slate-600">
                I'm here to connect you with the absolute best pro for your home. Let's get started!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---- Question ---- */}
      {visible(Slot.Question) && (
        <div className="flex items-start gap-4 ml-18 animate-fade-in-up">
          <div className="chat-bubble-bot-gradient border-l-4 border-l-brand-teal">
            <p className="text-lg font-bold text-slate-800">What magic can we do for your home today?</p>
          </div>
        </div>
      )}

      {/* ---- Service grid ---- */}
      {visible(Slot.ServiceGrid) && (
        <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in-up ${visibleUpTo > Slot.ServiceGrid ? 'opacity-50 pointer-events-none' : ''}`}>
          {primaryServices.map((svc) => (
            <ServiceCard
              key={svc.label}
              service={svc}
              selected={selectedService === svc.label}
              onClick={() => handleServiceSelect(svc.label)}
            />
          ))}
        </div>
      )}

      {/* ---- Expanded services ---- */}
      {showMore && visibleUpTo <= Slot.ServiceGrid && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in-up">
          {moreServices.map((svc) => (
            <ServiceCard
              key={svc.label}
              service={svc}
              selected={selectedService === svc.label}
              onClick={() => handleServiceSelect(svc.label)}
            />
          ))}
        </div>
      )}

      {/* ---- User confirms service ---- */}
      {visible(Slot.UserConfirm) && (
        <div className="chat-bubble-user animate-fade-in-up">
          <p className="text-lg">
            I definitely need help with my{' '}
            <span className="underline decoration-brand-yellow decoration-4 underline-offset-4">
              {selectedService}
            </span>!
          </p>
        </div>
      )}

      {/* ---- Bot match response ---- */}
      {visible(Slot.BotMatch) && (
        <div className="flex items-start gap-4 animate-fade-in-up">
          <div className="avatar-container rotate-6">
            <span className="material-symbols-outlined text-white text-4xl">sentiment_very_satisfied</span>
          </div>
          <div className="chat-bubble-bot-gradient">
            <p className="text-lg font-medium mb-4">
              Awesome choice! I've found{' '}
              <span className="bg-brand-yellow px-2 py-0.5 rounded font-bold">{proCount} super-pros</span>{' '}
              nearby who are ready to jump in!
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="sparkle-badge">
                <span className="material-symbols-outlined text-sm text-brand-pink">auto_awesome</span>
                Licensed &amp; Insured
              </div>
              <div className="sparkle-badge">
                <span className="material-symbols-outlined text-sm text-brand-teal">verified</span>
                Top-Tier Experts
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Timing question ---- */}
      {visible(Slot.TimingQuestion) && (
        <div className="flex items-start gap-4 ml-18 animate-fade-in-up">
          <div className="chat-bubble-bot border-l-4 border-l-brand-pink">
            <p className="text-lg font-bold">When should we send someone over?</p>
          </div>
        </div>
      )}

      {/* ---- Timing options ---- */}
      {visible(Slot.TimingOptions) && (
        <div className={`flex flex-col sm:flex-row gap-4 animate-fade-in-up ${visibleUpTo > Slot.TimingOptions ? 'opacity-50 pointer-events-none' : ''}`}>
          {[
            { emoji: '⚡', label: 'Right Now!' },
            { emoji: '📅', label: 'Schedule Later' },
            { emoji: '🏷️', label: 'Just Quotes' },
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleTimingSelect(opt.label)}
              className={`flex-1 bg-white p-5 rounded-2xl border-2 shadow-md hover:shadow-xl transition-all flex flex-col items-center gap-2 group cursor-pointer ${
                selectedTiming === opt.label
                  ? 'border-brand-pink ring-4 ring-brand-pink/10'
                  : 'border-slate-100 hover:border-brand-pink'
              }`}
            >
              <span className="text-4xl group-hover:scale-125 transition-transform">{opt.emoji}</span>
              <span className="font-bold text-slate-700">{opt.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ---- Zip code question ---- */}
      {visible(Slot.ZipQuestion) && !submitted && (
        <div className="flex items-start gap-4 animate-fade-in-up">
          <div className="avatar-container -rotate-12">
            <span className="material-symbols-outlined text-white text-3xl">pin_drop</span>
          </div>
          <div className="chat-bubble-bot">
            <p className="text-lg font-bold">And the last piece of the puzzle... what's your Zip Code? 📍</p>
          </div>
        </div>
      )}

      {/* ---- Zip code input ---- */}
      {visible(Slot.ZipInput) && !submitted && (
        <div className="max-w-md w-full self-center animate-fade-in-up">
          <div className="relative group">
            <input
              className="w-full bg-white border-4 border-slate-100 rounded-3xl px-8 py-6 text-xl font-bold focus:ring-4 focus:ring-brand-purple/20 focus:border-brand-purple transition-all shadow-xl placeholder:text-slate-300"
              placeholder="e.g. 90210"
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleZipSubmit()}
              autoFocus
            />
            <button
              onClick={handleZipSubmit}
              className="absolute right-3 top-3 bottom-3 bg-brand-yellow hover:bg-brand-pink text-slate-900 hover:text-white px-6 rounded-2xl transition-all flex items-center gap-2 font-black shadow-lg cursor-pointer"
            >
              GO! <span className="material-symbols-outlined font-black">arrow_forward</span>
            </button>
          </div>
          <div className="mt-6 flex justify-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">lock</span>
              Private
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              Secure
            </div>
          </div>
        </div>
      )}

      {/* ---- Quote: Loading ---- */}
      {visibleUpTo === Slot.QuoteLoading && (
        <div className="flex items-start gap-4 animate-fade-in-up">
          <div className="avatar-container rotate-6">
            <span className="material-symbols-outlined text-white text-3xl">search</span>
          </div>
          <div className="chat-bubble-bot">
            <p className="text-lg font-medium">🔍 Researching {selectedService.toLowerCase()} costs near <span className="font-bold">{zipCode}</span>...</p>
          </div>
        </div>
      )}

      {/* ---- Quote: Result ---- */}
      {visible(Slot.QuoteResult) && quoteData && (
        <div className="flex items-start gap-4 animate-fade-in-up">
          <div className="avatar-container -rotate-6">
            <span className="material-symbols-outlined text-white text-3xl">receipt_long</span>
          </div>
          <div className="chat-bubble-bot-gradient border-l-4 border-l-brand-teal">
            <p className="text-sm font-bold text-brand-purple uppercase tracking-wider mb-2">Estimated Cost Range</p>
            <p className="text-3xl font-bold text-slate-800 mb-3">{quoteData.estimate}</p>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">{quoteData.details}</p>
            {quoteData.sources && quoteData.sources.length > 0 && (
              <div className="border-t border-slate-100 pt-3 mt-3">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Sources</p>
                {quoteData.sources.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="block text-xs text-brand-purple hover:underline truncate">{s.title}</a>
                ))}
              </div>
            )}
            <p className="text-xs text-slate-400 mt-3 italic">*Rough estimate based on market data. Actual costs may vary.</p>
          </div>
        </div>
      )}

      {/* ---- Quote: Delivery question ---- */}
      {visible(Slot.QuoteDeliveryQuestion) && !visible(Slot.QuoteSent) && (
        <div className="flex items-start gap-4 ml-18 animate-fade-in-up">
          <div className="chat-bubble-bot border-l-4 border-l-brand-pink">
            <p className="text-lg font-bold">Want me to send this estimate to you? How would you like it? 📨</p>
          </div>
        </div>
      )}

      {/* ---- Quote: Delivery options ---- */}
      {visible(Slot.QuoteDeliveryOptions) && !visible(Slot.QuoteSent) && (
        <div className={`flex flex-col sm:flex-row gap-4 animate-fade-in-up ${visibleUpTo > Slot.QuoteDeliveryOptions ? 'opacity-50 pointer-events-none' : ''}`}>
          {[
            { emoji: '📧', label: 'Email' },
            { emoji: '💬', label: 'Text' },
            { emoji: '📞', label: 'Call Me' },
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleDeliverySelect(opt.label)}
              className={`flex-1 bg-white p-5 rounded-2xl border-2 shadow-md hover:shadow-xl transition-all flex flex-col items-center gap-2 group cursor-pointer ${
                deliveryMethod === opt.label
                  ? 'border-brand-pink ring-4 ring-brand-pink/10'
                  : 'border-slate-100 hover:border-brand-pink'
              }`}
            >
              <span className="text-4xl group-hover:scale-125 transition-transform">{opt.emoji}</span>
              <span className="font-bold text-slate-700">{opt.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ---- Quote: Contact input ---- */}
      {visible(Slot.QuoteContactInput) && !visible(Slot.QuoteSent) && (
        <div className="max-w-md w-full self-center animate-fade-in-up">
          <div className="relative group">
            <input
              className="w-full bg-white border-4 border-slate-100 rounded-3xl px-8 py-6 text-xl font-bold focus:ring-4 focus:ring-brand-purple/20 focus:border-brand-purple transition-all shadow-xl placeholder:text-slate-300"
              placeholder={deliveryMethod === 'Email' ? 'you@email.com' : deliveryMethod === 'Text' ? '(555) 123-4567' : '(555) 123-4567'}
              type={deliveryMethod === 'Email' ? 'email' : 'tel'}
              value={contactInfo}
              onChange={(e) => setContactInfo(deliveryMethod === 'Call Me' || deliveryMethod === 'Text' ? formatPhone(e.target.value) : e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuoteContactSubmit()}
              autoFocus
            />
            <button
              onClick={handleQuoteContactSubmit}
              disabled={submitting || !contactInfo.trim()}
              className="absolute right-3 top-3 bottom-3 bg-brand-yellow hover:bg-brand-pink text-slate-900 hover:text-white px-6 rounded-2xl transition-all flex items-center gap-2 font-black shadow-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? '...' : 'SEND!'} <span className="material-symbols-outlined font-black">send</span>
            </button>
          </div>
        </div>
      )}

      {/* ---- Quote: Sent confirmation ---- */}
      {visible(Slot.QuoteSent) && (
        <div className="flex flex-col gap-4 animate-fade-in-up">
          <div className="flex items-start gap-4">
            <div className="avatar-container rotate-12">
              <span className="material-symbols-outlined text-white text-4xl">celebration</span>
            </div>
            <div className="chat-bubble-bot-gradient border-l-4 border-l-brand-teal">
              <p className="text-lg font-bold mb-2">Quote sent! 🎉</p>
              <p className="text-slate-600 mb-4">
                We'll {deliveryMethod === 'Email' ? 'email' : deliveryMethod === 'Text' ? 'text' : 'call'} you at{' '}
                <span className="font-bold text-slate-800">{contactInfo}</span> with your {selectedService.toLowerCase()} estimate
                and connect you with top-rated local pros near <span className="font-bold text-slate-800">{zipCode}</span>.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="sparkle-badge">
                  <span className="material-symbols-outlined text-sm text-brand-pink">attach_money</span>
                  {quoteData?.estimate}
                </div>
                <div className="sparkle-badge">
                  <span className="material-symbols-outlined text-sm text-brand-teal">location_on</span>
                  Zip: {zipCode}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Phone question ---- */}
      {visible(Slot.PhoneQuestion) && !submitted && (
        <div className="flex items-start gap-4 animate-fade-in-up">
          <div className="avatar-container rotate-3">
            <span className="material-symbols-outlined text-white text-3xl">call</span>
          </div>
          <div className="chat-bubble-bot border-l-4 border-l-brand-yellow">
            <p className="text-lg font-bold">Almost there! What's the best number to reach you? 📱</p>
            <p className="text-sm text-slate-500 mt-1">We'll have a pro call you directly — no spam, promise!</p>
          </div>
        </div>
      )}

      {/* ---- Phone input ---- */}
      {visible(Slot.PhoneInput) && !submitted && (
        <div className="max-w-md w-full self-center animate-fade-in-up">
          <div className="relative group">
            <input
              className="w-full bg-white border-4 border-slate-100 rounded-3xl px-8 py-6 text-xl font-bold focus:ring-4 focus:ring-brand-purple/20 focus:border-brand-purple transition-all shadow-xl placeholder:text-slate-300"
              placeholder="(555) 123-4567"
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              onKeyDown={(e) => e.key === 'Enter' && handleFinalSubmit()}
              autoFocus
            />
            <button
              onClick={handleFinalSubmit}
              disabled={submitting || phoneNumber.replace(/\D/g, '').length < 10}
              className="absolute right-3 top-3 bottom-3 bg-brand-yellow hover:bg-brand-pink text-slate-900 hover:text-white px-6 rounded-2xl transition-all flex items-center gap-2 font-black shadow-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? '...' : 'CALL ME!'} <span className="material-symbols-outlined font-black">phone_in_talk</span>
            </button>
          </div>
          <div className="mt-6 flex justify-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">lock</span>
              Private
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">do_not_disturb_on</span>
              No Spam
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              Secure
            </div>
          </div>
        </div>
      )}

      {/* ---- Celebration ---- */}
      {submitted && (
        <div className="flex flex-col gap-4 animate-fade-in-up">
          <div className="flex items-start gap-4">
            <div className="avatar-container rotate-12">
              <span className="material-symbols-outlined text-white text-4xl">celebration</span>
            </div>
            <div className="chat-bubble-bot-gradient border-l-4 border-l-brand-teal">
              <p className="text-lg font-bold mb-2">You're all set! 🎉</p>
              <p className="text-slate-600 mb-4">
                We're connecting you with the best {selectedService.toLowerCase()} pros near{' '}
                <span className="font-bold text-slate-800">{zipCode}</span>. A pro will call{' '}
                <span className="font-bold text-slate-800">{phoneNumber}</span> shortly!
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="sparkle-badge">
                  <span className="material-symbols-outlined text-sm text-brand-pink">schedule</span>
                  {selectedTiming}
                </div>
                <div className="sparkle-badge">
                  <span className="material-symbols-outlined text-sm text-brand-teal">location_on</span>
                  Zip: {zipCode}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Typing indicator (shown between reveals) ---- */}
      {typing && <TypingIndicator />}
    </div>
  );
}
