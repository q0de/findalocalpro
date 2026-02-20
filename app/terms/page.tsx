import type { Metadata } from 'next';
import { Terms } from './TermsContent';

export const metadata: Metadata = {
  title: 'Terms & Conditions | FindALocalPro',
  description: 'FindALocalPro terms and conditions of service. Read about our SMS messaging terms, service guarantees, liability limitations, and user responsibilities.',
};

export default function TermsPage() {
  return <Terms />;
}
