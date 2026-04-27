import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unsubscribed | FindALocalPro",
  robots: "noindex",
};

export default function UnsubscribePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          You&apos;ve been unsubscribed
        </h1>
        <p className="text-gray-600 mb-6">
          You won&apos;t receive any more outreach emails from FindALocalPro.
          If this was a mistake, no action is needed — we only send one-time
          notifications based on public health inspection records.
        </p>
        <a
          href="https://www.findalocalpro.com"
          className="text-green-600 hover:text-green-700 font-medium"
        >
          ← Back to FindALocalPro
        </a>
      </div>
    </main>
  );
}
