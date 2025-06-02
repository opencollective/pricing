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

  return (
    <div>
      <h4 className="text-lg font-semibold mb-2 px-2">
        Business Model Outcome
      </h4>
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
            <TableCell className="font-medium">Platform Fees (Crowdfunding)</TableCell>
            <TableCell className="text-right">
               {formatAmount(data.before.platformFeesOnCrowdfunding)}
            </TableCell>
            <TableCell className="text-right">
              {formatAmount(data.after.platformFeesOnCrowdfunding)}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">Platform Fees (Non-Crowdfunding)</TableCell>
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
              {formatAmount( data.before.fees + data.before.platformTips, 0)}/yr
            </TableCell>
            <TableCell className="font-semibold text-right text-base">
              {formatAmount( data.after.fees + data.after.platformTips, 0)}/yr
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
