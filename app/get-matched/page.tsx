import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChatSection } from '../ChatSection';

export const metadata: Metadata = {
  title: 'Get Matched With a Verified Pro | FindALocalPro',
  description: 'Tell us what you need and we\'ll connect you with a licensed, verified home service professional in 60 seconds. Free, no obligation.',
};

export default function GetMatchedPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header step={0} totalSteps={0} />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-lg mx-auto">
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
