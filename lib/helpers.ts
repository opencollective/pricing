import { Host } from "./data";
import { PricingInterval, SelectedPlan } from "./types/Tier";

export function calculateMetrics(collective: Host) {
  const platformTips = collective.id !== 11004;

  const avgExpensesPerMonth = Math.round(
    collective.monthlyExpenses?.reduce((total, month) => {
      return total + month.count;
    }, 0) / 12
  );

  const avgActiveCollectivesPerMonth = Math.round(
    collective.monthlyActiveCollectives?.reduce((total, month) => {
      return total + month.count;
    }, 0) / 12
  );
  return {
    ...collective,
    hostFeesCrowdfundingUSD: collective.totalHostFeesCrowdfundingUSD,
    hostFeesNonCrowdfundingUSD:
      collective.totalHostFeesUSD - collective.totalHostFeesCrowdfundingUSD,
    platformTips,
    avgExpensesPerMonth,
    avgActiveCollectivesPerMonth,
  };
}

export function calculateFees({
  collective,
  selectedPlan,
}: {
  collective: Host;
  selectedPlan: SelectedPlan;
}) {
  const {
    platformTips,
    totalRaisedCrowdfundingUSD,
    hostFeesNonCrowdfundingUSD,
    avgActiveCollectivesPerMonth,
    avgExpensesPerMonth,
  } = calculateMetrics(collective);

  let afterBasePrice = selectedPlan.tier?.pricingModel.pricePerMonth || 0;
  if (selectedPlan.interval === PricingInterval.YEARLY) {
    afterBasePrice = afterBasePrice * 11;
  } else {
    afterBasePrice = afterBasePrice * 12;
  }

  if (!selectedPlan.tier) return null;

  const { includedExpensesPerMonth, includedCollectives } =
    selectedPlan.tier.pricingModel;

  // go through each month and see how many extra expenses there are beyond the includedExpensesPerMonth
  // same thing for includedCollectives, but don't use the monthly data, just use the total collectives and compare each months data

  // const extraExpensesForFullYear =
  //   collective.monthlyExpenses?.reduce((total, month) => {
  //     // For each month, calculate how many expenses exceed the included amount
  //     const extraExpensesThisMonth = Math.max(
  //       0,
  //       month.count - includedExpensesPerMonth
  //     );
  //     return total + extraExpensesThisMonth;
  //   }, 0) || 0;

  // const afterExtraExpensesPerMonth = Math.round(extraExpensesForFullYear / 12);

  const afterExtraExpensesPerMonth = Math.max(
  0,
  avgExpensesPerMonth - includedExpensesPerMonth
  );

  // const extraExpensesForFullYear = afterExtraExpensesPerMonth * 12;

  // const extraCollectivesForFullYear =
  //   collective.monthlyActiveCollectives?.reduce((total, month) => {
  //     // For each month, calculate how many collectives exceed the included amount
  //     const extraCollectivesThisMonth = Math.max(
  //       0,
  //       month.count - includedCollectives
  //     );
  //     return total + extraCollectivesThisMonth;
  //   }, 0) || 0;

  // const afterExtraCollectivesPerMonth = Math.round(
  //   extraCollectivesForFullYear / 12
  // );

  const afterExtraCollectivesPerMonth = Math.max(
  0,
  avgActiveCollectivesPerMonth - includedCollectives
  );

  // const extraCollectivesForFullYear = afterExtraCollectivesPerMonth * 12;

  const platformFeesOnCrowdfunding = platformTips
    ? 0
    : Math.round((totalRaisedCrowdfundingUSD * 5) / 100);
  const platformFeesOnNonCrowdfunding = Math.round(
    (hostFeesNonCrowdfundingUSD * 15) / 100
  );

  const isMonthly = selectedPlan.interval === PricingInterval.MONTHLY;

  const beforeExtraCollectivesPrice = collective.id === 98478 ? 292 : 0; // adjustment for SCN

  const beforeExtraCollectivesCount =
    collective.id === 98478 ? collective.totalCollectives : 0;
  const beforeExtraCollectivesAmount =
    beforeExtraCollectivesPrice * beforeExtraCollectivesCount;

  const afterExtraCollectivesAmount =
    afterExtraCollectivesPerMonth *
    (selectedPlan.tier.pricingModel.pricePerAdditionalCollective || 0);

  const afterExtraExpensesAmount =
    afterExtraExpensesPerMonth *
    (selectedPlan.tier.pricingModel.pricePerAdditionalExpense || 0);
  const fees = {
    before: {
      platformFeesOnCrowdfunding: isMonthly
        ? platformFeesOnCrowdfunding / 12
        : platformFeesOnCrowdfunding,
      platformFeesOnNonCrowdfunding: isMonthly
        ? platformFeesOnNonCrowdfunding / 12
        : platformFeesOnNonCrowdfunding,
      basePrice: 0,
      extraCollectivesAmount: isMonthly
        ? beforeExtraCollectivesAmount
        : beforeExtraCollectivesAmount * 12,
      extraCollectivesPerMonth: beforeExtraCollectivesCount,
      pricePerAdditionalCollective: beforeExtraCollectivesPrice,
      extraExpensesAmount: 0,
      extraExpensesPerMonth: 0,
    },
    after: {
      platformFeesOnCrowdfunding: isMonthly
        ? platformFeesOnCrowdfunding / 12
        : platformFeesOnCrowdfunding,
      platformFeesOnNonCrowdfunding: 0, // adjust for OSC
      basePrice: isMonthly ? afterBasePrice / 12 : afterBasePrice, // calculate according to tier
      // basePriceExplanation
      extraCollectivesAmount: isMonthly
        ? afterExtraCollectivesAmount
        : afterExtraCollectivesAmount * 12,
      extraCollectivesPerMonth: afterExtraCollectivesPerMonth,

      // extra collectives explanation
      extraExpensesAmount: isMonthly
        ? afterExtraExpensesAmount
        : afterExtraExpensesAmount * 12,
      // calculate according to tier
      // extra expenses explanation
      extraExpensesPerMonth: afterExtraExpensesPerMonth,
    },
  };
  return {
    before: {
      ...fees.before,
      totalHostPlans:
        fees.before.basePrice +
        fees.before.extraCollectivesAmount +
        fees.before.extraExpensesAmount,
      total:
        fees.before.platformFeesOnCrowdfunding +
        fees.before.platformFeesOnNonCrowdfunding +
        fees.before.basePrice +
        fees.before.extraCollectivesAmount +
        fees.before.extraExpensesAmount,
    },
    after: {
      ...fees.after,
      totalHostPlans:
        fees.after.basePrice +
        fees.after.extraCollectivesAmount +
        fees.after.extraExpensesAmount,
      total:
        fees.after.platformFeesOnCrowdfunding +
        fees.after.platformFeesOnNonCrowdfunding +
        fees.after.basePrice +
        fees.after.extraCollectivesAmount +
        fees.after.extraExpensesAmount,
    },
  };
}

export function formatAmount(cents: number, decimals = 0) {
  const dollars = cents / 100;
  if (dollars === 0) {
    return "$0";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(dollars);
}
