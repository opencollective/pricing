"use client";

import React, { useState, useEffect } from "react";
import { tiers, featuresForTiers, features } from "../lib/tiers";
import { PricingInterval, TierType } from "../lib/types/Tier";
import { PricingTierColumn } from "./PricingTierColumn";
import { PricingFeatureCell } from "./PricingFeatureCell";
import Link from "next/link";
import { Check, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";

// Function to calculate the best tier based on usage
function calculateBestTier(expenses: number, collectives: number): string {
  if (collectives <= 1 && expenses <= 5) {
    return "Free";
  } else if (collectives <= 5 && expenses <= 25) {
    return "Basic S";
  } else if (collectives <= 10 && expenses <= 50) {
    return "Basic M";
  } else if (collectives <= 25 && expenses <= 100) {
    return "Basic L";
  } else if (collectives <= 50 && expenses <= 150) {
    return "Basic XL";
  } else {
    return "Pro";
  }
}

// Animated table row component using Framer Motion
function AnimatedTableRow({
  show,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.tr
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        >
          {children}
        </motion.tr>
      )}
    </AnimatePresence>
  );
}

export function PricingSection() {
  const [interval, setInterval] = useState<PricingInterval>(
    PricingInterval.MONTHLY
  );
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);
  const [overviewOpen, setOverviewOpen] = useState(true);
  const [featuresOpen, setFeaturesOpen] = useState(true);
  const [expenses, setExpenses] = useState<number>(25);
  const [collectives, setCollectives] = useState<number>(5);
  const [recommendedPlan, setRecommendedPlan] = useState<string>(
    calculateBestTier(25, 5)
  );

  // Get the visible tiers
  const visibleTiers = tiers.filter((t) => t.type !== TierType.PRO);

  // Format percentage
  // const formatPercentage = (decimal: number) => {
  //   return `${(decimal * 100).toFixed(0)}%`;
  // };

  // Find the recommended plan based on usage
  useEffect(() => {
    setRecommendedPlan(calculateBestTier(expenses, collectives));
  }, [expenses, collectives]);

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

        {/* Plan Recommender */}
        <div className="mt-12 px-6 py-10 max-w-3xl mx-auto">
          {/* <h3 className="text-lg font-medium text-gray-900 mb-6">
            Find Your Ideal Plan
          </h3> */}
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <label
                  htmlFor="expenses-slider"
                  className="text-sm font-medium text-gray-700"
                >
                  Monthly Expenses
                </label>
              </div>
              <div className="relative pt-2 pb-8">
                <Slider
                  id="expenses-slider"
                  defaultValue={[expenses]}
                  value={[expenses]}
                  label={"expenses"}
                  min={1}
                  max={200}
                  step={5}
                  onValueChange={(values) => setExpenses(values[0])}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label
                  htmlFor="collectives-slider"
                  className="text-sm font-medium text-gray-700"
                >
                  Hosted Collectives
                </label>
              </div>
              <div className="relative pt-2 pb-8">
                <Slider
                  id="collectives-slider"
                  defaultValue={[collectives]}
                  value={[collectives]}
                  label={"collectives"}
                  min={1}
                  max={60}
                  step={1}
                  onValueChange={(values) => setCollectives(values[0])}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
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

        <div className="mx-auto mt-8 max-w-6xl">
          {/* Pricing Comparison Table */}
          <div className="overflow-x-auto rounded-xl ">
            <table className="w-full border-collapse pt-2">
              {/* Table Header */}
              <thead>
                <tr className="pt-2">
                  {/* Empty first cell */}
                  <th className="px-6 pt-6 pb-8"></th>

                  {/* Tier Headers using PricingTierColumn component */}
                  {visibleTiers.map((tier) => (
                    <PricingTierColumn
                      key={tier.title}
                      tier={tier}
                      interval={interval}
                      isPopular={tier.title === recommendedPlan}
                      isHovered={hoveredTier === tier.title}
                      onHover={setHoveredTier}
                    />
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-200">
                {/* Overview Section Header */}
                <tr>
                  <td
                    colSpan={visibleTiers.length + 1}
                    className="px-6 pb-4 pt-2 text-sm"
                  >
                    <button
                      onClick={() => setOverviewOpen(!overviewOpen)}
                      className="flex items-center justify-between w-full"
                    >
                      <span className="font-medium">Overview</span>
                      <motion.span
                        animate={{ rotate: overviewOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.span>
                    </button>
                  </td>
                </tr>

                {/* Included Collectives */}
                <AnimatedTableRow show={overviewOpen}>
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
                </AnimatedTableRow>

                {/* Price per Additional Collective */}
                <AnimatedTableRow show={overviewOpen}>
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
                </AnimatedTableRow>

                {/* Included Expenses */}
                <AnimatedTableRow show={overviewOpen}>
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
                </AnimatedTableRow>

                {/* Price per Additional Expense */}
                <AnimatedTableRow show={overviewOpen}>
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
                </AnimatedTableRow>

                {/* Features Section Header */}
                <tr>
                  <td
                    colSpan={visibleTiers.length + 1}
                    className="px-6 pb-4 pt-2 text-sm"
                  >
                    <button
                      onClick={() => setFeaturesOpen(!featuresOpen)}
                      className="flex items-center justify-between w-full"
                    >
                      <span className="font-medium">Features</span>
                      <motion.span
                        animate={{ rotate: featuresOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.span>
                    </button>
                  </td>
                </tr>

                {/* Features */}
                {Object.values(features).map((feature) => (
                  <AnimatedTableRow key={feature} show={featuresOpen}>
                    <th
                      scope="row"
                      className="px-6 py-4 text-sm font-medium text-gray-900 text-left"
                    >
                      {feature}
                    </th>
                    {visibleTiers.map((tier, index) => (
                      <PricingFeatureCell
                        key={`${tier.title}-${feature}`}
                        value={
                          featuresForTiers[tier.type][feature] ? (
                            <div className="rounded-full flex justify-center items-center size-3.5 bg-primary text-white justify-self-center">
                              <Check strokeWidth={3} size={10} />
                            </div>
                          ) : (
                            <div className="rounded-full flex justify-center items-center size-3.5 bg-gray-200 text-gray-400 justify-self-center">
                              <X strokeWidth={3} size={10} />
                            </div>
                          )
                        }
                        tier={tier}
                        onHover={setHoveredTier}
                        isPopular={index === 1}
                        isHovered={hoveredTier === tier.title}
                      />
                    ))}
                  </AnimatedTableRow>
                ))}

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
