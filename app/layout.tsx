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
        <Script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" strategy="beforeInteractive" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <Script id="tailwind-config" strategy="beforeInteractive">{`
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  "brand-pink": "#ff6b9d",
                  "brand-purple": "#8b5cf6",
                  "brand-yellow": "#ffcf2d",
                  "brand-teal": "#2dd4bf",
                  "primary": "#6366f1",
                },
                fontFamily: {
                  "display": ["Fredoka", "sans-serif"],
                  "body": ["Outfit", "sans-serif"]
                },
                borderRadius: {
                  "chat-bot": "2rem 2rem 2rem 0.5rem",
                  "chat-user": "2rem 2rem 0.5rem 2rem",
                },
              },
            },
          }
        `}</Script>
        <style type="text/tailwindcss">{`
          body {
            font-family: 'Outfit', sans-serif;
            background-color: #f0f4ff;
            background-image: radial-gradient(circle at 2px 2px, #e2e8f0 1px, transparent 0);
            background-size: 32px 32px;
          }
          .chat-bubble-bot {
            @apply bg-white border-b-4 border-r-4 border-slate-200 rounded-chat-bot p-5 max-w-[85%] shadow-lg relative;
          }
          .chat-bubble-bot-gradient {
            @apply bg-gradient-to-br from-white to-slate-50 border-2 border-slate-100 rounded-chat-bot p-5 max-w-[85%] shadow-xl relative;
          }
          .chat-bubble-user {
            @apply bg-gradient-to-br from-brand-purple to-primary text-white rounded-chat-user p-5 max-w-[85%] self-end shadow-xl font-medium;
          }
          .option-button {
            @apply bg-white border-2 border-slate-100 px-6 py-4 rounded-2xl hover:scale-105 hover:shadow-xl hover:border-brand-purple transition-all duration-300 text-slate-700 font-bold flex flex-col items-center gap-2 text-center shadow-md cursor-pointer;
          }
          .option-button.selected {
            @apply border-brand-purple bg-purple-50 ring-4 ring-brand-purple/10 scale-105;
          }
          .avatar-container {
            @apply w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-yellow via-brand-pink to-brand-purple flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white;
          }
          .sparkle-badge {
            @apply flex items-center gap-2 bg-gradient-to-r from-brand-yellow/20 to-brand-pink/20 px-4 py-2 rounded-full text-xs font-bold text-slate-700 border border-white/50 backdrop-blur-sm;
          }
          .progress-dot {
            @apply w-3 h-3 rounded-full bg-slate-200 transition-all duration-500;
          }
          .progress-dot.active {
            @apply bg-brand-pink w-8;
          }
          h1, h2, h3, .font-playful {
            font-family: 'Fredoka', sans-serif;
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
          }
        `}</style>
        <Script src="/webmcp.js" defer />
      </head>
      <body className="text-slate-900 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
