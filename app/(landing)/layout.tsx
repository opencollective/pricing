"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import {
  defaultTiers,
  altTiers,
  featuresForTiers,
  features,
} from "../../lib/tiers";
import { PricingInterval, Tier, TierType } from "../../lib/types/Tier";
import { PricingTierColumn } from "../../components/PricingTierColumn";
import { PricingFeatureCell } from "../../components/PricingFeatureCell";
import Link from "next/link";
import { Check, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateBestTier } from "../../lib/pricing";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import PricingSimulatorConfig from "../../components/PricingSimulatorConfig";
// import TierLevels from "@/components/TierLevels";

// Define a package type for the alternative tiers
type AltTierPackage = {
  title: string;
  pricePerMonth: number;
  includedCollectives: number;
  pricePerAdditionalCollective: number;
  includedExpensesPerMonth: number;
  pricePerAdditionalExpense: number;
};

// Create a context for plan state
export type TierSet = "default" | "alt-display" | "alt-model";

type PlanContextType = {
  expenses: number;
  setExpenses: (value: number) => void;
  collectives: number;
  setCollectives: (value: number) => void;
  recommendedPlan: Tier;
  selectedTierType: TierType;
  setSelectedTierType: (value: TierType) => void;
  tierSet: TierSet;
  setTierSet: (value: TierSet) => void;
  selectedPackagesForEachAltTier: Record<string, AltTierPackage>;
};

const PlanContext = createContext<PlanContextType | null>(null);

// Hook to use the plan context
export function usePlanContext() {
  const context = useContext(PlanContext);
  if (!context) {
    // Return default values instead of throwing
    return {
      expenses: 25,
      setExpenses: () => {},
      collectives: 5,
      setCollectives: () => {},
      recommendedPlan: defaultTiers[1], // remove?
      selectedTierType: TierType.BASIC, // remove?
      setSelectedTierType: () => {},
      tierSet: "default" as TierSet,
      setTierSet: () => {},
      selectedPackagesForEachAltTier: {},
    };
  }
  return context;
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

/**
 * Layout for the landing pages including the main pricing page and collective-specific pages
 */
export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [interval, setInterval] = useState<PricingInterval>(
    PricingInterval.MONTHLY
  );
  const [selectedTierType, setSelectedTierType] = useState<TierType>(
    TierType.BASIC
  );
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);
  const [overviewOpen, setOverviewOpen] = useState(true);
  const [featuresOpen, setFeaturesOpen] = useState(true);
  const [tierSet, setTierSet] = useState<TierSet>("default");

  // Manage expense and collective state at the layout level
  const [expenses, setExpenses] = useState<number>(25);
  const [collectives, setCollectives] = useState<number>(0);

  // Calculate the recommended plan based on the current values
  const recommendedPlan = calculateBestTier(expenses, collectives);

  // Update selectedTierType when recommendedPlan type changes
  useEffect(() => {
    if (recommendedPlan.type !== selectedTierType) {
      setSelectedTierType(recommendedPlan.type);
    }
  }, [recommendedPlan.type]);

  // Get the visible tiers
  const visibleDefaultTiers = defaultTiers.filter(
    (tier) => tier.type === selectedTierType
  );

  // Calculate the best package for each alternative tier based on usage
  const selectedPackagesForEachAltTier = altTiers.reduce<
    Record<string, AltTierPackage>
  >((acc, tier) => {
    // Calculate the total cost for each package in this tier
    const packageCosts = tier.packages.map((pkg) => {
      // Calculate additional expenses cost
      const additionalExpenses = Math.max(
        0,
        expenses - pkg.includedExpensesPerMonth
      );
      const additionalExpensesCost =
        additionalExpenses * pkg.pricePerAdditionalExpense;

      // Calculate additional collectives cost
      const additionalCollectives = Math.max(
        0,
        collectives - pkg.includedCollectives
      );
      const additionalCollectivesCost =
        additionalCollectives * pkg.pricePerAdditionalCollective;

      // Calculate total monthly cost
      const totalMonthlyCost =
        pkg.pricePerMonth + additionalExpensesCost + additionalCollectivesCost;

      return {
        package: pkg,
        totalMonthlyCost,
      };
    });

    // Sort packages by total monthly cost to find the cheapest option
    packageCosts.sort((a, b) => a.totalMonthlyCost - b.totalMonthlyCost);

    // Get the package with the lowest total monthly cost
    const bestPackage = packageCosts[0].package;

    return {
      ...acc,
      [tier.type]: bestPackage,
    };
  }, {});

  // Create context value
  const contextValue = {
    expenses,
    setExpenses,
    collectives,
    setCollectives,
    recommendedPlan,
    selectedTierType,
    setSelectedTierType,
    tierSet,
    setTierSet,
    selectedPackagesForEachAltTier,
  };

  return (
    <PlanContext.Provider value={contextValue}>
      <div className="py-24 sm:py-32">
        <div className="mx-auto px-6 lg:px-8">
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

          {/* This is where the children (PlanFinder or Collective-specific content) will be rendered */}
          {children}
          {/* 
          <div>
            <TierLevels />
          </div> */}
          {/* <div className="mt-2 flex justify-center">
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
                <span className="text-indigo-600 font-medium ml-2">
                  Save 20%
                </span>
              </button>
            </div>
          </div> */}

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
                          setInterval(val as PricingInterval)
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
                    {tierSet === "default"
                      ? visibleDefaultTiers.map((tier) => (
                          <PricingTierColumn
                            key={tier.title}
                            title={tier.title}
                            pricePerMonth={tier.pricePerMonth}
                            includedExpensesPerMonth={
                              tier.includedExpensesPerMonth
                            }
                            pricePerAdditionalExpense={
                              tier.pricePerAdditionalExpense
                            }
                            includedCollectives={tier.includedCollectives}
                            pricePerAdditionalCollective={
                              tier.pricePerAdditionalCollective
                            }
                            interval={interval}
                            isPopular={
                              tier.title === recommendedPlan.title &&
                              tier.type === selectedTierType
                            }
                            isHovered={hoveredTier === tier.title}
                            onHover={setHoveredTier}
                            useage={{ collectives, expenses }}
                          />
                        ))
                      : altTiers.map((tier) => {
                          const data =
                            tierSet === "alt-display"
                              ? selectedPackagesForEachAltTier[tier.type]
                              : {
                                  pricePerMonth:
                                    tier.altPricingModel.basePricePerMonth,
                                  ...tier.altPricingModel,
                                };
                          return (
                            <PricingTierColumn
                              classNames={tier.classNames}
                              buttonClassNames={tier.buttonClassNames}
                              bgColor={tier.bgColor}
                              key={tier.type}
                              {...data}
                              title={tier.type}
                              label={
                                tierSet === "alt-display"
                                  ? selectedPackagesForEachAltTier[tier.type]
                                      .title
                                  : undefined
                              }
                              interval={interval}
                              isPopular={false}
                              isHovered={hoveredTier === tier.type}
                              onHover={setHoveredTier}
                              useage={{ collectives, expenses }}
                            />
                          );
                        })}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-200">
                  {/* Overview Section Header */}
                  <tr>
                    <td
                      colSpan={
                        tierSet === "default"
                          ? visibleDefaultTiers.length + 1
                          : altTiers.length + 1
                      }
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
                    {tierSet === "default"
                      ? visibleDefaultTiers.map((tier) => (
                          <PricingFeatureCell
                            key={`${tier.title}-collectives`}
                            value={tier.includedCollectives}
                            isPopular={
                              tier.title === recommendedPlan.title &&
                              tier.type === selectedTierType
                            }
                            isHovered={hoveredTier === tier.title}
                            onHover={setHoveredTier}
                            onHoverKey={tier.title}
                          />
                        ))
                      : altTiers.map((tier) => {
                          return (
                            <PricingFeatureCell
                              key={`${tier.type}-collectives`}
                              value={
                                tierSet === "alt-display"
                                  ? selectedPackagesForEachAltTier[tier.type]
                                      .includedCollectives
                                  : tier.altPricingModel.includedCollectives
                              }
                              isHovered={hoveredTier === tier.type}
                              onHover={setHoveredTier}
                              onHoverKey={tier.type}
                            />
                          );
                        })}
                  </AnimatedTableRow>

                  {/* Price per Additional Collective */}
                  <AnimatedTableRow show={overviewOpen}>
                    <th
                      scope="row"
                      className="px-6 py-4 text-sm font-medium text-gray-900 text-left w-[250px] max-w-[250px]"
                    >
                      Additional collective
                    </th>
                    {tierSet === "default"
                      ? visibleDefaultTiers.map((tier) => (
                          <PricingFeatureCell
                            key={`${tier.title}-extra-collective`}
                            value={`$${(
                              tier.pricePerAdditionalCollective / 100
                            ).toFixed(2)}`}
                            isPopular={
                              tier.title === recommendedPlan.title &&
                              tier.type === selectedTierType
                            }
                            isHovered={hoveredTier === tier.title}
                            onHover={setHoveredTier}
                            onHoverKey={tier.title}
                          />
                        ))
                      : altTiers.map((tier) => {
                          const { pricePerAdditionalCollective } =
                            tierSet === "alt-display"
                              ? selectedPackagesForEachAltTier[tier.type]
                              : tier.altPricingModel;
                          return (
                            <PricingFeatureCell
                              key={`${tier.type}-extra-collective`}
                              value={`$${(
                                pricePerAdditionalCollective / 100
                              ).toFixed(2)}`}
                              isHovered={hoveredTier === tier.type}
                              onHover={setHoveredTier}
                              onHoverKey={tier.type}
                            />
                          );
                        })}
                  </AnimatedTableRow>

                  {/* Included Expenses */}
                  <AnimatedTableRow show={overviewOpen}>
                    <th
                      scope="row"
                      className="px-6 py-4 text-sm font-medium text-gray-900 text-left w-[250px] max-w-[250px]"
                    >
                      Monthly expenses
                    </th>
                    {tierSet === "default"
                      ? visibleDefaultTiers.map((tier) => (
                          <PricingFeatureCell
                            key={`${tier.title}-expenses`}
                            value={tier.includedExpensesPerMonth}
                            isPopular={
                              tier.title === recommendedPlan.title &&
                              tier.type === selectedTierType
                            }
                            isHovered={hoveredTier === tier.title}
                            onHover={setHoveredTier}
                            onHoverKey={tier.title}
                          />
                        ))
                      : altTiers.map((tier) => {
                          return (
                            <PricingFeatureCell
                              key={`${tier.type}-expenses`}
                              value={
                                (tierSet === "alt-display"
                                  ? selectedPackagesForEachAltTier[tier.type]
                                  : tier.altPricingModel
                                ).includedExpensesPerMonth
                              }
                              isHovered={hoveredTier === tier.type}
                              onHover={setHoveredTier}
                              onHoverKey={tier.type}
                            />
                          );
                        })}
                  </AnimatedTableRow>

                  {/* Price per Additional Expense */}
                  <AnimatedTableRow show={overviewOpen}>
                    <th
                      scope="row"
                      className="px-6 py-4 text-sm font-medium text-gray-900 text-left w-[250px] max-w-[250px]"
                    >
                      Additional expense
                    </th>
                    {tierSet === "default"
                      ? visibleDefaultTiers.map((tier) => (
                          <PricingFeatureCell
                            key={`${tier.title}-extra-expense`}
                            value={`$${(
                              tier.pricePerAdditionalExpense / 100
                            ).toFixed(2)}`}
                            isPopular={
                              tier.title === recommendedPlan.title &&
                              tier.type === selectedTierType
                            }
                            isHovered={hoveredTier === tier.title}
                            onHover={setHoveredTier}
                            onHoverKey={tier.title}
                          />
                        ))
                      : altTiers.map((tier) => {
                          return (
                            <PricingFeatureCell
                              key={`${tier.type}-extra-expense`}
                              value={`$${(
                                (tierSet === "alt-display"
                                  ? selectedPackagesForEachAltTier[tier.type]
                                  : tier.altPricingModel
                                ).pricePerAdditionalExpense / 100
                              ).toFixed(2)}`}
                              isHovered={hoveredTier === tier.type}
                              onHover={setHoveredTier}
                              onHoverKey={tier.type}
                            />
                          );
                        })}
                  </AnimatedTableRow>

                  {/* Features Section Header */}
                  <tr>
                    <td
                      colSpan={
                        tierSet === "default"
                          ? visibleDefaultTiers.length + 1
                          : altTiers.length + 1
                      }
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
                      {tierSet === "default"
                        ? visibleDefaultTiers.map((tier) => (
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
                              isPopular={
                                tier.title === recommendedPlan.title &&
                                tier.type === selectedTierType
                              }
                              isHovered={hoveredTier === tier.title}
                              onHover={setHoveredTier}
                              onHoverKey={tier.title}
                            />
                          ))
                        : altTiers.map((tier) => {
                            return (
                              <PricingFeatureCell
                                key={`${tier.type}-${feature}`}
                                value={
                                  featuresForTiers[tier.type] &&
                                  featuresForTiers[tier.type][feature] ? (
                                    <div
                                      className={`rounded-full flex justify-center items-center size-3.5 ${tier.buttonClassNames} justify-self-center`}
                                    >
                                      <Check strokeWidth={3} size={10} />
                                    </div>
                                  ) : (
                                    <div className="rounded-full flex justify-center items-center size-3.5 bg-gray-200 text-gray-400 justify-self-center">
                                      <X strokeWidth={3} size={10} />
                                    </div>
                                  )
                                }
                                isHovered={hoveredTier === tier.type}
                                onHover={setHoveredTier}
                                onHoverKey={tier.type}
                              />
                            );
                          })}
                    </AnimatedTableRow>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

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

            <div className="mt-8">
              <Link
                href="/list"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Data
              </Link>
            </div>
          </div>
        </div>
      </div>
      <PricingSimulatorConfig />
    </PlanContext.Provider>
  );
}
