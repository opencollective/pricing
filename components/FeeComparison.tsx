"use client";
import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateFees, calculateMetrics, formatAmount } from "@/lib/helpers";
import { usePricingContext } from "@/app/providers/PricingProvider";
import { Host } from "@/lib/data";
import { PricingInterval } from "@/lib/types/Tier";

export function FeeComparison({ collective }: { collective: Host }) {
  const { setCollectives, setExpenses, setAutomatedPayouts, setTaxForms, selectedPlan } = usePricingContext();
  const fees = calculateFees({ collective, selectedPlan }); // add price calculation, based on selected plan
  const metrics = calculateMetrics(collective);
  useEffect(() => {
    // Set the values using properties directly from the Host type
    setCollectives(metrics.avgActiveCollectivesPerMonth);
    // Get the monthly expense number that is highest among the months

    setExpenses(metrics.avgExpensesPerMonth);

    setAutomatedPayouts(collective.automatedPayouts);
    setTaxForms(collective.taxForms);

  }, [metrics, setCollectives, setExpenses]);

  // calculate price
  if (!selectedPlan.tier) {
    return null;
  }
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      {fees && (
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {selectedPlan.interval === PricingInterval.MONTHLY
              ? "Monthly"
              : "Yearly"}{" "}
            fees comparison
          </h2>
          {/* <p className="text-sm text-muted-foreground mb-6">
            Before and after switching to new pricing model
          </p> */}

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
                      {fees.before.platformFeesOnCrowdfunding === 0
                        ? "Crowdfunding"
                        : "5% of total raised in crowdfunding"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatAmount(fees.before.platformFeesOnCrowdfunding)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatAmount(fees.after.platformFeesOnCrowdfunding)}
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
                    {formatAmount(fees.before.platformFeesOnNonCrowdfunding)}
                    <div className="text-xs text-muted-foreground mt-1">
                      15% of host fees
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatAmount(fees.after.platformFeesOnNonCrowdfunding)}
                    <div className="text-xs text-muted-foreground mt-1">
                      0% of host fees
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Base Price
                    {selectedPlan.tier && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {selectedPlan.tier.title}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatAmount(fees.before.basePrice)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatAmount(fees.after.basePrice)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Extra Collectives
                  </TableCell>
                  <TableCell className="text-right">
                    {formatAmount(fees.before.extraCollectivesAmount)}
                    {fees.before.extraCollectivesPerMonth > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {fees.before.extraCollectivesPerMonth} x{" "}
                        {formatAmount(
                          fees.before.pricePerAdditionalCollective,
                          2
                        )}
                        {selectedPlan.interval === PricingInterval.YEARLY &&
                          " x 12"}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatAmount(fees.after.extraCollectivesAmount)}
                    {fees.after.extraCollectivesPerMonth > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {fees.after.extraCollectivesPerMonth} x{" "}
                        {formatAmount(
                          selectedPlan.tier.pricingModel
                            .pricePerAdditionalCollective,
                          2
                        )}
                        {selectedPlan.interval === PricingInterval.YEARLY &&
                          " x 12"}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Extra Expenses</TableCell>
                  <TableCell className="text-right">
                    {formatAmount(fees.before.extraExpensesAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatAmount(fees.after.extraExpensesAmount)}
                    {fees.after.extraExpensesPerMonth > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {fees.after.extraExpensesPerMonth} x{" "}
                        {formatAmount(
                          selectedPlan.tier.pricingModel
                            .pricePerAdditionalExpense,
                          2
                        )}
                        {selectedPlan.interval === PricingInterval.YEARLY &&
                          " x 12"}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow className="border-t-2">
                  <TableCell className="font-semibold text-base">
                    Total
                  </TableCell>
                  <TableCell className="font-semibold text-right text-base">
                    {formatAmount(fees.before.total)}
                  </TableCell>
                  <TableCell className="font-semibold text-right text-base">
                    {formatAmount(fees.after.total)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
