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
        platformTips: number;
      };
      after: {
        fees: number;
        platformTips: number;
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
            <TableCell className="font-medium">Revenue from fees</TableCell>
            <TableCell className="text-right">
              {formatAmount(data.before.fees)}
            </TableCell>
            <TableCell className="text-right">
              {formatAmount(data.after.fees)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Platform tips</TableCell>
            <TableCell className="text-right">
              {formatAmount(data.before.platformTips)}
            </TableCell>
            <TableCell className="text-right">
              {formatAmount(data.after.platformTips)}
            </TableCell>
          </TableRow>

          <TableRow className="border-t-2">
            <TableCell className="font-semibold text-base">Total</TableCell>
            <TableCell className="font-semibold text-right text-base">
              {formatAmount(data.before.fees + data.before.platformTips, 0)}/yr
            </TableCell>
            <TableCell className="font-semibold text-right text-base">
              {formatAmount(data.after.fees + data.after.platformTips, 0)}/yr
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
