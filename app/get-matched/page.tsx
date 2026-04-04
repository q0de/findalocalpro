import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ChatSection } from '../ChatSection';

export const metadata: Metadata = {
  title: 'Get Matched With a Verified Pro | FindALocalPro',
  description: 'Tell us what you need and we\'ll connect you with a licensed, verified home service pro in 60 seconds. Free, no obligation.',
  openGraph: {
    title: 'Get Matched With a Verified Pro',
    description: 'Connect with a licensed home service professional in 60 seconds. Free, no obligation.',
    type: 'website',
    url: 'https://findalocalpro.com/get-matched',
    images: [{ url: 'https://findalocalpro.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get Matched With a Verified Pro',
    description: 'Connect with a licensed home service professional in 60 seconds. Free, no obligation.',
    images: ['https://findalocalpro.com/og-image.png'],
  },
  alternates: { canonical: 'https://findalocalpro.com/get-matched' },
};

export default function GetMatchedPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header step={0} totalSteps={0} />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-lg mx-auto">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Get Matched' },
            ]}
          />
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Get Matched With a Pro</h1>
            <p className="text-slate-500 text-sm">Tell us what you need — we&apos;ll connect you in 60 seconds</p>
          </div>
          <ChatSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
