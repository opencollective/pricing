"use client";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { usePricingContext } from "@/app/providers/PricingProvider";
import { formatAmount } from "@/lib/helpers";
import { PricingInterval } from "@/lib/types/Tier";

/**
 * Page component for the landing page that contains just the plan finder sliders
 * It uses the PricingContext to connect with the layout
 */
export function DefaultSummary() {
  const { expenses, collectives, selectedPlan } = usePricingContext();
  if (!selectedPlan.tier) {
    return null;
  }
  const {
    includedExpensesPerMonth,
    includedCollectives,
    pricePerAdditionalCollective,
    pricePerAdditionalExpense,
    pricePerMonth,
  } = selectedPlan.tier.pricingModel;
  let basePrice = pricePerMonth;
  const extraExpensesPerMonth = Math.max(
    expenses - includedExpensesPerMonth,
    0
  );
  const extraCollectivesPerMonth = Math.max(
    collectives - includedCollectives,
    0
  );
  let extraExpensesAmount = extraExpensesPerMonth * pricePerAdditionalExpense;
  let extraCollectivesAmount =
    extraCollectivesPerMonth * pricePerAdditionalCollective;

  if (selectedPlan.interval === PricingInterval.YEARLY) {
    basePrice = basePrice * 10;
    extraExpensesAmount = extraExpensesAmount * 12;
    extraCollectivesAmount = extraCollectivesAmount * 12;
  }

  const total = basePrice + extraExpensesAmount + extraCollectivesAmount;
  return (
    <div>
      <h4 className="text-lg font-semibold mb-2 px-2">Summary</h4>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">
              Base Price
              <div className="text-xs text-muted-foreground mt-1">
                {selectedPlan.tier.title}
              </div>
            </TableCell>
            {}
            <TableCell className="text-right">
              {formatAmount(basePrice)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Extra Expenses</TableCell>
            <TableCell className="text-right">
              {formatAmount(extraExpensesAmount, 2)}
              {extraExpensesPerMonth > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  {extraExpensesPerMonth} x{" "}
                  {formatAmount(pricePerAdditionalExpense, 2)}{" "}
                  {selectedPlan.interval === PricingInterval.YEARLY && (
                    <>x 12</>
                  )}
                </div>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Extra Collectives</TableCell>
            <TableCell className="text-right">
              {formatAmount(extraCollectivesAmount)}
              {extraCollectivesPerMonth > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  {extraCollectivesPerMonth} x{" "}
                  {formatAmount(pricePerAdditionalCollective, 2)}{" "}
                  {selectedPlan.interval === PricingInterval.YEARLY && (
                    <>x 12</>
                  )}
                </div>
              )}
            </TableCell>
          </TableRow>
          <TableRow className="border-t-2">
            <TableCell className="font-semibold text-base">Total</TableCell>
            <TableCell className="font-semibold text-right text-base">
              {formatAmount(total, 0)}/
              {selectedPlan.interval === PricingInterval.MONTHLY ? "mo" : "yr"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
