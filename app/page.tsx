import { FinancialOutcome } from "./components/FinancialOutcome";
import { PricingSection } from "./components/PricingSection";

// This page will be statically generated at build time
// Use the 'generateStaticParams' instead of 'getStaticProps' in App Router
export default async function Home() {
  return (
    <main className="min-h-screen">
      <PricingSection />
    </main>
  );
}
