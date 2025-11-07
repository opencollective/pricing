"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { newTiers } from "../../lib/tiers";
import {
  NewTier,
  PricingInterval,
  SelectedPlan,
  TierSet,
  TierType,
} from "../../lib/types/Tier";
import { calculateBestTier } from "../../lib/pricing";

// Create a context for plan state
type PricingContextType = {
  expenses: number;
  setExpenses: (value: number) => void;
  collectives: number;
  setCollectives: (value: number) => void;
  automatedPayouts: boolean;
  setAutomatedPayouts: (value: boolean) => void;
  taxForms: boolean;
  setTaxForms: (value: boolean) => void;
  recommendedTier: NewTier;
  selectedPlan: SelectedPlan;
  setSelectedPlan: React.Dispatch<React.SetStateAction<SelectedPlan>>;
  selectedTierType: TierType;
  setSelectedTierType: (value: TierType) => void;
  tierSet: TierSet;
  setTierSet: (value: TierSet) => void;
  showTotalPrice: boolean;
  setShowTotalPrice: (val: boolean) => void;
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
  const [showTotalPrice, setShowTotalPrice] = useState<boolean>(false);

  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan>({
    tier: undefined,
    interval: PricingInterval.MONTHLY,
  });

  // Manage expense and collective state at the provider level
  const [expenses, setExpenses] = useState<number>(25);
  const [collectives, setCollectives] = useState<number>(0);
  const [automatedPayouts, setAutomatedPayouts] = useState<boolean>(false);
  const [taxForms, setTaxForms] = useState<boolean>(false);

  // Get the visible tiers - filter by tier set AND tier type
  const tiers = newTiers.filter((t) => t.set === tierSet);

  // Filter tiers to only the selected tier type for recommendation
  const tiersForRecommendation =
    tierSet === "default"
      ? tiers.filter((t) => t.type === selectedTierType)
      : tiers;

  // Calculate the recommended plan ONLY within the selected tier type
  const { tier: recommendedTier } = calculateBestTier({
    tiers: tiersForRecommendation,
    usage: { expenses, collectives, automatedPayouts, taxForms },
  });

  // Update selectedPlan when recommendedTier changes, but don't change selectedTierType
  useEffect(() => {
    setSelectedPlan((prev) => ({ ...prev, tier: recommendedTier }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommendedTier, tierSet]);

  // Create context value
  const contextValue = {
    expenses,
    setExpenses,
    collectives,
    setCollectives,
    automatedPayouts,
    setAutomatedPayouts,
    taxForms,
    setTaxForms,
    recommendedTier,
    selectedTierType,
    setSelectedTierType,
    tierSet,
    setTierSet,
    selectedPlan,
    setSelectedPlan,
    showTotalPrice,
    setShowTotalPrice,
  };

  return (
    <PricingContext.Provider value={contextValue}>
      {children}
    </PricingContext.Provider>
  );
}
