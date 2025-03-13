import { defaultTiers } from "../tiers";
import { Tier, PricingInterval } from "../types/Tier";
import { Host } from "../data";

/**
 * Calculate the best tier for a collective based on its usage metrics
 * @param host The collective to calculate the best tier for
 * @returns An object containing the best tier, interval, monthly cost, and monthly breakdown
 */
export const calculateBestTier = (
  host: Host
): {
  tier: Tier;
  interval: PricingInterval;
  monthlyCost: number;
  yearlyCost: number;
  monthlyBreakdown?: Array<{
    month: string;
    cost: number;
    activeCollectives: number;
    additionalCollectivesCost: number;
    expenses: number;
    additionalExpensesCost: number;
    crowdfundingFee: number;
  }>;
} => {
  // Create array to hold options for each tier and interval
  const tierOptions = [];

  // Process each tier
  for (const tier of defaultTiers) {
    // Monthly payment option
    const monthlyBreakdown = [];
    let yearlyTotalMonthlyPayment = 0;

    // Calculate cost for each month if monthly data exists
    if (
      host.monthlyActiveCollectives &&
      host.monthlyActiveCollectives.length > 0 &&
      host.monthlyExpenses &&
      host.monthlyExpenses.length > 0
    ) {
      // Create a map of month -> expense count for easier lookup
      const expensesByMonth = new Map();
      for (const expenseData of host.monthlyExpenses) {
        expensesByMonth.set(expenseData.month, expenseData.count);
      }

      for (const collectiveData of host.monthlyActiveCollectives) {
        const month = collectiveData.month;

        // Base price for this month
        let monthCost = tier.pricePerMonth;

        // Additional collectives cost for this month
        const monthActiveCollectives = collectiveData.count || 0;
        const additionalCollectives = Math.max(
          0,
          monthActiveCollectives - tier.includedCollectives
        );
        const additionalCollectivesCost =
          additionalCollectives * tier.pricePerAdditionalCollective;
        monthCost += additionalCollectivesCost;

        // Additional expenses cost for this month
        const monthExpenses = expensesByMonth.get(month) || 0;
        const additionalExpenses = Math.max(
          0,
          monthExpenses - tier.includedExpensesPerMonth
        );
        const additionalExpensesCost =
          additionalExpenses * tier.pricePerAdditionalExpense;
        monthCost += additionalExpensesCost;

        // Crowdfunding fee for this month - assuming equal distribution of crowdfunding across months
        const totalMonths = host.monthlyActiveCollectives.length;
        const monthCrowdfunding = host.totalRaisedCrowdfundingUSD / totalMonths;
        const crowdfundingFee = monthCrowdfunding * tier.crowdfundingFee;
        monthCost += crowdfundingFee;

        // Add to yearly total
        yearlyTotalMonthlyPayment += monthCost;

        // Save monthly breakdown
        monthlyBreakdown.push({
          month,
          cost: monthCost,
          activeCollectives: monthActiveCollectives,
          additionalCollectivesCost,
          expenses: monthExpenses,
          additionalExpensesCost,
          crowdfundingFee,
        });
      }
    } else {
      // If no monthly data, use the overall totals
      // Base price
      let monthlyCost = tier.pricePerMonth;

      // Additional collectives cost
      const additionalCollectives = Math.max(
        0,
        host.totalActiveCollectives - tier.includedCollectives
      );
      const additionalCollectivesCost =
        additionalCollectives * tier.pricePerAdditionalCollective;
      monthlyCost += additionalCollectivesCost;

      // Additional expenses cost - calculate from monthly expenses if available
      let totalExpenses = 0;
      if (host.monthlyExpenses && host.monthlyExpenses.length > 0) {
        totalExpenses = host.monthlyExpenses.reduce(
          (sum, month) => sum + month.count,
          0
        );
      }

      const additionalExpenses = Math.max(
        0,
        totalExpenses - tier.includedExpensesPerMonth
      );
      const additionalExpensesCost =
        additionalExpenses * tier.pricePerAdditionalExpense;
      monthlyCost += additionalExpensesCost;

      // Crowdfunding fee
      const crowdfundingFee =
        host.totalRaisedCrowdfundingUSD * tier.crowdfundingFee;
      monthlyCost += crowdfundingFee;

      // Calculate yearly total based on 12 months of this cost
      yearlyTotalMonthlyPayment = monthlyCost * 12;
    }

    // Calculate average monthly cost
    const avgMonthlyCost =
      yearlyTotalMonthlyPayment / (host.monthlyActiveCollectives?.length || 12);

    // Add monthly payment option
    tierOptions.push({
      tier,
      interval: PricingInterval.MONTHLY,
      monthlyCost: avgMonthlyCost,
      yearlyCost: yearlyTotalMonthlyPayment,
      monthlyBreakdown,
    });

    // Calculate yearly payment option (10 months for the price of 12)
    const yearlyPaymentAmount = yearlyTotalMonthlyPayment * (10 / 12);

    // Add yearly payment option
    tierOptions.push({
      tier,
      interval: PricingInterval.YEARLY,
      monthlyCost: yearlyPaymentAmount / 12, // Convert to monthly equivalent for comparison
      yearlyCost: yearlyPaymentAmount,
      monthlyBreakdown,
    });
  }

  // Find the option with the lowest cost
  return tierOptions.reduce(
    (lowest, current) =>
      current.monthlyCost < lowest.monthlyCost ? current : lowest,
    tierOptions[0]
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
