"use client";

import React, { useState } from "react";
import { newTiers, features } from "../../lib/tiers";
import { PricingInterval, TierType } from "../../lib/types/Tier";
import { PricingTierColumn } from "../../components/PricingTierColumn";
import { PricingFeatureCell } from "../../components/PricingFeatureCell";
import Link from "next/link";
import { Check, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import PricingSimulatorConfig from "../../components/PricingSimulatorConfig";
import { PlanFinder } from "@/components/PlanFinder";
import { usePricingContext } from "../providers/PricingProvider";

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

/**
 * Layout for the landing pages including the main pricing page and collective-specific pages
 */
export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    tierSet,
    selectedTierType,
    setSelectedTierType,
    selectedPlan,
    setSelectedPlan,
    recommendedTier,
  } = usePricingContext();
  console.log({ selectedPlan, recommendedTier });
  const { interval } = selectedPlan;

  const [hoveredTier, setHoveredTier] = useState<string | null>(null);
  const [overviewOpen, setOverviewOpen] = useState(true);
  const [featuresOpen, setFeaturesOpen] = useState(true);
  // Get the visible tiers
  const tiers = newTiers.filter((t) => t.set === tierSet);
  const visibleTiers =
    tierSet === "default"
      ? tiers.filter((tier) => tier.type === selectedTierType)
      : tiers;

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Left pane with scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-8 pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-base font-semibold leading-7 text-primary">
              Pricing Simulator
            </h1>
            <p className="mt-2 text-4xl font-bold text-balance tracking-tight text-gray-900 sm:text-5xl">
              Help Us Shape Our New Pricing Model
            </p>
            <p className="mt-6 text-balance text-lg leading-8 text-gray-600">
              We&apos;re exploring a new business model to ensure long-term
              sustainability. Your feedback on these pricing options is needed
              as we work together to create a fair and transparent funding
              model.
            </p>
          </div>

          <div className="py-0">
            <PlanFinder />
            {tierSet === "default" && (
              <div className="mt-6 flex flex-col items-center">
                <p className="text-sm text-gray-600 mb-2">
                  Select a tier level to view available plans:
                </p>
                {/* Tier Type Selector */}
                <div className="relative flex items-center rounded-full p-1 bg-gray-100 mb-4">
                  <button
                    type="button"
                    className={`${
                      selectedTierType === TierType.FREE
                        ? "bg-white shadow-md"
                        : "text-gray-500"
                    } relative rounded-full py-2 px-6 text-sm font-medium whitespace-nowrap focus:outline-none transition-all duration-200 ease-in-out`}
                    onClick={() => setSelectedTierType(TierType.FREE)}
                  >
                    Starter
                  </button>
                  <button
                    type="button"
                    className={`${
                      selectedTierType === TierType.BASIC
                        ? "bg-white shadow-md"
                        : "text-gray-500"
                    } relative rounded-full py-2 px-6 text-sm font-medium whitespace-nowrap focus:outline-none transition-all duration-200 ease-in-out`}
                    onClick={() => setSelectedTierType(TierType.BASIC)}
                  >
                    Basic
                  </button>
                  <button
                    type="button"
                    className={`${
                      selectedTierType === TierType.PRO
                        ? "bg-white shadow-md"
                        : "text-gray-500"
                    } relative rounded-full py-2 px-6 text-sm font-medium whitespace-nowrap focus:outline-none transition-all duration-200 ease-in-out`}
                    onClick={() => setSelectedTierType(TierType.PRO)}
                  >
                    Pro
                  </button>
                </div>
              </div>
            )}
            <RadioGroup
              onValueChange={(tierTitle) =>
                setSelectedPlan((prev) => ({
                  ...prev,
                  tier: tiers.find((tier) => tier.title === tierTitle),
                }))
              }
              value={selectedPlan.tier?.title}
            >
              <div className="mx-auto mt-8 max-w-7xl">
                {/* Pricing Comparison Table */}
                <div className="overflow-x-auto rounded-xl ">
                  <table className="w-full border-collapse pt-2">
                    {/* Table Header */}
                    <thead>
                      <tr className="pt-2">
                        {/* Empty first cell */}
                        <th className="pt-6 pb-8 text-left font-normal flex flex-col items-start ">
                          <h2 className="text-2xl font-semibold mb-2">
                            Pick your plan
                          </h2>
                          <RadioGroup
                            value={interval}
                            onValueChange={(val) =>
                              setSelectedPlan((prev) => ({
                                ...prev,
                                interval: val as PricingInterval,
                              }))
                            }
                            defaultValue={PricingInterval.MONTHLY}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={PricingInterval.MONTHLY}
                                id={PricingInterval.MONTHLY}
                              />
                              <label htmlFor={PricingInterval.MONTHLY}>
                                Monthly billing
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={PricingInterval.YEARLY}
                                id={PricingInterval.YEARLY}
                              />
                              <label htmlFor={PricingInterval.YEARLY}>
                                <span className="whitespace-nowrap">
                                  Yearly billing{" "}
                                  <Badge variant="outline" className="ml-2">
                                    Save 20%
                                  </Badge>
                                </span>
                              </label>
                            </div>
                          </RadioGroup>
                        </th>
                        {/* Tier Headers using PricingTierColumn component */}

                        {visibleTiers.map((tier) => (
                          <PricingTierColumn
                            key={`${tier.title}-${tier.set}`}
                            tier={tier}
                            interval={interval}
                            isRecommended={
                              tierSet === "default"
                                ? recommendedTier.title === tier.title
                                : false
                            }
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
                          className="px-6 py-4 text-sm font-medium text-gray-900 text-left w-[250px] max-w-[250px]"
                        >
                          Included Collectives
                        </th>
                        {visibleTiers.map((tier) => (
                          <PricingFeatureCell
                            key={`${tier.title}-collectives`}
                            value={tier.pricingModel.includedCollectives}
                            isHovered={hoveredTier === tier.title}
                            onHover={setHoveredTier}
                            onHoverKey={tier.title}
                          />
                        ))}
                      </AnimatedTableRow>

                      {/* Price per Additional Collective */}
                      <AnimatedTableRow show={overviewOpen}>
                        <th
                          scope="row"
                          className="px-6 py-4 text-sm font-medium text-gray-900 text-left w-[250px] max-w-[250px]"
                        >
                          Additional collective
                        </th>
                        {visibleTiers.map((tier) => (
                          <PricingFeatureCell
                            key={`${tier.title}-extra-collective`}
                            value={`$${(
                              tier.pricingModel.pricePerAdditionalCollective /
                              100
                            ).toFixed(2)}`}
                            isHovered={hoveredTier === tier.title}
                            onHover={setHoveredTier}
                            onHoverKey={tier.title}
                          />
                        ))}
                      </AnimatedTableRow>

                      {/* Included Expenses */}
                      <AnimatedTableRow show={overviewOpen}>
                        <th
                          scope="row"
                          className="px-6 py-4 text-sm font-medium text-gray-900 text-left w-[250px] max-w-[250px]"
                        >
                          Monthly expenses
                        </th>
                        {visibleTiers.map((tier) => (
                          <PricingFeatureCell
                            key={`${tier.title}-expenses`}
                            value={tier.pricingModel.includedExpensesPerMonth}
                            isPopular={
                              tier.title === "Basic" &&
                              tier.type === selectedTierType
                            }
                            isHovered={hoveredTier === tier.title}
                            onHover={setHoveredTier}
                            onHoverKey={tier.title}
                          />
                        ))}
                      </AnimatedTableRow>

                      {/* Price per Additional Expense */}
                      <AnimatedTableRow show={overviewOpen}>
                        <th
                          scope="row"
                          className="px-6 py-4 text-sm font-medium text-gray-900 text-left w-[250px] max-w-[250px]"
                        >
                          Additional expense
                        </th>
                        {visibleTiers.map((tier) => (
                          <PricingFeatureCell
                            key={`${tier.title}-extra-expense`}
                            value={`$${(
                              tier.pricingModel.pricePerAdditionalExpense / 100
                            ).toFixed(2)}`}
                            isHovered={hoveredTier === tier.title}
                            onHover={setHoveredTier}
                            onHoverKey={tier.title}
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
                            className="px-6 py-4 text-sm font-medium text-gray-900 text-left w-[250px] max-w-[250px]"
                          >
                            {feature}
                          </th>
                          {visibleTiers.map((tier) => (
                            <PricingFeatureCell
                              key={`${tier.set}-${tier.title}-${feature}`}
                              value={
                                tier.features[feature] ? (
                                  <div className="rounded-full flex justify-center items-center size-3.5 bg-primary text-white justify-self-center">
                                    <Check strokeWidth={3} size={10} />
                                  </div>
                                ) : (
                                  <div className="rounded-full flex justify-center items-center size-3.5 bg-gray-200 text-gray-400 justify-self-center">
                                    <X strokeWidth={3} size={10} />
                                  </div>
                                )
                              }
                              isPopular={
                                tier.title === "Basic" &&
                                tier.type === selectedTierType
                              }
                              isHovered={hoveredTier === tier.title}
                              onHover={setHoveredTier}
                              onHoverKey={tier.title}
                            />
                          ))}
                        </AnimatedTableRow>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </RadioGroup>

            <div className="mt-20 text-center">
              <p className="text-sm leading-6 text-gray-500">
                These are proposed models for feedback only. Please{" "}
                <a
                  href="#"
                  className="font-semibold text-primary-600 hover:text-primary/80"
                >
                  share your thoughts with us
                </a>
                .
              </p>

              <div className="mt-8 mb-12">
                <Link
                  href="/list"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Data
                </Link>
              </div>
            </div>
          </div>
          <PricingSimulatorConfig />
        </div>

        {/* Right pane with children content */}
        <div className="w-1/3 overflow-y-auto border-l border-gray-200 p-8">
          {children}
        </div>
      </div>
    </>
  );
}
