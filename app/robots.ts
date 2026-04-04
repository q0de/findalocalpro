import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          // Block faceted/filtered URLs that create crawl waste
          '/*?*service=',
          '/*?*sort=',
          '/*?*filter=',
          '/*?*page=',
          '/*?*q=',
        ],
      },
    ],
    sitemap: 'https://findalocalpro.com/sitemap.xml',
  };
}
