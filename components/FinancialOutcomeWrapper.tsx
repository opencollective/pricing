"use server";

import { aggregateEurope, fetchData } from "@/lib/data";
import { FinancialOutcome } from "./FinancialOutcome";
import { newTiers } from "@/lib/tiers";
import { calculateFees, calculateMetrics } from "@/lib/helpers";
import { calculateBestTier } from "@/lib/pricing";
import { PricingInterval, TierSet } from "@/lib/types/Tier";

async function calculateProjectedRevenue(tierSet: TierSet) {
  const collectives = await fetchData();
  let totalFees = 0;
  let totalPlatformTips = 0;
  let totalFeesBefore = 0;
  const tiers = newTiers.filter((tier) => tier.set === tierSet);

  for (let collective of collectives) {
    // Special case for OCE, to only use the aggregate of all their 3 accounts in the calculation
    if (collective.slug === "europe") {
      collective = aggregateEurope(collectives);
    } else if (
      ["oce-foundation-usd", "oce-foundation-eur"].includes(collective.slug)
    ) {
      continue;
    }

    const metrics = calculateMetrics(collective);

    const recommendedDefaultTier = calculateBestTier({
      tiers: tiers,
      usage: {
        expenses: metrics.avgExpensesPerMonth,
        collectives: metrics.avgActiveCollectivesPerMonth,
      },
    });
    const fees = calculateFees({
      collective,
      selectedPlan: {
        tier: recommendedDefaultTier.tier,
        interval: PricingInterval.MONTHLY,
      },
    });

    if (fees) {
      // will always be true since we're providing plan above
      totalFeesBefore += fees.before.total * 12; // since we're using monthly pricing
      totalFees += fees.after.total * 12;
    }
    totalPlatformTips += metrics.totalPlatformTips;
  }
  return {
    before: {
      fees: totalFeesBefore,
      platformTips: totalPlatformTips,
    },
    after: {
      fees: totalFees,
      platformTips: totalPlatformTips,
    },
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
