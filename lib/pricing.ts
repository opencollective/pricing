/**
 * Function to calculate the best tier based on usage metrics
 */
import { NewTier } from "./types/Tier";

export function calculateBestTier({
  tiers,
  usage: { expenses, collectives },
}: {
  tiers: NewTier[];
  usage: { expenses: number; collectives: number };
}): { tier: NewTier; yearlyCost: number; monthlyCost: number } {
  // Calculate costs for all tiers to find the lowest cost one
  const tierCosts = tiers.map((tier) => {
    // Calculate additional expenses cost
    const additionalExpenses = Math.max(
      0,
      expenses - tier.pricingModel.includedExpensesPerMonth
    );
    const additionalExpensesCost =
      additionalExpenses * tier.pricingModel.pricePerAdditionalExpense;

    // Calculate additional collectives cost
    const additionalCollectives = Math.max(
      0,
      collectives - tier.pricingModel.includedCollectives
    );
    const additionalCollectivesCost =
      additionalCollectives * tier.pricingModel.pricePerAdditionalCollective;

    // Calculate crowdfunding fee if applicable
    // const crowdfundingFee = crowdfundingAmount * tier.crowdfundingFee;

    // Calculate monthly total cost
    const monthlyCost =
      tier.pricingModel.pricePerMonth +
      additionalExpensesCost +
      additionalCollectivesCost;

    // Calculate yearly cost (with crowdfunding fee)
    const yearlyCost =
      tier.pricingModel.pricePerMonth * 10 +
      (additionalExpensesCost + additionalCollectivesCost) * 12;

    return {
      tier,
      monthlyCost,
      yearlyCost,
    };
  });

  // Sort tiers by yearly cost to find the cheapest option
  tierCosts.sort((a, b) => a.yearlyCost - b.yearlyCost);

  // Return the tier title with the lowest cost
  return tierCosts[0];
}
