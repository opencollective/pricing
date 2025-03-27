"use client";

import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { formatAmount } from "@/lib/helpers";

interface FinancialOutcomeProps {
  projectedRevenue: number;
}

export function FinancialOutcome({ projectedRevenue }: FinancialOutcomeProps) {
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
              {formatAmount(projectedRevenue)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Platform tips</TableCell>
            <TableCell className="text-right">{formatAmount(0)}</TableCell>
          </TableRow>

          <TableRow className="border-t-2">
            <TableCell className="font-semibold text-base">Total</TableCell>
            <TableCell className="font-semibold text-right text-base">
              {formatAmount(projectedRevenue, 0)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
