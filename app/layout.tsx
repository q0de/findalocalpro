import type { Metadata } from 'next';
import Script from 'next/script';
import { StickyMobileCTA } from '@/components/StickyMobileCTA';
import { ScrollProgress } from '@/components/ScrollProgress';
import './globals.css';

export const metadata: Metadata = {
  title: 'Verified Home Pros in Downers Grove & DuPage County, IL | FindALocalPro',
  description: 'Every contractor verified against 4 government databases — IDFPR license, BBB, IL SOS registration & BuildZoom. 11 verified pros across plumbing, HVAC, electrical & roofing. Free for homeowners. (630) 407-1727',
  keywords: 'verified contractors Downers Grove, licensed plumber DuPage County, HVAC repair Downers Grove IL, electrician near me Downers Grove, roofing contractor DuPage, home service professionals Illinois',
  openGraph: {
    title: 'Verified Home Pros in Downers Grove & DuPage County | FindALocalPro',
    description: 'Every contractor verified against 4 government databases. Free matching for DuPage County homeowners. (630) 407-1727',
    type: 'website',
    url: 'https://findalocalpro.com',
    images: [{ url: 'https://findalocalpro.com/og-image.png', width: 1200, height: 630, alt: 'FindALocalPro — Verified Home Service Pros in DuPage County' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verified Home Pros in Downers Grove & DuPage County | FindALocalPro',
    description: 'Every contractor verified against 4 government databases. Free matching for DuPage County homeowners. (630) 407-1727',
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

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'FindALocalPro',
  url: 'https://findalocalpro.com',
  telephone: '+1-630-407-1727',
  description: 'Verified home service professionals in Downers Grove and DuPage County, IL. Every pro checked against 4 government databases.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Downers Grove',
    addressRegion: 'IL',
    postalCode: '60515',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '41.7920',
    longitude: '-88.0112',
  },
  areaServed: ['Downers Grove', 'Westmont', 'Lisle', 'Woodridge', 'Darien', 'Naperville', 'Lombard', 'Glen Ellyn', 'Wheaton', 'Hinsdale', 'Oak Brook', 'Bolingbrook'],
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '14:00' },
  ],
  priceRange: 'Free',
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap" rel="stylesheet" />
        <Script src="/webmcp.js" defer />
      </head>
      <body className="text-slate-900 min-h-screen flex flex-col">
        <ScrollProgress />
        {children}
        <StickyMobileCTA />
      </body>
    </html>
  );
}
