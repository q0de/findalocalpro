import type { Metadata } from 'next';
import { PrivacyPolicy } from './PrivacyContent';

export const metadata: Metadata = {
  title: 'Privacy Policy | FindALocalPro',
  description: 'FindALocalPro privacy policy — how we collect, use, and protect your personal information. Learn about data handling, SMS consent, cookies, and your rights.',
};

export default function PrivacyPage() {
  return <PrivacyPolicy />;
}
