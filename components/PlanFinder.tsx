"use client";

import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";

type PlanFinderProps = {
  onExpensesChange?: (value: number) => void;
  onCollectivesChange?: (value: number) => void;
  initialExpenses?: number;
  initialCollectives?: number;
  expenses?: number;
  collectives?: number;
  setExpenses?: (value: number) => void;
  setCollectives?: (value: number) => void;
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

  // Use either controlled or internal setters
  const handleExpensesChange = (value: number) => {
    if (controlledSetExpenses) {
      controlledSetExpenses(value);
    } else {
      setInternalExpenses(value);
    }
    if (onExpensesChange) onExpensesChange(value);
  };

  const handleCollectivesChange = (value: number) => {
    if (controlledSetCollectives) {
      controlledSetCollectives(value);
    } else {
      setInternalCollectives(value);
    }
    if (onCollectivesChange) onCollectivesChange(value);
  };

  // Calculate recommended plan

  return (
    <div className="mt-12 px-6 py-10 max-w-3xl mx-auto">
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
              onValueChange={(values) => handleExpensesChange(values[0])}
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
              onValueChange={(values) => handleCollectivesChange(values[0])}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
