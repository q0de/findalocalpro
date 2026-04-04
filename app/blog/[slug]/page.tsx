import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { blogPosts, getBlogPost } from '@/lib/blog-posts';
import { BlogContent } from './BlogContent';

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: 'Post Not Found | FindALocalPro' };

  const safeTitle = `${post.title} | FindALocalPro`.slice(0, 60);
  const safeDesc = post.description.slice(0, 155);

  return {
    title: safeTitle,
    description: safeDesc,
    openGraph: {
      title: post.title,
      description: safeDesc,
      type: 'article',
      url: `https://findalocalpro.com/blog/${post.slug}`,
      publishedTime: post.publishedDate,
      modifiedTime: post.modifiedDate,
      authors: ['FindALocalPro Team'],
      images: [{ url: 'https://findalocalpro.com/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: safeDesc,
      images: ['https://findalocalpro.com/og-image.png'],
    },
    alternates: { canonical: `https://findalocalpro.com/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedDate,
    dateModified: post.modifiedDate,
    author: { '@type': 'Organization', name: 'FindALocalPro', url: 'https://findalocalpro.com' },
    publisher: { '@type': 'Organization', name: 'FindALocalPro', url: 'https://findalocalpro.com' },
    mainEntityOfPage: `https://findalocalpro.com/blog/${post.slug}`,
  };

  const faqJsonLd = post.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  } : null;

  const otherPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const serviceLinks = post.relatedServices.map(s => {
    const labels: Record<string, string> = { plumbing: 'Plumbing', hvac: 'HVAC', electricians: 'Electricians', roofing: 'Roofing', 'pest-control': 'Pest Control', 'appliance-repair': 'Appliance Repair' };
    return { slug: s, label: labels[s] || s };
  });

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

      <main className="min-h-screen bg-white">
        {/* Hero Header */}
        <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="max-w-3xl mx-auto px-6 pt-6">
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.title }]} />
          </div>

          <header className="max-w-3xl mx-auto px-6 pt-8 pb-12">
            {/* Category tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {serviceLinks.map(s => (
                <Link key={s.slug} href={`/services/${s.slug}`} className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-purple-200 transition-colors">
                  {s.label}
                </Link>
              ))}
            </div>

            <h1 className="text-3xl md:text-[2.75rem] font-black text-slate-900 leading-[1.15] mb-6">
              {post.title}
            </h1>

            <p className="text-xl text-slate-500 leading-relaxed font-medium mb-8">
              {post.description}
            </p>

            {/* Meta bar */}
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                  <span className="material-symbols-rounded text-white text-sm">verified</span>
                </div>
                <span className="font-semibold text-slate-600">FindALocalPro Team</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <time dateTime={post.publishedDate}>
                {new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </time>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="flex items-center gap-1">
                <span className="material-symbols-rounded text-base">schedule</span>
                {post.readingTime}
              </span>
            </div>
          </header>
        </div>

        <article className="max-w-3xl mx-auto px-6 pt-12 pb-12">
          {/* Content with enhanced typography */}
          <BlogContent html={post.content} />

          {/* FAQ Section — Interactive Accordions */}
          {post.faqs.length > 0 && (
            <section className="mt-20 pt-12 border-t-2 border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <span className="material-symbols-rounded text-purple-600">help</span>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Common Questions</h2>
                  <p className="text-sm text-slate-500">Quick answers from our verification team</p>
                </div>
              </div>
              <div className="space-y-3">
                {post.faqs.map((faq, i) => (
                  <details key={i} className="group bg-white border-2 border-slate-100 rounded-2xl overflow-hidden hover:border-purple-200 transition-colors">
                    <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-slate-800 hover:text-purple-700 transition-colors text-[0.95rem]">
                      {faq.q}
                      <span className="material-symbols-rounded text-slate-400 group-open:rotate-180 transition-transform duration-300 shrink-0 ml-4 text-xl">expand_more</span>
                    </summary>
                    <div className="px-5 pb-5 -mt-1">
                      <p className="text-slate-600 leading-relaxed text-[0.95rem]">{faq.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* CTA Card */}
          <section className="mt-16">
            <div className="relative bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-8 md:p-10 text-white overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
              
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-black mb-3">
                  Need a Verified Pro?
                </h2>
                <p className="text-purple-200 mb-8 max-w-md text-[0.95rem] leading-relaxed">
                  Every contractor on FindALocalPro is verified against 4 government databases. Free for homeowners in DuPage County.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/get-matched" className="ripple-btn inline-flex items-center gap-2 bg-white text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors shadow-lg">
                    <span className="material-symbols-rounded">search</span>
                    Get Matched Free
                  </Link>
                  <a href="tel:6304071727" className="inline-flex items-center gap-2 border-2 border-white/30 px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors">
                    <span className="material-symbols-rounded">call</span>
                    (630) 407-1727
                  </a>
                </div>
              </div>
            </div>
          </section>
        </article>

        {/* Related Posts */}
        {otherPosts.length > 0 && (
          <section className="bg-slate-50 border-t border-slate-100 py-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900">Keep Reading</h2>
                <Link href="/blog" className="text-purple-600 font-bold text-sm flex items-center gap-1 hover:underline">
                  All guides <span className="material-symbols-rounded text-base">arrow_forward</span>
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                {otherPosts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-purple-300 hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                      <span className="material-symbols-rounded text-sm">schedule</span>
                      {p.readingTime}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-purple-700 transition-colors mb-2">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
