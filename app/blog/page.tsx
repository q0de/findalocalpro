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

const serviceIcons: Record<string, string> = {
  plumbing: 'water_drop',
  hvac: 'mode_fan',
  electricians: 'bolt',
  roofing: 'roofing',
  'pest-control': 'pest_control',
  'appliance-repair': 'settings',
};

const serviceColors: Record<string, string> = {
  plumbing: 'bg-blue-100 text-blue-600',
  hvac: 'bg-purple-100 text-purple-600',
  electricians: 'bg-amber-100 text-amber-600',
  roofing: 'bg-red-100 text-red-600',
  'pest-control': 'bg-emerald-100 text-emerald-600',
  'appliance-repair': 'bg-slate-100 text-slate-600',
};

export default function BlogIndex() {
  const [featured, ...rest] = blogPosts;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
        </div>

        {/* Header */}
        <section className="max-w-5xl mx-auto px-6 pt-8 pb-6">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
            The Homeowner&apos;s Playbook
          </h1>
          <p className="text-lg text-slate-500 max-w-xl">
            Expert guides from our verification team — contractor tips, safety alerts, and smart decisions for DuPage County homeowners.
          </p>
        </section>

        {/* Featured Post — Hero Card */}
        <section className="max-w-5xl mx-auto px-6 pb-12">
          <Link
            href={`/blog/${featured.slug}`}
            className="group block relative bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-8 md:p-12 text-white overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1"
          >
            {/* Decorative */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/5 rounded-full" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-white/20 text-white/90 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Featured Guide
                </span>
                <span className="text-purple-200 text-sm">{featured.readingTime}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-3 group-hover:translate-x-1 transition-transform">
                {featured.title}
              </h2>
              <p className="text-purple-200 md:max-w-lg leading-relaxed mb-6">
                {featured.description}
              </p>
              <div className="inline-flex items-center gap-2 text-white font-bold text-sm">
                Read the full guide
                <span className="material-symbols-rounded text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>
          </Link>
        </section>

        {/* Rest of Posts — Card Grid */}
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <div className="grid md:grid-cols-2 gap-6">
            {rest.map((post) => {
              const primaryService = post.relatedServices[0];
              const icon = serviceIcons[primaryService] || 'article';
              const color = serviceColors[primaryService] || 'bg-slate-100 text-slate-600';

              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-purple-300 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  {/* Card Header with icon */}
                  <div className="p-6 pb-0">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}>
                        <span className="material-symbols-rounded text-xl">{icon}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <span className="material-symbols-rounded text-sm">schedule</span>
                        {post.readingTime}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="px-6 pb-6 flex-1 flex flex-col">
                    <h2 className="text-lg font-black text-slate-900 group-hover:text-purple-700 transition-colors mb-2 leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-4">
                      {post.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {post.relatedServices.slice(0, 3).map(s => (
                        <span key={s} className="bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-md text-xs font-semibold capitalize">
                          {s.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                    <time dateTime={post.publishedDate} className="text-xs text-slate-400">
                      {new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </time>
                    <span className="text-purple-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read
                      <span className="material-symbols-rounded text-base">arrow_forward</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-50 border-t border-slate-100 py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-5">
              <span className="material-symbols-rounded text-purple-600 text-2xl">verified</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3">Need a Verified Pro?</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">Every contractor on FindALocalPro is checked against 4 government databases. Free for homeowners.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/get-matched" className="ripple-btn inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg">
                Get Matched Free
              </Link>
              <a href="tel:6307032607" className="inline-flex items-center gap-2 border-2 border-slate-200 bg-white text-slate-700 px-8 py-3.5 rounded-xl font-bold hover:border-purple-300 transition-colors">
                <span className="material-symbols-rounded">call</span>
                (630) 703-2607
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
