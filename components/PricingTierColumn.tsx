"use client";

import React from "react";
import { PricingInterval } from "../lib/types/Tier";

interface PricingTierColumnProps {
  title: string;
  interval: PricingInterval;
  pricePerMonth: number;
  includedExpensesPerMonth: number;
  pricePerAdditionalExpense: number;
  includedCollectives: number;
  pricePerAdditionalCollective: number;
  isPopular: boolean;
  isHovered?: boolean;
  onHover: (tierId: string | null) => void;
  useage?: {
    collectives: number;
    expenses: number;
  };
  label?: string;
  classNames?: string;
  buttonClassNames?: string;
  bgColor?: string;
}

export function PricingTierColumn({
  title,
  pricePerMonth,
  includedExpensesPerMonth,
  pricePerAdditionalExpense,
  includedCollectives,
  pricePerAdditionalCollective,
  interval,
  isPopular,
  isHovered = false,
  onHover,
  useage,
  label,
  classNames,
  buttonClassNames,
  bgColor,
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
    interval === PricingInterval.MONTHLY ? pricePerMonth : pricePerMonth * 10;

  // Calculate total price based on usage if provided
  const totalPrice = useage ? calculateTotalPrice() : price;

  function calculateTotalPrice() {
    // Calculate additional expenses cost
    const additionalExpenses = Math.max(
      0,
      useage!.expenses - includedExpensesPerMonth
    );
    const additionalExpensesCost =
      additionalExpenses * pricePerAdditionalExpense;

    // Calculate additional collectives cost
    const additionalCollectives = Math.max(
      0,
      useage!.collectives - includedCollectives
    );
    const additionalCollectivesCost =
      additionalCollectives * pricePerAdditionalCollective;

    // Calculate total monthly cost
    const monthlyCost =
      pricePerMonth + additionalExpensesCost + additionalCollectivesCost;

    // Return monthly or yearly based on selected interval
    return interval === PricingInterval.MONTHLY
      ? monthlyCost
      : monthlyCost * 10; // Apply the same yearly discount as the base price
  }

  // Styles for highlighting the recommended column

  return (
    <th className={`px-3 pt-4 min-w-[250px]`}>
      <div
        className={`relative w-full h-full px-3 pt-5 pb-3 rounded-2xl transition-colors ${
          classNames
            ? `${classNames}`
            : `${isHovered ? "bg-gray-50" : "bg-white"} border`
        } 
        } ${isPopular ? "ring-2 ring-blue-600" : ""}`}
        onMouseEnter={() => onHover(title)}
        onMouseLeave={() => onHover(null)}
        style={bgColor ? { backgroundColor: bgColor } : undefined}
      >
        {isPopular && (
          <div className="absolute z-20 top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 transform">
            <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
              Recommended
            </span>
          </div>
        )}
        <div className={`text-center ${isPopular ? "relative z-10" : ""}`}>
          <h3 className={`text-xl font-semibold`}>
            {title} {label}
          </h3>
          <div className="mt-2 flex items-baseline justify-center gap-x-1">
            <span className={`text-4xl font-bold tracking-tight`}>
              {formatPrice(totalPrice, 0)}
            </span>
            <span
              className={`text-sm font-semibold ${
                classNames ? "" : "text-gray-600"
              }`}
            >
              {interval === PricingInterval.MONTHLY ? "/mo" : "/yr"}
            </span>
          </div>

          <div
            className={`mt-1 font-normal text-sm  ${
              classNames ? "" : "text-gray-500"
            }`}
          >
            Base price {formatPrice(price, 0)}
            <span className="text-xs">
              {interval === PricingInterval.MONTHLY ? "/mo" : "/yr"}
            </span>
          </div>
          <div className="mt-6">
            <a
              href="#"
              className={`block rounded-md py-2.5 px-3.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                buttonClassNames
                  ? buttonClassNames
                  : isPopular
                  ? "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
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
