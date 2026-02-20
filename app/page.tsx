import { HomePage } from './HomePageClient';

export default function Page() {
  return (
    <>
      {/* Server-rendered H1 for SEO — visually hidden, ChatFlow provides the visual heading */}
      <h1 className="sr-only">Find Trusted Home Service Professionals Near You — Plumbing, HVAC, Electrical & More</h1>
      <HomePage />
    </>
  );
}
