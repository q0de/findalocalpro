'use client';

export function ServiceCallbackForm({ vertical }: { vertical: string }) {
  return (
    <div className="bg-slate-50 rounded-3xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">Request a Callback</h2>
      <p className="text-slate-500 text-center mb-8">Prefer not to call? Leave your info and we&apos;ll reach out.</p>
      <form onSubmit={(e) => { e.preventDefault(); alert('Thank you! We will call you shortly.'); }}>
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
  );
}
