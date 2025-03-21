import { Host } from "./data";
import { PricingInterval, SelectedPlan } from "./types/Tier";

export function calculateMetrics(collective: Host) {
  const hostFeesCrowdfundingUSD = Math.round(
    (collective.totalRaisedCrowdfundingUSD * collective.hostFeePercent) / 100
  );
  const hostFeesNonCrowdfundingUSD = Math.round(
    (collective.totalRaisedNonCrowdfundingUSD * collective.hostFeePercent) / 100
  );
  const totalHostFeesUSD = hostFeesCrowdfundingUSD + hostFeesNonCrowdfundingUSD;

  return {
    ...collective,
    hostFeesCrowdfundingUSD,
    hostFeesNonCrowdfundingUSD,
    totalHostFeesUSD,
  };
}

export function calculateFees({
  collective,
  selectedPlan,
}: {
  collective: Host;
  selectedPlan: SelectedPlan;
}) {
  const { platformTips, hostFeesCrowdfundingUSD, hostFeesNonCrowdfundingUSD } =
    calculateMetrics(collective);

  let afterBasePrice = selectedPlan.tier?.pricingModel.pricePerMonth || 0;
  if (selectedPlan.interval === PricingInterval.YEARLY) {
    afterBasePrice = afterBasePrice * 10;
  } else {
    afterBasePrice = afterBasePrice * 12;
  }

  if (!selectedPlan.tier) return null;

  const { includedExpensesPerMonth, includedCollectives } =
    selectedPlan.tier.pricingModel;

  // go through each month and see how many extra expenses there are beyond the includedExpensesPerMonth
  // same thing for includedCollectives, but don't use the monthly data, just use the total collectives and compare each months data

  const extraExpensesForFullYear =
    collective.monthlyExpenses?.reduce((total, month) => {
      // For each month, calculate how many expenses exceed the included amount
      const extraExpensesThisMonth = Math.max(
        0,
        month.count - includedExpensesPerMonth
      );
      return total + extraExpensesThisMonth;
    }, 0) || 0;

  // For collectives, just compare the total collectives with the included amount
  const extraCollectivesForFullYear = Math.max(
    0,
    (collective.totalCollectives - includedCollectives) * 12
  );

  const platformFeesOnCrowdfunding = platformTips
    ? 0
    : Math.round((hostFeesCrowdfundingUSD * 15) / 100);
  const platformFeesOnNonCrowdfunding = Math.round(
    (hostFeesNonCrowdfundingUSD * 15) / 100
  );

  const isMonthly = selectedPlan.interval === PricingInterval.MONTHLY;

  const beforeExtraCollectivesPrice = collective.id === 98478 ? 292 : 0; // adjustment for SCN

  const beforeExtraCollectivesCount =
    (collective.id === 98478 ? collective.totalCollectives : 0) * 12;
  const beforeExtraCollectivesAmount =
    beforeExtraCollectivesPrice * beforeExtraCollectivesCount;

  const fees = {
    before: {
      platformFeesOnCrowdfunding: isMonthly
        ? platformFeesOnCrowdfunding / 12
        : platformFeesOnCrowdfunding,
      platformFeesOnNonCrowdfunding: isMonthly
        ? platformFeesOnNonCrowdfunding / 12
        : platformFeesOnNonCrowdfunding,
      basePrice: 0,
      extraCollectives: isMonthly
        ? beforeExtraCollectivesAmount / 12
        : beforeExtraCollectivesAmount,
      extraCollectivesCount: isMonthly
        ? beforeExtraCollectivesCount / 12
        : beforeExtraCollectivesCount,
      pricePerAdditionalCollective: beforeExtraCollectivesPrice,
      extraExpenses: 0,
      extraExpensesCount: 0,
    },
    after: {
      platformFeesOnCrowdfunding: 0, // adjust for OSC
      platformFeesOnNonCrowdfunding: 0, // adjust for OSC
      basePrice: isMonthly ? afterBasePrice / 12 : afterBasePrice, // calculate according to tier
      // basePriceExplanation
      extraCollectives:
        extraCollectivesForFullYear *
        (selectedPlan.tier.pricingModel.pricePerAdditionalCollective || 0), // calculate according to tier
      // extra collectives explanation
      extraExpenses:
        extraExpensesForFullYear *
        (selectedPlan.tier.pricingModel.pricePerAdditionalExpense || 0), // calculate according to tier
      // extra expenses explanation
      extraCollectivesCount: extraCollectivesForFullYear,
      extraExpensesCount: extraExpensesForFullYear,
    },
  };
  return {
    before: {
      ...fees.before,
      total:
        fees.before.platformFeesOnCrowdfunding +
        fees.before.platformFeesOnNonCrowdfunding +
        fees.before.basePrice +
        fees.before.extraCollectives +
        fees.before.extraExpenses,
    },
    after: {
      ...fees.after,
      total:
        fees.after.platformFeesOnCrowdfunding +
        fees.after.platformFeesOnNonCrowdfunding +
        fees.after.basePrice +
        fees.after.extraCollectives +
        fees.after.extraExpenses,
    },
  };
}

export function formatAmount(cents: number, decimals = 0) {
  const dollars = cents / 100;
  if (dollars === 0) return "$0";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(dollars);
}
