import { tiers } from "../tiers";
import { Tier } from "../types/Tier";
import { Host } from "../data";

/**
 * Calculate the best tier for a collective based on its usage metrics
 * @param host The collective to calculate the best tier for
 * @returns An object containing the best tier and the monthly cost
 */
export const calculateBestTier = (
  host: Host
): { tier: Tier; monthlyCost: number } => {
  // Extract relevant values from collective

  // Calculate costs for each tier
  const tierCosts = tiers.map((tier) => {
    // Base price
    let cost = tier.pricePerMonth;

    // Additional collectives cost
    const additionalCollectives = Math.max(
      0,
      host.totalActiveCollectives - tier.includedCollectives
    );
    cost += additionalCollectives * tier.pricePerAdditionalCollective;

    // Additional expenses cost
    // TODO: include expenses past month
    const additionalExpenses = Math.max(
      0,
      host.totalExpenses - tier.includedExpensesPerMonth
    );
    cost += additionalExpenses * tier.pricePerAdditionalExpense;

    // Crowdfunding fee
    // TODO: include crowdfundingUSD past month
    cost += host.totalRaisedCrowdfundingUSD * tier.crowdfundingFee;

    return { tier, monthlyCost: cost };
  });

  // Find the tier with the lowest cost
  return tierCosts.reduce(
    (lowest, current) =>
      current.monthlyCost < lowest.monthlyCost ? current : lowest,
    tierCosts[0]
  );
};

/**
 * Format a monetary value in cents to a currency string
 * @param value The value in cents
 * @param currency The currency code
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number,
  currency: string = "$"
): string => {
  return `${currency} ${(value / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
