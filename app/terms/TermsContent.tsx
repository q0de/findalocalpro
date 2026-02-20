import Link from "next/link";

export function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/" className="text-brand-purple font-bold text-sm hover:underline mb-8 inline-block">&larr; Back to Home</Link>
      <h1 className="text-4xl font-bold text-slate-800 mb-2">Terms & Conditions</h1>
      <p className="text-sm text-slate-400 mb-10">Last updated: February 12, 2026</p>

      <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">1. Program Overview</h2>
          <p><strong>Program Name:</strong> FindALocalPro</p>
          <p className="mt-2">FindALocalPro is a home service provider referral platform. We connect homeowners with qualified local professionals for plumbing, HVAC, electrical, pest control, appliance repair, and other home services. By using our website or services, you agree to these Terms & Conditions.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">2. SMS Messaging Terms</h2>
          <p>By opting in to FindALocalPro's SMS messaging service, you agree to the following:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Message Content:</strong> You will receive text messages related to your home service request, including referral confirmations, provider updates, and follow-up communications.</li>
            <li><strong>Message Frequency:</strong> Message frequency varies based on your service request and interactions.</li>
            <li><strong>Message & Data Rates:</strong> Message and data rates may apply. Check with your wireless carrier for details about your messaging plan.</li>
            <li><strong>Opt-Out:</strong> You can stop receiving messages at any time by texting <strong className="text-lg">STOP</strong> to any message you receive from us. You will receive a one-time confirmation that you have been unsubscribed.</li>
            <li><strong>Support:</strong> For help, text <strong>HELP</strong> to any message or contact us at privacy@findalocalpro.com or 630-555-0100.</li>
            <li><strong>Carriers:</strong> Supported carriers include AT&T, Verizon, T-Mobile, Sprint, and most major US carriers. Service may not be available on all carriers.</li>
          </ul>
          <p className="mt-3">Your consent to receive SMS messages is not required as a condition of purchasing any goods or services from FindALocalPro.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">3. Referral Services</h2>
          <p>FindALocalPro acts as a referral service only. We connect you with independent, local service professionals. We do not:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Employ the service professionals directly</li>
            <li>Guarantee the quality, timing, or outcome of any work performed</li>
            <li>Set pricing for services rendered by professionals</li>
          </ul>
          <p className="mt-3">Any agreement for services is between you and the service professional. We encourage you to verify credentials, insurance, and references independently.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">4. Use of Website</h2>
          <p>You agree to use this website for lawful purposes only. You may not:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Submit false or misleading information</li>
            <li>Interfere with the operation of the website</li>
            <li>Use automated tools to scrape or collect data</li>
            <li>Attempt to gain unauthorized access to our systems</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">5. Limitation of Liability</h2>
          <p>FindALocalPro is provided "as is" without warranties of any kind. To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services or any referral made through our platform.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">6. Privacy</h2>
          <p>Your use of FindALocalPro is also governed by our <Link href="/privacy" className="text-brand-purple font-semibold hover:underline">Privacy Policy</Link>, which describes how we collect, use, and protect your information.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">7. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms & Conditions at any time. Changes will be posted on this page with an updated effective date. Continued use of our services constitutes acceptance of the updated terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">8. Contact</h2>
          <ul className="list-none space-y-1">
            <li><strong>Email:</strong> privacy@findalocalpro.com</li>
            <li><strong>Phone:</strong> 630-555-0100</li>
            <li><strong>SMS Support:</strong> Text <strong>HELP</strong></li>
            <li><strong>SMS Opt-Out:</strong> Text <strong className="text-lg">STOP</strong></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
