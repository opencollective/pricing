"use server";

import { fetchData } from "@/lib/data";
import { FinancialOutcome } from "./FinancialOutcome";
import { newTiers } from "@/lib/tiers";
import { calculateMetrics } from "@/lib/helpers";
import { calculateBestTier } from "@/lib/pricing";
import { TierSet } from "@/lib/types/Tier";

async function calculateProjectedRevenue(tierSet: TierSet) {
  const collectives = await fetchData();
  let totalFees = 0;
  let totalPlatformTips = 0;

  const tiers = newTiers.filter((tier) => tier.set === tierSet);

  for (const collective of collectives) {
    const metrics = calculateMetrics(collective);

    const recommendedDefaultTier = calculateBestTier({
      tiers: tiers,
      usage: {
        expenses: metrics.avgExpensesPerMonth,
        collectives: metrics.totalCollectives,
      },
    });

    totalPlatformTips += metrics.totalPlatformTips;
    totalFees += recommendedDefaultTier.yearlyCost;
  }
  return {
    fees: totalFees,
    platformTips: totalPlatformTips,
  };
}

export default async function FinancialOutcomeWrapper() {
  const projectedRevenueDefault = await calculateProjectedRevenue("default");
  const projectedRevenueAltModel = await calculateProjectedRevenue("alt-model");

  return (
    <FinancialOutcome
      projectedRevenue={{
        "alt-model": projectedRevenueAltModel,
        default: projectedRevenueDefault,
      }}
    />
  );
}
