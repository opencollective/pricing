"use client";

import { usePricingContext } from "@/app/providers/PricingProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { formatAmount } from "@/lib/helpers";
import { TierSet } from "@/lib/types/Tier";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function FinancialOutcome({
  projectedRevenue,
}: {
  projectedRevenue: Record<
    TierSet,
    {
      before: {
        fees: number;
        platformFeesOnCrowdfunding: number;
        platformFeesOnNonCrowdfunding: number;
        platformTips: number;
        hostPlans: number;
      };
      after: {
        fees: number;
        platformFeesOnCrowdfunding: number;
        platformFeesOnNonCrowdfunding: number;
        platformTips: number;
        hostPlans: number;
      };
    }
  >;
}) {
  const { tierSet } = usePricingContext();
  const data = projectedRevenue[tierSet];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full mb-4 px-2 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <h4 className="text-lg font-semibold">Business Model Outcome</h4>
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
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Fee Structure</TableHead>
                <TableHead className="text-right">Before</TableHead>
                <TableHead className="text-right">After</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Platform Tips</TableCell>
                <TableCell className="text-right">
                  {formatAmount(data.before.platformTips)}
                </TableCell>
                <TableCell className="text-right">
                  {formatAmount(data.after.platformTips)}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">
                  Platform Fees (Crowdfunding)
                </TableCell>
                <TableCell className="text-right">
                  {formatAmount(data.before.platformFeesOnCrowdfunding)}
                </TableCell>
                <TableCell className="text-right">
                  {formatAmount(data.after.platformFeesOnCrowdfunding)}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">
                  Platform Fees (Non-Crowdfunding)
                </TableCell>
                <TableCell className="text-right">
                  {formatAmount(data.before.platformFeesOnNonCrowdfunding)}
                </TableCell>
                <TableCell className="text-right">
                  {formatAmount(data.after.platformFeesOnNonCrowdfunding)}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">Host Plans</TableCell>
                <TableCell className="text-right">
                  {formatAmount(data.before.hostPlans)}
                </TableCell>
                <TableCell className="text-right">
                  {formatAmount(data.after.hostPlans)}
                </TableCell>
              </TableRow>

              <TableRow className="border-t-2">
                <TableCell className="font-semibold text-base">Total</TableCell>
                <TableCell className="font-semibold text-right text-base">
                  {formatAmount(data.before.fees + data.before.platformTips, 0)}
                  /yr
                </TableCell>
                <TableCell className="font-semibold text-right text-base">
                  {formatAmount(data.after.fees + data.after.platformTips, 0)}
                  /yr
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </motion.div>
      )}
    </div>
  );
}
