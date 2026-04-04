import type { Metadata } from 'next';
import { Terms } from './TermsContent';

export const metadata: Metadata = {
  title: 'Terms & Conditions | FindALocalPro',
  description: 'Terms and conditions of service. SMS messaging terms, service guarantees, liability limitations, and user responsibilities.',
  openGraph: {
    title: 'Terms & Conditions | FindALocalPro',
    description: 'Terms and conditions of service for FindALocalPro.',
    type: 'website',
    url: 'https://findalocalpro.com/terms',
    images: [{ url: 'https://findalocalpro.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary',
    title: 'Terms & Conditions | FindALocalPro',
    description: 'Terms and conditions of service for FindALocalPro.',
  },
  alternates: { canonical: 'https://findalocalpro.com/terms' },
};

export default function TermsPage() {
  return <Terms />;
}
