"use client";

import { usePricingContext } from "@/app/providers/PricingProvider";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { formatAmount } from "@/lib/helpers";
import { TierSet } from "@/lib/types/Tier";

export function FinancialOutcome({
  projectedRevenue,
}: {
  projectedRevenue: Record<
    TierSet,
    {
      fees: number;
      platformTips: number;
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
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">
              Projected revenue from fees
            </TableCell>
            <TableCell className="text-right">
              {formatAmount(data.fees)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Platform tips</TableCell>
            <TableCell className="text-right">
              {formatAmount(data.platformTips)}
            </TableCell>
          </TableRow>

          <TableRow className="border-t-2">
            <TableCell className="font-semibold text-base">Total</TableCell>
            <TableCell className="font-semibold text-right text-base">
              {formatAmount(data.fees + data.platformTips, 0)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
