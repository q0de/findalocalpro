'use client';

import { useEffect, useRef } from 'react';

/**
 * BlogContent — Enhanced blog post renderer
 * 
 * Takes raw HTML and enhances it with:
 * - Drop cap on first paragraph
 * - Callout cards for tips/warnings (paragraphs starting with bold DuPage/Critical/Prevention/Pro tip)
 * - Visual section dividers between h2s
 * - Scroll-triggered fade-in on sections
 * - Enhanced list styling with icons
 * - Pull quotes for key insights
 */
export function BlogContent({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // 1. Drop cap on first paragraph
    const firstP = el.querySelector('p');
    if (firstP && firstP.textContent && firstP.textContent.length > 50) {
      firstP.classList.add('blog-drop-cap');
    }

    // 2. Enhance h2s with section dividers and scroll animation
    const h2s = el.querySelectorAll('h2');
    h2s.forEach((h2) => {
      // Add divider before each h2 (except if it's the first element)
      if (h2.previousElementSibling) {
        const divider = document.createElement('div');
        divider.className = 'blog-section-divider';
        divider.innerHTML = '<span></span><span></span><span></span>';
        h2.parentNode?.insertBefore(divider, h2);
      }
      // Add scroll reveal class
      h2.classList.add('blog-reveal');
    });

    // 3. Enhance tip/callout paragraphs
    const allPs = el.querySelectorAll('p');
    allPs.forEach((p) => {
      const text = p.textContent || '';
      const strong = p.querySelector('strong');
      const strongText = strong?.textContent || '';
      
      // Warning/Critical callouts
      if (strongText.match(/^(Critical|Warning|⚠️|Important)/i)) {
        wrapInCallout(p, 'warning', 'warning');
      }
      // Tip callouts
      else if (strongText.match(/^(Pro tip|DuPage County tip|Prevention tip|Tip)/i) || text.match(/^(Pro tip|DuPage County tip)/i)) {
        wrapInCallout(p, 'tip', 'tips_and_updates');
      }
    });

    // 4. Enhance ordered lists with checkmarks/numbers styling
    const ols = el.querySelectorAll('ol');
    ols.forEach((ol) => {
      ol.classList.add('blog-numbered-list');
    });

    // 5. Enhance unordered lists
    const uls = el.querySelectorAll('ul');
    uls.forEach((ul) => {
      ul.classList.add('blog-check-list');
    });

    // 6. Scroll reveal observer
    const reveals = el.querySelectorAll('.blog-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('blog-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((r) => observer.observe(r));

    // 7. Enhance tables
    const tables = el.querySelectorAll('table');
    tables.forEach((table) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'blog-table-wrapper';
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    return () => observer.disconnect();
  }, [html]);

  return (
    <>
      <div
        ref={containerRef}
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <style>{blogStyles}</style>
    </>
  );
}

function wrapInCallout(p: Element, type: 'tip' | 'warning', icon: string) {
  const wrapper = document.createElement('div');
  wrapper.className = `blog-callout blog-callout-${type}`;
  
  const iconEl = document.createElement('span');
  iconEl.className = 'material-symbols-rounded blog-callout-icon';
  iconEl.textContent = icon;
  
  const content = document.createElement('div');
  content.className = 'blog-callout-content';
  content.innerHTML = p.innerHTML;
  
  wrapper.appendChild(iconEl);
  wrapper.appendChild(content);
  p.parentNode?.replaceChild(wrapper, p);
}

const blogStyles = `
  /* ═══ Base Typography ═══ */
  .blog-content {
    font-size: 1.0625rem;
    line-height: 1.8;
    color: #475569;
    letter-spacing: -0.01em;
  }

  .blog-content p {
    margin-bottom: 1.5rem;
  }

  .blog-content strong {
    color: #1e293b;
    font-weight: 700;
  }

  .blog-content a {
    color: #7c3aed;
    font-weight: 600;
    text-decoration: none;
    border-bottom: 2px solid #e9d5ff;
    transition: border-color 0.2s, color 0.2s;
  }

  .blog-content a:hover {
    color: #6d28d9;
    border-bottom-color: #7c3aed;
  }

  /* ═══ Drop Cap ═══ */
  .blog-drop-cap::first-letter {
    float: left;
    font-size: 3.5rem;
    line-height: 0.85;
    font-weight: 900;
    color: #7c3aed;
    padding-right: 0.5rem;
    padding-top: 0.15rem;
    font-family: "Fredoka", sans-serif;
  }

  /* ═══ Headings ═══ */
  .blog-content h2 {
    font-family: "Fredoka", sans-serif;
    font-size: 1.625rem;
    font-weight: 900;
    color: #0f172a;
    margin-top: 0;
    margin-bottom: 1rem;
    line-height: 1.25;
    letter-spacing: -0.02em;
  }

  .blog-content h3 {
    font-family: "Fredoka", sans-serif;
    font-size: 1.25rem;
    font-weight: 800;
    color: #1e293b;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
    line-height: 1.3;
  }

  /* ═══ Section Dividers ═══ */
  .blog-section-divider {
    display: flex;
    justify-content: center;
    gap: 6px;
    padding: 2.5rem 0 2rem;
  }

  .blog-section-divider span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #c4b5fd;
  }

  .blog-section-divider span:nth-child(2) {
    background: #8b5cf6;
  }

  /* ═══ Lists ═══ */
  .blog-content ul,
  .blog-content ol {
    margin-bottom: 1.5rem;
    padding-left: 0;
    list-style: none;
  }

  .blog-content ul li,
  .blog-content ol li {
    position: relative;
    padding-left: 1.75rem;
    margin-bottom: 0.625rem;
    line-height: 1.7;
  }

  .blog-content ul li::before {
    content: '';
    position: absolute;
    left: 0.25rem;
    top: 0.65rem;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #c4b5fd;
  }

  .blog-content ol {
    counter-reset: blog-counter;
  }

  .blog-content ol li {
    counter-increment: blog-counter;
  }

  .blog-content ol li::before {
    content: counter(blog-counter);
    position: absolute;
    left: 0;
    top: 0.05rem;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: #ede9fe;
    color: #7c3aed;
    font-size: 0.75rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ═══ Callout Cards ═══ */
  .blog-callout {
    display: flex;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    border-radius: 1rem;
    margin: 1.5rem 0;
    border: 1px solid;
  }

  .blog-callout-tip {
    background: #fefce8;
    border-color: #fde68a;
  }

  .blog-callout-tip .blog-callout-icon {
    color: #d97706;
    font-size: 1.25rem;
    margin-top: 0.1rem;
    flex-shrink: 0;
  }

  .blog-callout-warning {
    background: #fef2f2;
    border-color: #fecaca;
  }

  .blog-callout-warning .blog-callout-icon {
    color: #dc2626;
    font-size: 1.25rem;
    margin-top: 0.1rem;
    flex-shrink: 0;
  }

  .blog-callout-content {
    flex: 1;
  }

  .blog-callout-content p {
    margin: 0;
  }

  /* ═══ Tables ═══ */
  .blog-table-wrapper {
    overflow-x: auto;
    margin: 1.5rem 0;
    border-radius: 0.75rem;
    border: 1px solid #e2e8f0;
  }

  .blog-content table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }

  .blog-content th {
    background: #f8fafc;
    font-weight: 700;
    color: #1e293b;
    text-align: left;
    padding: 0.75rem 1rem;
    border-bottom: 2px solid #e2e8f0;
  }

  .blog-content td {
    padding: 0.75rem 1rem;
    border-top: 1px solid #f1f5f9;
  }

  .blog-content tr:hover td {
    background: #f8fafc;
  }

  /* ═══ Scroll Reveal ═══ */
  .blog-reveal {
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .blog-revealed {
    opacity: 1;
    transform: translateY(0);
  }

  /* ═══ Responsive ═══ */
  @media (max-width: 640px) {
    .blog-content {
      font-size: 1rem;
    }
    .blog-content h2 {
      font-size: 1.375rem;
    }
    .blog-drop-cap::first-letter {
      font-size: 2.75rem;
    }
  }
`;
