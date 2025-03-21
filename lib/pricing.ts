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
}): NewTier {
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
    // const yearlyCost = monthlyCost * 12 + crowdfundingFee;

    return {
      tier,
      monthlyCost,
    };
  });

  // Sort tiers by yearly cost to find the cheapest option
  tierCosts.sort((a, b) => a.monthlyCost - b.monthlyCost);

  // Return the tier title with the lowest cost
  return tierCosts[0].tier;
}
