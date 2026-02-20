import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'FindALocalPro — Find Trusted Home Service Pros Near You',
  description: 'FindALocalPro — Find trusted, licensed home service professionals in your area. Plumbing, HVAC, electrical, roofing, and 20+ more services.',
  keywords: 'find a local contractor, home service professionals, licensed plumber near me, HVAC repair, electrician, roofing contractor, handyman, home repair, trusted contractors',
  openGraph: {
    title: 'FindALocalPro — Find Trusted Home Service Pros Near You',
    description: 'Connect with vetted, licensed home service professionals in 60 seconds. Plumbing, HVAC, electrical, roofing, and 20+ more services.',
    type: 'website',
    url: 'https://findalocalpro.com',
    images: [{ url: 'https://findalocalpro.com/og-image.png', width: 1200, height: 630, alt: 'FindALocalPro — Find Trusted Home Service Pros' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FindALocalPro — Find Trusted Home Service Pros Near You',
    description: 'Connect with vetted, licensed home service professionals in 60 seconds. Plumbing, HVAC, electrical, roofing, and 20+ more services.',
    images: ['https://findalocalpro.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://findalocalpro.com',
  },
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'FindALocalPro',
  url: 'https://findalocalpro.com',
  description: 'AI-powered platform connecting homeowners with trusted, licensed home service professionals.',
  foundingDate: '2026',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: 'English',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'FindALocalPro',
  url: 'https://findalocalpro.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://findalocalpro.com/?service={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'FindALocalPro',
  url: 'https://findalocalpro.com',
  description: 'Find trusted, licensed home service professionals for plumbing, HVAC, electrical, roofing, and 20+ more services.',
  priceRange: 'Free to use',
  serviceType: ['Plumbing', 'HVAC', 'Electrical', 'Roofing', 'Handyman', 'Water Damage Restoration', 'Mold Removal', 'Appliance Repair', 'Pest Control', 'Locksmith', 'Landscaping', 'Tree Services', 'Solar Installation', 'Flooring', 'Kitchen Remodeling', 'Bathroom Remodeling'],
  areaServed: { '@type': 'Country', name: 'United States' },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How does FindALocalPro work?', acceptedAnswer: { '@type': 'Answer', text: 'Simply tell us what service you need, when you need it, your zip code, and your phone number. A vetted, licensed professional in your area will call you directly — usually within minutes.' } },
    { '@type': 'Question', name: 'Is FindALocalPro free to use?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! FindALocalPro is completely free for homeowners. We connect you with trusted professionals at no cost.' } },
    { '@type': 'Question', name: 'Are the professionals on FindALocalPro licensed and insured?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. All professionals on our platform are vetted, licensed, and insured. We verify credentials before they can receive jobs.' } },
    { '@type': 'Question', name: 'What services does FindALocalPro offer?', acceptedAnswer: { '@type': 'Answer', text: 'We cover 20+ home services including plumbing, HVAC, electrical, roofing, handyman, water damage restoration, mold removal, appliance repair, pest control, locksmith, landscaping, tree services, solar, flooring, kitchen and bathroom remodeling, and more.' } },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <Script defer data-domain="findalocalpro.com" src="https://plausible.io/js/script.js" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <Script src="/webmcp.js" defer />
      </head>
      <body className="text-slate-900 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
