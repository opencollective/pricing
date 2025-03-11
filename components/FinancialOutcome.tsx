import { fetchData } from "../lib/data";
import {
  calculateBestTier,
  formatCurrency,
} from "../lib/helpers/tierCalculation";
import { Collective } from "./CollectivesTable";

export async function FinancialOutcome({}) {
  const collectives = (await fetchData()) as Collective[];

  // Calculate financial outcomes
  const financialOutcomes = collectives.map((collective) => {
    const { tier, monthlyCost } = calculateBestTier(collective);
    return {
      id: collective.id,
      name: collective.name,
      recommendedTier: tier.type,
      monthlyCost,
    };
  });

  // Calculate total income
  const totalMonthlyIncome = financialOutcomes.reduce(
    (total, outcome) => total + outcome.monthlyCost,
    0
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Financial Outcome Analysis</h1>

      <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="text-xl font-semibold text-green-800 mb-2">
          Total Monthly Income
        </h2>
        <p className="text-3xl font-bold text-green-700">
          {formatCurrency(totalMonthlyIncome)}
        </p>
      </div>
    </div>
  );
}
