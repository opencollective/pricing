import { notFound } from "next/navigation";
import { fetchCollectiveBySlug } from "@/lib/data";
import { CollectiveChart } from "@/components/ui/collective-chart";
import { defaultTiers } from "@/lib/tiers";
import { PricingTierCollapsible } from "@/components/PricingTierCollapsible";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, DollarSign, Users, Zap } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateMetrics, formatAmount } from "@/lib/helpers";
// This page can be statically generated at build time if you provide a list of slugs
// via the generateStaticParams function, or it can be dynamically generated

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CollectivePage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch data for this specific collective
  const collective = await fetchCollectiveBySlug(slug);

  // Return not found for invalid slugs
  if (!collective) return notFound();

  const metrics = calculateMetrics(collective);

  return (
    <div className="">
      <div className="@container relative mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {collective.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            Financial overview and platform comparison
          </p>
        </header>

        <div className="grid gap-6 @md:grid-cols-2 @2xl:grid-cols-4 mb-10">
          {/* Total Raised Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Raised
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatAmount(metrics.totalRaisedUSD)}
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-full flex justify-between">
                    <span>Crowdfunding</span>
                    <span className="font-medium text-foreground">
                      {formatAmount(metrics.totalRaisedCrowdfundingUSD)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-full flex justify-between">
                    <span>Non-crowdfunding</span>
                    <span className="font-medium text-foreground">
                      {formatAmount(metrics.totalRaisedNonCrowdfundingUSD)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Host Fees Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Host Fees
              </CardTitle>
              <ArrowUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatAmount(metrics.totalHostFeesUSD)}
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-full flex justify-between">
                    <span>Crowdfunding</span>
                    <span className="font-medium text-foreground">
                      {formatAmount(metrics.hostFeesCrowdfundingUSD)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-full flex justify-between">
                    <span>Non-crowdfunding</span>
                    <span className="font-medium text-foreground">
                      {formatAmount(metrics.hostFeesNonCrowdfundingUSD)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Collectives Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Collectives
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.totalCollectives}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Active fundraising collectives on the platform
              </p>
            </CardContent>
          </Card>

          {/* Platform Tips Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Platform Tips
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">On</div>
                <Badge className="bg-green-500 hover:bg-green-600">
                  Active
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Optional contributions from donors
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Table */}
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Fee Comparison</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Before and after switching to Gift Collective platform
            </p>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Fee Structure</TableHead>
                    <TableHead className="text-right">Before</TableHead>
                    <TableHead className="text-right">After</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Platform fees
                      <div className="text-xs text-muted-foreground mt-1">
                        Crowdfunding
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatAmount(
                        metrics.fees.before.platformFeesOnCrowdfunding
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatAmount(
                        metrics.fees.after.platformFeesOnCrowdfunding
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Platform fees
                      <div className="text-xs text-muted-foreground mt-1">
                        Non-crowdfunding
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatAmount(
                        metrics.fees.before.platformFeesOnNonCrowdfunding
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        15% of host fees
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatAmount(
                        metrics.fees.after.platformFeesOnNonCrowdfunding
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        0% of host fees
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Base Price</TableCell>
                    <TableCell className="text-right">
                      {formatAmount(metrics.fees.before.basePrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatAmount(metrics.fees.after.basePrice)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Extra Collectives
                    </TableCell>
                    <TableCell className="text-right">
                      {formatAmount(metrics.fees.before.extraCollectives)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatAmount(metrics.fees.after.extraCollectives)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Extra Expenses
                    </TableCell>
                    <TableCell className="text-right">
                      {formatAmount(metrics.fees.before.extraExpenses)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatAmount(metrics.fees.after.extraExpenses)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-t-2">
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="font-bold text-right">
                      {formatAmount(metrics.fees.before.total)}
                    </TableCell>
                    <TableCell className="font-bold text-right">
                      {formatAmount(metrics.fees.after.total)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        {/* Stats cards */}
        {/* <div className="mx-auto max-w-4xl mb-12">
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
                ${(collective.totalRaisedUSD / 100).toLocaleString()}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-6 shadow-sm bg-white">
              <h3 className="text-lg font-semibold text-gray-900">
                Platform Tips
              </h3>
              <p className="mt-2 text-gray-600">
                ${(collective.totalPlatformTips / 100).toLocaleString()}
              </p>
            </div>
          </div>
        </div> */}

        {/* Yearly Plan Pricing Calculation based on this collective */}
        {/* <div className="mx-auto max-w-5xl mb-12">
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
                const tierCosts = defaultTiers.map((tier) => {
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
        </div> */}

        {/* Chart section - Full width */}
        {/* <div className="mx-auto max-w-5xl">
          <CollectiveChart
            collective={collective}
            title="Monthly Activity History"
            description="Number of active collectives and expenses over time"
          />
        </div> */}
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
