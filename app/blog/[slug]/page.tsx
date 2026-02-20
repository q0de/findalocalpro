import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { blogPosts, getBlogPost } from '@/lib/blog-posts';

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: 'Post Not Found | FindALocalPro' };

  return {
    title: `${post.title} | FindALocalPro`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `https://findalocalpro.com/blog/${post.slug}`,
      publishedTime: post.publishedDate,
      modifiedTime: post.modifiedDate,
      authors: ['FindALocalPro Team'],
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

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-6 pt-6">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.title }]} />
        </div>

        <article className="max-w-3xl mx-auto px-6 pt-8 pb-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
              <time dateTime={post.publishedDate}>
                {new Date(post.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
              <span>·</span>
              <span>{post.readingTime}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">
              {post.title}
            </h1>
            <p className="text-lg text-slate-600">{post.description}</p>
          </div>

          {/* Content */}
          <div
            className="prose prose-slate prose-lg max-w-none
              prose-headings:font-black prose-headings:text-slate-900
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-a:text-purple-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
              prose-li:text-slate-700
              prose-strong:text-slate-900
              prose-table:border prose-table:border-slate-200 prose-th:bg-slate-50 prose-th:p-3 prose-td:p-3 prose-td:border-t prose-td:border-slate-200"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* FAQ Section */}
          {post.faqs.length > 0 && (
            <section className="mt-16 border-t border-slate-200 pt-12">
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-2">
                <span className="material-symbols-rounded text-purple-500">help</span>
                Common Questions
              </h2>
              <div className="space-y-6">
                {post.faqs.map((faq, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-6">
                    <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                    <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="mt-16 bg-purple-50 border border-purple-200 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-3">
              Need a Verified Pro?
            </h2>
            <p className="text-slate-600 mb-6 max-w-lg mx-auto">
              Every contractor on FindALocalPro is verified against 4 government databases. Free for homeowners in DuPage County.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/get-matched" className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors">
                <span className="material-symbols-rounded">search</span>
                Get Matched Free
              </Link>
              <a href="tel:6307032607" className="inline-flex items-center gap-2 border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors">
                <span className="material-symbols-rounded">call</span>
                (630) 703-2607
              </a>
            </div>
          </section>
        </article>

        {/* Related Posts */}
        {otherPosts.length > 0 && (
          <section className="bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-2xl font-black text-slate-900 mb-6">More Guides</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {otherPosts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="bg-white border border-slate-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-md transition-all"
                  >
                    <div className="text-xs text-slate-500 mb-2">{p.readingTime}</div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{p.title}</h3>
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
