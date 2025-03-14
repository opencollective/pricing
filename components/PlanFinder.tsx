"use client";

import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { TierType } from "@/lib/types/Tier";
import { defaultTiers } from "@/lib/tiers";

type PlanFinderProps = {
  onExpensesChange?: (value: number) => void;
  onCollectivesChange?: (value: number) => void;
  initialExpenses?: number;
  initialCollectives?: number;
  expenses?: number;
  collectives?: number;
  setExpenses?: (value: number) => void;
  setCollectives?: (value: number) => void;
  selectedTierType?: TierType;
};

export function PlanFinder({
  onExpensesChange,
  onCollectivesChange,
  initialExpenses = 25,
  initialCollectives = 5,
  expenses: controlledExpenses,
  collectives: controlledCollectives,
  setExpenses: controlledSetExpenses,
  setCollectives: controlledSetCollectives,
}: PlanFinderProps) {
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
  // Use internal state only if not controlled by parent
  const [internalExpenses, setInternalExpenses] =
    useState<number>(initialExpenses);
  const [internalCollectives, setInternalCollectives] =
    useState<number>(initialCollectives);

  // Use either controlled or internal values
  const expenses =
    controlledExpenses !== undefined ? controlledExpenses : internalExpenses;
  const collectives =
    controlledCollectives !== undefined
      ? controlledCollectives
      : internalCollectives;

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
    if (controlledSetExpenses) {
      controlledSetExpenses(value);
    } else {
      setInternalExpenses(value);
    }
    if (onExpensesChange) onExpensesChange(value);
  };

  const handleCollectivesChange = (index: number) => {
    const value = collectivesValues[index];
    if (controlledSetCollectives) {
      controlledSetCollectives(value);
    } else {
      setInternalCollectives(value);
    }
    if (onCollectivesChange) onCollectivesChange(value);
  };

  return (
    <div className="mt-12 px-6 py-10 max-w-3xl mx-auto">
      <div className="space-y-8">
        <div>
          <div className="flex justify-between mb-2">
            <label
              htmlFor="expenses-slider"
              className="font-medium text-gray-700"
            >
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
            <label
              htmlFor="collectives-slider"
              className="font-medium text-gray-700"
            >
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
