"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";
import { defaultTiers } from "@/lib/tiers";
import { usePricingContext } from "@/app/providers/PricingProvider";

export function PlanFinder() {
  const { expenses, collectives, setExpenses, setCollectives } =
    usePricingContext();
  const expensesValues = [
    0,
    ...defaultTiers.map((tier) => tier.includedExpensesPerMonth),
    50000,
  ];
  const collectivesValues = [
    0,
    ...defaultTiers.map((tier) => tier.includedCollectives),
    5000,
  ];

  // Find the closest index in the predefined values array
  const findClosestValueIndex = (
    value: number,
    valuesArray: number[]
  ): number => {
    let closestIndex = 0;
    let minDiff = Math.abs(valuesArray[0] - value);

    for (let i = 1; i < valuesArray.length; i++) {
      const diff = Math.abs(valuesArray[i] - value);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }

    return closestIndex;
  };

  // Convert actual value to slider index
  const expensesIndex = findClosestValueIndex(expenses, expensesValues);
  const collectivesIndex = findClosestValueIndex(
    collectives,
    collectivesValues
  );

  // Use either controlled or internal setters
  const handleExpensesChange = (index: number) => {
    const value = expensesValues[index];
    setExpenses(value);
  };

  const handleCollectivesChange = (index: number) => {
    const value = collectivesValues[index];
    setCollectives(value);
  };

  return (
    <div className="">
      <div className="space-y-8">
        <div>
          <div className="flex justify-between mb-2">
            <label htmlFor="expenses-slider" className="font-medium">
              How many expenses per month will you pay?
            </label>
            <span className="text-gray-600">{expenses} expenses per month</span>
          </div>
          <div className="relative pt-2 pb-8">
            <Slider
              id="expenses-slider"
              defaultValue={[expensesIndex]}
              value={[expensesIndex]}
              min={0}
              max={expensesValues.length - 1}
              step={1}
              onValueChange={(values) => handleExpensesChange(values[0])}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label htmlFor="collectives-slider" className="font-medium ">
              Will you host other collectives?
            </label>
            <span className="text-gray-600">
              {collectives} hosted collectives
            </span>
          </div>
          <div className="relative pt-2 pb-8">
            <Slider
              id="collectives-slider"
              defaultValue={[collectivesIndex]}
              value={[collectivesIndex]}
              min={0}
              max={collectivesValues.length - 1}
              step={1}
              onValueChange={(values) => handleCollectivesChange(values[0])}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
