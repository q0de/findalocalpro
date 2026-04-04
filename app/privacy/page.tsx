import type { Metadata } from 'next';
import { PrivacyPolicy } from './PrivacyContent';

export const metadata: Metadata = {
  title: 'Privacy Policy | FindALocalPro',
  description: 'How we collect, use, and protect your personal information. Data handling, SMS consent, cookies, and your rights.',
  openGraph: {
    title: 'Privacy Policy | FindALocalPro',
    description: 'How we collect, use, and protect your personal information.',
    type: 'website',
    url: 'https://findalocalpro.com/privacy',
    images: [{ url: 'https://findalocalpro.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | FindALocalPro',
    description: 'How we collect, use, and protect your personal information.',
  },
  alternates: { canonical: 'https://findalocalpro.com/privacy' },
};

export default function PrivacyPage() {
  return <PrivacyPolicy />;
}
