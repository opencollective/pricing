import { notFound } from "next/navigation";
import { fetchCollectiveBySlug } from "@/lib/data";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

import { calculateMetrics, formatAmount } from "@/lib/helpers";
import { FeeComparison } from "@/components/FeeComparison";
import FinancialOutcomeWrapper from "@/components/FinancialOutcomeWrapper";
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
    <div className="space-y-12">
      <div className="bg-muted/75 rounded-2xl p-6 pt-8">
        <h2 className="mb-2.5 text-sm uppercase tracking-wide font-medium text-muted-foreground">
          Collective Data
        </h2>
        <div className="">
          <div className="@container relative mx-auto max-w-7xl">
            <div className="mb-5 flex items-center gap-2">
              <img src={collective.image} className="size-6" />
              <h3 className="text-xl font-semibold tracking-tight">
                {collective.name}
              </h3>
            </div>

            <div className="grid gap-6 @md:grid-cols-2 @3xl:grid-cols-4 mb-10">
              {/* Total Raised Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Raised
                  </CardTitle>

                  <span className="text-sm text-muted-foreground">
                    Past 12 months
                  </span>
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
                  <span className="text-sm text-muted-foreground">
                    Past 12 months
                  </span>{" "}
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
                    Hosted Collectives
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics.totalCollectives}
                  </div>
                </CardContent>
              </Card>

              {/* Platform Tips Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Platform Tips
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    Past 12 months
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    {metrics.platformTips ? (
                      <>
                        <div className="text-2xl font-bold">
                          {formatAmount(metrics.totalPlatformTips)}
                        </div>
                        <Badge>Active</Badge>
                      </>
                    ) : (
                      <>
                        <div className="text-2xl font-bold">
                          {formatAmount(metrics.totalPlatformTips)}
                        </div>
                        <Badge variant="secondary">Disabled</Badge>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Comparison Table */}
            <FeeComparison collective={collective} />
          </div>
        </div>
      </div>
      <div className="bg-muted/75 rounded-2xl p-6 pt-8">
        <FinancialOutcomeWrapper />
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
  return [
    { slug: "oce" },
    ...collectives.map((collective) => ({
      slug: collective.slug,
    })),
  ];
}
