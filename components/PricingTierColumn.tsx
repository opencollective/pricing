"use client";

import React from "react";
import { NewTier, PricingInterval } from "../lib/types/Tier";
import { formatAmount } from "@/lib/helpers";
import { usePricingContext } from "@/app/providers/PricingProvider";
// import { CircleIcon } from "lucide-react";
import { RadioGroupItem } from "./ui/radio-group";
interface PricingTierColumnProps {
  tier: NewTier;
  interval: PricingInterval;
  isRecommended: boolean;
  isHovered?: boolean;
  onHover: (tierId: string | null) => void;
}

export function PricingTierColumn({
  tier,
  interval,
  isRecommended,
  isHovered = false,
  onHover,
}: PricingTierColumnProps) {
  // Format price as dollars with proper formatting
  const {
    title,
    pricingModel: {
      pricePerMonth,
      includedExpensesPerMonth,
      pricePerAdditionalExpense,
      includedCollectives,
      pricePerAdditionalCollective,
    },
    bgColor,
    fgColor,
  } = tier;
  const basePrice =
    interval === PricingInterval.MONTHLY ? pricePerMonth : pricePerMonth * 11;

  // Calculate total price based on usage if provided
  // const totalPrice = expenses || collectives ? calculateTotalPrice() : price;

  const { selectedPlan, showTotalPrice, expenses, collectives } =
    usePricingContext();

  function calculateTotalPrice() {
    // Calculate additional expenses cost
    const additionalExpenses = Math.max(0, expenses - includedExpensesPerMonth);
    const additionalExpensesCost =
      additionalExpenses * pricePerAdditionalExpense;

    // Calculate additional collectives cost
    const additionalCollectives = Math.max(
      0,
      collectives - includedCollectives
    );
    const additionalCollectivesCost =
      additionalCollectives * pricePerAdditionalCollective;

    // Calculate total monthly cost
    const monthlyCost =
      pricePerMonth + additionalExpensesCost + additionalCollectivesCost;

    // Return monthly or yearly based on selected interval
    return interval === PricingInterval.MONTHLY
      ? monthlyCost
      : monthlyCost * 11; // Apply the same yearly discount as the base price
  }

  const price = showTotalPrice ? calculateTotalPrice() : basePrice;

  // Create a ref for the radio input
  const radioRef = React.useRef<HTMLButtonElement>(null);

  // Function to handle clicking on the div
  const handleDivClick = () => {
    if (radioRef.current) {
      radioRef.current.click();
    }
  };

  return (
    <th className={`px-3 pt-4 min-w-[250px]`}>
      <div
        className={`relative w-full h-full px-5 pt-5 pb-4 rounded-2xl transition-colors ${
          bgColor ? `` : `${isHovered ? "bg-gray-50" : "bg-white"} border`
        } 
        } ${
          selectedPlan.tier?.title === title ? "ring-2 ring-ring" : ""
        } cursor-pointer`}
        onMouseEnter={() => onHover(title)}
        onMouseLeave={() => onHover(null)}
        onClick={handleDivClick}
        style={{
          ...(bgColor ? { backgroundColor: bgColor } : null),
          ...(fgColor
            ? { color: fgColor, "--ring": fgColor, "--primary": fgColor }
            : null),
        }}
      >
        {isRecommended && (
          <div className="absolute z-20 top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 transform">
            <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
              Recommended
            </span>
          </div>
        )}
        <div className={`text-left ${isRecommended ? "relative z-10" : ""}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-2xl font-semibold`}>{title}</h3>
            {/* <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" /> */}
            <RadioGroupItem className="bg-white" value={title} ref={radioRef} />
          </div>

          <div className="mt-2 flex items-baseline justify-start gap-x-1">
            <span className={`text-4xl font-bold tracking-tight`}>
              {formatAmount(price, 0)}
            </span>
            <span
              className={`text-sm font-semibold ${
                fgColor ? "" : "text-gray-600"
              }`}
            >
              {interval === PricingInterval.MONTHLY ? "/mo" : "/yr"}
            </span>
          </div>
          {!showTotalPrice && (
            <span className="text-muted-foreground text-sm font-normal">
              Base price
            </span>
          )}

          {/* <div
            className={`mt-1 font-normal text-sm  ${
              fgColor ? "" : "text-gray-500"
            }`}
          >
            Base price {formatAmount(price, 0)}
            <span className="text-xs">
              {interval === PricingInterval.MONTHLY ? "/mo" : "/yr"}
            </span>
          </div> */}
          {/* <div className="mt-6">
            <a
              href="#"
              className={`block rounded-md py-2.5 px-3.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                fgColor
                  ? ""
                  : isPopular
                  ? "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              }`}
              style={{
                ...(fgColor
                  ? { backgroundColor: fgColor, color: "white" }
                  : null),
              }}
            >
              Get started
            </a>
          </div> */}
        </div>
      </div>
    </th>
  );
}
