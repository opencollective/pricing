import { DefaultSummary } from "@/components/DefaultSummary";
import FinancialOutcomeWrapper from "@/components/FinancialOutcomeWrapper";

/**
 * Page component for the landing page that contains just the plan finder sliders
 * It uses the PricingContext to connect with the layout
 */
export default async function LandingPage() {
  return (
    <div className="space-y-12">
      <div className="bg-muted/75 rounded-2xl p-6 pt-8">
        <DefaultSummary />
      </div>
      <div className="bg-muted/75 rounded-2xl p-6 pt-8">
        <FinancialOutcomeWrapper />
      </div>
    </div>
  );
}
