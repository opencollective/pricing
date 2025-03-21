"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { altTiers, newTiers } from "../../lib/tiers";
import {
  NewTier,
  PricingInterval,
  SelectedPlan,
  TierSet,
  TierType,
} from "../../lib/types/Tier";
import { calculateBestTier } from "../../lib/pricing";

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
type PricingContextType = {
  expenses: number;
  setExpenses: (value: number) => void;
  collectives: number;
  setCollectives: (value: number) => void;
  recommendedTier: NewTier;
  selectedPlan: SelectedPlan;
  setSelectedPlan: React.Dispatch<React.SetStateAction<SelectedPlan>>;
  selectedTierType: TierType;
  setSelectedTierType: (value: TierType) => void;
  tierSet: TierSet;
  setTierSet: (value: TierSet) => void;
  selectedPackagesForEachAltTier: Record<string, AltTierPackage>;
};

const PricingContext = createContext<PricingContextType | null>(null);

// Hook to use the plan context
export function usePricingContext() {
  const context = useContext(PricingContext);
  if (!context) {
    throw new Error("usePricingContext must be used within a PricingProvider");
  }
  return context;
}

export function PricingProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [selectedTierType, setSelectedTierType] = useState<TierType>(
    TierType.BASIC
  );
  const [tierSet, setTierSet] = useState<TierSet>("default");
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan>({
    tier: undefined,
    interval: PricingInterval.MONTHLY,
  });

  // Manage expense and collective state at the provider level
  const [expenses, setExpenses] = useState<number>(25);
  const [collectives, setCollectives] = useState<number>(0);

  // Get the visible tiers
  const tiers = newTiers.filter((t) => t.set === tierSet);

  // Calculate the recommended plan based on the current values
  const recommendedTier = calculateBestTier({
    tiers,
    usage: { expenses, collectives },
  });

  // Update selectedTierType when recommendedPlan type changes
  useEffect(() => {
    if (tierSet === "default" && recommendedTier.type !== selectedTierType) {
      if (recommendedTier.type) setSelectedTierType(recommendedTier.type);
    }
    setSelectedPlan((prev) => ({ ...prev, tier: recommendedTier }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommendedTier, tierSet]);

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
    recommendedTier,
    selectedTierType,
    setSelectedTierType,
    tierSet,
    setTierSet,
    selectedPackagesForEachAltTier,
    selectedPlan,
    setSelectedPlan,
  };

  return (
    <PricingContext.Provider value={contextValue}>
      {children}
    </PricingContext.Provider>
  );
}
