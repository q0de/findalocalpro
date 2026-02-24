import Link from "next/link";

export function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/" className="text-brand-purple font-bold text-sm hover:underline mb-8 inline-block">&larr; Back to Home</Link>
      <h1 className="text-4xl font-bold text-slate-800 mb-2">Privacy Policy</h1>
      <p className="text-sm text-slate-400 mb-10">Last updated: February 12, 2026</p>

      <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">1. Who We Are</h2>
          <p>FindALocalPro ("we," "us," or "our") is a home services referral platform that connects homeowners with qualified local service professionals. This Privacy Policy explains how we collect, use, and protect your personal information.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">2. Information We Collect</h2>
          <p>We may collect the following information when you use our website, submit a form, or contact us:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Name</li>
            <li>Phone number</li>
            <li>Email address</li>
            <li>ZIP code / service location</li>
            <li>Description of your home service needs</li>
            <li>Device and browser information (via cookies and analytics)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Match you with qualified local service professionals</li>
            <li>Contact you regarding your service request</li>
            <li>Send you SMS messages related to your inquiry (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">4. SMS Consent & Communication</h2>
          <p>By providing your phone number and submitting a request, you consent to receive SMS text messages from FindALocalPro related to your service inquiry. These messages may include:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Confirmation of your service request</li>
            <li>Updates on your referral status</li>
            <li>Follow-up communications from matched service providers</li>
          </ul>
          <p className="mt-3">Message frequency varies. Message and data rates may apply. You can opt out at any time by replying <strong>STOP</strong> to any message. Reply <strong>HELP</strong> for support.</p>
          <p className="mt-3 font-semibold">Your consent to receive SMS messages is not a condition of purchasing any goods or services.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">5. Information Sharing</h2>
          <p>We share your information <strong>only</strong> with the local service professional(s) matched to your request, solely for the purpose of fulfilling your service inquiry.</p>
          <p className="mt-3 font-semibold">We do not sell, rent, or share your personal information with third parties for their marketing purposes.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">6. Data Security</h2>
          <p>We implement reasonable administrative, technical, and physical safeguards to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">7. Cookies & Analytics</h2>
          <p>We may use cookies, web beacons, and similar technologies to analyze website traffic and improve user experience. You can control cookies through your browser settings.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">8. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Access the personal information we hold about you</li>
            <li>Request correction or deletion of your information</li>
            <li>Opt out of SMS communications at any time</li>
          </ul>
        </section>

        <section id="ccpa">
          <h2 className="text-xl font-bold text-slate-800 mb-3">9. California Privacy Rights (CCPA)</h2>
          <p>California residents have specific rights regarding their personal information under the California Consumer Privacy Act (CCPA):</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>Right to Know:</strong> You have the right to know what personal information we collect, use, disclose, and sell</li>
            <li><strong>Right to Delete:</strong> You have the right to request deletion of your personal information</li>
            <li><strong>Right to Opt-Out:</strong> You have the right to opt out of the sale of your personal information</li>
          </ul>
          <p className="mt-3"><strong>Important:</strong> FindALocalPro does not sell personal information as defined under CCPA.</p>
          <p className="mt-3">To exercise your rights, email us at privacy@findalocalpro.com or call (630) 407-1727. We will respond to verifiable requests within 45 days.</p>
          <p className="mt-3 font-semibold">Do Not Sell My Personal Information</p>
          <p>As stated above, we do not sell personal information. However, if our practices change in the future, California residents will have the right to opt out of such sales.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">10. Third-Party Service Connections</h2>
          <p>When we match you with a service provider through our platform:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Your contact information and service request details are shared with that specific provider solely to fulfill your request</li>
            <li>This sharing is necessary to provide our referral service and is not considered a "sale" of personal information under CCPA</li>
            <li>The service provider may contact you directly to discuss your project and provide their services</li>
          </ul>
          <p className="mt-3">Each service provider operates independently and has their own privacy practices. We recommend reviewing their privacy policies when working with them.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">11. Contact Us</h2>
          <p>If you have questions about this Privacy Policy or wish to exercise your rights, contact us:</p>
          <ul className="list-none mt-2 space-y-1">
            <li><strong>Email:</strong> privacy@findalocalpro.com</li>
            <li><strong>Phone:</strong> 630-555-0100</li>
            <li><strong>SMS:</strong> Reply HELP to any message</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">12. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.</p>
        </section>
      </div>
    </div>
  );
}
