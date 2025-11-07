import { DefaultSummary } from "@/components/DefaultSummary";
import FinancialOutcomeWrapper from "@/components/FinancialOutcomeWrapper";

/**
 * Page component for the landing page that contains just the plan finder sliders
 * It uses the PricingContext to connect with the layout
 */
export default async function LandingPage() {
  return (
    <>
      {/* Summary - fixed from top */}
      <div 
        className="bg-muted/75 rounded-2xl p-6 pt-8 shadow-lg"
        style={{ 
          position: 'fixed',
          top: '100px',
          right: '2rem',
          width: '550px',
          maxHeight: 'calc(50vh - 80px)',
          overflow: 'auto',
          zIndex: 40
        }}
      >
        <DefaultSummary />
      </div>
      
      {/* Business Model Outcome - fixed from bottom */}
      <div 
        className="bg-muted/75 rounded-2xl p-6 pt-8 shadow-lg"
        style={{ 
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '550px',
          maxHeight: 'calc(50vh - 80px)',
          overflow: 'auto',
          zIndex: 40
        }}
      >
        <FinancialOutcomeWrapper />
      </div>
    </>
  );
}
