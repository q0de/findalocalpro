'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-4 py-3 flex gap-3">
        <a
          href="tel:6304071727"
          className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm"
        >
          <span className="material-symbols-rounded text-lg">call</span>
          Call Now
        </a>
        <Link
          href="/get-matched"
          className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-xl font-bold text-sm"
        >
          <span className="material-symbols-rounded text-lg">search</span>
          Get Matched
        </Link>
      </div>
    </div>
  );
}
