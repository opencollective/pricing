"use client";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { usePricingContext } from "@/app/providers/PricingProvider";
import { formatAmount } from "@/lib/helpers";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { PricingInterval } from "@/lib/types/Tier";

/**
 * Page component for the landing page that contains just the plan finder sliders
 * It uses the PricingContext to connect with the layout
 */
export function DefaultSummary() {
  const { expenses, collectives, selectedPlan } = usePricingContext();
  const [isOpen, setIsOpen] = useState(true);

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
    basePrice = basePrice * 11;
    extraExpensesAmount = extraExpensesAmount * 12;
    extraCollectivesAmount = extraCollectivesAmount * 12;
  }

  const total = basePrice + extraExpensesAmount + extraCollectivesAmount;
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full mb-4 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <h4 className="text-lg font-semibold">Summary</h4>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
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
            </TableBody>
          </Table>

          {/* Total - Make it prominent */}
          <div className="mt-2">
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Total Cost
              </div>
              <div className="flex items-baseline justify-center gap-x-2">
                <span className="text-2xl font-bold text-primary">
                  {formatAmount(total, 0)}
                </span>
                <span className="text-xl font-semibold text-primary">
                  {selectedPlan.interval === PricingInterval.MONTHLY
                    ? "/month"
                    : "/year"}
                </span>
              </div>
              {selectedPlan.interval === PricingInterval.YEARLY && (
                <div className="text-sm text-muted-foreground mt-2">
                  {formatAmount(total / 11, 0)}/month
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
