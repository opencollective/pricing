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

  let totalPlatformFeesOnCrowdfundingBefore = 0;
  let totalPlatformFeesOnNonCrowdfundingBefore = 0;
  let totalPlatformFeesOnCrowdfunding = 0;
  const totalPlatformFeesOnNonCrowdfunding = 0;
  let totalHostPlansBefore = 0;
  let totalHostPlans = 0;

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
        automatedPayouts: collective.automatedPayouts,
        taxForms: collective.taxForms
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
      // breakdown
      totalPlatformFeesOnCrowdfundingBefore += fees.before.platformFeesOnCrowdfunding * 12;
      totalPlatformFeesOnNonCrowdfundingBefore += fees.before.platformFeesOnNonCrowdfunding * 12;
      totalPlatformFeesOnCrowdfunding += fees.after.platformFeesOnCrowdfunding * 12;
      totalHostPlansBefore += fees.before.totalHostPlans * 12;
      totalHostPlans += fees.after.totalHostPlans * 12;
    }
    totalPlatformTips += metrics.totalPlatformTips;
  }
  return {
    before: {
      platformFeesOnCrowdfunding: totalPlatformFeesOnCrowdfundingBefore,
      platformFeesOnNonCrowdfunding: totalPlatformFeesOnNonCrowdfundingBefore,
      fees: totalFeesBefore,
      platformTips: totalPlatformTips,
      hostPlans: totalHostPlansBefore,
    },
    after: {
      platformFeesOnCrowdfunding: totalPlatformFeesOnCrowdfunding,
      platformFeesOnNonCrowdfunding: totalPlatformFeesOnNonCrowdfunding,
      fees: totalFees,
      platformTips: totalPlatformTips,
      hostPlans: totalHostPlans,
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
