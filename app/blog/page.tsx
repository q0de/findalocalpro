import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { blogPosts } from '@/lib/blog-posts';

export const metadata: Metadata = {
  title: 'Home Service Tips & Guides for DuPage County | FindALocalPro Blog',
  description: 'Expert guides on hiring contractors, home maintenance, and protecting your investment. Local tips for Downers Grove, Naperville, and DuPage County homeowners.',
  openGraph: {
    title: 'FindALocalPro Blog — Home Service Tips & Guides',
    description: 'Expert guides for DuPage County homeowners on hiring contractors, home maintenance, and protecting your investment.',
    url: 'https://findalocalpro.com/blog',
  },
  alternates: { canonical: 'https://findalocalpro.com/blog' },
};

export default function BlogIndex() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 pt-6">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
        </div>

        <section className="max-w-4xl mx-auto px-6 pt-8 pb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Home Service Tips & Guides
          </h1>
          <p className="text-lg text-slate-600 mb-12 max-w-2xl">
            Expert advice for DuPage County homeowners — from verifying contractors to handling emergencies and making smart upgrade decisions.
          </p>

          <div className="space-y-8">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block group bg-white border border-slate-200 rounded-2xl p-6 md:p-8 hover:border-purple-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                  <time dateTime={post.publishedDate}>
                    {new Date(post.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                  <span>·</span>
                  <span>{post.readingTime}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-purple-700 transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-slate-600 leading-relaxed">{post.description}</p>
                <div className="mt-4 flex items-center gap-1 text-purple-600 font-bold text-sm">
                  Read more
                  <span className="material-symbols-rounded text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-purple-900 text-white py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-black mb-4">Need a Verified Pro?</h2>
            <p className="text-purple-200 mb-8">Every contractor on FindALocalPro is checked against 4 government databases. Free for homeowners.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/get-matched" className="inline-flex items-center gap-2 bg-white text-purple-900 px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors">
                Get Matched Free
              </Link>
              <a href="tel:6307032607" className="inline-flex items-center gap-2 border-2 border-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors">
                Call (630) 703-2607
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
