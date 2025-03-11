import { notFound } from "next/navigation";
import { fetchCollectiveBySlug } from "@/lib/data";
import { CollectiveChart } from "@/components/ui/collective-chart";
import { tiers } from "@/lib/tiers";
import { PricingTierCollapsible } from "@/components/PricingTierCollapsible";

type Props = {
  params: {
    slug: string;
  };
};

// This page can be statically generated at build time if you provide a list of slugs
// via the generateStaticParams function, or it can be dynamically generated
export default async function CollectivePage({ params }: Props) {
  const { slug } = params;

  // Fetch data for this specific collective
  const collective = await fetchCollectiveBySlug(slug);

  // Return not found for invalid slugs
  if (!collective) return notFound();

  return (
    <div className="py-24 sm:py-32 bg-muted">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header section */}
        <div className="mx-auto max-w-4xl text-center mb-12">
          <h1 className="text-base font-semibold leading-7 text-indigo-600">
            Collective Details
          </h1>
          <p className="mt-2 text-4xl font-bold text-balance tracking-tight text-gray-900 sm:text-5xl">
            {collective.name}
          </p>
          <p className="mt-6 text-balance text-lg leading-8 text-gray-600">
            This page shows specific pricing details for the {collective.name}{" "}
            collective.
          </p>
        </div>

        {/* Stats cards */}
        <div className="mx-auto max-w-4xl mb-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-6 shadow-sm bg-white">
              <h3 className="text-lg font-semibold text-gray-900">Type</h3>
              <p className="mt-2 text-gray-600">{collective.type}</p>
            </div>

            <div className="rounded-lg border border-gray-200 p-6 shadow-sm bg-white">
              <h3 className="text-lg font-semibold text-gray-900">
                Total Raised
              </h3>
              <p className="mt-2 text-gray-600">
                ${collective.totalRaisedUSD.toLocaleString()}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-6 shadow-sm bg-white">
              <h3 className="text-lg font-semibold text-gray-900">
                Platform Tips
              </h3>
              <p className="mt-2 text-gray-600">
                ${collective.totalPlatformTips.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Yearly Plan Pricing Calculation based on this collective */}
        <div className="mx-auto max-w-5xl mb-12">
          <div className="rounded-lg border border-gray-200 p-6 shadow-sm bg-white">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Yearly Pricing Calculator for {collective.name}
            </h3>
            <p className="text-gray-600 mb-6">
              Based on {collective.totalActiveCollectives} active collectives
              and monthly expenses from this collective&apos;s data.
            </p>

            <div className="space-y-8">
              {(() => {
                // First, calculate costs for all tiers to find the lowest cost one
                const tierCosts = tiers.map((tier) => {
                  // Calculate each month's costs separately
                  const monthlyData = collective.monthlyExpenses || [];
                  const monthlyCollectivesData =
                    collective.monthlyActiveCollectives || [];

                  // Create a map of month to active collectives count
                  const monthToCollectivesMap = new Map();
                  monthlyCollectivesData.forEach((item) => {
                    monthToCollectivesMap.set(item.month, item.count || 0);
                  });

                  // Store monthly costs for each month
                  const monthlyCosts = monthlyData.map((month) => {
                    // Calculate additional expenses for this specific month
                    const monthExpenses = month.count || 0;
                    const additionalMonthExpenses = Math.max(
                      0,
                      monthExpenses - tier.includedExpensesPerMonth
                    );
                    const additionalMonthExpensesCost =
                      additionalMonthExpenses * tier.pricePerAdditionalExpense;

                    // Get collectives count for this month
                    const monthCollectives =
                      monthToCollectivesMap.get(month.month) || 0;
                    const additionalMonthCollectives = Math.max(
                      0,
                      monthCollectives - tier.includedCollectives
                    );
                    const additionalMonthCollectivesCost =
                      additionalMonthCollectives *
                      tier.pricePerAdditionalCollective;

                    // Calculate total cost for this month
                    const monthTotalCost =
                      tier.pricePerMonth +
                      additionalMonthExpensesCost +
                      additionalMonthCollectivesCost;

                    // Base cost + additional expenses for this month
                    return {
                      month: month.month,
                      expenses: monthExpenses,
                      additionalExpensesCost: additionalMonthExpensesCost,
                      collectives: monthCollectives,
                      additionalCollectives: additionalMonthCollectives,
                      additionalCollectivesCost: additionalMonthCollectivesCost,
                      totalCost: monthTotalCost,
                    };
                  });

                  // Calculate base monthly price
                  const baseMonthlyPrice = tier.pricePerMonth || 0;

                  // Calculate crowdfunding fee if applicable
                  const crowdfundingAmount =
                    collective.totalRaisedCrowdfundingUSD || 0;
                  const crowdfundingFee =
                    crowdfundingAmount * 100 * tier.crowdfundingFee;

                  // Calculate total yearly cost based on monthly data
                  let yearlyTotalCost = 0;

                  if (monthlyCosts.length > 0) {
                    // Sum all monthly costs
                    const monthlyCostsSum = monthlyCosts.reduce(
                      (sum, month) => sum + month.totalCost,
                      0
                    );

                    // If we have data for less than 12 months, extrapolate
                    if (monthlyCosts.length < 12) {
                      const averageMonthCost =
                        monthlyCostsSum / monthlyCosts.length;
                      yearlyTotalCost = averageMonthCost * 12 + crowdfundingFee;
                    } else {
                      yearlyTotalCost = monthlyCostsSum + crowdfundingFee;
                    }
                  } else {
                    // Fallback if no monthly data available
                    const totalCollectives =
                      collective.totalActiveCollectives || 0;
                    const additionalCollectives = Math.max(
                      0,
                      totalCollectives - tier.includedCollectives
                    );
                    const additionalCollectivesCost =
                      additionalCollectives * tier.pricePerAdditionalCollective;

                    yearlyTotalCost =
                      (baseMonthlyPrice * (10 / 12) +
                        additionalCollectivesCost) *
                        12 +
                      crowdfundingFee;
                  }

                  // Calculate yearly price with 20% discount (10 months for 12)

                  return {
                    tier,
                    monthlyCosts,
                    baseMonthlyPrice,
                    crowdfundingFee,
                    yearlyTotalCost,
                    avgMonthlyCost: yearlyTotalCost / 12,
                  };
                });

                // Sort tiers by yearly discounted price to find the cheapest option
                tierCosts.sort((a, b) => a.yearlyTotalCost - b.yearlyTotalCost);

                // Lowest cost tier is the first one after sorting
                const lowestCostTier = tierCosts[0].tier.title;

                // Return the rendered tiers
                return tierCosts.map((tierData) => {
                  const tier = tierData.tier;
                  const isLowestCost = tier.title === lowestCostTier;

                  return (
                    <PricingTierCollapsible
                      key={tier.title}
                      tierData={tierData}
                      isLowestCost={isLowestCost}
                      collective={collective}
                    />
                  );
                });
              })()}
            </div>
          </div>
        </div>

        {/* Chart section - Full width */}
        <div className="mx-auto max-w-5xl">
          <CollectiveChart
            collective={collective}
            title="Monthly Activity History"
            description="Number of active collectives and expenses over time"
          />
        </div>
      </div>
    </div>
  );
}

// Generate static pages for valid collectives at build time
export async function generateStaticParams() {
  // Import the fetchData function directly within this function
  // to avoid circular dependencies
  const { fetchData } = await import("@/lib/data");

  // Fetch a list of all collectives
  const collectives = await fetchData();

  // Return an array of slug objects for each collective
  return collectives.map((collective) => ({
    slug: collective.slug,
  }));
}
