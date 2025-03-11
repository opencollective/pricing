"use client";

import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Badge } from "./ui/badge";
import { ChevronDown } from "lucide-react";

type MonthCost = {
  month: string;
  collectives: number;
  additionalCollectivesCost: number;
  expenses: number;
  additionalExpensesCost: number;
  totalCost: number;
};

type TierData = {
  tier: {
    title: string;
    includedCollectives: number;
    includedExpensesPerMonth: number;
  };
  baseMonthlyPrice: number;
  yearlyTotalCost: number;
  avgMonthlyCost: number;
  monthlyCosts: MonthCost[];
};

type PricingTierCollapsibleProps = {
  tierData: TierData;
  isLowestCost: boolean;
  collective: {
    totalActiveCollectives: number;
    totalRaisedCrowdfundingUSD?: number;
  };
  initialOpen?: boolean;
};

export function PricingTierCollapsible({
  tierData,
  isLowestCost,
  collective,
  initialOpen,
}: PricingTierCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(initialOpen ?? isLowestCost);

  const tier = tierData.tier;

  // Convert from cents to dollars for display
  const formatPrice = (cents: number) => {
    // Ensure it's a valid number
    const validCents = isNaN(cents) ? 0 : cents;
    return (validCents / 100).toFixed(2);
  };

  // Function to format numbers with commas
  const formatNumber = (num: number) => {
    return isNaN(num) ? "0" : Math.round(num).toLocaleString();
  };

  return (
    <Collapsible
      key={tier.title}
      className="rounded-lg border border-gray-200 bg-gray-50"
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <div className="p-6">
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-semibold text-gray-900">
              {tier.title} Plan
            </h4>
            {isLowestCost && (
              <Badge variant="default" className="ml-2">
                Best Value
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">
                Yearly cost (with yearly billing)
              </div>
              <div className="text-lg font-medium">
                ${formatPrice(tierData.yearlyTotalCost)}
              </div>
            </div>
            <ChevronDown className="h-5 w-5 transition-transform ui-open:rotate-180" />
          </div>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        <div className="px-6 pb-6 space-y-4 border-t pt-4">
          {/* Plan details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-gray-700">Plan Includes:</h5>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li>
                  • Base price: ${formatPrice(tierData.baseMonthlyPrice)}/month
                </li>
                <li>• {tier.includedCollectives} collectives included</li>
                <li>
                  • {tier.includedExpensesPerMonth} expenses/month included
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-medium text-gray-700">Your Usage:</h5>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li>
                  • {collective.totalActiveCollectives} active collectives
                </li>
                <li>• Monthly expenses vary (see breakdown)</li>
                <li>
                  • $
                  {(
                    collective.totalRaisedCrowdfundingUSD || 0
                  ).toLocaleString()}{" "}
                  raised via crowdfunding
                </li>
              </ul>
            </div>
          </div>

          {/* Monthly expense breakdown */}
          {tierData.monthlyCosts.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-700">Monthly Breakdown:</h5>
              <div className="mt-2 pr-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-1 font-medium">Month</th>
                      <th className="text-right py-1 font-medium">
                        Collectives
                      </th>
                      <th className="text-right py-1 font-medium">
                        Add&apos;l Coll. Cost
                      </th>
                      <th className="text-right py-1 font-medium">Expenses</th>
                      <th className="text-right py-1 font-medium">
                        Add&apos;l Exp. Cost
                      </th>
                      <th className="text-right py-1 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tierData.monthlyCosts.map((month, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="py-1">{month.month}</td>
                        <td className="text-right py-1">
                          {formatNumber(month.collectives)}
                        </td>
                        <td className="text-right py-1">
                          ${formatPrice(month.additionalCollectivesCost)}
                        </td>
                        <td className="text-right py-1">
                          {formatNumber(month.expenses)}
                        </td>
                        <td className="text-right py-1">
                          ${formatPrice(month.additionalExpensesCost)}
                        </td>
                        <td className="text-right py-1 font-medium">
                          ${formatPrice(month.totalCost)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t border-gray-300">
                    <tr>
                      <td colSpan={5} className="text-right py-1 font-medium">
                        Monthly Average:
                      </td>
                      <td className="text-right py-1 font-medium">
                        ${formatPrice(tierData.avgMonthlyCost)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={5} className="text-right py-1 font-medium">
                        Total yearly cost:
                      </td>
                      <td className="text-right py-1 font-medium">
                        ${formatPrice(tierData.yearlyTotalCost)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
