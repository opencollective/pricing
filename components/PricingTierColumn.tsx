"use client";

import React from "react";
import { PricingInterval, Tier } from "../lib/types/Tier";

interface PricingTierColumnProps {
  tier: Tier;
  interval: PricingInterval;
  isPopular: boolean;
  isHovered?: boolean;
  onHover: (tierId: string | null) => void;
  useage?: {
    collectives: number;
    expenses: number;
  };
}

export function PricingTierColumn({
  tier,
  interval,
  isPopular,
  isHovered = false,
  onHover,
  useage,
}: PricingTierColumnProps) {
  // Format price as dollars with proper formatting
  const formatPrice = (cents: number, decimals = 0) => {
    const dollars = cents / 100;
    if (dollars === 0) return "$0";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(dollars);
  };

  const price =
    interval === PricingInterval.MONTHLY
      ? tier.pricePerMonth
      : tier.pricePerMonth * 10;

  // Calculate total price based on usage if provided
  const totalPrice = useage ? calculateTotalPrice() : price;

  function calculateTotalPrice() {
    // Calculate additional expenses cost
    const additionalExpenses = Math.max(
      0,
      useage!.expenses - tier.includedExpensesPerMonth
    );
    const additionalExpensesCost =
      additionalExpenses * tier.pricePerAdditionalExpense;

    // Calculate additional collectives cost
    const additionalCollectives = Math.max(
      0,
      useage!.collectives - tier.includedCollectives
    );
    const additionalCollectivesCost =
      additionalCollectives * tier.pricePerAdditionalCollective;

    // Calculate total monthly cost
    const monthlyCost =
      tier.pricePerMonth + additionalExpensesCost + additionalCollectivesCost;

    // Return monthly or yearly based on selected interval
    return interval === PricingInterval.MONTHLY
      ? monthlyCost
      : monthlyCost * 10; // Apply the same yearly discount as the base price
  }

  // Styles for highlighting the recommended column
  const headingColor = isPopular ? "text-indigo-700" : "text-gray-900";

  return (
    <th className={`px-3 pt-4 min-w-[250px]`}>
      <div
        className={`relative w-full h-full px-3 pt-5 pb-3 border rounded-xl transition-colors ${
          isHovered ? "bg-gray-50" : "bg-white"
        } ${isPopular ? "ring-2 ring-indigo-600" : ""}`}
        onMouseEnter={() => onHover(tier.title)}
        onMouseLeave={() => onHover(null)}
      >
        {isPopular && (
          <div className="absolute z-20 top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 transform">
            <span className="inline-flex items-center rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
              Recommended
            </span>
          </div>
        )}
        <div className={`text-center ${isPopular ? "relative z-10" : ""}`}>
          <h3 className={`text-xl font-semibold ${headingColor}`}>
            {tier.title}
          </h3>
          <div className="mt-2 flex items-baseline justify-center gap-x-1">
            <span
              className={`text-4xl font-bold tracking-tight ${headingColor}`}
            >
              {formatPrice(totalPrice, 0)}
            </span>
            <span className="text-sm font-semibold text-gray-600">
              {interval === PricingInterval.MONTHLY ? "/mo" : "/yr"}
            </span>
          </div>

          <div className="mt-1 font-normal text-sm text-gray-500">
            Base price {formatPrice(price, 0)}
            <span className="text-xs">
              {interval === PricingInterval.MONTHLY ? "/mo" : "/yr"}
            </span>
          </div>

          <div className="mt-6">
            <a
              href="#"
              className={`block rounded-md py-2.5 px-3.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                isPopular
                  ? "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600"
                  : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
              }`}
            >
              Get started
            </a>
          </div>
        </div>
      </div>
    </th>
  );
}
