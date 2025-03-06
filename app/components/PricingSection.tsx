"use client";

import React, { useState } from "react";
import { tiers } from "../lib/tiers";
import { PricingInterval, TierType } from "../lib/types/Tier";
import { PricingTierColumn } from "./PricingTierColumn";
import { PricingFeatureCell } from "./PricingFeatureCell";
import Link from "next/link";
import { Check } from "lucide-react";

export function PricingSection() {
  const [interval, setInterval] = useState<PricingInterval>(
    PricingInterval.MONTHLY
  );
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  // Get the visible tiers
  const visibleTiers = tiers.filter((t) => t.type !== TierType.PRO);

  // Format percentage
  // const formatPercentage = (decimal: number) => {
  //   return `${(decimal * 100).toFixed(0)}%`;
  // };

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-base font-semibold leading-7 text-indigo-600">
            Pricing Simulator
          </h1>
          <p className="mt-2 text-4xl font-bold text-balance tracking-tight text-gray-900 sm:text-5xl">
            Help Us Shape Our New Pricing Model
          </p>
          <p className="mt-6 text-balance text-lg leading-8 text-gray-600">
            We&apos;re exploring a new business model to ensure long-term
            sustainability. Your feedback on these potential pricing options is
            invaluable as we work together to create a fair and transparent
            funding approach.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="relative flex items-center rounded-full p-1 bg-gray-100">
            <button
              type="button"
              className={`${
                interval === PricingInterval.MONTHLY
                  ? "bg-white shadow-md"
                  : "text-gray-500"
              } relative rounded-full py-2 px-6 text-sm font-medium whitespace-nowrap focus:outline-none transition-all duration-200 ease-in-out`}
              onClick={() => setInterval(PricingInterval.MONTHLY)}
            >
              Monthly billing
            </button>
            <button
              type="button"
              className={`${
                interval === PricingInterval.YEARLY
                  ? "bg-white shadow-md"
                  : "text-gray-500"
              } relative rounded-full py-2 px-6 text-sm font-medium whitespace-nowrap focus:outline-none transition-all duration-200 ease-in-out`}
              onClick={() => setInterval(PricingInterval.YEARLY)}
            >
              Yearly billing{" "}
              <span className="text-indigo-600 font-medium ml-2">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-6xl sm:mt-20">
          {/* Pricing Comparison Table */}
          <div className="overflow-x-auto rounded-xl ">
            <table className="w-full border-collapse pt-2">
              {/* Table Header */}
              <thead>
                <tr className="pt-2">
                  {/* Empty first cell */}
                  <th className="px-6 pt-6 pb-8"></th>

                  {/* Tier Headers using PricingTierColumn component */}
                  {visibleTiers.map((tier, index) => (
                    <PricingTierColumn
                      key={tier.title}
                      tier={tier}
                      interval={interval}
                      isPopular={index === 1}
                      isHovered={hoveredTier === tier.title}
                      onHover={setHoveredTier}
                    />
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-200">
                {/* Section Header */}
                <tr>
                  <td
                    colSpan={visibleTiers.length + 1}
                    className="px-6 pb-4 pt-2  text-sm "
                  >
                    Overview
                  </td>
                </tr>
                {/* All features */}
                <tr>
                  <th
                    scope="row"
                    className="px-6 py-4 text-sm font-medium text-gray-900 text-left"
                  >
                    All features
                  </th>
                  {visibleTiers.map((tier, index) => (
                    <PricingFeatureCell
                      key={`${tier.title}-collectives`}
                      value={
                        <div className="rounded-full flex justify-center items-center size-3.5 bg-primary text-white justify-self-center">
                          <Check strokeWidth={3} size={10} />
                        </div>
                      }
                      isPopular={index === 1}
                      isHovered={hoveredTier === tier.title}
                      onHover={setHoveredTier}
                      tier={tier}
                    />
                  ))}
                </tr>
                {/* Included Collectives */}
                <tr>
                  <th
                    scope="row"
                    className="px-6 py-4 text-sm font-medium text-gray-900 text-left"
                  >
                    Included Collectives
                  </th>
                  {visibleTiers.map((tier, index) => (
                    <PricingFeatureCell
                      key={`${tier.title}-collectives`}
                      value={tier.includedCollectives}
                      isPopular={index === 1}
                      isHovered={hoveredTier === tier.title}
                      onHover={setHoveredTier}
                      tier={tier}
                    />
                  ))}
                </tr>

                {/* Price per Additional Collective */}
                <tr>
                  <th
                    scope="row"
                    className="px-6 py-4 text-sm font-medium text-gray-900 text-left"
                  >
                    Additional collective
                  </th>
                  {visibleTiers.map((tier, index) => (
                    <PricingFeatureCell
                      key={`${tier.title}-extra-collective`}
                      value={`$${(
                        tier.pricePerAdditionalCollective / 100
                      ).toFixed(2)}`}
                      isPopular={index === 1}
                      isHovered={hoveredTier === tier.title}
                      onHover={setHoveredTier}
                      tier={tier}
                    />
                  ))}
                </tr>

                {/* Included Expenses */}
                <tr>
                  <th
                    scope="row"
                    className="px-6 py-4 text-sm font-medium text-gray-900 text-left"
                  >
                    Monthly expenses
                  </th>
                  {visibleTiers.map((tier, index) => (
                    <PricingFeatureCell
                      key={`${tier.title}-expenses`}
                      value={tier.includedExpensesPerMonth}
                      isPopular={index === 1}
                      isHovered={hoveredTier === tier.title}
                      onHover={setHoveredTier}
                      tier={tier}
                    />
                  ))}
                </tr>

                {/* Price per Additional Expense */}
                <tr>
                  <th
                    scope="row"
                    className="px-6 py-4 text-sm font-medium text-gray-900 text-left"
                  >
                    Additional expense
                  </th>
                  {visibleTiers.map((tier, index) => (
                    <PricingFeatureCell
                      key={`${tier.title}-extra-expense`}
                      value={`$${(tier.pricePerAdditionalExpense / 100).toFixed(
                        2
                      )}`}
                      isPopular={index === 1}
                      isHovered={hoveredTier === tier.title}
                      onHover={setHoveredTier}
                      tier={tier}
                    />
                  ))}
                </tr>

                {/* Crowdfunding Fee */}
                {/* <tr>
                  <th
                    scope="row"
                    className="px-6 py-4 text-sm font-medium text-gray-900 text-left"
                  >
                    Crowdfunding fee
                  </th>
                  {visibleTiers.map((tier, index) => (
                    <PricingFeatureCell
                      key={`${tier.title}-fee`}
                      value={formatPercentage(tier.crowdfundingFee)}
                      isPopular={index === 1}
                      isHovered={hoveredTier === tier.title}
                      onHover={setHoveredTier}
                      tier={tier}
                    />
                  ))}
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-sm leading-6 text-gray-500">
            These are proposed models for feedback only. Please{" "}
            <a
              href="#"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              share your thoughts with us
            </a>
            .
          </p>

          <div className="mt-8">
            <Link
              href="/list"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View Data
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
